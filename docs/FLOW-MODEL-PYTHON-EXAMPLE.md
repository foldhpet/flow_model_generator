# Example Project in python

## Suggested Project Structure

src/
  core/
    base_test.py
    base_page.py
  business/
    page/
      review_order_page.py
      payment_options_page.py
      payment_confirmation_page.py
    flows/
      payment_flow.py
      login_flow.py          # referenced by BaseTest (implementation not shown)
  tests/
    test_payment_flow.py

## core/BaseTest.py

src/core/base_test.py
import unittest
from playwright.sync_api import sync_playwright, Browser, BrowserContext, Page

from business.flows.login_flow import LoginFlow  # implementation not shown


class BaseTest(unittest.TestCase):
    playwright = None
    browser: Browser | None = None

    context: BrowserContext | None = None
    page: Page | None = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.playwright = sync_playwright().start()
        cls.browser = cls.playwright.chromium.launch(headless=True)

    @classmethod
    def tearDownClass(cls) -> None:
        if cls.browser:
            cls.browser.close()
        if cls.playwright:
            cls.playwright.stop()

    def setUp(self) -> None:
        # Fresh context/page per test
        self.context = self.browser.new_context()
        self.page = self.context.new_page()

        # BaseTest calls LoginFlow.SuccessfulLogin() (implementation intentionally not shown)
        login_flow = LoginFlow(self.page)
        login_flow.SuccessfulLogin()

    def tearDown(self) -> None:
        if self.context:
            self.context.close()

## core/BasePage.py

src/core/base_page.py
from playwright.sync_api import Page


class BasePage:
    def __init__(self, page: Page) -> None:
        self.page = page

## business/page/ReviewOrderPage.py

src/business/page/review_order_page.py
from playwright.sync_api import Locator, Page
from core.base_page import BasePage


class ReviewOrderPage(BasePage):
    def __init__(self, page: Page) -> None:
        super().__init__(page)

    # Step 1 prerequisite: "logged in" indicator
    def logged_in_indicator(self) -> Locator:
        return self.page.locator("[data-test='user-logged-in']")

    # Step 1 prerequisite: "Review Order" page title/header
    def review_order_header(self) -> Locator:
        return self.page.locator("h1[data-test='review-order-title']")

    # Step 2 prerequisite: cart items
    def cart_item_rows(self) -> Locator:
        return self.page.locator("[data-test='cart-item']")

    # Step 3: checkout button
    def checkout_button(self) -> Locator:
        return self.page.locator("button[data-test='checkout']")

## business/page/PaymentOptionsPage.py

src/business/page/payment_options_page.py
from playwright.sync_api import Locator, Page
from core.base_page import BasePage


class PaymentOptionsPage(BasePage):
    def __init__(self, page: Page) -> None:
        super().__init__(page)

    # Step 3 validation: page opened
    def payment_options_header(self) -> Locator:
        return self.page.locator("h1[data-test='payment-options-title']")

    # Step 4: credit card inputs
    def card_number_input(self) -> Locator:
        return self.page.locator("input[data-test='cc-number']")

    def card_expiry_input(self) -> Locator:
        return self.page.locator("input[data-test='cc-expiry']")

    def card_cvv_input(self) -> Locator:
        return self.page.locator("input[data-test='cc-cvv']")

    def card_holder_name_input(self) -> Locator:
        return self.page.locator("input[data-test='cc-name']")

    # Step 5: billing address inputs
    def billing_address_line1_input(self) -> Locator:
        return self.page.locator("input[data-test='billing-line1']")

    def billing_city_input(self) -> Locator:
        return self.page.locator("input[data-test='billing-city']")

    def billing_zip_input(self) -> Locator:
        return self.page.locator("input[data-test='billing-zip']")

    def billing_country_select(self) -> Locator:
        return self.page.locator("select[data-test='billing-country']")

    # Step 6
    def shipping_same_as_billing_checkbox(self) -> Locator:
        return self.page.locator("input[type='checkbox'][data-test='shipping-same-as-billing']")

    # Step 7
    def pay_button(self) -> Locator:
        return self.page.locator("button[data-test='pay']")

    # Step 8 (optional)
    def processing_spinner(self) -> Locator:
        return self.page.locator("[data-test='payment-processing']")

## business/page/PaymentConfirmationPage.py

src/business/page/payment_confirmation_page.py
from playwright.sync_api import Locator, Page
from core.base_page import BasePage


class PaymentConfirmationPage(BasePage):
    def __init__(self, page: Page) -> None:
        super().__init__(page)

    # Step 8 validation
    def confirmation_header(self) -> Locator:
        return self.page.locator("h1[data-test='payment-confirmation-title']")

    def confirmation_number(self) -> Locator:
        return self.page.locator("[data-test='confirmation-number']")

