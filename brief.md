# Brief — silnikitrojfazowe.pl

**Data startu**: 2026-05-27
**Tryb**: Mode C+ (Karol dał gotowe kalkulatory + cel wzmocnienia silniki-elektryczne.com.pl)

## Cel strony

Postawienie **niezależnej strony narzędziowej** z kalkulatorami inżynierskimi dla silników
trójfazowych. Cel długoterminowy: pozyskanie naturalnego ruchu z zapytań technicznych
("kalkulator prądu silnika", "moment obrotowy silnika", "gwiazda trójkąt") i dyskretne
przekazanie zainteresowanych zakupem do sklepu **silniki-elektryczne.com.pl**.

## Strategia anty-PBN

Karol ma już 3 aktywne domeny w niszy (silniki-elektryczne.com.pl, silniki-trojfazowe.pl,
silnik-elektryczny.pl). Czwarta domena z prawie identyczną nazwą jak istniejący sklep
(`silniki-trojfazowe.pl` vs `silnikitrojfazowe.pl`) wymaga świadomej dyferencjacji:

- **Inna identyfikacja wizualna** (jasny minimalizm + cyan vs sklepowe navy)
- **Inny cel funkcjonalny** — narzędzia, nie produkty (brak koszyka, brak cenników)
- **Inny "tone of voice"** — inżynierski, podaje wzory, normy, ograniczenia
- **Realna wartość użytkowa** — kalkulator z wyprowadzonymi wzorami, nie thin content
- **Jeden, dyskretny CTA** do sklepu (stopka + sekcja "o projekcie"), nie spamersko
- **Brak GA Pixel Tracking** — strona deklaruje że nie zbiera danych
  (ZAKTUALIZOWANE: GA4 jest włączone z Consent Mode v2; deklaracja w polityce
  prywatności pozostaje "minimalne dane, tylko z waszą zgodą")

## Audience

- Elektrycy wykonawcy (dobór MCB, przewodu, przekaźnika termicznego)
- Automatycy / utrzymanie ruchu (weryfikacja tabliczek, dobór falownika)
- Projektanci elektryczni (szybkie szacowania w fazie koncepcyjnej)
- Studenci elektroenergetyki / mechatroniki (nauka wzorów)

## Sekcje / strony

| URL | Kalkulator |
|---|---|
| `/` | Hub z 6 kalkulatorami |
| `/kalkulator-pradu-silnika-trojfazowego/` | I_n z mocy, U, cos φ, η |
| `/kalkulator-momentu-obrotowego/` | M ↔ P z obrotów |
| `/kalkulator-obrotow-silnika/` | n_sync, poślizg, tabela biegunów |
| `/polaczenie-gwiazda-trojkat/` | Y/Δ — auto-wybór z tabliczki + schemat |
| `/dobor-zabezpieczen-silnika/` | MCB B/C/D, bezpiecznik gG/aM, MPCB |
| `/przelicznik-kw-km-hp/` | KM (735.5) vs HP (745.7) |
| `/o-projekcie/` | Manifesto |
| `/kontakt/` | Email (noindex) |
| `/polityka-prywatnosci/` | (noindex) |

## Tech stack

- Astro 5 (static), Tailwind 3 via `@astrojs/tailwind`, React 19 islands per kalkulator
- Hosting: AWS S3 + CloudFront (2× dist: www + naked redirect)
- DNS: Route53; mail forwarding przez Aftermarket MX
- Repo: public na GitHub (LeszczynskiKarol/silnikitrojfazowe-pl)
- CI/CD: GitHub Actions z OIDC role

## Brak (poza zakresem v1)

- Sklep / koszyk
- Blog (default OFF per workflow)
- Regulamin (default OFF — strona nic nie sprzedaje)
- Contact form z załącznikami (zwykły mailto wystarczy — strona narzędziowa, nie B2B
  sprzedaż)
- Theme toggle dark/light (default workflow ON, ale tu pomijam — narzędzie technicze
  i tak ma czarne bloki wzorów)

## Mailbox

- `kontakt@silnikitrojfazowe.pl` — forwarding przez Aftermarket MX na prywatną skrzynkę
  Karola (`karolleszczynskikorektor@gmail.com`)
- Karol musi założyć tę skrzynkę w panelu Aftermarket (TODO w LAUNCH-REPORT)
