'use client';

import { useLanguage, type Locale } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'pill' | 'dropdown';
}

export function LanguageSwitcher({ className, variant = 'pill' }: LanguageSwitcherProps) {
  const { locale, setLocale } = useLanguage();

  if (variant === 'pill') {
    return (
      <div
        className={cn(
          'inline-flex items-center rounded-full p-0.5 text-xs font-medium',
          'bg-white/[0.08] border border-white/[0.1]',
          className
        )}
      >
        <button
          onClick={() => setLocale('mn')}
          className={cn(
            'px-2.5 py-1 rounded-full transition-all duration-200',
            locale === 'mn'
              ? 'bg-white/[0.15] text-white shadow-sm'
              : 'text-white/40 hover:text-white/60'
          )}
        >
          MN
        </button>
        <button
          onClick={() => setLocale('en')}
          className={cn(
            'px-2.5 py-1 rounded-full transition-all duration-200',
            locale === 'en'
              ? 'bg-white/[0.15] text-white shadow-sm'
              : 'text-white/40 hover:text-white/60'
          )}
        >
          EN
        </button>
      </div>
    );
  }

  return null;
}

/**
 * Light variant for login/setup pages with light backgrounds
 */
export function LanguageSwitcherLight({ className }: { className?: string }) {
  const { locale, setLocale } = useLanguage();

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full p-0.5 text-xs font-medium',
        'bg-gray-100 border border-gray-200',
        className
      )}
    >
      <button
        onClick={() => setLocale('mn')}
        className={cn(
          'px-2.5 py-1 rounded-full transition-all duration-200',
          locale === 'mn'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-400 hover:text-gray-600'
        )}
      >
        MN
      </button>
      <button
        onClick={() => setLocale('en')}
        className={cn(
          'px-2.5 py-1 rounded-full transition-all duration-200',
          locale === 'en'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-400 hover:text-gray-600'
        )}
      >
        EN
      </button>
    </div>
  );
}
