import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar
} from 'recharts';
import {
  Truck, Package, MapPin, Zap, Users, Fuel, AlertTriangle, TrendingUp, TrendingDown,
  CheckCircle2, XCircle, Clock, Cloud, Leaf, Gauge, Search, Bell, Settings, LogOut,
  ChevronDown, ChevronUp, ChevronRight, ChevronLeft, Plus, Trash2, Copy, Edit3, Upload,
  X, Menu, Star, Play, ArrowRight, Mail, Lock, Eye, EyeOff, Shield, Smartphone,
  Building2, Route, Battery, Wrench, FileText, Navigation, Radio, Wind, Thermometer,
  GripVertical, Filter, Download, MoreVertical, CircleDot, Layers, BarChart3, Sparkles,
  SlidersHorizontal, RefreshCw, ArrowUpDown, PackageCheck, PackageX, Snowflake, ShieldCheck,
  ArrowUpRight, Fingerprint
} from 'lucide-react';

/* ============================================================ */
/*  DESIGN TOKENS — black canvas, single neon accent, per brief  */
/* ============================================================ */
const C = {
  bg: '#f7fbf7',
  panel: '#ffffff',
  card: '#ffffff',
  cardAlt: '#f0f7f1',
  border: 'rgba(22, 72, 45, 0.13)',
  borderStrong: 'rgba(22, 72, 45, 0.27)',
  text: '#173426',
  mute: 'rgba(23, 52, 38, 0.67)',
  faint: 'rgba(23, 52, 38, 0.48)',
  accent: '#159b58',
  accentSoft: 'rgba(21, 155, 88, 0.12)',
  accentBorder: 'rgba(21, 155, 88, 0.32)',
  warn: '#FFC24B',
  danger: '#FF5C5C',
  info: '#5CC8FF',
};

const FONT_SERIF = "'Playfair Display', Georgia, serif";
const FONT_SANS = "'Outfit', sans-serif";
const FONT_GEN = "'General Sans', -apple-system, sans-serif";

/* ============================================================ */
/*  MOCK DATA                                                    */
/* ============================================================ */
const LOGOS = ['NORTHWIND', 'VELOCORP', 'ARCADIA', 'MERIDIAN', 'HALCYON', 'OBSIDIAN GOODS'];

const TESTIMONIALS = [
  { quote: "We cut our average delivery window by 34% in the first quarter. The routing engine alone paid for the platform.", name: 'Priya Nair', role: 'VP Logistics, Meridian Retail' },
  { quote: "Dispatch used to be four spreadsheets and a shouting match. Now it's one screen and it's actually calm in here.", name: 'Daniel Osei', role: 'Ops Manager, Halcyon Foods' },
  { quote: "Our SLA compliance went from 91% to 98.6% without adding a single vehicle to the fleet.", name: 'Marta Lindqvist', role: 'COO, Arcadia Distribution' },
];

const FEATURES = [
  { icon: Route, title: 'AI Route Optimization', desc: 'Vehicle routing that factors live traffic, weather, time windows and driver skill in under two seconds.' },
  { icon: Radio, title: 'Live Dispatch Center', desc: 'Drag-and-drop assignment across your whole fleet with automatic nearest-driver suggestions.' },
  { icon: Navigation, title: 'Real-Time Tracking', desc: 'Door-to-door visibility with delay prediction, geofencing and proof of delivery capture.' },
  { icon: Layers, title: 'Warehouse & Inventory', desc: 'Inbound to outbound, barcode to shelf, with forecast-driven stock alerts.' },
  { icon: Leaf, title: 'Carbon Footprint Engine', desc: 'Emission tracking per route, per vehicle, per delivery — reported automatically.' },
  { icon: Shield, title: 'Enterprise-Grade RBAC', desc: 'Eight built-in roles, granular permissions, full audit trail on every action.' },
];

const PRICING = [
  { tier: 'Starter', price: '$0', period: 'up to 200 deliveries/mo', cta: 'Start free', features: ['Order management', 'Basic tracking', 'Email support', '1 warehouse'], highlight: false },
  { tier: 'Growth', price: '$899', period: 'per month', cta: 'Book a demo', features: ['Everything in Starter', 'AI route optimization', 'Live dispatch center', 'Unlimited warehouses', 'Priority support'], highlight: true },
  { tier: 'Enterprise', price: 'Custom', period: 'volume pricing', cta: 'Talk to sales', features: ['Everything in Growth', 'Dedicated infrastructure', 'Custom AI model tuning', 'SLA guarantees', 'White-glove onboarding'], highlight: false },
];

const FAQS = [
  { q: 'How fast is the AI route optimizer?', a: 'Most fleets under 500 vehicles get an optimized plan in under two seconds, including live traffic and weather inputs, time windows and driver skill matching.' },
  { q: 'Can we migrate our existing order history?', a: 'Yes. We support CSV, Excel and direct API migration, and our onboarding team maps your existing fields for you at no extra cost.' },
  { q: 'Do you support electric vehicle fleets?', a: 'Fleetly includes EV-specific routing that accounts for battery health, charging windows and range, alongside standard combustion routing.' },
  { q: 'What roles does the platform support out of the box?', a: 'Admin, Operations Manager, Dispatcher, Delivery Partner, Customer, Warehouse Staff, Customer Support and Analytics — each with its own permission set.' },
  { q: 'Is there an offline mode for drivers?', a: 'The driver app caches today\u2019s route and offline maps, so a lost signal in a warehouse basement never stalls a delivery.' },
];

const STATUS_COLORS = { Delivered: C.accent, 'In Transit': C.info, Pending: C.warn, Failed: C.danger, Assigned: C.info, Unassigned: C.faint };

function seedRand(seed) { let s = seed; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
const rnd = seedRand(42);
const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
const CITIES = ['Austin, TX', 'Denver, CO', 'Portland, OR', 'Nashville, TN', 'Raleigh, NC', 'Boise, ID', 'Tampa, FL', 'Columbus, OH'];
const CUSTOMERS = ['Reyes Manufacturing', 'Cobalt Retail Group', 'Fenwick & Sons', 'Nimbus Foods', 'Alder Home Goods', 'Petra Pharma', 'Union Coffee Co.', 'Brightside Electronics'];
const DRIVER_NAMES = ['J. Alvarez', 'S. Okafor', 'M. Chen', 'R. Patel', 'K. Novak', 'D. Boateng', 'L. Fischer', 'T. Nakamura', 'E. Ruiz', 'A. Kowalski', 'G. Silva', 'N. Haddad'];

const ORDERS = Array.from({ length: 28 }).map((_, i) => {
  const statuses = ['Delivered', 'In Transit', 'Pending', 'Failed'];
  const priorities = ['Standard', 'Priority', 'Express'];
  return {
    id: `LS-${10230 + i}`,
    customer: pick(CUSTOMERS),
    pickup: pick(CITIES),
    delivery: pick(CITIES),
    weight: (10 + Math.floor(rnd() * 190)),
    status: pick(statuses),
    priority: pick(priorities),
    cod: rnd() > 0.7,
    fragile: rnd() > 0.75,
    tempControlled: rnd() > 0.85,
    insured: rnd() > 0.6,
    value: Math.floor(120 + rnd() * 2800),
    eta: `${1 + Math.floor(rnd() * 6)}h ${Math.floor(rnd() * 60)}m`,
  };
});

const VEHICLES = Array.from({ length: 14 }).map((_, i) => ({
  id: `VH-${340 + i}`,
  type: i % 4 === 0 ? 'EV Van' : i % 3 === 0 ? 'Box Truck' : 'Cargo Van',
  driver: DRIVER_NAMES[i % DRIVER_NAMES.length],
  status: pick(['Active', 'Active', 'Idle', 'Maintenance']),
  fuel: Math.floor(20 + rnd() * 80),
  health: Math.floor(70 + rnd() * 30),
  mileage: Math.floor(12000 + rnd() * 80000),
  gps: pick(CITIES),
  serviceDue: `${5 + Math.floor(rnd() * 40)} days`,
}));

const DRIVERS = DRIVER_NAMES.map((n, i) => ({
  name: n,
  rating: (4 + rnd()).toFixed(1),
  status: pick(['On Route', 'On Route', 'Available', 'Off Shift']),
  deliveries: Math.floor(4 + rnd() * 10),
  vehicle: VEHICLES[i % VEHICLES.length].id,
}));

const ALERTS = [
  { icon: AlertTriangle, tone: 'warn', text: 'Order LS-10241 is 22 minutes behind ETA due to I-35 congestion.' },
  { icon: Cloud, tone: 'info', text: 'Storm system moving into Denver, CO — 3 routes may be affected after 4 PM.' },
  { icon: Battery, tone: 'warn', text: 'VH-342 (EV Van) battery at 18% with 2 stops remaining on route.' },
  { icon: ShieldCheck, tone: 'good', text: 'SLA compliance for the Austin hub is at 99.1% this week.' },
  { icon: Wrench, tone: 'warn', text: 'VH-347 service due in 5 days — schedule a maintenance slot.' },
];

const REVENUE_DATA = Array.from({ length: 12 }).map((_, i) => ({
  m: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
  revenue: Math.floor(140 + rnd() * 90),
  deliveries: Math.floor(900 + rnd() * 500),
}));

const FUEL_DATA = Array.from({ length: 7 }).map((_, i) => ({ d: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i], gal: Math.floor(180 + rnd() * 120) }));
const DRIVER_STATUS_DATA = [
  { name: 'On Route', value: 42, color: C.accent },
  { name: 'Available', value: 18, color: C.info },
  { name: 'Off Shift', value: 26, color: C.faint },
  { name: 'On Break', value: 8, color: C.warn },
];
const SLA_VALUE = 97;

/* ============================================================ */
/*  DELIVERY DOMAIN — CONFIGURABLE ZONES, RATE CARDS, PRICING   */
/* ============================================================ */
const DEFAULT_ZONES = [
  { id: 'Z-AUS', name: 'Austin Central', areas: ['Austin', 'North Loop', 'Downtown'] },
  { id: 'Z-DEN', name: 'Denver Metro', areas: ['Denver', 'Aurora', 'Lakewood'] },
  { id: 'Z-PDX', name: 'Portland Metro', areas: ['Portland', 'Beaverton', 'Gresham'] },
  { id: 'Z-OTHER', name: 'National', areas: [] },
];
const DEFAULT_RATE_CARDS = {
  B2C: { intra: { base: 8, perKg: 1.25 }, inter: { base: 15, perKg: 2.1 }, cod: 3.5 },
  B2B: { intra: { base: 11, perKg: 1.6 }, inter: { base: 21, perKg: 2.75 }, cod: 5 },
};
function detectZone(address, zones = DEFAULT_ZONES) {
  const value = (address || '').toLowerCase();
  return zones.find(zone => zone.areas.some(area => value.includes(area.toLowerCase()))) || zones.find(zone => zone.id === 'Z-OTHER') || zones[zones.length - 1];
}
function calculateDeliveryCharge({ pickup, delivery, length, breadth, height, actualWeight, orderType = 'B2C', paymentType = 'Prepaid' }, zones = DEFAULT_ZONES, rateCards = DEFAULT_RATE_CARDS) {
  const pickupZone = detectZone(pickup, zones);
  const deliveryZone = detectZone(delivery, zones);
  const volumetricWeight = (Number(length || 0) * Number(breadth || 0) * Number(height || 0)) / 5000;
  const billableWeight = Math.max(Number(actualWeight || 0), volumetricWeight);
  const lane = pickupZone.id === deliveryZone.id ? 'intra' : 'inter';
  const card = rateCards[orderType][lane];
  const codSurcharge = paymentType === 'COD' ? rateCards[orderType].cod : 0;
  const transportCharge = card.base + (billableWeight * card.perKg);
  return { pickupZone, deliveryZone, lane, volumetricWeight, billableWeight, transportCharge, codSurcharge, total: transportCharge + codSurcharge };
}

