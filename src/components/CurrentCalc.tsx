import { useState, useMemo } from "react";
import { CalcShell, NumField, SelectField, Result, fmt } from "./CalcShell";
import { ratedCurrent, inputPower, apparentPower, typicalParams } from "../lib/formulas";

export default function CurrentCalc() {
  const [P, setP] = useState("7.5");
  const [U, setU] = useState("400");
  const [cosPhi, setCosPhi] = useState("0.85");
  const [eta, setEta] = useState("0.895");

  const P_num = parseFloat(P) || 0;
  const U_num = parseFloat(U) || 0;
  const cos_num = parseFloat(cosPhi) || 0;
  const eta_num = parseFloat(eta) || 0;

  const I = useMemo(() => ratedCurrent(P_num * 1000, U_num, cos_num, eta_num), [P_num, U_num, cos_num, eta_num]);
  const P_in = useMemo(() => inputPower(P_num * 1000, eta_num) / 1000, [P_num, eta_num]);
  const S = useMemo(() => apparentPower(P_num * 1000, cos_num, eta_num) / 1000, [P_num, cos_num, eta_num]);

  function applyTypical() {
    const t = typicalParams(P_num);
    setCosPhi(t.cosPhi.toFixed(2));
    setEta(t.eta.toFixed(3));
  }

  return (
    <CalcShell>
      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-4">
          <NumField label="Moc na wale P" unit="kW" value={P} onChange={setP} hint="Wartość z tabliczki znamionowej silnika." />
          <SelectField
            label="Napięcie międzyfazowe U"
            value={U}
            onChange={setU}
            options={[
              { value: "400", label: "400 V (sieć 3~ w Polsce)" },
              { value: "230", label: "230 V (sieć 3~ — historyczna)" },
              { value: "690", label: "690 V (przemysł, duże silniki)" },
              { value: "500", label: "500 V" },
            ]}
          />
          <div className="grid grid-cols-2 gap-3">
            <NumField label="cos φ" unit="—" value={cosPhi} onChange={setCosPhi} hint="0.75–0.90 typowo" step="0.01" />
            <NumField label="Sprawność η" unit="—" value={eta} onChange={setEta} hint="IE1: ~0.80, IE3: ~0.90, IE4: ~0.94" step="0.001" />
          </div>
          <button
            type="button"
            onClick={applyTypical}
            className="text-[12px] font-medium text-accent hover:text-accent-dark underline underline-offset-2"
          >
            ↪ Wstaw wartości orientacyjne dla mocy {P_num} kW (IE3, 1500 rpm)
          </button>
        </div>

        <div className="space-y-3">
          <Result
            label="Prąd znamionowy I_n"
            value={fmt(I)}
            unit="A"
            emphasis
            hint="Prąd pobierany przez silnik w pracy ciągłej przy obciążeniu znamionowym."
          />
          <Result
            label="Moc czynna z sieci"
            value={fmt(P_in)}
            unit="kW"
            hint="Większa niż moc na wale o straty silnika (1/η)."
          />
          <Result
            label="Moc pozorna S"
            value={fmt(S)}
            unit="kVA"
            hint="Do doboru transformatora i przekroju kabli."
          />
        </div>
      </div>
    </CalcShell>
  );
}
