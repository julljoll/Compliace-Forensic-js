import type React from 'react';

export interface IconProps {
  size?: number;
  className?: string;
  strokeWidth?: number;
  fill?: string;
}

export type LucideIcon = (props: IconProps) => React.JSX.Element;

// Un helper para renderizar SVG consistentes estilo Lucide / SF Symbols
function SvgIcon({
  children,
  size = 20,
  className = '',
  strokeWidth = 2,
  fill = 'none',
}: {
  children: React.ReactNode;
  size?: number;
  className?: string;
  strokeWidth?: number;
  fill?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`lucide shrink-0 select-none ${className}`}
    >
      {children}
    </svg>
  );
}

// ── Navigation ─────────────────────────────────────────────────────────
export function ArrowLeft(props: IconProps) {
  return <SvgIcon {...props}><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></SvgIcon>;
}
export function ChevronDown(props: IconProps) {
  return <SvgIcon {...props}><path d="m6 9 6 6 6-6" /></SvgIcon>;
}
export function ChevronUp(props: IconProps) {
  return <SvgIcon {...props}><path d="m18 15-6-6-6 6" /></SvgIcon>;
}
export function ChevronRight(props: IconProps) {
  return <SvgIcon {...props}><path d="m9 18 6-6-6-6" /></SvgIcon>;
}
export function Home(props: IconProps) {
  return <SvgIcon {...props}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" /><path d="M9 22V12h6v10" /></SvgIcon>;
}
export function LogOut(props: IconProps) {
  return <SvgIcon {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></SvgIcon>;
}
export function ExternalLink(props: IconProps) {
  return <SvgIcon {...props}><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></SvgIcon>;
}

// ── Actions ────────────────────────────────────────────────────────────
export function Plus(props: IconProps) {
  return <SvgIcon {...props}><path d="M5 12h14" /><path d="M12 5v14" /></SvgIcon>;
}
export function PlusCircle(props: IconProps) {
  return <SvgIcon {...props}><circle cx="12" cy="12" r="10" /><path d="M8 12h8" /><path d="M12 8v8" /></SvgIcon>;
}
export function X(props: IconProps) {
  return <SvgIcon {...props}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></SvgIcon>;
}
export function XCircle(props: IconProps) {
  return <SvgIcon {...props}><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></SvgIcon>;
}
export function Circle(props: IconProps) {
  return <SvgIcon {...props}><circle cx="12" cy="12" r="10" /></SvgIcon>;
}
export function Check(props: IconProps) {
  return <SvgIcon {...props}><path d="M20 6 9 17l-5-5" /></SvgIcon>;
}
export function CheckCheck(props: IconProps) {
  return <SvgIcon {...props}><path d="m7 12 5 5L22 7" /><path d="m2 12 5 5L12 12" /></SvgIcon>;
}
export function CheckCircle2(props: IconProps) {
  return <SvgIcon {...props}><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></SvgIcon>;
}
export function CheckSquare(props: IconProps) {
  return <SvgIcon {...props}><rect width="18" height="18" x="3" y="3" rx="2" /><path d="m9 12 2 2 4-4" /></SvgIcon>;
}
export function Square(props: IconProps) {
  return <SvgIcon {...props}><rect width="18" height="18" x="3" y="3" rx="2" /></SvgIcon>;
}
export function Trash2(props: IconProps) {
  return <SvgIcon {...props}><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></SvgIcon>;
}
export function Edit(props: IconProps) {
  return <SvgIcon {...props}><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></SvgIcon>;
}
export function Copy(props: IconProps) {
  return <SvgIcon {...props}><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></SvgIcon>;
}
export function Search(props: IconProps) {
  return <SvgIcon {...props}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></SvgIcon>;
}
export function Filter(props: IconProps) {
  return <SvgIcon {...props}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></SvgIcon>;
}
export function Printer(props: IconProps) {
  return <SvgIcon {...props}><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><path d="M6 14h12v8H6z" /><path d="M6 2h12v4H6z" /></SvgIcon>;
}
export function Play(props: IconProps) {
  return <SvgIcon {...props}><polygon points="6 3 20 12 6 21 6 3" /></SvgIcon>;
}
export function Pause(props: IconProps) {
  return <SvgIcon {...props}><rect width="4" height="16" x="6" y="4" rx="1" /><rect width="4" height="16" x="14" y="4" rx="1" /></SvgIcon>;
}
export function RefreshCw(props: IconProps) {
  return <SvgIcon {...props}><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 16h5v5" /></SvgIcon>;
}
export function RotateCcw(props: IconProps) {
  return <SvgIcon {...props}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></SvgIcon>;
}
export function Zap(props: IconProps) {
  return <SvgIcon {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></SvgIcon>;
}

// ── Status & Alerts ────────────────────────────────────────────────────
export function AlertCircle(props: IconProps) {
  return <SvgIcon {...props}><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></SvgIcon>;
}
export function AlertTriangle(props: IconProps) {
  return <SvgIcon {...props}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" x2="12" y1="9" y2="13" /><line x1="12" x2="12.01" y1="17" y2="17" /></SvgIcon>;
}
export function AlertOctagon(props: IconProps) {
  return <SvgIcon {...props}><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></SvgIcon>;
}
export function Info(props: IconProps) {
  return <SvgIcon {...props}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></SvgIcon>;
}

// ── Files & Documents ──────────────────────────────────────────────────
export function FileText(props: IconProps) {
  return <SvgIcon {...props}><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></SvgIcon>;
}
export function FileSearch(props: IconProps) {
  return <SvgIcon {...props}><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><circle cx="11.5" cy="13.5" r="2.5" /><path d="M16.5 18.5 13.3 15.3" /></SvgIcon>;
}
export function FileCheck(props: IconProps) {
  return <SvgIcon {...props}><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="m9 15 2 2 4-4" /></SvgIcon>;
}
export function ClipboardList(props: IconProps) {
  return <SvgIcon {...props}><rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="M9 10h6" /><path d="M9 14h6" /><path d="M9 18h6" /></SvgIcon>;
}
export function FolderOpen(props: IconProps) {
  return <SvgIcon {...props}><path d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.97 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2" /></SvgIcon>;
}
export function BookOpen(props: IconProps) {
  return <SvgIcon {...props}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></SvgIcon>;
}
export function Book(props: IconProps) {
  return <SvgIcon {...props}><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" /><path d="M6 6h10" /><path d="M6 10h10" /><path d="M6 14h10" /></SvgIcon>;
}

// ── People ─────────────────────────────────────────────────────────────
export function User(props: IconProps) {
  return <SvgIcon {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></SvgIcon>;
}
export function Users(props: IconProps) {
  return <SvgIcon {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></SvgIcon>;
}
export function UserPlus(props: IconProps) {
  return <SvgIcon {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" /></SvgIcon>;
}

// ── Security ───────────────────────────────────────────────────────────
export function Shield(props: IconProps) {
  return <SvgIcon {...props}><path d="M20 13c0 5-3.5 7.5-7.66 9.7a1 1 0 0 1-.68 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 .76-.97l8-2a1 1 0 0 1 .48 0l8 2a1 1 0 0 1 .76.97Z" /></SvgIcon>;
}
export function ShieldCheck(props: IconProps) {
  return <SvgIcon {...props}><path d="M20 13c0 5-3.5 7.5-7.66 9.7a1 1 0 0 1-.68 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 .76-.97l8-2a1 1 0 0 1 .48 0l8 2a1 1 0 0 1 .76.97Z" /><path d="m9 12 2 2 4-4" /></SvgIcon>;
}
export function ShieldAlert(props: IconProps) {
  return <SvgIcon {...props}><path d="M20 13c0 5-3.5 7.5-7.66 9.7a1 1 0 0 1-.68 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 .76-.97l8-2a1 1 0 0 1 .48 0l8 2a1 1 0 0 1 .76.97Z" /><line x1="12" x2="12" y1="9" y2="13" /><line x1="12" x2="12.01" y1="17" y2="17" /></SvgIcon>;
}
export function ShieldOff(props: IconProps) {
  return <SvgIcon {...props}><path d="M19.9 13.9a13 13 0 0 1-7.2 8.1 1 1 0 0 1-.7 0C7.5 20.5 4 18 4 13V6.2M9.6 4.1l2.2-.6a1 1 0 0 1 .5 0l8 2a1 1 0 0 1 .7 1v4.8" /><line x1="2" x2="22" y1="2" y2="22" /></SvgIcon>;
}
export function Lock(props: IconProps) {
  return <SvgIcon {...props}><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></SvgIcon>;
}
export function Fingerprint(props: IconProps) {
  return <SvgIcon {...props}><path d="M2 12a10 10 0 0 1 20 0" /><path d="M5 12a7 7 0 0 1 14 0" /><path d="M8 12a4 4 0 0 1 8 0" /><path d="M12 12v3" /><path d="M12 20h.01" /></SvgIcon>;
}
export function Eye(props: IconProps) {
  return <SvgIcon {...props}><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0Z" /><circle cx="12" cy="12" r="3" /></SvgIcon>;
}
export function EyeOff(props: IconProps) {
  return <SvgIcon {...props}><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></SvgIcon>;
}

// ── Communication ──────────────────────────────────────────────────────
export function Mail(props: IconProps) {
  return <SvgIcon {...props}><rect width="20" height="14" x="2" y="5" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></SvgIcon>;
}
export function Phone(props: IconProps) {
  return <SvgIcon {...props}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></SvgIcon>;
}

// ── Hardware & Devices ─────────────────────────────────────────────────
export function Smartphone(props: IconProps) {
  return <SvgIcon {...props}><rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><path d="M12 18h.01" /></SvgIcon>;
}
export function Camera(props: IconProps) {
  return <SvgIcon {...props}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></SvgIcon>;
}
export function HardDrive(props: IconProps) {
  return <SvgIcon {...props}><rect width="20" height="8" x="2" y="3" rx="2" /><rect width="20" height="8" x="2" y="13" rx="2" /><line x1="6" x2="6.01" y1="7" y2="7" /><line x1="6" x2="6.01" y1="17" y2="17" /></SvgIcon>;
}
export function Database(props: IconProps) {
  return <SvgIcon {...props}><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" /></SvgIcon>;
}
export function Terminal(props: IconProps) {
  return <SvgIcon {...props}><polyline points="4 17 10 11 4 5" /><line x1="12" x2="20" y1="19" y2="19" /></SvgIcon>;
}
export function Mic(props: IconProps) {
  return <SvgIcon {...props}><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" /></SvgIcon>;
}

// ── Time & Schedule ────────────────────────────────────────────────────
export function Clock(props: IconProps) {
  return <SvgIcon {...props}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></SvgIcon>;
}
export function Calendar(props: IconProps) {
  return <SvgIcon {...props}><rect width="18" height="18" x="3" y="4" rx="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></SvgIcon>;
}
export function History(props: IconProps) {
  return <SvgIcon {...props}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><polyline points="12 7 12 12 16 14" /></SvgIcon>;
}

// ── Analytics & Data ───────────────────────────────────────────────────
export function Activity(props: IconProps) {
  return <SvgIcon {...props}><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></SvgIcon>;
}
export function TrendingUp(props: IconProps) {
  return <SvgIcon {...props}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></SvgIcon>;
}
export function BarChart3(props: IconProps) {
  return <SvgIcon {...props}><line x1="18" x2="18" y1="20" y2="4" /><line x1="12" x2="12" y1="20" y2="10" /><line x1="6" x2="6" y1="20" y2="14" /></SvgIcon>;
}
export function ListChecks(props: IconProps) {
  return <SvgIcon {...props}><path d="m3 17 2 2 4-4" /><path d="m3 7 2 2 4-4" /><path d="M13 6h8" /><path d="M13 12h8" /><path d="M13 18h8" /><path d="m3 12 2 2 4-4" /></SvgIcon>;
}
export function ListTodo(props: IconProps) {
  return <SvgIcon {...props}><path d="m3 17 2 2 4-4" /><path d="m3 7 2 2 4-4" /><path d="M13 6h8" /><path d="M13 12h8" /><path d="M13 18h8" /><path d="m3 12 2 2 4-4" /></SvgIcon>;
}

// ── Objects & Misc ─────────────────────────────────────────────────────
export function Package(props: IconProps) {
  return <SvgIcon {...props}><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><polyline points="3.29 7 12 12 20.71 7" /><line x1="12" x2="12" y1="22" y2="12" /></SvgIcon>;
}
export function Archive(props: IconProps) {
  return <SvgIcon {...props}><rect width="20" height="5" x="2" y="3" rx="1" /><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" /><line x1="10" x2="14" y1="12" y2="12" /></SvgIcon>;
}
export function Globe(props: IconProps) {
  return <SvgIcon {...props}><circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /><path d="M2 12h20" /></SvgIcon>;
}
export function Hash(props: IconProps) {
  return <SvgIcon {...props}><line x1="4" x2="20" y1="9" y2="9" /><line x1="4" x2="20" y1="15" y2="15" /><line x1="10" x2="8" y1="3" y2="21" /><line x1="16" x2="14" y1="3" y2="21" /></SvgIcon>;
}
export function Award(props: IconProps) {
  return <SvgIcon {...props}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" /><path d="M12 2a6 6 0 0 0-6 6v3.5c0 1.62 1.03 3 2.5 3.5h7c1.47-.5 2.5-1.88 2.5-3.5V8a6 6 0 0 0-6-6z" /></SvgIcon>;
}
export function Trophy(props: IconProps) {
  return <SvgIcon {...props}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" /><path d="M12 2a6 6 0 0 0-6 6v3.5c0 1.62 1.03 3 2.5 3.5h7c1.47-.5 2.5-1.88 2.5-3.5V8a6 6 0 0 0-6-6z" /></SvgIcon>;
}
export function Star(props: IconProps) {
  return <SvgIcon {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></SvgIcon>;
}
export function Key(props: IconProps) {
  return <SvgIcon {...props}><path d="m21 2-2 2" /><circle cx="7.5" cy="16.5" r="5.5" /><path d="m11.4 12.6 7.6-7.6h2.5v2.5H19v2.5h-2.5V12.6l-1.2 1.2" /></SvgIcon>;
}
export function Briefcase(props: IconProps) {
  return <SvgIcon {...props}><rect width="20" height="14" x="2" y="7" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></SvgIcon>;
}
export function ImageIcon(props: IconProps) {
  return <SvgIcon {...props}><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></SvgIcon>;
}
export function Gavel(props: IconProps) {
  return <SvgIcon {...props}><path d="m14 13-5 5M4.8 14.8l8.4-8.4m-4.2-4.2 8.4 8.4m-5.6-5.6 1.4 1.4m-7-7 1.4 1.4" /></SvgIcon>;
}
export function Scale(props: IconProps) {
  return <SvgIcon {...props}><path d="M12 3v17M19 6.67A5 5 0 0 1 16 11V5.5M5 6.67A5 5 0 0 0 8 11V5.5M3 5.5h18" /></SvgIcon>;
}
export function LayoutDashboard(props: IconProps) {
  return <SvgIcon {...props}><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="10" rx="1" /><rect width="7" height="5" x="3" y="14" rx="1" /></SvgIcon>;
}
export function Save(props: IconProps) {
  return <SvgIcon {...props}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></SvgIcon>;
}
export function Upload(props: IconProps) {
  return <SvgIcon {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></SvgIcon>;
}
export function MessageSquare(props: IconProps) {
  return <SvgIcon {...props}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></SvgIcon>;
}
export function Sun(props: IconProps) {
  return <SvgIcon {...props}><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></SvgIcon>;
}
export function Moon(props: IconProps) {
  return <SvgIcon {...props}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></SvgIcon>;
}

export function Menu(props: IconProps) {
  return <SvgIcon {...props}><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="18" y2="18" /></SvgIcon>;
}

