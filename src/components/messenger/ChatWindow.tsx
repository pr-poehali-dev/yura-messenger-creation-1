import React, { useState, useRef, useEffect } from 'react';
import { Chat, Message, users, currentUser } from '@/data/mockData';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

interface ChatWindowProps {
  chat: Chat;
}

const getSender = (id: string) => {
  if (id === 'me') return currentUser;
  return users.find(u => u.id === id) || { name: 'Неизвестно', avatar: '?', status: 'offline' as const };
};

export default function ChatWindow({ chat }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>(chat.messages);
  const [input, setInput] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(chat.messages);
  }, [chat.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const msg: Message = {
      id: `m${Date.now()}`,
      senderId: 'me',
      text: input.trim(),
      time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    setMessages(prev => [...prev, msg]);
    setInput('');
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const isGroup = chat.type === 'group';
  const membersCount = chat.members?.length || 2;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border glass z-10">
        <Avatar text={chat.avatar} size="md" />
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-foreground truncate">{chat.name}</h2>
          <p className="text-xs text-muted-foreground">
            {isGroup ? `${membersCount} участников` : 'в сети'}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
            <Icon name="Phone" size={18} />
          </button>
          <button className="p-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
            <Icon name="Video" size={18} />
          </button>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className={`p-2 rounded-xl transition-colors text-muted-foreground hover:text-foreground ${showInfo ? 'bg-secondary text-foreground' : 'hover:bg-secondary'}`}
          >
            <Icon name="Info" size={18} />
          </button>
          <button className="p-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
            <Icon name="Search" size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-mesh">
          {messages.map((msg, i) => {
            const isMe = msg.senderId === 'me';
            const sender = getSender(msg.senderId);
            const showAvatar = !isMe && isGroup && (i === 0 || messages[i - 1].senderId !== msg.senderId);
            const showName = !isMe && isGroup && (i === 0 || messages[i - 1].senderId !== msg.senderId);

            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} gap-2 animate-fade-in`}>
                {!isMe && isGroup && (
                  <div className="w-8 flex-shrink-0 mt-auto">
                    {showAvatar && <Avatar text={sender.avatar} size="sm" />}
                  </div>
                )}
                <div className={`max-w-xs lg:max-w-md xl:max-w-lg`}>
                  {showName && (
                    <p className="text-xs font-medium text-purple-400 mb-1 ml-1">{sender.name}</p>
                  )}
                  <div className={`px-4 py-2.5 ${isMe ? 'msg-out' : 'msg-in'}`}>
                    <p className="text-sm leading-relaxed text-white">{msg.text}</p>
                    <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <span className="text-[10px] opacity-60">{msg.time}</span>
                      {isMe && (
                        <Icon
                          name={msg.read ? 'CheckCheck' : 'Check'}
                          size={12}
                          className={msg.read ? 'text-cyan-300 opacity-80' : 'opacity-50 text-white'}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Info panel */}
        {showInfo && (
          <div className="w-72 border-l border-border flex flex-col animate-fade-in overflow-y-auto">
            <div className="p-5">
              <h3 className="font-semibold mb-4 text-foreground">
                {isGroup ? 'Информация о группе' : 'Информация'}
              </h3>
              {isGroup && chat.members && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
                    Участники · {chat.members.length}
                  </p>
                  <div className="space-y-2">
                    {chat.members.map(m => {
                      const u = m.userId === 'me' ? currentUser : users.find(u => u.id === m.userId);
                      if (!u) return null;
                      return (
                        <div key={m.userId} className="flex items-center gap-3 p-2 rounded-xl hover:bg-secondary cursor-pointer transition-colors">
                          <Avatar text={u.avatar} size="sm" status={u.status} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{u.name}</p>
                            <p className="text-xs text-muted-foreground">{u.status === 'online' ? 'в сети' : 'не в сети'}</p>
                          </div>
                          {m.role === 'admin' && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-900/50 text-purple-400 font-medium border border-purple-800">
                              Админ
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-border glass">
        <div className="flex items-end gap-3">
          <button className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors flex-shrink-0">
            <Icon name="Paperclip" size={20} />
          </button>
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="Написать сообщение..."
              rows={1}
              className="w-full bg-secondary text-foreground placeholder-muted-foreground rounded-2xl px-4 py-3 pr-12 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-600/50 transition-all"
              style={{ maxHeight: '120px' }}
            />
            <button className="absolute right-3 bottom-3 text-muted-foreground hover:text-yellow-400 transition-colors">
              <Icon name="Smile" size={18} />
            </button>
          </div>
          <button
            onClick={send}
            disabled={!input.trim()}
            className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-500 text-white hover:from-purple-500 hover:to-violet-400 transition-all flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed glow-purple"
          >
            <Icon name="Send" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
