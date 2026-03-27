import React from 'react';
import { Chat } from '@/data/mockData';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

interface ChatListProps {
  chats: Chat[];
  activeId: string | null;
  onSelect: (id: string) => void;
  searchQuery: string;
}

export default function ChatList({ chats, activeId, onSelect, searchQuery }: ChatListProps) {
  const filtered = chats.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinned = filtered.filter(c => c.pinned);
  const rest = filtered.filter(c => !c.pinned);

  const renderChat = (chat: Chat) => (
    <div
      key={chat.id}
      onClick={() => onSelect(chat.id)}
      className={`chat-item ${activeId === chat.id ? 'active' : ''}`}
    >
      <div className="relative">
        <Avatar
          text={chat.avatar}
          size="md"
          emoji={chat.type === 'group'}
        />
        {chat.type === 'group' && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center">
            <Icon name="Users" size={9} className="text-white" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {chat.pinned && <Icon name="Pin" size={11} className="text-muted-foreground rotate-45" />}
            <span className="font-semibold text-sm text-foreground truncate">{chat.name}</span>
          </div>
          <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">{chat.lastTime}</span>
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <p className="text-xs text-muted-foreground truncate">{chat.lastMessage}</p>
          {chat.unread > 0 && (
            <span className="ml-2 flex-shrink-0 min-w-5 h-5 px-1 rounded-full bg-gradient-to-r from-purple-600 to-violet-500 text-white text-xs flex items-center justify-center font-medium">
              {chat.unread > 99 ? '99+' : chat.unread}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto py-2">
      {pinned.length > 0 && (
        <>
          <div className="px-4 py-1.5 flex items-center gap-2">
            <Icon name="Pin" size={11} className="text-muted-foreground rotate-45" />
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Закреплённые</span>
          </div>
          {pinned.map(renderChat)}
          <div className="mx-4 my-2 h-px bg-border" />
        </>
      )}
      {rest.map(renderChat)}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center h-48 gap-3 text-muted-foreground">
          <Icon name="MessageCircle" size={40} className="opacity-30" />
          <p className="text-sm">Чаты не найдены</p>
        </div>
      )}
    </div>
  );
}
