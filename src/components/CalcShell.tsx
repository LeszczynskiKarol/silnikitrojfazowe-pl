import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

// Wspólny kontener dla wszystkich kalkulatorów (interaktywnych React island).
export function CalcShell({ children }: Props) {
  return (
    <div className="bg-white border border-ink-200 rounded-lg p-6 md:p-7 shadow-sm">
      {children}
    </div>
  );
}

interface FieldProps {
  label: string;
  unit: string;
  value: number | string;
  onChange: (v: string) => void;
  hint?: string;
  step?: string;
  min?: string;
  type?: string;
}

export function NumField({ label, unit, value, onChange, hint, step = "any", min = "0", type = "number" }: FieldProps) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-[12.5px] font-medium text-ink-700">{label}</span>
        <span className="text-[11px] font-mono text-ink-400">{unit}</span>
      </div>
      <input
        type={type}
        step={step}
        min={min}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 px-3 bg-ink-50 border border-ink-200 rounded-md font-mono text-[14px] text-ink-900 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition"
      />
      {hint && <div className="mt-1 text-[11px] text-ink-400 leading-relaxed">{hint}</div>}
    </label>
  );
}

interface SelectFieldProps<T extends string | number> {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  hint?: string;
}

export function SelectField<T extends string | number>({ label, value, onChange, options, hint }: SelectFieldProps<T>) {
  return (
    <label className="block">
      <div className="mb-1 text-[12.5px] font-medium text-ink-700">{label}</div>
      <select
        value={value as any}
        onChange={(e) => {
          const v = e.target.value as any;
          const original = options.find((o) => String(o.value) === v);
          onChange(original ? original.value : (v as T));
        }}
        className="w-full h-10 px-3 bg-ink-50 border border-ink-200 rounded-md text-[14px] text-ink-900 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition"
      >
        {options.map((o) => (
          <option key={String(o.value)} value={String(o.value)}>{o.label}</option>
        ))}
      </select>
      {hint && <div className="mt-1 text-[11px] text-ink-400 leading-relaxed">{hint}</div>}
    </label>
  );
}

interface ResultProps {
  label: string;
  value: string;
  unit: string;
  emphasis?: boolean;
  hint?: string;
}

export function Result({ label, value, unit, emphasis, hint }: ResultProps) {
  return (
    <div className={`p-4 rounded-md border ${emphasis ? "bg-ink-900 border-ink-900 text-white" : "bg-ink-50 border-ink-200"}`}>
      <div className={`text-[11px] uppercase tracking-wider mb-1 ${emphasis ? "text-cyan-300" : "text-ink-400"}`}>{label}</div>
      <div className="flex items-baseline gap-2">
        <span className={`font-mono font-semibold text-[22px] ${emphasis ? "text-white" : "text-ink-900"}`}>{value}</span>
        <span className={`font-mono text-[13px] ${emphasis ? "text-cyan-300" : "text-ink-500"}`}>{unit}</span>
      </div>
      {hint && <div className={`mt-1.5 text-[11.5px] leading-relaxed ${emphasis ? "text-cyan-200/80" : "text-ink-500"}`}>{hint}</div>}
    </div>
  );
}

export function fmt(n: number, digits = 2): string {
  if (!isFinite(n) || isNaN(n)) return "—";
  if (n === 0) return "0";
  if (Math.abs(n) >= 10000) return n.toFixed(0);
  if (Math.abs(n) >= 100) return n.toFixed(1);
  return n.toFixed(digits);
}
