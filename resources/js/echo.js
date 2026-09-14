import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

if (typeof window !== 'undefined') {
    window.Pusher = Pusher;
}

const reverbKey = import.meta.env.VITE_REVERB_APP_KEY;
const reverbHost = import.meta.env.VITE_REVERB_HOST || (typeof window !== 'undefined' ? window.location.hostname : 'localhost');
const reverbPort = import.meta.env.VITE_REVERB_PORT ? Number(import.meta.env.VITE_REVERB_PORT) : 8080;
const reverbScheme = import.meta.env.VITE_REVERB_SCHEME || 'http';

export const echo = reverbKey
    ? new Echo({
          broadcaster: 'reverb',
          key: reverbKey,
          wsHost: reverbHost,
          wsPort: reverbPort,
          wssPort: reverbPort,
          forceTLS: reverbScheme === 'https',
          enabledTransports: ['ws', 'wss'],
      })
    : null;

export default echo;
