# impeccablecookie.com: domain and DNS

## Registration

| | |
|---|---|
| Registrar | Porkbun |
| Expires | 2026-11-03 |
| Auto-renew | on |
| Transfer lock | on |
| WHOIS privacy | on |
| Nameservers | `curitiba`, `fortaleza`, `maceio`, `salvador` `.ns.porkbun.com` |
| Porkbun API access | off for this domain (changes are made in the Porkbun dashboard) |

## Zone before changes (captured 2026-10-14)

| Type | Name | Value |
|---|---|---|
| A | `@` | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` |
| CNAME | `www` | `ryankolean.github.io` |
| TXT | `_acme-challenge` | two leftover values from an old certificate attempt (unused; GitHub Pages issues certificates over HTTP) |

There were no MX records, so the domain could not receive mail.

## Records added 2026-10-14

| Type | Name | Value | Purpose |
|---|---|---|---|
| MX 10 | `@` | `fwd1.porkbun.com` | Porkbun email forwarding |
| MX 20 | `@` | `fwd2.porkbun.com` | Porkbun email forwarding |
| TXT | `@` | `v=spf1 include:_spf.porkbun.com ~all` | SPF for forwarded mail |
| TXT | `_github-pages-challenge-ryankolean` | GitHub verification code | Domain verified on the GitHub account, so no other account can claim it |
| AAAA | `@` | `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153` | GitHub Pages over IPv6 |

Never remove the A, AAAA or `www` records, the MX/SPF records, or the GitHub verification TXT record.

## Email forwarding

Porkbun forwards `hello@`, `info@` and `inquiry@impeccablecookie.com`. Forwarding targets are managed in Porkbun under Email Hosting and Forwarding. The site footer links `hello@`.

## GitHub Pages

- Custom domain `impeccablecookie.com`, set by `public/CNAME` and the Pages settings. The domain is verified on the account.
- HTTPS certificate covers `impeccablecookie.com` and `www.impeccablecookie.com`. HTTPS is enforced.
- `http://`, `www.` and `ryankolean.github.io/impeccablecookiecompany/` all 301 to `https://impeccablecookie.com/`.