/* ============================================================ */
/*  GLOBAL STYLE                                                 */
/* ============================================================ */
function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
      @import url('https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap');

      .ls-root, .ls-root * { box-sizing: border-box; }
      .ls-root { background:${C.bg}; color:${C.text}; font-family:${FONT_SANS}; -webkit-font-smoothing:antialiased; }
      .ls-root ::selection { background:${C.accent}; color:#fff; }
      .ls-root a { color:inherit; }
      .ls-scrollbar::-webkit-scrollbar { width:6px; height:6px; }
      .ls-scrollbar::-webkit-scrollbar-thumb { background:rgba(23,52,38,0.18); border-radius:4px; }
      .ls-scrollbar::-webkit-scrollbar-track { background:transparent; }

      @keyframes ls-word-reveal { 0%{opacity:0; transform:translateY(105%); filter:blur(20px);} 30%{opacity:1;} 100%{opacity:1; transform:translateY(0); filter:blur(0);} }
      .ls-word-wrap { display:inline-block; overflow:hidden; vertical-align:bottom; padding-bottom:.15em; margin-bottom:-.15em; }
      .ls-word-inner { display:inline-block; opacity:0; animation: ls-word-reveal 1.1s cubic-bezier(.05,.9,.1,1) forwards; }

      @keyframes ls-letter-reveal { 0%{opacity:0; transform:translateX(-105%); filter:blur(20px);} 25%{opacity:1;} 100%{opacity:.96; transform:translateX(0); filter:blur(0);} }
      .ls-letter-wrap { display:inline-block; overflow:hidden; vertical-align:bottom; line-height:.8; }
      .ls-letter-inner { display:inline-block; opacity:0; animation: ls-letter-reveal 1s cubic-bezier(.05,.9,.1,1) forwards; }

      @keyframes ls-pulse-glow { 0%,100%{opacity:.5; transform:scale(.85); box-shadow:0 0 4px rgba(57,255,20,.3);} 50%{opacity:1; transform:scale(1.1); box-shadow:0 0 12px rgba(57,255,20,.9);} }
      @keyframes ls-wave-expand { 0%{transform:scale(.6); opacity:.9;} 100%{transform:scale(2.3); opacity:0;} }
      .ls-dot { width:9px; height:9px; background:${C.accent}; border-radius:50%; position:relative; display:inline-block; animation: ls-pulse-glow 2s infinite ease-in-out; }
      .ls-dot::after { content:''; position:absolute; top:-5px; left:-5px; right:-5px; bottom:-5px; background:rgba(57,255,20,.45); border-radius:50%; animation: ls-wave-expand 2s infinite ease-in-out; }

      @keyframes ls-fadeup { from{opacity:0; transform:translateY(14px);} to{opacity:1; transform:translateY(0);} }
      .ls-fadeup { animation: ls-fadeup .7s cubic-bezier(.16,1,.3,1) both; }

      @keyframes ls-marquee { from{transform:translateX(0);} to{transform:translateX(-50%);} }
      .ls-marquee-track { display:flex; width:max-content; animation: ls-marquee 26s linear infinite; }

      @keyframes ls-drift { 0%{ transform:translate(0,0) rotate(0deg);} 50%{ transform:translate(3%,-2%) rotate(6deg);} 100%{ transform:translate(0,0) rotate(0deg);} }
      @keyframes ls-drift2 { 0%{ transform:translate(0,0) rotate(0deg);} 50%{ transform:translate(-4%,3%) rotate(-8deg);} 100%{ transform:translate(0,0) rotate(0deg);} }

      @keyframes ls-blink-path { 0%{ stroke-dashoffset:400;} 100%{ stroke-dashoffset:0;} }

      .ls-glass-pill { position:fixed; top:0; left:0; z-index:99999; pointer-events:none; padding:.7rem 1.4rem; background:rgba(255,255,255,.08); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); border:1px solid rgba(255,255,255,.18); border-radius:9999px; transform:translate(-50%,-50%) scale(0); opacity:0; transition:opacity .4s cubic-bezier(.16,1,.3,1); }
      .ls-glass-pill.active { opacity:1; }
      .ls-cursor-ring { position:fixed; top:0; left:0; width:44px; height:44px; border:1.5px solid rgba(255,255,255,.45); border-radius:50%; z-index:99998; pointer-events:none; transform:translate(-50%,-50%) scale(0); opacity:0; transition:opacity .4s cubic-bezier(.16,1,.3,1), border-color .4s ease; }
      .ls-cursor-ring.active { opacity:1; }
      .ls-cursor-ring.expanded { border-color:rgba(255,255,255,.15); }

      .ls-input:focus, .ls-btn-focus:focus-visible { outline: 2px solid ${C.accent}; outline-offset: 2px; }
      .ls-root a:focus-visible { outline:2px solid ${C.accent}; outline-offset:4px; border-radius:6px; }
      .ls-input::placeholder { color: ${C.faint}; opacity: 1; }
      @media (max-width: 860px) { .ls-hide-mobile { display: none !important; } }
      .ls-feature-card:hover { border-color: rgba(21,155,88,.35) !important; transform: translateY(-6px); box-shadow:0 18px 42px rgba(23,52,38,.09); }
      .ls-root button { font-family:${FONT_SANS}; }
      .ls-glass { background:rgba(255,255,255,.66); border:1px solid rgba(255,255,255,.78); box-shadow:0 18px 50px rgba(25,82,48,.10); backdrop-filter:blur(18px); -webkit-backdrop-filter:blur(18px); }
      .ls-nav { background:rgba(255,255,255,.76); box-shadow:0 20px 56px rgba(24,80,48,.13), inset 0 1px 0 rgba(255,255,255,.96); }
      .ls-nav-link { position:relative; padding:.5rem .15rem; transition:color .25s ease; }
      .ls-nav-link::after { content:''; position:absolute; height:2px; left:.15rem; right:.15rem; bottom:.1rem; transform:scaleX(0); transform-origin:center; border-radius:9px; background:${C.accent}; transition:transform .25s cubic-bezier(.16,1,.3,1); }
      .ls-nav-link:hover { color:${C.text} !important; }
      .ls-nav-link:hover::after { transform:scaleX(1); }
      .ls-nav-cta { box-shadow:0 10px 22px rgba(21,155,88,.23); }
      .ls-nav-cta:hover { box-shadow:0 14px 30px rgba(21,155,88,.32); }
      .ls-stat-card { position:relative; overflow:hidden; transition:transform .3s cubic-bezier(.16,1,.3,1), background .3s ease; }
      .ls-stat-card::before { content:''; position:absolute; width:150px; height:150px; border-radius:50%; right:-70px; top:-100px; background:radial-gradient(circle, rgba(21,155,88,.16), transparent 70%); opacity:0; transition:opacity .3s ease; }
      .ls-stat-card:hover { transform:translateY(-5px); background:rgba(255,255,255,.92) !important; }
      .ls-stat-card:hover::before { opacity:1; }
      .ls-stat-value { letter-spacing:-.055em; }
      .ls-logo-chip { display:flex; align-items:center; justify-content:center; min-height:62px; padding:.8rem 1.1rem; border:1px solid ${C.border}; border-radius:14px; background:rgba(255,255,255,.58); color:${C.mute}; font-family:${FONT_GEN}; font-size:.9rem; font-weight:650; letter-spacing:.04em; transition:transform .25s ease, color .25s ease, box-shadow .25s ease; animation:ls-fadeup .65s cubic-bezier(.16,1,.3,1) both; }
      .ls-logo-chip:hover { transform:translateY(-4px); color:${C.accent}; box-shadow:0 14px 28px rgba(23,52,38,.08); }
      [data-reveal-section] { opacity:0; transform:translateY(28px); transition:opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1); }
      [data-reveal-section].is-visible { opacity:1; transform:translateY(0); }
      @keyframes ls-route-draw { to { stroke-dashoffset:0; } }
      .ls-route-line { stroke-dasharray:12 9; stroke-dashoffset:220; animation:ls-route-draw 2.4s linear infinite; }
      @media (max-width: 780px) { .hero-content, .route-demo, .customer-grid, .premium-footer-main { grid-template-columns:1fr !important; text-align:center !important; padding-top:7rem !important; } .hero-copy { align-items:center !important; } .hero-art { width:min(88vw,480px) !important; margin:0 auto !important; } .route-demo { padding-top:1rem !important; } .customer-grid { padding-top:0 !important; } .premium-footer-main { padding-top:0 !important; } }
      @media (prefers-reduced-motion: reduce) {
        .ls-word-inner, .ls-letter-inner, .ls-fadeup, [data-reveal-section] { animation: none !important; opacity:1 !important; transform:none !important; filter:none !important; transition:none !important; }
      }
    `}</style>
  );
}

/* ============================================================ */
/*  CUSTOM CURSOR (ring + lagging glass pill)                    */
/* ============================================================ */
function CustomCursor() {
  const ringRef = useRef(null);
  const pillRef = useRef(null);
  useEffect(() => {
    const ring = ringRef.current, pill = pillRef.current;
    if (!ring || !pill) return;
    let mx = window.innerWidth/2, my = window.innerHeight/2;
    let cx = mx, cy = my, rx = mx, ry = my, scale = 0, target = 0, first = true, hovering = false;
    const onMove = (e) => {
      mx = e.clientX; my = e.clientY;
      if (first) { cx=mx; cy=my; rx=mx; ry=my; first=false; ring.classList.add('active'); pill.classList.add('active'); }
      if (!hovering) target = 1;
      const el = e.target.closest && e.target.closest('[data-cursor-hover]');
      if (el && !hovering) { hovering = true; target = 0; ring.classList.add('expanded'); }
      if (!el && hovering) { hovering = false; target = 1; ring.classList.remove('expanded'); }
    };
    const onLeave = () => { target = 0; };
    const onEnter = () => { if (!hovering) target = 1; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('mouseenter', onEnter);
    let raf;
    const tick = () => {
      cx += (mx-cx)*.08; cy += (my-cy)*.08;
      rx = mx; ry = my;
      scale += (target-scale)*.15;
      const rScale = ring.classList.contains('expanded') ? 1.6*scale : scale;
      pill.style.transform = `translate3d(${cx}px,${cy}px,0) translate(-50%,-50%) scale(${scale})`;
      ring.style.transform = `translate3d(${rx}px,${ry}px,0) translate(-50%,-50%) scale(${rScale})`;
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseleave', onLeave); window.removeEventListener('mouseenter', onEnter); cancelAnimationFrame(raf); };
  }, []);
  return (
    <>
      <div ref={ringRef} className="ls-cursor-ring" />
      <div ref={pillRef} className="ls-glass-pill">
        <span style={{ fontFamily: FONT_GEN, fontSize: '.78rem', fontWeight: 500, letterSpacing: '.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
          <span style={{ color: '#fff' }}>Say</span> <span style={{ color: C.accent, textShadow: '0 0 8px rgba(57,255,20,.45)' }}>Hello!</span>
        </span>
      </div>
    </>
  );
}

/* ============================================================ */
/*  REVEAL HELPERS                                                */
/* ============================================================ */
function RevealWords({ text, className, style, stagger = 0.09 }) {
  const words = text.split(' ');
  return (
    <>
      {words.map((w, i) => (
        <React.Fragment key={i}>
          <span className="ls-word-wrap">
            <span className={`ls-word-inner ${className || ''}`} style={{ ...style, animationDelay: `${i * stagger}s` }}>{w}</span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </React.Fragment>
      ))}
    </>
  );
}
function RevealLetters({ text, stagger = 0.045 }) {
  return (
    <>
      {[...text].map((ch, i) => (
        <span className="ls-letter-wrap" key={i}>
          <span className="ls-letter-inner" style={{ animationDelay: `${i * stagger}s` }}>{ch === ' ' ? '\u00A0' : ch}</span>
        </span>
      ))}
    </>
  );
}

/* ============================================================ */
/*  UI ATOMS                                                     */
/* ============================================================ */
function Btn({ children, variant = 'solid', size = 'md', icon: Icon, onClick, type = 'button', style, full, disabled }) {
  const sizes = { sm: { padding: '.55rem 1rem', fontSize: '.82rem' }, md: { padding: '.85rem 1.6rem', fontSize: '.92rem' }, lg: { padding: '1.15rem 2.2rem', fontSize: '1.02rem' } };
  const base = {
    fontFamily: FONT_SANS, fontWeight: 500, letterSpacing: '.01em', borderRadius: 9999,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '.55rem',
    cursor: 'pointer', border: '1px solid transparent', transition: 'all .3s cubic-bezier(.16,1,.3,1)',
    width: full ? '100%' : 'auto', ...sizes[size],
  };
  const variants = {
    solid: { background: C.accent, color: '#000', boxShadow: '0 4px 24px rgba(57,255,20,.18)' },
    ghost: { background: '#ffffff', color: C.text, border: `1px solid ${C.borderStrong}` },
    dark: { background: C.text, color: '#ffffff', border: `1px solid ${C.borderStrong}` },
    subtle: { background: C.cardAlt, color: C.text },
    danger: { background: 'rgba(255,92,92,.12)', color: C.danger, border: `1px solid rgba(255,92,92,.3)` },
  };
  return (
    <button
      type={type}
      data-cursor-hover={disabled ? undefined : true}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className="ls-btn-focus"
      style={{ ...base, ...variants[variant], ...style, ...(disabled ? { opacity: 0.4, cursor: 'not-allowed' } : {}) }}
      onMouseEnter={(e) => { if (disabled) return; if (variant === 'ghost') { e.currentTarget.style.background = C.accentSoft; e.currentTarget.style.color = C.text; } if (variant === 'dark') { e.currentTarget.style.background = C.accent; e.currentTarget.style.color = '#ffffff'; } if (variant === 'solid') e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={(e) => { if (disabled) return; if (variant === 'ghost' || variant === 'dark') { e.currentTarget.style.background = variants[variant].background; e.currentTarget.style.color = variants[variant].color; } if (variant === 'solid') e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      {Icon ? <Icon size={16} /> : null}
      {children}
    </button>
  );
}

function Badge({ children, tone = 'default' }) {
  const tones = {
    default: { bg: C.cardAlt, fg: C.mute },
    good: { bg: C.accentSoft, fg: C.accent },
    warn: { bg: 'rgba(255,194,75,.14)', fg: C.warn },
    danger: { bg: 'rgba(255,92,92,.14)', fg: C.danger },
    info: { bg: 'rgba(92,200,255,.14)', fg: C.info },
  };
  const t = tones[tone] || tones.default;
  return (
    <span style={{ background: t.bg, color: t.fg, fontSize: '.72rem', fontWeight: 600, padding: '.28rem .6rem', borderRadius: 6, letterSpacing: '.02em', whiteSpace: 'nowrap', fontFamily: FONT_SANS }}>
      {children}
    </span>
  );
}

function StatusBadge({ status }) {
  const tone = status === 'Delivered' ? 'good' : status === 'Failed' ? 'danger' : status === 'In Transit' || status === 'Assigned' ? 'info' : status === 'Pending' || status === 'Unassigned' ? 'warn' : 'default';
  return <Badge tone={tone}>{status}</Badge>;
}

function Card({ children, style, className = '', padding = '1.4rem', ...rest }) {
  return (
    <div className={className} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding, ...style }} {...rest}>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: 'block', marginBottom: '1rem' }}>
      <span style={{ display: 'block', fontSize: '.78rem', color: C.mute, marginBottom: '.4rem', fontFamily: FONT_SANS }}>{label}</span>
      {children}
    </label>
  );
}

const inputStyle = {
  width: '100%', background: '#ffffff', border: `1px solid ${C.borderStrong}`, borderRadius: 9,
  padding: '.75rem .9rem', color: C.text, fontFamily: FONT_SANS, fontSize: '.9rem',
};

function TextInput(props) { return <input {...props} className="ls-input" style={{ ...inputStyle, ...(props.style||{}) }} />; }
function Select({ children, ...props }) { return <select {...props} className="ls-input" style={inputStyle}>{children}</select>; }

function Toggle({ checked, onChange, label }) {
  return (
    <button data-cursor-hover type="button" onClick={() => onChange(!checked)} style={{ display: 'flex', alignItems: 'center', gap: '.6rem', background: 'none', border: 'none', cursor: 'pointer', color: C.text, fontFamily: FONT_SANS, fontSize: '.85rem', padding: 0 }}>
      <span style={{ width: 36, height: 20, borderRadius: 999, background: checked ? C.accent : C.borderStrong, position: 'relative', transition: 'background .25s', flexShrink: 0 }}>
        <span style={{ position: 'absolute', top: 2, left: checked ? 18 : 2, width: 16, height: 16, borderRadius: '50%', background: checked ? '#000' : '#fff', transition: 'left .25s' }} />
      </span>
      {label}
    </button>
  );
}

function Modal({ open, onClose, title, children, width = 560 }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', backdropFilter: 'blur(4px)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }} onClick={onClose}>
      <div className="ls-fadeup ls-scrollbar" style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 16, width, maxWidth: '100%', maxHeight: '86vh', overflowY: 'auto', padding: '1.8rem' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.4rem' }}>
          <h3 style={{ fontFamily: FONT_GEN, fontSize: '1.2rem', fontWeight: 500 }}>{title}</h3>
          <button data-cursor-hover onClick={onClose} style={{ background: 'rgba(255,255,255,.06)', border: 'none', borderRadius: 8, width: 30, height: 30, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function SectionEyebrow({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', marginBottom: '1rem', justifyContent: 'center' }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.accent, boxShadow: `0 0 8px ${C.accent}` }} />
      <span style={{ fontFamily: FONT_SANS, fontSize: '.78rem', letterSpacing: '.14em', textTransform: 'uppercase', color: C.mute }}>{children}</span>
    </div>
  );
}

/* ============================================================ */
/*  ANIMATED ROUTE-NETWORK BACKDROP (replaces the flower video)  */
/* ============================================================ */
function RouteCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, nodes, raf, t = 0;
    const resize = () => {
      w = canvas.width = canvas.offsetWidth * devicePixelRatio;
      h = canvas.height = canvas.offsetHeight * devicePixelRatio;
      const n = 22;
      nodes = Array.from({ length: n }).map(() => ({
        x: Math.random() * w, y: Math.random() * h * 0.9 + h * 0.1,
        vx: (Math.random() - 0.5) * 0.15, vy: (Math.random() - 0.5) * 0.15,
      }));
    };
    resize();
    window.addEventListener('resize', resize);
    const draw = () => {
      t += 1;
      ctx.clearRect(0, 0, w, h);
      nodes.forEach(p => { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > w) p.vx *= -1; if (p.y < 0 || p.y > h) p.vy *= -1; });
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < w * 0.16) {
            ctx.strokeStyle = `rgba(57,255,20,${0.14 * (1 - d / (w * 0.16))})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      nodes.forEach((p, i) => {
        const pulse = 1.6 + Math.sin(t * 0.02 + i) * 0.8;
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.beginPath(); ctx.arc(p.x, p.y, pulse * devicePixelRatio, 0, Math.PI * 2); ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(raf); };
  }, []);
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
}

