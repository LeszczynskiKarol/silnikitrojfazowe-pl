# Design system — silnikitrojfazowe.pl

## Mood

Engineering minimal. Jasne tło, czarne bloki ze wzorami w monospace, cyan jako akcent
techniczny. Estetyka "kompendium" / "kartka inżyniera", nie e-commerce.

**Świadomie odróżnione od** `silniki-trojfazowe.pl` (sklep — navy + Sora) i
`silniki-elektryczne.com.pl` (sklep — szeroka oferta, ikonki).

## Paleta

| Token | Wartość | Użycie |
|---|---|---|
| `ink-50`  | `#f7f8fa` | tło strony |
| `ink-100` | `#eef0f4` | bg-subtle, hover, table row |
| `ink-200` | `#dde1e9` | bordery |
| `ink-400` | `#8b94a6` | tekst pomocniczy, meta |
| `ink-500` | `#5d6675` | tekst secondary |
| `ink-700` | `#2a313d` | nagłówki h3 |
| `ink-900` | `#0f131a` | tekst body + bloki wzorów (dark inverse) |
| `accent`  | `#0891b2` (cyan-600) | akcenty interaktywne |
| `accent-dark` | `#0e7490` | hover, na bg-białym |
| `accent-soft` | `#cffafe` | tło highlight |

Cyan jako akcent — jednoznacznie "techniczny" / "laboratoryjny", nie sklepowy.

## Typografia

- **Inter** (400/500/600/700) — body, nagłówki
- **JetBrains Mono** (400/500/600) — wzory, kod, wyniki obliczeń, footer "v0.1"

Pojawienie się mono w wynikach kalkulatorów + nazwie marki ("silnikitrojfazowe.pl")
sygnalizuje techniczność strony jeszcze przed przeczytaniem treści.

## Komponenty

- **Layout** — sticky header (biały), category bar (subtle bg) z 6 kalkulatorami,
  footer z 3 kolumnami.
- **CalcShell** — biały panel z borderem dla kalkulatora.
- **NumField / SelectField** — inputy ze stałą wysokością 40px, mono dla wartości.
- **Result** — może być normalny (subtle) albo emphasis (ink-900 bg, cyan text).
- **Formula** — czarny blok mono ze wzorem; `.var` cyan, `.num` amber, `.op` slate.
- **Sources** — biała karta z normami PN-EN.
- **Limitations** — amber alert "kiedy NIE używać".

## Layouty stron

Każdy kalkulator:
1. Breadcrumb monospace (`/ kalkulatory / nazwa`)
2. H1 + lead paragraph
3. Interaktywny CalcShell (React island)
4. Sekcja "Wzór" z czarnym blokiem
5. "Oznaczenia" — bullet list
6. "Przykład obliczeniowy" — drugi czarny blok
7. (kontekstowe sekcje typu "rozruch Y-Δ", "tabela biegunów")
8. **Limitations** (amber) — "kiedy NIE używać"
9. **Sources** (biała) — normy i literatura
10. Powiązane kalkulatory (ink-100 box)

## Komponenty których ŚWIADOMIE nie używam (vs default workflow)

- **HeroIllustration** — narzędzie nie potrzebuje ilustracji, wartość = sam kalkulator
- **FeatureCard / IconBadge** — minimalizm zamiast feature-section
- **StatBlock** — brak liczb do chwalenia się ("X klientów")
- **ContactForm Lambda + presign + załączniki** — wystarczy `mailto:`
- **Theme toggle dark/light** — strona z dużą ilością czarnych bloków-wzorów na jasnym tle
  jest już sama z siebie "kontrastowa"; toggle dodawałby złożoności bez wartości
- **BackgroundDecor** — narzędzie powinno być "spokojne", dekoracje rozpraszają od liczb

## OG image

1200×630, jasna marka "silnikitrojfazowe.pl" + tagline "Kalkulatory inżynierskie silników
trójfazowych" + wzór `I = P / (√3 · U · cos φ · η)` w stopce. Generowane z SVG przez
`sharp` w `scripts/og.mjs`.
