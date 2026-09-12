import { Page, Locator } from '@playwright/test';

export class ConferencesPage {
  readonly page: Page;
  readonly heading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /conferences/i });
  }
}