## business/flows/PaymentFlow.py

src/business/flows/payment_flow.py
from playwright.sync_api import Page, expect

from business.page.review_order_page import ReviewOrderPage
from business.page.payment_options_page import PaymentOptionsPage
from business.page.payment_confirmation_page import PaymentConfirmationPage


class PaymentFlow:
    def __init__(self, page: Page) -> None:
        self.review_order_page = ReviewOrderPage(page)
        self.payment_options_page = PaymentOptionsPage(page)
        self.payment_confirmation_page = PaymentConfirmationPage(page)

    # 1. Prerequisite: Validate logged in and on Review Order page
    def verify_user_logged_in_and_on_review_order_page(self) -> "PaymentFlow":
        expect(self.review_order_page.logged_in_indicator()).to_be_visible()
        expect(self.review_order_page.review_order_header()).to_be_visible()
        return self

    # 2. Prerequisite: Validate at least 1 item in cart
    def verify_cart_has_at_least_one_item(self) -> "PaymentFlow":
        # Prefer explicit count check
        count = self.review_order_page.cart_item_rows().count()
        assert count >= 1, f"Expected at least 1 cart item, but found {count}"
        return self

    # 3. Click Checkout and validate Payment Options page opens
    def click_checkout_and_verify_payment_options_page(self) -> "PaymentFlow":
        self.review_order_page.checkout_button().click()
        expect(self.payment_options_page.payment_options_header()).to_be_visible()
        return self

    # 4. Type valid credit card info
    def type_valid_credit_card_information(
        self,
        card_number: str,
        expiry: str,
        cvv: str,
        holder_name: str,
    ) -> "PaymentFlow":
        self.payment_options_page.card_number_input().fill(card_number)
        self.payment_options_page.card_expiry_input().fill(expiry)
        self.payment_options_page.card_cvv_input().fill(cvv)
        self.payment_options_page.card_holder_name_input().fill(holder_name)
        return self

    # 5. Type billing address
    def type_billing_address(
        self,
        line1: str,
        city: str,
        zip_code: str,
        country_value: str,
    ) -> "PaymentFlow":
        self.payment_options_page.billing_address_line1_input().fill(line1)
        self.payment_options_page.billing_city_input().fill(city)
        self.payment_options_page.billing_zip_input().fill(zip_code)
        self.payment_options_page.billing_country_select().select_option(country_value)
        return self

    # 6. Select shipping same as billing
    def select_shipping_same_as_billing(self, enabled: bool = True) -> "PaymentFlow":
        checkbox = self.payment_options_page.shipping_same_as_billing_checkbox()
        if enabled:
            checkbox.check()
        else:
            checkbox.uncheck()
        return self

    # 7. Click Pay
    def click_pay(self) -> "PaymentFlow":
        self.payment_options_page.pay_button().click()
        return self

    # 8. Wait and validate confirmation page opens
    def wait_for_transaction_and_verify_confirmation_page(self) -> "PaymentFlow":
        spinner = self.payment_options_page.processing_spinner()
        if spinner.count() > 0:
            expect(spinner).to_be_hidden()

        expect(self.payment_confirmation_page.confirmation_header()).to_be_visible()
        return self

    # Convenience: composed payment flow
    def complete_payment(
        self,
        card_number: str,
        expiry: str,
        cvv: str,
        holder_name: str,
        line1: str,
        city: str,
        zip_code: str,
        country_value: str,
    ) -> "PaymentFlow":
        return (
            self.verify_user_logged_in_and_on_review_order_page()
                .verify_cart_has_at_least_one_item()
                .click_checkout_and_verify_payment_options_page()
                .type_valid_credit_card_information(card_number, expiry, cvv, holder_name)
                .type_billing_address(line1, city, zip_code, country_value)
                .select_shipping_same_as_billing(True)
                .click_pay()
                .wait_for_transaction_and_verify_confirmation_page()
        )

## tests/PaymentFlowTest.py

src/tests/test_payment_flow.py
from core.base_test import BaseTest
from business.flows.payment_flow import PaymentFlow


class PaymentFlowTest(BaseTest):

    def test_should_complete_payment_flow(self):
        # Assumption: BaseTest already logged in via LoginFlow.SuccessfulLogin()
        # Navigate to Review Order page if login doesn't land there automatically
        self.page.goto("https://your-app.example.com/checkout/review-order")

        PaymentFlow(self.page).complete_payment(
            card_number="4111111111111111",
            expiry="12/30",
            cvv="123",
            holder_name="Test User",
            line1="1 Main Street",
            city="New York",
            zip_code="10001",
            country_value="US",
        )
