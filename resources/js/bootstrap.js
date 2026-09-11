import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Synchronize Ziggy with the current window origin to prevent external link hard-reloads on different hosts/ports
if (typeof window !== 'undefined' && window.Ziggy) {
    window.Ziggy.url = window.location.origin;
    window.Ziggy.port = window.location.port ? Number(window.location.port) : null;
}
