import React, { useState } from 'react';
import Sidebar from '@/components/messenger/Sidebar';
import ChatWindow from '@/components/messenger/ChatWindow';
import ContactsPage from '@/components/messenger/ContactsPage';
import StatusesPage from '@/components/messenger/StatusesPage';
import GalleryPage from '@/components/messenger/GalleryPage';
import ProfilePage from '@/components/messenger/ProfilePage';
import CallModal from '@/components/messenger/CallModal';
import Icon from '@/components/ui/icon';
import { chats, Chat } from '@/data/mockData';

type Tab = 'chats' | 'contacts' | 'statuses' | 'gallery' | 'profile';

interface ActiveCall {
  chat: Chat;
  type: 'audio' | 'video';
}

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>('chats');
  const [activeChatId, setActiveChatId] = useState<string | null>('c1');
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);

  const activeChat = chats.find(c => c.id === activeChatId) || null;

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (tab !== 'chats') setActiveChatId(null);
  };

  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
    setActiveTab('chats');
  };

  const handleCallStart = (type: 'audio' | 'video', chat: Chat) => {
    setActiveCall({ chat, type });
  };

  const renderRightPanel = () => {
    if (activeTab === 'contacts') return <ContactsPage />;
    if (activeTab === 'statuses') return <StatusesPage />;
    if (activeTab === 'gallery') return <GalleryPage />;
    if (activeTab === 'profile') return <ProfilePage />;

    if (activeTab === 'chats') {
      if (activeChat) {
        return <ChatWindow key={activeChat.id} chat={activeChat} onCallStart={handleCallStart} />;
      }
      return (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 bg-mesh h-full">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-600/20 to-cyan-500/20 border border-purple-600/20 flex items-center justify-center">
            <Icon name="MessageCircle" size={48} className="text-purple-400/50" />
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold gradient-text mb-2">Vibe Messenger</h3>
            <p className="text-muted-foreground text-sm max-w-xs">
              Выберите чат слева, чтобы начать общение
            </p>
          </div>
          <div className="flex gap-3 flex-wrap justify-center">
            <div className="px-4 py-2 rounded-full border border-purple-600/30 text-xs text-purple-400 bg-purple-600/10">
              🔒 Конец-в-конец шифрование
            </div>
            <div className="px-4 py-2 rounded-full border border-cyan-600/30 text-xs text-cyan-400 bg-cyan-600/10">
              ⚡ Мгновенная доставка
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Left: sidebar */}
      <div
        className={`flex-shrink-0 border-r border-border transition-all duration-300 ${
          activeTab === 'chats' ? 'w-80' : 'w-16'
        }`}
      >
        <Sidebar
          activeChat={activeChatId}
          onSelectChat={handleSelectChat}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </div>

      {/* Right: content panel */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {activeTab !== 'chats' ? (
          <div className="w-full max-w-2xl mx-auto h-full overflow-hidden">
            {renderRightPanel()}
          </div>
        ) : (
          renderRightPanel()
        )}
      </div>

      {/* Call modal overlay */}
      {activeCall && (
        <CallModal
          chat={activeCall.chat}
          callType={activeCall.type}
          onEnd={() => setActiveCall(null)}
        />
      )}
    </div>
  );
}
