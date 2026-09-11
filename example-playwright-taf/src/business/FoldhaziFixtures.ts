import { test as base, expect, type Page, type BrowserContext } from '@playwright/test';
import { FoldhaziTest } from './FoldhaziTest';

// Concrete class so we can instantiate it (FoldhaziTest is abstract)
class FoldhaziRuntime extends FoldhaziTest {}

type Fixtures = {
  foldhazi: FoldhaziRuntime;
  page: Page;
  context: BrowserContext;
};

export const test = base.extend<Fixtures>({
  foldhazi: async ({}, use) => {
    // one-time (per worker) setup
    await FoldhaziRuntime.beforeAll();

    const instance = new FoldhaziRuntime();
    await instance.beforeEach();

    try {
      await use(instance);
    } finally {
      await instance.afterEach();
      // one-time (per worker) teardown
      await FoldhaziRuntime.afterAll();
    }
  },

  // expose page/context so tests can keep the normal signature ({ page })
  page: async ({ foldhazi }, use) => {
    await use((foldhazi as any).page);
  },

  context: async ({ foldhazi }, use) => {
    await use((foldhazi as any).context);
  },
});

export { expect };