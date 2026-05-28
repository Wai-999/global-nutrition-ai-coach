import { useState, useRef, type CSSProperties, type ReactNode } from "react";
import { requestCoachReport } from "./api/coachClient";

const sage = "#4a7c59";
const sageLight = "#d4e8db";
const cream = "#faf7f2";
const warm = "#f0ebe0";
const bark = "#3d2c1e";
const gold = "#c9a84c";
const goldLight = "#f5e9c8";
const errorC = "#c0392b";
const subC = "#7a6a58";
const borderC = "#d8cfc4";
const blue = "#2c6fa6";
const blueLight = "#dceefb";
const red = "#a63c2c";
const redLight = "#fbe8e4";
const purple = "#6b4fa6";
const purpleLight = "#ede8fb";

// ─── Country data ──────────────────────────────────────────────────────────────
const COUNTRIES: { code: string; name: string; flag: string }[] = [
  { code: "AF", name: "Afghanistan", flag: "🇦🇫" },
  { code: "AL", name: "Albania", flag: "🇦🇱" },
  { code: "DZ", name: "Algeria", flag: "🇩🇿" },
  { code: "AR", name: "Argentina", flag: "🇦🇷" },
  { code: "AM", name: "Armenia", flag: "🇦🇲" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "AT", name: "Austria", flag: "🇦🇹" },
  { code: "AZ", name: "Azerbaijan", flag: "🇦🇿" },
  { code: "BD", name: "Bangladesh", flag: "🇧🇩" },
  { code: "BY", name: "Belarus", flag: "🇧🇾" },
  { code: "BE", name: "Belgium", flag: "🇧🇪" },
  { code: "BT", name: "Bhutan", flag: "🇧🇹" },
  { code: "BO", name: "Bolivia", flag: "🇧🇴" },
  { code: "BA", name: "Bosnia & Herzegovina", flag: "🇧🇦" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "BN", name: "Brunei", flag: "🇧🇳" },
  { code: "BG", name: "Bulgaria", flag: "🇧🇬" },
  { code: "KH", name: "Cambodia", flag: "🇰🇭" },
  { code: "CM", name: "Cameroon", flag: "🇨🇲" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "CL", name: "Chile", flag: "🇨🇱" },
  { code: "CN", name: "China", flag: "🇨🇳" },
  { code: "CO", name: "Colombia", flag: "🇨🇴" },
  { code: "CD", name: "Congo (DRC)", flag: "🇨🇩" },
  { code: "CR", name: "Costa Rica", flag: "🇨🇷" },
  { code: "HR", name: "Croatia", flag: "🇭🇷" },
  { code: "CU", name: "Cuba", flag: "🇨🇺" },
  { code: "CY", name: "Cyprus", flag: "🇨🇾" },
  { code: "CZ", name: "Czech Republic", flag: "🇨🇿" },
  { code: "DK", name: "Denmark", flag: "🇩🇰" },
  { code: "DO", name: "Dominican Republic", flag: "🇩🇴" },
  { code: "EC", name: "Ecuador", flag: "🇪🇨" },
  { code: "EG", name: "Egypt", flag: "🇪🇬" },
  { code: "SV", name: "El Salvador", flag: "🇸🇻" },
  { code: "ET", name: "Ethiopia", flag: "🇪🇹" },
  { code: "FI", name: "Finland", flag: "🇫🇮" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "GE", name: "Georgia", flag: "🇬🇪" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "GH", name: "Ghana", flag: "🇬🇭" },
  { code: "GR", name: "Greece", flag: "🇬🇷" },
  { code: "GT", name: "Guatemala", flag: "🇬🇹" },
  { code: "HT", name: "Haiti", flag: "🇭🇹" },
  { code: "HN", name: "Honduras", flag: "🇭🇳" },
  { code: "HK", name: "Hong Kong", flag: "🇭🇰" },
  { code: "HU", name: "Hungary", flag: "🇭🇺" },
  { code: "IS", name: "Iceland", flag: "🇮🇸" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "ID", name: "Indonesia", flag: "🇮🇩" },
  { code: "IR", name: "Iran", flag: "🇮🇷" },
  { code: "IQ", name: "Iraq", flag: "🇮🇶" },
  { code: "IE", name: "Ireland", flag: "🇮🇪" },
  { code: "IL", name: "Israel", flag: "🇮🇱" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "CI", name: "Ivory Coast", flag: "🇨🇮" },
  { code: "JM", name: "Jamaica", flag: "🇯🇲" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "JO", name: "Jordan", flag: "🇯🇴" },
  { code: "KZ", name: "Kazakhstan", flag: "🇰🇿" },
  { code: "KE", name: "Kenya", flag: "🇰🇪" },
  { code: "KR", name: "South Korea", flag: "🇰🇷" },
  { code: "KW", name: "Kuwait", flag: "🇰🇼" },
  { code: "KG", name: "Kyrgyzstan", flag: "🇰🇬" },
  { code: "LA", name: "Laos", flag: "🇱🇦" },
  { code: "LB", name: "Lebanon", flag: "🇱🇧" },
  { code: "LY", name: "Libya", flag: "🇱🇾" },
  { code: "LT", name: "Lithuania", flag: "🇱🇹" },
  { code: "MG", name: "Madagascar", flag: "🇲🇬" },
  { code: "MY", name: "Malaysia", flag: "🇲🇾" },
  { code: "MV", name: "Maldives", flag: "🇲🇻" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "MN", name: "Mongolia", flag: "🇲🇳" },
  { code: "MA", name: "Morocco", flag: "🇲🇦" },
  { code: "MZ", name: "Mozambique", flag: "🇲🇿" },
  { code: "MM", name: "Myanmar", flag: "🇲🇲" },
  { code: "NP", name: "Nepal", flag: "🇳🇵" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬" },
  { code: "NO", name: "Norway", flag: "🇳🇴" },
  { code: "OM", name: "Oman", flag: "🇴🇲" },
  { code: "PK", name: "Pakistan", flag: "🇵🇰" },
  { code: "PA", name: "Panama", flag: "🇵🇦" },
  { code: "PY", name: "Paraguay", flag: "🇵🇾" },
  { code: "PE", name: "Peru", flag: "🇵🇪" },
  { code: "PH", name: "Philippines", flag: "🇵🇭" },
  { code: "PL", name: "Poland", flag: "🇵🇱" },
  { code: "PT", name: "Portugal", flag: "🇵🇹" },
  { code: "QA", name: "Qatar", flag: "🇶🇦" },
  { code: "RO", name: "Romania", flag: "🇷🇴" },
  { code: "RU", name: "Russia", flag: "🇷🇺" },
  { code: "RW", name: "Rwanda", flag: "🇷🇼" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "SN", name: "Senegal", flag: "🇸🇳" },
  { code: "RS", name: "Serbia", flag: "🇷🇸" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "SK", name: "Slovakia", flag: "🇸🇰" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "LK", name: "Sri Lanka", flag: "🇱🇰" },
  { code: "SD", name: "Sudan", flag: "🇸🇩" },
  { code: "SE", name: "Sweden", flag: "🇸🇪" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭" },
  { code: "SY", name: "Syria", flag: "🇸🇾" },
  { code: "TW", name: "Taiwan", flag: "🇹🇼" },
  { code: "TZ", name: "Tanzania", flag: "🇹🇿" },
  { code: "TH", name: "Thailand", flag: "🇹🇭" },
  { code: "TT", name: "Trinidad & Tobago", flag: "🇹🇹" },
  { code: "TN", name: "Tunisia", flag: "🇹🇳" },
  { code: "TR", name: "Turkey", flag: "🇹🇷" },
  { code: "TM", name: "Turkmenistan", flag: "🇹🇲" },
  { code: "UG", name: "Uganda", flag: "🇺🇬" },
  { code: "UA", name: "Ukraine", flag: "🇺🇦" },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "UY", name: "Uruguay", flag: "🇺🇾" },
  { code: "UZ", name: "Uzbekistan", flag: "🇺🇿" },
  { code: "VE", name: "Venezuela", flag: "🇻🇪" },
  { code: "VN", name: "Vietnam", flag: "🇻🇳" },
  { code: "YE", name: "Yemen", flag: "🇾🇪" },
  { code: "ZM", name: "Zambia", flag: "🇿🇲" },
  { code: "ZW", name: "Zimbabwe", flag: "🇿🇼" },
];

const styles = {
  body: { background: cream, fontFamily: "'DM Sans', sans-serif", color: bark, minHeight: "100vh", padding: "16px 12px 60px" } as CSSProperties,
  app: { maxWidth: 680, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 } as CSSProperties,
  hero: { background: "linear-gradient(135deg, #4a7c59 0%, #1e4228 100%)", borderRadius: 12, padding: "26px 24px 22px", position: "relative", overflow: "hidden" } as CSSProperties,
  heroBadge: { display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 100, padding: "4px 12px", fontSize: 11, color: "rgba(255,255,255,0.9)", fontWeight: 500, letterSpacing: ".5px", marginBottom: 12, textTransform: "uppercase" } as CSSProperties,
  heroTitle: { fontFamily: "'Georgia', serif", fontSize: 26, fontWeight: 600, color: "#fff", lineHeight: 1.25, marginBottom: 5 } as CSSProperties,
  heroSub: { fontSize: 12, color: "rgba(255,255,255,0.72)", lineHeight: 1.7 } as CSSProperties,
  progWrap: { background: "#fff", borderRadius: 10, padding: "12px 18px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 2px 8px rgba(60,40,20,.08)" } as CSSProperties,
  progBar: { flex: 1, height: 6, background: warm, borderRadius: 3, overflow: "hidden" } as CSSProperties,
  card: { background: "#fff", borderRadius: 10, boxShadow: "0 2px 8px rgba(60,40,20,.08)", overflow: "hidden", border: "1px solid rgba(200,185,165,.25)" } as CSSProperties,
  cardHead: { background: warm, padding: "12px 18px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${borderC}` } as CSSProperties,
  snum: { width: 26, height: 26, background: sage, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700, flexShrink: 0 } as CSSProperties,
  sTitleMy: { fontSize: 13, fontWeight: 600, color: bark } as CSSProperties,
  sTitleEn: { fontSize: 10.5, color: subC, marginTop: 1 } as CSSProperties,
  q: { padding: "14px 18px", borderBottom: `1px solid #f5f0e8` } as CSSProperties,
  qLbl: { fontSize: 13, fontWeight: 500, color: bark, display: "flex", gap: 4, marginBottom: 2, lineHeight: 1.5 } as CSSProperties,
  qLblEn: { fontSize: 11, color: subC, marginBottom: 8, display: "block" } as CSSProperties,
  input: { width: "100%", border: `1.5px solid ${borderC}`, borderRadius: 7, background: cream, padding: "8px 11px", fontFamily: "inherit", fontSize: 13, color: bark, outline: "none" } as CSSProperties,
  textarea: { width: "100%", border: `1.5px solid ${borderC}`, borderRadius: 7, background: cream, padding: "8px 11px", fontFamily: "inherit", fontSize: 13, color: bark, outline: "none", resize: "vertical", minHeight: 64 } as CSSProperties,
  select: { width: "100%", border: `1.5px solid ${borderC}`, borderRadius: 7, background: cream, padding: "8px 11px", fontFamily: "inherit", fontSize: 13, color: bark, outline: "none", appearance: "none" } as CSSProperties,
  hint: { fontSize: 11, color: subC, marginTop: 4 } as CSSProperties,
  irow: { display: "flex", gap: 10 } as CSSProperties,
  ci: (sel: boolean): CSSProperties => ({ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 7, border: `1.5px solid ${sel ? sage : "transparent"}`, background: sel ? sageLight : "transparent", cursor: "pointer", transition: "all .15s", marginBottom: 2 }),
  clbl: { fontSize: 13, color: bark } as CSSProperties,
  radio: { width: 16, height: 16, accentColor: sage, cursor: "pointer", flexShrink: 0 } as CSSProperties,
  checkbox: { width: 16, height: 16, accentColor: sage, cursor: "pointer", flexShrink: 0 } as CSSProperties,
  errMsg: { fontSize: 11, color: errorC, marginTop: 4 } as CSSProperties,
  submitRow: { display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 } as CSSProperties,
  btnSub: { background: "linear-gradient(135deg, #4a7c59, #1e4228)", color: "white", border: "none", borderRadius: 9, padding: "13px 28px", fontFamily: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 7, boxShadow: "0 4px 14px rgba(30,66,40,.35)" } as CSSProperties,
  btnClr: { background: "none", border: `1.5px solid ${borderC}`, color: subC, borderRadius: 9, padding: "12px 16px", fontFamily: "inherit", fontSize: 12, cursor: "pointer" } as CSSProperties,
  loadBox: { background: "#fff", borderRadius: 10, padding: "50px 24px", textAlign: "center", boxShadow: "0 2px 8px rgba(60,40,20,.08)" } as CSSProperties,
  loadTitle: { fontFamily: "Georgia, serif", fontSize: 20, color: sage, marginBottom: 8 } as CSSProperties,
  loadSub: { fontSize: 12, color: subC, lineHeight: 1.8 } as CSSProperties,
  loadDots: { display: "flex", justifyContent: "center", gap: 8, margin: "18px 0 0" } as CSSProperties,
};

interface SectionHeadProps {
  num: string;
  titleMy: string;
  titleEn: string;
}
function SectionHead({ num, titleMy, titleEn }: SectionHeadProps) {
  return (
    <div style={styles.cardHead}>
      <div style={styles.snum}>{num}</div>
      <div>
        <div style={styles.sTitleMy}>{titleMy}</div>
        <div style={styles.sTitleEn}>{titleEn}</div>
      </div>
    </div>
  );
}

interface RadioOption { value: string; label: string; }
interface RadioGroupProps {
  name: string; options: RadioOption[]; value: string;
  onChange: (value: string) => void; row?: boolean;
}
function RadioGroup({ name, options, value, onChange, row }: RadioGroupProps) {
  return (
    <div style={{ display: "flex", flexDirection: row ? "row" : "column", flexWrap: "wrap", gap: row ? "4px 12px" : 2, marginTop: 6 }}>
      {options.map(opt => (
        <label key={opt.value} style={styles.ci(value === opt.value)}>
          <input type="radio" name={name} value={opt.value} checked={value === opt.value} onChange={() => onChange(opt.value)} style={styles.radio} />
          <span style={styles.clbl}>{opt.label}</span>
        </label>
      ))}
    </div>
  );
}

interface CheckOption { value: string; label: string; }
interface CheckGroupProps {
  name: string; options: CheckOption[]; values: string[];
  onChange: (values: string[]) => void;
}
function CheckGroup({ name, options, values, onChange }: CheckGroupProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 6 }}>
      {options.map(opt => {
        const checked = values.includes(opt.value);
        return (
          <label key={opt.value} style={styles.ci(checked)}>
            <input type="checkbox" name={name} value={opt.value} checked={checked}
              onChange={() => onChange(checked ? values.filter(v => v !== opt.value) : [...values, opt.value])}
              style={styles.checkbox} />
            <span style={styles.clbl}>{opt.label}</span>
          </label>
        );
      })}
    </div>
  );
}

