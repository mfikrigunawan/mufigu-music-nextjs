const base = {
  viewBox: '0 0 24 24',
  'aria-hidden': true,
  focusable: false,
} as const;
const line = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

export const PlayIcon = () => (
  <svg {...base} fill="currentColor">
    <path d="M8 5.2v13.6a.9.9 0 0 0 1.4.75l10.2-6.8a.9.9 0 0 0 0-1.5L9.4 4.45A.9.9 0 0 0 8 5.2z" />
  </svg>
);

export const PauseIcon = () => (
  <svg {...base} fill="currentColor">
    <rect x="6" y="4.5" width="4.2" height="15" rx="1.2" />
    <rect x="13.8" y="4.5" width="4.2" height="15" rx="1.2" />
  </svg>
);

export const PrevIcon = () => (
  <svg {...base} fill="currentColor">
    <rect x="5" y="5" width="2.4" height="14" rx="1.1" />
    <path d="M19 6.2v11.6a.8.8 0 0 1-1.25.66L9.4 12.66a.8.8 0 0 1 0-1.32l8.35-5.8A.8.8 0 0 1 19 6.2z" />
  </svg>
);

export const NextIcon = () => (
  <svg {...base} fill="currentColor">
    <rect x="16.6" y="5" width="2.4" height="14" rx="1.1" />
    <path d="M5 6.2v11.6a.8.8 0 0 0 1.25.66l8.35-5.8a.8.8 0 0 0 0-1.32l-8.35-5.8A.8.8 0 0 0 5 6.2z" />
  </svg>
);

export const ShuffleIcon = () => (
  <svg {...base} {...line}>
    <path d="M3 7h3a4 4 0 0 1 3.3 1.8l4.4 6.4A4 4 0 0 0 17 17h4" />
    <path d="M3 17h3a4 4 0 0 0 3.3-1.8M13.7 8.8A4 4 0 0 1 17 7h4" />
    <path d="M18 4l3 3-3 3M18 14l3 3-3 3" />
  </svg>
);

export const RepeatIcon = () => (
  <svg {...base} {...line}>
    <path d="M4 12V10a3 3 0 0 1 3-3h13M17 4l3 3-3 3" />
    <path d="M20 12v2a3 3 0 0 1-3 3H4M7 20l-3-3 3-3" />
  </svg>
);

export const RepeatOneIcon = () => (
  <svg {...base} {...line}>
    <path d="M4 12V10a3 3 0 0 1 3-3h13M17 4l3 3-3 3" />
    <path d="M20 12v2a3 3 0 0 1-3 3H4M7 20l-3-3 3-3" />
    <path d="M11 10.5l1.4-1v6" />
  </svg>
);

export const VolumeIcon = () => (
  <svg {...base} {...line}>
    <path d="M4 9.5h3l4.5-3.8v12.6L7 14.5H4z" fill="currentColor" />
    <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" />
  </svg>
);

export const MuteIcon = () => (
  <svg {...base} {...line}>
    <path d="M4 9.5h3l4.5-3.8v12.6L7 14.5H4z" fill="currentColor" />
    <path d="M16 9.5l5 5M21 9.5l-5 5" />
  </svg>
);

export const ArrowUpRightIcon = () => (
  <svg {...base} {...line}>
    <path d="M7 17L17 7M8.5 7H17v8.5" />
  </svg>
);
