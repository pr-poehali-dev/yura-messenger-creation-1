import React, { useState } from 'react';
import { users } from '@/data/mockData';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

const statusLabel: Record<string, string> = {
  online: 'в сети',
  away: 'отошёл',
  busy: 'занят',
  offline: 'не в сети',
};

export default function ContactsPage() {
  const [search, setSearch] = useState('');

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = filtered.reduce<Record<string, typeof users>>((acc, user) => {
    const letter = user.name[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(user);
    return acc;
  }, {});

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 border-b border-border">
        <h2 className="text-xl font-bold gradient-text mb-4">Контакты</h2>
        <div className="relative">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск контактов..."
            className="w-full bg-secondary text-foreground placeholder-muted-foreground rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/50"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Online now */}
        <div className="mb-6">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 px-2">Сейчас онлайн</p>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {users.filter(u => u.status === 'online').map(u => (
              <div key={u.id} className="flex flex-col items-center gap-2 cursor-pointer group flex-shrink-0">
                <div className="p-0.5 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-500 group-hover:from-purple-500 group-hover:to-cyan-400 transition-all">
                  <div className="bg-background rounded-[14px] p-0.5">
                    <Avatar text={u.avatar} size="md" />
                  </div>
                </div>
                <span className="text-xs text-muted-foreground truncate w-14 text-center">{u.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* All contacts */}
        {Object.keys(grouped).sort().map(letter => (
          <div key={letter} className="mb-4">
            <div className="flex items-center gap-3 mb-2 px-2">
              <span className="text-sm font-bold gradient-text">{letter}</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="space-y-1">
              {grouped[letter].map(user => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary cursor-pointer transition-all group"
                >
                  <Avatar text={user.avatar} size="md" status={user.status} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.about || statusLabel[user.status]}</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 rounded-lg hover:bg-background transition-colors text-muted-foreground hover:text-foreground">
                      <Icon name="MessageCircle" size={15} />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-background transition-colors text-muted-foreground hover:text-foreground">
                      <Icon name="Phone" size={15} />
                    </button>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${user.status === 'online' ? 'bg-green-900/30 text-green-400' : user.status === 'busy' ? 'bg-red-900/30 text-red-400' : user.status === 'away' ? 'bg-yellow-900/30 text-yellow-400' : 'bg-secondary text-muted-foreground'}`}>
                    {statusLabel[user.status]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
