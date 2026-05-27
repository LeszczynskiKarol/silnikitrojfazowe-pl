import { useState, useMemo } from "react";
import { CalcShell, NumField, SelectField, Result, fmt } from "./CalcShell";
import { recommendProtection, type StartType } from "../lib/formulas";

export default function ProtectionCalc() {
  const [In, setIn] = useState("14.2");
  const [start, setStart] = useState<StartType>("DOL");

  const r = useMemo(() => recommendProtection(parseFloat(In) || 0, start), [In, start]);

  return (
    <CalcShell>
      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-4">
          <NumField
            label="Prąd znamionowy silnika I_n"
            unit="A"
            value={In}
            onChange={setIn}
            hint="Z tabliczki silnika lub z kalkulatora prądu znamionowego."
          />
          <SelectField
            label="Sposób rozruchu"
            value={start}
            onChange={(v) => setStart(v as StartType)}
            options={[
              { value: "DOL", label: "Bezpośredni (DOL) — pełne napięcie" },
              { value: "STAR_DELTA", label: "Gwiazda-trójkąt (Y-Δ)" },
              { value: "SOFT_START", label: "Soft-start (rozrusznik napięciowy)" },
              { value: "VFD", label: "Falownik (VFD)" },
            ]}
            hint="Decyduje o wartości szczytowego prądu i charakterystyce MCB."
          />
        </div>

        <div className="space-y-3">
          <Result
            label={`Wyłącznik MCB`}
            value={`${r.mcbRating} A`}
            unit={`char. ${r.mcbCharacteristic}`}
            emphasis
            hint={`Standardowa wartość zabezpieczenia zwarciowego. Char. ${r.mcbCharacteristic === "D" ? "D wytrzymuje krótkotrwały prąd 10–20 × I_n MCB (bezpieczne dla rozruchu DOL)" : "C: 5–10 × I_n MCB"}.`}
          />
          <Result
            label="Bezpiecznik topikowy (gG)"
            value={`${r.fuseRating} A`}
            unit="A"
            hint="Alternatywa dla MCB; gG = ogólnego przeznaczenia, dla obwodów silnikowych zwykle stosuje się aM."
          />
          <Result
            label="Szacunkowy prąd rozruchu"
            value={fmt(r.startCurrent, 0)}
            unit="A"
            hint="Wartość chwilowa w pierwszych sekundach rozruchu."
          />
        </div>
      </div>

      <div className="mt-6 p-5 bg-cyan-50 border border-cyan-200 rounded-md">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-accent-dark mb-2">
          Zalecenie inżynierskie
        </div>
        <p className="text-[13.5px] text-ink-800 leading-relaxed mb-2">
          <strong>Stosuj wyłącznik silnikowy (MPCB)</strong> zamiast zwykłego MCB. MPCB ma osobno
          regulowaną nastawę termiczną (przeciążeniową) i magnetyczną (zwarciową, ~12·I_n) —
          to znacznie lepsza ochrona silnika.
        </p>
        <p className="text-[13.5px] text-ink-800 leading-relaxed">
          Nastawa termiczna MPCB: <strong className="font-mono">{fmt(r.mpcbSetpoint)} A</strong> (= I_n silnika z tabliczki).
        </p>
      </div>

      <ul className="mt-5 space-y-2">
        {r.notes.map((note, i) => (
          <li key={i} className="text-[12.5px] text-ink-600 leading-relaxed pl-4 relative">
            <span className="absolute left-0 text-ink-400">→</span>
            {note}
          </li>
        ))}
      </ul>
    </CalcShell>
  );
}
