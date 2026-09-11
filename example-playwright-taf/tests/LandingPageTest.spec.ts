import { test, expect } from '../src/business/FoldhaziFixtures';

test('has title', async ({ page }) => {
  await expect(page).toHaveTitle('Péter Földházi Jr. - Test Automation');
});