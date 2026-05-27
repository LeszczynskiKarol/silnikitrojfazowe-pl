import { useState, useMemo } from "react";
import { CalcShell, NumField, Result, fmt } from "./CalcShell";
import { torqueNm, powerFromTorque } from "../lib/formulas";

type Mode = "PtoM" | "MtoP";

export default function TorqueCalc() {
  const [mode, setMode] = useState<Mode>("PtoM");
  const [P, setP] = useState("7.5");
  const [n, setN] = useState("1450");
  const [M, setM] = useState("50");

  const M_out = useMemo(() => torqueNm(parseFloat(P) || 0, parseFloat(n) || 0), [P, n]);
  const P_out = useMemo(() => powerFromTorque(parseFloat(M) || 0, parseFloat(n) || 0), [M, n]);

  return (
    <CalcShell>
      <div className="flex gap-1 mb-5 p-1 bg-ink-100 rounded-md inline-flex">
        <button
          type="button"
          onClick={() => setMode("PtoM")}
          className={`px-3.5 py-1.5 text-[12.5px] font-medium rounded transition ${mode === "PtoM" ? "bg-white text-ink-900 shadow-sm" : "text-ink-500 hover:text-ink-900"}`}
        >
          Z mocy → moment
        </button>
        <button
          type="button"
          onClick={() => setMode("MtoP")}
          className={`px-3.5 py-1.5 text-[12.5px] font-medium rounded transition ${mode === "MtoP" ? "bg-white text-ink-900 shadow-sm" : "text-ink-500 hover:text-ink-900"}`}
        >
          Z momentu → moc
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-4">
          {mode === "PtoM" ? (
            <NumField label="Moc P" unit="kW" value={P} onChange={setP} hint="Moc na wale (z tabliczki)." />
          ) : (
            <NumField label="Moment M" unit="Nm" value={M} onChange={setM} />
          )}
          <NumField
            label="Prędkość obrotowa n"
            unit="obr/min"
            value={n}
            onChange={setN}
            hint="Obroty pracy (znamionowe, z poślizgiem). 2-bieg.: ~2900, 4-bieg.: ~1450, 6-bieg.: ~960."
          />
        </div>

        <div className="space-y-3">
          {mode === "PtoM" ? (
            <Result label="Moment obrotowy M" value={fmt(M_out)} unit="Nm" emphasis hint="Moment znamionowy silnika przy obrotach n." />
          ) : (
            <Result label="Moc P" value={fmt(P_out)} unit="kW" emphasis hint="Moc mechaniczna oddawana na wale." />
          )}
        </div>
      </div>
    </CalcShell>
  );
}
