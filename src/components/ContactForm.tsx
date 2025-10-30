import { useState, FormEvent } from 'react';
import { Send } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    quantity: '',
    flavors: [] as string[],
    customFlavor: '',
    preferredCommunication: 'email',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const selectedFlavors = formData.flavors.includes('other')
        ? [...formData.flavors.filter(f => f !== 'other'), formData.customFlavor].filter(Boolean)
        : formData.flavors;

      const orderData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        quantity: formData.quantity,
        flavors: selectedFlavors,
        preferred_communication: formData.preferredCommunication,
        notes: formData.notes || null,
      };

      const { error } = await supabase.from('orders').insert([orderData]);

      if (error) throw error;

      setSubmitStatus({
        type: 'success',
        message: 'Thank you for your order! We will contact you shortly.',
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        quantity: '',
        flavors: [],
        customFlavor: '',
        preferredCommunication: 'email',
        notes: '',
      });
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Sorry, something went wrong. Please try again.',
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
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-[#8B7355]/30 focus:border-[#8B7355] focus:ring-2 focus:ring-[#8B7355]/20 outline-none transition-all duration-300 bg-white"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-[#3D2B1F] mb-2 font-light">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-[#8B7355]/30 focus:border-[#8B7355] focus:ring-2 focus:ring-[#8B7355]/20 outline-none transition-all duration-300 bg-white"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block text-[#3D2B1F] mb-2 font-light">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-[#8B7355]/30 focus:border-[#8B7355] focus:ring-2 focus:ring-[#8B7355]/20 outline-none transition-all duration-300 bg-white"
                />
              </div>

              <div>
                <label htmlFor="quantity" className="block text-[#3D2B1F] mb-2 font-light">
                  Quantity Desired
                </label>
                <select
                  id="quantity"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-[#8B7355]/30 focus:border-[#8B7355] focus:ring-2 focus:ring-[#8B7355]/20 outline-none transition-all duration-300 bg-white"
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
            </div>

            <div>
              <label className="block text-[#3D2B1F] mb-3 font-light">Cookie Flavors (Select all that apply)</label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    value="chocolate-chip"
                    checked={formData.flavors.includes('chocolate-chip')}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({
                        ...formData,
                        flavors: e.target.checked
                          ? [...formData.flavors, value]
                          : formData.flavors.filter(f => f !== value)
                      });
                    }}
                    className="w-5 h-5 text-[#8B7355] focus:ring-[#8B7355] cursor-pointer rounded"
                  />
                  <span className="text-[#2C2C2C] font-light group-hover:text-[#8B7355] transition-colors">
                    Chocolate Chip
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    value="snickerdoodle"
                    checked={formData.flavors.includes('snickerdoodle')}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({
                        ...formData,
                        flavors: e.target.checked
                          ? [...formData.flavors, value]
                          : formData.flavors.filter(f => f !== value)
                      });
                    }}
                    className="w-5 h-5 text-[#8B7355] focus:ring-[#8B7355] cursor-pointer rounded"
                  />
                  <span className="text-[#2C2C2C] font-light group-hover:text-[#8B7355] transition-colors">
                    Snickerdoodle
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    value="other"
                    checked={formData.flavors.includes('other')}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({
                        ...formData,
                        flavors: e.target.checked
                          ? [...formData.flavors, value]
                          : formData.flavors.filter(f => f !== value)
                      });
                    }}
                    className="w-5 h-5 text-[#8B7355] focus:ring-[#8B7355] cursor-pointer rounded mt-1"
                  />
                  <div className="flex-1">
                    <span className="text-[#2C2C2C] font-light group-hover:text-[#8B7355] transition-colors">
                      Other
                    </span>
                    {formData.flavors.includes('other') && (
                      <input
                        type="text"
                        placeholder="Please specify..."
                        value={formData.customFlavor}
                        onChange={(e) => setFormData({ ...formData, customFlavor: e.target.value })}
                        className="w-full mt-2 px-4 py-2 rounded-lg border border-[#8B7355]/30 focus:border-[#8B7355] focus:ring-2 focus:ring-[#8B7355]/20 outline-none transition-all duration-300 bg-white"
                      />
                    )}
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-[#3D2B1F] mb-3 font-light">Preferred Communication Method</label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="communication"
                    value="email"
                    checked={formData.preferredCommunication === 'email'}
                    onChange={(e) => setFormData({ ...formData, preferredCommunication: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, preferredCommunication: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, preferredCommunication: e.target.value })}
                    className="w-5 h-5 text-[#8B7355] focus:ring-[#8B7355] cursor-pointer"
                  />
                  <span className="text-[#2C2C2C] font-light group-hover:text-[#8B7355] transition-colors">
                    Text Phone
                  </span>
                </label>
              </div>
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
                className={`p-4 rounded-lg ${
                  submitStatus.type === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {submitStatus.message}
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