// ─── Country search combobox ───────────────────────────────────────────────────
interface CountrySearchProps {
  value: string;
  onChange: (country: string) => void;
  error?: boolean;
}
function CountrySearch({ value, onChange, error }: CountrySearchProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const selected = COUNTRIES.find(c => c.name === value);
  const displayValue = open ? query : (selected ? `${selected.flag}  ${selected.name}` : query);

  const filtered = COUNTRIES.filter(c =>
    !query || c.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 10);

  const handleSelect = (country: typeof COUNTRIES[0]) => {
    onChange(country.name);
    setQuery("");
    setOpen(false);
  };

  return (
    <div ref={wrapRef} style={{ position: "relative" }}>
      <div style={{ position: "relative" }}>
        <input
          style={{ ...styles.input, borderColor: error ? errorC : undefined, paddingRight: selected ? 28 : undefined }}
          type="text"
          placeholder="🌍  Search your country…"
          value={displayValue}
          onFocus={() => { setOpen(true); if (selected) setQuery(""); }}
          onBlur={() => setTimeout(() => setOpen(false), 160)}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          autoComplete="off"
        />
        {selected && (
          <button
            onMouseDown={e => { e.preventDefault(); onChange(""); setQuery(""); }}
            style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: subC, fontSize: 15, padding: "0 2px", lineHeight: 1 }}
            tabIndex={-1}
          >×</button>
        )}
      </div>

      {open && filtered.length > 0 && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#fff", border: `1.5px solid ${borderC}`, borderRadius: 8, boxShadow: "0 6px 24px rgba(60,40,20,.14)", zIndex: 200, maxHeight: 230, overflowY: "auto" }}>
          {filtered.map(c => (
            <div
              key={c.code}
              onMouseDown={() => handleSelect(c)}
              style={{ padding: "8px 12px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 13, color: bark, background: value === c.name ? sageLight : "transparent", transition: "background .1s", borderBottom: `1px solid #f5f0e8` }}
              onMouseEnter={e => { if (value !== c.name) (e.currentTarget as HTMLElement).style.background = warm; }}
              onMouseLeave={e => { if (value !== c.name) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <span style={{ fontSize: 20, lineHeight: 1 }}>{c.flag}</span>
              <span>{c.name}</span>
              {value === c.name && <span style={{ marginLeft: "auto", color: sage, fontSize: 12 }}>✓</span>}
            </div>
          ))}
        </div>
      )}

      {open && query.length > 0 && filtered.length === 0 && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#fff", border: `1.5px solid ${borderC}`, borderRadius: 8, boxShadow: "0 6px 24px rgba(60,40,20,.14)", zIndex: 200, padding: "14px 16px", fontSize: 12, color: subC, textAlign: "center" }}>
          No country found for "{query}"
        </div>
      )}
    </div>
  );
}

