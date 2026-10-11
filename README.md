# playwright-automation

Web test automation with [Playwright](https://playwright.dev) and TypeScript, using the Page Object Model.

## Requirements

- Node.js 20+
- npm

## Setup

```bash
npm ci
npx playwright install --with-deps chromium
cp .env.example .env
```

Edit `.env` and set `BASE_URL` to the app under test. It defaults to `https://playwright.dev`.

## Run tests

```bash
npm test                                   # all tests
npx playwright test tests/home.spec.ts     # one file
npx playwright test -g "Home_001"          # by test title
npm run test:ui                            # interactive UI mode
npm run report                             # open the last HTML report
npm run typecheck                          # TypeScript check
```

## Project structure

```
tests/        test specs (*.spec.ts), calling Page methods only
pages/        Page classes, one per screen
locators/     locator constants, no actions
fixtures/     custom fixtures that provide Page objects to tests
utils/        shared helpers
playwright.config.ts   base URL, retries, reporters
```

Flow: `test -> Page method -> locator`. Tests contain no selectors, and Pages contain no selector strings.

## Adding a test

1. Add locators to `locators/<Name>Locators.ts`.
2. Add actions and `verify*()` methods to `pages/<Name>Page.ts`.
3. Register the Page in `fixtures/index.ts`.
4. Write the spec in `tests/`, one `test.step("STEP XX: ...")` per step. Name tests `Feature_001_Description`.
5. Run `npm run typecheck` and the new test before committing.

## Reports and debugging

- The HTML report is written to `playwright-report/`.
- Traces are recorded on the first retry and screenshots on failure, both in `test-results/`.
- Debug a single test with `npx playwright test --debug`.

## Conventions

See [CLAUDE.md](CLAUDE.md) for the full coding rules, flake-handling guidance and commit conventions.
