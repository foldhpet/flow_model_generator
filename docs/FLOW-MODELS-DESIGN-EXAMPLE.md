# Comp Login Flow Models - User Flow Diagrams

## Flow 1: Complete Comp SSO Login with MFA (for 'open Comp base page and retrieve page title')

```
┌─────────────────────────────────────────────────────────────────────┐
│                    COMPANY SSO LOGIN FLOW                           │
└─────────────────────────────────────────────────────────────────────┘

    START
      │
      ▼
  ┌──────────────────────┐
  │ Navigate to Login    │
  │ Page (compBaseURL)   │
  └──────────────────────┘
      │
      ▼
  ┌──────────────────────┐
  │ Verify Login Page    │
  │ Loaded               │
  └──────────────────────┘
      │
      ▼
  ┌──────────────────────┐
  │ Enter Username       │
  │ Uncheck "Remember    │
  │ Me" checkbox         │
  └──────────────────────┘
      │
      ▼
  ┌──────────────────────┐
  │ Click "Log In"       │
  │ (Username Submit)    │
  └──────────────────────┘
      │
      ▼
  ┌──────────────────────┐
  │ Wait for Password    │
  │ Field to Appear      │
  └──────────────────────┘
      │
      ▼
  ┌──────────────────────┐
  │ Enter Password       │
  └──────────────────────┘
      │
      ▼
  ┌──────────────────────┐
  │ Click "Log In"       │
  │ (Password Submit)    │
  └──────────────────────┘
      │
      ▼
  ╔══════════════════════╗
  ║ DELEGATE TO MFA FLOW ║  ◄─── Enters MFA Flow
  ╚══════════════════════╝
      │
      ▼
  ┌──────────────────────┐
  │ MFA Flow Complete    │
  │ (User logged in)     │
  └──────────────────────┘
      │
      ▼
    END


═══════════════════════════════════════════════════════════════════════


## Flow 2: MFA Verification Flow (Sub-flow, used by Flow 1)

```
┌─────────────────────────────────────────────────────────────────────┐
│                   MFA VERIFICATION FLOW                             │
└─────────────────────────────────────────────────────────────────────┘

    START (Called from Comp SSO Login Flow)
      │
      ▼
  ┌──────────────────────┐
  │ Wait for MFA Page    │
  │ ("Verify Your        │
  │  Identity")          │
  └──────────────────────┘
      │
      ▼
  ╔══════════════════════════════════════════╗
  ║ OPEN EMAIL TAB                           ║
  ║ (Create new context with email auth)     ║
  ╚══════════════════════════════════════════╝
      │
      ▼
  ┌──────────────────────┐
  │ Navigate to Email    │
  │ Service (emailURL)   │
  └──────────────────────┘
      │
      ▼
  ┌──────────────────────┐
  │ Retrieve             │
  │ Verification Code    │
  │ from Email           │
  └──────────────────────┘
      │
      ▼
  ┌──────────────────────┐
  │ Close Email Context  │
  └──────────────────────┘
      │
      ▼
  ┌──────────────────────┐
  │ Switch Back to       │
  │ Salesforce Tab       │
  └──────────────────────┘
      │
      ▼
  ┌──────────────────────┐
  │ Wait for MFA Page    │
  │ to Stabilize         │
  └──────────────────────┘
      │
      ▼
  ┌──────────────────────┐
  │ Enter Verification   │
  │ Code                 │
  └──────────────────────┘
      │
      ▼
  ┌──────────────────────┐
  │ Uncheck "Don't Ask   │
  │ Again" Checkbox      │
  └──────────────────────┘
      │
      ▼
  ┌──────────────────────┐
  │ Click "Verify"       │
  │ Button               │
  └──────────────────────┘
      │
      ▼
  ┌──────────────────────┐
  │ Validate Successful  │
  │ Login                │
  │ (Check URL)          │
  └──────────────────────┘
      │
      ▼
    END (Return to caller)


═══════════════════════════════════════════════════════════════════════


## Flow 3: Pre-Authenticated Salesforce Access
### (for 'use saved auth state to access Salesforce already logged in', and reused by the `authenticated-base-test.ts` fixture)

```
┌─────────────────────────────────────────────────────────────────────┐
│              AUTHENTICATED SALESFORCE ACCESS FLOW                   │
│              (Using saved salesforce-auth-state.json)               │
└─────────────────────────────────────────────────────────────────────┘

    START
      │
      ▼
  ┌──────────────────────┐
  │ Load Saved Auth      │
  │ State from File      │
  │ (salesforce-auth-    │
  │  state.json)         │
  └──────────────────────┘
      │
      ▼
  ┌──────────────────────┐
  │ Add Cookies to       │
  │ Context              │
  └──────────────────────┘
      │
      ▼
  ┌──────────────────────┐
  │ Restore localStorage │
  │ & sessionStorage     │
  │ (if present)         │
  └──────────────────────┘
      │
      ▼
  ┌──────────────────────┐
  │ Navigate to Base URL │
  │ (demoEnv.            │
  │  baseURL)            │
  └──────────────────────┘
      │
      ▼
  ┌──────────────────────┐
  │ Wait for Page to     │
  │ Load (domcontented)  │
  └──────────────────────┘
      │
      ▼
  ┌──────────────────────┐
  │ Check Current URL    │
  │ (should NOT be       │
  │  login page)         │
  └──────────────────────┘
      │
      ├─ YES: Not on login page ──┐
      │                           │
      │                           ▼
      │                   ┌──────────────────────┐
      │                   │ ✓ User Logged In     │
      │                   └──────────────────────┘
      │                           │
      └─ NO: On login page ───────┤
          (auth expired)           │
          FAIL TEST ◄──────────────┘
      │
      ▼
  ┌──────────────────────┐
  │ Wait for Salesforce  │
  │ Body Element         │
  └──────────────────────┘
      │
      ▼
  ┌──────────────────────┐
  │ Validate Logged-In   │
  │ State                │
  │ (look for app        │
  │  launcher, etc.)     │
  └──────────────────────┘
      │
      ▼
    END
```


═══════════════════════════════════════════════════════════════════════


## Flow 3b: Fixture-Driven Authentication (automatic `beforeEach`, reuses Flow 3)

`tests/salesforce-poc-authenticated.spec.ts` never calls an auth flow itself — it imports
`test`/`expect` from `business/authenticated-base-test.ts`, whose `beforeEach` hook
runs Flow 3 (`AuthenticatedSalesforceAccessFlow.accessWithSavedState`) before every test in
the file. This keeps the two callers of Flow 3 (a test that calls it explicitly, and a
fixture that calls it implicitly) on a single implementation instead of duplicating the
cookie/localStorage-restore logic.

```
┌─────────────────────────────────────────────────────────────────────┐
│         AUTHENTICATED-BASE-TEST FIXTURE (beforeEach hook)           │
│         business/authenticated-base-test.ts                         │
└─────────────────────────────────────────────────────────────────────┘

    START (runs before every test in the .spec.ts file below)
      │
      ▼
  ┌──────────────────────────────┐
  │ new AuthenticatedSalesforce- │
  │ AccessFlow(page, context,    │
  │ demoEnv.baseURL)             │
  └──────────────────────────────┘
      │
      ▼
  ╔══════════════════════════════════════════╗
  ║ DELEGATE TO FLOW 3                       ║  ◄─── accessWithSavedState(authStatePath)
  ║ (Load State → Cookies → Storage →        ║        i.e. the exact same steps as
  ║  Navigate → Validate/Refresh)            ║        Flow 3 above
  ╚══════════════════════════════════════════╝
      │
      ▼
  ┌──────────────────────────────┐
  │ Test body runs with an       │
  │ already-authenticated page   │
  └──────────────────────────────┘
      │
      ▼
    END (control returns to the test)

Used by (both tests in tests/salesforce-poc-authenticated.spec.ts):
  - 'access Quote Advanced Reporting page with saved auth state'
  - 'navigate to Quote Advanced Reporting page via search'
```


═══════════════════════════════════════════════════════════════════════

## Summary of Flow Models to Create

### 1. **CompLoginFlow** (business/flows/salesforce-login.flow.ts)
   - `loginWithSSO(username: string, password: string): Promise<void>`
   - Orchestrates: Navigate → Enter Credentials → MFA Flow
   - Used by: Test 1 ('open Comp base page and retrieve page title')

### 2. **MFAVerificationFlow** (business/flows/mfa-verification.flow.ts)
   - `verifyWithEmail(): Promise<void>`
   - Orchestrates: Wait for MFA Page → Open Email → Get Code → Verify
   - Used by: CompLoginFlow (sub-flow)

### 3. **AuthenticatedSalesforceAccessFlow** (business/flows/authenticated-salesforce-access.flow.ts)
   - `accessWithSavedState(authStatePath: string): Promise<void>`
   - Orchestrates: Load State → Restore Cookies/Storage → Navigate → Validate
   - Used by:
     - Test 2 ('use saved auth state to access Salesforce already logged in') in `tests/salesforce-poc.spec.ts` — calls it directly
     - `business/authenticated-base-test.ts` `beforeEach` fixture (Flow 3b) — calls it automatically for every test in `tests/salesforce-poc-authenticated.spec.ts`

### 4. **QuoteAdvancedReportingFlow** (business/flows/quote-advanced-reporting.flow.ts)
   - `ClickSearchBar(): Promise<void>` - Click the global search bar
   - `SearchForQuote(searchTerm: string): Promise<void>` - Type search term into search input
   - `SelectSearchResult(searchTerm: string): Promise<void>` - Click the matching search result
   - `AccessQuoteAdvancedReporting(searchTerm?: string): Promise<void>` - Orchestrate: Click Search Bar → Search For Quote → Select Search Result (defaults to `'Quote - Advanced Reporting'`)
   - `ClickDraftTab(): Promise<void>` - Click the Draft tab
   - `VerifyDraftTabInFocus(): Promise<void>` - Assert `aria-current`/`aria-selected` on the Draft tab
   - `ClickNeedsReviewTab(): Promise<void>` - Click the Needs Review tab
   - `ClickInReviewTab(): Promise<void>` - Click the In Review tab
   - `ClickApprovedTab(): Promise<void>` - Click the Approved tab
   - `ClickPresentedTab(): Promise<void>` - Click the Presented tab
   - `ClickAcceptedTab(): Promise<void>` - Click the Accepted tab
   - `ClickMarkStatusButton(): Promise<void>` - Click "Mark Status as Complete" / "Mark as Current Status"
   - `NavigateThroughAllQuoteFlowTabs(): Promise<void>` - Orchestrate: cycle Draft → Needs Review → In Review → Approved → Presented → Accepted → back to Draft, marking status at each tab
   - `ClickEditButton(): Promise<void>` - Click the Edit Products action on the Draft tab
   - `WaitForEditModal(): Promise<void>` - Wait for the SLDS edit modal to appear
   - `EditSalesPrice(newPrice: string): Promise<void>` - Open the inline cell editor and type a new Sales Price
   - `SaveEditModal(): Promise<void>` - Click Save and wait for the modal to close
   - `NavigateThroughAllQuoteFlowTabsWithEdit(salesPrice?: string): Promise<void>` - Same tab cycle as `NavigateThroughAllQuoteFlowTabs()`, but on the Draft tab it also edits and saves the Sales Price first (defaults to `'1337'`)
   - Used by (all four tests in `tests/salesforce-poc-authenticated.spec.ts`, run against an already-authenticated page via Flow 3b):
     - 'access Quote Advanced Reporting page with saved auth state' — calls `AccessQuoteAdvancedReporting()`
     - 'navigate to Quote Advanced Reporting page via search' — calls `AccessQuoteAdvancedReporting('Quote - Advanced Reporting')` then `NavigateThroughAllQuoteFlowTabs()`
     - 'navigate to Quote Advanced Reporting page via search and edit Sales Price' — calls `AccessQuoteAdvancedReporting('Quote - Advanced Reporting')` then `NavigateThroughAllQuoteFlowTabsWithEdit()` (default price `'1337'`)
     - 'navigate to Quote Advanced Reporting page via search and edit Sales Price with value from mocked app' — calls `AccessQuoteAdvancedReporting('Quote - Advanced Reporting')` then `NavigateThroughAllQuoteFlowTabsWithEdit(salesPrice)` with a price retrieved from `MockedAppQuoteFlow.RetrieveSalesPriceFromApi()` (see item 5 below)
   - Reused as-is for `tests/salesforce-poc-authenticated.spec.ts` — no changes were needed to this flow or to `business/pages/quote-page.ts`.

═══════════════════════════════════════════════════════════════════════

## Test Refactoring Plan

### Test 1: 'open Comp base page and retrieve page title'
```
BEFORE:
  - 100+ lines of inline login/MFA logic

AFTER:
  const loginFlow = new CompLoginFlow(page, context, browser);
  await loginFlow.loginWithSSO(username, password);
  expect(pageState).toBe(loggedIn);
```

### Test 2: 'use saved auth state to access Salesforce already logged in'
```
BEFORE:
  - 50+ lines of manual auth state handling

AFTER:
  const accessFlow = new AuthenticatedSalesforceAccessFlow(page, context);
  await accessFlow.accessWithSavedState('config/salesforce-auth-state.json');
  expect(pageState).toBe(loggedIn);
```

═══════════════════════════════════════════════════════════════════════

## Flow 4: Quote Advanced Reporting Flow
### (for both tests in `tests/salesforce-poc-authenticated.spec.ts`)

```
┌─────────────────────────────────────────────────────────────────────┐
│              QUOTE ADVANCED REPORTING FLOW                           │
│              (Search for Quote → Navigate Flow Tabs)                 │
└─────────────────────────────────────────────────────────────────────┘

    START (User is already authenticated — see Flow 3b, runs via
           the authenticated-base-test.ts beforeEach hook)
      │
      ▼
  ┌──────────────────────┐
  │ Click Search Bar     │
  │ (aria-label=Search)  │
  └──────────────────────┘
      │
      ▼
  ┌──────────────────────┐
  │ Type Search Term:    │
  │ "Quote - Advanced    │
  │ Reporting"           │
  └──────────────────────┘
      │
      ▼
  ┌──────────────────────┐
  │ Wait for Search      │
  │ Results              │
  └──────────────────────┘
      │
      ▼
  ┌──────────────────────┐
  │ Click Search Result  │
  │ (first match)        │
  └──────────────────────┘
      │
      ▼
  ┌──────────────────────┐
  │ Wait for Page Load   │
  └──────────────────────┘
      │
      ▼
  ┌──────────────────────┐
  │ Verify Quote Page    │
  │ Loaded               │
  │ (URL not login page) │
  └──────────────────────┘
      │
      ├─ Test 'access Quote Advanced Reporting page with saved auth
      │  state' STOPS HERE (just asserts not on login page)
      │
      ▼
  ╔══════════════════════════════════════════╗
  ║ NAVIGATE THROUGH QUOTE FLOW TABS          ║
  ║ (test 'navigate to Quote Advanced         ║
  ║  Reporting page via search' continues     ║
  ║  here with NO edit; the two edit-related  ║
  ║  tests branch into Flow 4b instead)       ║
  ╚══════════════════════════════════════════╝
      │
      ├─ Click Draft Tab ──────┐
      │                        │
      ├─ Verify Focus ─────────┼─► aria-current="true"
      │                        │   aria-selected="true"
      │
      ├─ Click Needs Review Tab
      │
      ├─ Click In Review Tab
      │
      ├─ Click Approved Tab
      │
      ├─ Click Presented Tab
      │
      ├─ Click Accepted Tab
      │
      ▼
  ┌──────────────────────┐
  │ Verify Still         │
  │ Authenticated        │
  │ (URL not login page) │
  └──────────────────────┘
      │
      ▼
    END
```

═══════════════════════════════════════════════════════════════════════

## Flow 4b: Quote Flow Tabs with Sales Price Edit
### (for 'navigate ... and edit Sales Price' and 'navigate ... and edit Sales Price with value from mocked app' in `tests/salesforce-poc-authenticated.spec.ts`)

`NavigateThroughAllQuoteFlowTabsWithEdit()` is the same tab-cycling orchestration as Flow 4's
`NavigateThroughAllQuoteFlowTabs()`, but once on the Draft tab it edits and saves the Sales
Price via the Edit Products modal before marking status and moving on. It branches off Flow 4
at the same point (right after `AccessQuoteAdvancedReporting()`).

```
┌─────────────────────────────────────────────────────────────────────┐
│         QUOTE FLOW TABS WITH SALES PRICE EDIT                       │
│         (branches from Flow 4 after AccessQuoteAdvancedReporting)   │
└─────────────────────────────────────────────────────────────────────┘

    START (Quote - Advanced Reporting page already open, Draft tab active)
      │
      ▼
  ┌──────────────────────┐
  │ Click Draft Tab      │
  │ Verify Focus         │
  └──────────────────────┘
      │
      ▼
  ╔══════════════════════════════════════════╗
  ║ EDIT SALES PRICE                         ║
  ╚══════════════════════════════════════════╝
      │
      ├─ Click Edit Products button
      │
      ├─ Wait for Edit Modal (h2#modal-title)
      │
      ├─ Open inline cell editor, type new Sales Price
      │     - default '1337' for the plain edit test
      │     - value retrieved from the mocked app's REST
      │       API for the cross-app comparison test
      │       (MockedAppQuoteFlow.RetrieveSalesPriceFromApi)
      │
      ├─ Click Save, wait for modal to close
      │
      ▼
  ┌──────────────────────┐
  │ Click "Mark Status   │
  │ as Complete"         │
  └──────────────────────┘
      │
      ▼
  ├─ Click Needs Review Tab → Mark Status
  ├─ Click In Review Tab → Mark Status
  ├─ Click Approved Tab → Mark Status
  ├─ Click Presented Tab → Mark Status
  ├─ Click Accepted Tab → Mark Status
      │
      ▼
  ┌──────────────────────┐
  │ Click back to Draft  │
  │ Tab, "Mark as        │
  │ Current Status"      │
  └──────────────────────┘
      │
      ▼
  ┌──────────────────────┐
  │ Verify Still         │
  │ Authenticated        │
  └──────────────────────┘
      │
      ▼
    END (test 4 continues into Flow 6 - cross-app comparison)
```

═══════════════════════════════════════════════════════════════════════

(See item 4 under "Summary of Flow Models to Create" above for the full,
up-to-date method list of QuoteAdvancedReportingFlow.)


═══════════════════════════════════════════════════════════════════════


## Flow 5: Mocked App Quote ID Generation
### (for tests in `tests/salesforce-poc-external-app.spec.ts`)

```
┌─────────────────────────────────────────────────────────────────────┐
│              MOCKED APP QUOTE ID GENERATION FLOW                    │
│              (Navigate → Retrieve ID → Generate → Verify)           │
└─────────────────────────────────────────────────────────────────────┘

    START
      │
      ▼
  ┌──────────────────────────────┐
  │ Navigate to Mocked App       │
  │ (http://localhost:3001)      │
  └──────────────────────────────┘
      │
      ▼
  ┌──────────────────────────────┐
  │ Wait for Page Load           │
  │ (load state)                 │
  └──────────────────────────────┘
      │
      ▼
  ┌──────────────────────────────┐
  │ Retrieve Current Quote ID    │
  │ from Display                 │
  │ (e.g., "12345678K")          │
  └──────────────────────────────┘
      │
      ▼
  ┌──────────────────────────────┐
  │ Verify Quote ID Format       │
  │ (8 digits + 1 letter)        │
  │ Regex: ^\d{8}[A-Z]$          │
  └──────────────────────────────┘
      │
      ├─ Format Valid ────────────┐
      │                           │
      │                           ▼
      │                   ┌──────────────────────┐
      │                   │ ✓ Format OK          │
      │                   └──────────────────────┘
      │                           │
      └──────────────────────────┤
      │
      ▼
  ┌──────────────────────────────┐
  │ Click "Generate Quote ID"    │
  │ Button                       │
  └──────────────────────────────┘
      │
      ▼
  ┌──────────────────────────────┐
  │ Wait for API Response        │
  │ & DOM Update (~500ms)        │
  └──────────────────────────────┘
      │
      ▼
  ┌──────────────────────────────┐
  │ Retrieve Updated Quote ID    │
  │ from Display                 │
  └──────────────────────────────┘
      │
      ▼
  ┌──────────────────────────────┐
  │ Verify Quote ID Changed      │
  │ (oldId ≠ newId)              │
  └──────────────────────────────┘
      │
      ├─ IDs Different ────────────┐
      │                            │
      │                            ▼
      │                    ┌──────────────────────┐
      │                    │ ✓ ID Changed         │
      │                    │ (Verified)           │
      │                    └──────────────────────┘
      │                            │
      └────────────────────────────┤
      │
      ▼
  ┌──────────────────────────────┐
  │ Verify New ID Format         │
  │ (8 digits + 1 letter)        │
  │ Regex: ^\d{8}[A-Z]$          │
  └──────────────────────────────┘
      │
      ▼
  ┌──────────────────────────────┐
  │ ✓ All Validations Passed     │
  └──────────────────────────────┘
      │
      ▼
    END


═══════════════════════════════════════════════════════════════════════


## Flow 6: Cross-Application Sales Price Comparison
### (for 'navigate to Quote Advanced Reporting page via search and edit Sales Price with value from mocked app' in `tests/salesforce-poc-authenticated.spec.ts`)

This is the second and final part of test 4 (the first part is Flow 4 + Flow 4b, run against
the authenticated Salesforce tab). It uses `MockedAppQuoteFlow`
(business/flows/mocked-app-quote.flow.ts) both before the Salesforce edit (to fetch the
value that gets typed into the Sales Price field) and after it (to open a second tab in the
same `BrowserContext` and compare).

The mocked app's URL is centralized as `demoEnv.mockedAppURL` in
`config/environments/demoEnv.ts` (overridable via the `MOCKED_APP_URL` env var), and is
shared by this test, `business/mocked-app-base-test.ts`, and
`business/mocked-app-manager.ts` — replacing what used to be three separately hardcoded
`'http://localhost:3001'` literals.

```
┌─────────────────────────────────────────────────────────────────────┐
│         CROSS-APPLICATION SALES PRICE COMPARISON                    │
│         business/flows/mocked-app-quote.flow.ts                     │
└─────────────────────────────────────────────────────────────────────┘

    START (before navigating to Salesforce)
      │
      ▼
  ┌──────────────────────────────┐
  │ MockedAppManager.            │
  │ ensureAppIsRunning()         │
  │ (starts `mocked-app` via     │
  │  `npm start` if not already  │
  │  running on mockedAppURL)    │
  └──────────────────────────────┘
      │
      ▼
  ┌──────────────────────────────┐
  │ RetrieveSalesPriceFromApi()  │
  │ GET {mockedAppURL}/api/      │
  │ quote-id → strip "$"/","     │
  │ e.g. "$1,337.00" → "1337"    │
  └──────────────────────────────┘
      │
      ▼
  ╔══════════════════════════════════════════╗
  ║ DELEGATE TO FLOW 4 + FLOW 4b             ║  ◄─── AccessQuoteAdvancedReporting() then
  ║ (edit Sales Price on Salesforce with     ║       NavigateThroughAllQuoteFlowTabsWithEdit
  ║  the value retrieved above)              ║       (salesPrice)
  ╚══════════════════════════════════════════╝
      │
      ▼
  ┌──────────────────────────────┐
  │ CompareSalesforceEditWith-   │
  │ MockedApp(context,           │
  │ salesPrice)                  │
  └──────────────────────────────┘
      │
      ├─ OpenInNewTab(context)
      │     - context.newPage() → goto(mockedAppURL) → wait for load
      │
      ├─ RetrieveSalesPriceFromNewTab(tabPage)
      │     - reads #salesPriceInput via MockedAppPage on the new tab
      │
      ├─ CompareSalesPrices(salesforceValue, mockedAppValue)
      │     - logs both values side by side
      │     - expect(mockedAppValue).toBeTruthy()
      │     - Note: values may legitimately differ - the mocked app
      │       is not automatically updated by the Salesforce edit
      │
      ├─ CloseTab(tabPage)
      │
      ▼
    END
```

═══════════════════════════════════════════════════════════════════════


## Summary of Flow Models - Updated

### 1. **CompLoginFlow** (business/flows/salesforce-login.flow.ts)
   - `loginWithSSO(username: string, password: string): Promise<void>`
   - Orchestrates: Navigate → Enter Credentials → MFA Flow
   - Used by: Test 'open Comp base page and retrieve page title'

### 2. **MFAVerificationFlow** (business/flows/mfa-verification.flow.ts)
   - `verifyWithEmail(): Promise<void>`
   - Orchestrates: Wait for MFA Page → Open Email → Get Code → Verify
   - Used by: CompLoginFlow (sub-flow)

### 3. **AuthenticatedSalesforceAccessFlow** (business/flows/authenticated-salesforce-access.flow.ts)
   - `accessWithSavedState(authStatePath: string): Promise<void>`
   - Orchestrates: Load State → Restore Cookies/Storage → Navigate → Validate
   - Used by: Tests in `salesforce-poc-authenticated.spec.ts` (via authenticated-base-test fixture)

### 4. **QuoteAdvancedReportingFlow** (business/flows/quote-advanced-reporting.flow.ts)
   - Multiple methods for searching and navigating quote tabs (see item 4 under
     "Summary of Flow Models to Create" above for the full method list, including the
     Sales Price edit methods)
   - `AccessQuoteAdvancedReporting(searchTerm?: string): Promise<void>`
   - `NavigateThroughAllQuoteFlowTabs(): Promise<void>`
   - `NavigateThroughAllQuoteFlowTabsWithEdit(salesPrice?: string): Promise<void>`
   - Used by: All four tests in `salesforce-poc-authenticated.spec.ts`

### 5. **MockedAppQuoteFlow** (business/flows/mocked-app-quote.flow.ts)
   - `verifyDefaultAndGenerateQuoteId(): Promise<void>` - Complete orchestrated flow
   - Individual steps:
     - `NavigateToApp()`
     - `RetrieveCurrentQuoteId()`
     - `RetrieveCurrentSalesPrice()`
     - `VerifyQuoteIdFormat()`
     - `GenerateNewQuoteId()`
     - `RetrieveUpdatedQuoteId()`
     - `VerifyQuoteIdChanged()`
     - `EditSalesPrice()` / `SaveSalesPrice()`
   - Used by: Tests in `tests/salesforce-poc-external-app.spec.ts`
   - **New (added for `tests/salesforce-poc-authenticated.spec.ts`)** cross-application
     comparison steps — see Flow 6 above:
     - `RetrieveSalesPriceFromApi(): Promise<string>` - GET `{baseURL}/api/quote-id` and
       normalize `"$1,337.00"` → `"1337"`
     - `OpenInNewTab(context: BrowserContext): Promise<Page>` - open the mocked app in a
       second tab of the same context
     - `RetrieveSalesPriceFromNewTab(tabPage: Page): Promise<string>` - read the Sales Price
       input on that tab via `MockedAppPage`
     - `CompareSalesPrices(salesforceValue: string, mockedAppValue: string): void` - log and
       assert both values were retrieved
     - `CloseTab(tabPage: Page): Promise<void>`
     - `CompareSalesforceEditWithMockedApp(context, salesforceEditedPrice): Promise<void>` -
       orchestrates the four steps above
   - Used by: 'navigate to Quote Advanced Reporting page via search and edit Sales Price with
     value from mocked app' in `tests/salesforce-poc-authenticated.spec.ts` (in addition to
     `tests/salesforce-poc-external-app.spec.ts`)

═══════════════════════════════════════════════════════════════════════


## Test Files & Flow Model Mapping

| Test File | Flow Model(s) | Status |
|-----------|---------------|--------|
| `salesforce-poc.spec.ts` | CompLoginFlow, MFAVerificationFlow | ✓ Active |
| `salesforce-poc-authenticated.spec.ts` | AuthenticatedSalesforceAccessFlow, QuoteAdvancedReportingFlow, MockedAppQuoteFlow (4th test only) | ✓ Active |
| `salesforce-poc-external-app.spec.ts` | MockedAppQuoteFlow | ✓ Active |

Note: the 4th test in `salesforce-poc-authenticated.spec.ts` also calls
`MockedAppManager.ensureAppIsRunning()` (business/mocked-app-manager.ts) as a
prerequisite step, to guarantee the mocked app is up before `MockedAppQuoteFlow` talks to it.

═══════════════════════════════════════════════════════════════════════
