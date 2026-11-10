import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownProps {
  targetDateStr: string; // ISO string with offset or date string
  timezone?: string;
}

interface TimeRemaining {
  total: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
  isZero: boolean;
}

export const Countdown: React.FC<CountdownProps> = ({ targetDateStr, timezone = 'Asia/Kolkata' }) => {
  const calculateTime = (): TimeRemaining => {
    const target = new Date(targetDateStr).getTime();
    const now = new Date().getTime();
    const diff = target - now;

    if (isNaN(diff)) {
      return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true, isZero: false };
    }

    if (diff <= 0) {
      return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true, isZero: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { total: diff, days, hours, minutes, seconds, isPast: false, isZero: false };
  };

  const [time, setTime] = useState<TimeRemaining>(calculateTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(calculateTime());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDateStr]);

  if (time.isZero) {
    return (
      <div
        className="glass-panel-elevated"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.8rem',
          padding: '1rem 2rem',
          borderRadius: '12px',
          border: '1px solid var(--crimson-bright)',
          boxShadow: '0 0 30px rgba(230, 34, 56, 0.4)'
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.75rem',
            letterSpacing: '0.1em',
            color: 'var(--crimson-bright)'
          }}
        >
          DOOMSDAY IS HERE
        </span>
      </div>
    );
  }

  const units = [
    { label: 'DAYS', value: time.days },
    { label: 'HOURS', value: time.hours },
    { label: 'MINUTES', value: time.minutes },
    { label: 'SECONDS', value: time.seconds }
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.8rem'
      }}
      aria-label="Countdown to Doomsday"
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          fontSize: '0.8rem',
          fontWeight: 700,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--text-ember)'
        }}
      >
        <Clock size={14} />
        <span>COUNTDOWN TO DOOMSDAY ({timezone})</span>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 'clamp(0.5rem, 2vw, 1.25rem)',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}
      >
        {units.map((unit) => (
          <div
            key={unit.label}
            className="glass-panel"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 'clamp(68px, 16vw, 95px)',
              padding: '0.8rem 0.5rem',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              backgroundColor: 'rgba(12, 12, 18, 0.75)'
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(1.5rem, 4vw, 2.3rem)',
                fontWeight: 700,
                color: '#ffffff',
                lineHeight: 1,
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.7)'
              }}
            >
              {String(unit.value).padStart(2, '0')}
            </span>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                color: 'var(--text-secondary)',
                marginTop: '0.35rem'
              }}
            >
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
