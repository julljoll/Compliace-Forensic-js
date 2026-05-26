import type React from 'react';

export type IconSize = number;
export interface IconProps {
  size?: IconSize;
  className?: string;
  strokeWidth?: number;
  fill?: string;
}

export type LucideIcon = (props: IconProps) => React.JSX.Element;

interface SfDef {
  paths: string[];
  viewBox?: string;
}

function SfSymbol({ def, size = 20, className, strokeWidth: sw = 1.5 }: { def: SfDef } & IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={def.viewBox || '0 0 24 24'}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {def.paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

function icon(paths: string | string[], viewBox?: string): SfDef {
  return { paths: Array.isArray(paths) ? paths : [paths], viewBox };
}

// ── Navigation ─────────────────────────────────────────────────────────
export function ArrowLeft(props: IconProps) {
  return <SfSymbol def={icon('M19 12H5m7-7-7 7 7 7')} {...props} />;
}
export function ChevronDown(props: IconProps) {
  return <SfSymbol def={icon('m6 9 6 6 6-6')} {...props} />;
}
export function ChevronUp(props: IconProps) {
  return <SfSymbol def={icon('m6 15 6-6 6 6')} {...props} />;
}
export function ChevronRight(props: IconProps) {
  return <SfSymbol def={icon('m9 18 6-6-6-6')} {...props} />;
}
export function Home(props: IconProps) {
  return <SfSymbol def={icon('M3 12l2-2m0 0 7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6')} {...props} />;
}
export function LogOut(props: IconProps) {
  return <SfSymbol def={icon('M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4m7 14l5-5-5-5m5 5H9')} {...props} />;
}
export function ExternalLink(props: IconProps) {
  return <SfSymbol def={icon('M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6m4-3h6v6m-11 5L21 3')} {...props} />;
}

// ── Actions ────────────────────────────────────────────────────────────
export function Plus(props: IconProps) {
  return <SfSymbol def={icon('M12 5v14m-7-7h14')} {...props} />;
}
export function PlusCircle(props: IconProps) {
  return <SfSymbol def={icon(['M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z', 'M12 8v8m-4-4h8'])} {...props} />;
}
export function X(props: IconProps) {
  return <SfSymbol def={icon('M18 6 6 18m12 0L6 6')} {...props} />;
}
export function XCircle(props: IconProps) {
  return <SfSymbol def={icon(['M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z', 'm15 9-6 6m0-6 6 6'])} {...props} />;
}
export function Circle(props: IconProps) {
  return <SfSymbol def={icon('M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z')} {...props} />;
}
export function Check(props: IconProps) {
  return <SfSymbol def={icon('m5 13 4 4L19 7')} {...props} />;
}
export function CheckCheck(props: IconProps) {
  return <SfSymbol def={icon(['m2 13 4 4 4-4', 'm9 10 4 6 8-9', 'm6 10 4 6'])} {...props} />;
}
export function CheckCircle2(props: IconProps) {
  return <SfSymbol def={icon(['M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z', 'm9 12 2 2 4-4'])} {...props} />;
}
export function CheckSquare(props: IconProps) {
  return <SfSymbol def={icon(['M3 3h18v18H3z', 'm9 12 2 2 4-4'])} {...props} />;
}
export function Square(props: IconProps) {
  return <SfSymbol def={icon('M3 3h18v18H3z')} {...props} />;
}
export function Trash2(props: IconProps) {
  return <SfSymbol def={icon(['M3 6h18m-2 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2', 'M10 11v6m4-6v6'])} {...props} />;
}
export function Edit(props: IconProps) {
  return <SfSymbol def={icon('M17 3a2.85 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z')} {...props} />;
}
export function Copy(props: IconProps) {
  return <SfSymbol def={icon(['M8 16V6a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2h-8a2 2 0 01-2-2z', 'M16 16v2a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h2'])} {...props} />;
}
export function Search(props: IconProps) {
  return <SfSymbol def={icon(['M10 17a7 7 0 100-14 7 7 0 000 14z', 'M15 15l6 6'])} {...props} />;
}
export function Filter(props: IconProps) {
  return <SfSymbol def={icon('M22 3H2l8 9.46V19l4 2v-8.54L22 3z')} {...props} />;
}
export function Printer(props: IconProps) {
  return <SfSymbol def={icon(['M6 9V2h12v7', 'M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2', 'M6 14h12v8H6z'])} {...props} />;
}
export function Play(props: IconProps) {
  return <SfSymbol def={icon('M5 3l14 9-14 9V3z')} {...props} />;
}
export function Pause(props: IconProps) {
  return <SfSymbol def={icon(['M6 4h4v16H6z', 'M14 4h4v16h-4z'])} {...props} />;
}
export function RefreshCw(props: IconProps) {
  return <SfSymbol def={icon(['M23 4v6h-6', 'M1 20v-6h6', 'M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15'])} {...props} />;
}
export function RotateCcw(props: IconProps) {
  return <SfSymbol def={icon(['M1 4v6h6', 'M3.51 15a9 9 0 102.13-9.36L1 10'])} {...props} />;
}
export function Zap(props: IconProps) {
  return <SfSymbol def={icon('M13 2L3 14h9l-1 8 10-12h-9l1-8z')} {...props} />;
}

// ── Status & Alerts ────────────────────────────────────────────────────
export function AlertCircle(props: IconProps) {
  return <SfSymbol def={icon(['M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z', 'M12 8v4m0 4h.01'])} {...props} />;
}
export function AlertTriangle(props: IconProps) {
  return <SfSymbol def={icon(['M12 2L1 21h22L12 2z', 'M12 9v4m0 4h.01'], '0 0 24 24')} {...props} />;
}
export function AlertOctagon(props: IconProps) {
  return <SfSymbol def={icon(['M7.86 2h8.28L22 7.86v8.28L16.14 22H7.86L2 16.14V7.86L7.86 2z', 'M12 8v4m0 4h.01'])} {...props} />;
}
export function Info(props: IconProps) {
  return <SfSymbol def={icon(['M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z', 'M12 16v-4m0-4h.01'])} {...props} />;
}

// ── Files & Documents ──────────────────────────────────────────────────
export function FileText(props: IconProps) {
  return <SfSymbol def={icon(['M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z', 'M14 2v6h6', 'M9 15h6m-6-4h6m-6 8h6'])} {...props} />;
}
export function FileSearch(props: IconProps) {
  return <SfSymbol def={icon(['M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z', 'M14 2v6h6', 'M11.5 14.5a3 3 0 100-6 3 3 0 000 6z', 'M14 18l-2-2'])} {...props} />;
}
export function FileCheck(props: IconProps) {
  return <SfSymbol def={icon(['M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z', 'M14 2v6h6', 'm9 15 2 2 4-4'])} {...props} />;
}
export function ClipboardList(props: IconProps) {
  return <SfSymbol def={icon(['M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2', 'M8 2h8v4H8V2z', 'M9 13h6m-6-4h6m-6 8h2'])} {...props} />;
}
export function FolderOpen(props: IconProps) {
  return <SfSymbol def={icon('M5 19a2 2 0 01-2-2V5a2 2 0 012-2h4l2 2h5a2 2 0 012 2v4m-1 8H3l2-7h16l-2 7z')} {...props} />;
}
export function BookOpen(props: IconProps) {
  return <SfSymbol def={icon(['M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z', 'M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z'])} {...props} />;
}
export function Book(props: IconProps) {
  return <SfSymbol def={icon('M4 19.5A2.5 2.5 0 016.5 17H20V3H6.5A2.5 2.5 0 004 5.5v14z')} {...props} />;
}

// ── People ─────────────────────────────────────────────────────────────
export function User(props: IconProps) {
  return <SfSymbol def={icon(['M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2', 'M12 3a4 4 0 100 8 4 4 0 000-8z'])} {...props} />;
}
export function Users(props: IconProps) {
  return <SfSymbol def={icon(['M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2', 'M9 3a4 4 0 100 8 4 4 0 000-8z', 'M23 21v-2a4 4 0 00-3-3.87', 'M16 3.13a4 4 0 010 7.75'])} {...props} />;
}
export function UserPlus(props: IconProps) {
  return <SfSymbol def={icon(['M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2', 'M9 7a4 4 0 100 8 4 4 0 000-8z', 'M19 8v6m-3-3h6'])} {...props} />;
}

// ── Security ───────────────────────────────────────────────────────────
export function Shield(props: IconProps) {
  return <SfSymbol def={icon('M12 2l7 4v5c0 5.25-3.5 9.75-7 11-3.5-1.25-7-5.75-7-11V6l7-4z')} {...props} />;
}
export function ShieldCheck(props: IconProps) {
  return <SfSymbol def={icon(['M12 2l7 4v5c0 5.25-3.5 9.75-7 11-3.5-1.25-7-5.75-7-11V6l7-4z', 'm9 12 2 2 4-4'])} {...props} />;
}
export function ShieldAlert(props: IconProps) {
  return <SfSymbol def={icon(['M12 2l7 4v5c0 5.25-3.5 9.75-7 11-3.5-1.25-7-5.75-7-11V6l7-4z', 'M12 8v4m0 4h.01'])} {...props} />;
}
export function ShieldOff(props: IconProps) {
  return <SfSymbol def={icon(['M1 1l22 22', 'M12 2l7 4v5a16.67 16.67 0 01-2.05 6.95M5.38 7.18A16.67 16.67 0 005 11v5c0 5.25 3.5 9.75 7 11 1.05-.37 2.06-1 3-1.86'])} {...props} />;
}
export function Lock(props: IconProps) {
  return <SfSymbol def={icon(['M5 13V8a7 7 0 0114 0v5', 'M12 16v4', 'M3 13h18v10H3z'])} {...props} />;
}
export function Fingerprint(props: IconProps) {
  return <SfSymbol def={icon(['M6.9 14.5A7.5 7.5 0 0012 22', 'M4.26 10.32A9.4 9.4 0 012 10', 'M9.4 16.9a3.5 3.5 0 005.2 0', 'M17.1 14.5A7.5 7.5 0 0012 2', 'M19.74 10.32A9.4 9.4 0 0022 10', 'M12 7v6'])} {...props} />;
}
export function Eye(props: IconProps) {
  return <SfSymbol def={icon(['M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z', 'M12 9a3 3 0 100 6 3 3 0 000-6z'])} {...props} />;
}
export function EyeOff(props: IconProps) {
  return <SfSymbol def={icon(['M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94', 'M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24', 'M1 1l22 22'])} {...props} />;
}

// ── Communication ──────────────────────────────────────────────────────
export function Mail(props: IconProps) {
  return <SfSymbol def={icon(['M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z', 'm22 6-10 7L2 6'])} {...props} />;
}
export function Phone(props: IconProps) {
  return <SfSymbol def={icon('M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z')} {...props} />;
}

// ── Hardware & Devices ─────────────────────────────────────────────────
export function Smartphone(props: IconProps) {
  return <SfSymbol def={icon(['M7 2h10a2 2 0 012 2v16a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2z', 'M12 18h.01'])} {...props} />;
}
export function Camera(props: IconProps) {
  return <SfSymbol def={icon(['M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2v11z', 'M12 17a4 4 0 100-8 4 4 0 000 8z'])} {...props} />;
}
export function HardDrive(props: IconProps) {
  return <SfSymbol def={icon(['M22 12H2', 'M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z', 'M6 16h.01m10 0h.01'])} {...props} />;
}
export function Database(props: IconProps) {
  return <SfSymbol def={icon(['M12 2C8.13 2 5 3.79 5 6v12c0 2.21 3.13 4 7 4s7-1.79 7-4V6c0-2.21-3.13-4-7-4z', 'M5 6c0 2.21 3.13 4 7 4s7-1.79 7-4', 'M5 12c0 2.21 3.13 4 7 4s7-1.79 7-4'])} {...props} />;
}
export function Terminal(props: IconProps) {
  return <SfSymbol def={icon(['m4 17 6-6-6-6', 'M12 19h8'])} {...props} />;
}
export function Mic(props: IconProps) {
  return <SfSymbol def={icon(['M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z', 'M19 10v2a7 7 0 01-14 0v-2', 'M12 19v3'])} {...props} />;
}

// ── Time & Schedule ────────────────────────────────────────────────────
export function Clock(props: IconProps) {
  return <SfSymbol def={icon(['M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z', 'M12 6v6l4 2'])} {...props} />;
}
export function Calendar(props: IconProps) {
  return <SfSymbol def={icon(['M3 7a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7z', 'M8 3v4m8-4v4', 'M3 11h18'])} {...props} />;
}
export function History(props: IconProps) {
  return <SfSymbol def={icon(['M3 12a9 9 0 1018 0 9 9 0 00-18 0z', 'M12 7v5l3 3'])} {...props} />;
}

// ── Analytics & Data ───────────────────────────────────────────────────
export function Activity(props: IconProps) {
  return <SfSymbol def={icon('M22 12h-4l-3 9L9 3l-3 9H2')} {...props} />;
}
export function TrendingUp(props: IconProps) {
  return <SfSymbol def={icon(['M23 6l-9.5 9.5-5-5L1 18', 'M17 6h6v6'])} {...props} />;
}
export function BarChart3(props: IconProps) {
  return <SfSymbol def={icon(['M3 3v18h18', 'M7 16v-3m5 3v-7m5 7V9'])} {...props} />;
}
export function ListChecks(props: IconProps) {
  return <SfSymbol def={icon(['M6 4h16M6 12h16M6 20h16', 'M2 4h.01M2 12h.01M2 20h.01'])} {...props} />;
}
export function ListTodo(props: IconProps) {
  return <SfSymbol def={icon(['M3 3h18v18H3z', 'M8 7h8m-8 5h8m-8 5h8'])} {...props} />;
}

// ── Objects & Misc ─────────────────────────────────────────────────────
export function Package(props: IconProps) {
  return <SfSymbol def={icon(['M12 2l10 5v10l-10 5L2 17V7l10-5z', 'M2 7l10 5 10-5', 'M12 12v10', 'M7 9.5l10-5'])} {...props} />;
}
export function Archive(props: IconProps) {
  return <SfSymbol def={icon(['M21 8v13H3V8', 'M1 3h22v5H1z', 'M10 12h4'])} {...props} />;
}
export function Globe(props: IconProps) {
  return <SfSymbol def={icon(['M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z', 'M2 12h20', 'M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z'])} {...props} />;
}
export function Hash(props: IconProps) {
  return <SfSymbol def={icon('M4 9h16M4 15h16M10 3L8 21m8-18l-2 18')} {...props} />;
}
export function Award(props: IconProps) {
  return <SfSymbol def={icon(['M12 15a6 6 0 100-12 6 6 0 000 12z', 'M9.35 9l1.5 3.5 5-1.5', 'M8 21l4-2 4 2V13.5', 'M12 21V9'])} {...props} />;
}
export function Trophy(props: IconProps) {
  return <SfSymbol def={icon(['M6 9H4.5a2.5 2.5 0 010-5H6', 'M18 9h1.5a2.5 2.5 0 000-5H18', 'M6 3h12v6a6 6 0 01-12 0V3z', 'M12 15v6', 'M8 21h8'])} {...props} />;
}
export function Star(props: IconProps) {
  return <SfSymbol def={icon('M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z')} {...props} />;
}
export function Key(props: IconProps) {
  return <SfSymbol def={icon(['M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.78 7.78 5.5 5.5 0 017.78-7.78zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4'])} {...props} />;
}
export function Briefcase(props: IconProps) {
  return <SfSymbol def={icon(['M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16', 'M2 10h20v9a2 2 0 01-2 2H4a2 2 0 01-2-2v-9z', 'M8 7h8'])} {...props} />;
}
export function ImageIcon(props: IconProps) {
  return <SfSymbol def={icon(['M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4', 'M21 5v4H3V5a2 2 0 012-2h14a2 2 0 012 2z', 'M7 10h.01'])} {...props} />;
}
export function Gavel(props: IconProps) {
  return <SfSymbol def={icon('m14.5 14.5-3 3L4 10l3-3 7.5 7.5zm0 0l5-5m0 0L22 12l-5.5 5.5-2.5-2.5zm-11 11L12 12')} {...props} />;
}
export function Scale(props: IconProps) {
  return <SfSymbol def={icon(['M12 2v20M4 7l8-5 8 5M4 17l8 5 8-5', 'M5 7c0 3 2 5 7 5s7-2 7-5', 'M5 17c0 3 2 5 7 5s7-2 7-5'])} {...props} />;
}
export function LayoutDashboard(props: IconProps) {
  return <SfSymbol def={icon(['M3 3h8v8H3z', 'M13 3h8v5h-8z', 'M13 11h8v10h-8z', 'M3 13h8v8H3z'])} {...props} />;
}

