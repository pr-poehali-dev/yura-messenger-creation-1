import React from 'react';
import { User } from '@/data/mockData';

interface AvatarProps {
  text: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: User['status'];
  isGroup?: boolean;
  emoji?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
};

const gradients = [
  'from-purple-600 to-cyan-500',
  'from-pink-500 to-purple-600',
  'from-cyan-500 to-blue-600',
  'from-orange-500 to-pink-600',
  'from-green-500 to-cyan-500',
  'from-blue-600 to-purple-600',
];

const statusColors: Record<string, string> = {
  online: 'bg-green-400',
  away: 'bg-yellow-400',
  busy: 'bg-red-400',
  offline: 'bg-gray-500',
};

const getGradient = (text: string) => {
  const idx = text.charCodeAt(0) % gradients.length;
  return gradients[idx];
};

export default function Avatar({ text, size = 'md', status, isGroup, emoji, className = '' }: AvatarProps) {
  const sizeClass = sizeMap[size];
  const gradient = getGradient(text);

  return (
    <div className={`relative flex-shrink-0 ${className}`}>
      <div className={`${sizeClass} rounded-2xl flex items-center justify-center font-semibold bg-gradient-to-br ${gradient} text-white`}>
        {text}
      </div>
      {status && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${statusColors[status]}`}
        />
      )}
    </div>
  );
}
