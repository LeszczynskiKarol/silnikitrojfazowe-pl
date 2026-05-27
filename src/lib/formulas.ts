// Czyste funkcje obliczeniowe dla silników trójfazowych.
// Wszystkie wzory zweryfikowane wobec: PN-EN 60034-1 (parametry silników),
// PN-EN 60898-1 (MCB), PN-EN 60947-2 (wyłączniki silnikowe), oraz literatury:
// Kostro, "Maszyny elektryczne", WNT 2011; Plamitzer, "Maszyny elektryczne".

export const SQRT3 = Math.sqrt(3);

// ─────────────────────────────────────────────────────────────────────────────
// 1. PRĄD ZNAMIONOWY SILNIKA TRÓJFAZOWEGO
// ─────────────────────────────────────────────────────────────────────────────
// Moc czynna na wale (z tabliczki) = √3 · U · I · cos φ · η
// Stąd: I = P / (√3 · U · cos φ · η)
//
// P_shaft [W]  — moc mechaniczna na wale (z tabliczki silnika)
// U [V]        — napięcie międzyfazowe (linia-linia), w PL standardowo 400 V
// cosPhi       — współczynnik mocy (0.75–0.90 typowo)
// eta          — sprawność (0.78–0.96, klasa IE1–IE4)
export function ratedCurrent(
  P_shaft_W: number,
  U_line_V: number,
  cosPhi: number,
  eta: number
): number {
  if (P_shaft_W <= 0 || U_line_V <= 0 || cosPhi <= 0 || eta <= 0) return 0;
  return P_shaft_W / (SQRT3 * U_line_V * cosPhi * eta);
}

// Moc czynna pobierana z sieci (uwzględnia straty silnika)
export function inputPower(P_shaft_W: number, eta: number): number {
  if (P_shaft_W <= 0 || eta <= 0) return 0;
  return P_shaft_W / eta;
}

