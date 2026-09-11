import { test, expect } from '../src/business/foldhazi-base-test';

test('has title', async ({ page, foldhaziBaseURL }) => {
  await page.goto(foldhaziBaseURL);
  await expect(page).toHaveTitle('Péter Földházi Jr. - Test Automation');
});