/* ============================================================ */
/*  LANDING PAGE                                                 */
/* ============================================================ */
function Nav({ onLogin, onSignup }) {
  const [open, setOpen] = useState(false);
  const links = ['Product', 'Routing AI', 'Track delivery', 'Pricing', 'FAQ'];
  const destinations = { Product: 'product', 'Routing AI': 'routing-ai-demo', 'Track delivery': 'customer-tracking', Pricing: 'pricing', FAQ: 'faq' };
  const scrollToSection = (id) => {
    const target = document.getElementById(id);
    if (target) window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 98, behavior: 'smooth' });
  };
  return (
    <nav className="ls-glass ls-nav" style={{ position: 'fixed', top: '1rem', left: '50%', transform: 'translateX(-50%)', width: 'min(1260px, calc(100% - 2rem))', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '.7rem .85rem .7rem 1rem', borderRadius: 22 }}>
      <a href="#top" aria-label="Fleetly home" style={{ display: 'flex', alignItems: 'center', gap: '.65rem', textDecoration: 'none', color: C.text }}>
        <span style={{ width: 34, height: 34, borderRadius: 11, display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg, #1bb867, #118a4c)', color: '#fff', boxShadow: '0 8px 16px rgba(21,155,88,.25)' }}><Route size={18} strokeWidth={2.5} /></span>
        <span style={{ fontFamily: FONT_GEN, fontSize: '1.22rem', fontWeight: 700, letterSpacing: '-.055em' }}>Fleetly</span>
      </a>
      <div className="ls-hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginLeft: '3rem' }}>
        {links.map(l => <a className="ls-nav-link" key={l} data-cursor-hover href={`#${destinations[l]}`} onClick={(e) => { e.preventDefault(); scrollToSection(destinations[l]); e.currentTarget.blur(); }} style={{ fontSize: '.88rem', fontWeight: 500, color: C.mute, textDecoration: 'none' }}>{l}</a>)}
      </div>
      <div style={{ display: 'flex', gap: '.9rem', alignItems: 'center', paddingLeft: '1.2rem', borderLeft: `1px solid ${C.border}` }}>
        <a data-cursor-hover onClick={onLogin} style={{ fontSize: '.88rem', fontWeight: 600, cursor: 'pointer', color: C.text }}>Log in</a>
        <Btn size="sm" style={{ padding: '.7rem 1.15rem', fontWeight: 650 }} onClick={onSignup} icon={ArrowUpRight}>Book a demo</Btn>
      </div>
    </nav>
  );
}

function useLiveCounter(target, decimals = 0) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf, start;
    const dur = 1600;
    const step = (ts) => { if (!start) start = ts; const p = Math.min(1, (ts - start) / dur); setVal(target * (1 - Math.pow(1 - p, 3))); if (p < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return val.toFixed(decimals);
}

function Hero({ onSignup, onExplore }) {
  return (
    <header style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', borderBottom: `1px solid ${C.border}`, background: 'radial-gradient(circle at 85% 20%, #ddf8e7 0, transparent 28%), linear-gradient(135deg, #f9fdf9, #edf8ef)' }}>
      <div className="hero-content" style={{ position: 'relative', zIndex: 2, flex: 1, maxWidth: 1220, width: '100%', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.02fr .98fr', alignItems: 'center', gap: '2rem', padding: '8rem 1.5rem 4rem' }}>
        <div className="hero-copy" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <h1 style={{ fontFamily: FONT_SERIF, fontSize: 'clamp(2.6rem, 5.2vw, 4.9rem)', fontWeight: 500, lineHeight: 1.02, letterSpacing: '-.035em', maxWidth: 640 }}>
          <RevealWords text="Every delivery," /> <br />
          <RevealWords text="perfectly in motion." stagger={0.09} style={{}} />
        </h1>
        <p className="ls-fadeup" style={{ maxWidth: 560, color: C.mute, marginTop: '1.6rem', fontSize: '1.05rem', lineHeight: 1.6, animationDelay: '.5s' }}>
          Fleetly unifies dispatch, fleet, warehouse and last-mile tracking into one AI-driven platform — built for teams moving thousands of packages a day.
        </p>
        <div className="ls-fadeup" style={{ display: 'flex', gap: '1rem', marginTop: '2.4rem', animationDelay: '.65s', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Btn size="lg" onClick={onExplore} icon={Play}>Explore operations console</Btn>
          <Btn size="lg" variant="ghost" onClick={() => document.getElementById('customer-tracking')?.scrollIntoView({ behavior: 'smooth' })}>Track a delivery</Btn>
        </div>
        <div className="ls-fadeup" style={{ display: 'flex', gap: '.9rem', marginTop: '1.6rem', animationDelay: '.8s', alignItems: 'center', color: C.faint, fontSize: '.85rem' }}>
          <span className="ls-dot" /> No credit card required &nbsp;·&nbsp; Live in under a week
        </div>
        </div>
        <div className="hero-art ls-fadeup ls-glass" style={{ animationDelay: '.24s', position: 'relative', borderRadius: 30, padding: '.8rem' }}>
          <img src="/delivery-hero.svg" alt="Delivery app interface displayed on two mobile phones" style={{ width: '100%', display: 'block', borderRadius: 23, filter: 'drop-shadow(0 28px 36px rgba(23, 75, 43, .16))' }} />
        </div>
      </div>
      <LiveStatsStrip />
    </header>
  );
}

function LiveStatsStrip() {
  const deliveries = useLiveCounter(482910, 0);
  const onTime = useLiveCounter(98.6, 1);
  const fleets = useLiveCounter(1240, 0);
  const co2 = useLiveCounter(312, 0);
  const stats = [
    { label: 'Deliveries routed today', value: Number(deliveries).toLocaleString(), icon: Package },
    { label: 'On-time rate', value: `${onTime}%`, icon: Gauge },
    { label: 'Fleets on Fleetly', value: Number(fleets).toLocaleString(), icon: Truck },
    { label: 'Tons CO\u2082 saved this month', value: co2, icon: Leaf },
  ];
  return (
    <section style={{ position: 'relative', zIndex: 2, background: 'linear-gradient(90deg, rgba(255,255,255,.70), rgba(232,248,237,.78), rgba(255,255,255,.70))', borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1260, margin: '0 auto', padding: '.65rem 1.5rem 0', display: 'flex', alignItems: 'center', gap: '.45rem', color: C.accent, fontSize: '.68rem', fontWeight: 700, letterSpacing: '.11em' }}><span className="ls-dot" style={{ transform: 'scale(.6)' }} /> LIVE DELIVERY NETWORK</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', maxWidth: 1260, margin: '0 auto', padding: '.55rem 1.5rem 1rem' }}>
      {stats.map((s, i) => (
        <div key={i} className="ls-stat-card" style={{ padding: '1.15rem 1.35rem', borderLeft: i ? `1px solid ${C.border}` : 'none', display: 'flex', flexDirection: 'column', gap: '.5rem', animation: 'ls-fadeup .65s cubic-bezier(.16,1,.3,1) both', animationDelay: `${i * .1}s`, borderRadius: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.55rem', color: C.mute }}><span style={{ width: 28, height: 28, borderRadius: 9, background: C.accentSoft, display: 'grid', placeItems: 'center' }}><s.icon size={14} color={C.accent} /></span><span style={{ fontSize: '.76rem', fontWeight: 600, letterSpacing: '.01em' }}>{s.label}</span></div>
          <div className="ls-stat-value" style={{ fontFamily: FONT_GEN, fontSize: '2rem', fontWeight: 650, color: C.text }}>{s.value}</div>
        </div>
      ))}
      </div>
    </section>
  );
}

function LogosStrip() {
  return (
    <section style={{ padding: '3.2rem 1.5rem', borderBottom: `1px solid ${C.border}`, background: 'rgba(255,255,255,.28)' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.65rem', marginBottom: '1.4rem' }}><span style={{ height: 1, width: 36, background: C.borderStrong }} /><p style={{ textAlign: 'center', color: C.mute, fontSize: '.76rem', fontWeight: 700, letterSpacing: '.13em' }}>TRUSTED BY MODERN OPERATIONS TEAMS</p><span style={{ height: 1, width: 36, background: C.borderStrong }} /></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))', gap: '.75rem' }}>
          {LOGOS.map((l, i) => <div key={l} className="ls-logo-chip" style={{ animationDelay: `${i * .08}s` }}>{l}</div>)}
        </div>
      </div>
    </section>
  );
}

function RouteAiDemo() {
  const [pickup, setPickup] = useState('Austin, TX');
  const [dropoff, setDropoff] = useState('North Loop, Austin');
  const [optimizing, setOptimizing] = useState(false);
  const [route, setRoute] = useState(null);
  const optimize = () => {
    setOptimizing(true);
    setRoute(null);
    window.setTimeout(() => { setOptimizing(false); setRoute({ minutes: 24, distance: '8.4 mi', saved: '14 min', stops: 3 }); }, 1100);
  };
  return (
    <div id="routing-ai-demo" className="ls-glass route-demo" style={{ maxWidth: 980, margin: '3rem auto 0', borderRadius: 22, padding: '1.1rem', display: 'grid', gridTemplateColumns: 'minmax(250px,.85fr) 1.15fr', gap: '1rem', scrollMarginTop: 98 }}>
      <div style={{ padding: '1.15rem', display: 'flex', flexDirection: 'column', gap: '.9rem' }}>
        <div><p style={{ color: C.accent, fontSize: '.76rem', fontWeight: 700, letterSpacing: '.08em' }}>INTERACTIVE DEMO</p><h3 style={{ marginTop: '.35rem', fontFamily: FONT_GEN, fontSize: '1.2rem' }}>Plan a smarter route</h3></div>
        <Field label="Pickup"><TextInput value={pickup} onChange={e => setPickup(e.target.value)} /></Field>
        <Field label="Drop-off"><TextInput value={dropoff} onChange={e => setDropoff(e.target.value)} /></Field>
        <Btn full icon={optimizing ? RefreshCw : Sparkles} onClick={optimize} disabled={optimizing}>{optimizing ? 'Optimizing your route…' : 'Optimize route'}</Btn>
        {route && <div className="ls-fadeup" style={{ background: C.accentSoft, border: `1px solid ${C.accentBorder}`, borderRadius: 12, padding: '.8rem' }}><strong style={{ color: C.accent }}>Route ready</strong><p style={{ marginTop: '.25rem', color: C.mute, fontSize: '.82rem' }}>AI found a faster, lower-emission sequence.</p></div>}
      </div>
      <div style={{ minHeight: 330, position: 'relative', overflow: 'hidden', borderRadius: 16, background: 'linear-gradient(145deg, #e9f7ed, #d9f1e1)' }}>
        <svg viewBox="0 0 520 330" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }} aria-label="Optimized delivery route preview">
          <path d="M0 65 C96 115 116 26 206 76 S337 130 432 70 S478 125 530 104 M-15 230 C75 185 130 270 214 228 S364 193 540 255" fill="none" stroke="rgba(22,72,45,.12)" strokeWidth="24" strokeLinecap="round" />
          <path className="ls-route-line" d="M70 251 C135 230 160 95 251 134 S354 222 446 86" fill="none" stroke={C.accent} strokeWidth="6" strokeLinecap="round" />
          {[['70','251','A'],['251','134','1'],['340','188','2'],['446','86','B']].map(([cx,cy,label], i) => <g key={label}><circle cx={cx} cy={cy} r="15" fill={i === 0 || i === 3 ? C.text : '#ffffff'} stroke={C.accent} strokeWidth="3"/><text x={cx} y={Number(cy)+5} textAnchor="middle" fill={i === 0 || i === 3 ? '#ffffff' : C.text} fontFamily="Arial" fontSize="12" fontWeight="700">{label}</text></g>)}
        </svg>
        <div className="ls-glass" style={{ position: 'absolute', top: 16, right: 16, borderRadius: 13, padding: '.75rem .9rem', minWidth: 145 }}><p style={{ color: C.faint, fontSize: '.7rem' }}>PREDICTED ARRIVAL</p><p style={{ fontFamily: FONT_GEN, fontSize: '1.25rem', marginTop: '.15rem' }}>{route ? `${route.minutes} min` : '38 min'}</p></div>
        <div className="ls-glass" style={{ position: 'absolute', bottom: 16, left: 16, borderRadius: 13, padding: '.7rem .9rem', display: 'flex', gap: '1.1rem' }}>{[['Distance', route?.distance || '10.1 mi'], ['Time saved', route?.saved || '—'], ['Stops', route?.stops || '3']].map(([label,value]) => <div key={label}><p style={{ color: C.faint, fontSize: '.68rem' }}>{label}</p><p style={{ fontWeight: 700, marginTop: '.15rem', fontSize: '.86rem' }}>{value}</p></div>)}</div>
      </div>
    </div>
  );
}

function CustomerTrackingSection() {
  const [code, setCode] = useState('LS-10231');
  const [tracked, setTracked] = useState(true);
  const shipment = SHIPMENTS[1];
  return (
    <section id="customer-tracking" data-reveal-section style={{ padding: '7rem 1.5rem', borderBottom: `1px solid ${C.border}`, scrollMarginTop: 90 }}>
      <div className="customer-grid" style={{ maxWidth: 1050, margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(250px,.8fr) 1.2fr', gap: '2rem', alignItems: 'center' }}>
        <div><SectionEyebrow>Customer experience</SectionEyebrow><h2 style={{ fontFamily: FONT_SERIF, fontSize: 'clamp(2rem,3.6vw,3rem)', lineHeight: 1.1, marginTop: '.7rem' }}>Tracking that feels reassuring.</h2><p style={{ color: C.mute, lineHeight: 1.65, marginTop: '1rem' }}>Give customers a simple link to live location, an accurate arrival window, and clear delivery updates—without making them download an app.</p><div style={{ display: 'flex', gap: '.6rem', marginTop: '1.4rem' }}><TextInput aria-label="Tracking number" value={code} onChange={e => setCode(e.target.value)} /><Btn onClick={() => setTracked(true)}>Track</Btn></div></div>
        <div className="ls-glass" style={{ borderRadius: 22, padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.35rem .35rem .8rem' }}><div><p style={{ fontSize: '.74rem', color: C.faint }}>DELIVERY STATUS</p><p style={{ fontFamily: FONT_GEN, fontSize: '1rem', marginTop: '.18rem' }}>{code || shipment.id}</p></div><Badge tone="info">On the way</Badge></div>
          {tracked && <><MiniMap seed={29} /><div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', padding: '.9rem .35rem .2rem' }}><div><p style={{ color: C.faint, fontSize: '.75rem' }}>ARRIVING</p><p style={{ fontWeight: 700, marginTop: '.2rem' }}>Today, 2:10–2:30 PM</p></div><div style={{ textAlign: 'right' }}><p style={{ color: C.faint, fontSize: '.75rem' }}>DRIVER</p><p style={{ fontWeight: 700, marginTop: '.2rem' }}>M. Chen · 4.9 ★</p></div></div></>}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="product" data-reveal-section style={{ padding: '7rem 1.5rem', borderBottom: `1px solid ${C.border}`, scrollMarginTop: 98 }}>
      <div style={{ maxWidth: 620, margin: '0 auto', textAlign: 'center' }}>
        <SectionEyebrow>Platform</SectionEyebrow>
        <h2 style={{ fontFamily: FONT_SERIF, fontSize: 'clamp(1.9rem,3.4vw,2.8rem)', fontWeight: 400, lineHeight: 1.2 }}>Every part of the delivery chain, one screen.</h2>
      </div>
      <RouteAiDemo />
      <div style={{ maxWidth: 1180, margin: '3.5rem auto 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px,1fr))', gap: '1.2rem' }}>
        {FEATURES.map((f, i) => (
          <Card key={i} style={{ transition: 'border-color .3s, transform .3s' }} className="ls-feature-card">
            <div style={{ width: 42, height: 42, borderRadius: 10, background: C.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem' }}>
              <f.icon size={19} color={C.accent} />
            </div>
            <h3 style={{ fontFamily: FONT_GEN, fontSize: '1.08rem', fontWeight: 500, marginBottom: '.55rem' }}>{f.title}</h3>
            <p style={{ color: C.mute, fontSize: '.9rem', lineHeight: 1.55 }}>{f.desc}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const [i, setI] = useState(0);
  useEffect(() => { const id = setInterval(() => setI(v => (v + 1) % TESTIMONIALS.length), 5500); return () => clearInterval(id); }, []);
  const t = TESTIMONIALS[i];
  return (
    <section style={{ padding: '7rem 1.5rem', borderBottom: `1px solid ${C.border}`, textAlign: 'center' }}>
      <SectionEyebrow>Customers</SectionEyebrow>
      <div style={{ maxWidth: 760, margin: '0 auto', minHeight: 200 }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '.2rem', marginBottom: '1.4rem' }}>
          {Array.from({ length: 5 }).map((_, k) => <Star key={k} size={16} fill={C.accent} color={C.accent} />)}
        </div>
        <p key={i} className="ls-fadeup" style={{ fontFamily: FONT_SERIF, fontSize: 'clamp(1.3rem,2.6vw,1.8rem)', lineHeight: 1.45, fontStyle: 'italic', fontWeight: 400 }}>&ldquo;{t.quote}&rdquo;</p>
        <p style={{ marginTop: '1.6rem', color: '#fff', fontSize: '.95rem' }}>{t.name} <span style={{ color: C.faint }}>&nbsp;—&nbsp; {t.role}</span></p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '.5rem', marginTop: '2rem' }}>
        {TESTIMONIALS.map((_, k) => (
          <button key={k} data-cursor-hover onClick={() => setI(k)} style={{ width: k === i ? 22 : 8, height: 8, borderRadius: 999, border: 'none', background: k === i ? C.accent : 'rgba(255,255,255,.2)', cursor: 'pointer', transition: 'all .3s' }} />
        ))}
      </div>
    </section>
  );
}

function PricingSection({ onSignup }) {
  return (
    <section id="pricing" style={{ padding: '7rem 1.5rem', borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 620, margin: '0 auto', textAlign: 'center' }}>
        <SectionEyebrow>Pricing</SectionEyebrow>
        <h2 style={{ fontFamily: FONT_SERIF, fontSize: 'clamp(1.9rem,3.4vw,2.8rem)', fontWeight: 400 }}>Priced for the size of your fleet.</h2>
      </div>
      <div style={{ maxWidth: 1020, margin: '3.5rem auto 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: '1.2rem', alignItems: 'stretch' }}>
        {PRICING.map((p, i) => (
          <div key={i} style={{ background: p.highlight ? '#e8f8ed' : C.card, border: `1px solid ${p.highlight ? C.accentBorder : C.border}`, borderRadius: 16, padding: '2rem', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: p.highlight ? '0 18px 44px rgba(21,155,88,.11)' : 'none' }}>
            {p.highlight && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)' }}><Badge tone="good">Most popular</Badge></div>}
            <h3 style={{ fontFamily: FONT_GEN, fontSize: '1.1rem', color: C.mute, marginBottom: '.6rem' }}>{p.tier}</h3>
            <div style={{ fontFamily: FONT_SERIF, fontSize: '2.6rem' }}>{p.price}</div>
            <p style={{ color: C.faint, fontSize: '.82rem', marginBottom: '1.6rem' }}>{p.period}</p>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '.7rem', marginBottom: '1.8rem' }}>
              {p.features.map((f, k) => (
                <div key={k} style={{ display: 'flex', gap: '.6rem', alignItems: 'flex-start', fontSize: '.87rem', color: C.text }}>
                  <CheckCircle2 size={15} color={C.accent} style={{ marginTop: 2, flexShrink: 0 }} /> {f}
                </div>
              ))}
            </div>
            <Btn variant={p.highlight ? 'solid' : 'ghost'} full onClick={() => p.tier === 'Growth' ? document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) : onSignup()}>{p.cta}</Btn>
          </div>
        ))}
      </div>
    </section>
  );
}

function FaqSection() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" style={{ padding: '7rem 1.5rem', borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 620, margin: '0 auto', textAlign: 'center', marginBottom: '3rem' }}>
        <SectionEyebrow>FAQ</SectionEyebrow>
        <h2 style={{ fontFamily: FONT_SERIF, fontSize: 'clamp(1.9rem,3.4vw,2.8rem)', fontWeight: 400 }}>Questions, answered.</h2>
      </div>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        {FAQS.map((f, i) => (
          <div key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
            <button data-cursor-hover onClick={() => setOpen(open === i ? -1 : i)} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', color: C.text, padding: '1.3rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontFamily: FONT_GEN, fontSize: '1rem' }}>
              {f.q}
              {open === i ? <ChevronUp size={18} color={C.faint} /> : <ChevronDown size={18} color={C.faint} />}
            </button>
            {open === i && <p className="ls-fadeup" style={{ color: C.mute, fontSize: '.9rem', lineHeight: 1.6, paddingBottom: '1.4rem', maxWidth: 620 }}>{f.a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

function ContactSection({ onSignup }) {
  const [sent, setSent] = useState(false);
  return (
    <section id="contact" style={{ padding: '7rem 1.5rem', borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 640, margin: '0 auto', background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: FONT_SERIF, fontSize: '2rem', fontWeight: 400 }}>Request a demo</h2>
          <p style={{ color: C.mute, marginTop: '.6rem', fontSize: '.9rem' }}>Fifteen minutes with our team. No pressure, just routes.</p>
        </div>
        {sent ? (
          <div className="ls-fadeup" style={{ textAlign: 'center', padding: '2rem 0' }}>
            <CheckCircle2 size={34} color={C.accent} style={{ marginBottom: '1rem' }} />
            <p style={{ fontFamily: FONT_GEN, fontSize: '1.1rem' }}>Request received.</p>
            <p style={{ color: C.mute, fontSize: '.88rem', marginTop: '.4rem' }}>Someone from our team will reach out within one business day.</p>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Field label="Full name"><TextInput required placeholder="Jordan Lee" /></Field>
              <Field label="Work email"><TextInput required type="email" placeholder="jordan@company.com" /></Field>
            </div>
            <Field label="Company"><TextInput required placeholder="Company name" /></Field>
            <Field label="Fleet size">
              <Select><option>1–10 vehicles</option><option>11–50 vehicles</option><option>51–200 vehicles</option><option>200+ vehicles</option></Select>
            </Field>
            <Btn full size="lg" type="submit" icon={ArrowRight}>Send request</Btn>
          </form>
        )}
      </div>
    </section>
  );
}

function LandingFooter() {
  return (
    <footer style={{ padding: '4rem 1.5rem 2rem' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ fontFamily: FONT_GEN, fontSize: '1.4rem', fontWeight: 400 }}>Stay in Touch</h2>
          <h2 style={{ fontFamily: FONT_GEN, fontSize: '1.4rem', fontWeight: 400 }}>Think. Build. Repeat.</h2>
        </div>
        <hr style={{ border: 'none', height: 1, background: C.border, margin: '1.6rem 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.4rem' }}>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <a data-cursor-hover href="#" aria-label="LinkedIn" style={{ color: C.mute, fontWeight: 700, textDecoration: 'none' }}>in</a>
            <a data-cursor-hover href="#" aria-label="X" style={{ color: C.mute, fontWeight: 700, textDecoration: 'none' }}>𝕏</a>
            <a data-cursor-hover href="#" aria-label="Instagram" style={{ color: C.mute, fontWeight: 700, textDecoration: 'none' }}>◎</a>
          </div>
          <nav style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {['About', 'Features', 'Pricing', 'Contact'].map(l => <a key={l} data-cursor-hover href="#" style={{ fontSize: '.9rem', textDecoration: 'none', color: '#fff' }}>{l}</a>)}
          </nav>
          <div style={{ color: 'rgba(255,255,255,.45)', fontSize: '.9rem' }}>© 2026 Fleetly</div>
        </div>
      </div>
      <div style={{ width: '100%', textAlign: 'center', marginTop: '2rem', overflow: 'hidden' }}>
        <h2 style={{ fontFamily: FONT_GEN, fontSize: 'min(15vw, 9rem)', fontWeight: 400, letterSpacing: '-.03em', lineHeight: 0.85, opacity: 0.95, margin: 0 }}>
          <RevealLetters text="Fleetly" />
        </h2>
      </div>
    </footer>
  );
}

function PremiumFooter({ onSignup }) {
  const footerLinks = { Product: ['Routing AI', 'Live dispatch', 'Customer tracking'], Company: ['About us', 'Careers', 'Contact'], Resources: ['Help center', 'Privacy', 'Terms'] };
  return (
    <footer style={{ padding: '1.5rem', background: '#173426', color: '#f6fff8' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '3.4rem 2.7rem 0', borderRadius: 26, background: 'radial-gradient(circle at 92% 5%, rgba(58,201,116,.25), transparent 31%), linear-gradient(135deg, #1d422e, #122c20)', overflow: 'hidden' }}>
        <div className="premium-footer-main" style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: '3rem', paddingBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,.16)' }}>
          <div><div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', fontFamily: FONT_GEN, fontSize: '1.2rem', fontWeight: 700 }}><span style={{ width: 30, height: 30, borderRadius: 9, display: 'grid', placeItems: 'center', background: C.accent }}><Route size={16} color="#fff" /></span>Fleetly</div><h2 style={{ fontFamily: FONT_SERIF, fontSize: 'clamp(2rem,3.6vw,3.1rem)', fontWeight: 500, lineHeight: 1.05, letterSpacing: '-.035em', marginTop: '1.6rem', maxWidth: 520 }}>Every great delivery starts with a clearer route.</h2><p style={{ marginTop: '1rem', color: 'rgba(246,255,248,.68)', maxWidth: 450, lineHeight: 1.6 }}>Bring your dispatch, drivers and customers into one calm, connected operation.</p><Btn size="md" style={{ marginTop: '1.5rem', background: '#f6fff8', color: C.text }} icon={ArrowUpRight} onClick={onSignup}>Talk to our team</Btn></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.1rem', alignContent: 'start', paddingTop: '.5rem' }}>{Object.entries(footerLinks).map(([group, links]) => <div key={group}><p style={{ color: '#9ce7b4', fontSize: '.72rem', fontWeight: 700, letterSpacing: '.1em', marginBottom: '1rem' }}>{group.toUpperCase()}</p>{links.map(link => <a data-cursor-hover key={link} href="#" style={{ display: 'block', marginBottom: '.7rem', color: 'rgba(246,255,248,.74)', fontSize: '.82rem', textDecoration: 'none' }}>{link}</a>)}</div>)}</div>
        </div>
        <div style={{ padding: '1.1rem 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', color: 'rgba(246,255,248,.52)', fontSize: '.78rem' }}><div style={{ display: 'flex', gap: '.75rem' }}><a data-cursor-hover href="#" aria-label="LinkedIn" style={{ color: '#fff', textDecoration: 'none', width: 27, height: 27, borderRadius: 8, background: 'rgba(255,255,255,.12)', display: 'grid', placeItems: 'center', fontWeight: 700 }}>in</a><a data-cursor-hover href="#" aria-label="X" style={{ color: '#fff', textDecoration: 'none', width: 27, height: 27, borderRadius: 8, background: 'rgba(255,255,255,.12)', display: 'grid', placeItems: 'center', fontWeight: 700 }}>X</a><a data-cursor-hover href="#" aria-label="Instagram" style={{ color: '#fff', textDecoration: 'none', width: 27, height: 27, borderRadius: 8, background: 'rgba(255,255,255,.12)', display: 'grid', placeItems: 'center', fontWeight: 700 }}>◎</a></div><span>© 2026 Fleetly. Built for the last mile.</span></div>
        <div style={{ fontFamily: FONT_GEN, fontWeight: 700, fontSize: 'clamp(4rem, 14vw, 10rem)', letterSpacing: '-.09em', lineHeight: .72, color: 'rgba(255,255,255,.075)', whiteSpace: 'nowrap', transform: 'translateX(-.06em)' }}>Fleetly</div>
      </div>
    </footer>
  );
}

function LandingPage({ onLogin, onSignup, onExplore }) {
  useEffect(() => {
    const sections = document.querySelectorAll('[data-reveal-section]');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: 0.13 });
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  return (
    <div>
      <Nav onLogin={onLogin} onSignup={onSignup} />
      <Hero onSignup={onSignup} onExplore={onExplore} />
      <div data-reveal-section><LogosStrip /></div>
      <FeaturesSection />
      <CustomerTrackingSection />
      <div data-reveal-section><TestimonialsSection /></div>
      <div data-reveal-section><PricingSection onSignup={onSignup} /></div>
      <div data-reveal-section><FaqSection /></div>
      <div data-reveal-section><ContactSection onSignup={onSignup} /></div>
      <div data-reveal-section><PremiumFooter onSignup={onSignup} /></div>
    </div>
  );
}

/* ============================================================ */
/*  AUTH                                                          */
/* ============================================================ */
const ROLES = ['Admin', 'Operations Manager', 'Dispatcher', 'Delivery Partner', 'Customer', 'Warehouse Staff', 'Customer Support', 'Analytics Team'];

function AuthShell({ children, footer, onBack }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.35 }}><RouteCanvas /></div>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(57,255,20,.06), transparent)' }} />
      {onBack && <button type="button" onClick={onBack} className="ls-btn-focus" style={{ position: 'absolute', top: '1.6rem', left: '1.6rem', zIndex: 3, display: 'inline-flex', alignItems: 'center', gap: '.45rem', border: `1px solid ${C.borderStrong}`, background: 'rgba(255,255,255,.76)', color: C.text, borderRadius: 999, padding: '.62rem .9rem', fontSize: '.82rem', fontWeight: 600, cursor: 'pointer', backdropFilter: 'blur(12px)' }}><ChevronLeft size={16} /> Back to home</button>}
      <div className="ls-fadeup" style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontFamily: FONT_GEN, fontSize: '1.5rem', fontWeight: 600 }}>Fleetly</div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: '2.2rem' }}>
          {children}
        </div>
        {footer && <p style={{ textAlign: 'center', color: C.faint, fontSize: '.85rem', marginTop: '1.4rem' }}>{footer}</p>}
      </div>
    </div>
  );
}

function SocialButtons() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.7rem', marginBottom: '1.4rem' }}>
      <Btn variant="dark" full>Google</Btn>
      <Btn variant="dark" full>Microsoft</Btn>
    </div>
  );
}

function Divider({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem', margin: '1.4rem 0', color: C.faint, fontSize: '.78rem' }}>
      <div style={{ flex: 1, height: 1, background: C.border }} /> {children} <div style={{ flex: 1, height: 1, background: C.border }} />
    </div>
  );
}

function LoginView({ go, onBack }) {
  const [showPw, setShowPw] = useState(false);
  const [mfa, setMfa] = useState(false);
  return (
    <AuthShell onBack={onBack} footer={<>New to Fleetly? <a data-cursor-hover onClick={() => go('register')} style={{ color: C.accent, cursor: 'pointer' }}>Create an account</a></>}>
      <h2 style={{ fontFamily: FONT_SERIF, fontSize: '1.6rem', fontWeight: 400, marginBottom: '.3rem' }}>Welcome back</h2>
      <p style={{ color: C.mute, fontSize: '.88rem', marginBottom: '1.6rem' }}>Log in to your operations console.</p>
      <SocialButtons />
      <Divider>OR</Divider>
      <form onSubmit={(e) => { e.preventDefault(); go(mfa ? 'otp' : 'app'); }}>
        <Field label="Login as">
          <Select><option>Select your role</option>{ROLES.map(r => <option key={r}>{r}</option>)}</Select>
        </Field>
        <Field label="Email"><TextInput required type="email" placeholder="you@company.com" /></Field>
        <Field label="Password">
          <div style={{ position: 'relative' }}>
            <TextInput required type={showPw ? 'text' : 'password'} placeholder="••••••••" style={{ paddingRight: '2.6rem' }} />
            <button data-cursor-hover type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: C.faint, cursor: 'pointer' }}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </Field>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.4rem' }}>
          <Toggle checked={mfa} onChange={setMfa} label="Require MFA code" />
          <a data-cursor-hover onClick={() => go('forgot')} style={{ fontSize: '.82rem', color: C.mute, cursor: 'pointer' }}>Forgot password?</a>
        </div>
        <Btn full size="lg" type="submit">Log in</Btn>
      </form>
      <button data-cursor-hover onClick={() => go('app')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem', width: '100%', marginTop: '1rem', background: 'none', border: 'none', color: C.faint, fontSize: '.8rem', cursor: 'pointer' }}>
        <Fingerprint size={14} /> Use biometric login
      </button>
    </AuthShell>
  );
}

function RegisterView({ go, onBack }) {
  return (
    <AuthShell onBack={onBack} footer={<>Already have an account? <a data-cursor-hover onClick={() => go('login')} style={{ color: C.accent, cursor: 'pointer' }}>Log in</a></>}>
      <h2 style={{ fontFamily: FONT_SERIF, fontSize: '1.6rem', fontWeight: 400, marginBottom: '.3rem' }}>Create your account</h2>
      <p style={{ color: C.mute, fontSize: '.88rem', marginBottom: '1.6rem' }}>Set up your organization on Fleetly.</p>
      <SocialButtons />
      <Divider>OR</Divider>
      <form onSubmit={(e) => { e.preventDefault(); go('verify'); }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Field label="First name"><TextInput required placeholder="Jordan" /></Field>
          <Field label="Last name"><TextInput required placeholder="Lee" /></Field>
        </div>
        <Field label="Work email"><TextInput required type="email" placeholder="you@company.com" /></Field>
        <Field label="Company"><TextInput required placeholder="Company name" /></Field>
        <Field label="Role"><Select>{ROLES.map(r => <option key={r}>{r}</option>)}</Select></Field>
        <Field label="Password"><TextInput required type="password" placeholder="Create a password" /></Field>
        <Btn full size="lg" type="submit">Create account</Btn>
      </form>
    </AuthShell>
  );
}

function ForgotView({ go, onBack }) {
  const [sent, setSent] = useState(false);
  return (
    <AuthShell onBack={onBack} footer={<>Remembered it? <a data-cursor-hover onClick={() => go('login')} style={{ color: C.accent, cursor: 'pointer' }}>Back to log in</a></>}>
      <h2 style={{ fontFamily: FONT_SERIF, fontSize: '1.6rem', fontWeight: 400, marginBottom: '.3rem' }}>Reset your password</h2>
      <p style={{ color: C.mute, fontSize: '.88rem', marginBottom: '1.6rem' }}>We'll email you a link to get back in.</p>
      {sent ? (
        <div className="ls-fadeup" style={{ textAlign: 'center', padding: '1.4rem 0' }}>
          <CheckCircle2 size={30} color={C.accent} style={{ marginBottom: '.8rem' }} />
          <p style={{ fontSize: '.9rem' }}>Check your inbox for a reset link.</p>
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
          <Field label="Email"><TextInput required type="email" placeholder="you@company.com" /></Field>
          <Btn full size="lg" type="submit">Send reset link</Btn>
        </form>
      )}
    </AuthShell>
  );
}

function OtpView({ go, onBack }) {
  const [digits, setDigits] = useState(Array(6).fill(''));
  const refs = useRef([]);
  const setDigit = (i, v) => {
    if (!/^[0-9]?$/.test(v)) return;
    const next = [...digits]; next[i] = v; setDigits(next);
    if (v && i < 5) refs.current[i + 1]?.focus();
  };
  return (
    <AuthShell onBack={onBack} footer={<>Didn't get a code? <a data-cursor-hover style={{ color: C.accent, cursor: 'pointer' }}>Resend</a></>}>
      <div style={{ textAlign: 'center' }}>
        <Shield size={26} color={C.accent} style={{ marginBottom: '1rem' }} />
        <h2 style={{ fontFamily: FONT_SERIF, fontSize: '1.5rem', fontWeight: 400, marginBottom: '.3rem' }}>Verify it's you</h2>
        <p style={{ color: C.mute, fontSize: '.86rem', marginBottom: '1.8rem' }}>Enter the 6-digit code we sent to your device.</p>
      </div>
      <div style={{ display: 'flex', gap: '.5rem', justifyContent: 'center', marginBottom: '1.8rem' }}>
        {digits.map((d, i) => (
          <input key={i} ref={el => refs.current[i] = el} value={d} onChange={e => setDigit(i, e.target.value)} maxLength={1}
            style={{ ...inputStyle, width: 44, height: 52, textAlign: 'center', fontSize: '1.2rem' }} className="ls-input" />
        ))}
      </div>
      <Btn full size="lg" onClick={() => go('app')}>Verify &amp; continue</Btn>
    </AuthShell>
  );
}

function AuthFlow({ view, setView, onDone, onBack }) {
  const go = (v) => v === 'app' ? onDone() : setView(v);
  if (view === 'register') return <RegisterView go={go} onBack={onBack} />;
  if (view === 'forgot') return <ForgotView go={go} onBack={onBack} />;
  if (view === 'otp' || view === 'verify') return <OtpView go={go} onBack={onBack} />;
  return <LoginView go={go} onBack={onBack} />;
}

/* ============================================================ */
/*  APP SHELL — SIDEBAR + TOPBAR                                 */
/* ============================================================ */
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: Gauge },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'tracking', label: 'Tracking', icon: Navigation },
  { id: 'routeopt', label: 'Route Optimization', icon: Route },
  { id: 'fleet', label: 'Fleet', icon: Truck },
  { id: 'dispatch', label: 'Dispatch', icon: Radio },
  { id: 'configuration', label: 'Zones & rates', icon: Settings },
];

function Sidebar({ active, setActive, collapsed, setCollapsed, onLogout }) {
  return (
    <aside style={{ width: collapsed ? 76 : 240, flexShrink: 0, background: C.panel, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', transition: 'width .25s', position: 'sticky', top: 0, height: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', padding: '1.4rem 1.2rem', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ width: 26, height: 26, borderRadius: 7, background: C.accent, flexShrink: 0 }} />
        {!collapsed && <span style={{ fontFamily: FONT_GEN, fontWeight: 600, fontSize: '1.05rem' }}>Fleetly</span>}
      </div>
      <nav style={{ flex: 1, padding: '1rem .7rem', display: 'flex', flexDirection: 'column', gap: '.25rem' }}>
        {NAV_ITEMS.map(item => (
          <button data-cursor-hover key={item.id} onClick={() => setActive(item.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '.8rem', padding: '.7rem .9rem', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: active === item.id ? C.accentSoft : 'transparent', color: active === item.id ? C.accent : C.mute,
              fontFamily: FONT_SANS, fontSize: '.88rem', textAlign: 'left', transition: 'all .2s',
            }}>
            <item.icon size={17} style={{ flexShrink: 0 }} />
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>
      <div style={{ padding: '.8rem', borderTop: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: '.25rem' }}>
        <button data-cursor-hover onClick={() => setCollapsed(!collapsed)} style={{ display: 'flex', alignItems: 'center', gap: '.8rem', padding: '.7rem .9rem', borderRadius: 10, border: 'none', background: 'transparent', color: C.faint, cursor: 'pointer', fontSize: '.85rem' }}>
          <ChevronLeft size={16} style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform .25s' }} /> {!collapsed && 'Collapse'}
        </button>
        <button data-cursor-hover onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: '.8rem', padding: '.7rem .9rem', borderRadius: 10, border: 'none', background: 'transparent', color: C.faint, cursor: 'pointer', fontSize: '.85rem' }}>
          <LogOut size={16} /> {!collapsed && 'Log out'}
        </button>
      </div>
    </aside>
  );
}

function Topbar({ title, subtitle }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.3rem 2rem', borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, background: 'rgba(0,0,0,.85)', backdropFilter: 'blur(8px)', zIndex: 40 }}>
      <div>
        <h1 style={{ fontFamily: FONT_GEN, fontSize: '1.35rem', fontWeight: 500 }}>{title}</h1>
        {subtitle && <p style={{ color: C.faint, fontSize: '.82rem', marginTop: '.15rem' }}>{subtitle}</p>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '.9rem' }}>
        <div style={{ position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.faint }} />
          <input placeholder="Search orders, drivers, vehicles..." className="ls-input" style={{ ...inputStyle, width: 260, paddingLeft: '2.2rem' }} />
        </div>
        <button data-cursor-hover style={{ position: 'relative', background: 'rgba(255,255,255,.06)', border: 'none', width: 38, height: 38, borderRadius: 10, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Bell size={16} />
          <span style={{ position: 'absolute', top: 8, right: 9, width: 6, height: 6, borderRadius: '50%', background: C.accent }} />
        </button>
        <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#39FF14,#0a5c05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_GEN, fontWeight: 600, fontSize: '.85rem', color: '#000' }}>JL</div>
      </div>
    </div>
  );
}

/* ============================================================ */
/*  DASHBOARD MODULE                                             */
/* ============================================================ */
function KpiCard({ label, value, delta, icon: Icon, positive = true }) {
  return (
    <Card style={{ display: 'flex', flexDirection: 'column', gap: '.7rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: C.faint, fontSize: '.8rem' }}>{label}</span>
        <Icon size={16} color={C.faint} />
      </div>
      <div style={{ fontFamily: FONT_GEN, fontSize: '1.7rem', fontWeight: 500 }}>{value}</div>
      {delta && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '.3rem', fontSize: '.78rem', color: positive ? C.accent : C.danger }}>
          {positive ? <TrendingUp size={13} /> : <TrendingDown size={13} />} {delta}
        </div>
      )}
    </Card>
  );
}

function WidgetChrome({ title, onUp, onDown, onHide, children, span = 1 }) {
  return (
    <Card style={{ gridColumn: `span ${span}`, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3 style={{ fontFamily: FONT_GEN, fontSize: '.95rem', fontWeight: 500 }}>{title}</h3>
        <div style={{ display: 'flex', gap: '.2rem' }}>
          <button data-cursor-hover onClick={onUp} style={{ background: 'none', border: 'none', color: C.faint, cursor: 'pointer', padding: 4 }}><ChevronUp size={14} /></button>
          <button data-cursor-hover onClick={onDown} style={{ background: 'none', border: 'none', color: C.faint, cursor: 'pointer', padding: 4 }}><ChevronDown size={14} /></button>
          <button data-cursor-hover onClick={onHide} style={{ background: 'none', border: 'none', color: C.faint, cursor: 'pointer', padding: 4 }}><X size={14} /></button>
        </div>
      </div>
      <div style={{ flex: 1 }}>{children}</div>
    </Card>
  );
}

function DeliveryHeatmap() {
  const rows = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 4 }}>
      {rows.map((r, ri) => Array.from({ length: 12 }).map((_, ci) => {
        const v = rnd();
        return <div key={`${ri}-${ci}`} title={`${r} ${ci}:00`} style={{ aspectRatio: '1', borderRadius: 3, background: `rgba(57,255,20,${0.08 + v * 0.7})` }} />;
      }))}
    </div>
  );
}

function DashboardModule() {
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const defaultWidgets = ['revenue', 'driverStatus', 'fuel', 'heatmap', 'alerts', 'weather', 'carbon', 'sla'];
  const [widgets, setWidgets] = useState(defaultWidgets);
  const move = (id, dir) => setWidgets(w => { const i = w.indexOf(id); const j = i + dir; if (j < 0 || j >= w.length) return w; const c = [...w]; [c[i], c[j]] = [c[j], c[i]]; return c; });
  const hide = (id) => setWidgets(w => w.filter(x => x !== id));

  const registry = {
    revenue: { title: 'Revenue & Deliveries', span: 2, render: () => (
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={REVENUE_DATA}>
          <defs><linearGradient id="rev" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.accent} stopOpacity={0.35} /><stop offset="100%" stopColor={C.accent} stopOpacity={0} /></linearGradient></defs>
          <XAxis dataKey="m" stroke={C.faint} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip contentStyle={{ background: '#111', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12 }} />
          <Area type="monotone" dataKey="revenue" stroke={C.accent} fill="url(#rev)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    ) },
    driverStatus: { title: 'Driver Status', span: 1, render: () => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <ResponsiveContainer width={110} height={110}>
          <PieChart>
            <Pie data={DRIVER_STATUS_DATA} dataKey="value" innerRadius={32} outerRadius={50} paddingAngle={3}>
              {DRIVER_STATUS_DATA.map((d, i) => <Cell key={i} fill={d.color} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
          {DRIVER_STATUS_DATA.map((d, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '.4rem', fontSize: '.78rem', color: C.mute }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: d.color }} /> {d.name} <span style={{ color: '#fff' }}>{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    ) },
    fuel: { title: 'Fuel Usage (gal/day)', span: 1, render: () => (
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={FUEL_DATA}>
          <XAxis dataKey="d" stroke={C.faint} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip contentStyle={{ background: '#111', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12 }} />
          <Bar dataKey="gal" fill={C.accent} radius={[4, 4, 0, 0]} opacity={0.85} />
        </BarChart>
      </ResponsiveContainer>
    ) },
    heatmap: { title: 'Delivery Heatmap (hour × day)', span: 2, render: () => <DeliveryHeatmap /> },
    alerts: { title: 'Live Alerts', span: 1, render: () => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '.7rem', maxHeight: 200, overflowY: 'auto' }} className="ls-scrollbar">
        {ALERTS.map((a, i) => (
          <div key={i} style={{ display: 'flex', gap: '.6rem', alignItems: 'flex-start', fontSize: '.8rem', color: '#e8e8e8', paddingBottom: '.6rem', borderBottom: i < ALERTS.length - 1 ? `1px solid ${C.border}` : 'none' }}>
            <a.icon size={14} color={a.tone === 'good' ? C.accent : a.tone === 'warn' ? C.warn : C.info} style={{ marginTop: 2, flexShrink: 0 }} /> {a.text}
          </div>
        ))}
      </div>
    ) },
    weather: { title: 'Weather Impact', span: 1, render: () => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '.8rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.7rem' }}><Cloud size={22} color={C.info} /><div><div style={{ fontFamily: FONT_GEN }}>Storm system — Denver hub</div><div style={{ fontSize: '.75rem', color: C.faint }}>3 routes may see delays after 4 PM</div></div></div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.3rem', fontSize: '.78rem', color: C.mute }}><Wind size={13} /> 24 mph</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.3rem', fontSize: '.78rem', color: C.mute }}><Thermometer size={13} /> 41°F</div>
        </div>
      </div>
    ) },
    carbon: { title: 'Carbon Footprint', span: 1, render: () => (
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '.4rem' }}><span style={{ fontFamily: FONT_GEN, fontSize: '1.8rem' }}>4.2</span><span style={{ color: C.faint, fontSize: '.8rem' }}>t CO₂ today</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.3rem', color: C.accent, fontSize: '.78rem', marginTop: '.4rem' }}><Leaf size={13} /> 12% below fleet baseline</div>
      </div>
    ) },
    sla: { title: 'SLA Performance', span: 1, render: () => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <ResponsiveContainer width={100} height={100}>
          <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ value: SLA_VALUE, fill: C.accent }]} startAngle={90} endAngle={-270}>
            <RadialBar dataKey="value" cornerRadius={20} background={{ fill: 'rgba(255,255,255,.06)' }} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div>
          <div style={{ fontFamily: FONT_GEN, fontSize: '1.5rem' }}>{SLA_VALUE}%</div>
          <div style={{ color: C.faint, fontSize: '.78rem' }}>On-time SLA, 30-day</div>
        </div>
      </div>
    ) },
  };

  const kpis = [
    { label: "Today's Deliveries", value: '1,284', delta: '+8.2% vs yesterday', icon: Package, positive: true },
    { label: 'Pending', value: '142', delta: '-3.1%', icon: Clock, positive: true },
    { label: 'Completed', value: '1,098', delta: '+11.4%', icon: PackageCheck, positive: true },
    { label: 'Failed', value: '18', delta: '+2 today', icon: PackageX, positive: false },
    { label: 'Revenue (MTD)', value: '$212.4K', delta: '+6.8%', icon: TrendingUp, positive: true },
    { label: 'Active Vehicles', value: '96 / 112', icon: Truck },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.2rem' }}>
        <Btn size="sm" variant="ghost" icon={SlidersHorizontal} onClick={() => setCustomizeOpen(true)}>Customize widgets</Btn>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: '1rem', marginBottom: '1.2rem' }}>
        {kpis.map((k, i) => <KpiCard key={i} {...k} />)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        {widgets.map((id, i) => {
          const w = registry[id]; if (!w) return null;
          return (
            <WidgetChrome key={id} title={w.title} span={w.span} onUp={() => move(id, -1)} onDown={() => move(id, 1)} onHide={() => hide(id)}>
              {w.render()}
            </WidgetChrome>
          );
        })}
      </div>
      <Modal open={customizeOpen} onClose={() => setCustomizeOpen(false)} title="Customize dashboard widgets">
        <p style={{ color: C.mute, fontSize: '.85rem', marginBottom: '1rem' }}>Toggle which widgets appear on your dashboard.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.8rem' }}>
          {Object.keys(registry).map(id => (
            <Toggle key={id} checked={widgets.includes(id)} onChange={(v) => setWidgets(w => v ? [...w, id] : w.filter(x => x !== id))} label={registry[id].title} />
          ))}
        </div>
      </Modal>
    </div>
  );
}

