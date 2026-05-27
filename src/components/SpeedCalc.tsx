import { useState, useMemo } from "react";
import { CalcShell, NumField, SelectField, Result, fmt } from "./CalcShell";
import { syncSpeed, actualSpeed, slipFromSpeeds, SYNC_SPEEDS_50HZ } from "../lib/formulas";

export default function SpeedCalc() {
  const [f, setF] = useState("50");
  const [poles, setPoles] = useState("4");
  const [slipPct, setSlipPct] = useState("3");

  const pNum = parseFloat(poles) || 0;
  const polePairs = pNum / 2;
  const nSync = useMemo(() => syncSpeed(parseFloat(f) || 0, polePairs), [f, polePairs]);
  const nActual = useMemo(() => actualSpeed(nSync, (parseFloat(slipPct) || 0) / 100), [nSync, slipPct]);

  return (
    <CalcShell>
      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-4">
          <SelectField
            label="Częstotliwość sieci f"
            value={f}
            onChange={setF}
            options={[
              { value: "50", label: "50 Hz (Europa, Polska)" },
              { value: "60", label: "60 Hz (USA, część Azji)" },
            ]}
          />
          <SelectField
            label="Liczba biegunów silnika"
            value={poles}
            onChange={setPoles}
            options={[
              { value: "2", label: "2 (1 para) — szybki silnik, ~3000 rpm @ 50 Hz" },
              { value: "4", label: "4 (2 pary) — najczęściej, ~1500 rpm @ 50 Hz" },
              { value: "6", label: "6 (3 pary) — wolniejszy, ~1000 rpm @ 50 Hz" },
              { value: "8", label: "8 (4 pary) — ~750 rpm @ 50 Hz" },
              { value: "10", label: "10 (5 par) — ~600 rpm @ 50 Hz" },
              { value: "12", label: "12 (6 par) — ~500 rpm @ 50 Hz" },
            ]}
            hint="Z tabliczki silnika — wnioskuj z obrotów znamionowych (zob. tabela poniżej)."
          />
          <NumField
            label="Poślizg s"
            unit="%"
            value={slipPct}
            onChange={setSlipPct}
            hint="Typowo 2–3% (silniki małej mocy 4–6%). Wynika z różnicy obr. synchronicznych i znamionowych."
          />
        </div>

        <div className="space-y-3">
          <Result label="Obroty synchroniczne n_sync" value={fmt(nSync, 0)} unit="obr/min" hint="Prędkość wirującego pola magnetycznego stojana." />
          <Result label="Obroty rzeczywiste n" value={fmt(nActual, 0)} unit="obr/min" emphasis hint="Prędkość wirnika przy obciążeniu znamionowym (uwzględnia poślizg)." />
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-ink-200">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-500 mb-3">Tabela referencyjna (50 Hz)</div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12.5px] font-mono">
            <thead>
              <tr className="text-ink-500 border-b border-ink-200">
                <th className="text-left py-2 px-2 font-medium">Biegunów</th>
                <th className="text-left py-2 px-2 font-medium">Par</th>
                <th className="text-right py-2 px-2 font-medium">n_sync [rpm]</th>
                <th className="text-right py-2 px-2 font-medium">n_typowe [rpm]</th>
              </tr>
            </thead>
            <tbody>
              {SYNC_SPEEDS_50HZ.map((row) => (
                <tr key={row.poles} className={`border-b border-ink-100 ${row.poles === pNum ? "bg-accent/10" : ""}`}>
                  <td className="py-1.5 px-2 text-ink-900">{row.poles}</td>
                  <td className="py-1.5 px-2 text-ink-500">{row.pairs}</td>
                  <td className="py-1.5 px-2 text-right text-ink-900">{row.nSync}</td>
                  <td className="py-1.5 px-2 text-right text-ink-500">{row.nTypical}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </CalcShell>
  );
}
