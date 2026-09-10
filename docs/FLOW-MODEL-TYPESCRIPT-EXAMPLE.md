# Example Project in TypeScript

## Suggested Project Structure

src/
  core/
    BaseTest.ts
    BasePage.ts
  business/
    page/
      ReviewOrderPage.ts
      PaymentOptionsPage.ts
      PaymentConfirmationPage.ts
    flows/
      PaymentFlow.ts
      LoginFlow.ts          // referenced by BaseTest (implementation not shown)
  tests/
    PaymentFlowTest.spec.ts
## core/BaseTest.ts

// src/core/BaseTest.ts
import { Browser, BrowserContext, Page, chromium } from '@playwright/test';
import { LoginFlow } from '../business/flows/LoginFlow';

export abstract class BaseTest {
  protected static browser: Browser;

  protected context!: BrowserContext;
  protected page!: Page;

  // "BeforeAll"
  static async beforeAll(): Promise<void> {
    BaseTest.browser = await chromium.launch({ headless: true });
  }

  // "AfterAll"
  static async afterAll(): Promise<void> {
    await BaseTest.browser?.close();
  }

  // "BeforeEach"
  async beforeEach(): Promise<void> {
    this.context = await BaseTest.browser.newContext();
    this.page = await this.context.newPage();

    // BaseTest calls LoginFlow.SuccessfulLogin() (implementation intentionally not shown)
    const loginFlow = new LoginFlow(this.page);
    await loginFlow.SuccessfulLogin();
  }

  // "AfterEach"
  async afterEach(): Promise<void> {
    await this.context?.close();
  }
}

## core/BasePage.ts

// src/core/BasePage.ts
import type { Page } from '@playwright/test';

export abstract class BasePage {
  protected readonly page: Page;

  protected constructor(page: Page) {
    this.page = page;
  }
}

## business/page/ReviewOrderPage.ts

// src/business/page/ReviewOrderPage.ts
import type { Locator, Page } from '@playwright/test';
import { BasePage } from '../../core/BasePage';

export class ReviewOrderPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Step 1: logged in indicator (example)
  loggedInIndicator(): Locator {
    return this.page.locator("[data-test='user-logged-in']");
  }

  // Step 1: on Review Order page
  reviewOrderHeader(): Locator {
    return this.page.locator("h1[data-test='review-order-title']");
  }

  // Step 2: at least 1 item in cart
  cartItemRows(): Locator {
    return this.page.locator("[data-test='cart-item']");
  }

  // Step 3: checkout
  checkoutButton(): Locator {
    return this.page.locator("button[data-test='checkout']");
  }
}

## business/page/PaymentOptionsPage.ts

// src/business/page/PaymentOptionsPage.ts
import type { Locator, Page } from '@playwright/test';
import { BasePage } from '../../core/BasePage';

export class PaymentOptionsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Step 3 validation: page opened
  paymentOptionsHeader(): Locator {
    return this.page.locator("h1[data-test='payment-options-title']");
  }

  // Step 4: credit card
  cardNumberInput(): Locator {
    return this.page.locator("input[data-test='cc-number']");
  }

  cardExpiryInput(): Locator {
    return this.page.locator("input[data-test='cc-expiry']");
  }

  cardCvvInput(): Locator {
    return this.page.locator("input[data-test='cc-cvv']");
  }

  cardHolderNameInput(): Locator {
    return this.page.locator("input[data-test='cc-name']");
  }

  // Step 5: billing address
  billingAddressLine1Input(): Locator {
    return this.page.locator("input[data-test='billing-line1']");
  }

  billingCityInput(): Locator {
    return this.page.locator("input[data-test='billing-city']");
  }

  billingZipInput(): Locator {
    return this.page.locator("input[data-test='billing-zip']");
  }

  billingCountrySelect(): Locator {
    return this.page.locator("select[data-test='billing-country']");
  }

  // Step 6
  shippingSameAsBillingCheckbox(): Locator {
    return this.page.locator("input[type='checkbox'][data-test='shipping-same-as-billing']");
  }

  // Step 7
  payButton(): Locator {
    return this.page.locator("button[data-test='pay']");
  }

  // Step 8 (optional)
  processingSpinner(): Locator {
    return this.page.locator("[data-test='payment-processing']");
  }
}

## business/page/PaymentConfirmationPage.ts

// src/business/page/PaymentConfirmationPage.ts
import type { Locator, Page } from '@playwright/test';
import { BasePage } from '../../core/BasePage';

export class PaymentConfirmationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Step 8 validation: confirmation page opened
  confirmationHeader(): Locator {
    return this.page.locator("h1[data-test='payment-confirmation-title']");
  }

  // Optional: confirmation number
  confirmationNumber(): Locator {
    return this.page.locator("[data-test='confirmation-number']");
  }
}

## business/flows/PaymentFlow.ts

// src/business/flows/PaymentFlow.ts
import { expect, Page } from '@playwright/test';
import { ReviewOrderPage } from '../page/ReviewOrderPage';
import { PaymentOptionsPage } from '../page/PaymentOptionsPage';
import { PaymentConfirmationPage } from '../page/PaymentConfirmationPage';

export class PaymentFlow {
  private readonly reviewOrderPage: ReviewOrderPage;
  private readonly paymentOptionsPage: PaymentOptionsPage;
  private readonly paymentConfirmationPage: PaymentConfirmationPage;

