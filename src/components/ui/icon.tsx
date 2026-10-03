import type { ReactNode } from "react";
import type { IconName } from "@/types/portfolio";

// The icons carry their own colours, so they read the same in light and dark mode.
const C = {
  blue: "#5b9bd5",
  blueDark: "#2f6ea8",
  blueLight: "#b5d3ee",
  green: "#7fb77e",
  greenDark: "#4c8a4b",
  greenLight: "#b5d9b0",
  orange: "#f0a35e",
  orangeDark: "#d8742a",
  purple: "#9282cc",
  purpleDark: "#5f4bb0",
  yellow: "#f6c453",
  paper: "#ece6d9",
  rule: "#b9b2a3",
  dark: "#33312d",
  skin: "#c98a5e",
  white: "#ffffff",
};

const line = { fill: "none", strokeLinecap: "round", strokeLinejoin: "round" } as const;

const hexagon = (cx: number, cy: number, r: number) =>
  Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    return `${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`;
  }).join(" ");

const page = (
  <>
    <rect x="6" y="4" width="16" height="22" rx="2.5" fill={C.paper} />
    <path d="M9.5 9.5h9M9.5 13.5h9M9.5 17.5h5" stroke={C.rule} strokeWidth="1.7" {...line} />
  </>
);

const tick = (cx: number, cy: number) => (
  <>
    <circle cx={cx} cy={cy} r="5" fill={C.green} />
    <path d={`M${cx - 2.3} ${cy}l1.7 1.7 3-3.3`} stroke={C.white} strokeWidth="1.7" {...line} />
  </>
);

