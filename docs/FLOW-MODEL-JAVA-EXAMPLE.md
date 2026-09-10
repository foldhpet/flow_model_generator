# Example Project in Java

## Suggested Project Structure

src/test/java/
  core/
    BaseTest.java
    BasePage.java
  business/
    page/
      ReviewOrderPage.java
      PaymentOptionsPage.java
      PaymentConfirmationPage.java
    flows/
      PaymentFlow.java
      LoginFlow.java
  tests/
    PaymentFlowTest.java

## core/BaseTest.java

package core;

import business.flows.LoginFlow;
import com.microsoft.playwright.*;
import org.junit.jupiter.api.*;

public abstract class BaseTest {

  protected static Playwright playwright;
  protected static Browser browser;

  protected BrowserContext context;
  protected Page page;

  @BeforeAll
  static void beforeAll() {
    playwright = Playwright.create();
    browser = playwright.chromium().launch(
        new BrowserType.LaunchOptions()
            .setHeadless(true)
    );
  }

  @AfterAll
  static void afterAll() {
    if (browser != null) browser.close();
    if (playwright != null) playwright.close();
  }

  @BeforeEach
  void beforeEach() {
    context = browser.newContext();
    page = context.newPage();

    // Login prerequisite for all tests (Flow Model Pattern: tests call flows; base test can set preconditions)
    LoginFlow loginFlow = new LoginFlow(page);
    loginFlow.SuccessfulLogin();
  }

  @AfterEach
  void afterEach() {
    if (context != null) context.close();
  }
}

## core/BasePage.java

package core;

import com.microsoft.playwright.Page;

public abstract class BasePage {
  protected final Page page;

  protected BasePage(Page page) {
    this.page = page;
  }
}

## business/page/ReviewOrderPage.java

package business.page;

import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;
import core.BasePage;

public class ReviewOrderPage extends BasePage {

  public ReviewOrderPage(Page page) {
    super(page);
  }

  public Locator loggedInIndicator() {
    return page.locator("[data-test='user-logged-in']");
  }

  public Locator reviewOrderHeader() {
    return page.locator("h1[data-test='review-order-title']");
  }

  public Locator cartItemRows() {
    return page.locator("[data-test='cart-item']");
  }

  public Locator checkoutButton() {
    return page.locator("button[data-test='checkout']");
  }
}

## business/page/PaymentOptionsPage.java

package business.page;

import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;
import core.BasePage;

public class PaymentOptionsPage extends BasePage {

  public PaymentOptionsPage(Page page) {
    super(page);
  }

  public Locator paymentOptionsHeader() {
    return page.locator("h1[data-test='payment-options-title']");
  }

  public Locator cardNumberInput() {
    return page.locator("input[data-test='cc-number']");
  }

  public Locator cardExpiryInput() {
    return page.locator("input[data-test='cc-expiry']");
  }

  public Locator cardCvvInput() {
    return page.locator("input[data-test='cc-cvv']");
  }

  public Locator cardHolderNameInput() {
    return page.locator("input[data-test='cc-name']");
  }

  public Locator billingAddressLine1Input() {
    return page.locator("input[data-test='billing-line1']");
  }

  public Locator billingCityInput() {
    return page.locator("input[data-test='billing-city']");
  }

  public Locator billingZipInput() {
    return page.locator("input[data-test='billing-zip']");
  }

  public Locator billingCountrySelect() {
    return page.locator("select[data-test='billing-country']");
  }

  public Locator shippingSameAsBillingCheckbox() {
    return page.locator("input[type='checkbox'][data-test='shipping-same-as-billing']");
  }

  public Locator payButton() {
    return page.locator("button[data-test='pay']");
  }

  public Locator processingSpinner() {
    return page.locator("[data-test='payment-processing']");
  }
}

## business/page/PaymentConfirmationPage.java

package business.page;

import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;
import core.BasePage;

public class PaymentConfirmationPage extends BasePage {

  public PaymentConfirmationPage(Page page) {
    super(page);
  }

  public Locator confirmationHeader() {
    return page.locator("h1[data-test='payment-confirmation-title']");
  }

  public Locator confirmationNumber() {
    return page.locator("[data-test='confirmation-number']");
  }
}

## business/flows/PaymentFlow.java

package business.flows;

import business.page.PaymentConfirmationPage;
import business.page.PaymentOptionsPage;
import business.page.ReviewOrderPage;
import com.microsoft.playwright.Page;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

