import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface DatabricksConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (workspaceUrl: string) => void;
  isConnecting: boolean;
}

export function DatabricksConnectionModal({
  isOpen,
  onClose,
  onConnect,
  isConnecting,
}: DatabricksConnectionModalProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = url.replace(/\/+$/, '');
    onConnect(cleanUrl);
  };

  const inputClass =
    'w-full border border-gray-300 px-3 py-2 text-gray-900 bg-white focus:outline-none focus:border-blueprint-blue focus:ring-1 focus:ring-blueprint-blue';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Connect to Databricks">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Workspace URL
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://adb-1234567890.azuredatabricks.net"
            required
            className={inputClass}
          />
          <p className="text-xs text-gray-400 mt-1">
            Your Azure Databricks or AWS Databricks workspace URL
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-3 text-sm text-blue-700">
          You'll be redirected to authenticate with your Databricks credentials.
          Your credentials are never stored by Blueprint Marketplace.
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit" disabled={isConnecting || !url}>
            {isConnecting ? 'Connecting...' : 'Connect'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
