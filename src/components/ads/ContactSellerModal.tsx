import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Mail, X } from 'lucide-react';

interface ContactSellerModalProps {
  ad: {
    _id: string;
    title: string;
    price: number;
    seller: {
      _id: string;
      name: string;
      email: string;
    };
  };
  onClose: () => void;
}

export default function ContactSellerModal({ ad, onClose }: ContactSellerModalProps) {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  const handleContact = () => {
    const subject = encodeURIComponent(`Inquiry about ${ad.title}`);
    const body = encodeURIComponent(`Hi ${ad.seller.name},\n\nI'm interested in your ${ad.title} listed for ₹${ad.price}.\n\nCould you please provide more details about the item?\n\nBest regards,\n[Your Name]`);

    const mailtoLink = `mailto:${ad.seller.email}?subject=${subject}&body=${body}`;
    window.open(mailtoLink);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white">Contact Seller</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{ad.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">₹{ad.price}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Seller: {ad.seller.name}</p>
          </div>

          <div className="text-center space-y-4">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full mx-auto">
              <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>

            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Open Email App</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                This will open your default email application with a pre-filled message to the seller.
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleContact}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button
                variant="outline"
                onClick={handleClose}
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