  constructor(page: Page) {
    this.reviewOrderPage = new ReviewOrderPage(page);
    this.paymentOptionsPage = new PaymentOptionsPage(page);
    this.paymentConfirmationPage = new PaymentConfirmationPage(page);
  }

  // 1. Prerequisite step: Validate user logged in and on Review Order page
  async verifyUserLoggedInAndOnReviewOrderPage(): Promise<this> {
    await expect(this.reviewOrderPage.loggedInIndicator()).toBeVisible();
    await expect(this.reviewOrderPage.reviewOrderHeader()).toBeVisible();
    return this;
  }

  // 2. Prerequisite step: Validate user has at least 1 item in cart
  async verifyCartHasAtLeastOneItem(): Promise<this> {
    await expect(this.reviewOrderPage.cartItemRows()).toHaveCountGreaterThan(0);
    return this;
  }

  // 3. Click Checkout and validate Payment Options page opens
  async clickCheckoutAndVerifyPaymentOptionsPage(): Promise<this> {
    await this.reviewOrderPage.checkoutButton().click();
    await expect(this.paymentOptionsPage.paymentOptionsHeader()).toBeVisible();
    return this;
  }

  // 4. Type in Valid Credit Card Information
  async typeValidCreditCardInformation(params: {
    cardNumber: string;
    expiry: string;
    cvv: string;
    holderName: string;
  }): Promise<this> {
    await this.paymentOptionsPage.cardNumberInput().fill(params.cardNumber);
    await this.paymentOptionsPage.cardExpiryInput().fill(params.expiry);
    await this.paymentOptionsPage.cardCvvInput().fill(params.cvv);
    await this.paymentOptionsPage.cardHolderNameInput().fill(params.holderName);
    return this;
  }

  // 5. Type in Billing Address
  async typeBillingAddress(params: {
    line1: string;
    city: string;
    zip: string;
    countryValue: string;
  }): Promise<this> {
    await this.paymentOptionsPage.billingAddressLine1Input().fill(params.line1);
    await this.paymentOptionsPage.billingCityInput().fill(params.city);
    await this.paymentOptionsPage.billingZipInput().fill(params.zip);
    await this.paymentOptionsPage.billingCountrySelect().selectOption(params.countryValue);
    return this;
  }

  // 6. Select Shipping Address is the Same as Billing Address checkbox
  async selectShippingSameAsBilling(enabled: boolean = true): Promise<this> {
    const cb = this.paymentOptionsPage.shippingSameAsBillingCheckbox();
    if (enabled) await cb.check();
    else await cb.uncheck();
    return this;
  }

  // 7. Click on the Pay button
  async clickPay(): Promise<this> {
    await this.paymentOptionsPage.payButton().click();
    return this;
  }

  // 8. Wait for transaction to proceed, then validate confirmation page opens
  async waitForTransactionAndVerifyPaymentConfirmationPage(): Promise<this> {
    const spinner = this.paymentOptionsPage.processingSpinner();
    if (await spinner.count()) {
      await expect(spinner).toBeHidden();
    }
    await expect(this.paymentConfirmationPage.confirmationHeader()).toBeVisible();
    return this;
  }

  // Combined workflow (payment flow)
  async completePayment(params: {
    cardNumber: string;
    expiry: string;
    cvv: string;
    holderName: string;
    line1: string;
    city: string;
    zip: string;
    countryValue: string;
  }): Promise<this> {
    await this.verifyUserLoggedInAndOnReviewOrderPage();
    await this.verifyCartHasAtLeastOneItem();
    await this.clickCheckoutAndVerifyPaymentOptionsPage();
    await this.typeValidCreditCardInformation({
      cardNumber: params.cardNumber,
      expiry: params.expiry,
      cvv: params.cvv,
      holderName: params.holderName,
    });
    await this.typeBillingAddress({
      line1: params.line1,
      city: params.city,
      zip: params.zip,
      countryValue: params.countryValue,
    });
    await this.selectShippingSameAsBilling(true);
    await this.clickPay();
    await this.waitForTransactionAndVerifyPaymentConfirmationPage();
    return this;
  }
}

## tests/PaymentFlowTest.ts

// src/tests/PaymentFlowTest.spec.ts
import { test } from '@playwright/test';
import { BaseTest } from '../core/BaseTest';
import { PaymentFlow } from '../business/flows/PaymentFlow';

class PaymentFlowTest extends BaseTest {}

test.describe('Payment Flow - Flow Model Pattern', () => {
  test.beforeAll(async () => {
    await PaymentFlowTest.beforeAll();
  });

  test.afterAll(async () => {
    await PaymentFlowTest.afterAll();
  });

  test.beforeEach(async () => {
    const instance = new PaymentFlowTest();
    (test.info() as any).fixture = instance;
    await instance.beforeEach();
  });

  test.afterEach(async () => {
    const instance: PaymentFlowTest = (test.info() as any).fixture;
    await instance.afterEach();
  });

  test('should complete payment flow', async () => {
    const instance: PaymentFlowTest = (test.info() as any).fixture;

    // Assumption: BaseTest logged in. Navigate to Review Order if needed.
    await instance.page.goto('https://your-app.example.com/checkout/review-order');

    await new PaymentFlow(instance.page).completePayment({
      cardNumber: '4111111111111111',
      expiry: '12/30',
      cvv: '123',
      holderName: 'Test User',
      line1: '1 Main Street',
      city: 'New York',
      zip: '10001',
      countryValue: 'US',
    });
  });
});
