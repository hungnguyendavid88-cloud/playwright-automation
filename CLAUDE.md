# CLAUDE.md

## What this is
Playwright + TypeScript test automation for [PROJECT NAME] ([web app / API]).
Page Object Model, built bottom-up: locator -> Page method -> flow helper -> test step.
Node 20+, `@playwright/test`, HTML report.

## Commands
```bash
npm ci                                  # install
npx playwright install --with-deps      # browsers (once)
npx playwright test                     # all tests
npx playwright test tests/home.spec.ts  # one file
npx playwright test -g "Home_001"       # by title
npx playwright test --project=chromium  # one browser
npx playwright test --ui                # UI mode
npx playwright test --debug             # inspector
npx playwright show-report              # open last HTML report
npx playwright codegen [BASE_URL]       # record locators
npm run typecheck                       # must pass before commit
```

## Structure
```
tests/          *.spec.ts, one feature per file, tests call Page methods only
pages/          *Page.ts classes, one per screen, wrap a Playwright `Page`
locators/       *Locators.ts, locator constants only (no actions)
fixtures/       custom test.extend fixtures (pages, auth, test data)
utils/          helpers: api clients, data factories, env loading
playwright.config.ts   projects, baseURL, retries, reporters
.env            secrets and credentials (gitignored; see .env.example)
playwright-report/, test-results/   generated, never edit or commit
```

## Hard rules
- No raw selectors in tests; tests call Page methods only.
- No selector strings in Page methods; use `locators/*`.
- Locator priority: `getByRole` > `getByLabel` / `getByText` > `getByTestId` > CSS. XPath is a last resort.
- Never `waitForTimeout` / fixed sleeps. Use web-first assertions (`expect(locator).toBeVisible()`), which auto-wait.
- Use `expect.soft` for non-blocking checks inside Page `verify*()` methods. Plain `expect` only when the test must stop.
- Verification lives in Page `verify*()` methods and compares real values (text, count), not `true` vs `true`.
- Tests are independent: no ordering, no shared state. Log in through a fixture or saved `storageState`, not through the UI in every test.
- Credentials and URLs come from `.env`, never hard-coded.
- One `test.step("STEP XX: ...")` per manual-case step, worded like the manual case.
- Test names: `Feature_001_Description`.

## Flake handling
- Retries only in CI (`retries: 2`), 0 locally.
- On failure, check trace and screenshot first (`trace: 'on-first-retry'`) before touching code.
- Do not hide a flake with a longer timeout. Find the missing condition and wait on it.

## Workflow for new tests
1. Read the manual case or ticket. Copy the STEP text verbatim.
2. Check `pages/` for existing methods and reuse them before writing new ones.
3. Capture missing locators with `codegen` or the Playwright MCP, then add them to `locators/`.
4. Add Page methods, then the spec. Run it 3 times (`--repeat-each=3`) to catch flakes.
5. `npm run typecheck`, then commit.

## Before committing
1. Typecheck passes.
2. `git status`: nothing from `playwright-report/`, `test-results/`, `.env`, `node_modules/`.
3. Commit prefix: `PageName: what changed`, or `chore:` / `fix:` / `feat:` for tooling.
