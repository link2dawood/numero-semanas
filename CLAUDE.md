# CLAUDE.md - NumeroSemanas Project

## Project Overview
Spanish ISO 8601 week number reference website (numerosemanas.es). Built with Next.js 15, React 19, and Tailwind CSS 4.

## Tech Stack
- **Framework:** Next.js 15.5.x (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **PDF Generation:** @react-pdf/renderer
- **Node Version:** 22.x

## Project Structure
```
src/
├── app/           # Next.js App Router pages and API routes
│   ├── api/pdf/   # PDF generation endpoints
│   └── ...        # Page routes
├── components/    # React components
├── lib/           # Utility functions, week calculations
└── middleware.ts  # URL redirects and normalization
```

## Key Files
- `src/lib/week-calendar.ts` - ISO week calculations
- `src/lib/weeks.ts` - Date formatting (Spanish)
- `src/app/api/pdf/semanas-2027/route.ts` - PDF generation for 2027 weeks

## Development Commands
```bash
npm run dev      # Start dev server (port 3000)
npm run build    # Production build
npm run lint     # ESLint check
npm run test     # Run Vitest tests
```

## Important Notes
- Directory has trailing space: `/home/dawood/Desktop/NumeroSemanas /`
- Dev build: `.next/` | Production build: `.next-production/`
- All dates displayed in Spanish locale
- ISO 8601 standard: Week 1 contains the first Thursday of the year

---

## Git & GitHub Rules (CRITICAL)

### NEVER do these without explicit user permission:
- `git push` - Never push to remote
- `git commit` - Never commit changes
- `git branch -D` - Never delete branches
- `git reset --hard` - Never reset commits
- `git rebase` - Never rebase
- `git merge` - Never merge branches
- `git stash drop` - Never drop stashes
- `git clean -f` - Never force clean
- `gh pr merge` - Never merge PRs
- `gh repo delete` - Never delete repos
- Any destructive git operation

### Only allowed when user explicitly asks:
- Creating commits (user must say "commit")
- Pushing to remote (user must say "push")
- Creating PRs (user must say "create PR")
- Creating branches (user must say "create branch")

### Always allowed (read-only):
- `git status`
- `git log`
- `git diff`
- `git branch` (list only)
- `gh pr list`
- `gh issue list`

---

## File Safety Rules

### NEVER delete:
- Any file in the repository without explicit permission
- `.git/` directory or any git history
- `node_modules/` (use npm commands instead)
- Environment files (`.env`, `.env.local`)
- Build outputs unless rebuilding

### Before modifying files:
- Read the file first if not already in context
- Prefer `Edit` over `Write` for existing files
- Keep backups of critical config files in memory

---

## Code Style
- Use TypeScript strict mode
- Spanish text for user-facing content
- English for code comments and variable names
- ISO 8601 date format internally
- Display dates in Spanish format (e.g., "4 de enero de 2027")

## Memory Management

### Memory Location
`~/.claude/projects/-home-dawood-Desktop-NumeroSemanas-/memory/MEMORY.md`

### What to Remember
- User preferences and workflow habits
- Project-specific decisions made during conversations
- Bug fixes and their solutions (for future reference)
- API endpoints and their purposes
- Deployment configurations and hosting details

### When to Update Memory
- After learning new user preferences
- After significant project changes (new features, refactors)
- After resolving complex bugs (save the solution)
- When user says "remember this" or similar

### Memory Format
```markdown
## Category Name
- Key fact or preference
- Another related item
```

### Do NOT Store in Memory
- Temporary debugging info
- One-time requests
- Sensitive data (API keys, passwords)
- Information already in CLAUDE.md

---

## PDF Design Standards
- Colors: forest (#354628), olive (#667A4A), sage (#A9B58E), cream (#F7F4E9)
- Font: Helvetica (PDF) / System fonts (web)
- Layout: A4 landscape for printable lists
- Always include numerosemanas.es branding and ISO 8601 reference