// ─── Rich result renderer ─────────────────────────────────────────────────────
interface CoachReportProps { text: string; }
function CoachReport({ text }: CoachReportProps) {
  const sections: { key: string; lines: { type: string; text: string }[] }[] = [];
  const lines = text.split("\n");
  let currentSection: string | null = null;
  let buffer: { type: string; text: string }[] = [];

  const sectionMeta: Record<string, { icon: string; color: string; bg: string; border: string }> = {
    "SUMMARY":    { icon: "👤", color: sage, bg: sageLight, border: sage },
    "CALORIE":    { icon: "🔥", color: "#b84a00", bg: "#fde8d8", border: "#e8722a" },
    "MACRO":      { icon: "⚖️", color: blue, bg: blueLight, border: blue },
    "MEAL":       { icon: "🍽️", color: "#5a7a2c", bg: "#eaf5d8", border: "#7ab03a" },
    "MICRO":      { icon: "💊", color: purple, bg: purpleLight, border: purple },
    "TIMING":     { icon: "⏰", color: "#8a6a00", bg: goldLight, border: gold },
    "HYDRATION":  { icon: "💧", color: blue, bg: blueLight, border: blue },
    "HABITS":     { icon: "🧠", color: purple, bg: purpleLight, border: purple },
    "PROGRESS":   { icon: "📈", color: "#2c7a6a", bg: "#d8f0eb", border: "#3aaa90" },
    "WARNING":    { icon: "⚠️", color: red, bg: redLight, border: red },
    "TIP":        { icon: "💡", color: "#7a6a00", bg: goldLight, border: gold },
    "WEEK":       { icon: "📅", color: sage, bg: sageLight, border: sage },
  };

  const flush = () => {
    if (currentSection !== null && buffer.length) {
      sections.push({ key: currentSection, lines: [...buffer] });
      buffer = [];
    }
  };

  lines.forEach(line => {
    const m = line.match(/^##\s*\[(\w+)\]\s*(.*)/);
    if (m) { flush(); currentSection = m[1].toUpperCase(); buffer = [{ type: "heading", text: m[2] }]; }
    else { buffer.push({ type: "line", text: line }); }
  });
  flush();

  if (!sections.length) return <RawRender text={text} />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {sections.map((sec, si) => {
        const meta = Object.entries(sectionMeta).find(([k]) => sec.key.includes(k));
        const m = meta ? meta[1] : { icon: "📌", color: bark, bg: warm, border: borderC };
        const heading = sec.lines.find(l => l.type === "heading");
        const contentLines = sec.lines.filter(l => l.type === "line");
        return (
          <div key={si} style={{ border: `1.5px solid ${m.border}22`, borderRadius: 10, overflow: "hidden", boxShadow: "0 2px 8px rgba(40,30,15,.07)" }}>
            <div style={{ background: `linear-gradient(135deg, ${m.bg}, ${m.bg}cc)`, padding: "12px 18px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${m.border}33` }}>
              <span style={{ fontSize: 20 }}>{m.icon}</span>
              <span style={{ fontFamily: "Georgia, serif", fontSize: 15, fontWeight: 600, color: m.color }}>{heading?.text || sec.key}</span>
            </div>
            <div style={{ padding: "14px 18px", background: "#fff" }}>
              <RenderLines lines={contentLines.map(l => l.text)} accentColor={m.color} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface RenderLinesProps { lines: string[]; accentColor?: string; }
function RenderLines({ lines, accentColor }: RenderLinesProps) {
  const result: ReactNode[] = [];
  let ulBuf: string[] = [];
  let key = 0;

  const flushUl = () => {
    if (!ulBuf.length) return;
    result.push(
      <ul key={key++} style={{ listStyle: "none", padding: 0, margin: "6px 0 10px" }}>
        {ulBuf.map((item, i) => (
          <li key={i} style={{ fontSize: 13, color: bark, lineHeight: 1.85, padding: "3px 0 3px 22px", position: "relative", borderBottom: "1px solid #f8f4ee" }}>
            <span style={{ position: "absolute", left: 0, color: accentColor || sage, fontSize: 10, top: 7 }}>▸</span>
            <RichText text={item} />
          </li>
        ))}
      </ul>
    );
    ulBuf = [];
  };

  lines.forEach(line => {
    if (!line && !ulBuf.length) return;
    if (line.match(/^###\s/)) {
      flushUl();
      result.push(<h4 key={key++} style={{ fontSize: 12.5, fontWeight: 700, color: accentColor || bark, margin: "12px 0 5px", textTransform: "uppercase", letterSpacing: ".5px" }}>{line.slice(4)}</h4>);
    } else if (line.match(/^[-•]\s/)) {
      ulBuf.push(line.slice(2));
    } else if (line.match(/^\|/) && line.includes("|")) {
      flushUl();
      result.push(<TableLine key={key++} line={line} accentColor={accentColor} />);
    } else if (line.match(/^🔴|^🟡|^🟢/)) {
      flushUl();
      const emoji = line.slice(0, 2);
      const rest = line.slice(2).trim();
      const bg = emoji.includes("🔴") ? redLight : emoji.includes("🟡") ? goldLight : sageLight;
      const border = emoji.includes("🔴") ? red : emoji.includes("🟡") ? gold : sage;
      result.push(<div key={key++} style={{ background: bg, border: `1px solid ${border}44`, borderRadius: 7, padding: "8px 12px", margin: "5px 0", fontSize: 12.5, color: bark, lineHeight: 1.7, display: "flex", gap: 8 }}><span>{emoji}</span><RichText text={rest} /></div>);
    } else if (line.trim()) {
      flushUl();
      result.push(<p key={key++} style={{ fontSize: 13, color: bark, lineHeight: 1.9, margin: "4px 0 8px" }}><RichText text={line} /></p>);
    }
  });
  flushUl();
  return <>{result}</>;
}

interface TableLineProps { line: string; accentColor?: string; }
function TableLine({ line }: TableLineProps) {
  const cells = line.split("|").map(c => c.trim()).filter(Boolean);
  if (!cells.length) return null;
  if (cells.every(c => c.match(/^[-:]+$/))) return null;
  return (
    <div style={{ display: "flex", gap: 0, margin: "2px 0", borderBottom: `1px solid ${warm}` }}>
      {cells.map((c, i) => (
        <div key={i} style={{ flex: 1, padding: "6px 10px", fontSize: 12.5, color: i === 0 ? bark : subC, fontWeight: i === 0 ? 500 : 400, background: i % 2 === 0 ? "#fff" : "#fdf9f5" }}>
          <RichText text={c} />
        </div>
      ))}
    </div>
  );
}

interface RichTextProps { text: string; }
function RichText({ text }: RichTextProps) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return <>{parts.map((p, i) => p.startsWith("**") ? <strong key={i} style={{ fontWeight: 600 }}>{p.slice(2, -2)}</strong> : p)}</>;
}

interface RawRenderProps { text: string; }
function RawRender({ text }: RawRenderProps) {
  const lines = text.split("\n");
  const result: ReactNode[] = [];
  let k = 0;
  lines.forEach(line => {
    if (line.startsWith("## ")) result.push(<h2 key={k++} style={{ fontFamily: "Georgia,serif", fontSize: 16, color: sage, margin: "16px 0 8px", paddingBottom: 4, borderBottom: `2px solid ${sageLight}` }}>{line.slice(3)}</h2>);
    else if (line.startsWith("### ")) result.push(<h3 key={k++} style={{ fontSize: 13, fontWeight: 700, color: bark, margin: "10px 0 4px" }}>{line.slice(4)}</h3>);
    else if (line.match(/^[-•]\s/)) result.push(<li key={k++} style={{ fontSize: 13, lineHeight: 1.85, listStyle: "none", paddingLeft: 16, position: "relative" }}><span style={{ position: "absolute", left: 0, color: sage }}>▸</span>{line.slice(2)}</li>);
    else if (line.trim()) result.push(<p key={k++} style={{ fontSize: 13, lineHeight: 1.9, margin: "4px 0 8px" }}>{line}</p>);
  });
  return <>{result}</>;
}

function Dots() {
  return (
    <>
      <style>{`@keyframes db{0%,80%,100%{transform:scale(0);opacity:.3}40%{transform:scale(1);opacity:1}}`}</style>
      <div style={styles.loadDots}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: sage, animation: `db 1.4s ${i * .2}s ease-in-out infinite` }} />
        ))}
      </div>
    </>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const EMPTY_FORM = {
  country: "", age: "", sex: "", height: "", weight: "", target: "", goal: "",
  activity: "", exercise: "", workSchedule: "",
  allergies: "", restrictions: [] as string[], dislikes: "", preferred: "", budget: "",
  meals: "", snacking: "", fluid: "", sleep: "", stress: "",
  medical: "", medications: "", supplements: ""
};

export default function NutritionCoach() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [screen, setScreen] = useState("form");
  const [coachResult, setCoachResult] = useState<string | null>(null);
  const [loadMsg, setLoadMsg] = useState("");

  const set = (k: string, v: string | string[]) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const REQS = ["country", "age", "sex", "activity", "meals", "snacking", "fluid", "goal"];
  const filled = REQS.filter(k => {
    const v = form[k as keyof typeof form];
    return Array.isArray(v) ? v.length > 0 : v && (v as string).trim();
  }).length;
  const progress = Math.round((filled / REQS.length) * 100);

  const validate = () => {
    const e: Record<string, boolean> = {};
    REQS.forEach(k => {
      const v = form[k as keyof typeof form];
      if (!v || (typeof v === "string" && !v.trim())) e[k] = true;
    });
    setErrors(e);
    return !Object.keys(e).length;
  };

  const countryFlag = COUNTRIES.find(c => c.name === form.country)?.flag ?? "🌍";

  const submit = async () => {
    if (!validate()) { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    setScreen("loading");

    const msgs = [
      `Analyzing nutrition data for ${form.country}…`,
      "Calculating your BMR & TDEE…",
      `Searching ${form.country} local food database…`,
      "Building your personalized meal plan…",
      "Tailoring to your food culture & location…",
      "Preparing your comprehensive report…",
    ];
    let msgIdx = 0;
    setLoadMsg(msgs[0]);
    const iv = setInterval(() => { msgIdx = (msgIdx + 1) % msgs.length; setLoadMsg(msgs[msgIdx]); }, 2200);

    const prompt = `You are a world-class certified nutrition coach, registered dietitian, and sports nutritionist with GLOBAL expertise. You have deep, authoritative knowledge of the food cultures, dietary traditions, locally available ingredients, seasonal produce, typical cooking methods, and nutritional challenges specific to every country in the world.

CLIENT INTAKE DATA:
- Country of Residence: ${form.country}
- Age: ${form.age} | Sex: ${form.sex}
- Height: ${form.height || "Not provided"} | Weight: ${form.weight || "Not provided"} | Target Weight: ${form.target || "Not specified"}
- Primary Goal: ${form.goal}
- Activity Level: ${form.activity}
- Exercise Routine: ${form.exercise || "Not specified"}
- Work Schedule: ${form.workSchedule || "Not specified"}
- Food Allergies/Intolerances: ${form.allergies || "None"}
- Dietary Restrictions: ${form.restrictions.join(", ") || "None"}
- Disliked Foods: ${form.dislikes || "Not specified"}
- Preferred Foods/Cuisines: ${form.preferred || "Not specified"}
- Meal Budget: ${form.budget || "Not specified"}
- Meals per Day: ${form.meals}
- Snacking Habits: ${form.snacking}
- Daily Fluid Intake: ${form.fluid}
- Sleep Duration: ${form.sleep || "Not specified"}
- Stress Level: ${form.stress || "Not specified"}
- Medical Conditions: ${form.medical || "None"}
- Current Medications: ${form.medications || "None"}
- Current Supplements: ${form.supplements || "None"}

━━━ LOCATION-AWARE COACHING INSTRUCTIONS ━━━

1. LOCAL FOOD FIRST: Reference real, authentic traditional foods and dishes from ${form.country}. Use local food names in the native language of ${form.country} with English translation in parentheses — e.g., "ข้าวมันไก่ (Khao Man Gai)" for Thailand, "دال چاول (Dal Chawal)" for Pakistan, "Jollof Rice" for Nigeria, "Mohinga" for Myanmar. Every meal recommendation must be food that is ACTUALLY eaten and available in ${form.country}.

2. GROCERY REALITY: Only recommend foods realistically accessible in ${form.country}. Reference local supermarket chains, wet markets, bazaars, or traditional food shops specific to ${form.country}. Avoid recommending foods that are exotic or unavailable there.

3. FOOD CULTURE & CUSTOMS: Deeply incorporate the dietary customs, religious food practices (e.g., Ramadan fasting, Buddhist vegetarian days, Hindu dietary laws), meal timing traditions, and cultural food taboos common in ${form.country}. Address the person as someone who grew up with and understands their local food culture.

4. CLIMATE & SEASONALITY: Factor in the climate of ${form.country} — tropical countries need higher hydration; cold climates need different caloric strategies. Recommend seasonal produce currently available in ${form.country}.

5. REGIONAL HEALTH CONTEXT: Address nutritional deficiencies or excesses statistically common in ${form.country} (e.g., iodine in SE Asia, iron deficiency in South Asia, vitamin D deficiency in Nordic countries, excess sodium in East Asia, etc.).

6. LANGUAGE: Write primarily in English, but include local food names in the native language of ${form.country} throughout. If the client is from a non-English-speaking country, add a brief key summary line in their local language at the end of major sections.

7. EXACT NUMBERS: Be extremely specific — exact calorie targets, exact gram amounts for macros, exact portion sizes using both metric and local measurement units where relevant.

8. 7-DAY MEAL PLAN: Provide a COMPLETE 7-day sample meal plan using foods readily available in ${form.country}. Include breakfast, lunch, dinner, and snacks for every day using authentic local dishes. Include exact macro breakdown per meal.

9. MEDICAL SAFETY: Flag any medical/medication nutritional interactions clearly.

10. TONE: Be warm, motivating, and deeply culturally respectful. Acknowledge the person's specific food heritage from ${form.country} and show genuine expertise in their local cuisine.

FORMAT RULES — use EXACTLY these section tags on their own line, nothing before ##:
## [SUMMARY] Client Profile Overview
## [CALORIE] Calorie Needs & Energy Balance
## [MACRO] Macronutrient Targets
## [MICRO] Key Micronutrients & Vitamins
## [MEAL] 7-Day Sample Meal Plan — ${form.country}
## [TIMING] Meal Timing & Eating Windows
## [HYDRATION] Hydration Protocol
## [HABITS] Lifestyle, Sleep & Stress Impact on Nutrition
## [PROGRESS] Progress Tracking & Measurable Milestones
## [WEEK] 4-Week Action Plan (Week-by-Week)
## [WARNING] Important Cautions & Medical Notes
## [TIP] Personal Coach Message

Under each section use:
- ### Sub-heading for sub-categories
- Bullet points starting with "- " for lists
- **bold** for key numbers and terms
- Tables using | col1 | col2 | col3 | format
- 🟢 for positive/go signals, 🟡 for moderate/caution, 🔴 for avoid/warning

Make this the most thorough, location-specific nutrition plan this person has ever received. Every single food recommendation must reflect what is actually eaten, cooked, and available in ${form.country}.`;

    try {
      const txt = await requestCoachReport(prompt);
      clearInterval(iv);
      setCoachResult(txt);
      setScreen("result");
    } catch (err) {
      clearInterval(iv);
      setScreen("form");
      alert("API error:\n" + (err instanceof Error ? err.message : String(err)));
    }
  };

  const eI = (k: string): CSSProperties => errors[k] ? { ...styles.input, borderColor: errorC } : styles.input;
  const eSel = (k: string): CSSProperties => errors[k] ? { ...styles.select, borderColor: errorC } : styles.select;

  return (
    <div style={styles.body}>
      <div style={styles.app}>

        {/* HERO */}
        <div style={styles.hero}>
          <div style={styles.heroBadge}>🌍 Global AI Nutrition Coach</div>
          <h1 style={styles.heroTitle}>Your Personal Nutrition Coach</h1>
          <p style={styles.heroSub}>
            Personalized plans for every country — local foods, local culture, local availability<br />
            7-Day Meal Plan · Macro & Micro Targets · Culturally Adapted · Any Country Worldwide
          </p>
        </div>

        {/* PROGRESS */}
        {screen === "form" && (
          <div style={styles.progWrap}>
            <span style={{ fontSize: 12, color: subC }}>Completion</span>
            <div style={styles.progBar}>
              <div style={{ height: "100%", width: progress + "%", background: `linear-gradient(90deg,${sage},${gold})`, borderRadius: 3, transition: "width .4s" }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: progress === 100 ? sage : gold, minWidth: 32, textAlign: "right" }}>{progress}%</span>
          </div>
        )}

        {/* ════ FORM ════ */}
        {screen === "form" && (<>

          {/* §1 Personal Details */}
          <div style={styles.card}>
            <SectionHead num="1" titleMy="Personal Details" titleEn="Location, biometrics & goals" />

            {/* Country — first and prominent */}
            <div style={{ ...styles.q, background: errors.country ? "#fff8f8" : undefined }}>
              <div style={styles.qLbl}>
                Country of Residence <span style={{ color: errorC }}>*</span>
              </div>
              <span style={styles.qLblEn}>Where you currently live — determines food availability, culture & climate-based recommendations</span>
              <CountrySearch value={form.country} onChange={v => set("country", v)} error={!!errors.country} />
              {errors.country && <p style={styles.errMsg}>Please select your country</p>}
            </div>

            <div style={styles.q}>
              <div style={styles.qLbl}>Age <span style={{ color: errorC }}>*</span></div>
              <span style={styles.qLblEn}>Your current age</span>
              <input style={eI("age")} type="number" placeholder="e.g. 28" value={form.age} onChange={e => set("age", e.target.value)} min="1" max="120" />
              {errors.age && <p style={styles.errMsg}>Please enter your age</p>}
            </div>

            <div style={styles.q}>
              <div style={styles.qLbl}>Biological Sex <span style={{ color: errorC }}>*</span></div>
              <span style={styles.qLblEn}>Used for metabolic rate calculations</span>
              <RadioGroup name="sex" row value={form.sex} onChange={v => set("sex", v)}
                options={[{ value: "Male", label: "Male" }, { value: "Female", label: "Female" }, { value: "Other / Prefer not to say", label: "Other / Prefer not to say" }]} />
              {errors.sex && <p style={styles.errMsg}>Please select an option</p>}
            </div>

            <div style={styles.q}>
              <div style={styles.qLbl}>Height & Current Weight</div>
              <span style={styles.qLblEn}>Use any unit — cm/ft, kg/lbs</span>
              <div style={{ ...styles.irow, marginTop: 4 }}>
                <div style={{ flex: 1 }}><input style={styles.input} placeholder="e.g. 165 cm" value={form.height} onChange={e => set("height", e.target.value)} /><p style={styles.hint}>Height</p></div>
                <div style={{ flex: 1 }}><input style={styles.input} placeholder="e.g. 68 kg" value={form.weight} onChange={e => set("weight", e.target.value)} /><p style={styles.hint}>Current Weight</p></div>
              </div>
            </div>

            <div style={styles.q}>
              <div style={styles.qLbl}>Target Weight <span style={{ fontSize: 11, fontWeight: 400, color: subC }}>(optional)</span></div>
              <input style={styles.input} placeholder="e.g. 60 kg" value={form.target} onChange={e => set("target", e.target.value)} />
            </div>

            <div style={{ ...styles.q, borderBottom: "none" }}>
              <div style={styles.qLbl}>Primary Goal <span style={{ color: errorC }}>*</span></div>
              <RadioGroup name="goal" value={form.goal} onChange={v => set("goal", v)} options={[
                { value: "Weight Loss", label: "⬇  Weight Loss — reduce body fat" },
                { value: "Weight Gain / Muscle Building", label: "⬆  Weight Gain / Muscle Building" },
                { value: "Maintenance", label: "=  Maintenance — keep current weight & health" },
                { value: "Improve Energy & Performance", label: "⚡  Improve Energy & Athletic Performance" },
                { value: "Medical / Therapeutic", label: "🏥  Medical / Therapeutic nutrition" },
              ]} />
              {errors.goal && <p style={styles.errMsg}>Please select a goal</p>}
            </div>
          </div>

          {/* §2 Activity */}
          <div style={styles.card}>
            <SectionHead num="2" titleMy="Activity & Schedule" titleEn="Daily movement, exercise & work pattern" />
            <div style={styles.q}>
              <div style={styles.qLbl}>Daily Activity Level <span style={{ color: errorC }}>*</span></div>
              <RadioGroup name="act" value={form.activity} onChange={v => set("activity", v)} options={[
                { value: "Sedentary (desk job / mostly sitting)", label: "Sedentary — desk job, mostly sitting" },
                { value: "Lightly Active (1–2 days/week exercise)", label: "Lightly Active — light exercise 1–2 days/week" },
                { value: "Moderately Active (3–4 days/week exercise)", label: "Moderately Active — 3–4 days/week" },
                { value: "Very Active (5+ days/week or physical job)", label: "Very Active — 5+ days/week or physical job" },
                { value: "Extremely Active (athlete / military / labor)", label: "Extremely Active — athlete, military, or heavy labor" },
              ]} />
              {errors.activity && <p style={styles.errMsg}>Please select your activity level</p>}
            </div>
            <div style={styles.q}>
              <div style={styles.qLbl}>Exercise Details</div>
              <span style={styles.qLblEn}>Type, frequency, and duration of workouts</span>
              <textarea style={styles.textarea} placeholder="e.g. Mon/Wed 30 min jogging, Fri 45 min weight training" value={form.exercise} onChange={e => set("exercise", e.target.value)} />
            </div>
            <div style={{ ...styles.q, borderBottom: "none" }}>
              <div style={styles.qLbl}>Work Schedule / Wake-Sleep Hours</div>
              <input style={styles.input} placeholder="e.g. Office 9–5, wake at 7 am, sleep at 11 pm" value={form.workSchedule} onChange={e => set("workSchedule", e.target.value)} />
            </div>
          </div>

          {/* §3 Dietary */}
          <div style={styles.card}>
            <SectionHead num="3" titleMy="Dietary Profile" titleEn="Food preferences, restrictions & budget" />
            <div style={styles.q}>
              <div style={styles.qLbl}>Food Allergies / Intolerances</div>
              <textarea style={styles.textarea} placeholder="e.g. Lactose intolerance, peanut allergy&#10;Write 'None' if not applicable" value={form.allergies} onChange={e => set("allergies", e.target.value)} />
            </div>
            <div style={styles.q}>
              <div style={styles.qLbl}>Dietary Restrictions</div>
              <CheckGroup name="res" values={form.restrictions} onChange={v => set("restrictions", v)} options={[
                { value: "Vegetarian", label: "🌿  Vegetarian" },
                { value: "Vegan", label: "🌱  Vegan" },
                { value: "Pescatarian", label: "🐟  Pescatarian (fish & seafood only)" },
                { value: "Halal", label: "🌙  Halal" },
                { value: "Kosher", label: "✡️  Kosher" },
                { value: "Gluten-Free", label: "🌾✗  Gluten-Free" },
                { value: "No Restrictions", label: "✅  No dietary restrictions" },
              ]} />
            </div>
            <div style={styles.q}>
              <div style={styles.qLbl}>Preferred Foods</div>
              <span style={styles.qLblEn}>Local dishes, cuisines, or ingredients you enjoy</span>
              <textarea style={styles.textarea} placeholder="e.g. Rice dishes, grilled fish, lentil soup, local street food you love…" value={form.preferred} onChange={e => set("preferred", e.target.value)} />
            </div>
            <div style={styles.q}>
              <div style={styles.qLbl}>Foods You Dislike / Avoid</div>
              <input style={styles.input} placeholder="e.g. Liver, bitter gourd, seafood" value={form.dislikes} onChange={e => set("dislikes", e.target.value)} />
            </div>
            <div style={{ ...styles.q, borderBottom: "none" }}>
              <div style={styles.qLbl}>Weekly Food Budget <span style={{ fontSize: 11, fontWeight: 400, color: subC }}>(optional)</span></div>
              <span style={styles.qLblEn}>Helps tailor affordable recommendations for your local market</span>
              <RadioGroup name="budget" value={form.budget} onChange={v => set("budget", v)} options={[
                { value: "Budget-friendly (spend as little as possible)", label: "💰  Budget-friendly — minimize spending" },
                { value: "Moderate budget (typical local spending)", label: "💳  Moderate — typical household food budget" },
                { value: "Premium / flexible budget", label: "💎  Premium — quality over cost" },
                { value: "No budget constraint", label: "∞  No budget constraint" },
              ]} />
            </div>
          </div>

          {/* §4 Habits */}
          <div style={styles.card}>
            <SectionHead num="4" titleMy="Daily Habits & Wellness" titleEn="Eating patterns, sleep & stress" />
            <div style={styles.q}>
              <div style={styles.qLbl}>Meals per Day <span style={{ color: errorC }}>*</span></div>
              <RadioGroup name="meals" row value={form.meals} onChange={v => set("meals", v)}
                options={[{ value: "1", label: "1" }, { value: "2", label: "2" }, { value: "3", label: "3" }, { value: "4", label: "4" }, { value: "5+", label: "5+" }]} />
              {errors.meals && <p style={styles.errMsg}>Please select</p>}
            </div>
            <div style={styles.q}>
              <div style={styles.qLbl}>Snacking Habits <span style={{ color: errorC }}>*</span></div>
              <RadioGroup name="snk" value={form.snacking} onChange={v => set("snacking", v)} options={[
                { value: "Frequent (3+ times/day)", label: "Frequent — 3+ times per day" },
                { value: "Occasional (1–2 times/day)", label: "Occasional — 1–2 times per day" },
                { value: "Rarely", label: "Rarely" },
                { value: "Never", label: "Never" },
              ]} />
              {errors.snacking && <p style={styles.errMsg}>Please select</p>}
            </div>
            <div style={styles.q}>
              <div style={styles.qLbl}>Daily Fluid Intake <span style={{ color: errorC }}>*</span></div>
              <select style={eSel("fluid")} value={form.fluid} onChange={e => set("fluid", e.target.value)}>
                <option value="">Select…</option>
                <option>Under 1 litre</option>
                <option>1 – 1.5 litres</option>
                <option>1.5 – 2 litres</option>
                <option>2 – 2.5 litres</option>
                <option>Over 2.5 litres</option>
              </select>
              {errors.fluid && <p style={styles.errMsg}>Please select</p>}
            </div>
            <div style={styles.q}>
              <div style={styles.qLbl}>Sleep Duration per Night</div>
              <RadioGroup name="sleep" row value={form.sleep} onChange={v => set("sleep", v)}
                options={[{ value: "<5h", label: "< 5h" }, { value: "5–6h", label: "5–6h" }, { value: "6–7h", label: "6–7h" }, { value: "7–8h", label: "7–8h" }, { value: "8h+", label: "8h+" }]} />
            </div>
            <div style={{ ...styles.q, borderBottom: "none" }}>
              <div style={styles.qLbl}>Stress Level</div>
              <RadioGroup name="stress" row value={form.stress} onChange={v => set("stress", v)}
                options={[{ value: "Low", label: "Low" }, { value: "Moderate", label: "Moderate" }, { value: "High", label: "High" }, { value: "Very High", label: "Very High" }]} />
            </div>
          </div>

          {/* §5 Medical */}
          <div style={styles.card}>
            <SectionHead num="5" titleMy="Medical & Supplements" titleEn="Health conditions, medications & supplements" />
            <div style={styles.q}>
              <div style={styles.qLbl}>Medical Conditions</div>
              <span style={styles.qLblEn}>e.g. Diabetes, hypertension, PCOS, thyroid, kidney disease, heart disease</span>
              <textarea style={styles.textarea} placeholder="List any diagnosed conditions — write 'None' if not applicable" value={form.medical} onChange={e => set("medical", e.target.value)} />
            </div>
            <div style={styles.q}>
              <div style={styles.qLbl}>Current Medications</div>
              <input style={styles.input} placeholder="e.g. Metformin, Amlodipine — leave blank if none" value={form.medications} onChange={e => set("medications", e.target.value)} />
            </div>
            <div style={{ ...styles.q, borderBottom: "none" }}>
              <div style={styles.qLbl}>Current Supplements</div>
              <input style={styles.input} placeholder="e.g. Vitamin D3, Fish Oil, Zinc — leave blank if none" value={form.supplements} onChange={e => set("supplements", e.target.value)} />
            </div>
          </div>

          <div style={styles.submitRow}>
            <button style={styles.btnSub} onClick={submit}>
              {form.country ? `${countryFlag}  Get My ${form.country} Nutrition Plan` : "🌿  Get My Nutrition Plan"}
            </button>
            <button style={styles.btnClr} onClick={() => {
              if (window.confirm("Clear all fields and start over?")) { setForm(EMPTY_FORM); setErrors({}); }
            }}>Clear form</button>
          </div>
        </>)}

        {/* ════ LOADING ════ */}
        {screen === "loading" && (
          <div style={styles.loadBox}>
            <div style={{ fontSize: 50, animation: "pulse 2s ease-in-out infinite", marginBottom: 16 }}>{countryFlag}</div>
            <style>{`@keyframes pulse{0%,100%{transform:scale(1);opacity:.85}50%{transform:scale(1.08);opacity:1}}`}</style>
            <div style={styles.loadTitle}>Preparing your {form.country} plan…</div>
            <p style={{ ...styles.loadSub, minHeight: 40 }}>{loadMsg}</p>
            <Dots />
            <p style={{ fontSize: 11, color: subC, marginTop: 18, lineHeight: 1.7 }}>
              {form.country} Local Foods · 7-Day Meal Plan · Macro Targets · Micronutrients · 4-Week Action Plan
            </p>
          </div>
        )}

        {/* ════ RESULT ════ */}
        {screen === "result" && coachResult && (
          <div>
            <div style={{ background: "linear-gradient(135deg, #1e4228, #4a7c59)", borderRadius: "12px 12px 0 0", padding: "22px 24px", display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 52, height: 52, background: "rgba(255,255,255,.15)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>
                {countryFlag}
              </div>
              <div>
                <div style={{ fontFamily: "Georgia, serif", fontSize: 19, color: "#fff", marginBottom: 3 }}>
                  Personalized Nutrition Plan — {form.country}
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,.7)" }}>
                  Locally adapted to {form.country} · Comprehensive bilingual report
                </div>
              </div>
            </div>

            <div style={{ background: "#fff", borderLeft: "1px solid rgba(200,185,165,.25)", borderRight: "1px solid rgba(200,185,165,.25)", padding: "10px 18px", display: "flex", flexWrap: "wrap", gap: 6 }}>
              {[`${countryFlag} ${form.country} Adapted`, "📊 TDEE Calculated", "🍽 7-Day Meal Plan", "⚖️ Macro Targets", "💊 Micronutrients", "📅 4-Week Plan", "⚠️ Medical Notes"].map(tag => (
                <span key={tag} style={{ background: sageLight, color: sage, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 500 }}>{tag}</span>
              ))}
            </div>

            <div style={{ padding: "16px 16px 4px", background: cream, border: "1px solid rgba(200,185,165,.25)", borderTop: "none" }}>
              <CoachReport text={coachResult} />
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", padding: "14px 16px", background: warm, borderRadius: "0 0 12px 12px", borderTop: `1px solid ${borderC}` }}>
              <button style={{ background: sage, color: "#fff", border: "none", borderRadius: 7, padding: "9px 18px", fontFamily: "inherit", fontSize: 12, fontWeight: 500, cursor: "pointer" }}
                onClick={() => { setScreen("form"); setCoachResult(null); }}>
                🔄  New Plan
              </button>
              <button
                type="button"
                style={{ background: "none", border: `1.5px solid ${borderC}`, color: subC, borderRadius: 7, padding: "8px 14px", fontFamily: "inherit", fontSize: 12, cursor: "pointer" }}
                onClick={e => { e.preventDefault(); window.print(); }}>
                🖨  Print / Save PDF
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