/* ============================================================ */
/*  ORDERS MODULE                                                */
/* ============================================================ */
function CreateOrderForm({ onClose, onCreate, initial, zones = DEFAULT_ZONES, rateCards = DEFAULT_RATE_CARDS }) {
  const [step, setStep] = useState(0);
  const steps = ['Customer', 'Addresses', 'Package', 'Quote'];
  const [form, setForm] = useState(initial || { customer: '', pickup: '', delivery: '', actualWeight: '', length: '', breadth: '', height: '', orderType: 'B2C', paymentType: 'Prepaid', priority: 'Standard', fragile: false, temp: false, insurance: false });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const quote = calculateDeliveryCharge(form, zones, rateCards);
  return (
    <div>
      <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1.6rem' }}>
        {steps.map((s, i) => (
          <div key={s} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ height: 3, borderRadius: 2, background: i <= step ? C.accent : 'rgba(255,255,255,.1)', marginBottom: '.4rem' }} />
            <span style={{ fontSize: '.72rem', color: i === step ? '#fff' : C.faint }}>{s}</span>
          </div>
        ))}
      </div>
      {step === 0 && (
        <div>
          <Field label="Customer name"><TextInput value={form.customer} onChange={e => set('customer', e.target.value)} placeholder="Reyes Manufacturing" /></Field>
          <Field label="Priority">
            <Select value={form.priority} onChange={e => set('priority', e.target.value)}>
              <option>Standard</option><option>Priority</option><option>Express</option>
            </Select>
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Field label="Order type"><Select value={form.orderType} onChange={e => set('orderType', e.target.value)}><option>B2C</option><option>B2B</option></Select></Field>
            <Field label="Payment type"><Select value={form.paymentType} onChange={e => set('paymentType', e.target.value)}><option>Prepaid</option><option>COD</option></Select></Field>
          </div>
        </div>
      )}
      {step === 1 && (
        <div>
          <Field label="Pickup address"><TextInput value={form.pickup} onChange={e => set('pickup', e.target.value)} placeholder="Warehouse A, Austin, TX" /></Field>
          <Field label="Delivery address"><TextInput value={form.delivery} onChange={e => set('delivery', e.target.value)} placeholder="Customer address" /></Field>
        </div>
      )}
      {step === 2 && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Field label="Actual weight (kg)"><TextInput value={form.actualWeight} onChange={e => set('actualWeight', e.target.value)} type="number" placeholder="12" /></Field>
            <Field label="Length (cm)"><TextInput value={form.length} onChange={e => set('length', e.target.value)} type="number" placeholder="40" /></Field>
            <Field label="Breadth (cm)"><TextInput value={form.breadth} onChange={e => set('breadth', e.target.value)} type="number" placeholder="30" /></Field>
            <Field label="Height (cm)"><TextInput value={form.height} onChange={e => set('height', e.target.value)} type="number" placeholder="25" /></Field>
            <Field label="Dimensions (in)"><TextInput value={form.dims} onChange={e => set('dims', e.target.value)} placeholder="24×18×12" /></Field>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.8rem', marginTop: '.6rem', marginBottom: '1.4rem' }}>
            <Toggle checked={form.cod} onChange={v => set('cod', v)} label="Cash on delivery (COD)" />
            <Toggle checked={form.fragile} onChange={v => set('fragile', v)} label="Fragile handling" />
            <Toggle checked={form.temp} onChange={v => set('temp', v)} label="Temperature controlled" />
            <Toggle checked={form.insurance} onChange={v => set('insurance', v)} label="Insured shipment" />
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="ls-fadeup">
          <div style={{ background: C.cardAlt, border: `1px solid ${C.accentBorder}`, borderRadius: 14, padding: '1.1rem' }}>
            <p style={{ color: C.accent, fontSize: '.73rem', fontWeight: 700, letterSpacing: '.08em' }}>CHARGE PREVIEW — CONFIRM BEFORE CREATING</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.8rem', marginTop: '.9rem', fontSize: '.84rem', color: C.mute }}><span>Pickup zone: <strong style={{ color: C.text }}>{quote.pickupZone.name}</strong></span><span>Drop zone: <strong style={{ color: C.text }}>{quote.deliveryZone.name}</strong></span><span>Lane: <strong style={{ color: C.text, textTransform: 'capitalize' }}>{quote.lane}-zone</strong></span><span>Volumetric weight: <strong style={{ color: C.text }}>{quote.volumetricWeight.toFixed(2)} kg</strong></span><span>Billable weight: <strong style={{ color: C.text }}>{quote.billableWeight.toFixed(2)} kg</strong></span><span>COD surcharge: <strong style={{ color: C.text }}>${quote.codSurcharge.toFixed(2)}</strong></span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: `1px solid ${C.border}`, marginTop: '1rem', paddingTop: '.8rem' }}><span style={{ fontWeight: 600 }}>Total delivery charge</span><strong style={{ fontFamily: FONT_GEN, fontSize: '1.55rem', color: C.accent }}>${quote.total.toFixed(2)}</strong></div>
          </div>
          <p style={{ color: C.faint, fontSize: '.76rem', lineHeight: 1.5, marginTop: '.8rem' }}>Higher of actual and volumetric weight is billed. Rates and COD surcharge come from the active rate card.</p>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
        <Btn variant="ghost" onClick={() => step === 0 ? onClose() : setStep(step - 1)}>{step === 0 ? 'Cancel' : 'Back'}</Btn>
        {step < 3 ? <Btn onClick={() => setStep(step + 1)} icon={ArrowRight}>Continue</Btn> : <Btn onClick={() => { onCreate({ ...form, quote }); onClose(); }} icon={CheckCircle2}>Confirm & create</Btn>}
      </div>
    </div>
  );
}

