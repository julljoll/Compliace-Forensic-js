import type React from 'react';

/**
 * 🎨 SHA256.US — Material Design Vector Iconography System
 * SVG Icon set built strictly on 24x24 Material Design grid tokens.
 */

export interface IconProps {
  size?: number;
  className?: string;
  strokeWidth?: number;
  fill?: string;
  style?: React.CSSProperties;
}

export type CMSIcon = (props: IconProps) => React.JSX.Element;

function SVGIcon({
  children,
  size = 20,
  className = '',
  style,
  strokeWidth = 2,
  fill = 'none',
  viewBox = '0 0 24 24',
}: IconProps & { children: React.ReactNode; viewBox?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill={fill}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 align-middle ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: 'inline-block',
        verticalAlign: 'middle',
        flexShrink: 0,
        ...style,
      }}
    >
      {children}
    </svg>
  );
}

// ── Hardware & Devices (Material Design) ──────────────────────────────────
export function Laptop(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <rect x="3" y="4" width="18" height="12" rx="2" ry="2" />
      <path d="M2 20h20" />
      <path d="M7 16h10" />
    </SVGIcon>
  );
}

// ── Navigation (Material Design) ──────────────────────────────────────────
export function ArrowLeft(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </SVGIcon>
  );
}
export function ArrowRight(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
    </SVGIcon>
  );
}
export function ChevronDown(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M6 9l6 6 6-6" />
    </SVGIcon>
  );
}
export function ChevronUp(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M18 15l-6-6-6 6" />
    </SVGIcon>
  );
}
export function ChevronRight(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M9 18l6-6-6-6" />
    </SVGIcon>
  );
}
export function Home(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M3 10l9-7 9 7v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
      <path d="M9 21V12h6v9" />
    </SVGIcon>
  );
}
export function LogOut(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </SVGIcon>
  );
}
export function ExternalLink(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <path d="M15 3h6v6" />
      <path d="M10 14L21 3" />
    </SVGIcon>
  );
}

// ── Actions (Material Design) ─────────────────────────────────────────────
export function Plus(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </SVGIcon>
  );
}
export function PlusCircle(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8" />
      <path d="M8 12h8" />
    </SVGIcon>
  );
}
export function X(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </SVGIcon>
  );
}
export function XCircle(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M15 9l-6 6" />
      <path d="M9 9l6 6" />
    </SVGIcon>
  );
}
export function Circle(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <circle cx="12" cy="12" r="9" />
    </SVGIcon>
  );
}
export function Check(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M20 6L9 17l-5-5" />
    </SVGIcon>
  );
}
export function CheckCheck(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M18 6L7 17l-5-5" />
      <path d="M22 10l-7.5 7.5L13 16" />
    </SVGIcon>
  );
}
export function CheckCircle2(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 12l2 2 4-4" />
    </SVGIcon>
  );
}
export function CheckSquare(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </SVGIcon>
  );
}
export function Square(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </SVGIcon>
  );
}
export function Trash2(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </SVGIcon>
  );
}
export function Edit(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </SVGIcon>
  );
}
export function Copy(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </SVGIcon>
  );
}
export function Search(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
    </SVGIcon>
  );
}
export function Filter(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </SVGIcon>
  );
}
export function Printer(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M6 9V2h12v7" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" rx="1" />
    </SVGIcon>
  );
}
export function Play(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <polygon points="5 3 19 12 5 21 5 3" />
    </SVGIcon>
  );
}
export function Pause(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
    </SVGIcon>
  );
}
export function RefreshCw(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M23 4v6h-6" />
      <path d="M1 20v-6h6" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </SVGIcon>
  );
}
export function RotateCcw(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M1 4v6h6" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </SVGIcon>
  );
}
export function Zap(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </SVGIcon>
  );
}

// ── Status & Alerts (Material Design) ─────────────────────────────────────
export function AlertCircle(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </SVGIcon>
  );
}
export function AlertTriangle(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </SVGIcon>
  );
}
export function AlertOctagon(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </SVGIcon>
  );
}
export function Info(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </SVGIcon>
  );
}

