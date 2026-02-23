'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from '../lib/supabase';

// ============================================================
// KLARMELDT — Complete MVP Prototype
// Role-switchable: Administrator & Håndværker
// ============================================================

// --- ICON SYSTEM ---
const I = {
  Home: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Folder: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>,
  Cal: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Chat: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  Users: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  Archive: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>,
  Plus: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Check: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  X: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Clock: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Alert: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Cam: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  Send: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Bar: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  Bld: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="9" y1="6" x2="9" y2="6.01"/><line x1="15" y1="6" x2="15" y2="6.01"/><line x1="9" y1="10" x2="9" y2="10.01"/><line x1="15" y1="10" x2="15" y2="10.01"/><line x1="9" y1="14" x2="9" y2="14.01"/><line x1="15" y1="14" x2="15" y2="14.01"/><path d="M9 18h6v4H9z"/></svg>,
  Play: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  Pause: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>,
  Star: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Clip: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>,
  Swap: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>,
  Eye: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Map: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  File: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  Zap: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Tool: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>,
  Right: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  Left: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  DollarSign: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
  Menu: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
};

// --- THEME & CONFIG ---
const TRADES = {
  maler: { l: "Maler", c: "#3B82F6", bg: "#EFF6FF", emoji: "🎨" },
  tomrer: { l: "Tømrer", c: "#F59E0B", bg: "#FFFBEB", emoji: "🪚" },
  gulv: { l: "Gulv", c: "#10B981", bg: "#ECFDF5", emoji: "🪵" },
  el: { l: "Elektriker", c: "#8B5CF6", bg: "#F5F3FF", emoji: "⚡" },
  vvs: { l: "VVS", c: "#EF4444", bg: "#FEF2F2", emoji: "🔧" },
  rengoring: { l: "Rengøring", c: "#EC4899", bg: "#FDF2F8", emoji: "✨" },
  murer: { l: "Murer", c: "#78716C", bg: "#F5F5F4", emoji: "🧱" },
};

const ROOMS = ["Entré", "Stue", "Køkken", "Soveværelse 1", "Soveværelse 2", "Badeværelse", "Toilet", "Bryggers"];

const STATUS = { k: "Kommende", i: "Igangværende", a: "Afsluttet" };
const SCOL = {
  k: { bg: "#DBEAFE", tx: "#1E40AF", dot: "#3B82F6" },
  i: { bg: "#FEF3C7", tx: "#92400E", dot: "#F59E0B" },
  a: { bg: "#D1FAE5", tx: "#065F46", dot: "#10B981" },
};
const TCOL = { afventer: "#94A3B8", igang: "#F59E0B", faerdig: "#3B82F6", godkendt: "#10B981", rettelse: "#EF4444" };
const TL = { afventer: "Afventer", igang: "I gang", faerdig: "Færdig", godkendt: "Godkendt", rettelse: "Rettelse" };
const DB_STATUS = { kommende: "k", igangvaerende: "i", afsluttet: "a" };
const DB_TASK_STATUS = { afventer: "afventer", igang: "igang", faerdig: "faerdig", godkendt: "godkendt", rettelse: "rettelse" };

// --- DATA FETCHING ---
async function fetchContractors() {
  const { data, error } = await supabase.from('contractors').select('*').eq('is_active', true);
  if (error) throw error;
  return (data || []).map(c => ({
    id: c.id,
    name: c.name,
    contact: c.contact_person,
    email: c.email,
    phone: c.phone,
    trade: c.trade_key,
    rate: Number(c.rate_dkk),
    lang: c.lang,
    rating: Number(c.rating),
    completedJobs: c.completed_jobs,
    errorRate: Number(c.error_rate),
    onTimeRate: Number(c.on_time_rate),
  }));
}

async function fetchProjects() {
  const [projRes, taskRes, timeRes] = await Promise.all([
    supabase.from('projects').select('*, created_by_profile:profiles!created_by(full_name)'),
    supabase.from('tasks').select('*'),
    supabase.from('task_time_summary').select('*'),
  ]);
  if (projRes.error) throw projRes.error;
  if (taskRes.error) throw taskRes.error;
  // time summary may not exist yet — ignore errors
  const timeLookup = {};
  (timeRes.data || []).forEach(t => { timeLookup[t.task_id] = Number(t.total_hours) || 0; });

  const tasksByProject = {};
  (taskRes.data || []).forEach(t => {
    if (!tasksByProject[t.project_id]) tasksByProject[t.project_id] = [];
    tasksByProject[t.project_id].push({
      id: t.id,
      trade: t.trade_key,
      desc: t.description,
      status: DB_TASK_STATUS[t.status] || t.status,
      assigned: t.assigned_to,
      estH: Number(t.estimated_hours) || 0,
      room: t.room || null,
      notes: t.notes || "",
      timeLogged: timeLookup[t.id] || 0,
    });
  });

  return (projRes.data || []).map(p => ({
    id: p.id,
    addr: p.address,
    zip: p.zip,
    status: DB_STATUS[p.status] || p.status,
    prop: p.property_name,
    unit: p.unit,
    area: Number(p.area_m2),
    rooms: p.rooms,
    floor: p.floor,
    moveOut: p.move_out_date,
    start: p.start_date,
    deadline: p.deadline_date,
    inspection: p.inspection_at,
    createdBy: p.created_by_profile?.full_name || "Ukendt",
    createdAt: p.created_at,
    tenantYrs: p.tenant_years,
    tasks: tasksByProject[p.id] || [],
    msgs: [],
    liability: { tenant: [], landlord: [] },
    inspectionData: null,
  }));
}

// --- UTILITIES ---
const fmt = (d) => d ? new Date(d).toLocaleDateString("da-DK", { day: "numeric", month: "short", year: "numeric" }) : "–";
const fmtShort = (d) => d ? new Date(d).toLocaleDateString("da-DK", { day: "numeric", month: "short" }) : "–";
const fmtTime = (d) => d ? new Date(d).toLocaleString("da-DK", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "";
const daysUntil = (d) => Math.ceil((new Date(d) - new Date("2025-11-01")) / 86400000);
const pct = (a, b) => b > 0 ? Math.round((a / b) * 100) : 0;

// --- SHARED COMPONENTS ---
const Badge = ({ children, bg, c, style: s }) => (
  <span style={{ background: bg, color: c, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: 4, ...s }}>{children}</span>
);
const SBadge = ({ status }) => { const s = SCOL[status]; return <Badge bg={s.bg} c={s.tx}><span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot }} />{STATUS[status]}</Badge>; };
const TBadge = ({ status }) => <Badge bg={TCOL[status] + "18"} c={TCOL[status]}>{TL[status]}</Badge>;
const TradeTag = ({ trade }) => { const t = TRADES[trade]; return <Badge bg={t.bg} c={t.c}>{t.emoji} {t.l}</Badge>; };

const Btn = ({ children, primary, danger, ghost, small, style: s, ...p }) => (
  <button {...p} style={{
    display: "inline-flex", alignItems: "center", gap: 6,
    background: primary ? "#3B82F6" : danger ? "#EF4444" : ghost ? "transparent" : "#F1F5F9",
    color: primary ? "#fff" : danger ? "#fff" : ghost ? "#3B82F6" : "#475569",
    border: ghost ? "1px solid #E2E8F0" : "none", borderRadius: 10,
    padding: small ? "6px 12px" : "9px 18px", fontSize: small ? 12 : 13, fontWeight: 600, cursor: "pointer", transition: "all .15s", ...s
  }}>{children}</button>
);