function BulkUploadModal({ open, onClose }) {
  const [dragging, setDragging] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  return (
    <Modal open={open} onClose={onClose} title="Bulk upload orders">
      <p style={{ color: C.mute, fontSize: '.85rem', marginBottom: '1.2rem' }}>Import orders from a CSV or Excel file, or push directly via the Orders API.</p>
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); setUploaded(true); }}
        style={{ border: `2px dashed ${dragging ? C.accent : C.border}`, borderRadius: 14, padding: '2.4rem', textAlign: 'center', transition: 'border-color .2s', background: dragging ? C.accentSoft : 'transparent' }}>
        {uploaded ? (
          <div className="ls-fadeup">
            <CheckCircle2 size={28} color={C.accent} style={{ marginBottom: '.6rem' }} />
            <p style={{ fontSize: '.9rem' }}>orders_batch_042.csv — 214 rows detected</p>
            <p style={{ color: C.faint, fontSize: '.78rem', marginTop: '.3rem' }}>Ready for batch processing</p>
          </div>
        ) : (
          <>
            <Upload size={26} color={C.faint} style={{ marginBottom: '.8rem' }} />
            <p style={{ fontSize: '.9rem' }}>Drag & drop a .csv or .xlsx file here</p>
            <p style={{ color: C.faint, fontSize: '.78rem', marginTop: '.3rem' }}>or click to browse your files</p>
          </>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.4rem' }}>
        <Btn variant="ghost" size="sm" icon={Download}>Download template</Btn>
        <Btn size="sm" disabled={!uploaded} onClick={onClose} icon={RefreshCw}>Process batch</Btn>
      </div>
    </Modal>
  );
}

