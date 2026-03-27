export interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  lastSeen?: string;
  about?: string;
  phone?: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  time: string;
  read: boolean;
  type?: 'text' | 'image' | 'system';
  imageUrl?: string;
}

export interface Chat {
  id: string;
  type: 'personal' | 'group';
  name: string;
  avatar: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  members?: ChatMember[];
  messages: Message[];
  pinned?: boolean;
}

export interface ChatMember {
  userId: string;
  role: 'admin' | 'member';
}

export interface StatusItem {
  userId: string;
  viewed: boolean;
  time: string;
  emoji?: string;
  text?: string;
  bg: string;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  chatId: string;
  time: string;
  thumb?: string;
}

export const currentUser: User = {
  id: 'me',
  name: 'Алексей Громов',
  avatar: 'АГ',
  status: 'online',
  about: 'Всегда на связи 🚀',
  phone: '+7 999 123-45-67',
};

export const users: User[] = [
  { id: 'u1', name: 'Марина Волкова', avatar: 'МВ', status: 'online', lastSeen: 'сейчас', about: 'Люблю путешествия ✈️' },
  { id: 'u2', name: 'Дмитрий Соколов', avatar: 'ДС', status: 'online', lastSeen: 'сейчас', about: 'Разработчик 💻' },
  { id: 'u3', name: 'Анна Петрова', avatar: 'АП', status: 'away', lastSeen: '5 мин назад', about: 'Дизайнер 🎨' },
  { id: 'u4', name: 'Кирилл Захаров', avatar: 'КЗ', status: 'offline', lastSeen: '2 ч назад', about: 'Музыкант 🎸' },
  { id: 'u5', name: 'Ольга Смирнова', avatar: 'ОС', status: 'busy', lastSeen: 'сейчас', about: 'В рабочем режиме' },
  { id: 'u6', name: 'Павел Новиков', avatar: 'ПН', status: 'online', lastSeen: 'сейчас', about: 'Фотограф 📸' },
  { id: 'u7', name: 'Екатерина Лебедева', avatar: 'ЕЛ', status: 'offline', lastSeen: 'вчера', about: '☕ Кофе и книги' },
  { id: 'u8', name: 'Никита Орлов', avatar: 'НО', status: 'online', lastSeen: 'сейчас', about: 'Предприниматель 🚀' },
];

