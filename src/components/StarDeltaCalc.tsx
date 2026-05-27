import { useState, useMemo } from "react";
import { CalcShell, NumField, SelectField, Result, fmt } from "./CalcShell";
import { recommendConnection, SQRT3 } from "../lib/formulas";

const NAMEPLATES = [
  { value: "230/400", label: "230/400 V Δ/Y", low: 230, high: 400 },
  { value: "400/690", label: "400/690 V Δ/Y", low: 400, high: 690 },
  { value: "220/380", label: "220/380 V Δ/Y (starsze)", low: 220, high: 380 },
];

export default function StarDeltaCalc() {
  const [grid, setGrid] = useState("400");
  const [plate, setPlate] = useState("230/400");

  const np = NAMEPLATES.find((n) => n.value === plate) || NAMEPLATES[0];
  const result = useMemo(() => recommendConnection(parseFloat(grid) || 0, np.low, np.high), [grid, np]);

  const isY = result.connection === "Y";
  const isD = result.connection === "D";

  return (
    <CalcShell>
      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-4">
          <SelectField
            label="Napięcie sieci 3~ (między fazami)"
            value={grid}
            onChange={setGrid}
            options={[
              { value: "230", label: "230 V (rzadkie)" },
              { value: "400", label: "400 V (Polska, standard)" },
              { value: "500", label: "500 V" },
              { value: "690", label: "690 V (przemysł)" },
            ]}
          />
          <SelectField
            label="Napięcia z tabliczki silnika"
            value={plate}
            onChange={setPlate}
            options={NAMEPLATES.map((n) => ({ value: n.value, label: n.label }))}
            hint="Format: niższe / wyższe; przed znakiem ukośnika połączenie Δ, po — Y."
          />
        </div>

        <div className="space-y-3">
          <div className={`p-5 rounded-md border-2 ${isY ? "border-cyan-500 bg-cyan-50" : isD ? "border-amber-500 bg-amber-50" : "border-red-500 bg-red-50"}`}>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-500 mb-1.5">Zalecane połączenie</div>
            <div className="font-mono font-bold text-3xl text-ink-900 mb-2">
              {isY ? "GWIAZDA (Y)" : isD ? "TRÓJKĄT (Δ)" : "NIEZGODNE"}
            </div>
            {result.phaseVoltage > 0 && (
              <div className="text-[13px] text-ink-700 font-mono mb-2">
                Napięcie na uzwojeniu: <strong>{fmt(result.phaseVoltage, 0)} V</strong>
              </div>
            )}
            <div className="text-[13px] text-ink-600 leading-relaxed">{result.reason}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-ink-200">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-500 mb-4">Schematy połączeń uzwojeń</div>
        <div className="grid md:grid-cols-2 gap-6">
          <Diagram type="Y" highlight={isY} />
          <Diagram type="D" highlight={isD} />
        </div>
      </div>
    </CalcShell>
  );
}

function Diagram({ type, highlight }: { type: "Y" | "D"; highlight: boolean }) {
  const isY = type === "Y";
  const stroke = highlight ? "#0891b2" : "#94a3b8";
  const fill = highlight ? "#0891b2" : "#94a3b8";

  return (
    <div className={`p-4 rounded-md border ${highlight ? "border-accent bg-accent/5" : "border-ink-200 bg-ink-50"}`}>
      <div className={`font-mono text-[13px] font-semibold mb-3 ${highlight ? "text-accent-dark" : "text-ink-500"}`}>
        {isY ? "Gwiazda (Y)" : "Trójkąt (Δ)"}
      </div>
      <svg viewBox="0 0 220 180" className="w-full h-auto">
        {isY ? (
          <>
            <line x1="110" y1="100" x2="60" y2="40" stroke={stroke} strokeWidth="2.5" />
            <line x1="110" y1="100" x2="160" y2="40" stroke={stroke} strokeWidth="2.5" />
            <line x1="110" y1="100" x2="110" y2="160" stroke={stroke} strokeWidth="2.5" />
            <circle cx="110" cy="100" r="4" fill={fill} />
            <text x="50" y="32" fill={fill} fontSize="13" fontFamily="JetBrains Mono" textAnchor="end">U1 (L1)</text>
            <text x="170" y="32" fill={fill} fontSize="13" fontFamily="JetBrains Mono">V1 (L2)</text>
            <text x="110" y="178" fill={fill} fontSize="13" fontFamily="JetBrains Mono" textAnchor="middle">W1 (L3)</text>
            <text x="125" y="105" fill="#1a1f29" fontSize="11" fontFamily="JetBrains Mono">N (W2-U2-V2)</text>
          </>
        ) : (
          <>
            <polygon points="60,140 160,140 110,40" stroke={stroke} strokeWidth="2.5" fill="none" />
            <circle cx="60" cy="140" r="4" fill={fill} />
            <circle cx="160" cy="140" r="4" fill={fill} />
            <circle cx="110" cy="40" r="4" fill={fill} />
            <text x="50" y="160" fill={fill} fontSize="13" fontFamily="JetBrains Mono" textAnchor="end">U1 (L1)</text>
            <text x="170" y="160" fill={fill} fontSize="13" fontFamily="JetBrains Mono">V1 (L2)</text>
            <text x="110" y="32" fill={fill} fontSize="13" fontFamily="JetBrains Mono" textAnchor="middle">W1 (L3)</text>
          </>
        )}
      </svg>
      <div className="text-[11.5px] font-mono text-ink-500 mt-2 leading-relaxed">
        {isY ? (
          <>U<sub>uzw</sub> = U<sub>linii</sub> / √3<br/>I<sub>linii</sub> = I<sub>uzw</sub></>
        ) : (
          <>U<sub>uzw</sub> = U<sub>linii</sub><br/>I<sub>linii</sub> = √3 · I<sub>uzw</sub></>
        )}
      </div>
    </div>
  );
}
