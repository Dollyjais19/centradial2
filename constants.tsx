
import { WeeklyData } from './types';

export const HARDCODED_USERS = [
  { username: 'dolly123', password: '1234' },
  { username: 'dolly456', password: '2345' }
];

export const MOCK_WEEKLY_DATA: WeeklyData[] = [
  { day: 'Mon', score: 65 },
  { day: 'Tue', score: 68 },
  { day: 'Wed', score: 72 },
  { day: 'Thu', score: 70 },
  { day: 'Fri', score: 85 },
  { day: 'Sat', score: 82 },
  { day: 'Sun', score: 88 },
];

export const WHATSAPP_OPTIONS = [
  { id: 'concern', text: 'Concern / Need Help', message: 'Hey, I just received this message and I feel unsure. Can you please check and give me your opinion before I respond?' },
  { id: 'scam', text: 'Possible Scam Warning', message: 'I think I might be dealing with a scam. Could you look at this message for me and see if it looks suspicious?' },
  { id: 'verify', text: 'Request to Verify Situation', message: 'I’m feeling a bit pressured by a conversation. Can we talk? I need a second opinion on what was said.' }
];