export const chats: Chat[] = [
  {
    id: 'c1',
    type: 'personal',
    name: 'Марина Волкова',
    avatar: 'МВ',
    lastMessage: 'Отлично, увидимся завтра! 🎉',
    lastTime: '14:32',
    unread: 2,
    pinned: true,
    messages: [
      { id: 'm1', senderId: 'u1', text: 'Привет! Как дела?', time: '14:10', read: true },
      { id: 'm2', senderId: 'me', text: 'Всё отлично! Работаю над новым проектом', time: '14:15', read: true },
      { id: 'm3', senderId: 'u1', text: 'Круто! Расскажи подробнее 😊', time: '14:20', read: true },
      { id: 'm4', senderId: 'me', text: 'Это мессенджер нового поколения — с красивым дизайном и крутыми функциями', time: '14:25', read: true },
      { id: 'm5', senderId: 'u1', text: 'Отлично, увидимся завтра! 🎉', time: '14:32', read: false },
    ],
  },
  {
    id: 'c2',
    type: 'group',
    name: 'Команда разработки 🚀',
    avatar: '🚀',
    lastMessage: 'Дмитрий: Деплой прошёл успешно',
    lastTime: '13:55',
    unread: 5,
    pinned: true,
    members: [
      { userId: 'me', role: 'admin' },
      { userId: 'u2', role: 'admin' },
      { userId: 'u3', role: 'member' },
      { userId: 'u5', role: 'member' },
      { userId: 'u8', role: 'member' },
    ],
    messages: [
      { id: 'm1', senderId: 'u2', text: 'Народ, я завершил задачу по авторизации', time: '13:20', read: true },
      { id: 'm2', senderId: 'u3', text: 'Я обновила макеты, посмотрите в Figma', time: '13:35', read: true },
      { id: 'm3', senderId: 'me', text: 'Принято! Начинаю ревью', time: '13:45', read: true },
      { id: 'm4', senderId: 'u5', text: 'Тесты написала, всё зелёное ✅', time: '13:50', read: false },
      { id: 'm5', senderId: 'u2', text: 'Деплой прошёл успешно 🎉', time: '13:55', read: false },
    ],
  },
  {
    id: 'c3',
    type: 'personal',
    name: 'Дмитрий Соколов',
    avatar: 'ДС',
    lastMessage: 'Спасибо за код-ревью!',
    lastTime: '12:10',
    unread: 0,
    messages: [
      { id: 'm1', senderId: 'u2', text: 'Привет, можешь глянуть мой PR?', time: '11:50', read: true },
      { id: 'm2', senderId: 'me', text: 'Конечно, сейчас посмотрю', time: '11:55', read: true },
      { id: 'm3', senderId: 'u2', text: 'Спасибо за код-ревью!', time: '12:10', read: true },
    ],
  },
  {
    id: 'c4',
    type: 'group',
    name: 'Друзья 🎮',
    avatar: '🎮',
    lastMessage: 'Кирилл: Играем сегодня?',
    lastTime: 'вчера',
    unread: 12,
    members: [
      { userId: 'me', role: 'admin' },
      { userId: 'u4', role: 'member' },
      { userId: 'u6', role: 'member' },
      { userId: 'u8', role: 'member' },
    ],
    messages: [
      { id: 'm1', senderId: 'u6', text: 'Привет всем! Новые фотки выложил', time: 'вчера', read: false },
      { id: 'm2', senderId: 'u4', text: 'Играем сегодня?', time: 'вчера', read: false },
    ],
  },
  {
    id: 'c5',
    type: 'personal',
    name: 'Анна Петрова',
    avatar: 'АП',
    lastMessage: 'Посмотри, я обновила дизайн',
    lastTime: 'вчера',
    unread: 1,
    messages: [
      { id: 'm1', senderId: 'u3', text: 'Посмотри, я обновила дизайн', time: 'вчера', read: false },
    ],
  },
  {
    id: 'c6',
    type: 'personal',
    name: 'Ольга Смирнова',
    avatar: 'ОС',
    lastMessage: 'Отчёт готов, отправляю',
    lastTime: 'пн',
    unread: 0,
    messages: [
      { id: 'm1', senderId: 'u5', text: 'Отчёт готов, отправляю', time: 'пн', read: true },
    ],
  },
];

export const statuses: StatusItem[] = [
  { userId: 'u1', viewed: false, time: '14:30', emoji: '🌟', text: 'Отличный день!', bg: 'linear-gradient(135deg, #8b5cf6, #06b6d4)' },
  { userId: 'u2', viewed: false, time: '13:15', emoji: '💻', text: 'На работе', bg: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' },
  { userId: 'u3', viewed: true, time: '11:00', emoji: '🎨', text: 'Творческий режим', bg: 'linear-gradient(135deg, #ec4899, #f59e0b)' },
  { userId: 'u6', viewed: false, time: '10:20', emoji: '📸', text: 'Новые фото!', bg: 'linear-gradient(135deg, #10b981, #06b6d4)' },
  { userId: 'u8', viewed: true, time: 'вчера', emoji: '🚀', text: 'Запуск проекта!', bg: 'linear-gradient(135deg, #f59e0b, #ef4444)' },
];

export const mediaItems: MediaItem[] = [
  { id: 'med1', type: 'image', url: 'https://picsum.photos/seed/1/400/400', chatId: 'c1', time: '14:25' },
  { id: 'med2', type: 'image', url: 'https://picsum.photos/seed/2/400/400', chatId: 'c2', time: '13:35' },
  { id: 'med3', type: 'image', url: 'https://picsum.photos/seed/3/400/400', chatId: 'c1', time: '12:10' },
  { id: 'med4', type: 'image', url: 'https://picsum.photos/seed/4/400/400', chatId: 'c4', time: 'вчера' },
  { id: 'med5', type: 'image', url: 'https://picsum.photos/seed/5/400/400', chatId: 'c2', time: 'вчера' },
  { id: 'med6', type: 'image', url: 'https://picsum.photos/seed/6/400/400', chatId: 'c3', time: 'пн' },
  { id: 'med7', type: 'image', url: 'https://picsum.photos/seed/7/400/400', chatId: 'c1', time: 'пн' },
  { id: 'med8', type: 'image', url: 'https://picsum.photos/seed/8/400/400', chatId: 'c4', time: 'вс' },
  { id: 'med9', type: 'image', url: 'https://picsum.photos/seed/9/400/400', chatId: 'c2', time: 'вс' },
];
