'use client';

import { useEffect } from 'react';
import { logger } from '@/lib/utils/logger';

const isDev = process.env.NODE_ENV === 'development';

export function ServiceWorkerRegistration() {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/sw.js')
                .then((registration) => {
                    if (isDev) logger.info('Service Worker registered:', { data: registration.scope });
                })
                .catch((error) => {
                    if (isDev) logger.error('Service Worker registration failed:', { error: error });
                });
        }
    }, []);

    return null;
}
