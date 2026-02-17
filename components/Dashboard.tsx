
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { User, TrustedContact } from '../types';
import { MOCK_WEEKLY_DATA } from '../constants';

interface DashboardProps {
  user: User;
  updateContacts: (contacts: TrustedContact[]) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, updateContacts }) => {
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');

  const addContact = () => {
    if (newContactName.trim() && newContactPhone.trim()) {
      const newContact = { 
        id: Date.now().toString(), 
        name: newContactName.trim(), 
        phone: newContactPhone.trim().replace(/\s/g, '') 
      };
      updateContacts([...user.trustedContacts, newContact]);
      setNewContactName('');
      setNewContactPhone('');
    }
  };

  const removeContact = (id: string) => {
    updateContacts(user.trustedContacts.filter(c => c.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-8 fade-in">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
        {/* Progress Card */}
        <div className="w-full lg:w-1/3 bg-white p-8 rounded-3xl border border-aura-sage shadow-sm">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 bg-aura-sage rounded-2xl flex items-center justify-center text-aura-green text-xl font-bold uppercase">
              {user.username.slice(0, 2)}
            </div>
            <div>
              <h2 className="text-lg font-heading font-semibold text-aura-green">@{user.username}</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Active Guardian</p>
            </div>
          </div>
          
          <div className="space-y-8">
            <div>
              <div className="flex justify-between text-xs mb-3">
                <span className="text-gray-500 font-medium">Emotional Awareness</span>
                <span className="font-bold text-aura-green">{user.scores.emotionalAwareness}%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-aura-green rounded-full transition-all duration-1000" style={{ width: `${user.scores.emotionalAwareness}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-3">
                <span className="text-gray-500 font-medium">Scam Resistance</span>
                <span className="font-bold text-aura-green">{user.scores.scamResistance}%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-aura-green rounded-full transition-all duration-1000" style={{ width: `${user.scores.scamResistance}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-3">
                <span className="text-gray-500 font-medium">Decision Stability</span>
                <span className="font-bold text-aura-green">{user.scores.decisionStability}%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-aura-green rounded-full transition-all duration-1000" style={{ width: `${user.scores.decisionStability}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Growth Chart */}
        <div className="w-full lg:w-2/3 bg-white p-8 rounded-3xl border border-aura-sage shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-heading text-aura-green">Safety Growth</h3>
            <span className="text-[10px] text-green-600 bg-green-50 px-3 py-1 rounded-full font-bold uppercase tracking-wider border border-green-100">+12% Stability</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_WEEKLY_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 11}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 11}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', fontFamily: 'Inter'}}
                  itemStyle={{color: '#1F4F46', fontWeight: 'bold'}}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#1F4F46" 
                  strokeWidth={4} 
                  dot={{fill: '#1F4F46', strokeWidth: 2, r: 4}} 
                  activeDot={{r: 6}}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-xs text-gray-400 mt-8 leading-relaxed italic font-light">
            "Your decision-making is becoming more stable. Every mindful pause builds a stronger shield."
          </p>
        </div>
      </div>

      {/* Contacts Hub */}
      <div className="bg-white p-8 rounded-3xl border border-aura-sage shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h3 className="text-xl font-heading text-aura-green">Trusted Contacts Hub</h3>
            <p className="text-xs text-gray-400 mt-1">People who help you stay grounded.</p>
          </div>
          <div className="px-4 py-1.5 bg-aura-sage/30 rounded-xl text-[10px] font-bold text-aura-green uppercase tracking-widest border border-aura-sage/40">
            {user.trustedContacts.length} Connections Saved
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {user.trustedContacts.map(contact => (
            <div key={contact.id} className="p-6 rounded-3xl border border-aura-sage flex justify-between items-center bg-[#FDFBF7]/50 hover:bg-white transition-all shadow-sm group">
              <div>
                <div className="font-semibold text-aura-green text-sm">{contact.name}</div>
                <div className="text-[10px] text-gray-400 font-mono mt-1">{contact.phone}</div>
              </div>
              <button 
                onClick={() => removeContact(contact.id)}
                className="p-2 text-gray-300 hover:text-red-400 transition-colors"
                title="Remove Connection"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          ))}
          
          <div className="p-6 rounded-3xl border-2 border-dashed border-aura-sage flex flex-col gap-3 bg-aura-sage/5 hover:bg-white transition-all">
            <input 
              type="text" 
              placeholder="Contact Name (e.g. Alex)" 
              className="text-xs p-3.5 rounded-2xl border border-aura-sage bg-white focus:ring-1 focus:ring-aura-green outline-none"
              value={newContactName}
              onChange={(e) => setNewContactName(e.target.value)}
            />
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="WhatsApp Number" 
                className="flex-1 text-xs p-3.5 rounded-2xl border border-aura-sage bg-white focus:ring-1 focus:ring-aura-green outline-none"
                value={newContactPhone}
                onChange={(e) => setNewContactPhone(e.target.value)}
              />
              <button 
                onClick={addContact}
                disabled={!newContactName || !newContactPhone}
                className="bg-aura-green text-white px-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:opacity-90 disabled:opacity-20 transition-all shadow-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