function OrdersModule() {
  const [orders, setOrders] = useState(ORDERS);
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const filtered = orders.filter(o => (filter === 'All' || o.status === filter) && (o.customer.toLowerCase().includes(query.toLowerCase()) || o.id.toLowerCase().includes(query.toLowerCase())));
  const statuses = ['All', 'Pending', 'In Transit', 'Delivered', 'Failed'];

  const cloneOrder = (o) => setOrders(list => [{ ...o, id: `LS-${10000 + Math.floor(Math.random() * 9000)}`, status: 'Pending' }, ...list]);
  const deleteOrder = (id) => setOrders(list => list.filter(o => o.id !== id));
  const addPricedOrder = (form) => setOrders(list => [{ id: `LS-${10000 + Math.floor(Math.random() * 9000)}`, customer: form.customer || 'New Customer', pickup: form.pickup || 'Unassigned', delivery: form.delivery || 'Unassigned', weight: form.quote?.billableWeight || form.actualWeight || 0, status: 'Pending', priority: form.priority, cod: form.paymentType === 'COD', fragile: form.fragile, tempControlled: form.temp, insured: form.insurance, value: form.quote?.total || 0, eta: 'Auto-assignment queued', orderType: form.orderType, paymentType: form.paymentType, pickupZone: form.quote?.pickupZone.name, deliveryZone: form.quote?.deliveryZone.name, history: [{ status: 'Pending', timestamp: new Date().toISOString(), actor: 'Admin' }] }, ...list]);
  const addOrder = (form) => setOrders(list => [{ id: `LS-${10000 + Math.floor(Math.random() * 9000)}`, customer: form.customer || 'New Customer', pickup: form.pickup || '—', delivery: form.delivery || '—', weight: form.weight || 0, status: 'Pending', priority: form.priority, cod: form.cod, fragile: form.fragile, tempControlled: form.temp, insured: form.insurance, value: 0, eta: '—' }, ...list]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '.8rem', marginBottom: '1.2rem' }}>
        <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
          {statuses.map(s => (
            <button data-cursor-hover key={s} onClick={() => setFilter(s)} style={{ padding: '.5rem 1rem', borderRadius: 999, border: `1px solid ${filter === s ? C.accentBorder : C.border}`, background: filter === s ? C.accentSoft : 'transparent', color: filter === s ? C.accent : C.mute, fontSize: '.82rem', cursor: 'pointer' }}>{s}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '.6rem' }}>
          <TextInput placeholder="Search orders..." value={query} onChange={e => setQuery(e.target.value)} style={{ width: 200 }} />
          <Btn variant="ghost" size="sm" icon={Upload} onClick={() => setBulkOpen(true)}>Bulk upload</Btn>
          <Btn size="sm" icon={Plus} onClick={() => { setEditing(null); setCreateOpen(true); }}>Create order</Btn>
        </div>
      </div>

      <Card padding="0" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.85rem', minWidth: 900 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}`, color: C.faint, textAlign: 'left' }}>
              {['Order ID', 'Customer', 'Route', 'Billable wt.', 'Charge', 'Priority', 'Flags', 'Status', 'ETA', ''].map(h => <th key={h} style={{ padding: '.9rem 1rem', fontWeight: 500 }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 12).map(o => (
              <tr key={o.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: '.85rem 1rem', fontFamily: FONT_GEN }}>{o.id}</td>
                <td style={{ padding: '.85rem 1rem' }}>{o.customer}</td>
                <td style={{ padding: '.85rem 1rem', color: C.mute, fontSize: '.8rem' }}>{o.pickup} <ArrowRight size={11} style={{ display: 'inline', margin: '0 .2rem' }} /> {o.delivery}</td>
                <td style={{ padding: '.85rem 1rem' }}>{o.weight} kg</td>
                <td style={{ padding: '.85rem 1rem', fontWeight: 700, color: o.value ? C.accent : C.faint }}>{o.value ? `$${Number(o.value).toFixed(2)}` : '—'}</td>
                <td style={{ padding: '.85rem 1rem' }}><Badge tone={o.priority === 'Express' ? 'danger' : o.priority === 'Priority' ? 'warn' : 'default'}>{o.priority}</Badge></td>
                <td style={{ padding: '.85rem 1rem' }}>
                  <div style={{ display: 'flex', gap: '.35rem' }}>
                    {o.cod && <span title="COD"><Badge>COD</Badge></span>}
                    {o.fragile && <span title="Fragile" style={{ color: C.warn }}><AlertTriangle size={14} /></span>}
                    {o.tempControlled && <span title="Temp controlled" style={{ color: C.info }}><Thermometer size={14} /></span>}
                    {o.insured && <span title="Insured" style={{ color: C.accent }}><ShieldCheck size={14} /></span>}
                  </div>
                </td>
                <td style={{ padding: '.85rem 1rem' }}><StatusBadge status={o.status} /></td>
                <td style={{ padding: '.85rem 1rem', color: C.mute }}>{o.eta}</td>
                <td style={{ padding: '.85rem 1rem' }}>
                  <div style={{ display: 'flex', gap: '.4rem', justifyContent: 'flex-end' }}>
                    <button data-cursor-hover title="Edit" onClick={() => { setEditing(o); setCreateOpen(true); }} style={{ background: 'none', border: 'none', color: C.faint, cursor: 'pointer' }}><Edit3 size={14} /></button>
                    <button data-cursor-hover title="Clone" onClick={() => cloneOrder(o)} style={{ background: 'none', border: 'none', color: C.faint, cursor: 'pointer' }}><Copy size={14} /></button>
                    <button data-cursor-hover title="Delete" onClick={() => deleteOrder(o.id)} style={{ background: 'none', border: 'none', color: C.danger, cursor: 'pointer' }}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ padding: '3rem', textAlign: 'center', color: C.faint }}>No orders match this filter.</div>}
      </Card>
      <p style={{ color: C.faint, fontSize: '.78rem', marginTop: '.8rem' }}>Showing {Math.min(12, filtered.length)} of {filtered.length} orders</p>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title={editing ? `Edit order ${editing.id}` : 'Create a new order'}>
        <CreateOrderForm onClose={() => setCreateOpen(false)} onCreate={addPricedOrder} initial={editing} />
      </Modal>
      <BulkUploadModal open={bulkOpen} onClose={() => setBulkOpen(false)} />
    </div>
  );
}