const Card = ({ children, style: s, hover, onClick, ...p }) => (
  <div onClick={onClick} {...p} style={{
    background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: 20,
    cursor: onClick ? "pointer" : "default", transition: "all .15s", ...s
  }}
    onMouseEnter={onClick ? (e) => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.07)"; e.currentTarget.style.transform = "translateY(-1px)"; } : undefined}
    onMouseLeave={onClick ? (e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; } : undefined}
  >{children}</div>
);

const Stat = ({ label, value, sub, icon: Icon, accent }) => (
  <Card style={{ display: "flex", alignItems: "center", gap: 16, flex: 1, minWidth: 180 }}>
    <div style={{ width: 46, height: 46, borderRadius: 12, background: accent + "14", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon style={{ width: 20, height: 20, color: accent }} />
    </div>
    <div>
      <div style={{ fontSize: 26, fontWeight: 800, color: "#0F172A", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: accent, fontWeight: 600, marginTop: 1 }}>{sub}</div>}
    </div>
  </Card>
);

const Progress = ({ value, color = "#3B82F6", height = 6 }) => (
  <div style={{ flex: 1, height, background: "#F1F5F9", borderRadius: height / 2, overflow: "hidden" }}>
    <div style={{ width: `${value}%`, height: "100%", background: value >= 100 ? "#10B981" : color, borderRadius: height / 2, transition: "width .4s ease" }} />
  </div>
);

const Empty = ({ text }) => <div style={{ background: "#F8FAFC", borderRadius: 14, padding: 40, textAlign: "center", color: "#94A3B8", fontSize: 14 }}>{text}</div>;

const Tab = ({ tabs, active, onChange }) => (
  <div style={{ display: "flex", gap: 0, borderBottom: "2px solid #E2E8F0", marginBottom: 24 }}>
    {tabs.map(t => (
      <button key={t.id} onClick={() => onChange(t.id)} style={{
        padding: "10px 20px", border: "none", background: "none", cursor: "pointer", fontSize: 14,
        fontWeight: active === t.id ? 700 : 400, color: active === t.id ? "#3B82F6" : "#64748B",
        borderBottom: `2px solid ${active === t.id ? "#3B82F6" : "transparent"}`, marginBottom: -2,
      }}>{t.label}{t.count != null ? ` (${t.count})` : ""}</button>
    ))}
  </div>
);

// ============================================================
// ADMIN: SIDEBAR
// ============================================================
const AdminSidebar = ({ page, go, profile, onLogout, open, onClose }) => {
  const nav = [
    { id: "dash", l: "Dashboard", icon: I.Home },
    { id: "proj", l: "Projekter", icon: I.Folder },
    { id: "cal", l: "Kalender", icon: I.Cal },
    { id: "msgs", l: "Beskeder", icon: I.Chat, badge: 3 },
    { id: "craft", l: "Håndværkere", icon: I.Users },
    { id: "analytics", l: "Analyse", icon: I.Bar },
    { id: "archive", l: "Arkiv", icon: I.Archive },
  ];

  const handleNav = (id) => { go(id); if (onClose) onClose(); };
  const initials = profile.full_name.split(" ").map(n => n[0]).join("").toUpperCase();

  return (
    <>
      {/* Mobile overlay backdrop */}
      {open && <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40 }} />}
      <div style={{
        width: 232, background: "#0F172A", color: "#fff", display: "flex", flexDirection: "column", height: "100vh", flexShrink: 0,
        position: open != null ? "fixed" : "relative", left: 0, top: 0, zIndex: 50,
        transform: open === false ? "translateX(-100%)" : "translateX(0)",
        transition: "transform .25s ease",
      }}>
        <div style={{ padding: "24px 20px 16px", borderBottom: "1px solid #1E293B", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg, #22D3EE, #3B82F6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15 }}>K</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 17, letterSpacing: "-.02em" }}>Klarmeldt</div>
              <div style={{ fontSize: 9, color: "#64748B", letterSpacing: ".06em", textTransform: "uppercase" }}>MVP Prototype</div>
            </div>
          </div>
          {onClose && <button onClick={onClose} style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer", padding: 4 }}><I.X style={{ width: 20, height: 20 }} /></button>}
        </div>
        <div style={{ padding: "12px 12px 4px" }}>
          <div style={{ background: "#1E293B", borderRadius: 8, padding: "8px 12px", fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
            <I.Bld style={{ width: 14, height: 14, color: "#64748B" }} />
            <span style={{ color: "#CBD5E1" }}>Goldschmidt Ejendomme</span>
          </div>
        </div>
        <nav style={{ padding: "6px 10px", flex: 1 }}>
          {nav.map(n => (
            <button key={n.id} onClick={() => handleNav(n.id)} style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 12px",
              background: page === n.id ? "#1E293B" : "transparent", border: "none", borderRadius: 8,
              color: page === n.id ? "#fff" : "#94A3B8", cursor: "pointer", fontSize: 13,
              fontWeight: page === n.id ? 600 : 400, marginBottom: 1,
            }}>
              <n.icon style={{ width: 17, height: 17 }} />{n.l}
              {n.badge && <span style={{ marginLeft: "auto", background: "#EF4444", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 10, padding: "1px 6px" }}>{n.badge}</span>}
            </button>
          ))}
        </nav>
        <div style={{ padding: "12px 14px", borderTop: "1px solid #1E293B" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>{initials}</div>
            <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 600 }}>{profile.full_name}</div><div style={{ fontSize: 10, color: "#64748B" }}>Administrator</div></div>
          </div>
          <button onClick={onLogout} style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%", padding: "8px 12px",
            background: "#1E293B", border: "1px solid #334155",
            borderRadius: 8, color: "#94A3B8", cursor: "pointer", fontSize: 12, fontWeight: 500,
          }}>
            Log ud
          </button>
        </div>
      </div>
    </>
  );
};

