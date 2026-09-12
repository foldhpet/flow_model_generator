import { test, expect } from '../src/business/foldhazi-base-test';
import { HeaderNavigationPage } from '../src/business/pages/header-navigation.page';
import { MenuNavigationFlow } from '../src/business/flows/menu-navigation.flow';

test.describe('Menu Flow', () => {
  test('clicking through the top menu bar opens all pages correctly', async ({ page, foldhaziBaseURL }) => {
    await page.goto(foldhaziBaseURL);

    const header = new HeaderNavigationPage(page);
    const menuNavigationFlow = new MenuNavigationFlow(page, header);

    await menuNavigationFlow.clickThroughAllMenuPages();
  });

  test('social media handlers point to the correct Twitter, LinkedIn and YouTube profiles', async ({
    page,
    foldhaziBaseURL,
  }) => {
    await page.goto(foldhaziBaseURL);

    const header = new HeaderNavigationPage(page);
    const menuNavigationFlow = new MenuNavigationFlow(page, header);

    await menuNavigationFlow.verifySocialMediaHandlers();
  });
});
