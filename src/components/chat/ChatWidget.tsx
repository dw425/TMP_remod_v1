import { FEATURES } from '@/config/features';

export function ChatWidget() {
  if (!FEATURES.chat) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <button className="bg-blueprint-blue text-white px-6 py-3 shadow-lg hover:bg-blue-800 transition-colors font-bold">
        Chat with Us
      </button>
    </div>
  );
}