const ART: Record<IconName, ReactNode> = {
  layout: (
    <>
      <rect x="4" y="5" width="24" height="20" rx="3.5" fill={C.dark} />
      <path d="M4 8.5A3.5 3.5 0 0 1 7.5 5h17A3.5 3.5 0 0 1 28 8.5V11H4z" fill={C.blue} />
      <rect x="7" y="13.5" width="8.5" height="8.5" rx="1.5" fill={C.orange} />
      <rect x="17.5" y="13.5" width="7.5" height="3.4" rx="1.2" fill={C.paper} />
      <rect x="17.5" y="18.6" width="7.5" height="3.4" rx="1.2" fill={C.orangeDark} />
    </>
  ),
  server: (
    <>
      <rect x="5" y="4.5" width="22" height="6" rx="2.2" fill={C.blue} />
      <rect x="5" y="12" width="22" height="6" rx="2.2" fill={C.blueLight} />
      <rect x="5" y="19.5" width="22" height="6" rx="2.2" fill={C.blue} />
      <path d="M9 7.5h8M9 15h8M9 22.5h6" stroke={C.white} strokeWidth="1.6" {...line} />
      <circle cx="23" cy="7.5" r="1.2" fill={C.white} />
      <circle cx="23" cy="15" r="1.2" fill={C.blueDark} />
      <circle cx="23.5" cy="22.5" r="2.6" fill={C.green} />
    </>
  ),
  database: (
    <>
      <path d="M6 9v13.5c0 2.3 4.5 4 10 4s10-1.7 10-4V9z" fill={C.green} />
      <ellipse cx="16" cy="9" rx="10" ry="4.2" fill={C.greenLight} />
      <path
        d="M6 14c0 2.3 4.5 4 10 4s10-1.7 10-4M6 18.5c0 2.3 4.5 4 10 4s10-1.7 10-4"
        stroke={C.greenDark}
        strokeWidth="1.3"
        {...line}
      />
    </>
  ),
  cloud: (
    <>
      <path d="M11 24.5v-5M15 26v-6.5M19 24.5v-5M23 26v-6.5" stroke={C.blue} strokeWidth="2.2" {...line} />
      <path d="M9.5 20.5a5.5 5.5 0 0 1-.6-10.97A7.6 7.6 0 0 1 23.6 11a4.8 4.8 0 0 1-.6 9.5z" fill={C.paper} />
      <path d="M4.3 17.1h23.3a4.8 4.8 0 0 1-4.6 3.4H9.5a5.5 5.5 0 0 1-5.2-3.4z" fill={C.rule} opacity="0.55" />
    </>
  ),
  cpu: (
    <>
      <path
        d="M12 3.5v4M16 3.5v4M20 3.5v4M12 23.5v4M16 23.5v4M20 23.5v4M4 11.5h4M4 15.5h4M4 19.5h4M24 11.5h4M24 15.5h4M24 19.5h4"
        stroke={C.purple}
        strokeWidth="1.7"
        {...line}
      />
      <rect x="7" y="6.5" width="18" height="18" rx="3.5" fill={C.purple} />
      <rect x="10.5" y="10" width="11" height="11" rx="2" fill={C.dark} />
      <path d="M16 11.8l1.1 2.6 2.6 1.1-2.6 1.1-1.1 2.6-1.1-2.6-2.6-1.1 2.6-1.1z" fill={C.yellow} />
    </>
  ),
  boxes: (
    <>
      <path d="M10.5 10l5.5 9.5 5.5-9.5z" stroke={C.rule} strokeWidth="1.5" {...line} />
      <polygon points={hexagon(10, 9.5, 5.5)} fill={C.green} />
      <polygon points={hexagon(22, 9.5, 5.5)} fill={C.blue} />
      <polygon points={hexagon(16, 20.5, 5.5)} fill={C.orange} />
      <circle cx="16" cy="20.5" r="1.7" fill={C.white} />
    </>
  ),
  shield: (
    <>
      <path d="M16 3.5l9.5 3.6v7.2c0 6-3.9 10.4-9.5 12.7-5.6-2.3-9.5-6.7-9.5-12.7V7.1z" fill={C.blue} />
      <path d="M16 3.5l9.5 3.6v7.2c0 6-3.9 10.4-9.5 12.7z" fill={C.blueDark} opacity="0.4" />
      <path d="M11.3 15.2l3.3 3.3 6.2-6.6" stroke={C.white} strokeWidth="2.4" {...line} />
    </>
  ),
  receipt: (
    <>
      {page}
      {tick(22, 21)}
    </>
  ),
  sparkles: (
    <>
      <path d="M13 4l2.6 6.9 6.9 2.6-6.9 2.6L13 23l-2.6-6.9-6.9-2.6 6.9-2.6z" fill={C.purple} />
      <path d="M23.5 4.5l1.1 3 3 1.1-3 1.1-1.1 3-1.1-3-3-1.1 3-1.1z" fill={C.orange} />
      <path d="M23 18l1.2 3.3 3.3 1.2-3.3 1.2L23 27l-1.2-3.3-3.3-1.2 3.3-1.2z" fill={C.blue} />
    </>
  ),
  search: (
    <>
      {page}
      <path d="M22.5 22.5l4.5 4.5" stroke={C.dark} strokeWidth="2.6" {...line} />
      <circle cx="19.5" cy="19.5" r="5" fill={C.blueLight} stroke={C.blueDark} strokeWidth="2" />
    </>
  ),
  compass: (
    <>
      <rect x="4" y="6" width="21" height="17" rx="3" fill={C.blue} />
      <rect x="7" y="9.5" width="5.5" height="4" rx="1" fill={C.white} />
      <rect x="15" y="15.5" width="5.5" height="4" rx="1" fill={C.white} />
      <path d="M12.5 11.5h5.3v4" stroke={C.white} strokeWidth="1.4" {...line} />
      <path d="M18.5 23.5l8-10.5 2.8 2.1-8 10.5-3.7 1.4z" fill={C.orange} />
      <path d="M18.5 23.5l2.8 2.1-3.7 1.4z" fill={C.dark} />
    </>
  ),
  wrench: (
    <>
      <circle cx="14" cy="14" r="8" fill="none" stroke={C.green} strokeWidth="4" strokeDasharray="3.5 2.78" />
      <circle cx="14" cy="14" r="6.5" fill={C.green} />
      <circle cx="14" cy="14" r="2.6" fill={C.dark} />
      <path d="M18 18l8 8" stroke={C.orangeDark} strokeWidth="3.4" {...line} />
    </>
  ),
  gauge: (
    <>
      <path d="M4 22a12 12 0 0 1 24 0z" fill={C.purple} />
      <path d="M4 22a12 12 0 0 1 3.5-8.5l4.3 4.3A6 6 0 0 0 10 22z" fill={C.green} />
      <path d="M28 22a12 12 0 0 0-3.5-8.5l-4.3 4.3A6 6 0 0 1 22 22z" fill={C.orangeDark} />
      <path d="M10 22a6 6 0 0 1 12 0z" fill={C.paper} />
      <path d="M16 22l5.5-8" stroke={C.dark} strokeWidth="2" {...line} />
      <circle cx="16" cy="22" r="2.2" fill={C.dark} />
    </>
  ),
  repeat: (
    <>
      <rect x="6" y="11" width="7" height="7" rx="1.3" fill={C.orange} />
      <rect x="15" y="11" width="7" height="7" rx="1.3" fill={C.orangeDark} />
      <rect x="3.5" y="19" width="25" height="6.5" rx="3.25" fill={C.dark} />
      <path d="M8 22.25h.01M13.3 22.25h.01M18.6 22.25h.01M24 22.25h.01" stroke={C.paper} strokeWidth="2.2" {...line} />
      <circle cx="25" cy="8" r="4.5" fill={C.blue} />
      <path d="M23.2 8a1.8 1.8 0 1 1 1.8 1.8" stroke={C.white} strokeWidth="1.3" {...line} />
    </>
  ),
  rocket: (
    <>
      <path d="M12.5 21h7l-1.2 5.5-2.3-2-2.3 2z" fill={C.orange} />
      <path d="M10.5 14.5L6 21.5l4.5-1zM21.5 14.5l4.5 7-4.5-1z" fill={C.orangeDark} />
      <path d="M16 2.5c4.2 3.2 5.5 8 5.5 12.5v6h-11v-6c0-4.5 1.3-9.3 5.5-12.5z" fill={C.paper} />
      <path d="M16 2.5c4.2 3.2 5.5 8 5.5 12.5v6H16z" fill={C.rule} opacity="0.35" />
      <circle cx="16" cy="12" r="2.8" fill={C.blue} />
    </>
  ),
  user: (
    <>
      <path d="M3.5 26.5a9 9 0 0 1 18 0z" fill={C.blue} />
      <circle cx="12.5" cy="11.5" r="5" fill={C.skin} />
      <path d="M7.5 11a5 5 0 0 1 10 0c-1.8-.2-3.1-1.1-3.8-2.3-1.1 1.5-3.2 2.3-6.2 2.3z" fill={C.dark} />
      <rect x="19" y="4" width="10" height="7" rx="2.5" fill={C.paper} />
      <path d="M22 7.5h.01M24 7.5h.01M26 7.5h.01" stroke={C.dark} strokeWidth="1.3" {...line} />
    </>
  ),
  phone: (
    <>
      <rect x="8.5" y="3" width="15" height="24" rx="3.5" fill={C.purple} />
      <rect x="10.5" y="6" width="11" height="15.5" rx="1.5" fill={C.dark} />
      <rect x="12.5" y="8.5" width="7" height="2.6" rx="1.3" fill={C.orange} />
      <rect x="12.5" y="13" width="5" height="2.6" rx="1.3" fill={C.blueLight} />
      <rect x="12.5" y="17.5" width="7" height="1.8" rx="0.9" fill={C.rule} />
      <circle cx="16" cy="24.2" r="1.1" fill={C.white} />
    </>
  ),
  lock: (
    <>
      {page}
      <path d="M19.5 18.5v-2a3 3 0 0 1 6 0v2" stroke={C.orangeDark} strokeWidth="1.9" {...line} />
      <rect x="17.5" y="18.5" width="10" height="8.5" rx="2.2" fill={C.orange} />
      <circle cx="22.5" cy="22.7" r="1.4" fill={C.dark} />
    </>
  ),
  braces: (
    <>
      <rect x="4" y="4.5" width="20" height="20" rx="4.5" fill={C.orange} />
      <path
        d="M12 9.5c-1.7 0-2.2.9-2.2 2.2v1.2c0 1-.5 1.6-1.5 1.6 1 0 1.5.6 1.5 1.6v1.2c0 1.3.5 2.2 2.2 2.2M16 9.5c1.7 0 2.2.9 2.2 2.2v1.2c0 1 .5 1.6 1.5 1.6-1 0-1.5.6-1.5 1.6v1.2c0 1.3-.5 2.2-2.2 2.2"
        stroke={C.white}
        strokeWidth="1.7"
        {...line}
      />
      {tick(23, 22)}
    </>
  ),
  check: (
    <>
      <path
        d="M3.5 8.5A2.5 2.5 0 0 1 6 6h17a2.5 2.5 0 0 1 2.5 2.5v3a2.5 2.5 0 0 0 0 5v3A2.5 2.5 0 0 1 23 22H6a2.5 2.5 0 0 1-2.5-2.5v-3a2.5 2.5 0 0 0 0-5z"
        fill={C.paper}
      />
      <path d="M8 11h7M8 14.5h5" stroke={C.rule} strokeWidth="1.7" {...line} />
      <path d="M18.5 7.5v13" stroke={C.rule} strokeWidth="1.3" strokeDasharray="1.6 1.8" {...line} />
      {tick(23.5, 21.5)}
    </>
  ),
  pin: (
    <>
      <path d="M16 3c-5 0-8.5 3.6-8.5 8.2C7.5 17 16 26.5 16 26.5S24.5 17 24.5 11.2C24.5 6.6 21 3 16 3z" fill={C.orangeDark} />
      <path d="M16 3c5 0 8.5 3.6 8.5 8.2 0 5.8-8.5 15.3-8.5 15.3z" fill={C.orange} />
      <circle cx="16" cy="11.5" r="3.5" fill={C.white} />
    </>
  ),
  clock: (
    <>
      <circle cx="16" cy="15" r="11.5" fill={C.blue} />
      <circle cx="16" cy="15" r="8.5" fill={C.white} />
      <path d="M16 9.5V15l3.8 2.2" stroke={C.dark} strokeWidth="1.9" {...line} />
    </>
  ),
  send: (
    <>
      <path d="M3.5 14L28 4.5 20.5 26l-5.3-8.7z" fill={C.green} />
      <path d="M28 4.5L15.2 17.3l5.3 8.7z" fill={C.greenDark} />
      <path d="M15.2 17.3V24l3-3.8z" fill={C.dark} opacity="0.45" />
    </>
  ),
  laptop: (
    <>
      <rect x="5.5" y="5" width="21" height="15" rx="2.5" fill={C.dark} />
      <rect x="8" y="7.5" width="16" height="10" rx="1" fill={C.blueDark} />
      <path d="M11 10.5l2.5 2-2.5 2M15.5 14.5H20" stroke={C.orange} strokeWidth="1.5" {...line} />
      <path d="M2.5 21h27l-1.8 4.2a1.5 1.5 0 0 1-1.4.8H5.7a1.5 1.5 0 0 1-1.4-.8z" fill={C.rule} />
    </>
  ),
  mail: (
    <>
      <rect x="8" y="3.5" width="16" height="14" rx="2" fill={C.paper} />
      <path d="M11 8h10M11 11.5h7" stroke={C.rule} strokeWidth="1.6" {...line} />
      <path d="M3.5 12L16 20.5 28.5 12v12a2.5 2.5 0 0 1-2.5 2.5H6A2.5 2.5 0 0 1 3.5 24z" fill={C.orange} />
      <path d="M3.5 24l9.5-6.2 3 2.7 3-2.7 9.5 6.2a2.5 2.5 0 0 1-2.5 2.5H6A2.5 2.5 0 0 1 3.5 24z" fill={C.orangeDark} />
    </>
  ),
  briefcase: (
    <>
      <path d="M11.5 9V7.5A2.5 2.5 0 0 1 14 5h4a2.5 2.5 0 0 1 2.5 2.5V9" stroke={C.purpleDark} strokeWidth="2" {...line} />
      <rect x="3.5" y="9" width="25" height="17" rx="3.5" fill={C.purple} />
      <path d="M3.5 12.5A3.5 3.5 0 0 1 7 9h18a3.5 3.5 0 0 1 3.5 3.5V15a2.5 2.5 0 0 1-2.5 2.5H6A2.5 2.5 0 0 1 3.5 15z" fill={C.purpleDark} opacity="0.55" />
      <rect x="13.5" y="15" width="5" height="4.5" rx="1.2" fill={C.orange} />
    </>
  ),
  layers: (
    <>
      <path d="M16 15.5l12 5.2-12 5.3-12-5.3z" fill={C.green} />
      <path d="M16 10l12 5.2-12 5.3-12-5.3z" fill={C.orange} />
      <path d="M16 4.5l12 5.2L16 15 4 9.7z" fill={C.blue} />
    </>
  ),
  zap: (
    <>
      <path d="M18.5 2.5l-12 14h7.8L12 27.5l13.5-15h-8z" fill={C.yellow} />
      <path d="M18.5 2.5l-1 10h8L12 27.5l2.3-11z" fill={C.orange} />
    </>
  ),
  network: (
    <>
      <path d="M16 11v4.5M8 19.5v-4h16v4" stroke={C.rule} strokeWidth="1.8" {...line} />
      <rect x="11" y="3.5" width="10" height="8" rx="2.2" fill={C.purple} />
      <rect x="3" y="18.5" width="10" height="8" rx="2.2" fill={C.blue} />
      <rect x="19" y="18.5" width="10" height="8" rx="2.2" fill={C.green} />
    </>
  ),
  radio: (
    <>
      <path d="M7 5.5a13.5 13.5 0 0 0 0 19M25 5.5a13.5 13.5 0 0 1 0 19" stroke={C.blueLight} strokeWidth="2.4" {...line} />
      <path d="M11 9.5a8 8 0 0 0 0 11M21 9.5a8 8 0 0 1 0 11" stroke={C.blue} strokeWidth="2.4" {...line} />
      <circle cx="16" cy="15" r="3.6" fill={C.orangeDark} />
    </>
  ),
  chat: (
    <>
      <path d="M5.5 4.5h12a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H11l-4.5 3.8v-3.8h-1a3 3 0 0 1-3-3v-6a3 3 0 0 1 3-3z" fill={C.blue} />
      <path d="M7.5 10.5h.01M11.5 10.5h.01M15.5 10.5h.01" stroke={C.white} strokeWidth="2" {...line} />
      <path d="M16 13.5h10.5A2.5 2.5 0 0 1 29 16v5.5a2.5 2.5 0 0 1-2.5 2.5h-1v3.3L21.5 24H16a2.5 2.5 0 0 1-2.5-2.5V16a2.5 2.5 0 0 1 2.5-2.5z" fill={C.purple} />
      <path d="M17.5 17.5H25M17.5 20.5h5" stroke={C.white} strokeWidth="1.5" {...line} />
    </>
  ),
  container: (
    <>
      <rect x="6.5" y="10.5" width="6" height="5" rx="1.2" fill={C.blueLight} />
      <rect x="13.5" y="10.5" width="6" height="5" rx="1.2" fill={C.blue} />
      <rect x="13.5" y="4.5" width="6" height="5" rx="1.2" fill={C.orange} />
      <rect x="20.5" y="10.5" width="6" height="5" rx="1.2" fill={C.blueLight} />
      <path d="M2.5 17h27c0 5.3-4.3 9-10 9h-7c-5.7 0-10-3.7-10-9z" fill={C.blueDark} />
      <path d="M8 21.5h.01M12 21.5h.01" stroke={C.white} strokeWidth="1.8" {...line} />
    </>
  ),
};

/** A small colour illustration standing on its own shadow. */
export function Icon({ name, className = "size-7" }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={`shrink-0 ${className}`}>
      <ellipse cx="16" cy="29.5" rx="8.5" ry="1.5" className="fill-ink/15" />
      {ART[name]}
    </svg>
  );
}