public class PaymentFlow {
  private final ReviewOrderPage reviewOrderPage;
  private final PaymentOptionsPage paymentOptionsPage;
  private final PaymentConfirmationPage paymentConfirmationPage;

  public PaymentFlow(Page page) {
    this.reviewOrderPage = new ReviewOrderPage(page);
    this.paymentOptionsPage = new PaymentOptionsPage(page);
    this.paymentConfirmationPage = new PaymentConfirmationPage(page);
  }

  // 1. Prerequisite: user is logged in and on Review Order page
  public PaymentFlow verifyUserLoggedInAndOnReviewOrderPage() {
    assertThat(reviewOrderPage.loggedInIndicator()).isVisible();
    assertThat(reviewOrderPage.reviewOrderHeader()).isVisible();
    return this;
  }

  // 2. Prerequisite: at least 1 item in cart
  public PaymentFlow verifyCartHasAtLeastOneItem() {
    assertThat(reviewOrderPage.cartItemRows()).hasCountGreaterThan(0);
    return this;
  }

  // 3. Checkout -> validate Payment Options page opens
  public PaymentFlow goToPaymentOptionsFromReviewOrder() {
    reviewOrderPage.checkoutButton().click();
    assertThat(paymentOptionsPage.paymentOptionsHeader()).isVisible();
    return this;
  }

  // 4. Type valid credit card information
  public PaymentFlow enterValidCreditCardInformation(
      String cardNumber, String expiry, String cvv, String holderName
  ) {
    paymentOptionsPage.cardNumberInput().fill(cardNumber);
    paymentOptionsPage.cardExpiryInput().fill(expiry);
    paymentOptionsPage.cardCvvInput().fill(cvv);
    paymentOptionsPage.cardHolderNameInput().fill(holderName);
    return this;
  }

  // 5. Type billing address
  public PaymentFlow enterBillingAddress(
      String line1, String city, String zip, String countryValue
  ) {
    paymentOptionsPage.billingAddressLine1Input().fill(line1);
    paymentOptionsPage.billingCityInput().fill(city);
    paymentOptionsPage.billingZipInput().fill(zip);
    paymentOptionsPage.billingCountrySelect().selectOption(countryValue);
    return this;
  }

  // 6. Select "Shipping same as billing"
  public PaymentFlow setShippingSameAsBilling(boolean enabled) {
    if (enabled) paymentOptionsPage.shippingSameAsBillingCheckbox().check();
    else paymentOptionsPage.shippingSameAsBillingCheckbox().uncheck();
    return this;
  }

  // 7. Click Pay
  public PaymentFlow clickPay() {
    paymentOptionsPage.payButton().click();
    return this;
  }

  // 8. Wait for transaction + validate confirmation page
  public PaymentFlow waitForTransactionAndVerifyConfirmationPage() {
    if (paymentOptionsPage.processingSpinner().count() > 0) {
      assertThat(paymentOptionsPage.processingSpinner()).isHidden();
    }
    assertThat(paymentConfirmationPage.confirmationHeader()).isVisible();
    return this;
  }

  // Convenience end-to-end method
  public PaymentFlow completePayment(
      String cardNumber, String expiry, String cvv, String holderName,
      String line1, String city, String zip, String countryValue
  ) {
    return verifyUserLoggedInAndOnReviewOrderPage()
        .verifyCartHasAtLeastOneItem()
        .goToPaymentOptionsFromReviewOrder()
        .enterValidCreditCardInformation(cardNumber, expiry, cvv, holderName)
        .enterBillingAddress(line1, city, zip, countryValue)
        .setShippingSameAsBilling(true)
        .clickPay()
        .waitForTransactionAndVerifyConfirmationPage();
  }
}

## tests/PaymentFlowTest.java

package tests;

import business.flows.PaymentFlow;
import core.BaseTest;
import org.junit.jupiter.api.Test;

public class PaymentFlowTest extends BaseTest {

  @Test
  void shouldCompletePaymentFlow() {
    // Assumption: BaseTest already logged in via LoginFlow.SuccessfulLogin()
    // Navigate to Review Order page if login does not land there automatically
    page.navigate("https://your-app.example.com/checkout/review-order");

    new PaymentFlow(page).completePayment(
        "4111111111111111",
        "12/30",
        "123",
        "Test User",
        "1 Main Street",
        "New York",
        "10001",
        "US"
    );
  }
}
