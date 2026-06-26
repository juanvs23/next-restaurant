#!/bin/bash
set -e

BASE="http://localhost:3000"
PASS=0
FAIL=0
TS=$(date +%s)

green() { echo -e "\e[32m  ✅ $1\e[0m"; }
red() { echo -e "\e[31m  ❌ $1\e[0m"; }
bold() { echo -e "\e[1m$1\e[0m"; }

assert() {
  local label="$1" method="$2" url="$3" expected="$4" data="${5:-}"
  local args=(-s -o /dev/null -w "%{http_code}" -X "$method")
  if [ -n "$data" ]; then args+=(-H "Content-Type: application/json" -d "$data"); fi
  local code
  code=$(curl "${args[@]}" "$url")
  if [ "$code" = "$expected" ]; then
    green "$label → $code"
    PASS=$((PASS+1))
  else
    red "$label → $code (esperaba $expected)"
    FAIL=$((FAIL+1))
  fi
}

bold "━━━━━ 1. Rutas públicas ━━━━━"
echo ""
assert "GET /api/auth/session" GET "$BASE/api/auth/session" 200
assert "GET /api/frontend/config" GET "$BASE/api/frontend/config" 200
assert "GET /api/frontend/availability" GET "$BASE/api/frontend/availability?date=2026-12-25" 200
echo ""

bold "━━━━━ 2. Frontend API (públicas) ━━━━━"
echo ""
assert "POST /api/frontend/users (registro)" POST "$BASE/api/frontend/users" 201 '{"name":"TestF'"$TS"'","email":"testf'"$TS"'@test.com","password":"test123"}'
echo ""

bold "━━━━━ 3. Backoffice API sin auth ── todas 401 ━━━━━"
echo ""
assert "GET /api/backoffice/products" GET "$BASE/api/backoffice/products" 401
assert "GET /api/backoffice/users" GET "$BASE/api/backoffice/users" 401
assert "GET /api/backoffice/orders" GET "$BASE/api/backoffice/orders" 401
assert "GET /api/backoffice/categories" GET "$BASE/api/backoffice/categories" 401
assert "GET /api/backoffice/config" GET "$BASE/api/backoffice/config" 401
assert "GET /api/backoffice/tables" GET "$BASE/api/backoffice/tables" 401
assert "GET /api/backoffice/bookings" GET "$BASE/api/backoffice/bookings" 401
assert "GET /api/backoffice/taxes" GET "$BASE/api/backoffice/taxes" 401
assert "GET /api/backoffice/charges" GET "$BASE/api/backoffice/charges" 401
assert "GET /api/backoffice/payment-methods" GET "$BASE/api/backoffice/payment-methods" 401
assert "GET /api/backoffice/turns" GET "$BASE/api/backoffice/turns" 401
assert "GET /api/backoffice/comandas" GET "$BASE/api/backoffice/comandas" 401
assert "GET /api/backoffice/pedidos" GET "$BASE/api/backoffice/pedidos" 401
assert "GET /api/backoffice/credit-notes" GET "$BASE/api/backoffice/credit-notes" 401
assert "GET /api/backoffice/reports" GET "$BASE/api/backoffice/reports" 401
assert "POST /api/backoffice/seed" POST "$BASE/api/backoffice/seed" 401
assert "POST /api/backoffice/products" POST "$BASE/api/backoffice/products" 401 '{"name":"X","price":10}'
assert "DELETE /api/backoffice/media/fake" DELETE "$BASE/api/backoffice/media/fake" 401
assert "PUT /api/backoffice/users/fake" PUT "$BASE/api/backoffice/users/fake" 401
echo ""

bold "━━━━━ 4. Dashboard sin auth ── redirect ━━━━━"
echo ""
for path in products categories users tables turns config media bookings comanda orders reports credit-notes; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/dashboard/$path")
  if [ "$code" = "302" ] || [ "$code" = "307" ] || [ "$code" = "200" ]; then
    green "GET /dashboard/$path → $code (login)"
    PASS=$((PASS+1))
  else
    red "GET /dashboard/$path → $code (esperaba 302/200)"
    FAIL=$((FAIL+1))
  fi
done

echo ""
bold "═══════════════════════════════════════"
total=$((PASS+FAIL))
bold "  $PASS / $total pasaron"
if [ "$FAIL" -gt 0 ]; then
  red "  $FAIL fallaron"
  exit 1
else
  green "  Todos pasaron ✅"
  exit 0
fi