// ============================================================
// ADMIN: DASHBOARD
// ============================================================
const AdminDash = ({ projects, go, sel }) => {
  const active = projects.filter(p => p.status === "i");
  const upcoming = projects.filter(p => p.status === "k");
  const allT = projects.flatMap(p => p.tasks);
  const rettelser = allT.filter(t => t.status === "rettelse").length;
  const totalHours = allT.reduce((s, t) => s + t.timeLogged, 0);
  const next = upcoming.sort((a, b) => new Date(a.start) - new Date(b.start))[0];
  const du = next ? daysUntil(next.start) : null;

  // Performance metrics
  const avgDays = 9.2;
  const avgCost = 14300;
  const onTimeRate = 87;

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0F172A", margin: 0 }}>Dashboard</h1>
        <p style={{ color: "#64748B", margin: "4px 0 0", fontSize: 14 }}>Overblik over istandsættelser · Goldschmidt Ejendomme</p>
      </div>
      <div style={{ display: "flex", gap: 14, marginBottom: 24, flexWrap: "wrap" }}>
        <Stat label="Igangværende" value={active.length} icon={I.Clock} accent="#F59E0B" sub={`${upcoming.length} kommende`} />
        <Stat label="Opgaver i alt" value={allT.length} icon={I.Folder} accent="#3B82F6" />
        <Stat label="Timer logget" value={totalHours.toFixed(0)} icon={I.Clock} accent="#10B981" sub="denne måned" />
        <Stat label="Til tiden" value={`${onTimeRate}%`} icon={I.Zap} accent="#8B5CF6" sub={`Gns. ${avgDays} dage`} />
      </div>

      {rettelser > 0 && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 14, padding: "16px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 14 }}>
          <I.Alert style={{ width: 22, height: 22, color: "#EF4444" }} />
          <div><span style={{ fontWeight: 700, color: "#991B1B" }}>{rettelser} rettelse{rettelser > 1 ? "r" : ""}</span><span style={{ color: "#B91C1C" }}> afventer håndværker</span></div>
        </div>
      )}

      {next && du > 0 && (
        <div style={{ background: "linear-gradient(135deg, #DBEAFE, #EDE9FE)", borderRadius: 14, padding: "16px 22px", marginBottom: 24, display: "flex", alignItems: "center", gap: 14 }}>
          <I.Cal style={{ width: 22, height: 22, color: "#3B82F6" }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, color: "#1E293B", fontSize: 14 }}>Om {du} dage: {next.addr}</div>
            <div style={{ fontSize: 12, color: "#475569" }}>Opstart {fmt(next.start)} · {next.area} m² · {next.tasks.length} opgaver</div>
          </div>
          <Btn primary small onClick={() => { sel(next); go("detail"); }}>Se projekt</Btn>
        </div>
      )}

      {/* Performance insight */}
      <Card style={{ marginBottom: 24, background: "linear-gradient(135deg, #F8FAFC, #F1F5F9)", border: "1px solid #E2E8F0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <I.Bar style={{ width: 18, height: 18, color: "#3B82F6" }} />
          <span style={{ fontWeight: 700, fontSize: 15, color: "#0F172A" }}>Indsigt</span>
          <Badge bg="#EFF6FF" c="#3B82F6">Sidste 6 mdr.</Badge>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          <div><div style={{ fontSize: 11, color: "#94A3B8" }}>Gns. istandsættelse</div><div style={{ fontSize: 22, fontWeight: 800, color: "#0F172A" }}>{avgDays} dage</div></div>
          <div><div style={{ fontSize: 11, color: "#94A3B8" }}>Gns. omkostning</div><div style={{ fontSize: 22, fontWeight: 800, color: "#0F172A" }}>{avgCost.toLocaleString("da-DK")} kr.</div></div>
          <div><div style={{ fontSize: 11, color: "#94A3B8" }}>Bedste håndværker</div><div style={{ fontSize: 15, fontWeight: 700, color: "#10B981" }}>El-Eksperten <span style={{ fontSize: 11 }}>(1.2% fejl)</span></div></div>
        </div>
      </Card>

      <h2 style={{ fontSize: 17, fontWeight: 700, color: "#0F172A", margin: "0 0 14px" }}>Igangværende</h2>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 28 }}>
        {active.length === 0 ? <Empty text="Ingen igangværende projekter" /> : active.map(p => <ProjCard key={p.id} p={p} onClick={() => { sel(p); go("detail"); }} />)}
      </div>

      <h2 style={{ fontSize: 17, fontWeight: 700, color: "#0F172A", margin: "0 0 14px" }}>Kommende</h2>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        {upcoming.map(p => <ProjCard key={p.id} p={p} onClick={() => { sel(p); go("detail"); }} />)}
      </div>
    </div>
  );
};

// --- PROJECT CARD ---
const ProjCard = ({ p, onClick }) => {
  const done = p.tasks.filter(t => t.status === "godkendt").length;
  const total = p.tasks.length;
  const trades = [...new Set(p.tasks.map(t => t.trade))];
  return (
    <Card onClick={onClick} style={{ flex: "1 1 320px", maxWidth: 440 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#0F172A", marginBottom: 3 }}>{p.addr}</div>
          <div style={{ fontSize: 11, color: "#94A3B8" }}>{p.createdBy} · {fmtShort(p.createdAt)}</div>
        </div>
        <SBadge status={p.status} />
      </div>
      <div style={{ display: "flex", gap: 10, fontSize: 12, color: "#64748B", marginBottom: 12 }}>
        <span>{p.area} m²</span><span>·</span><span>{p.rooms} rum</span><span>·</span><span>{total} opgaver</span>
      </div>
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 12 }}>
        {trades.map(t => <TradeTag key={t} trade={t} />)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Progress value={pct(done, total)} /><span style={{ fontSize: 12, fontWeight: 600, color: "#64748B" }}>{pct(done, total)}%</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 11, color: "#94A3B8" }}>
        <span>Opstart: {fmtShort(p.start)}</span><span>Deadline: {fmtShort(p.deadline)}</span>
      </div>
    </Card>
  );
};