// ── Files & Documents (Material Design) ───────────────────────────────────
export function FileText(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
      <path d="M10 9H8" />
    </SVGIcon>
  );
}
export function FileSearch(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <circle cx="11.5" cy="14.5" r="2.5" />
      <path d="M13.25 16.25L15 18" />
    </SVGIcon>
  );
}
export function FileCheck(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M9 15l2 2 4-4" />
    </SVGIcon>
  );
}
export function ClipboardList(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11h4" />
      <path d="M12 16h4" />
      <path d="M8 11h.01" />
      <path d="M8 16h.01" />
    </SVGIcon>
  );
}
export function FolderOpen(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      <path d="M2 10h20" />
    </SVGIcon>
  );
}
export function BookOpen(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </SVGIcon>
  );
}
export function Book(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </SVGIcon>
  );
}

// ── People (Material Design) ──────────────────────────────────────────────
export function User(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </SVGIcon>
  );
}
export function Users(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M17 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M9 21v-2a4 4 0 0 0-4-4H3a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </SVGIcon>
  );
}
export function UserPlus(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <path d="M20 8v6" />
      <path d="M23 11h-6" />
    </SVGIcon>
  );
}

// ── Security & Forensics (Material Design) ────────────────────────────────
export function Shield(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </SVGIcon>
  );
}
export function ShieldCheck(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </SVGIcon>
  );
}
export function ShieldAlert(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </SVGIcon>
  );
}
export function ShieldOff(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M19.69 14a6.9 6.9 0 0 0 .31-2V5l-8-3-3.11 1.17" />
      <path d="M4.73 4.73L4 5v7c0 6 8 10 8 10a20.29 20.29 0 0 0 5.62-4.38" />
      <path d="M1 1l22 22" />
    </SVGIcon>
  );
}
export function Lock(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </SVGIcon>
  );
}
export function Fingerprint(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M12 2a10 10 0 0 0-10 10c0 3.3 1.6 6.3 4 8.2" />
      <path d="M12 6a6 6 0 0 0-6 6c0 2 1 3.8 2.5 5" />
      <path d="M12 10a2 2 0 0 0-2 2c0 .8.4 1.5 1 2" />
      <path d="M12 14v4" />
      <path d="M16 10a6 6 0 0 1 6 6" />
    </SVGIcon>
  );
}
export function Eye(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </SVGIcon>
  );
}
export function EyeOff(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <path d="M1 1l22 22" />
    </SVGIcon>
  );
}

// ── Communication (Material Design) ──────────────────────────────────────
export function Mail(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 6l9 6 9-6" />
    </SVGIcon>
  );
}
export function Phone(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </SVGIcon>
  );
}

// ── Hardware & Devices (Material Design) ──────────────────────────────────
export function Smartphone(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </SVGIcon>
  );
}
export function Camera(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </SVGIcon>
  );
}
export function HardDrive(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M22 12H2" />
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
      <path d="M6 16h.01" />
      <path d="M10 16h.01" />
    </SVGIcon>
  );
}
export function Database(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </SVGIcon>
  );
}
export function Terminal(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M4 17l6-6-6-6" />
      <path d="M12 19h8" />
    </SVGIcon>
  );
}
export function Mic(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <path d="M12 19v4" />
      <path d="M8 23h8" />
    </SVGIcon>
  );
}

// ── Time & Schedule (Material Design) ─────────────────────────────────────
export function Clock(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 6v6l4 2" />
    </SVGIcon>
  );
}
export function Calendar(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
    </SVGIcon>
  );
}
export function History(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M1 4v6h6" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </SVGIcon>
  );
}