/* ============================================================ */
/*  TRACKING MODULE                                              */
/* ============================================================ */
const SHIPMENTS = ORDERS.filter(o => o.status !== 'Pending').slice(0, 9).map((o, i) => ({
  ...o, driver: DRIVER_NAMES[i % DRIVER_NAMES.length],
  timeline: [
    { label: 'Order confirmed', done: true, t: '8:02 AM' },
    { label: 'Picked up', done: true, t: '9:14 AM' },
    { label: 'In transit', done: o.status !== 'Pending', t: '10:40 AM' },
    { label: 'Out for delivery', done: o.status === 'Delivered', t: '1:05 PM' },
    { label: 'Delivered', done: o.status === 'Delivered', t: o.status === 'Delivered' ? '1:52 PM' : '—' },
  ],
}));

function MiniMap({ seed = 1 }) {
  const pathId = `route-${seed}`;
  const offset = (seed % 6) * 5;
  const d = `M62,202 C116,196 128,105 205,124 S304,198 420,78`;
  return (
    <svg viewBox="0 0 480 280" style={{ width: '100%', height: 280, background: '#eef8f1', borderRadius: 16, border: `1px solid ${C.border}` }} aria-label="Live delivery route map">
      <defs>
        <pattern id={`grid${seed}`} width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M28 0H0V28" fill="none" stroke="rgba(23,52,38,.06)" strokeWidth="1" />
        </pattern>
        <filter id={`shadow-${seed}`} x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#0a6336" floodOpacity=".24" /></filter>
        <linearGradient id={`route-gradient-${seed}`} x1="0" y1="0" x2="1" y2="0"><stop stopColor="#15a15a"/><stop offset="1" stopColor="#72cb8e"/></linearGradient>
      </defs>
      <rect width="480" height="280" rx="16" fill={`url(#grid${seed})`} />
      <path d="M-30 60C80 95 128 15 225 56S355 118 520 38M-26 245C92 215 133 252 228 208S370 173 520 225M100-20C142 64 82 113 116 185S204 265 190 306M340-15C292 58 350 102 327 178S270 242 306 305" fill="none" stroke="rgba(88,138,103,.22)" strokeWidth="18" strokeLinecap="round" />
      <path d="M-30 60C80 95 128 15 225 56S355 118 520 38M-26 245C92 215 133 252 228 208S370 173 520 225M100-20C142 64 82 113 116 185S204 265 190 306M340-15C292 58 350 102 327 178S270 242 306 305" fill="none" stroke="rgba(255,255,255,.75)" strokeWidth="10" strokeLinecap="round" />
      <path d={d} fill="none" stroke="rgba(21,155,88,.18)" strokeWidth="12" strokeLinecap="round" />
      <path d={d} fill="none" stroke={`url(#route-gradient-${seed})`} strokeWidth="4" strokeLinecap="round" strokeDasharray="9 7">
        <animate attributeName="stroke-dashoffset" from="160" to="0" dur="5s" repeatCount="indefinite" />
      </path>
      <g filter={`url(#shadow-${seed})`}><circle cx="62" cy="202" r="14" fill="#ffffff"/><circle cx="62" cy="202" r="7" fill="#173426"/><text x="62" y="176" textAnchor="middle" fill="#486554" fontSize="11" fontFamily="Arial" fontWeight="700">PICKUP</text></g>
      <g filter={`url(#shadow-${seed})`}><circle cx="420" cy="78" r="15" fill="#15a15a"/><path d="M414 78l4 4 8-9" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><text x="420" y="48" textAnchor="middle" fill="#486554" fontSize="11" fontFamily="Arial" fontWeight="700">DESTINATION</text></g>
      <g filter={`url(#shadow-${seed})`}>
        <circle cx={250 + offset} cy={147 - offset} r="18" fill="#173426"/>
        <path d={`M${243 + offset} ${148 - offset}h14l-3-7h-8l-3 7Z`} fill="#ffffff"/><circle cx={247 + offset} cy={151 - offset} r="2" fill="#15a15a"/><circle cx={254 + offset} cy={151 - offset} r="2" fill="#15a15a"/>
      </g>
      <g transform="translate(24 22)"><rect width="118" height="29" rx="14.5" fill="rgba(255,255,255,.92)" stroke="rgba(21,155,88,.20)"/><circle cx="17" cy="14.5" r="4" fill="#15a15a"><animate attributeName="opacity" values=".4;1;.4" dur="1.8s" repeatCount="indefinite"/></circle><text x="29" y="18.5" fill="#28513a" fontFamily="Arial" fontSize="11" fontWeight="700">DRIVER EN ROUTE</text></g>
    </svg>
  );
}

