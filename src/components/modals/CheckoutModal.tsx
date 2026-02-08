import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { submitPORequest } from '@/features/integrations/formspree/formService';
import { useAlerts } from '@/features/notifications/useAlerts';
import { useCart } from '@/features/cart/useCart';
import type { CartItem } from '@/types/cart';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  totalMonthly: number;
  totalAnnual: number;
}

export function CheckoutModal({ isOpen, onClose, cartItems, totalMonthly, totalAnnual }: CheckoutModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { showSuccess, showError } = useAlerts();
  const { clear } = useCart();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderDetails = cartItems
        .map(
          (item) =>
            `${item.title} (${item.type}) - ${item.billing === 'monthly' ? 'Monthly' : 'Annual'}: $${item.price.toLocaleString()}`
        )
        .join('\n');

      const message = `
${formData.message}

--- Order Details ---
${orderDetails}

Monthly Total: $${totalMonthly.toLocaleString()}
Annual Total: $${totalAnnual.toLocaleString()}
      `.trim();

      await submitPORequest({
        name: formData.name,
        email: formData.email,
        company: formData.company,
        phone: formData.phone,
        message,
      });

      setShowConfirmation(true);
      showSuccess('Purchase order request submitted successfully!');
      clear();

      // Reset form
      setFormData({ name: '', email: '', company: '', phone: '', message: '' });
    } catch {
      showError('Failed to submit request. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalClose = () => {
    setShowConfirmation(false);
    onClose();
  };

  if (showConfirmation) {
    return (
      <Modal isOpen={isOpen} onClose={handleFinalClose} title="Request Received">
        <div className="space-y-4">
          <p className="text-gray-700">
            Thank you for your purchase order request! Our team will review your order and contact you within 24 hours
            to finalize the details.
          </p>
          <p className="text-sm text-gray-600">
            You'll receive a confirmation email at <strong>{formData.email}</strong> shortly.
          </p>
          <div className="flex justify-end pt-4">
            <Button variant="primary" onClick={handleFinalClose}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request Purchase Order">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blueprint-blue focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blueprint-blue focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
            Company *
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blueprint-blue focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blueprint-blue focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blueprint-blue focus:border-transparent"
            placeholder="Any special requirements or questions..."
          />
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
