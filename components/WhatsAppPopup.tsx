
import React, { useState } from 'react';
import { WHATSAPP_OPTIONS } from '../constants';
import { User, TrustedContact } from '../types';

interface WhatsAppPopupProps {
  user: User;
  onSelect: (phone: string, message: string) => void;
  onClose: () => void;
}

const WhatsAppPopup: React.FC<WhatsAppPopupProps> = ({ user, onSelect, onClose }) => {
  const [selectedContact, setSelectedContact] = useState<TrustedContact | null>(
    user.trustedContacts.length === 1 ? user.trustedContacts[0] : null
  );
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

  const handleFinish = () => {
    if (selectedContact && selectedMessage) {
      onSelect(selectedContact.phone, selectedMessage);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm fade-in px-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-heading text-aura-green">Request Advice</h3>
            <p className="text-gray-500 text-sm mt-1">Get a second opinion from someone you trust.</p>
          </div>
          <button onClick={onClose} className="text-gray-300 hover:text-gray-500">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
        
        <div className="space-y-8">
          <div>
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">1. Select Trusted Person</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {user.trustedContacts.map(contact => (
                <button
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    selectedContact?.id === contact.id 
                      ? 'border-aura-green bg-aura-sage/30 ring-1 ring-aura-green' 
                      : 'border-aura-sage hover:bg-aura-sage/10'
                  }`}
                >
                  <div className="font-semibold text-aura-green">{contact.name}</div>
                  <div className="text-[10px] text-gray-500 font-mono mt-1">{contact.phone}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">2. Choose Message Template</h4>
            <div className="space-y-3">
              {WHATSAPP_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedMessage(opt.message)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                    selectedMessage === opt.message 
                      ? 'border-aura-green bg-aura-sage/30 ring-1 ring-aura-green' 
                      : 'border-aura-sage hover:bg-aura-sage/10'
                  }`}
                >
                  <div className="font-medium text-gray-800 text-sm">{opt.text}</div>
                  <div className="text-xs text-gray-500 mt-1 line-clamp-2">{opt.message}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex gap-4 mt-10">
          <button 
            onClick={onClose}
            className="flex-1 py-4 text-gray-400 font-medium hover:bg-gray-50 rounded-2xl transition-all"
          >
            Cancel
          </button>
          <button 
            disabled={!selectedContact || !selectedMessage}
            onClick={handleFinish}
            className="flex-[2] bg-aura-green text-white py-4 rounded-2xl font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-all shadow-md"
          >
            Open WhatsApp
          </button>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #D1D9D0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default WhatsAppPopup;