function TrackingModule() {
  const [selected, setSelected] = useState(SHIPMENTS[0]);
  const [geofence, setGeofence] = useState(true);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.2rem', alignItems: 'start' }}>
      <Card padding="0" style={{ maxHeight: 720, overflowY: 'auto' }} className="ls-scrollbar">
        {SHIPMENTS.map(s => (
          <button data-cursor-hover key={s.id} onClick={() => setSelected(s)} style={{ width: '100%', textAlign: 'left', background: selected.id === s.id ? C.accentSoft : 'transparent', border: 'none', borderBottom: `1px solid ${C.border}`, padding: '1rem', cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: FONT_GEN, fontSize: '.88rem', color: '#fff' }}>{s.id}</span>
              <StatusBadge status={s.status} />
            </div>
            <p style={{ fontSize: '.78rem', color: C.mute, marginTop: '.3rem' }}>{s.pickup} → {s.delivery}</p>
            <p style={{ fontSize: '.75rem', color: C.faint, marginTop: '.2rem' }}>Driver: {s.driver} · ETA {s.eta}</p>
          </button>
        ))}
      </Card>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '.6rem' }}>
            <div>
              <h3 style={{ fontFamily: FONT_GEN, fontSize: '1.05rem' }}>{selected.id} — live location</h3>
              <p style={{ color: C.faint, fontSize: '.8rem' }}>Driver {selected.driver} · Geofence {geofence ? 'active' : 'off'}</p>
            </div>
            <div style={{ display: 'flex', gap: '.8rem', alignItems: 'center' }}>
              <Toggle checked={geofence} onChange={setGeofence} label="Geofencing" />
              <Badge tone="info">ETA {selected.eta}</Badge>
            </div>
          </div>
          <MiniMap seed={selected.id.length + selected.id.charCodeAt(3)} />
        </Card>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
          <Card>
            <h3 style={{ fontFamily: FONT_GEN, fontSize: '.95rem', marginBottom: '1rem' }}>Delivery timeline</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {selected.timeline.map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: '.8rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: t.done ? C.accent : 'rgba(255,255,255,.15)', flexShrink: 0 }} />
                    {i < selected.timeline.length - 1 && <span style={{ width: 1, flex: 1, background: t.done ? C.accent : 'rgba(255,255,255,.12)', minHeight: 26 }} />}
                  </div>
                  <div style={{ paddingBottom: '1rem' }}>
                    <p style={{ fontSize: '.85rem', color: t.done ? '#fff' : C.faint }}>{t.label}</p>
                    <p style={{ fontSize: '.72rem', color: C.faint }}>{t.t}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <h3 style={{ fontFamily: FONT_GEN, fontSize: '.95rem', marginBottom: '1rem' }}>Delay prediction & POD</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.7rem', padding: '.8rem', background: 'rgba(255,194,75,.08)', border: `1px solid rgba(255,194,75,.25)`, borderRadius: 10, marginBottom: '1rem' }}>
              <AlertTriangle size={16} color={C.warn} />
              <span style={{ fontSize: '.82rem' }}>12% risk of delay — moderate traffic ahead on route.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '.85rem', color: C.mute }}>Proof of delivery</span>
              {selected.status === 'Delivered'
                ? <Badge tone="good">Signature + photo captured</Badge>
                : <Badge tone="default">Pending</Badge>}
            </div>
            <div style={{ display: 'flex', gap: '.6rem', marginTop: '1rem' }}>
              <div style={{ flex: 1, aspectRatio: '4/3', background: '#0a0a0a', borderRadius: 8, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileText size={18} color={C.faint} /></div>
              <div style={{ flex: 1, aspectRatio: '4/3', background: '#0a0a0a', borderRadius: 8, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Edit3 size={18} color={C.faint} /></div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ============================================================ */
/*  ROUTE OPTIMIZATION MODULE                                    */
/* ============================================================ */
function RouteOptimizationModule() {
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [constraints, setConstraints] = useState({ ev: true, tolls: false, priority: true, carbon: true, weather: true, traffic: true });
  const setC = (k, v) => setConstraints(c => ({ ...c, [k]: v }));

  const run = () => {
    setDone(false); setRunning(true);
    setTimeout(() => { setRunning(false); setDone(true); }, 1800);
  };

  const results = [
    { vehicle: 'VH-341 (EV Van)', driver: 'J. Alvarez', stops: 14, distance: '62 mi', time: '5h 20m', savings: '18% fuel' },
    { vehicle: 'VH-344 (Box Truck)', driver: 'S. Okafor', stops: 9, distance: '48 mi', time: '4h 05m', savings: '11% time' },
    { vehicle: 'VH-347 (Cargo Van)', driver: 'M. Chen', stops: 17, distance: '71 mi', time: '6h 10m', savings: '22% distance' },
    { vehicle: 'VH-349 (EV Van)', driver: 'R. Patel', stops: 11, distance: '39 mi', time: '3h 40m', savings: '26% emissions' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '1.2rem', alignItems: 'start' }}>
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', marginBottom: '1.2rem' }}>
          <Sparkles size={17} color={C.accent} />
          <h3 style={{ fontFamily: FONT_GEN, fontSize: '1rem' }}>Optimization constraints</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.2rem' }}>
          <Toggle checked={constraints.traffic} onChange={v => setC('traffic', v)} label="Live traffic prediction" />
          <Toggle checked={constraints.weather} onChange={v => setC('weather', v)} label="Weather prediction" />
          <Toggle checked={constraints.priority} onChange={v => setC('priority', v)} label="Prioritize express deliveries" />
          <Toggle checked={constraints.ev} onChange={v => setC('ev', v)} label="EV range optimization" />
          <Toggle checked={constraints.tolls} onChange={v => setC('tolls', v)} label="Avoid tolls" />
          <Toggle checked={constraints.carbon} onChange={v => setC('carbon', v)} label="Minimize carbon emissions" />
        </div>
        <Field label="Vehicle capacity buffer"><Select><option>5% buffer</option><option>10% buffer</option><option>15% buffer</option></Select></Field>
        <Field label="Time window strictness"><Select><option>Flexible (±30 min)</option><option>Standard (±15 min)</option><option>Strict (±5 min)</option></Select></Field>
        <Btn full size="lg" icon={running ? RefreshCw : Zap} onClick={run} style={running ? { opacity: 0.7 } : {}}>{running ? 'Optimizing routes...' : 'Run AI optimization'}</Btn>
      </Card>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <Card>
          <h3 style={{ fontFamily: FONT_GEN, fontSize: '.95rem', marginBottom: '1rem' }}>Optimized network preview</h3>
          <svg viewBox="0 0 700 260" style={{ width: '100%', height: 260, background: '#0a0a0a', borderRadius: 12 }}>
            <defs><pattern id="gridR" width="26" height="26" patternUnits="userSpaceOnUse"><path d="M26 0 L0 0 0 26" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" /></pattern></defs>
            <rect width="700" height="260" fill="url(#gridR)" />
            <circle cx="350" cy="130" r="7" fill="#fff" />
            {Array.from({ length: 4 }).map((_, i) => {
              const r = seedRand(i * 71 + 3);
              const pts = Array.from({ length: 4 }).map(() => [40 + r() * 620, 30 + r() * 200]);
              const d = `M350,130 Q${pts[0][0]},${pts[0][1]} ${pts[1][0]},${pts[1][1]} T${pts[3][0]},${pts[3][1]}`;
              const colors = [C.accent, C.info, '#B78CFF', C.warn];
              return (
                <g key={i}>
                  <path d={d} fill="none" stroke={colors[i]} strokeWidth="1.6" opacity={done ? 0.75 : 0.15} style={{ transition: 'opacity .8s' }} strokeDasharray="5 4" />
                  {done && <circle cx={pts[3][0]} cy={pts[3][1]} r="4" fill={colors[i]} />}
                </g>
              );
            })}
          </svg>
          {!done && !running && <p style={{ color: C.faint, fontSize: '.82rem', marginTop: '.8rem' }}>Run the optimizer to generate route paths for today's fleet.</p>}
        </Card>

        {done && (
          <div className="ls-fadeup" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: '1rem' }}>
              <KpiCard label="Distance saved" value="19.4%" icon={Route} />
              <KpiCard label="Fuel saved" value="126 gal" icon={Fuel} />
              <KpiCard label="Time saved" value="3h 40m" icon={Clock} />
              <KpiCard label="CO₂ reduced" value="0.8 t" icon={Leaf} />
            </div>
            <Card padding="0">
              <div style={{ padding: '1rem 1.2rem', borderBottom: `1px solid ${C.border}` }}><h3 style={{ fontFamily: FONT_GEN, fontSize: '.95rem' }}>Assigned routes — driver skill matched</h3></div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.85rem' }}>
                <thead><tr style={{ color: C.faint, textAlign: 'left' }}>{['Vehicle', 'Driver', 'Stops', 'Distance', 'Est. time', 'Savings'].map(h => <th key={h} style={{ padding: '.7rem 1.1rem', fontWeight: 500 }}>{h}</th>)}</tr></thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={i} style={{ borderTop: `1px solid ${C.border}` }}>
                      <td style={{ padding: '.7rem 1.1rem' }}>{r.vehicle}</td>
                      <td style={{ padding: '.7rem 1.1rem' }}>{r.driver}</td>
                      <td style={{ padding: '.7rem 1.1rem' }}>{r.stops}</td>
                      <td style={{ padding: '.7rem 1.1rem' }}>{r.distance}</td>
                      <td style={{ padding: '.7rem 1.1rem' }}>{r.time}</td>
                      <td style={{ padding: '.7rem 1.1rem' }}><Badge tone="good">{r.savings}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================ */
/*  FLEET MODULE                                                 */
/* ============================================================ */
function GaugeBar({ value, tone = C.accent }) {
  return (
    <div style={{ width: '100%', height: 6, borderRadius: 4, background: 'rgba(255,255,255,.08)' }}>
      <div style={{ width: `${value}%`, height: '100%', borderRadius: 4, background: value < 25 ? C.danger : tone }} />
    </div>
  );
}

function FleetModule() {
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState('vehicles');
  const active = VEHICLES.filter(v => v.status === 'Active').length;

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '1rem', marginBottom: '1.2rem' }}>
        <KpiCard label="Active vehicles" value={`${active} / ${VEHICLES.length}`} icon={Truck} />
        <KpiCard label="Avg. fuel level" value={`${Math.round(VEHICLES.reduce((a, v) => a + v.fuel, 0) / VEHICLES.length)}%`} icon={Fuel} />
        <KpiCard label="Avg. vehicle health" value={`${Math.round(VEHICLES.reduce((a, v) => a + v.health, 0) / VEHICLES.length)}%`} icon={Gauge} />
        <KpiCard label="Due for service" value={VEHICLES.filter(v => parseInt(v.serviceDue) < 14).length} icon={Wrench} />
      </div>

      <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1rem' }}>
        {['vehicles', 'drivers'].map(t => (
          <button data-cursor-hover key={t} onClick={() => setTab(t)} style={{ padding: '.5rem 1rem', borderRadius: 999, border: `1px solid ${tab === t ? C.accentBorder : C.border}`, background: tab === t ? C.accentSoft : 'transparent', color: tab === t ? C.accent : C.mute, fontSize: '.82rem', cursor: 'pointer', textTransform: 'capitalize' }}>{t}</button>
        ))}
      </div>

      {tab === 'vehicles' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '1rem' }}>
          {VEHICLES.map(v => (
            <Card key={v.id} data-cursor-hover onClick={() => setSelected(v)} style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '.8rem' }}>
                <div>
                  <p style={{ fontFamily: FONT_GEN, fontSize: '1rem' }}>{v.id}</p>
                  <p style={{ color: C.faint, fontSize: '.78rem' }}>{v.type}</p>
                </div>
                <Badge tone={v.status === 'Active' ? 'good' : v.status === 'Maintenance' ? 'danger' : 'default'}>{v.status}</Badge>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.72rem', color: C.faint, marginBottom: '.25rem' }}><span>Fuel / battery</span><span>{v.fuel}%</span></div>
                  <GaugeBar value={v.fuel} />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.72rem', color: C.faint, marginBottom: '.25rem' }}><span>Health</span><span>{v.health}%</span></div>
                  <GaugeBar value={v.health} tone={C.info} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '.9rem', fontSize: '.78rem', color: C.mute }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '.3rem' }}><MapPin size={12} /> {v.gps}</span>
                <span>{v.driver}</span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card padding="0" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.85rem', minWidth: 700 }}>
            <thead><tr style={{ color: C.faint, textAlign: 'left', borderBottom: `1px solid ${C.border}` }}>{['Driver', 'Rating', 'Status', 'Deliveries today', 'Vehicle'].map(h => <th key={h} style={{ padding: '.85rem 1.1rem', fontWeight: 500 }}>{h}</th>)}</tr></thead>
            <tbody>
              {DRIVERS.map((d, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: '.85rem 1.1rem' }}>{d.name}</td>
                  <td style={{ padding: '.85rem 1.1rem', display: 'flex', alignItems: 'center', gap: '.3rem' }}><Star size={12} fill={C.accent} color={C.accent} /> {d.rating}</td>
                  <td style={{ padding: '.85rem 1.1rem' }}><Badge tone={d.status === 'On Route' ? 'info' : d.status === 'Available' ? 'good' : 'default'}>{d.status}</Badge></td>
                  <td style={{ padding: '.85rem 1.1rem' }}>{d.deliveries}</td>
                  <td style={{ padding: '.85rem 1.1rem', color: C.mute }}>{d.vehicle}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected ? `${selected.id} — ${selected.type}` : ''}>
        {selected && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.4rem' }}>
              <div><p style={{ color: C.faint, fontSize: '.78rem' }}>Driver</p><p>{selected.driver}</p></div>
              <div><p style={{ color: C.faint, fontSize: '.78rem' }}>Current location</p><p>{selected.gps}</p></div>
              <div><p style={{ color: C.faint, fontSize: '.78rem' }}>Mileage</p><p>{selected.mileage.toLocaleString()} mi</p></div>
              <div><p style={{ color: C.faint, fontSize: '.78rem' }}>Service due</p><p>{selected.serviceDue}</p></div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.9rem', marginBottom: '1.4rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.8rem', marginBottom: '.3rem' }}><span>{selected.type.includes('EV') ? 'Battery health' : 'Fuel level'}</span><span>{selected.fuel}%</span></div>
                <GaugeBar value={selected.fuel} />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.8rem', marginBottom: '.3rem' }}><span>Vehicle health</span><span>{selected.health}%</span></div>
                <GaugeBar value={selected.health} tone={C.info} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '.6rem', flexWrap: 'wrap' }}>
              <Badge tone="good">Insurance current</Badge>
              <Badge tone="default">Documents on file</Badge>
              <Badge tone="info">GPS connected</Badge>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

/* ============================================================ */
/*  DISPATCH MODULE — native drag & drop kanban                  */
/* ============================================================ */
const DISPATCH_COLUMNS = ['Unassigned', 'Assigned', 'In Transit', 'Delivered'];

function DispatchModule() {
  const [cards, setCards] = useState(() => ORDERS.slice(0, 16).map((o, i) => ({ ...o, col: DISPATCH_COLUMNS[i % 4], driver: i % 3 === 0 ? null : DRIVER_NAMES[i % DRIVER_NAMES.length] })));
  const [dragId, setDragId] = useState(null);
  const [autoOn, setAutoOn] = useState(false);

  const onDrop = (col) => {
    if (!dragId) return;
    setCards(cs => cs.map(c => c.id === dragId ? { ...c, col, driver: c.driver || (col !== 'Unassigned' ? pick(DRIVER_NAMES) : null) } : c));
    setDragId(null);
  };

  const autoAssign = () => {
    setCards(cs => cs.map(c => c.col === 'Unassigned' ? { ...c, col: 'Assigned', driver: pick(DRIVER_NAMES) } : c));
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.2rem', alignItems: 'start' }}>
      <Card>
        <h3 style={{ fontFamily: FONT_GEN, fontSize: '.95rem', marginBottom: '1rem' }}>Live drivers</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.8rem', maxHeight: 560, overflowY: 'auto' }} className="ls-scrollbar">
          {DRIVERS.map((d, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '.6rem', fontSize: '.82rem' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: d.status === 'Available' ? C.accent : d.status === 'On Route' ? C.info : C.faint, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p>{d.name}</p>
                <p style={{ color: C.faint, fontSize: '.72rem' }}>{d.status} · {d.vehicle}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '.6rem' }}>
          <p style={{ color: C.mute, fontSize: '.85rem' }}>Drag orders between columns to (re)assign drivers.</p>
          <div style={{ display: 'flex', gap: '.6rem' }}>
            <Toggle checked={autoOn} onChange={setAutoOn} label="Automatic nearest-driver mode" />
            <Btn size="sm" variant="ghost" icon={Zap} onClick={autoAssign}>Auto-assign unassigned</Btn>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          {DISPATCH_COLUMNS.map(col => (
            <div key={col}
              onDragOver={e => e.preventDefault()}
              onDrop={() => onDrop(col)}
              style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: '.8rem', minHeight: 500 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.8rem', padding: '0 .3rem' }}>
                <span style={{ fontSize: '.82rem', fontFamily: FONT_GEN, color: STATUS_COLORS[col] || '#fff' }}>{col}</span>
                <Badge>{cards.filter(c => c.col === col).length}</Badge>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
                {cards.filter(c => c.col === col).map(c => (
                  <div key={c.id} draggable onDragStart={() => setDragId(c.id)}
                    style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '.7rem .8rem', cursor: 'grab' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontFamily: FONT_GEN, fontSize: '.8rem' }}>{c.id}</span>
                      <GripVertical size={13} color={C.faint} />
                    </div>
                    <p style={{ fontSize: '.75rem', color: C.mute, marginTop: '.3rem' }}>{c.customer}</p>
                    <p style={{ fontSize: '.72rem', color: C.faint, marginTop: '.2rem' }}>{c.driver ? `Driver: ${c.driver}` : 'No driver assigned'}</p>
                  </div>
                ))}
                {cards.filter(c => c.col === col).length === 0 && <p style={{ color: C.faint, fontSize: '.75rem', textAlign: 'center', padding: '1rem 0' }}>Drop here</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================ */
/*  ZONE AND RATE ADMINISTRATION                                 */
/* ============================================================ */
function ZonesAndRatesModule() {
  const [zones, setZones] = useState(DEFAULT_ZONES);
  const [cards, setCards] = useState(DEFAULT_RATE_CARDS);
  const [saved, setSaved] = useState(false);
  const updateRate = (type, lane, key, value) => setCards(current => ({ ...current, [type]: { ...current[type], [lane]: { ...current[type][lane], [key]: Number(value) } } }));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
      <Card><div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}><div><h3 style={{ fontFamily: FONT_GEN, fontSize: '1.05rem' }}>Pricing configuration</h3><p style={{ color: C.mute, fontSize: '.83rem', marginTop: '.35rem' }}>Rates are evaluated by detected pickup/drop zones, order type and billable weight. Volumetric weight uses L × B × H ÷ 5000.</p></div><Btn size="sm" icon={CheckCircle2} onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}>{saved ? 'Saved' : 'Save rate cards'}</Btn></div></Card>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(330px,1fr))', gap: '1.2rem' }}>
        {['B2C', 'B2B'].map(type => <Card key={type}><h3 style={{ fontFamily: FONT_GEN, fontSize: '1rem', marginBottom: '1rem' }}>{type} rate card</h3>{['intra', 'inter'].map(lane => <div key={lane} style={{ padding: '.8rem 0', borderTop: `1px solid ${C.border}` }}><p style={{ fontWeight: 700, fontSize: '.82rem', textTransform: 'capitalize', marginBottom: '.6rem' }}>{lane}-zone rates</p><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.6rem' }}><Field label="Base charge ($)"><TextInput type="number" value={cards[type][lane].base} onChange={e => updateRate(type, lane, 'base', e.target.value)} /></Field><Field label="Per kg ($)"><TextInput type="number" value={cards[type][lane].perKg} onChange={e => updateRate(type, lane, 'perKg', e.target.value)} /></Field></div></div>)}<Field label="COD surcharge per order ($)"><TextInput type="number" value={cards[type].cod} onChange={e => setCards(current => ({ ...current, [type]: { ...current[type], cod: Number(e.target.value) } }))} /></Field></Card>)}
      </div>
      <Card><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}><div><h3 style={{ fontFamily: FONT_GEN, fontSize: '1rem' }}>Zones and service areas</h3><p style={{ color: C.mute, fontSize: '.82rem', marginTop: '.3rem' }}>Address keywords are matched to the zone to choose intra- or inter-zone pricing.</p></div><Btn size="sm" variant="ghost" icon={Plus} onClick={() => setZones(items => [...items, { id: `Z-${items.length + 1}`, name: 'New zone', areas: [] }])}>Add zone</Btn></div><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '.8rem' }}>{zones.map((zone, index) => <div key={zone.id} style={{ padding: '.9rem', border: `1px solid ${C.border}`, borderRadius: 12, background: C.cardAlt }}><TextInput value={zone.name} onChange={e => setZones(items => items.map((item, i) => i === index ? { ...item, name: e.target.value } : item))} /><p style={{ color: C.faint, fontSize: '.72rem', marginTop: '.6rem' }}>{zone.areas.length ? zone.areas.join(', ') : 'No area keywords yet'}</p><Badge tone="info">{zone.id}</Badge></div>)}</div></Card>
    </div>
  );
}

/* ============================================================ */
/*  AUTHENTICATED APP SHELL                                      */
/* ============================================================ */
const MODULE_META = {
  dashboard: { title: 'Dashboard', subtitle: "Here's how your network is performing today." },
  orders: { title: 'Orders', subtitle: 'Create, track and manage every shipment.' },
  tracking: { title: 'Shipment Tracking', subtitle: 'Live location, ETA and delivery proof.' },
  routeopt: { title: 'Route Optimization', subtitle: 'AI-generated routes across your active fleet.' },
  fleet: { title: 'Fleet Management', subtitle: 'Vehicles, drivers, health and maintenance.' },
  dispatch: { title: 'Live Dispatch Center', subtitle: 'Assign orders to drivers in real time.' },
  configuration: { title: 'Zones & Rate Cards', subtitle: 'Configure service areas, B2B/B2C pricing and COD surcharge rules.' },
};

function AppShell({ onLogout }) {
  const [active, setActive] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const meta = MODULE_META[active];
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar active={active} setActive={setActive} collapsed={collapsed} setCollapsed={setCollapsed} onLogout={onLogout} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <Topbar title={meta.title} subtitle={meta.subtitle} />
        <main style={{ padding: '1.6rem 2rem 3rem' }}>
          {active === 'dashboard' && <DashboardModule />}
          {active === 'orders' && <OrdersModule />}
          {active === 'tracking' && <TrackingModule />}
          {active === 'routeopt' && <RouteOptimizationModule />}
          {active === 'fleet' && <FleetModule />}
          {active === 'dispatch' && <DispatchModule />}
          {active === 'configuration' && <ZonesAndRatesModule />}
        </main>
      </div>
    </div>
  );
}

/* ============================================================ */
/*  ROOT APP                                                     */
/* ============================================================ */
export default function App() {
  const [screen, setScreen] = useState('landing'); // landing | auth | app
  const [authView, setAuthView] = useState('login');

  return (
    <div className="ls-root ls-scrollbar" style={{ minHeight: '100vh', position: 'relative' }}>
      <GlobalStyle />
      {screen === 'landing' && (
        <LandingPage
          onLogin={() => { setAuthView('login'); setScreen('auth'); }}
          onSignup={() => { setAuthView('register'); setScreen('auth'); }}
          onExplore={() => setScreen('app')}
        />
      )}
      {screen === 'auth' && (
        <AuthFlow view={authView} setView={setAuthView} onDone={() => setScreen('app')} onBack={() => setScreen('landing')} />
      )}
      {screen === 'app' && (
        <AppShell onLogout={() => setScreen('landing')} />
      )}
    </div>
  );
}
