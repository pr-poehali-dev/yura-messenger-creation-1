const BASE = 'https://functions.poehali.dev/f8cb55d0-9230-4b5d-a863-7ed0e124b67e';

export interface ApiMessage {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  type: string;
  read: boolean;
  time: string;
  createdAt: string;
}

export interface ApiChat {
  id: string;
  type: 'personal' | 'group';
  name: string;
  avatar: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  members: { userId: string; role: string }[];
}

export async function fetchMessages(chatId: string, after?: string): Promise<ApiMessage[]> {
  const url = after
    ? `${BASE}/?chat_id=${chatId}&after=${encodeURIComponent(after)}`
    : `${BASE}/?chat_id=${chatId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch messages');
  return res.json();
}

export async function sendMessage(chatId: string, senderId: string, text: string): Promise<ApiMessage> {
  const res = await fetch(`${BASE}/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, sender_id: senderId, text }),
  });
  if (!res.ok) throw new Error('Failed to send message');
  return res.json();
}

export async function fetchChats(userId: string): Promise<ApiChat[]> {
  const res = await fetch(`${BASE}/chats?user_id=${userId}`);
  if (!res.ok) throw new Error('Failed to fetch chats');
  return res.json();
}
