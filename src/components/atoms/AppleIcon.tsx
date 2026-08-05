import type React from 'react';

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

export function Laptop(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
      <line x1="2" y1="20" x2="22" y2="20"/>
    </SVGIcon>
  );
}

// ── Navigation ─────────────────────────────────────────────────────────
export function ArrowLeft(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
    </SVGIcon>
  );
}
export function ArrowRight(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </SVGIcon>
  );
}
export function ChevronDown(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <polyline points="6 9 12 15 18 9"/>
    </SVGIcon>
  );
}
export function ChevronUp(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <polyline points="18 15 12 9 6 15"/>
    </SVGIcon>
  );
}
export function ChevronRight(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <polyline points="9 18 15 12 9 6"/>
    </SVGIcon>
  );
}
export function Home(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </SVGIcon>
  );
}
export function LogOut(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </SVGIcon>
  );
}
export function ExternalLink(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
    </SVGIcon>
  );
}

// ── Actions ────────────────────────────────────────────────────────────
export function Plus(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </SVGIcon>
  );
}
export function PlusCircle(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
    </SVGIcon>
  );
}
export function X(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </SVGIcon>
  );
}
export function XCircle(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
    </SVGIcon>
  );
}
export function Circle(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <circle cx="12" cy="12" r="10"/>
    </SVGIcon>
  );
}
export function Check(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <polyline points="20 6 9 17 4 12"/>
    </SVGIcon>
  );
}
export function CheckCheck(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M18 6L7 17l-5-5"/><path d="M22 10l-7.5 7.5L13 16"/>
    </SVGIcon>
  );
}
export function CheckCircle2(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </SVGIcon>
  );
}
export function CheckSquare(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </SVGIcon>
  );
}
export function Square(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    </SVGIcon>
  );
}
export function Trash2(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
    </SVGIcon>
  );
}
export function Edit(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </SVGIcon>
  );
}
export function Copy(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </SVGIcon>
  );
}
export function Search(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </SVGIcon>
  );
}
export function Filter(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </SVGIcon>
  );
}
export function Printer(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
    </SVGIcon>
  );
}
export function Play(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <polygon points="5 3 19 12 5 21 5 3"/>
    </SVGIcon>
  );
}
export function Pause(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
    </SVGIcon>
  );
}
export function RefreshCw(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
    </SVGIcon>
  );
}
export function RotateCcw(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
    </SVGIcon>
  );
}
export function Zap(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </SVGIcon>
  );
}

// ── Status & Alerts ────────────────────────────────────────────────────
export function AlertCircle(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </SVGIcon>
  );
}
export function AlertTriangle(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </SVGIcon>
  );
}
export function AlertOctagon(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </SVGIcon>
  );
}
export function Info(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
    </SVGIcon>
  );
}

// ── Files & Documents ──────────────────────────────────────────────────
export function FileText(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </SVGIcon>
  );
}
export function FileSearch(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><circle cx="11.5" cy="14.5" r="2.5"/><line x1="13.25" y1="16.25" x2="15" y2="18"/>
    </SVGIcon>
  );
}
export function FileCheck(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="9 15 11 17 15 13"/>
    </SVGIcon>
  );
}
export function ClipboardList(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>
    </SVGIcon>
  );
}
export function FolderOpen(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/><polyline points="2 10 22 10"/>
    </SVGIcon>
  );
}
export function BookOpen(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </SVGIcon>
  );
}
export function Book(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </SVGIcon>
  );
}

// ── People ─────────────────────────────────────────────────────────────
export function User(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </SVGIcon>
  );
}
export function Users(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M17 21v-2a4 4 0 0 0-3-3.87"/><path d="M9 21v-2a4 4 0 0 0-4-4H3a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </SVGIcon>
  );
}
export function UserPlus(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
    </SVGIcon>
  );
}

