// Subject lift with Apple Vision (macOS 14+), used by scripts/optimize-images.sh:
//
//   swift scripts/lift-subject.swift <original.jpg> <out.png>
//
// Writes every foreground instance Vision finds as one transparent PNG, cropped to the
// subject. Only pixels are copied: no EXIF, GPS or XMP from the camera file.
import CoreImage
import Foundation
import ImageIO
import UniformTypeIdentifiers
import Vision

let args = CommandLine.arguments
guard args.count == 3 else {
  FileHandle.standardError.write("usage: swift lift-subject.swift <original> <out.png>\n".data(using: .utf8)!)
  exit(64)
}
let input = URL(fileURLWithPath: args[1])
let output = URL(fileURLWithPath: args[2])

func fail(_ message: String) -> Never {
  FileHandle.standardError.write("lift-subject: \(message)\n".data(using: .utf8)!)
  exit(1)
}

guard let source = CGImageSourceCreateWithURL(input as CFURL, nil),
      let raw = CGImageSourceCreateImageAtIndex(source, 0, nil) else { fail("cannot read \(input.path)") }

// Vision works on the pixels as stored, so apply the camera orientation first.
let props = CGImageSourceCopyPropertiesAtIndex(source, 0, nil) as? [CFString: Any]
let orientation = (props?[kCGImagePropertyOrientation] as? UInt32).flatMap(CGImagePropertyOrientation.init) ?? .up
let context = CIContext()
let oriented = CIImage(cgImage: raw).oriented(orientation)
guard let upright = context.createCGImage(oriented, from: oriented.extent) else { fail("cannot orient") }

let handler = VNImageRequestHandler(cgImage: upright, options: [:])
let request = VNGenerateForegroundInstanceMaskRequest()
do { try handler.perform([request]) } catch { fail("vision: \(error)") }
guard let result = request.results?.first, !result.allInstances.isEmpty else { fail("no subject found") }

let buffer: CVPixelBuffer
do {
  buffer = try result.generateMaskedImage(ofInstances: result.allInstances, from: handler, croppedToInstancesExtent: true)
} catch { fail("mask: \(error)") }
let lifted = CIImage(cvPixelBuffer: buffer)
guard let image = context.createCGImage(lifted, from: lifted.extent),
      let dest = CGImageDestinationCreateWithURL(output as CFURL, UTType.png.identifier as CFString, 1, nil)
else { fail("cannot write \(output.path)") }
CGImageDestinationAddImage(dest, image, nil)
guard CGImageDestinationFinalize(dest) else { fail("cannot write \(output.path)") }
print("lift-subject: \(result.allInstances.count) instance(s), \(image.width)x\(image.height)")
