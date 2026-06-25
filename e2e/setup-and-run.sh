#!/bin/bash
set -e

E2E_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$E2E_DIR/.."

# Seed e2e database
MONGO_URI="mongodb://localhost:27017/gericht_e2e" \
DB_NAME="gericht_e2e" \
AUTH_SECRET="e2e-test-secret" \
npx tsx "$E2E_DIR/global-setup.ts"

# Start dev server with e2e env vars
MONGO_URI="mongodb://localhost:27017/gericht_e2e" \
DB_NAME="gericht_e2e" \
AUTH_SECRET="e2e-test-secret-do-not-use-in-prod" \
AUTH_URL="http://localhost:3000" \
NEXT_PUBLIC_BASE_URL="http://localhost:3000" \
TZ="America/Caracas" \
npm run dev &
DEV_PID=$!

echo "Waiting for dev server..."
for i in $(seq 1 30); do
  if curl -s -o /dev/null http://localhost:3000/login 2>/dev/null; then
    echo "Dev server ready"
    break
  fi
  sleep 1
done

# Run playwright tests
cd "$ROOT"
npx playwright test --reporter=list "$@"
TEST_EXIT=$?

# Cleanup
kill $DEV_PID 2>/dev/null
wait $DEV_PID 2>/dev/null
npx tsx "$E2E_DIR/global-teardown.ts"

exit $TEST_EXIT