// ── Analytics & Data (Material Design) ────────────────────────────────────
export function Activity(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </SVGIcon>
  );
}
export function TrendingUp(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </SVGIcon>
  );
}
export function BarChart3(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M18 20V10" />
      <path d="M12 20V4" />
      <path d="M6 20v-6" />
    </SVGIcon>
  );
}
export function ListChecks(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M10 6h11" />
      <path d="M10 12h11" />
      <path d="M10 18h11" />
      <path d="M3 6l1.5 1.5L7 4.5" />
      <path d="M3 12l1.5 1.5L7 10.5" />
      <path d="M3 18l1.5 1.5L7 16.5" />
    </SVGIcon>
  );
}
export function ListTodo(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <rect x="3" y="5" width="6" height="6" rx="1" />
      <path d="M3 17l2 2 4-4" />
      <path d="M13 6h8" />
      <path d="M13 12h8" />
      <path d="M13 18h8" />
    </SVGIcon>
  );
}

// ── Objects & Legal (Material Design) ─────────────────────────────────────
export function Package(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M16.5 9.4L7.5 4.21" />
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 7 2 17" />
      <polyline points="22 7 22 17" />
    </SVGIcon>
  );
}
export function Archive(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <polyline points="21 8 21 21 3 21 3 8" />
      <rect x="1" y="3" width="22" height="5" rx="1" />
      <path d="M10 12h4" />
    </SVGIcon>
  );
}
export function Globe(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M2 12h20" />
      <path d="M12 3a15.3 15.3 0 0 1 4 9 15.3 15.3 0 0 1-4 9 15.3 15.3 0 0 1-4-9 15.3 15.3 0 0 1 4-9z" />
    </SVGIcon>
  );
}
export function Hash(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M4 9h16" />
      <path d="M4 15h16" />
      <path d="M10 3L8 21" />
      <path d="M16 3l-2 18" />
    </SVGIcon>
  );
}
export function Award(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
    </SVGIcon>
  );
}
export function Trophy(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.45 1-1 1H8v4h8v-4h-1c-.55 0-1-.45-1-1v-2.34" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
    </SVGIcon>
  );
}
export function Star(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </SVGIcon>
  );
}
export function Key(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M21 2l-2 2m-1.5 1.5L14 9.5m-3.5 3.5A5 5 0 1 1 3 6c0 .4.05.78.15 1.15l-2 2V12h3v2h2v2h2l1.85-1.85a5 5 0 0 1 1.65.35z" />
    </SVGIcon>
  );
}
export function Briefcase(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </SVGIcon>
  );
}
export function ImageIcon(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </SVGIcon>
  );
}
export function Gavel(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="m14 13-7.5 7.5c-.8.8-2 .8-2.8 0l-.7-.7c-.8-.8-.8-2 0-2.8L10.5 9.5" />
      <path d="m16 11 2 2" />
      <path d="m8 3 7 7" />
      <path d="m11 2 7 7" />
    </SVGIcon>
  );
}
export function Scale(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="M7 21h10" />
      <path d="M12 3v18" />
      <path d="M3 7h18" />
    </SVGIcon>
  );
}
export function LayoutDashboard(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="15" width="7" height="6" rx="1" />
    </SVGIcon>
  );
}
export function Save(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </SVGIcon>
  );
}
export function Upload(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <path d="M12 3v12" />
    </SVGIcon>
  );
}
export function MessageSquare(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </SVGIcon>
  );
}
export function Sun(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="M4.93 4.93l1.41 1.41" />
      <path d="M17.66 17.66l1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="M6.34 17.66l-1.41 1.41" />
      <path d="M19.07 4.93l-1.41 1.41" />
    </SVGIcon>
  );
}
export function Moon(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </SVGIcon>
  );
}
export function Menu(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </SVGIcon>
  );
}
export function Settings(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </SVGIcon>
  );
}
export function List(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M8 6h13" />
      <path d="M8 12h13" />
      <path d="M8 18h13" />
      <path d="M3 6h.01" />
      <path d="M3 12h.01" />
      <path d="M3 18h.01" />
    </SVGIcon>
  );
}
export function Grid(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </SVGIcon>
  );
}
