import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chat } from '@/data/mockData';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

interface CallModalProps {
  chat: Chat;
  callType: 'audio' | 'video';
  onEnd: () => void;
}

type CallState = 'calling' | 'connected' | 'ended';

export default function CallModal({ chat, callType, onEnd }: CallModalProps) {
  const [state, setState] = useState<CallState>('calling');
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speakerOff, setSpeakerOff] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState(true);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const connectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startMedia = useCallback(async () => {
    try {
      const constraints = callType === 'video'
        ? { audio: true, video: { width: 1280, height: 720 } }
        : { audio: true, video: false };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalStream(stream);
      if (localVideoRef.current && callType === 'video') {
        localVideoRef.current.srcObject = stream;
      }
    } catch {
      setHasPermission(false);
    }
  }, [callType]);

  useEffect(() => {
    startMedia();

    // Симуляция ответа через 3 сек
    connectTimerRef.current = setTimeout(() => {
      setState('connected');
      timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);
    }, 3000);

    return () => {
      if (connectTimerRef.current) clearTimeout(connectTimerRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startMedia]);

  const handleEnd = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (connectTimerRef.current) clearTimeout(connectTimerRef.current);
    localStream?.getTracks().forEach(t => t.stop());
    setState('ended');
    setTimeout(onEnd, 600);
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(t => { t.enabled = muted; });
    }
    setMuted(!muted);
  };

  const toggleCamera = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(t => { t.enabled = cameraOff; });
    }
    setCameraOff(!cameraOff);
  };

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      {/* Call card */}
      <div className={`relative w-[360px] rounded-3xl overflow-hidden shadow-2xl animate-scale-in ${
        callType === 'video' ? 'h-[560px]' : 'h-auto'
      }`}>
        {/* Background */}
        {callType === 'video' ? (
          <div className="absolute inset-0 bg-gray-900">
            {/* Remote video placeholder */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
              {state === 'calling' ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <Avatar text={chat.avatar} size="xl" />
                    <div className="absolute inset-0 rounded-2xl border-2 border-purple-500 animate-ping opacity-40" />
                  </div>
                </div>
              ) : (
                <div className="text-white/20 text-sm">Видео собеседника</div>
              )}
            </div>
            {/* Local video preview */}
            {localStream && (
              <div className="absolute bottom-28 right-4 w-24 h-36 rounded-xl overflow-hidden border-2 border-white/20 bg-gray-800">
                {!cameraOff ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-700">
                    <Icon name="VideoOff" size={20} className="text-white/50" />
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-gray-900 to-cyan-950" />
        )}

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center pt-12 pb-8 px-6 h-full">
          {/* Contact info */}
          <div className="flex flex-col items-center gap-3 mb-auto">
            {callType === 'audio' && (
              <div className="relative">
                <div className={`p-1 rounded-2xl ${state === 'calling' ? 'animate-pulse bg-gradient-to-br from-purple-600/40 to-cyan-500/40' : 'bg-gradient-to-br from-purple-600 to-cyan-500'}`}>
                  <Avatar text={chat.avatar} size="xl" />
                </div>
                {state === 'calling' && (
                  <>
                    <div className="absolute inset-0 rounded-2xl border-2 border-purple-500/50 animate-ping" />
                    <div className="absolute -inset-3 rounded-3xl border border-purple-500/20 animate-ping" style={{ animationDelay: '0.3s' }} />
                  </>
                )}
              </div>
            )}
            <div className="text-center mt-2">
              <h2 className="text-xl font-bold text-white">{chat.name}</h2>
              <p className={`text-sm mt-1 ${state === 'connected' ? 'text-green-400' : 'text-white/60'}`}>
                {state === 'calling' && (
                  <span className="flex items-center gap-2 justify-center">
                    <span>Вызов...</span>
                    <span className="flex gap-0.5">
                      {[0,1,2].map(i => (
                        <span key={i} className="w-1 h-1 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </span>
                  </span>
                )}
                {state === 'connected' && `${callType === 'video' ? '📹 Видеозвонок' : '📞 Голосовой'} · ${formatDuration(duration)}`}
                {state === 'ended' && 'Звонок завершён'}
              </p>
            </div>
          </div>

          {/* Permission warning */}
          {!hasPermission && (
            <div className="mb-4 px-4 py-2 rounded-xl bg-red-900/50 border border-red-700/50 text-red-300 text-xs text-center">
              Нет доступа к микрофону{callType === 'video' ? '/камере' : ''}. Проверьте разрешения.
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-auto">
            {/* Mute */}
            <button
              onClick={toggleMute}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                muted ? 'bg-red-600 text-white' : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              <Icon name={muted ? 'MicOff' : 'Mic'} size={22} />
            </button>

            {/* End call */}
            <button
              onClick={handleEnd}
              className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition-all shadow-lg shadow-red-600/40 hover:scale-105"
            >
              <Icon name="PhoneOff" size={26} />
            </button>

            {/* Speaker / Camera */}
            {callType === 'video' ? (
              <button
                onClick={toggleCamera}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                  cameraOff ? 'bg-red-600 text-white' : 'bg-white/15 text-white hover:bg-white/25'
                }`}
              >
                <Icon name={cameraOff ? 'VideoOff' : 'Video'} size={22} />
              </button>
            ) : (
              <button
                onClick={() => setSpeakerOff(!speakerOff)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                  speakerOff ? 'bg-white/10 text-white/40' : 'bg-white/15 text-white hover:bg-white/25'
                }`}
              >
                <Icon name={speakerOff ? 'VolumeX' : 'Volume2'} size={22} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
