import { test } from '../src/business/foldhazi-base-test';
import { HeaderNavigationPage } from '../src/business/pages/header-navigation.page';
import { LoginPage } from '../src/business/pages/login.page';
import { LoginFlow } from '../src/business/flows/login.flow';

test.describe('Login Flow', () => {
  test('user logs in successfully with correct credentials', async ({ page, foldhaziBaseURL }) => {
    const email = process.env.FOLDHAZI_TEST_EMAIL;
    const password = process.env.FOLDHAZI_TEST_PASSWORD;
    test.skip(
      !email || !password,
      'Requires FOLDHAZI_TEST_EMAIL and FOLDHAZI_TEST_PASSWORD env vars for a real site member account'
    );

    await page.goto(foldhaziBaseURL);

    const header = new HeaderNavigationPage(page);
    const loginPage = new LoginPage(page);
    const loginFlow = new LoginFlow(page, header, loginPage);

    await loginFlow.loginWithValidCredentials(email!, password!);
  });

  test('user cannot log in with incorrect credentials', async ({ page, foldhaziBaseURL }) => {
    await page.goto(foldhaziBaseURL);

    const header = new HeaderNavigationPage(page);
    const loginPage = new LoginPage(page);
    const loginFlow = new LoginFlow(page, header, loginPage);

    await loginFlow.loginWithInvalidCredentials('flow-model-test-user@example.com', 'WrongPassword123!');
  });
});
