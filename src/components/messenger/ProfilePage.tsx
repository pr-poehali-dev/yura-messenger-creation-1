import React, { useState } from 'react';
import { currentUser } from '@/data/mockData';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

const themes = [
  { name: 'Фиолет', from: '#8b5cf6', to: '#06b6d4' },
  { name: 'Закат', from: '#ec4899', to: '#f59e0b' },
  { name: 'Океан', from: '#3b82f6', to: '#10b981' },
  { name: 'Коралл', from: '#ef4444', to: '#f97316' },
];

interface ToggleProps {
  label: string;
  description?: string;
  icon: string;
  defaultOn?: boolean;
}

function Toggle({ label, description, icon, defaultOn }: ToggleProps) {
  const [on, setOn] = useState(defaultOn ?? false);
  return (
    <div className="flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer" onClick={() => setOn(!on)}>
      <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground">
        <Icon name={icon} size={18} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <div className={`w-11 h-6 rounded-full transition-all relative ${on ? 'bg-gradient-to-r from-purple-600 to-violet-500' : 'bg-secondary'}`}>
        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${on ? 'left-5' : 'left-0.5'}`} />
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [activeTheme, setActiveTheme] = useState(0);

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="relative">
        <div className="h-28 bg-gradient-to-r from-purple-900/80 to-cyan-900/50" />
        <div className="px-6 pb-4">
          <div className="flex items-end gap-4 -mt-8 mb-4">
            <div className="relative">
              <div className="p-0.5 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-500">
                <div className="bg-background rounded-[14px] p-0.5">
                  <Avatar text={currentUser.avatar} size="xl" />
                </div>
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-r from-purple-600 to-violet-500 flex items-center justify-center glow-purple">
                <Icon name="Camera" size={14} className="text-white" />
              </button>
            </div>
            <div className="pb-1 flex-1">
              <h2 className="text-xl font-bold text-foreground">{currentUser.name}</h2>
              <p className="text-sm text-muted-foreground">{currentUser.phone}</p>
            </div>
            <button className="p-2 rounded-xl bg-secondary hover:bg-muted transition-colors text-muted-foreground mb-1">
              <Icon name="Edit3" size={17} />
            </button>
          </div>

          <div className="p-3 bg-secondary rounded-xl">
            <p className="text-sm text-muted-foreground">{currentUser.about}</p>
          </div>
        </div>
      </div>

      <div className="px-4 pb-8 space-y-4">
        {/* Theme */}
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 px-2">Тема оформления</p>
          <div className="grid grid-cols-4 gap-2">
            {themes.map((t, i) => (
              <button
                key={i}
                onClick={() => setActiveTheme(i)}
                className={`relative h-14 rounded-xl overflow-hidden transition-all ${activeTheme === i ? 'ring-2 ring-white scale-95' : 'hover:scale-95'}`}
                style={{ background: `linear-gradient(135deg, ${t.from}, ${t.to})` }}
              >
                <span className="absolute inset-0 flex items-end justify-center pb-1.5">
                  <span className="text-[10px] text-white font-medium">{t.name}</span>
                </span>
                {activeTheme === i && (
                  <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                    <Icon name="Check" size={10} className="text-purple-600" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 px-2">Уведомления</p>
          <div className="bg-card rounded-2xl overflow-hidden border border-border">
            <Toggle label="Push-уведомления" description="Для всех чатов" icon="Bell" defaultOn={true} />
            <div className="h-px bg-border mx-4" />
            <Toggle label="Звуки сообщений" icon="Volume2" defaultOn={true} />
            <div className="h-px bg-border mx-4" />
            <Toggle label="Предпросмотр текста" description="Отображать в уведомлении" icon="Eye" defaultOn={false} />
          </div>
        </div>

        {/* Privacy */}
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 px-2">Конфиденциальность</p>
          <div className="bg-card rounded-2xl overflow-hidden border border-border">
            <Toggle label="Статус «был(а) в сети»" description="Скрыть время последнего визита" icon="Clock" defaultOn={false} />
            <div className="h-px bg-border mx-4" />
            <Toggle label="Подтверждение прочтения" description="Двойные галочки" icon="CheckCheck" defaultOn={true} />
            <div className="h-px bg-border mx-4" />
            <Toggle label="Конец-в-конец шифрование" icon="Lock" defaultOn={true} />
          </div>
        </div>

        {/* Danger */}
        <div className="pt-2">
          <button className="w-full flex items-center gap-3 p-4 rounded-xl bg-red-950/30 hover:bg-red-950/50 transition-colors border border-red-900/30 text-red-400">
            <Icon name="LogOut" size={18} />
            <span className="text-sm font-medium">Выйти из аккаунта</span>
          </button>
        </div>
      </div>
    </div>
  );
}