// ── Security ───────────────────────────────────────────────────────────
export function Shield(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </SVGIcon>
  );
}
export function ShieldCheck(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>
    </SVGIcon>
  );
}
export function ShieldAlert(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </SVGIcon>
  );
}
export function ShieldOff(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M19.69 14a6.9 6.9 0 0 0 .31-2V5l-8-3-3.11 1.17"/><path d="M4.73 4.73L4 5v7c0 6 8 10 8 10a20.29 20.29 0 0 0 5.62-4.38"/><line x1="1" y1="1" x2="23" y2="23"/>
    </SVGIcon>
  );
}
export function Lock(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </SVGIcon>
  );
}
export function Fingerprint(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4"/><path d="M5 19.5A8.5 8.5 0 0 1 3.5 12C3.5 7.3 7.3 3.5 12 3.5a8.5 8.5 0 0 1 7 3.5"/><path d="M12 8a4 4 0 0 0-4 4c0 3 1.5 5 3.5 7"/><path d="M12 12a1 1 0 0 1 1 1c0 2-1 3.5-2 5"/><path d="M15 12a3 3 0 0 0-3-3c-1.5 0-3 1-3 3 0 4 2 6 5 8"/>
    </SVGIcon>
  );
}
export function Eye(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </SVGIcon>
  );
}
export function EyeOff(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
    </SVGIcon>
  );
}

// ── Communication ──────────────────────────────────────────────────────
export function Mail(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
    </SVGIcon>
  );
}
export function Phone(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </SVGIcon>
  );
}

// ── Hardware & Devices ─────────────────────────────────────────────────
export function Smartphone(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
    </SVGIcon>
  );
}
export function Camera(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
    </SVGIcon>
  );
}
export function HardDrive(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <line x1="22" y1="12" x2="2" y2="12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" y1="16" x2="6.01" y2="16"/><line x1="10" y1="16" x2="10.01" y2="16"/>
    </SVGIcon>
  );
}
export function Database(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
    </SVGIcon>
  );
}
export function Terminal(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>
    </SVGIcon>
  );
}
export function Mic(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
    </SVGIcon>
  );
}

// ── Time & Schedule ────────────────────────────────────────────────────
export function Clock(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </SVGIcon>
  );
}
export function Calendar(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </SVGIcon>
  );
}
export function History(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
    </SVGIcon>
  );
}

// ── Analytics & Data ───────────────────────────────────────────────────
export function Activity(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </SVGIcon>
  );
}
export function TrendingUp(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
    </SVGIcon>
  );
}
export function BarChart3(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </SVGIcon>
  );
}
export function ListChecks(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><polyline points="3 6 4.5 7.5 7 4.5"/><polyline points="3 12 4.5 13.5 7 10.5"/><polyline points="3 18 4.5 19.5 7 16.5"/>
    </SVGIcon>
  );
}
export function ListTodo(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <rect x="3" y="5" width="6" height="6" rx="1"/><path d="m3 17 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>
    </SVGIcon>
  );
}

// ── Objects & Misc ─────────────────────────────────────────────────────
export function Package(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 7 2 17"/><polyline points="22 7 22 17"/>
    </SVGIcon>
  );
}
export function Archive(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/>
    </SVGIcon>
  );
}
export function Globe(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </SVGIcon>
  );
}
export function Hash(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>
    </SVGIcon>
  );
}
export function Award(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
    </SVGIcon>
  );
}
export function Trophy(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
    </SVGIcon>
  );
}
export function Star(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </SVGIcon>
  );
}
export function Key(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M21 2l-2 2m-1.5 1.5L14 9.5m-3.5 3.5A5 5 0 1 1 3 6c0 .4.05.78.15 1.15l-2 2V12h3v2h2v2h2l1.85-1.85a5 5 0 0 1 1.65.35z"/>
    </SVGIcon>
  );
}
export function Briefcase(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </SVGIcon>
  );
}
export function ImageIcon(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
    </SVGIcon>
  );
}
export function Gavel(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="m14 13-7.5 7.5c-.8.8-2 .8-2.8 0l-.7-.7c-.8-.8-.8-2 0-2.8L10.5 9.5"/><path d="m16 11 2 2"/><path d="m8 3 7 7"/><path d="m11 2 7 7"/>
    </SVGIcon>
  );
}
export function Scale(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h18"/>
    </SVGIcon>
  );
}
export function LayoutDashboard(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="15" width="7" height="6"/>
    </SVGIcon>
  );
}
export function Save(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
    </SVGIcon>
  );
}
export function Upload(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
    </SVGIcon>
  );
}
export function MessageSquare(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </SVGIcon>
  );
}
export function Sun(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </SVGIcon>
  );
}
export function Moon(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </SVGIcon>
  );
}
export function Menu(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
    </SVGIcon>
  );
}
export function Settings(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </SVGIcon>
  );
}
export function List(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
    </SVGIcon>
  );
}
export function Grid(props: IconProps) {
  return (
    <SVGIcon {...props}>
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </SVGIcon>
  );
}
