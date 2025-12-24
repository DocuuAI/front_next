'use client';

import { useIdleTimer } from 'react-idle-timer';
import { useClerk } from '@clerk/nextjs';

const IDLE_TIME = 30 * 60 * 1000; // 30 minutes

export default function AutoLogout() {
  const { signOut } = useClerk();

  useIdleTimer({
    timeout: IDLE_TIME,
    onIdle: () => {
      signOut({ redirectUrl: '/sign-in' });
    },
    debounce: 500,
  });

  return null;
}