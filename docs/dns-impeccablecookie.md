# impeccablecookie.com: domain and DNS

Captured 2026-10-14 from the authoritative nameserver (`maceio.ns.porkbun.com`), before any change.

## Registration

| | |
|---|---|
| Registrar | Porkbun |
| Expires | 2026-11-03 |
| Auto-renew | on |
| Transfer lock | on |
| WHOIS privacy | on |
| Nameservers | `curitiba`, `fortaleza`, `maceio`, `salvador` `.ns.porkbun.com` |
| Porkbun API access | off for this domain |

## Current zone

| Type | Name | Value |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `ryankolean.github.io` |

Nothing else: no AAAA, MX, TXT, CAA or wildcard records. The domain cannot receive mail.

## GitHub Pages

- Custom domain `impeccablecookie.com`, set by `public/CNAME` and the Pages settings.
- HTTPS certificate covers `impeccablecookie.com` and `www.impeccablecookie.com`. HTTPS is enforced.
- `http://`, `www.` and `ryankolean.github.io/impeccablecookiecompany/` all 301 to `https://impeccablecookie.com/`.

## Planned changes

Not applied yet. Each one needs Ryan's approval.

1. **Email forwarding.** Turn on Porkbun email forwarding for `hello@impeccablecookie.com`. Porkbun adds its MX and SPF records when forwarding is enabled. The footer already links this address.
2. **GitHub domain verification.** Add the `_github-pages-challenge-ryankolean` TXT record that GitHub shows under Settings > Pages > Verified domains. This stops any other GitHub account from claiming the domain.
3. **IPv6 (optional).** AAAA records on `@` for `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`.

Never remove the four A records or the `www` CNAME.
