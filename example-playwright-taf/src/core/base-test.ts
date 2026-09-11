import { test as base } from '@playwright/test';
import { devEnv } from '../config/environments/devEnv';

type TestFixtures = {
  baseURL: string;
  headless: boolean;
  assignedUser: string | null;
};

function getAssignedUser(users: string[], workerId: number): string | null {
  if (!users || users.length === 0) return null;
  return users[workerId % users.length];
}

export const test = base.extend<TestFixtures>({
  baseURL: async ({}, use) => {
    const url = '';
    await use(url);
  },
  headless: async ({}, use) => {
    const headlessMode = devEnv.headless;
    await use(headlessMode);
  },
});

test.afterEach(async ({ page }, testInfo) => {
  
});

export { expect } from '@playwright/test';