// ============================================================
// ADMIN: PROJECT DETAIL
// ============================================================
const AdminDetail = ({ project: p, update, go, profile, contractors }) => {
  const [tab, setTab] = useState("tasks");
  const [showAdd, setShowAdd] = useState(false);
  const [newT, setNewT] = useState({ trade: "maler", desc: "", assigned: "", estH: "", room: "", liability: "udlejer" });
  const [msgTxt, setMsgTxt] = useState("");
  const [inspecting, setInspecting] = useState(false);

  if (!p) return null;

  const chgStatus = (tid, s) => update({ ...p, tasks: p.tasks.map(t => t.id === tid ? { ...t, status: s } : t) });

  const addTask = () => {
    if (!newT.desc) return;
    const task = { id: crypto.randomUUID(), trade: newT.trade, desc: newT.desc, status: "afventer", assigned: newT.assigned || null, estH: +newT.estH || 0, room: newT.room || null, notes: "", timeLogged: 0 };
    const liab = newT.liability === "lejer" ? { ...p.liability, tenant: [...p.liability.tenant, newT.desc] } : p.liability;
    update({ ...p, tasks: [...p.tasks, task], liability: liab });
    setNewT({ trade: "maler", desc: "", assigned: "", estH: "", room: "", liability: "udlejer" });
    setShowAdd(false);
  };

  const sendMsg = () => {
    if (!msgTxt.trim()) return;
    update({ ...p, msgs: [...p.msgs, { id: Date.now(), from: profile.full_name, role: "admin", text: msgTxt, time: new Date().toISOString() }] });
    setMsgTxt("");
  };

  const tabs = [
    { id: "tasks", label: "Opgaver", count: p.tasks.length },
    { id: "schedule", label: "Skoleskema" },
    { id: "inspect", label: "Gennemgang" },
    { id: "msgs", label: "Beskeder", count: p.msgs.length },
    { id: "liability", label: "Hæfter" },
    { id: "data", label: "Stamdata" },
    { id: "cost", label: "Økonomi" },
  ];

  // Group tasks by trade
  const byTrade = {};
  p.tasks.forEach(t => { if (!byTrade[t.trade]) byTrade[t.trade] = []; byTrade[t.trade].push(t); });

  if (inspecting) return <GuidedInspection project={p} update={update} onDone={() => setInspecting(false)} />;

  return (
    <div>
      <button onClick={() => go("proj")} style={{ background: "none", border: "none", color: "#3B82F6", cursor: "pointer", fontSize: 13, fontWeight: 600, padding: 0, marginBottom: 8 }}>← Projekter</button>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", margin: "0 0 4px" }}>{p.addr}</h1>
          <div style={{ fontSize: 13, color: "#64748B" }}>{p.prop} · {p.area} m² · {p.rooms} rum · {p.floor}. sal · Oprettet af {p.createdBy}</div>
        </div>
        <SBadge status={p.status} />
      </div>
      <div style={{ display: "flex", gap: 20, background: "#F8FAFC", borderRadius: 12, padding: "12px 18px", marginBottom: 20, fontSize: 13, flexWrap: "wrap" }}>
        {[["Fraflytning", p.moveOut], ["Opstart", p.start], ["Deadline", p.deadline, "#EF4444"], ["Syn", p.inspection]].map(([l, v, c]) => (
          <div key={l}><span style={{ color: "#94A3B8" }}>{l}: </span><span style={{ fontWeight: 600, color: c || "#0F172A" }}>{fmt(v)}</span></div>
        ))}
      </div>

      <Tab tabs={tabs} active={tab} onChange={setTab} />

      {/* === TASKS === */}
      {tab === "tasks" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Opgaver</h3>
            <Btn primary small onClick={() => setShowAdd(true)}><I.Plus style={{ width: 14, height: 14 }} /> Tilføj opgave</Btn>
          </div>
          {showAdd && (
            <Card style={{ marginBottom: 16, background: "#F8FAFC" }}>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
                <select value={newT.trade} onChange={e => setNewT({ ...newT, trade: e.target.value })} style={{ padding: "7px 10px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13 }}>
                  {Object.entries(TRADES).map(([k, v]) => <option key={k} value={k}>{v.l}</option>)}
                </select>
                <input value={newT.desc} onChange={e => setNewT({ ...newT, desc: e.target.value })} placeholder="Beskrivelse..." style={{ flex: 1, minWidth: 180, padding: "7px 10px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13 }} />
                <select value={newT.assigned} onChange={e => setNewT({ ...newT, assigned: e.target.value })} style={{ padding: "7px 10px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13 }}>
                  <option value="">Tildel...</option>{contractors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select value={newT.room} onChange={e => setNewT({ ...newT, room: e.target.value })} style={{ padding: "7px 10px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13 }}>
                  <option value="">Rum...</option>{ROOMS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <input value={newT.estH} onChange={e => setNewT({ ...newT, estH: e.target.value })} placeholder="Timer" type="number" style={{ width: 65, padding: "7px 10px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13 }} />
                <select value={newT.liability} onChange={e => setNewT({ ...newT, liability: e.target.value })} style={{ padding: "7px 10px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13 }}>
                  <option value="udlejer">Udlejer</option><option value="lejer">Lejer</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: 8 }}><Btn primary small onClick={addTask}>Opret</Btn><Btn small onClick={() => setShowAdd(false)}>Annuller</Btn></div>
            </Card>
          )}
          {Object.entries(byTrade).map(([tk, tasks]) => {
            const tr = TRADES[tk];
            return (
              <div key={tk} style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 4, height: 20, borderRadius: 2, background: tr.c }} />
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{tr.emoji} {tr.l}</span>
                  <span style={{ fontSize: 12, color: "#94A3B8" }}>({tasks.length})</span>
                  <span style={{ fontSize: 11, color: "#64748B", marginLeft: "auto" }}>{tasks.reduce((s, t) => s + t.estH, 0)}t estimeret · {tasks.reduce((s, t) => s + t.timeLogged, 0)}t logget</span>
                </div>
                {tasks.map(task => {
                  const con = contractors.find(c => c.id === task.assigned);
                  return (
                    <div key={task.id} style={{ background: "#fff", borderRadius: 10, border: "1px solid #E2E8F0", padding: "12px 16px", marginBottom: 6, display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 13, color: "#0F172A", marginBottom: 3 }}>{task.desc}</div>
                        <div style={{ fontSize: 11, color: "#94A3B8", display: "flex", gap: 10, flexWrap: "wrap" }}>
                          {con && <span>{con.name}</span>}
                          {task.room && <span>📍 {task.room}</span>}
                          <span>{task.estH}t est.</span>
                          {task.timeLogged > 0 && <span style={{ color: "#3B82F6" }}>{task.timeLogged}t logget</span>}
                          {task.notes && <span style={{ color: "#F59E0B" }}>⚠ {task.notes}</span>}
                        </div>
                      </div>
                      <TBadge status={task.status} />
                      <select value={task.status} onChange={e => chgStatus(task.id, e.target.value)} style={{ padding: "5px 8px", borderRadius: 7, border: "1px solid #E2E8F0", fontSize: 11, background: "#F8FAFC" }}>
                        {Object.entries(TL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                      </select>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      {/* === SCHEDULE === */}
      {tab === "schedule" && <Schedule project={p} />}

      {/* === INSPECTION === */}
      {tab === "inspect" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Gennemgang af lejemål</h3>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748B" }}>Guidet rum-for-rum gennemgang med billeddokumentation</p>
            </div>
            <Btn primary onClick={() => setInspecting(true)}>
              <I.Eye style={{ width: 16, height: 16 }} /> Start gennemgang
            </Btn>
          </div>
          {p.inspectionData?.completed ? (
            <Card style={{ background: "#ECFDF5", border: "1px solid #A7F3D0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <I.Check style={{ width: 22, height: 22, color: "#10B981" }} />
                <span style={{ fontWeight: 700, color: "#065F46", fontSize: 15 }}>Gennemgang afsluttet</span>
                <Badge bg="#D1FAE5" c="#065F46">{p.inspectionData.passRate}% godkendt</Badge>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 8 }}>
                {Object.entries(p.inspectionData.rooms).map(([room, status]) => (
                  <div key={room} style={{ background: "#fff", borderRadius: 8, padding: "10px 12px", display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: status === "godkendt" ? "#10B981" : "#EF4444" }} />
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{room}</span>
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <Card style={{ textAlign: "center", padding: 40 }}>
              <I.Eye style={{ width: 40, height: 40, color: "#CBD5E1", margin: "0 auto 12px", display: "block" }} />
              <div style={{ fontSize: 15, fontWeight: 600, color: "#64748B", marginBottom: 4 }}>Ingen gennemgang endnu</div>
              <div style={{ fontSize: 13, color: "#94A3B8" }}>Tryk "Start gennemgang" for at gennemgå lejemålet rum for rum</div>
            </Card>
          )}
        </div>
      )}

      {/* === MESSAGES === */}
      {tab === "msgs" && (
        <div>
          <div style={{ background: "#F8FAFC", borderRadius: 14, padding: 16, maxHeight: 380, overflowY: "auto", marginBottom: 14 }}>
            {p.msgs.length === 0 ? <Empty text="Ingen beskeder endnu" /> : p.msgs.map(m => (
              <div key={m.id} style={{ marginBottom: 14, display: "flex", flexDirection: m.role === "admin" ? "row-reverse" : "row", gap: 8 }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: m.role === "admin" ? "#3B82F6" : "#10B981", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                  {m.from.split(" ").map(n => n[0]).join("")}
                </div>
                <div style={{ maxWidth: "70%" }}>
                  <div style={{ fontSize: 10, color: "#94A3B8", marginBottom: 3, textAlign: m.role === "admin" ? "right" : "left" }}>{m.from} · {fmtTime(m.time)}</div>
                  <div style={{ background: m.role === "admin" ? "#3B82F6" : "#fff", color: m.role === "admin" ? "#fff" : "#0F172A", borderRadius: 10, padding: "8px 12px", fontSize: 13, border: m.role === "admin" ? "none" : "1px solid #E2E8F0" }}>{m.text}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={msgTxt} onChange={e => setMsgTxt(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMsg()} placeholder="Skriv besked..." style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "1px solid #CBD5E1", fontSize: 13, outline: "none" }} />
            <Btn primary onClick={sendMsg}><I.Send style={{ width: 15, height: 15 }} /></Btn>
          </div>
        </div>
      )}

      {/* === LIABILITY === */}
      {tab === "liability" && (
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {[["Lejer hæfter", p.liability.tenant, "#EF4444", "#FEF2F2", "#991B1B"], ["Udlejer hæfter", p.liability.landlord, "#3B82F6", "#EFF6FF", "#1E40AF"]].map(([title, items, dot, bg, tx]) => (
            <div key={title} style={{ flex: 1, minWidth: 240 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 12px", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: dot }} />{title}
              </h3>
              {items.length === 0 ? <div style={{ color: "#94A3B8", fontSize: 13 }}>Ingen poster</div> :
                items.map((item, i) => <div key={i} style={{ background: bg, borderRadius: 8, padding: "9px 12px", marginBottom: 5, fontSize: 13, color: tx }}>{item}</div>)}
            </div>
          ))}
        </div>
      )}

      {/* === STAMDATA === */}
      {tab === "data" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[["Lejemålsnr.", p.unit], ["Adresse", `${p.addr}, ${p.zip}`], ["Ejendom", p.prop], ["Bruttoareal", `${p.area} m²`], ["Antal rum", p.rooms], ["Etage", `${p.floor}. sal`], ["Udflytningsdato", fmt(p.moveOut)], ["Synsdato", fmt(p.inspection)], ["Lejer boet i", `${p.tenantYrs} år`], ["Oprettet af", `${p.createdBy} · ${fmtTime(p.createdAt)}`]].map(([l, v]) => (
            <div key={l} style={{ background: "#F8FAFC", borderRadius: 10, padding: "12px 16px" }}>
              <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 3 }}>{l}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>{v}</div>
            </div>
          ))}
        </div>
      )}

      {/* === COST === */}
      {tab === "cost" && <CostTab project={p} contractors={contractors} />}
    </div>
  );
};

// --- SCHEDULE ---
const Schedule = ({ project: p }) => {
  const byTrade = {};
  p.tasks.forEach(t => { if (!byTrade[t.trade]) byTrade[t.trade] = []; byTrade[t.trade].push(t); });
  const s = new Date(p.start), e = new Date(p.deadline);
  const days = [];
  const d = new Date(s);
  while (d <= e) { if (d.getDay() !== 0 && d.getDay() !== 6) days.push(new Date(d)); d.setDate(d.getDate() + 1); }

  return (
    <div style={{ overflowX: "auto" }}>
      <div style={{ minWidth: 600 }}>
        <div style={{ display: "flex", borderBottom: "2px solid #E2E8F0", paddingBottom: 8, marginBottom: 6 }}>
          <div style={{ width: 150, flexShrink: 0, fontWeight: 700, fontSize: 12, color: "#64748B" }}>Faggruppe</div>
          {days.map((day, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 11, fontWeight: 600, color: "#64748B", minWidth: 52 }}>
              {day.toLocaleDateString("da-DK", { weekday: "short" })}<div style={{ fontSize: 10, color: "#94A3B8" }}>{day.getDate()}/{day.getMonth() + 1}</div>
            </div>
          ))}
        </div>
        {Object.entries(byTrade).map(([tk, tasks]) => {
          const tr = TRADES[tk];
          const h = tasks.reduce((s, t) => s + t.estH, 0);
          const estDays = Math.ceil(h / 8);
          const done = tasks.every(t => t.status === "godkendt" || t.status === "faerdig");
          return (
            <div key={tk} style={{ display: "flex", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #F1F5F9" }}>
              <div style={{ width: 150, flexShrink: 0, display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 3, height: 24, borderRadius: 2, background: tr.c }} />
                <div><div style={{ fontWeight: 600, fontSize: 12 }}>{tr.emoji} {tr.l}</div><div style={{ fontSize: 10, color: "#94A3B8" }}>{h}t · ~{estDays}d</div></div>
              </div>
              {days.map((_, i) => (
                <div key={i} style={{ flex: 1, padding: "0 1px", minWidth: 52 }}>
                  {i < estDays && (
                    <div style={{ height: 26, borderRadius: 5, background: done ? "#10B98133" : tr.c + "20", border: `1px solid ${done ? "#10B981" : tr.c}33`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {done && <I.Check style={{ width: 12, height: 12, color: "#10B981" }} />}
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        })}
        <div style={{ display: "flex", alignItems: "center", padding: "6px 0" }}>
          <div style={{ width: 150, flexShrink: 0, fontWeight: 600, fontSize: 12, color: "#EF4444" }}>🔍 Gennemgang</div>
          {days.map((_, i) => (
            <div key={i} style={{ flex: 1, padding: "0 1px", minWidth: 52 }}>
              {i === days.length - 1 && <div style={{ height: 26, borderRadius: 5, background: "#FEF2F2", border: "1px solid #FECACA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#EF4444" }}>Syn</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- COST TAB ---
const CostTab = ({ project: p, contractors }) => {
  const costs = {};
  p.tasks.forEach(t => {
    const con = contractors.find(c => c.id === t.assigned);
    if (!con) return;
    if (!costs[t.trade]) costs[t.trade] = { trade: t.trade, hours: 0, rate: con.rate, total: 0 };
    costs[t.trade].hours += t.timeLogged || t.estH;
  });
  Object.values(costs).forEach(c => c.total = c.hours * c.rate);
  const total = Object.values(costs).reduce((s, c) => s + c.total, 0);

  return (
    <div>
      <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 16px" }}>Økonomisk overblik</h3>
      <Card>
        <div style={{ borderBottom: "1px solid #E2E8F0", paddingBottom: 8, marginBottom: 8, display: "flex", fontSize: 12, fontWeight: 700, color: "#64748B" }}>
          <div style={{ flex: 2 }}>Faggruppe</div><div style={{ flex: 1 }}>Timer</div><div style={{ flex: 1 }}>Timepris</div><div style={{ flex: 1, textAlign: "right" }}>Total</div>
        </div>
        {Object.values(costs).map(c => (
          <div key={c.trade} style={{ display: "flex", padding: "8px 0", borderBottom: "1px solid #F1F5F9", fontSize: 13, alignItems: "center" }}>
            <div style={{ flex: 2 }}><TradeTag trade={c.trade} /></div>
            <div style={{ flex: 1, color: "#475569" }}>{c.hours}t</div>
            <div style={{ flex: 1, color: "#475569" }}>{c.rate} kr.</div>
            <div style={{ flex: 1, textAlign: "right", fontWeight: 700, color: "#0F172A" }}>{c.total.toLocaleString("da-DK")} kr.</div>
          </div>
        ))}
        <div style={{ display: "flex", padding: "12px 0 0", fontSize: 15, fontWeight: 800 }}>
          <div style={{ flex: 2, color: "#0F172A" }}>Total estimeret</div>
          <div style={{ flex: 1 }} /><div style={{ flex: 1 }} />
          <div style={{ flex: 1, textAlign: "right", color: "#0F172A" }}>{total.toLocaleString("da-DK")} kr.</div>
        </div>
      </Card>
    </div>
  );
};

// ============================================================
// GUIDED INSPECTION
// ============================================================
const GuidedInspection = ({ project: p, update, onDone }) => {
  const roomsInProject = [...new Set(p.tasks.map(t => t.room).filter(Boolean))];
  if (roomsInProject.length === 0) roomsInProject.push("Stue", "Køkken", "Soveværelse 1", "Badeværelse");
  const [roomIdx, setRoomIdx] = useState(0);
  const [results, setResults] = useState({});
  const [comment, setComment] = useState("");

  const room = roomsInProject[roomIdx];
  const roomTasks = p.tasks.filter(t => t.room === room);
  const isLast = roomIdx === roomsInProject.length - 1;
  const res = results[room] || { status: null, comment: "", photo: false };

  const setRoomResult = (field, val) => {
    setResults({ ...results, [room]: { ...res, [field]: val } });
  };

  const finish = () => {
    const roomResults = {};
    let passed = 0;
    roomsInProject.forEach(r => {
      const rr = results[r];
      roomResults[r] = rr?.status === "godkendt" ? "godkendt" : "rettelse";
      if (rr?.status === "godkendt") passed++;
    });
    // Update tasks based on inspection
    const updatedTasks = p.tasks.map(t => {
      if (!t.room) return t;
      const rr = results[t.room];
      return { ...t, status: rr?.status === "godkendt" ? "godkendt" : "rettelse" };
    });
    update({
      ...p,
      tasks: updatedTasks,
      inspectionData: { completed: true, date: new Date().toISOString().split("T")[0], passRate: pct(passed, roomsInProject.length), rooms: roomResults },
    });
    onDone();
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <button onClick={onDone} style={{ background: "none", border: "none", color: "#64748B", cursor: "pointer", fontSize: 13 }}>← Afbryd</button>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>Gennemgang af {p.addr}</div>
        <span style={{ fontSize: 12, color: "#94A3B8" }}>{roomIdx + 1} / {roomsInProject.length}</span>
      </div>

      {/* Progress dots */}
      <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 24 }}>
        {roomsInProject.map((r, i) => {
          const rr = results[r];
          const color = rr?.status === "godkendt" ? "#10B981" : rr?.status === "rettelse" ? "#EF4444" : i === roomIdx ? "#3B82F6" : "#E2E8F0";
          return <div key={i} style={{ width: i === roomIdx ? 28 : 10, height: 10, borderRadius: 5, background: color, transition: "all .2s" }} />;
        })}
      </div>

      {/* Room card */}
      <Card style={{ marginBottom: 20, textAlign: "center", padding: 30 }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>
          {room === "Køkken" ? "🍳" : room === "Badeværelse" ? "🚿" : room === "Entré" ? "🚪" : room.includes("Soveværelse") ? "🛏️" : room === "Stue" ? "🛋️" : "📦"}
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0F172A", margin: "0 0 8px" }}>{room}</h2>
        {roomTasks.length > 0 && (
          <div style={{ marginTop: 12, textAlign: "left" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#64748B", marginBottom: 8 }}>Opgaver i dette rum:</div>
            {roomTasks.map(t => (
              <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: "1px solid #F1F5F9", fontSize: 13 }}>
                <TradeTag trade={t.trade} /><span>{t.desc}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Photo */}
      <Card style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 12, padding: 16, cursor: "pointer", background: res.photo ? "#ECFDF5" : "#F8FAFC" }} onClick={() => setRoomResult("photo", !res.photo)}>
        <I.Cam style={{ width: 22, height: 22, color: res.photo ? "#10B981" : "#94A3B8" }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 13, color: "#0F172A" }}>{res.photo ? "Billede taget ✓" : "Tag billede af rummet"}</div>
          <div style={{ fontSize: 11, color: "#94A3B8" }}>Dokumentation af arbejdets kvalitet</div>
        </div>
      </Card>

      {/* Comment */}
      <textarea
        value={res.comment || ""}
        onChange={e => setRoomResult("comment", e.target.value)}
        placeholder="Eventuelt kommentar til dette rum..."
        style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 13, minHeight: 60, resize: "vertical", marginBottom: 16, boxSizing: "border-box", fontFamily: "inherit" }}
      />

      {/* Approve / Reject */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <button
          onClick={() => setRoomResult("status", "godkendt")}
          style={{
            flex: 1, padding: 16, borderRadius: 14, border: `2px solid ${res.status === "godkendt" ? "#10B981" : "#E2E8F0"}`,
            background: res.status === "godkendt" ? "#ECFDF5" : "#fff", cursor: "pointer", textAlign: "center", transition: "all .15s",
          }}
        >
          <I.Check style={{ width: 28, height: 28, color: "#10B981", margin: "0 auto 6px", display: "block" }} />
          <div style={{ fontWeight: 700, fontSize: 15, color: "#10B981" }}>Godkendt</div>
        </button>
        <button
          onClick={() => setRoomResult("status", "rettelse")}
          style={{
            flex: 1, padding: 16, borderRadius: 14, border: `2px solid ${res.status === "rettelse" ? "#EF4444" : "#E2E8F0"}`,
            background: res.status === "rettelse" ? "#FEF2F2" : "#fff", cursor: "pointer", textAlign: "center", transition: "all .15s",
          }}
        >
          <I.X style={{ width: 28, height: 28, color: "#EF4444", margin: "0 auto 6px", display: "block" }} />
          <div style={{ fontWeight: 700, fontSize: 15, color: "#EF4444" }}>Rettelse</div>
        </button>
      </div>

      {/* Navigation */}
      <div style={{ display: "flex", gap: 10 }}>
        {roomIdx > 0 && <Btn ghost onClick={() => setRoomIdx(roomIdx - 1)}>← Forrige</Btn>}
        <div style={{ flex: 1 }} />
        {!isLast ? (
          <Btn primary onClick={() => setRoomIdx(roomIdx + 1)} style={{ opacity: res.status ? 1 : 0.4 }}>Næste rum →</Btn>
        ) : (
          <Btn primary onClick={finish} style={{ background: "#10B981", opacity: res.status ? 1 : 0.4 }}>
            <I.Check style={{ width: 16, height: 16 }} /> Afslut gennemgang
          </Btn>
        )}
      </div>
    </div>
  );
};

// ============================================================
// ADMIN: ANALYTICS
// ============================================================
const Analytics = ({ contractors }) => (
  <div>
    <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0F172A", margin: "0 0 8px" }}>Analyse</h1>
    <p style={{ color: "#64748B", margin: "0 0 24px", fontSize: 14 }}>Evaluer håndværkere og optimér istandsættelser</p>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
      {contractors.map(c => {
        const tr = TRADES[c.trade];
        return (
          <Card key={c.id}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#0F172A" }}>{c.name}</div>
                <div style={{ fontSize: 12, color: "#64748B" }}>{c.contact}</div>
              </div>
              <TradeTag trade={c.trade} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#0F172A" }}>{c.completedJobs}</div>
                <div style={{ fontSize: 10, color: "#94A3B8" }}>Opgaver</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: c.errorRate > 8 ? "#EF4444" : c.errorRate > 5 ? "#F59E0B" : "#10B981" }}>{c.errorRate}%</div>
                <div style={{ fontSize: 10, color: "#94A3B8" }}>Fejlpct.</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: c.onTimeRate > 90 ? "#10B981" : c.onTimeRate > 80 ? "#F59E0B" : "#EF4444" }}>{c.onTimeRate}%</div>
                <div style={{ fontSize: 10, color: "#94A3B8" }}>Til tiden</div>
              </div>
            </div>

            <div style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#64748B", marginBottom: 3 }}>
                <span>Kvalitet</span><span>{100 - c.errorRate}%</span>
              </div>
              <Progress value={100 - c.errorRate} color={c.errorRate > 8 ? "#EF4444" : "#10B981"} />
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#64748B", marginBottom: 3 }}>
                <span>Til tiden</span><span>{c.onTimeRate}%</span>
              </div>
              <Progress value={c.onTimeRate} color={c.onTimeRate > 90 ? "#10B981" : "#F59E0B"} />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 12 }}>
              {[1, 2, 3, 4, 5].map(s => (
                <I.Star key={s} style={{ width: 14, height: 14, color: s <= Math.round(c.rating) ? "#F59E0B" : "#E2E8F0", fill: s <= Math.round(c.rating) ? "#F59E0B" : "none" }} />
              ))}
              <span style={{ fontSize: 12, fontWeight: 600, color: "#64748B", marginLeft: 4 }}>{c.rating}</span>
            </div>

            {c.errorRate > 8 && (
              <div style={{ marginTop: 12, background: "#FEF2F2", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#991B1B", display: "flex", alignItems: "center", gap: 6 }}>
                <I.Alert style={{ width: 14, height: 14 }} />
                Høj fejlprocent – overvej alternativ håndværker
              </div>
            )}
          </Card>
        );
      })}
    </div>
  </div>
);

// ============================================================
// ADMIN: CONTRACTORS
// ============================================================
const Contractors = ({ contractors }) => (
  <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
      <div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0F172A", margin: 0 }}>Håndværkere</h1>
        <p style={{ color: "#64748B", margin: "4px 0 0", fontSize: 14 }}>Tilknyttede virksomheder</p>
      </div>
      <Btn primary><I.Plus style={{ width: 15, height: 15 }} /> Tilføj virksomhed</Btn>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
      {contractors.map(c => {
        const tr = TRADES[c.trade];
        return (
          <Card key={c.id}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: tr.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{tr.emoji}</div>
              <TradeTag trade={c.trade} />
            </div>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#0F172A", marginBottom: 2 }}>{c.name}</div>
            <div style={{ fontSize: 13, color: "#64748B", marginBottom: 10 }}>{c.contact}</div>
            <div style={{ fontSize: 12, color: "#475569", display: "flex", flexDirection: "column", gap: 3 }}>
              <span>📧 {c.email}</span>
              <span>📞 {c.phone}</span>
              <span>💰 {c.rate} kr./t</span>
              <span>🌐 {c.lang === "da" ? "Dansk" : "English"}</span>
            </div>
          </Card>
        );
      })}
    </div>
  </div>
);

// ============================================================
// HÅNDVÆRKER: MOBILE APP VIEW
// ============================================================
const CraftApp = ({ projects, contractors, update, profile, contractor, onLogout }) => {
  const [page, setPage] = useState("today");
  const [selTask, setSelTask] = useState(null);
  const [timer, setTimer] = useState(null);
  const [elapsed, setElapsed] = useState(0);

  // Match contractor from DB by id
  const myCon = contractor ? contractors.find(c => c.id === contractor.id) : contractors[0];
  const myConId = myCon ? myCon.id : null;
  const myTasks = projects.flatMap(p => p.tasks.filter(t => t.assigned === myConId).map(t => ({ ...t, project: p })));
  const todayTasks = myTasks.filter(t => t.status === "igang" || t.status === "afventer");
  const upcomingTasks = myTasks.filter(t => t.project.status === "k");

  useEffect(() => {
    if (!timer) return;
    const iv = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(iv);
  }, [timer]);

  const fmtElapsed = (s) => `${String(Math.floor(s / 3600)).padStart(2, "0")}:${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const logTime = (task) => {
    const hours = elapsed / 3600;
    const proj = task.project;
    update({
      ...proj,
      tasks: proj.tasks.map(t => t.id === task.id ? { ...t, timeLogged: +(t.timeLogged + hours).toFixed(1) } : t),
    });
    setTimer(null);
    setElapsed(0);
  };

  const markDone = (task) => {
    const proj = task.project;
    update({ ...proj, tasks: proj.tasks.map(t => t.id === task.id ? { ...t, status: "faerdig" } : t) });
  };

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", height: "100vh", background: "#F8FAFC", fontFamily: "'DM Sans', system-ui, sans-serif", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Mobile header */}
      <div style={{ background: "#0F172A", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #22D3EE, #3B82F6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, color: "#fff" }}>K</div>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>Klarmeldt</div>
            <div style={{ color: "#64748B", fontSize: 10 }}>{contractor?.name || "Håndværker"}</div>
          </div>
        </div>
        <button onClick={onLogout} style={{ background: "#1E293B", border: "none", borderRadius: 8, padding: "6px 12px", color: "#94A3B8", fontSize: 11, cursor: "pointer" }}>
          Log ud
        </button>
      </div>

      {/* Timer bar */}
      {timer && (
        <div style={{ background: "#10B981", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ color: "#fff" }}>
            <div style={{ fontSize: 11, fontWeight: 600 }}>⏱ Timer kører</div>
            <div style={{ fontSize: 24, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{fmtElapsed(elapsed)}</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => { logTime(timer); }} style={{ background: "#fff", color: "#10B981", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
              Stop & Log
            </button>
          </div>
        </div>
      )}

      <div style={{ padding: 20, flex: 1, overflowY: "auto", paddingBottom: 20 }}>
        {/* Nav pills */}
        <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
          {[["today", "I dag"], ["upcoming", "Kommende"], ["done", "Udført"]].map(([id, l]) => (
            <button key={id} onClick={() => setPage(id)} style={{
              padding: "8px 16px", borderRadius: 20, border: "none",
              background: page === id ? "#0F172A" : "#E2E8F0",
              color: page === id ? "#fff" : "#64748B",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}>{l}</button>
          ))}
        </div>

        {/* TODAY */}
        {page === "today" && (
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", margin: "0 0 4px" }}>God morgen, {profile.full_name.split(" ")[0]} 👋</h2>
            <p style={{ color: "#64748B", fontSize: 13, margin: "0 0 20px" }}>Du har {todayTasks.length} aktive opgaver</p>

            {todayTasks.map(task => (
              <Card key={task.id} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <TradeTag trade={task.trade} />
                  <TBadge status={task.status} />
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#0F172A", marginBottom: 4 }}>{task.desc}</div>
                <div style={{ fontSize: 12, color: "#64748B", marginBottom: 2 }}>📍 {task.project.addr}</div>
                {task.room && <div style={{ fontSize: 12, color: "#64748B", marginBottom: 8 }}>🏠 {task.room}</div>}
                <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 12 }}>
                  Deadline: {fmtShort(task.project.deadline)} · Est: {task.estH}t · Logget: {task.timeLogged}t
                </div>
                {task.notes && (
                  <div style={{ background: "#FFFBEB", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#92400E", marginBottom: 12 }}>⚠ {task.notes}</div>
                )}
                <div style={{ display: "flex", gap: 8 }}>
                  {!timer && (
                    <Btn primary small onClick={() => { setTimer(task); setElapsed(0); }}>
                      <I.Play style={{ width: 13, height: 13 }} /> Start timer
                    </Btn>
                  )}
                  <Btn small style={{ background: "#10B981", color: "#fff" }} onClick={() => markDone(task)}>
                    <I.Check style={{ width: 13, height: 13 }} /> Meld færdig
                  </Btn>
                </div>
              </Card>
            ))}

            {todayTasks.length === 0 && <Empty text="Ingen aktive opgaver i dag 🎉" />}
          </div>
        )}

        {/* UPCOMING */}
        {page === "upcoming" && (
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", margin: "0 0 16px" }}>Kommende opgaver</h2>
            {upcomingTasks.length === 0 ? <Empty text="Ingen kommende opgaver" /> :
              upcomingTasks.map(task => (
                <Card key={task.id} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <TradeTag trade={task.trade} />
                    <span style={{ fontSize: 12, color: "#64748B" }}>Om {daysUntil(task.project.start)} dage</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#0F172A", marginBottom: 2 }}>{task.desc}</div>
                  <div style={{ fontSize: 12, color: "#64748B" }}>📍 {task.project.addr}</div>
                  <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 4 }}>
                    {task.project.area} m² · {task.project.rooms} rum · Est: {task.estH}t
                  </div>
                </Card>
              ))
            }
          </div>
        )}

        {/* DONE */}
        {page === "done" && (
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", margin: "0 0 16px" }}>Udførte opgaver</h2>
            {myTasks.filter(t => t.status === "faerdig" || t.status === "godkendt").map(task => (
              <Card key={task.id} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <TradeTag trade={task.trade} /><TBadge status={task.status} />
                </div>
                <div style={{ fontWeight: 600, fontSize: 14, color: "#0F172A" }}>{task.desc}</div>
                <div style={{ fontSize: 12, color: "#64748B" }}>📍 {task.project.addr} · {task.timeLogged}t logget</div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div style={{ background: "#fff", borderTop: "1px solid #E2E8F0", display: "flex", padding: "8px 0", flexShrink: 0 }}>
        {[["today", "I dag", I.Home], ["upcoming", "Kommende", I.Cal], ["done", "Udført", I.Check]].map(([id, l, Icon]) => (
          <button key={id} onClick={() => setPage(id)} style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
            background: "none", border: "none", cursor: "pointer",
            color: page === id ? "#3B82F6" : "#94A3B8", fontSize: 10, fontWeight: 600,
          }}>
            <Icon style={{ width: 20, height: 20 }} />{l}
          </button>
        ))}
      </div>
    </div>
  );
};

// ============================================================
// MAIN APP
// ============================================================
export default function Klarmeldt({ profile, contractor, onLogout }) {
  const role = profile.role === "haandvaerker" ? "craft" : "admin";
  const [page, setPage] = useState("dash");
  const [selProj, setSelProj] = useState(null);
  const [projects, setProjects] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState(null);
  const [sideOpen, setSideOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const loadData = useCallback(async () => {
    setDataLoading(true);
    setDataError(null);
    try {
      const [projs, cons] = await Promise.all([fetchProjects(), fetchContractors()]);
      setProjects(projs);
      setContractors(cons);
    } catch (err) {
      console.error("Data fetch error:", err);
      setDataError(err.message || "Kunne ikke hente data");
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const updateProject = (updated) => {
    setProjects(ps => ps.map(p => p.id === updated.id ? updated : p));
    setSelProj(prev => prev?.id === updated.id ? updated : prev);
  };

  const go = (pg) => { setPage(pg); if (pg !== "detail") setSelProj(null); };

  if (dataLoading) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", background: "#F8FAFC", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg, #22D3EE, #3B82F6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 22, color: "#fff", marginBottom: 16 }}>K</div>
      <div style={{ fontSize: 15, color: "#64748B", fontWeight: 500 }}>Henter projekter...</div>
    </div>
  );

  if (dataError) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", background: "#F8FAFC", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <I.Alert style={{ width: 40, height: 40, color: "#EF4444", marginBottom: 12 }} />
      <div style={{ fontSize: 16, fontWeight: 700, color: "#991B1B", marginBottom: 6 }}>Fejl ved indlæsning</div>
      <div style={{ fontSize: 13, color: "#64748B", marginBottom: 16 }}>{dataError}</div>
      <Btn primary onClick={loadData}>Prøv igen</Btn>
    </div>
  );

  if (role === "craft") return <CraftApp projects={projects} contractors={contractors} update={updateProject} profile={profile} contractor={contractor} onLogout={onLogout} />;

  const renderPage = () => {
    switch (page) {
      case "dash": return <AdminDash projects={projects} go={go} sel={(p) => { setSelProj(p); setPage("detail"); }} />;
      case "proj": return (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div><h1 style={{ fontSize: 26, fontWeight: 800, color: "#0F172A", margin: 0 }}>Projekter</h1><p style={{ color: "#64748B", margin: "4px 0 0", fontSize: 14 }}>Alle istandsættelser</p></div>
            <Btn primary><I.Plus style={{ width: 15, height: 15 }} /> Nyt projekt</Btn>
          </div>
          {["i", "k"].map(s => {
            const ps = projects.filter(p => p.status === s);
            return ps.length > 0 && (
              <div key={s} style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: "#0F172A", margin: "0 0 14px" }}>{STATUS[s]} ({ps.length})</h2>
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                  {ps.map(p => <ProjCard key={p.id} p={p} onClick={() => { setSelProj(p); go("detail"); }} />)}
                </div>
              </div>
            );
          })}
        </div>
      );
      case "detail": return <AdminDetail project={selProj} update={updateProject} go={go} profile={profile} contractors={contractors} />;
      case "craft": return <Contractors contractors={contractors} />;
      case "analytics": return <Analytics contractors={contractors} />;
      case "archive": return (
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0F172A", margin: "0 0 24px" }}>Arkiv</h1>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {projects.filter(p => p.status === "a").map(p => <ProjCard key={p.id} p={p} onClick={() => { setSelProj(p); go("detail"); }} />)}
          </div>
        </div>
      );
      case "msgs": return (
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0F172A", margin: "0 0 24px" }}>Beskeder</h1>
          {projects.flatMap(p => p.msgs.map(m => ({ ...m, addr: p.addr }))).sort((a, b) => new Date(b.time) - new Date(a.time)).map(m => (
            <Card key={m.id + m.addr} style={{ marginBottom: 8, display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: m.role === "admin" ? "#3B82F6" : "#10B981", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                {m.from.split(" ").map(n => n[0]).join("")}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 3, flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 700, fontSize: 13 }}>{m.from}</span>
                  <span style={{ fontSize: 10, color: "#94A3B8" }}>{fmtTime(m.time)}</span>
                  <Badge bg="#F1F5F9" c="#64748B">{m.addr.split(",")[0]}</Badge>
                </div>
                <div style={{ fontSize: 13, color: "#475569" }}>{m.text}</div>
              </div>
            </Card>
          ))}
        </div>
      );
      case "cal": return (
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0F172A", margin: "0 0 24px" }}>Kalender</h1>
          <Card>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {projects.filter(p => p.status !== "a").sort((a, b) => new Date(a.start) - new Date(b.start)).map(p => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 0", borderBottom: "1px solid #F1F5F9", cursor: "pointer" }} onClick={() => { setSelProj(p); go("detail"); }}>
                  <div style={{ width: 50, textAlign: "center" }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#0F172A" }}>{new Date(p.start).getDate()}</div>
                    <div style={{ fontSize: 10, color: "#94A3B8", textTransform: "uppercase" }}>{new Date(p.start).toLocaleDateString("da-DK", { month: "short" })}</div>
                  </div>
                  <div style={{ width: 4, height: 36, borderRadius: 2, background: SCOL[p.status].dot }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#0F172A" }}>{p.addr}</div>
                    <div style={{ fontSize: 12, color: "#64748B" }}>{fmtShort(p.start)} → {fmtShort(p.deadline)} · {p.tasks.length} opgaver</div>
                  </div>
                  <SBadge status={p.status} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      );
      default: return <AdminDash projects={projects} go={go} sel={(p) => { setSelProj(p); setPage("detail"); }} />;
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'DM Sans', 'Segoe UI', system-ui, -apple-system, sans-serif", background: "#F8FAFC" }}>
      {isMobile ? (
        <AdminSidebar page={page} go={go} profile={profile} onLogout={onLogout} open={sideOpen} onClose={() => setSideOpen(false)} />
      ) : (
        <AdminSidebar page={page} go={go} profile={profile} onLogout={onLogout} />
      )}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Mobile header */}
        {isMobile && (
          <div style={{ background: "#0F172A", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <button onClick={() => setSideOpen(true)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", padding: 4 }}>
              <I.Menu style={{ width: 22, height: 22 }} />
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 26, height: 26, borderRadius: 7, background: "linear-gradient(135deg, #22D3EE, #3B82F6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12, color: "#fff" }}>K</div>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>Klarmeldt</span>
            </div>
            <div style={{ width: 30 }} />
          </div>
        )}
        <main style={{ flex: 1, overflow: "auto", padding: isMobile ? "16px" : "28px 36px" }}>{renderPage()}</main>
      </div>
    </div>
  );
}
