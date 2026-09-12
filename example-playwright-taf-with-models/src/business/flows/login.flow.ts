import { Page, Locator, expect } from '@playwright/test';
import { HeaderNavigationPage } from '../pages/header-navigation.page';
import { LoginPage } from '../pages/login.page';

export class LoginFlow {
  readonly page: Page;
  readonly header: HeaderNavigationPage;
  readonly loginPage: LoginPage;

  constructor(page: Page, header: HeaderNavigationPage, loginPage: LoginPage) {
    this.page = page;
    this.header = header;
    this.loginPage = loginPage;
  }

  /**
   * Wix's site-members widget can render the header Log In button before its click
   * handler has finished hydrating, so an early click is silently dropped. Retries the
   * click until the target becomes visible instead of failing on the first miss.
   */
  private async clickUntilVisible(trigger: Locator, target: Locator, timeoutMs = 15000, intervalMs = 1000): Promise<void> {
    const deadline = Date.now() + timeoutMs;
    for (;;) {
      await trigger.click();
      try {
        await target.waitFor({ state: 'visible', timeout: intervalMs });
        return;
      } catch (error) {
        if (Date.now() >= deadline) throw error;
      }
    }
  }

  /**
   * Opens the Wix site-members dialog and drills down to the email/password login form:
   * Log In (header) -> "Already a member? Log In" -> "Log in with Email".
   */
  async openLoginDialog(): Promise<void> {
    await this.clickUntilVisible(this.header.logInButton, this.loginPage.dialog);
    await this.loginPage.alreadyMemberLogInButton.click();
    await this.loginPage.logInWithEmailButton.click();
    await this.loginPage.emailInput.waitFor({ state: 'visible' });
  }

  async enterCredentials(email: string, password: string): Promise<void> {
    await this.loginPage.emailInput.fill(email);
    await this.loginPage.passwordInput.fill(password);
  }

  async submitLogin(): Promise<void> {
    await this.loginPage.submitLogInButton.click();
  }

  async verifyLoginSuccessful(): Promise<void> {
    await expect(this.loginPage.dialog).toBeHidden();
  }

  async verifyLoginError(): Promise<void> {
    await expect(this.loginPage.errorMessage).toBeVisible();
    await expect(this.loginPage.dialog).toBeVisible();
  }

  /**
   * Login Flow, case 1: user logs in successfully with correct credentials.
   * Orchestrates: Open Dialog -> Enter Credentials -> Submit -> Verify Logged In
   */
  async loginWithValidCredentials(email: string, password: string): Promise<void> {
    await this.openLoginDialog();
    await this.enterCredentials(email, password);
    await this.submitLogin();
    await this.verifyLoginSuccessful();
  }

  /**
   * Login Flow, case 2: user tries to log in with incorrect credentials.
   * Orchestrates: Open Dialog -> Enter Credentials -> Submit -> Verify Error Shown
   */
  async loginWithInvalidCredentials(email: string, password: string): Promise<void> {
    await this.openLoginDialog();
    await this.enterCredentials(email, password);
    await this.submitLogin();
    await this.verifyLoginError();
  }
}