// Moc pozorna (do doboru przekrojów, transformatorów)
export function apparentPower(P_shaft_W: number, cosPhi: number, eta: number): number {
  if (cosPhi <= 0 || eta <= 0) return 0;
  return P_shaft_W / (cosPhi * eta);
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. MOMENT OBROTOWY
// ─────────────────────────────────────────────────────────────────────────────
// M = P / ω;   ω = 2π·n/60   →   M [Nm] = 9549.296 · P[kW] / n[rpm]
// (9549.296 = 60000/(2π))
export function torqueNm(P_kW: number, n_rpm: number): number {
  if (P_kW <= 0 || n_rpm <= 0) return 0;
  return (9549.296585513721 * P_kW) / n_rpm;
}

// Odwrotne: moc z momentu i obrotów
export function powerFromTorque(M_Nm: number, n_rpm: number): number {
  if (M_Nm <= 0 || n_rpm <= 0) return 0;
  return (M_Nm * n_rpm) / 9549.296585513721; // [kW]
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. OBROTY SYNCHRONICZNE I POŚLIZG
// ─────────────────────────────────────────────────────────────────────────────
// n_sync [rpm] = 60·f / p,  p = liczba PAR biegunów (uwaga: nie liczba biegunów!)
// liczba_biegunów = 2·p
// n_rzecz = n_sync · (1 − s),  s = poślizg (typowo 2–6%)
export function syncSpeed(f_Hz: number, polePairs: number): number {
  if (f_Hz <= 0 || polePairs <= 0) return 0;
  return (60 * f_Hz) / polePairs;
}

export function actualSpeed(n_sync_rpm: number, slip: number): number {
  if (n_sync_rpm <= 0) return 0;
  return n_sync_rpm * (1 - slip);
}

export function slipFromSpeeds(n_sync_rpm: number, n_actual_rpm: number): number {
  if (n_sync_rpm <= 0) return 0;
  return (n_sync_rpm - n_actual_rpm) / n_sync_rpm;
}

// Tabela referencyjna — standardowe konfiguracje przy 50 Hz
export const SYNC_SPEEDS_50HZ = [
  { poles: 2, pairs: 1, nSync: 3000, nTypical: 2900 },
  { poles: 4, pairs: 2, nSync: 1500, nTypical: 1450 },
  { poles: 6, pairs: 3, nSync: 1000, nTypical: 960 },
  { poles: 8, pairs: 4, nSync: 750, nTypical: 720 },
  { poles: 10, pairs: 5, nSync: 600, nTypical: 580 },
  { poles: 12, pairs: 6, nSync: 500, nTypical: 485 },
];

// ─────────────────────────────────────────────────────────────────────────────
// 4. POŁĄCZENIE GWIAZDA / TRÓJKĄT
// ─────────────────────────────────────────────────────────────────────────────
// W gwiezdzie (Y):  U_uzwoj = U_linii / √3,  I_linii = I_uzwoj
// W trójkącie (Δ):  U_uzwoj = U_linii,        I_linii = √3 · I_uzwoj
//
// Tabliczka "U1/U2 V Δ/Y" — silnik ma na uzwojeniach napięcie U1 (niższe).
// W sieci o napięciu U1 → łącz w Δ;  w sieci U2 → łącz w Y.
// W Polsce sieć 3~ to 400 V, więc dla tabliczki 230/400V Δ/Y → Y;
// dla tabliczki 400/690V Δ/Y → Δ.

export type Connection = "Y" | "D" | "INCOMPATIBLE";

export interface ConnectionResult {
  connection: Connection;
  reason: string;
  phaseVoltage: number; // napięcie na uzwojeniu
}

export function recommendConnection(
  U_grid_V: number,
  U_low_V: number,
  U_high_V: number
): ConnectionResult {
  const tol = 0.05; // 5% tolerancji na zaokrąglenia (np. 230 vs 220, 400 vs 380)
  if (Math.abs(U_grid_V - U_low_V) / U_low_V <= tol) {
    return {
      connection: "D",
      reason: `Napięcie sieci (${U_grid_V} V) odpowiada niższemu napięciu z tabliczki (${U_low_V} V) — uzwojenia łączymy w trójkąt, bo wtedy napięcie na każdym uzwojeniu = napięcie sieci.`,
      phaseVoltage: U_grid_V,
    };
  }
  if (Math.abs(U_grid_V - U_high_V) / U_high_V <= tol) {
    return {
      connection: "Y",
      reason: `Napięcie sieci (${U_grid_V} V) odpowiada wyższemu napięciu z tabliczki (${U_high_V} V) — uzwojenia łączymy w gwiazdę, bo wtedy napięcie na każdym uzwojeniu = ${U_grid_V}/√3 ≈ ${(U_grid_V / SQRT3).toFixed(0)} V, czyli ${U_low_V} V (zgodnie z tabliczką).`,
      phaseVoltage: U_grid_V / SQRT3,
    };
  }
  return {
    connection: "INCOMPATIBLE",
    reason: `Napięcie sieci (${U_grid_V} V) nie pasuje do żadnej wartości z tabliczki (${U_low_V} V / ${U_high_V} V). Silnika nie wolno podłączyć do tej sieci bezpośrednio.`,
    phaseVoltage: 0,
  };
}

// Rozruch Y-Δ: stosunek prądu i momentu w gwiezdzie do trójkąta = 1/3
export const Y_DELTA_START_RATIO = 1 / 3;

// ─────────────────────────────────────────────────────────────────────────────
// 5. DOBÓR ZABEZPIECZENIA
// ─────────────────────────────────────────────────────────────────────────────
// Prąd rozruchu silnika klatkowego (DOL — direct on line): 5–8 × I_n.
// MCB (PN-EN 60898-1) wg charakterystyki magnetycznej:
//   B: 3–5  × I_n_MCB  → wybije się przy rozruchu silnika; NIE dla silników
//   C: 5–10 × I_n_MCB  → na granicy; OK dla małych silników z lekkim rozruchem
//   D: 10–20× I_n_MCB  → bezpieczne dla DOL silników
// Lepsze: wyłącznik silnikowy (MPCB, PN-EN 60947-2) z osobno regulowaną
// nastawą termiczną (przeciążeniową) i magnetyczną (zwarciową, ~12·I_n).

// Standardowe wartości znamionowe MCB [A]
export const STANDARD_MCB_RATINGS = [
  6, 10, 13, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125,
];

// Standardowe wartości bezpieczników topikowych (gG) [A]
export const STANDARD_FUSE_RATINGS = [
  2, 4, 6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200,
];

export type StartType = "DOL" | "STAR_DELTA" | "SOFT_START" | "VFD";

export interface ProtectionResult {
  mcbRating: number;
  mcbCharacteristic: "C" | "D";
  fuseRating: number;
  mpcbSetpoint: number; // nastawa termiczna wyłącznika silnikowego
  startCurrent: number; // szacunkowy prąd rozruchowy
  notes: string[];
}

export function recommendProtection(
  I_n_A: number,
  startType: StartType
): ProtectionResult {
  const notes: string[] = [];
  let startMultiplier = 6; // DOL typowo 6×
  let mcbMargin = 1.5;
  let mcbChar: "C" | "D" = "D";

  if (startType === "DOL") {
    startMultiplier = 6;
    mcbMargin = 1.5;
    mcbChar = "D";
    notes.push("Rozruch bezpośredni (DOL): prąd rozruchowy 5–8 × I_n przez 1–10 s.");
  } else if (startType === "STAR_DELTA") {
    startMultiplier = 2.5;
    mcbMargin = 1.25;
    mcbChar = "C";
    notes.push("Rozruch Y-Δ: prąd w fazie gwiazdy ≈ 1/3 wartości DOL.");
  } else if (startType === "SOFT_START") {
    startMultiplier = 3;
    mcbMargin = 1.25;
    mcbChar = "C";
    notes.push("Soft-start: prąd rozruchu zwykle ograniczony do 3–4 × I_n.");
  } else if (startType === "VFD") {
    startMultiplier = 1.5;
    mcbMargin = 1.15;
    mcbChar = "C";
    notes.push("Falownik (VFD): prąd po stronie sieci zbliżony do znamionowego. Zabezpieczenie po stronie silnika realizuje falownik.");
  }

  const requiredMcb = I_n_A * mcbMargin;
  const mcbRating = pickNext(STANDARD_MCB_RATINGS, requiredMcb);
  const fuseRating = pickNext(STANDARD_FUSE_RATINGS, requiredMcb);

  notes.push(
    `Wyłącznik silnikowy (MPCB) jest zalecany zamiast MCB — ma regulowaną nastawę termiczną. Ustaw nastawę termiczną na wartość I_n silnika = ${I_n_A.toFixed(2)} A.`
  );
  notes.push(
    "Zabezpieczenie przeciążeniowe (przekaźnik termiczny) powinno być nastawione na I_n silnika z tabliczki, nie na wartość MCB."
  );

  return {
    mcbRating,
    mcbCharacteristic: mcbChar,
    fuseRating,
    mpcbSetpoint: I_n_A,
    startCurrent: I_n_A * startMultiplier,
    notes,
  };
}

function pickNext(table: number[], value: number): number {
  for (const v of table) {
    if (v >= value) return v;
  }
  return table[table.length - 1];
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. PRZELICZNIKI MOCY
// ─────────────────────────────────────────────────────────────────────────────
// UWAGA: są DWIE jednostki nazywane "horsepower":
//   • KM (koń mechaniczny, metric horsepower)        = 735.49875 W
//   • HP (mechanical horsepower, używane w USA)      = 745.69987 W
// Różnica ≈ 1.4%. W Europie/Polsce na tabliczkach silników "KM" lub "HP"
// zwykle oznacza KM = 735.5 W. Silniki produkcji amerykańskiej — HP = 745.7 W.

export const W_PER_KM = 735.49875;
export const W_PER_HP_US = 745.6998715822702;

export function kWtoKM(kW: number): number {
  return (kW * 1000) / W_PER_KM;
}
export function kWtoHP_US(kW: number): number {
  return (kW * 1000) / W_PER_HP_US;
}
export function KMtokW(km: number): number {
  return (km * W_PER_KM) / 1000;
}
export function HP_UStokW(hp: number): number {
  return (hp * W_PER_HP_US) / 1000;
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. ORIENTACYJNE PARAMETRY (gdy użytkownik nie zna z tabliczki)
// ─────────────────────────────────────────────────────────────────────────────
// Wartości orientacyjne dla silników klatkowych klasy IE3 przy n=1500 rpm.
// Źródło: katalogi Cantoni, ABB, Siemens — typowe wartości dla mocy nominalnej.

export interface TypicalParams {
  cosPhi: number;
  eta: number;
}

export function typicalParams(P_kW: number): TypicalParams {
  // Małe silniki mają niższe cos φ i η, duże — wyższe.
  // Interpolacja na podstawie typowych katalogów.
  const table: { kW: number; cosPhi: number; eta: number }[] = [
    { kW: 0.37, cosPhi: 0.72, eta: 0.79 },
    { kW: 0.75, cosPhi: 0.78, eta: 0.82 },
    { kW: 1.5, cosPhi: 0.80, eta: 0.85 },
    { kW: 3.0, cosPhi: 0.83, eta: 0.87 },
    { kW: 5.5, cosPhi: 0.84, eta: 0.89 },
    { kW: 7.5, cosPhi: 0.85, eta: 0.895 },
    { kW: 11, cosPhi: 0.86, eta: 0.91 },
    { kW: 15, cosPhi: 0.86, eta: 0.92 },
    { kW: 22, cosPhi: 0.87, eta: 0.925 },
    { kW: 30, cosPhi: 0.87, eta: 0.93 },
    { kW: 45, cosPhi: 0.88, eta: 0.94 },
    { kW: 75, cosPhi: 0.88, eta: 0.945 },
    { kW: 110, cosPhi: 0.88, eta: 0.95 },
    { kW: 200, cosPhi: 0.89, eta: 0.955 },
  ];
  if (P_kW <= table[0].kW) return { cosPhi: table[0].cosPhi, eta: table[0].eta };
  if (P_kW >= table[table.length - 1].kW)
    return { cosPhi: table[table.length - 1].cosPhi, eta: table[table.length - 1].eta };
  for (let i = 0; i < table.length - 1; i++) {
    const a = table[i];
    const b = table[i + 1];
    if (P_kW >= a.kW && P_kW <= b.kW) {
      const t = (P_kW - a.kW) / (b.kW - a.kW);
      return {
        cosPhi: a.cosPhi + t * (b.cosPhi - a.cosPhi),
        eta: a.eta + t * (b.eta - a.eta),
      };
    }
  }
  return { cosPhi: 0.85, eta: 0.9 };
}
