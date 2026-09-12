import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly dialog: Locator;
  readonly alreadyMemberLogInButton: Locator;
  readonly logInWithEmailButton: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly forgotPasswordButton: Locator;
  readonly submitLogInButton: Locator;
  readonly logInWithGoogleButton: Locator;
  readonly logInWithFacebookButton: Locator;
  readonly closeButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.dialog = page.getByRole('dialog');
    this.alreadyMemberLogInButton = this.dialog.getByRole('button', { name: 'Already a member? Log In' });
    this.logInWithEmailButton = this.dialog.getByRole('button', { name: 'Log in with Email' });
    this.emailInput = this.dialog.getByRole('textbox', { name: 'Email' });
    this.passwordInput = this.dialog.getByRole('textbox', { name: 'Password' });
    this.forgotPasswordButton = this.dialog.getByRole('button', { name: 'Forgot password?' });
    this.submitLogInButton = this.dialog.getByRole('button', { name: 'Log In', exact: true });
    this.logInWithGoogleButton = this.dialog.getByRole('button', { name: 'Log in with Google' });
    this.logInWithFacebookButton = this.dialog.getByRole('button', { name: 'Log in with Facebook' });
    this.closeButton = this.dialog.getByRole('button', { name: 'Close' });
    // Wix's site-members dialog shows the failed-login message as inline text near the
    // password field; matched by common wording since the exact copy wasn't confirmed
    // against a live failed attempt on the production site.
    this.errorMessage = this.dialog.getByText(/incorrect|invalid|wrong (email|password)/i);
  }
}
