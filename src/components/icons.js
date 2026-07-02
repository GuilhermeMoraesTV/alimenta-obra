const ICON_PATHS = {
  home: `<path d="M4 10.8 12 4l8 6.8"/><path d="M6.4 9.7v9.1h11.2V9.7"/><path d="M10 18.8v-5h4v5"/>`,
  clipboard: `<rect x="6" y="4.8" width="12" height="15.2" rx="2.4"/><path d="M9.3 6.2h5.4"/><path d="M9.2 11h5.6M9.2 14.3h5.6M9.2 17.5h3.2"/>`,
  dashboard: `<path d="M4.5 11.6a7.5 7.5 0 1 1 15 0"/><path d="M6.8 17.8h10.4"/><path d="m12 12.1 3.2-3.2"/><path d="M7.7 11.6h.1M16.2 11.6h.1M9.2 8.5h.1M14.8 8.5h.1"/>`,
  package: `<path d="m4.8 7.4 7.2-3.6 7.2 3.6-7.2 3.7-7.2-3.7Z"/><path d="M5 7.6v8.6l7 4 7-4V7.6"/><path d="M12 11.2v8.8"/><path d="m8.2 5.7 7.3 3.7"/>`,
  chart: `<path d="M4 19.5h16"/><rect x="5.5" y="11" width="2.8" height="6" rx=".9"/><rect x="10.6" y="6" width="2.8" height="11" rx=".9"/><rect x="15.7" y="9" width="2.8" height="8" rx=".9"/>`,
  history: `<path d="M5.2 8.3A7.8 7.8 0 1 1 4.4 14"/><path d="M4.4 5.2v4.1h4.1"/><path d="M12 8.2v4.2l2.8 1.7"/>`,
  filter: `<path d="M4.5 6.5h15"/><path d="M7.5 12h9"/><path d="M10.2 17.5h3.6"/><circle cx="8" cy="6.5" r="1.4"/><circle cx="15.8" cy="12" r="1.4"/>`,
  truck: `<path d="M3.8 7h9.9v8.1H3.8z"/><path d="M13.7 10h3.8l2.7 3.3v1.8h-6.5z"/><path d="M6.8 17.5a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6ZM17.5 17.5a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6Z"/>`,
  plus: `<path d="M12 5.5v13M5.5 12h13"/>`,
  arrow: `<path d="M5 12h13.5"/><path d="m13.8 6.8 5.2 5.2-5.2 5.2"/>`,
  "arrow-left": `<path d="M19 12H5.5"/><path d="M10.2 6.8 5 12l5.2 5.2"/>`,
  check: `<path d="m4.8 12.6 4.4 4.4 10-10"/>`,
  "dollar-sign": `<path d="M12 3.8v16.4"/><path d="M16.5 7.2c-.9-.8-2.2-1.3-3.8-1.3-2.2 0-3.7 1.1-3.7 2.8 0 3.8 7.5 2 7.5 5.8 0 1.7-1.5 2.9-3.9 2.9-1.9 0-3.5-.6-4.7-1.7"/>`,
  inbox: `<path d="M4.8 5.4h14.4l1.4 8.2v4a2 2 0 0 1-2 2H5.4a2 2 0 0 1-2-2v-4Z"/><path d="M4.1 13.6h4.3l1.2 2.1h4.8l1.2-2.1h4.3"/>`,
  box: `<path d="m4.8 7.4 7.2-3.6 7.2 3.6-7.2 3.7-7.2-3.7Z"/><path d="M5 7.6v8.6l7 4 7-4V7.6"/><path d="M12 11.2v8.8"/>`,
  moon: `<path d="M18.4 15.5A7.4 7.4 0 0 1 8.5 5.6 8.2 8.2 0 1 0 18.4 15.5Z"/>`,
  clock: `<circle cx="12" cy="12" r="8.2"/><path d="M12 7.8v4.6l3 1.7"/>`,
  utensils: `<path d="M7 4v7.2M4.8 4v4.8c0 1.8 1 2.9 2.2 2.9s2.2-1.1 2.2-2.9V4M7 11.7V20"/><path d="M15.5 4v16"/><path d="M15.5 4c2.5.8 4 3.2 4 6.2h-4"/>`,
  map: `<path d="m4 6.2 5.3-2.1 5.4 2.1L20 4.1v13.7l-5.3 2.1-5.4-2.1L4 19.9V6.2Z"/><path d="M9.3 4.1v13.7M14.7 6.2v13.7"/>`,
  users: `<circle cx="9.2" cy="8.2" r="2.8"/><path d="M3.8 19.5c.5-3.5 2.5-5.6 5.4-5.6s4.9 2.1 5.4 5.6"/><path d="M15.4 6.1a2.6 2.6 0 0 1 0 5.1M16.4 14.1c2 .7 3.3 2.6 3.7 5.4"/>`,
  logout: `<path d="M10.2 5H5.4v14h4.8"/><path d="M14.8 8.2 18.6 12l-3.8 3.8"/><path d="M8.8 12h9.4"/>`,
  settings: `<circle cx="12" cy="12" r="3.1"/><path d="M18.6 13.3c.1-.4.1-.8.1-1.3s0-.9-.1-1.3l2-1.5-2-3.4-2.4 1a7 7 0 0 0-2.2-1.3L13.7 3h-3.4L10 5.5a7 7 0 0 0-2.2 1.3l-2.4-1-2 3.4 2 1.5c-.1.4-.1.8-.1 1.3s0 .9.1 1.3l-2 1.5 2 3.4 2.4-1c.7.6 1.4 1 2.2 1.3l.3 2.5h3.4l.3-2.5c.8-.3 1.5-.7 2.2-1.3l2.4 1 2-3.4-2-1.5Z"/>`,
  eye: `<path d="M3.2 12s3.1-5.2 8.8-5.2 8.8 5.2 8.8 5.2-3.1 5.2-8.8 5.2S3.2 12 3.2 12Z"/><circle cx="12" cy="12" r="2.7"/>`,
  edit: `<path d="m4.5 19.5 4.2-1 9.5-9.5-3.2-3.2-9.5 9.5-1 4.2Z"/><path d="m13.8 7 3.2 3.2"/>`,
  trash: `<path d="M5 7.2h14M9.2 7.2V4.8h5.6v2.4M7.2 7.2l.8 12h8l.8-12M10.3 11v5M13.7 11v5"/>`
};

export function icon(name, size = 18) {
  return `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICON_PATHS[name] ?? ICON_PATHS.clipboard}</svg>`;
}
