export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export const googleConfig = {
  client_id: GOOGLE_CLIENT_ID,
  cookie_policy: 'single_host_origin',
  ux_mode: 'popup',
  scope: 'openid email profile',
  allowed_parent_origin: [
    'https://neevjob.netlify.app/',
    window.location.origin
  ],
};