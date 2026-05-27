# LAUNCH REPORT — silnikitrojfazowe.pl

**Data**: 2026-05-27
**Czas trwania**: ~1h od startu (kod) do live
**Status**: ✅ Live

---

## Co jest live

- **https://www.silnikitrojfazowe.pl/** — strona główna z 6 kalkulatorami
- **https://silnikitrojfazowe.pl/** — 301 → www
- **http://** → 301 → **https://** (na obu)

### Sprawdzone URLs (curl z `--resolve` bypass lokalnego DNS cache)

| URL | Status | Server |
|---|---|---|
| `https://www.silnikitrojfazowe.pl/` | 200 OK | AmazonS3 via CloudFront (WAW51-P5) |
| `https://silnikitrojfazowe.pl/` | 301 → www | AmazonS3 via CloudFront |
| `https://www.silnikitrojfazowe.pl/sitemap-index.xml` | 200 OK | text/xml |
| `https://www.silnikitrojfazowe.pl/sitemap-0.xml` | 200 OK | 8 URLs (noindex'y wyłączone) |
| `https://www.silnikitrojfazowe.pl/robots.txt` | 200 OK | poprawny, Sitemap link |

### CloudFront edge

`X-Amz-Cf-Pop: WAW51-P5` — Warszawa (PriceClass_100 → Europe + North America).

---

## Infrastructure

| Komponent | ID / wartość |
|---|---|
| AWS Account | 381492300277 (`karol-admin`) |
| Region (S3) | `eu-central-1` |
| Region (ACM) | `us-east-1` (wymagane dla CloudFront) |
| Route53 Zone | `Z050839625KEI0N2F7UAP` |
| S3 bucket (www) | `www.silnikitrojfazowe.pl` |
| S3 bucket (naked) | `silnikitrojfazowe.pl` (redirect-all → www) |
| CloudFront www | `E3BR3RW4Z3BIJZ` (`d2qn2g5ff5nnho.cloudfront.net`) |
| CloudFront naked | `E4CXVU8RQ6TS3` (`dpl25rjuenev8.cloudfront.net`) |
| ACM cert | `arn:aws:acm:us-east-1:381492300277:certificate/c545a19d-f87d-4817-83a3-fd63e59176bc` (multi-SAN: www + naked) |
| GitHub repo | https://github.com/LeszczynskiKarol/silnikitrojfazowe-pl (public) |
| IAM deploy role | `arn:aws:iam::381492300277:role/gh-deploy-silnikitrojfazowe-pl` (OIDC, restricted to main branch) |

---

## DNS

- **NS** (po zmianie przez Aftermarket API `/domain/ns/set`):
  - `ns-1272.awsdns-31.org`
  - `ns-647.awsdns-16.net`
  - `ns-375.awsdns-46.com`
  - `ns-1739.awsdns-25.co.uk`
- **MX**: `10 mx1.aftermarket.pl`, `20 mx2.aftermarket.pl` (mail forwarding)
- **A / AAAA** dla `www` → CloudFront `d2qn2g5ff5nnho.cloudfront.net`
- **A / AAAA** dla `silnikitrojfazowe.pl` → CloudFront `dpl25rjuenev8.cloudfront.net`

---

## Analytics

- **GA4 property**: `properties/539285247`
- **Measurement ID**: `G-6MT6R884HQ`
- **Account**: `accounts/17479383` ("Root dla zaplecz z astro generator")
- **Industry**: BUSINESS_AND_INDUSTRIAL_MARKETS
- **TZ**: Europe/Warsaw, currency PLN
- **Consent Mode v2**: defaults DENIED, restore z `localStorage` (`cc_consent_v1`)
- **Cookie banner**: dynamic show jeśli brak zapisanej decyzji, mały `⚙` button do ponownego otwarcia

---

## Pages (8 zaindeksowane + 3 noindex)

| URL | Tytuł |
|---|---|
| `/` | Hub — Kalkulatory inżynierskie do silników trójfazowych |
| `/kalkulator-pradu-silnika-trojfazowego/` | Prąd znamionowy (I = P/√3·U·cos φ·η) |
| `/kalkulator-momentu-obrotowego/` | Moment obrotowy (M = 9550·P/n) |
| `/kalkulator-obrotow-silnika/` | Obroty + liczba biegunów + poślizg |
| `/polaczenie-gwiazda-trojkat/` | Y/Δ auto-wybór z tabliczki + schemat SVG |
| `/dobor-zabezpieczen-silnika/` | MCB B/C/D + bezpiecznik gG/aM + MPCB |
| `/przelicznik-kw-km-hp/` | KM (735.5W) ≠ HP US (745.7W) |
| `/o-projekcie/` | Manifest |
| (noindex) `/kontakt/` | Email-only |
| (noindex) `/polityka-prywatnosci/` | Polityka cookie + brak śledzenia poza GA |
| (noindex) `/404` | Stylizowany 404 |

---

## Verified

- [x] Domena live na CloudFront — 200 OK
- [x] naked → www 301 redirect działa
- [x] http → https redirect na obu
- [x] ACM cert ISSUED (multi-SAN: www + naked)
- [x] CloudFront `Deployed` na obu dystrybucjach
- [x] Sitemap reachable, zawiera 8 URLi (noindex wyłączone)
- [x] robots.txt poprawny, Sitemap link
- [x] GA4 property utworzona + measurement ID wpisany do `src/config/site.ts`
- [x] Consent Mode v2 wpięty w Layout (defaults denied, restore z localStorage)
- [x] OG image PNG 1200×630 wygenerowane przez sharp z SVG
- [x] JSON-LD WebSite + Organization w layoucie
- [x] Public repo + OIDC role + 4 GitHub secrets (AWS_ROLE_ARN, AWS_REGION, S3_BUCKET, CLOUDFRONT_DIST_ID)

---

## Nie zweryfikowane (technical debt)

- [ ] **PageSpeed Insights mobile/desktop scores** — PSI API zwrócił "Quota exceeded for quota metric 'Queries per day'" dla shared key. Sprawdź ręcznie: https://pagespeed.web.dev/?url=https%3A%2F%2Fwww.silnikitrojfazowe.pl
- [ ] **Console errors w real browserze** — screenshot z `--host-resolver-rules` pokazał poprawnie renderowaną stronę i widoczny cookie banner, ale nie testowałem interaktywności kalkulatorów na live (tylko na localhost dev przed deploymentem).
- [ ] **Lokalny DNS cache** — mój Windows cache trzymał stary parking IP 185.253.212.22 jeszcze 30+ min po zmianie NS. Globalnie (8.8.8.8, 1.1.1.1) DNS już CF. Dla Karola: jeśli widzi nginx parking — `ipconfig /flushdns` lub poczekaj do upłynięcia TTL (1h).

---

## 🔔 PAMIĘTAJ — do ogarnięcia ręcznie:

- [ ] **Załóż skrzynkę `kontakt@silnikitrojfazowe.pl`** w panelu Aftermarket (Aftermarket → Twoje domeny → silnikitrojfazowe.pl → Poczta → Dodaj alias, forwarding na `karolleszczynskikorektor@gmail.com`). MX-y już wskazują na `mx1/mx2.aftermarket.pl` — sama skrzynka jeszcze nie istnieje.

- [ ] **Sprawdź PSI ręcznie**: https://pagespeed.web.dev/?url=https%3A%2F%2Fwww.silnikitrojfazowe.pl — jeśli mobile <90 lub desktop <95, popraw konkretne metryki (LCP, CLS, TBT). Astro static + Tailwind 3 + 1 React island na stronę powinien dawać 95+ na desktop bez problemu.

- [x] **Google Search Console** — dodane jako `sc-domain:silnikitrojfazowe.pl`, zweryfikowane DNS_TXT, sitemap submitted (2026-05-27 11:51 UTC, isPending=True czeka na pierwszy crawl Googlebota). SA `google-index-api@…` ma `siteOwner`. **TXT `google-site-verification=ks2La4fhUL...` MUSI ZOSTAĆ w Route53 na zawsze** (GSC robi okresowy re-check własności).

- [x] **seo_panel** — wpis dodany do prod (`panel` VPS) `Domain` (id=`cmc18ab1bfad1defcc422aa5`, category=SATELLITE, linkGroup=MOTORS, linkRole=SATELLITE) + `DomainIntegration` GOOGLE_ANALYTICS (`properties/539285247`, status=ACTIVE).

- [ ] **Anti-PBN follow-up**: nie linkuj z `silniki-elektryczne.com.pl` ani z `silniki-trojfazowe.pl` do tej strony w pierwszych 2-3 miesiącach. Niech zarobi własny autorytet z naturalnych linków (np. wzmianka kalkulatora na elektroda.pl gdy ktoś zada pytanie "jak dobrać silnik"). Jeden cross-link z silnikitrojfazowe.pl → silniki-elektryczne.com.pl jest OK (mam w stopce i o-projekcie), w drugą stronę — pas.

- [ ] **Pusty `D:\silnikitrojfazowe.pl\frontend\` folder** — zostawiony jako lock przez proces (mimo że pusty). Sprawdź po restarcie Windows: `rmdir D:\silnikitrojfazowe.pl\frontend`. Jest w `.gitignore` więc nie commituje się.
