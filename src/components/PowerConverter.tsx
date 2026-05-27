import { useState, useMemo } from "react";
import { CalcShell, NumField, Result, fmt } from "./CalcShell";
import { kWtoKM, kWtoHP_US, KMtokW, HP_UStokW, W_PER_KM, W_PER_HP_US } from "../lib/formulas";

type Unit = "kW" | "KM" | "HP";

export default function PowerConverter() {
  const [from, setFrom] = useState<Unit>("kW");
  const [val, setVal] = useState("7.5");

  const num = parseFloat(val) || 0;

  const kw = useMemo(() => {
    if (from === "kW") return num;
    if (from === "KM") return KMtokW(num);
    return HP_UStokW(num);
  }, [from, num]);

  const km = useMemo(() => kWtoKM(kw), [kw]);
  const hp = useMemo(() => kWtoHP_US(kw), [kw]);

  return (
    <CalcShell>
      <div className="flex gap-1 mb-5 p-1 bg-ink-100 rounded-md inline-flex">
        {(["kW", "KM", "HP"] as Unit[]).map((u) => (
          <button
            key={u}
            type="button"
            onClick={() => setFrom(u)}
            className={`px-3.5 py-1.5 text-[12.5px] font-medium rounded transition ${from === u ? "bg-white text-ink-900 shadow-sm" : "text-ink-500 hover:text-ink-900"}`}
          >
            Z {u}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <NumField label={`Wartość w ${from}`} unit={from} value={val} onChange={setVal} />
          <div className="mt-3 text-[12px] text-ink-500 leading-relaxed">
            {from === "KM" && "KM = koń mechaniczny (metric horsepower) = 735.49875 W. Standard w Europie."}
            {from === "HP" && "HP (US) = mechanical horsepower = 745.69987 W. Standard w USA, niektóre silniki amerykańskie."}
            {from === "kW" && "1 kW = 1000 W. Jednostka układu SI."}
          </div>
        </div>

        <div className="space-y-3">
          {from !== "kW" && <Result label="kW" value={fmt(kw, 3)} unit="kW" emphasis />}
          {from !== "KM" && <Result label="KM (metric, Europa)" value={fmt(km, 3)} unit="KM" emphasis={from === "kW"} />}
          {from !== "HP" && <Result label="HP (US, mechanical)" value={fmt(hp, 3)} unit="HP" />}
        </div>
      </div>

      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-700 mb-1.5">
          Pułapka: KM ≠ HP
        </div>
        <p className="text-[13px] text-amber-900 leading-relaxed">
          Polskie tabliczki silników podają moc w <strong>KM</strong> (koń mechaniczny, 735.5 W).
          Tabliczki amerykańskich silników w <strong>HP</strong> (mechanical horsepower, 745.7 W).
          Różnica wynosi 1.4% i bywa źródłem błędów przy doborze. Jeśli tabliczka ma napis "HP" przy
          silniku europejskim — bardzo często chodzi w istocie o KM.
        </p>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-[12.5px] font-mono">
          <thead>
            <tr className="text-ink-500 border-b border-ink-200">
              <th className="text-right py-2 px-3 font-medium">kW</th>
              <th className="text-right py-2 px-3 font-medium">KM (metric)</th>
              <th className="text-right py-2 px-3 font-medium">HP (US)</th>
            </tr>
          </thead>
          <tbody>
            {[0.37, 0.55, 0.75, 1.1, 1.5, 2.2, 3, 4, 5.5, 7.5, 11, 15, 18.5, 22, 30, 37, 45, 55, 75, 90, 110].map((v) => (
              <tr key={v} className="border-b border-ink-100">
                <td className="py-1.5 px-3 text-right text-ink-900">{v}</td>
                <td className="py-1.5 px-3 text-right text-ink-700">{kWtoKM(v).toFixed(2)}</td>
                <td className="py-1.5 px-3 text-right text-ink-500">{kWtoHP_US(v).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CalcShell>
  );
}
