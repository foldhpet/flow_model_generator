import { Browser, BrowserContext, Page, chromium } from '@playwright/test';

export abstract class BaseTest {
  protected static browser: Browser;

  protected context!: BrowserContext;
  protected page!: Page;

  public get Page(): Page {
    return this.page;
  }

  public get Context(): BrowserContext {
    return this.context;
  }

  static async beforeAll(): Promise<void> {
    this.browser = await chromium.launch({ headless: true });
  }

  static async afterAll(): Promise<void> {
    await this.browser?.close();
  }

  async beforeEach(): Promise<void> {
    const ctor = this.constructor as typeof BaseTest;
    this.context = await ctor.browser.newContext();
    this.page = await this.context.newPage();
  }

  async afterEach(): Promise<void> {
    await this.context?.close();
  }
}