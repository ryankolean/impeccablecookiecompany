import { useState, FormEvent } from 'react';
import { Send } from 'lucide-react';

// Sign up free at https://web3forms.com to get your access key.
// Paste it here or set it as VITE_WEB3FORMS_KEY in your environment.
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY ?? 'YOUR_WEB3FORMS_ACCESS_KEY';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    chocolateChipQuantity: '',
    snickerdoodleQuantity: '',
    preferredCommunication: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [errors, setErrors] = useState<{
    name: boolean;
    email: boolean;
    phone: boolean;
    preferredCommunication: boolean;
    flavors: boolean;
  }>({
    name: false,
    email: false,
    phone: false,
    preferredCommunication: false,
    flavors: false,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitStatus({ type: null, message: '' });

    const newErrors = {
      name: !formData.name.trim(),
      email: !formData.email.trim(),
      phone: !formData.phone.trim(),
      preferredCommunication: !formData.preferredCommunication,
      flavors: !formData.chocolateChipQuantity && !formData.snickerdoodleQuantity,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error)) {
      setSubmitStatus({
        type: 'error',
        message: 'Please fill in all required fields.',
      });
      return;
    }

    setIsSubmitting(true);

    const selectedFlavors = [];
    if (formData.chocolateChipQuantity) {
      selectedFlavors.push(`Chocolate Chip (${formData.chocolateChipQuantity})`);
    }
    if (formData.snickerdoodleQuantity) {
      selectedFlavors.push(`Snickerdoodle (${formData.snickerdoodleQuantity})`);
    }

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `New Cookie Order from ${formData.name}`,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          order: selectedFlavors.join(', '),
          preferred_communication: formData.preferredCommunication,
          notes: formData.notes || '—',
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message ?? 'Submission failed');
      }

      setSubmitStatus({
        type: 'success',
        message: 'Thank you for your order! We have received your request and will contact you shortly via your preferred communication method.',
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        chocolateChipQuantity: '',
        snickerdoodleQuantity: '',
        preferredCommunication: '',
        notes: '',
      });
      setErrors({
        name: false,
        email: false,
        phone: false,
        preferredCommunication: false,
        flavors: false,
      });

      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Sorry, something went wrong. Please try again or contact us directly.',
      });
      console.error('Error submitting order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-light text-[#3D2B1F] mb-4 tracking-tight">
              Place Your Order
            </h2>
            <p className="text-lg text-[#8B7355] font-light">
              Share your preferences and we'll be in touch to finalize your order
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-[#F5F2ED] p-8 md:p-12 rounded-2xl shadow-xl">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-[#3D2B1F] mb-2 font-light">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name && e.target.value.trim()) {
                      setErrors({ ...errors, name: false });
                    }
                  }}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.name
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                      : 'border-[#8B7355]/30 focus:border-[#8B7355] focus:ring-[#8B7355]/20'
                  } focus:ring-2 outline-none transition-all duration-300 bg-white`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">Name is required</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-[#3D2B1F] mb-2 font-light">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email && e.target.value.trim()) {
                      setErrors({ ...errors, email: false });
                    }
                  }}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.email
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                      : 'border-[#8B7355]/30 focus:border-[#8B7355] focus:ring-[#8B7355]/20'
                  } focus:ring-2 outline-none transition-all duration-300 bg-white`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">Email is required</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-[#3D2B1F] mb-2 font-light">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                  if (errors.phone && e.target.value.trim()) {
                    setErrors({ ...errors, phone: false });
                  }
                }}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.phone
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                    : 'border-[#8B7355]/30 focus:border-[#8B7355] focus:ring-[#8B7355]/20'
                } focus:ring-2 outline-none transition-all duration-300 bg-white`}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">Phone number is required</p>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="chocolateChipQuantity" className="block text-[#3D2B1F] mb-2 font-light">
                  Chocolate Chip
                </label>
                <select
                  id="chocolateChipQuantity"
                  value={formData.chocolateChipQuantity}
                  onChange={(e) => {
                    setFormData({ ...formData, chocolateChipQuantity: e.target.value });
                    if (errors.flavors && (e.target.value || formData.snickerdoodleQuantity)) {
                      setErrors({ ...errors, flavors: false });
                    }
                  }}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.flavors
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                      : 'border-[#8B7355]/30 focus:border-[#8B7355] focus:ring-[#8B7355]/20'
                  } focus:ring-2 outline-none transition-all duration-300 bg-white`}
                >
                  <option value="">Select quantity</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="6+">6+</option>
                  <option value="12">12</option>
                  <option value="24">24</option>
                  <option value="Bulk Order">Bulk Order</option>
                </select>
              </div>

              <div>
                <label htmlFor="snickerdoodleQuantity" className="block text-[#3D2B1F] mb-2 font-light">
                  Snickerdoodle
                </label>
                <select
                  id="snickerdoodleQuantity"
                  value={formData.snickerdoodleQuantity}
                  onChange={(e) => {
                    setFormData({ ...formData, snickerdoodleQuantity: e.target.value });
                    if (errors.flavors && (e.target.value || formData.chocolateChipQuantity)) {
                      setErrors({ ...errors, flavors: false });
                    }
                  }}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.flavors
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                      : 'border-[#8B7355]/30 focus:border-[#8B7355] focus:ring-[#8B7355]/20'
                  } focus:ring-2 outline-none transition-all duration-300 bg-white`}
                >
                  <option value="">Select quantity</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="6+">6+</option>
                  <option value="12">12</option>
                  <option value="24">24</option>
                  <option value="Bulk Order">Bulk Order</option>
                </select>
              </div>
              {errors.flavors && (
                <p className="text-sm text-red-600">Please select at least one cookie flavor</p>
              )}
            </div>

            <div>
              <label className="block text-[#3D2B1F] mb-3 font-light">Preferred Communication Method *</label>
              <div className={`space-y-3 ${errors.preferredCommunication ? 'p-3 border-2 border-red-500 rounded-lg' : ''}`}>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="communication"
                    value="email"
                    checked={formData.preferredCommunication === 'email'}
                    onChange={(e) => {
                      setFormData({ ...formData, preferredCommunication: e.target.value });
                      if (errors.preferredCommunication) {
                        setErrors({ ...errors, preferredCommunication: false });
                      }
                    }}
                    className="w-5 h-5 text-[#8B7355] focus:ring-[#8B7355] cursor-pointer"
                  />
                  <span className="text-[#2C2C2C] font-light group-hover:text-[#8B7355] transition-colors">
                    Email
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="communication"
                    value="call_phone"
                    checked={formData.preferredCommunication === 'call_phone'}
                    onChange={(e) => {
                      setFormData({ ...formData, preferredCommunication: e.target.value });
                      if (errors.preferredCommunication) {
                        setErrors({ ...errors, preferredCommunication: false });
                      }
                    }}
                    className="w-5 h-5 text-[#8B7355] focus:ring-[#8B7355] cursor-pointer"
                  />
                  <span className="text-[#2C2C2C] font-light group-hover:text-[#8B7355] transition-colors">
                    Call Phone
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="communication"
                    value="text_phone"
                    checked={formData.preferredCommunication === 'text_phone'}
                    onChange={(e) => {
                      setFormData({ ...formData, preferredCommunication: e.target.value });
                      if (errors.preferredCommunication) {
                        setErrors({ ...errors, preferredCommunication: false });
                      }
                    }}
                    className="w-5 h-5 text-[#8B7355] focus:ring-[#8B7355] cursor-pointer"
                  />
                  <span className="text-[#2C2C2C] font-light group-hover:text-[#8B7355] transition-colors">
                    Text Phone
                  </span>
                </label>
              </div>
              {errors.preferredCommunication && (
                <p className="mt-1 text-sm text-red-600">Please select a preferred communication method</p>
              )}
            </div>

            <div>
              <label htmlFor="notes" className="block text-[#3D2B1F] mb-2 font-light">
                Special Requests or Notes
              </label>
              <textarea
                id="notes"
                rows={4}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-[#8B7355]/30 focus:border-[#8B7355] focus:ring-2 focus:ring-[#8B7355]/20 outline-none transition-all duration-300 bg-white resize-none"
              ></textarea>
            </div>

            {submitStatus.type && (
              <div
                className={`p-6 rounded-lg text-center ${
                  submitStatus.type === 'success'
                    ? 'bg-green-50 text-green-800 border-2 border-green-300 shadow-lg'
                    : 'bg-red-50 text-red-800 border-2 border-red-300'
                }`}
              >
                <p className="text-lg font-medium">{submitStatus.message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#3D2B1F] text-[#F5F2ED] px-8 py-4 rounded-full hover:bg-[#8B7355] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 font-light tracking-wide"
            >
              <span>{isSubmitting ? 'Submitting...' : 'Submit Order Request'}</span>
              {!isSubmitting && <Send size={20} />}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
