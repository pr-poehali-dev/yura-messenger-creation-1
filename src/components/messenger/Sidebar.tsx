import React, { useState } from 'react';
import { chats, currentUser } from '@/data/mockData';
import Avatar from './Avatar';
import ChatList from './ChatList';
import Icon from '@/components/ui/icon';

type Tab = 'chats' | 'contacts' | 'statuses' | 'gallery' | 'profile';

interface SidebarProps {
  activeChat: string | null;
  onSelectChat: (id: string) => void;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const navItems: { id: Tab; icon: string; label: string }[] = [
  { id: 'chats', icon: 'MessageCircle', label: 'Чаты' },
  { id: 'contacts', icon: 'Users', label: 'Контакты' },
  { id: 'statuses', icon: 'Circle', label: 'Статусы' },
  { id: 'gallery', icon: 'Image', label: 'Галерея' },
  { id: 'profile', icon: 'User', label: 'Профиль' },
];

export default function Sidebar({ activeChat, onSelectChat, activeTab, onTabChange }: SidebarProps) {
  const [search, setSearch] = useState('');
  const totalUnread = chats.reduce((s, c) => s + c.unread, 0);

  return (
    <div className="flex h-full">
      {/* Nav rail */}
      <div className="w-16 flex flex-col items-center py-4 gap-1 border-r border-border bg-card/50">
        {/* Logo */}
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center mb-3 glow-purple">
          <span className="text-white font-black text-sm">V</span>
        </div>

        <div className="flex-1 flex flex-col gap-1 w-full px-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`nav-item w-full relative ${activeTab === item.id ? 'active' : ''}`}
            >
              <Icon
                name={item.icon}
                size={20}
                className={activeTab === item.id ? 'text-purple-400' : 'text-muted-foreground'}
              />
              <span className={`text-[9px] ${activeTab === item.id ? 'text-purple-400' : 'text-muted-foreground'}`}>
                {item.label}
              </span>
              {item.id === 'chats' && totalUnread > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-gradient-to-r from-purple-600 to-violet-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">
                  {totalUnread > 9 ? '9+' : totalUnread}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* User avatar at bottom */}
        <div className="mt-auto">
          <Avatar text={currentUser.avatar} size="sm" status="online" />
        </div>
      </div>

      {/* Chat list panel */}
      {activeTab === 'chats' && (
        <div className="flex-1 flex flex-col min-w-0">
          <div className="px-4 py-4 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold gradient-text">Чаты</h2>
              <button className="p-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                <Icon name="PenSquare" size={17} />
              </button>
            </div>
            <div className="relative">
              <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Поиск..."
                className="w-full bg-secondary text-foreground placeholder-muted-foreground rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/50 transition-all"
              />
            </div>
          </div>

          <ChatList
            chats={chats}
            activeId={activeChat}
            onSelect={onSelectChat}
            searchQuery={search}
          />
        </div>
      )}
    </div>
  );
}
