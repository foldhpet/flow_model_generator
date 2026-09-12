# Flow & Page Models Design - www.peterfoldhazi.com

Generated from `docs/USER-FLOWS.md`. Target application: [www.peterfoldhazi.com](https://www.peterfoldhazi.com),
a Wix-hosted personal site with a top navigation bar, a social media bar, and a Wix
"Site Members" login widget.

## Flow 1: Menu Flow - Click Through All Top Menu Pages

### (for 'clicking through the top menu bar to see if all the pages open correctly')

```
┌─────────────────────────────────────────────────────────────────────┐
│                          MENU NAVIGATION FLOW                       │
└─────────────────────────────────────────────────────────────────────┘

    START (on Home page)
      │
      ▼
  ┌──────────────────────┐
  │ Click "About" in Nav │
  └──────────────────────┘
      │
      ▼
  ┌──────────────────────┐
  │ Verify Title:        │
  │ "About | Péter       │
  │  Földházi Jr."       │
  └──────────────────────┘
      │
      ▼
  ┌──────────────────────┐
  │ Click "Conferences"  │
  └──────────────────────┘
      │
      ▼
  ┌──────────────────────┐
  │ Verify Title:        │
  │ "Conferences | ..."  │
  └──────────────────────┘
      │
      ▼
  ┌──────────────────────┐
  │ Click "Articles"     │
  └──────────────────────┘
      │
      ▼
  ┌──────────────────────┐
  │ Verify Title:        │
  │ "Articles | ..."     │
  └──────────────────────┘
      │
      ▼
  ┌──────────────────────┐
  │ Click "Blog"         │
  └──────────────────────┘
      │
      ▼
  ┌──────────────────────┐
  │ Verify Title:        │
  │ "Blog | ..."         │
  └──────────────────────┘
      │
      ▼
  ┌──────────────────────┐
  │ Click "Contact"      │
  └──────────────────────┘
      │
      ▼
  ┌──────────────────────┐
  │ Verify Title:        │
  │ "Contact | ..."      │
  └──────────────────────┘
      │
      ▼
  ┌──────────────────────┐
  │ Click "Home"         │
  └──────────────────────┘
      │
      ▼
  ┌──────────────────────┐
  │ Verify Title:        │
  │ "Péter Földházi Jr.  │
  │  - Test Automation"  │
  └──────────────────────┘
      │
      ▼
    END
```

## Flow 2: Menu Flow - Verify Social Media Handlers

### (for 'Social Media Handler, checking Twitter, Facebook, Youtube handlers are correct')

```
┌─────────────────────────────────────────────────────────────────────┐
│                    SOCIAL MEDIA HANDLER VERIFICATION                │
└─────────────────────────────────────────────────────────────────────┘

    START
      │
      ▼
  ┌──────────────────────────────┐
  │ Locate Social Bar            │
  │ (ul[aria-label="Social Bar"])│
  └──────────────────────────────┘
      │
      ▼
  ┌──────────────────────────────┐
  │ Verify Twitter link href     │
  │ = twitter.com/FoldhaziJr     │
  └──────────────────────────────┘
      │
      ▼
  ┌──────────────────────────────┐
  │ Verify LinkedIn link href    │
  │ = linkedin.com/in/           │
  │   peter-foldhazi-jr          │
  └──────────────────────────────┘
      │
      ▼
  ┌──────────────────────────────┐
  │ Verify YouTube link href     │
  │ = youtube.com/channel/       │
  │   UC6vSWVgQY87Ax1qHU-stkYQ   │
  └──────────────────────────────┘
      │
      ▼
    END
```

> **Deviation from USER-FLOWS.md**: the user flow doc names Twitter/Facebook/YouTube as the
> social handlers to check. Inspection of the live site (`ul[aria-label="Social Bar"]` in the
> header) found **Twitter, LinkedIn and YouTube** - there is no Facebook link on the page.
> `MenuNavigationFlow.verifySocialMediaHandlers()` checks the three handlers that actually
> exist; if a Facebook link is added later, extend `HeaderNavigationPage` and this method
> together.

## Flow 3: Login Flow - Successful Login

### (for 'User logs in successfully with correct credentials')

```
┌─────────────────────────────────────────────────────────────────────┐
│                       SUCCESSFUL LOGIN FLOW                         │
└─────────────────────────────────────────────────────────────────────┘

    START
      │
      ▼
  ┌──────────────────────────────┐
  │ Click "Log In" (header)      │
  └──────────────────────────────┘
      │
      ▼
  ┌──────────────────────────────┐
  │ Wix dialog opens on the      │
  │ Sign Up view by default      │
  └──────────────────────────────┘
      │
      ▼
  ┌──────────────────────────────┐
  │ Click "Already a member?     │
  │ Log In"                      │
  └──────────────────────────────┘
      │
      ▼
  ┌──────────────────────────────┐
  │ Click "Log in with Email"    │
  └──────────────────────────────┘
      │
      ▼
  ┌──────────────────────────────┐
  │ Enter Email + Password       │
  └──────────────────────────────┘
      │
      ▼
  ┌──────────────────────────────┐
  │ Click "Log In" (submit)      │
  └──────────────────────────────┘
      │
      ▼
  ┌──────────────────────────────┐
  │ Verify Dialog Closed         │
  │ (user is now logged in)      │
  └──────────────────────────────┘
      │
      ▼
    END
```

## Flow 4: Login Flow - Failed Login

### (for 'User tries to log in with incorrect credentials')

```
┌─────────────────────────────────────────────────────────────────────┐
│                          FAILED LOGIN FLOW                          │
└─────────────────────────────────────────────────────────────────────┘

    START
      │
      ▼
  ╔══════════════════════════════════════════╗
  ║ DELEGATE TO "OPEN LOGIN DIALOG" STEPS    ║  ◄─── same 3 clicks as Flow 3
  ║ (Log In -> Already a member? -> Log in   ║
  ║  with Email)                             ║
  ╚══════════════════════════════════════════╝
      │
      ▼
  ┌──────────────────────────────┐
  │ Enter Email + Wrong Password │
  └──────────────────────────────┘
      │
      ▼
  ┌──────────────────────────────┐
  │ Click "Log In" (submit)      │
  └──────────────────────────────┘
      │
      ▼
  ┌──────────────────────────────┐
  │ Verify Error Message Shown   │
  │ Verify Dialog Still Open     │
  └──────────────────────────────┘
      │
      ▼
    END
```

> **Note on test data**: this flow submits real credentials to Wix's live "Site Members"
> auth endpoint for peterfoldhazi.com - there is no test/sandbox login environment for this
> site. The successful-login test therefore reads `FOLDHAZI_TEST_EMAIL` /
> `FOLDHAZI_TEST_PASSWORD` from the environment and is skipped when they are not set, rather
> than hardcoding a real account's password in the repo. `LoginPage.errorMessage` matches on
> common wording (`/incorrect|invalid|wrong (email|password)/i`) rather than one exact
> string, since the precise copy of Wix's failed-login message was not confirmed against a
> live failed attempt in this environment - verify it the first time the test is actually run
> with credentials, and tighten the locator if needed.

═══════════════════════════════════════════════════════════════════════

## Summary of Page Models Created

### 1. **HeaderNavigationPage** (business/pages/header-navigation.page.ts)
   - `navigation` - the `nav[aria-label="Site"]` top menu bar
   - `homeLink`, `aboutLink`, `conferencesLink`, `articlesLink`, `blogLink`, `contactLink`
   - `socialBar` - the `ul[aria-label="Social Bar"]` element
   - `twitterLink`, `linkedinLink`, `youtubeLink`
   - `logInButton` - opens the Wix Site Members dialog
   - Used by: MenuNavigationFlow, LoginFlow

### 2. **LoginPage** (business/pages/login.page.ts)
   - `dialog` - the Wix Site Members dialog (`role="dialog"`)
   - `alreadyMemberLogInButton`, `logInWithEmailButton`
   - `emailInput`, `passwordInput`, `forgotPasswordButton`, `submitLogInButton`
   - `logInWithGoogleButton`, `logInWithFacebookButton`, `closeButton`
   - `errorMessage` - failed-login message locator
   - Used by: LoginFlow

### 3. **HomePage** (business/pages/home.page.ts)
   - `heading` - "Hi! I'm Péter Földházi Jr." greeting text

### 4. **AboutPage** (business/pages/about.page.ts)
   - `heading` - matches `/about/i`

### 5. **ConferencesPage** (business/pages/conferences.page.ts)
   - `heading` - matches `/conferences/i`

### 6. **ArticlesPage** (business/pages/articles.page.ts)
   - `heading` - matches `/articles/i`

### 7. **BlogPage** (business/pages/blog.page.ts)
   - `heading` - matches `/blog/i`

### 8. **ContactPage** (business/pages/contact.page.ts)
   - `heading` - matches `/contact/i`

Pages 3-8 hold only a heading locator today; `MenuNavigationFlow` currently verifies
navigation via `page.title()` (consistent with `LandingPageTest.spec.ts`), but each page's
`heading` locator is available for flows/tests that need a same-page (not title-based)
assertion later - e.g. once content-specific actions (search articles, filter blog
categories, submit the contact form) are added to these Page Models.

═══════════════════════════════════════════════════════════════════════

## Summary of Flow Models Created

### 1. **MenuNavigationFlow** (business/flows/menu-navigation.flow.ts)
   - `navigateToHome() / navigateToAbout() / navigateToConferences() / navigateToArticles() / navigateToBlog() / navigateToContact(): Promise<void>`
   - `verifyPageTitle(expectedTitle: string | RegExp): Promise<void>`
   - `clickThroughAllMenuPages(): Promise<void>` - orchestrates: click every nav link in order, verifying the destination page's title after each click
   - `verifySocialMediaHandlers(): Promise<void>` - orchestrates: verify Twitter, LinkedIn and YouTube `href` values
   - Used by: `tests/MenuNavigationTest.spec.ts` (both tests)

### 2. **LoginFlow** (business/flows/login.flow.ts)
   - `openLoginDialog(): Promise<void>` - orchestrates: click Log In -> Already a member? Log In -> Log in with Email
   - `enterCredentials(email, password): Promise<void>`
   - `submitLogin(): Promise<void>`
   - `verifyLoginSuccessful(): Promise<void>` - asserts the dialog closes
   - `verifyLoginError(): Promise<void>` - asserts the error message and dialog remain visible
   - `loginWithValidCredentials(email, password): Promise<void>` - orchestrates: Open Dialog -> Enter Credentials -> Submit -> Verify Success
   - `loginWithInvalidCredentials(email, password): Promise<void>` - orchestrates: Open Dialog -> Enter Credentials -> Submit -> Verify Error
   - Used by: `tests/LoginTest.spec.ts` (both tests)

═══════════════════════════════════════════════════════════════════════

## Test Files & Flow Model Mapping

| Test File | Flow Model(s) | Status |
|-----------|---------------|--------|
| `LandingPageTest.spec.ts` | *(none - simple title check, unchanged)* | ✓ Active |
| `MenuNavigationTest.spec.ts` | MenuNavigationFlow | ✓ Active - both tests pass against the live site |
| `LoginTest.spec.ts` | LoginFlow | ⚠ Active, not run in this environment - see the test-data note under Flow 4 |

═══════════════════════════════════════════════════════════════════════

## Test Refactoring / Composition Pattern

### `tests/MenuNavigationTest.spec.ts`
```
const header = new HeaderNavigationPage(page);
const menuNavigationFlow = new MenuNavigationFlow(page, header);

await menuNavigationFlow.clickThroughAllMenuPages();
await menuNavigationFlow.verifySocialMediaHandlers();
```

### `tests/LoginTest.spec.ts`
```
const header = new HeaderNavigationPage(page);
const loginPage = new LoginPage(page);
const loginFlow = new LoginFlow(page, header, loginPage);

await loginFlow.loginWithValidCredentials(email, password);      // 'correct credentials' test
await loginFlow.loginWithInvalidCredentials(badEmail, badPass);  // 'incorrect credentials' test
```

Both test files import `test`/`expect` from `../src/business/foldhazi-base-test`, the same
fixture `tests/LandingPageTest.spec.ts` uses, so every test navigates via the shared
`foldhaziBaseURL` fixture instead of a hardcoded URL.

═══════════════════════════════════════════════════════════════════════
