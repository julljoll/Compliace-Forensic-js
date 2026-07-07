import type React from 'react';

export interface IconProps {
  size?: number;
  className?: string;
  strokeWidth?: number;
  fill?: string;
}

export type CMSIcon = (props: IconProps) => React.JSX.Element;

// Helper para renderizar los iconos utilizando Google Material Design (Font)
function MaterialIcon({
  name,
  size = 20,
  className = '',
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`material-icons-outlined select-none shrink-0 align-middle ${className}`}
      style={{
        fontSize: `${size}px`,
        width: `${size}px`,
        height: `${size}px`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {name}
    </span>
  );
}

// ── Navigation ─────────────────────────────────────────────────────────
export function ArrowLeft(props: IconProps) {
  return <MaterialIcon name="arrow_back" {...props} />;
}
export function ChevronDown(props: IconProps) {
  return <MaterialIcon name="expand_more" {...props} />;
}
export function ChevronUp(props: IconProps) {
  return <MaterialIcon name="expand_less" {...props} />;
}
export function ChevronRight(props: IconProps) {
  return <MaterialIcon name="chevron_right" {...props} />;
}
export function Home(props: IconProps) {
  return <MaterialIcon name="home" {...props} />;
}
export function LogOut(props: IconProps) {
  return <MaterialIcon name="logout" {...props} />;
}
export function ExternalLink(props: IconProps) {
  return <MaterialIcon name="open_in_new" {...props} />;
}

// ── Actions ────────────────────────────────────────────────────────────
export function Plus(props: IconProps) {
  return <MaterialIcon name="add" {...props} />;
}
export function PlusCircle(props: IconProps) {
  return <MaterialIcon name="add_circle_outline" {...props} />;
}
export function X(props: IconProps) {
  return <MaterialIcon name="close" {...props} />;
}
export function XCircle(props: IconProps) {
  return <MaterialIcon name="highlight_off" {...props} />;
}
export function Circle(props: IconProps) {
  return <MaterialIcon name="radio_button_unchecked" {...props} />;
}
export function Check(props: IconProps) {
  return <MaterialIcon name="check" {...props} />;
}
export function CheckCheck(props: IconProps) {
  return <MaterialIcon name="done_all" {...props} />;
}
export function CheckCircle2(props: IconProps) {
  return <MaterialIcon name="check_circle" {...props} />;
}
export function CheckSquare(props: IconProps) {
  return <MaterialIcon name="check_box" {...props} />;
}
export function Square(props: IconProps) {
  return <MaterialIcon name="check_box_outline_blank" {...props} />;
}
export function Trash2(props: IconProps) {
  return <MaterialIcon name="delete" {...props} />;
}
export function Edit(props: IconProps) {
  return <MaterialIcon name="edit" {...props} />;
}
export function Copy(props: IconProps) {
  return <MaterialIcon name="content_copy" {...props} />;
}
export function Search(props: IconProps) {
  return <MaterialIcon name="search" {...props} />;
}
export function Filter(props: IconProps) {
  return <MaterialIcon name="filter_alt" {...props} />;
}
export function Printer(props: IconProps) {
  return <MaterialIcon name="print" {...props} />;
}
export function Play(props: IconProps) {
  return <MaterialIcon name="play_arrow" {...props} />;
}
export function Pause(props: IconProps) {
  return <MaterialIcon name="pause" {...props} />;
}
export function RefreshCw(props: IconProps) {
  return <MaterialIcon name="refresh" {...props} />;
}
export function RotateCcw(props: IconProps) {
  return <MaterialIcon name="replay" {...props} />;
}
export function Zap(props: IconProps) {
  return <MaterialIcon name="bolt" {...props} />;
}

// ── Status & Alerts ────────────────────────────────────────────────────
export function AlertCircle(props: IconProps) {
  return <MaterialIcon name="error_outline" {...props} />;
}
export function AlertTriangle(props: IconProps) {
  return <MaterialIcon name="warning_amber" {...props} />;
}
export function AlertOctagon(props: IconProps) {
  return <MaterialIcon name="report_gmailerrorred" {...props} />;
}
export function Info(props: IconProps) {
  return <MaterialIcon name="info" {...props} />;
}

// ── Files & Documents ──────────────────────────────────────────────────
export function FileText(props: IconProps) {
  return <MaterialIcon name="description" {...props} />;
}
export function FileSearch(props: IconProps) {
  return <MaterialIcon name="find_in_page" {...props} />;
}
export function FileCheck(props: IconProps) {
  return <MaterialIcon name="fact_check" {...props} />;
}
export function ClipboardList(props: IconProps) {
  return <MaterialIcon name="assignment" {...props} />;
}
export function FolderOpen(props: IconProps) {
  return <MaterialIcon name="folder_open" {...props} />;
}
export function BookOpen(props: IconProps) {
  return <MaterialIcon name="book_open" {...props} />;
}
export function Book(props: IconProps) {
  return <MaterialIcon name="book" {...props} />;
}

// ── People ─────────────────────────────────────────────────────────────
export function User(props: IconProps) {
  return <MaterialIcon name="person" {...props} />;
}
export function Users(props: IconProps) {
  return <MaterialIcon name="group" {...props} />;
}
export function UserPlus(props: IconProps) {
  return <MaterialIcon name="person_add" {...props} />;
}

// ── Security ───────────────────────────────────────────────────────────
export function Shield(props: IconProps) {
  return <MaterialIcon name="shield" {...props} />;
}
export function ShieldCheck(props: IconProps) {
  return <MaterialIcon name="verified_user" {...props} />;
}
export function ShieldAlert(props: IconProps) {
  return <MaterialIcon name="security" {...props} />;
}
export function ShieldOff(props: IconProps) {
  return <MaterialIcon name="shield" {...props} />;
}
export function Lock(props: IconProps) {
  return <MaterialIcon name="lock" {...props} />;
}
export function Fingerprint(props: IconProps) {
  return <MaterialIcon name="fingerprint" {...props} />;
}
export function Eye(props: IconProps) {
  return <MaterialIcon name="visibility" {...props} />;
}
export function EyeOff(props: IconProps) {
  return <MaterialIcon name="visibility_off" {...props} />;
}

// ── Communication ──────────────────────────────────────────────────────
export function Mail(props: IconProps) {
  return <MaterialIcon name="mail" {...props} />;
}
export function Phone(props: IconProps) {
  return <MaterialIcon name="phone" {...props} />;
}

// ── Hardware & Devices ─────────────────────────────────────────────────
export function Smartphone(props: IconProps) {
  return <MaterialIcon name="smartphone" {...props} />;
}
export function Camera(props: IconProps) {
  return <MaterialIcon name="photo_camera" {...props} />;
}
export function HardDrive(props: IconProps) {
  return <MaterialIcon name="album" {...props} />;
}
export function Database(props: IconProps) {
  return <MaterialIcon name="storage" {...props} />;
}
export function Terminal(props: IconProps) {
  return <MaterialIcon name="terminal" {...props} />;
}
export function Mic(props: IconProps) {
  return <MaterialIcon name="mic" {...props} />;
}

// ── Time & Schedule ────────────────────────────────────────────────────
export function Clock(props: IconProps) {
  return <MaterialIcon name="schedule" {...props} />;
}
export function Calendar(props: IconProps) {
  return <MaterialIcon name="calendar_today" {...props} />;
}
export function History(props: IconProps) {
  return <MaterialIcon name="history" {...props} />;
}

// ── Analytics & Data ───────────────────────────────────────────────────
export function Activity(props: IconProps) {
  return <MaterialIcon name="query_stats" {...props} />;
}
export function TrendingUp(props: IconProps) {
  return <MaterialIcon name="trending_up" {...props} />;
}
export function BarChart3(props: IconProps) {
  return <MaterialIcon name="bar_chart" {...props} />;
}
export function ListChecks(props: IconProps) {
  return <MaterialIcon name="playlist_add_check" {...props} />;
}
export function ListTodo(props: IconProps) {
  return <MaterialIcon name="format_list_bulleted" {...props} />;
}

// ── Objects & Misc ─────────────────────────────────────────────────────
export function Package(props: IconProps) {
  return <MaterialIcon name="inventory_2" {...props} />;
}
export function Archive(props: IconProps) {
  return <MaterialIcon name="archive" {...props} />;
}
export function Globe(props: IconProps) {
  return <MaterialIcon name="public" {...props} />;
}
export function Hash(props: IconProps) {
  return <MaterialIcon name="tag" {...props} />;
}
export function Award(props: IconProps) {
  return <MaterialIcon name="emoji_events" {...props} />;
}
export function Trophy(props: IconProps) {
  return <MaterialIcon name="emoji_events" {...props} />;
}
export function Star(props: IconProps) {
  return <MaterialIcon name="star" {...props} />;
}
export function Key(props: IconProps) {
  return <MaterialIcon name="key" {...props} />;
}
export function Briefcase(props: IconProps) {
  return <MaterialIcon name="work" {...props} />;
}
export function ImageIcon(props: IconProps) {
  return <MaterialIcon name="image" {...props} />;
}
export function Gavel(props: IconProps) {
  return <MaterialIcon name="gavel" {...props} />;
}
export function Scale(props: IconProps) {
  return <MaterialIcon name="balance" {...props} />;
}
export function LayoutDashboard(props: IconProps) {
  return <MaterialIcon name="dashboard" {...props} />;
}
export function Save(props: IconProps) {
  return <MaterialIcon name="save" {...props} />;
}
export function Upload(props: IconProps) {
  return <MaterialIcon name="upload" {...props} />;
}
export function MessageSquare(props: IconProps) {
  return <MaterialIcon name="message" {...props} />;
}
export function Sun(props: IconProps) {
  return <MaterialIcon name="light_mode" {...props} />;
}
export function Moon(props: IconProps) {
  return <MaterialIcon name="dark_mode" {...props} />;
}
export function Menu(props: IconProps) {
  return <MaterialIcon name="menu" {...props} />;
}
export function Settings(props: IconProps) {
  return <MaterialIcon name="settings" {...props} />;
}
export function List(props: IconProps) {
  return <MaterialIcon name="view_list" {...props} />;
}
export function Grid(props: IconProps) {
  return <MaterialIcon name="grid_view" {...props} />;
}
