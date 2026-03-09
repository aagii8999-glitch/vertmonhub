---
description: After every code change, update README.md and clean unnecessary files
---
# README & Project Cleanup Maintenance

// turbo-all

This workflow ensures the README and project stay clean after every code change.

## When to Run
- After adding/removing files or directories
- After changing tech stack, models, features
- After modifying database schema (migrations)
- After adding/removing API routes or pages
- After changing project structure

## Steps

### 1. Check for Unnecessary Files
Scan root directory for files that should not exist:
```bash
ls -la *.md *.sh *.ts *.js *.zip *.bak 2>/dev/null | grep -v README.md | grep -v package.json | grep -v next.config
```

Files to always remove:
- Debug scripts (debug-*.ts, debug-*.js, check-*.ts)
- Daily logs (daily_log_*.md)
- Old proposals/intros that are no longer relevant
- `.bak` files in supabase/migrations/
- Frontend zip packages
- Screenshot directories that are not actively used

### 2. Check for Backup Files in Migrations
```bash
find supabase/migrations -name "*.bak" -o -name "*.old" -o -name "*.backup"
```
Remove any found backup files.

### 3. Update README.md

Check these sections match reality:

#### a. Feature List
- Does the feature list match implemented features?
- Are module counts correct? (count: `ls src/app/dashboard/ | wc -l`)
- Are API route counts correct? (count: `ls src/app/api/ | wc -l`)

#### b. Tech Stack
- Run `cat package.json | grep -E '"(next|react|typescript|@supabase|tailwindcss|@tanstack|recharts|@sentry)"'` to get actual versions

#### c. Project Structure Tree
- Does the tree match current `src/` structure?
- Are migration counts correct? (`ls supabase/migrations/*.sql | wc -l`)
- Are component counts correct? (`find src/components -name "*.tsx" | wc -l`)

#### d. Database Tables
- Check if tables match: `ls supabase/migrations/ | tail -5` for recent additions
- Ensure new tables are listed, removed tables are gone

#### e. AI Configuration
- Check model: `grep "model:" src/lib/ai/config/plans.ts`
- Check enabled tools: `grep "enabledTools" src/lib/ai/config/plans.ts`

#### f. RBAC Roles
- Check roles: `grep "role" src/lib/rbac.ts | head -5`
- Ensure the role table matches `src/lib/rbac.ts`

#### g. Environment Variables
- Compare with actual `.env.local.example` or running config

### 4. Verify No Secrets in Tracked Files
```bash
grep -r "sk-\|key_\|token_\|secret_" --include="*.ts" --include="*.tsx" --include="*.md" --include="*.sh" . | grep -v node_modules | grep -v ".env"
```
If any are found, remove them immediately.

### 5. TypeCheck
```bash
npx tsc --noEmit
```
Ensure 0 errors after cleanup.
