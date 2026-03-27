import React, { useState } from 'react';
import { statuses, users, currentUser } from '@/data/mockData';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

export default function StatusesPage() {
  const [viewing, setViewing] = useState<string | null>(null);

  const getUser = (id: string) => {
    if (id === 'me') return currentUser;
    return users.find(u => u.id === id);
  };

  const viewingStatus = viewing ? statuses.find(s => s.userId === viewing) : null;
  const viewingUser = viewing ? getUser(viewing) : null;

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 border-b border-border">
        <h2 className="text-xl font-bold gradient-text">Статусы</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* My status */}
        <div className="p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 px-2">Мой статус</p>
          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary cursor-pointer transition-all group">
            <div className="relative">
              <Avatar text={currentUser.avatar} size="lg" />
              <button className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 flex items-center justify-center">
                <Icon name="Plus" size={12} className="text-white" />
              </button>
            </div>
            <div>
              <p className="font-semibold text-foreground">Добавить статус</p>
              <p className="text-xs text-muted-foreground">Поделитесь моментом с друзьями</p>
            </div>
          </div>
        </div>

        <div className="px-4 pb-2">
          <div className="h-px bg-border" />
        </div>

        {/* Recent statuses */}
        <div className="p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 px-2">Недавние обновления</p>
          <div className="space-y-2">
            {statuses.filter(s => !s.viewed).map(status => {
              const user = getUser(status.userId);
              if (!user) return null;
              return (
                <div
                  key={status.userId}
                  onClick={() => setViewing(status.userId)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary cursor-pointer transition-all"
                >
                  <div className="p-0.5 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-500">
                    <div className="bg-background rounded-[14px] p-0.5">
                      <Avatar text={user.avatar} size="md" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{status.time}</p>
                  </div>
                  <div className="text-lg">{status.emoji}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Viewed */}
        {statuses.some(s => s.viewed) && (
          <div className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 px-2">Просмотренные</p>
            <div className="space-y-2">
              {statuses.filter(s => s.viewed).map(status => {
                const user = getUser(status.userId);
                if (!user) return null;
                return (
                  <div
                    key={status.userId}
                    onClick={() => setViewing(status.userId)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary cursor-pointer transition-all opacity-60"
                  >
                    <div className="p-0.5 rounded-2xl bg-border">
                      <div className="bg-background rounded-[14px] p-0.5">
                        <Avatar text={user.avatar} size="md" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{status.time}</p>
                    </div>
                    <div className="text-lg">{status.emoji}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Status viewer overlay */}
      {viewing && viewingStatus && viewingUser && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setViewing(null)}>
          <div
            className="w-80 h-[520px] rounded-3xl flex flex-col items-center justify-between p-6 animate-scale-in relative overflow-hidden"
            style={{ background: viewingStatus.bg }}
            onClick={e => e.stopPropagation()}
          >
            {/* Progress bar */}
            <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
              <div className="h-full w-full bg-white rounded-full animate-pulse-slow" />
            </div>

            {/* User info */}
            <div className="flex items-center gap-3 w-full">
              <Avatar text={viewingUser.avatar} size="md" />
              <div>
                <p className="font-semibold text-white">{viewingUser.name}</p>
                <p className="text-xs text-white/70">{viewingStatus.time}</p>
              </div>
              <button className="ml-auto p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors" onClick={() => setViewing(null)}>
                <Icon name="X" size={16} className="text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="flex flex-col items-center gap-3">
              <div className="text-7xl">{viewingStatus.emoji}</div>
              <p className="text-2xl font-bold text-white text-center">{viewingStatus.text}</p>
            </div>

            {/* Reply */}
            <div className="w-full flex gap-2">
              <input
                placeholder="Ответить..."
                className="flex-1 bg-white/20 text-white placeholder-white/60 rounded-full px-4 py-2 text-sm focus:outline-none focus:bg-white/30"
              />
              <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                <Icon name="Send" size={18} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
