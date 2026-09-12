import { Page, Locator } from '@playwright/test';

export class ContactPage {
  readonly page: Page;
  readonly heading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /contact/i });
  }
}
