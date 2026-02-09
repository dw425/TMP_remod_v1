import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface DownloadTermsModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export function DownloadTermsModal({ isOpen, onAccept, onDecline }: DownloadTermsModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onDecline} title="License Agreement">
      <div className="space-y-4">
        <div className="max-h-64 overflow-y-auto border border-gray-200 p-4 text-sm text-gray-600 space-y-3">
          <p className="font-bold text-gray-900">Blueprint Professional Consulting Services - Software License Agreement</p>

          <p>
            By downloading this software, you agree to the following terms:
          </p>

          <p>
            <strong>1. License Grant.</strong> BPCS grants you a non-exclusive, non-transferable license
            to use this software solely within your organization for internal business purposes.
          </p>

          <p>
            <strong>2. Restrictions.</strong> You may not: (a) distribute, sublicense, or transfer this
            software to any third party; (b) reverse engineer, decompile, or disassemble the software;
            (c) remove any proprietary notices or license headers; (d) use the software to build
            competing products.
          </p>

          <p>
            <strong>3. Intellectual Property.</strong> All intellectual property rights in the software
            remain with BPCS. This license does not grant you ownership of the software.
          </p>

          <p>
            <strong>4. Watermarking.</strong> Downloaded files contain embedded license information
            including your email address and a unique download identifier for audit purposes.
          </p>

          <p>
            <strong>5. Termination.</strong> This license terminates automatically if you violate any
            of these terms. Upon termination, you must destroy all copies of the software.
          </p>

          <p>
            <strong>6. Disclaimer.</strong> THE SOFTWARE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY
            KIND, EXPRESS OR IMPLIED.
          </p>
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <Button variant="secondary" onClick={onDecline}>
            Decline
          </Button>
          <Button onClick={onAccept}>
            Accept & Download
          </Button>
        </div>
      </div>
    </Modal>
  );
}
