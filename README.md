# NPCAT! — site

Static site for **$NPCAT**, the Non-Playable Cat on Solana (launched on StonkFun, paired with $NPC). No build step.

- Domain: https://npcat.cat/ (static hosting, custom domain)
- Stack: HTML + CSS + vanilla JS. GSAP 3.15 (ScrollTrigger) from cdnjs, matter.js 0.20 from cdnjs on the 404 page only. Fonts self-hosted in `assets/fonts/` (Unbounded, Geist, Geist Mono; OFL, latin subsets from Google Fonts).
- Hero: `js/main.js` samples `assets/img/cat.png` into 10,000 particles (4,200 on phones) and morphs them through four pinned scroll chapters. It pauses when off-screen and honours `prefers-reduced-motion`.

## Deploy

GitHub Pages serves the `main` branch root. Push to `main` and it redeploys in about a minute.

```bash
git push origin main
```

### Custom domain (npcat.cat)

1. Register `npcat.cat` (Porkbun or Cloudflare Registrar; WHOIS privacy is included).
2. At the registrar, add DNS records:
   - `A` records for `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - four `A` records for `www` with the same four IPs (no CNAME, so the DNS never names the hosting account)
3. Add a file named `CNAME` at the repo root containing exactly `npcat.cat` and push (or set the custom domain in Settings › Pages, which creates it). Wait for the DNS check to pass, then tick **Enforce HTTPS**. 

## Things to fill in at launch

| What | Where |
|---|---|
| Contract address | `index.html` → `#ca` (replace `TBA`), and the hidden `button[data-copy]` next to it (set `data-copy` to the address and remove `hidden`) |
| Supply | `index.html` → the `SUPPLY` fact |
| StonkFun token page | `index.html` → every `href="#buy"` on a “Buy on StonkFun” button, plus the “StonkFun page” button in the community block (remove `data-soon`) |
| Telegram | `index.html` → the “Telegram” button (remove `data-soon`) |
| Rewards numbers | `index.html` → `#questLead`, the quest log rows and the FAQ answer; quote StonkFun's token page only |
| OG image | `assets/img/og.png` (1200×630). Regenerate if the wordmark or tagline changes |

## Claims policy

The page only states what is verifiable on StonkFun or on-chain (chain, launchpad, quote asset, contract, supply). “Hold $NPCAT, get $NPC” is worded as the mechanic StonkFun provides; publish the exact share and schedule from the token page, never a projection. No roadmap, no utility, no promises, and the “not affiliated” line stays.
