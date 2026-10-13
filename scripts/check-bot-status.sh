#!/usr/bin/env bash
# Curl public pages with crawler UAs and a normal browser UA.
# Usage: scripts/check-bot-status.sh [base-url]
set -euo pipefail

BASE="${1:-http://127.0.0.1:3000}"
PATHS=("/" "/services/web-development" "/about" "/contact" "/services" "/blog")
UAS=(
  "Googlebot/2.1"
  "bingbot"
  "facebookexternalhit/1.1"
  "Instagram 300.0"
  "Twitterbot"
  "LinkedInBot"
  "Slackbot"
  "WhatsApp"
  "Mozilla/5.0"
  "curl/8.0"
)

fail=0
for path in "${PATHS[@]}"; do
  for ua in "${UAS[@]}"; do
    code=$(curl -s -o /dev/null -w "%{http_code}" -A "$ua" "${BASE}${path}")
    printf '%s  %-28s  %s\n' "$code" "$ua" "$path"
    if [[ "$code" != "200" ]]; then
      fail=1
    fi
  done
done

exit "$fail"
