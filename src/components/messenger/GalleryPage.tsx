import React, { useState } from 'react';
import { mediaItems, chats } from '@/data/mockData';
import Icon from '@/components/ui/icon';

export default function GalleryPage() {
  const [filter, setFilter] = useState<string>('all');
  const [lightbox, setLightbox] = useState<string | null>(null);

  const chatOptions = [{ id: 'all', name: 'Все' }, ...chats.map(c => ({ id: c.id, name: c.name }))];
  const filtered = filter === 'all' ? mediaItems : mediaItems.filter(m => m.chatId === filter);

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 border-b border-border">
        <h2 className="text-xl font-bold gradient-text mb-4">Медиагалерея</h2>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {chatOptions.map(opt => (
            <button
              key={opt.id}
              onClick={() => setFilter(opt.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                filter === opt.id
                  ? 'bg-gradient-to-r from-purple-600 to-violet-500 text-white'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {opt.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center justify-between mb-4 px-1">
          <p className="text-sm text-muted-foreground">{filtered.length} файлов</p>
          <div className="flex gap-1">
            <button className="p-1.5 rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-colors">
              <Icon name="Grid3x3" size={15} />
            </button>
            <button className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
              <Icon name="List" size={15} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {filtered.map((item, i) => (
            <div
              key={item.id}
              onClick={() => setLightbox(item.url)}
              className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group animate-fade-in"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <img
                src={item.url}
                alt=""
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center">
                <Icon name="ZoomIn" size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="absolute bottom-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] text-white bg-black/50 px-1.5 py-0.5 rounded-md">{item.time}</span>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 gap-3 text-muted-foreground">
            <Icon name="Image" size={40} className="opacity-30" />
            <p className="text-sm">Нет медиафайлов</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="absolute inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          <button className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
            <Icon name="X" size={20} className="text-white" />
          </button>
          <button className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
            <Icon name="ChevronLeft" size={20} className="text-white" />
          </button>
          <img
            src={lightbox}
            alt=""
            className="max-w-[85%] max-h-[85vh] object-contain rounded-2xl animate-scale-in"
            onClick={e => e.stopPropagation()}
          />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
            <Icon name="ChevronRight" size={20} className="text-white" />
          </button>
          <div className="absolute bottom-4 flex gap-3">
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white text-sm">
              <Icon name="Download" size={15} />
              Скачать
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white text-sm">
              <Icon name="Share2" size={15} />
              Поделиться
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
