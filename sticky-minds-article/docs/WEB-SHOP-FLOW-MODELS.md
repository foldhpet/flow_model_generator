# Flow & Page Models Design - Web Shop Example

Generated from `docs/WEB-SHOP-EXAMPLE.md`. Target application: an example web shop covering
the checkout / payment journey - cart review, shipping address, shipping method, billing
address, payment, and order confirmation.

This document contains **design only** (flow diagrams, and the Page/Flow Models they imply).
No `.page.ts` / `.flow.ts` files have been generated from it yet.

## Pages (Page Model candidates)

| Page | Responsibility |
|------|-----------------|
| Shopping Cart Page | Displays items in cart with quantities and prices |
| Shipping & Billing Page | Collects and validates a customer address - reused for **both** the shipping address step and the billing address step |
| Shipping Method Page | Presents available shipping options with costs and delivery times |
| Payment Information Page | Captures card details and billing address confirmation |
| Order Confirmation Page | Displays order number, summary, tracking info, and receipt |

> **Design note - one Page Model, two flow steps**: the source scenario lists "Shipping
> Address" and "Billing Address" as two separate steps, but the Pages section names a single
> **Shipping & Billing Page**. This is intentional and is a good illustration of the Flow
> Model Pattern's separation of concerns: the *page* (its fields and locators - street,
> city, zip, country, "same as shipping" checkbox) is one reusable unit, while the *flow*
> decides how it is used differently each time it appears (first to capture a fresh shipping
> address, later to confirm/reuse it for billing). One Page Model, two Flow Model call sites.

## Flow 1: Checkout Flow - Happy Path

### (for 'a customer pays for the items in their cart using the default happy-path checkout journey')

```
┌─────────────────────────────────────────────────────────────────────┐
│                      CHECKOUT FLOW - HAPPY PATH                     │
└─────────────────────────────────────────────────────────────────────┘

    START (on Shopping Cart Page, items already in cart)
      │
      ▼
  ┌──────────────────────────────┐
  │ Click "Checkout"             │
  └──────────────────────────────┘
      │
      ▼
  ╔══════════════════════════════════════════╗
  ║ SHIPPING ADDRESS STEP                    ║  ◄─── AddressFlow.enterShippingAddress()
  ║ (Shipping & Billing Page)                ║       uses the Shipping & Billing Page Model
  ╚══════════════════════════════════════════╝
      │
      ▼
  ┌──────────────────────────────┐
  │ Enter Valid Address          │
  └──────────────────────────────┘
      │
      ▼
  ╔══════════════════════════════════════════╗
  ║ SHIPPING METHOD STEP                     ║  ◄─── ShippingMethodFlow.selectShippingMethod()
  ║ (Shipping Method Page)                   ║
  ╚══════════════════════════════════════════╝
      │
      ▼
  ┌──────────────────────────────┐
  │ Select Shipping Method       │
  └──────────────────────────────┘
      │
      ▼
  ╔══════════════════════════════════════════╗
  ║ BILLING ADDRESS STEP                     ║  ◄─── AddressFlow.confirmBillingAddress()
  ║ (Shipping & Billing Page, reused)        ║       same Page Model as the shipping step
  ╚══════════════════════════════════════════╝
      │
      ▼
  ┌──────────────────────────────┐
  │ Tick "Same as Shipping       │
  │ Address"                     │
  └──────────────────────────────┘
      │
      ▼
  ┌──────────────────────────────┐
  │ Click "Continue"             │
  └──────────────────────────────┘
      │
      ▼
  ╔══════════════════════════════════════════╗
  ║ PAYMENT STEP                             ║  ◄─── PaymentFlow.submitPayment()
  ║ (Payment Information Page)               ║
  ╚══════════════════════════════════════════╝
      │
      ▼
  ┌──────────────────────────────┐
  │ Enter Valid Card Details     │
  └──────────────────────────────┘
      │
      ▼
  ┌──────────────────────────────┐
  │ Click "Submit"               │
  └──────────────────────────────┘
      │
      ▼
  ╔══════════════════════════════════════════╗
  ║ CONFIRMATION STEP                        ║  ◄─── OrderConfirmationFlow.verifyOrderPlaced()
  ║ (Order Confirmation Page)                ║
  ╚══════════════════════════════════════════╝
      │
      ▼
  ┌──────────────────────────────┐
  │ Verify Payment Successful    │
  └──────────────────────────────┘
      │
      ▼
  ┌──────────────────────────────┐
  │ Verify Order Details Visible │
  │ (order number, summary,      │
  │  tracking info, receipt)     │
  └──────────────────────────────┘
      │
      ▼
    END
```

`CheckoutFlow.completeCheckoutHappyPath()` is the top-level orchestration method for the
diagram above. It does not contain any element interaction itself - it only calls, in order,
one method from each of the four sub-flows below. This keeps the "recipe" of the checkout
journey readable in one place, while every actual page interaction lives in the sub-flow that
owns it.

## Sub-Flow: Address Flow (shared by the shipping and billing steps)

### (for 'entering a shipping address, then reusing/confirming it as the billing address')

```
┌─────────────────────────────────────────────────────────────────────┐
│                          ADDRESS FLOW                                │
└─────────────────────────────────────────────────────────────────────┘

  enterShippingAddress()                confirmBillingAddress()
      │                                       │
      ▼                                       ▼
  ┌──────────────────────┐            ┌──────────────────────────┐
  │ Fill street / city /  │            │ Tick "Same as Shipping   │
  │ zip / country fields  │            │ Address" checkbox        │
  └──────────────────────┘            └──────────────────────────┘
      │                                       │
      ▼                                       ▼
  ┌──────────────────────┐            ┌──────────────────────────┐
  │ Verify no validation  │            │ Click "Continue"          │
  │ errors are shown      │            └──────────────────────────┘
  └──────────────────────┘
      │
      ▼
  ┌──────────────────────┐
  │ Click "Continue"      │
  └──────────────────────┘
```

Both methods act against the same `ShippingBillingPage` Page Model. A future "billing address
differs from shipping" alternate path would add a third `AddressFlow` method, e.g.
`enterDifferentBillingAddress()`, which leaves the checkbox unticked and fills the form a
second time - no changes to the Page Model would be required, only a new Flow Model method.

## Sub-Flow: Shipping Method Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                      SHIPPING METHOD FLOW                            │
└─────────────────────────────────────────────────────────────────────┘

    START
      │
      ▼
  ┌──────────────────────────────┐
  │ Read available shipping      │
  │ options (cost + delivery     │
  │ time per option)             │
  └──────────────────────────────┘
      │
      ▼
  ┌──────────────────────────────┐
  │ Select a shipping option     │
  └──────────────────────────────┘
      │
      ▼
    END
```

## Sub-Flow: Payment Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                            PAYMENT FLOW                               │
└─────────────────────────────────────────────────────────────────────┘

    START
      │
      ▼
  ┌──────────────────────────────┐
  │ Enter card number / expiry / │
  │ CVV                          │
  └──────────────────────────────┘
      │
      ▼
  ┌──────────────────────────────┐
  │ Click "Submit"               │
  └──────────────────────────────┘
      │
      ▼
    END
```

## Sub-Flow: Order Confirmation Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                     ORDER CONFIRMATION FLOW                          │
└─────────────────────────────────────────────────────────────────────┘

    START
      │
      ▼
  ┌──────────────────────────────┐
  │ Verify payment success       │
  │ indicator is shown           │
  └──────────────────────────────┘
      │
      ▼
  ┌──────────────────────────────┐
  │ Verify order number,         │
  │ summary, tracking info and   │
  │ receipt are visible          │
  └──────────────────────────────┘
      │
      ▼
    END
```

## Out of Scope for the Happy Path Diagram: Cart Management

The source description also mentions cart-editing actions that are not part of the checkout
happy path itself, but belong to the Shopping Cart Page / a `CartFlow`:

- Add an item to the cart
- Change the quantity of an item already in the cart
- Remove an item from the cart

These are candidate `CartFlow` methods (e.g. `addItemToCart()`, `updateItemQuantity()`,
`removeItemFromCart()`) that operate on the Shopping Cart Page before `CheckoutFlow` begins.
They are called out here so they aren't lost, but are not diagrammed above since the happy
path scenario starts from an already-populated cart.

═══════════════════════════════════════════════════════════════════════

## Summary of Page Models (design only - not yet generated)

### 1. **ShoppingCartPage**
   - Cart line items (product, quantity, unit price, line total)
   - "Checkout" button
   - Used by: CartFlow (add/update/remove), CheckoutFlow (entry point)

### 2. **ShippingBillingPage**
   - Address fields: name, street, city, zip/postal code, country
   - "Same as Shipping Address" checkbox (billing usage only)
   - "Continue" button
   - Validation/error message area
   - Used by: AddressFlow - for both the shipping step and the billing step

### 3. **ShippingMethodPage**
   - List of shipping options, each with a cost and an estimated delivery time
   - Selection control per option
   - Used by: ShippingMethodFlow

### 4. **PaymentInformationPage**
   - Card number, expiry, CVV fields
   - "Submit" button
   - Used by: PaymentFlow

### 5. **OrderConfirmationPage**
   - Payment success indicator
   - Order number, order summary, tracking info, receipt
   - Used by: OrderConfirmationFlow

═══════════════════════════════════════════════════════════════════════

## Summary of Flow Models (design only - not yet generated)

### 1. **CartFlow**
   - `addItemToCart(...)` / `updateItemQuantity(...)` / `removeItemFromCart(...)`
   - `proceedToCheckout()` - clicks "Checkout" on the Shopping Cart Page
   - Used by: pre-checkout cart-editing scenarios (not part of the happy path diagram)

### 2. **AddressFlow**
   - `enterShippingAddress(address)` - fills and continues from the Shipping & Billing Page
   - `confirmBillingAddress()` - ticks "Same as Shipping Address" and continues
   - (future) `enterDifferentBillingAddress(address)` - alternate path, billing ≠ shipping
   - Used by: CheckoutFlow (two call sites: shipping step, billing step)

### 3. **ShippingMethodFlow**
   - `selectShippingMethod(methodName)` - chooses a shipping option by name/cost/delivery time
   - Used by: CheckoutFlow

### 4. **PaymentFlow**
   - `submitPayment(cardDetails)` - fills card fields and submits
   - Used by: CheckoutFlow

### 5. **OrderConfirmationFlow**
   - `verifyOrderPlaced()` - asserts payment success and that order details are visible
   - Used by: CheckoutFlow

### 6. **CheckoutFlow** (top-level orchestration)
   - `completeCheckoutHappyPath(address, shippingMethod, cardDetails)` - orchestrates, in
     order: `ShoppingCartPage` checkout click → `AddressFlow.enterShippingAddress()` →
     `ShippingMethodFlow.selectShippingMethod()` → `AddressFlow.confirmBillingAddress()` →
     `PaymentFlow.submitPayment()` → `OrderConfirmationFlow.verifyOrderPlaced()`
   - Used by: the happy-path checkout test

═══════════════════════════════════════════════════════════════════════

## Scenario Mapping

| Scenario | Flow Model(s) | Status |
|----------|----------------|--------|
| Happy path checkout (`docs/WEB-SHOP-EXAMPLE.md`) | CheckoutFlow (→ AddressFlow, ShippingMethodFlow, PaymentFlow, OrderConfirmationFlow) | Design only - no code generated yet |
| Cart management (add/update/remove items) | CartFlow | Design only - inferred from the source description, no scenario/test defined yet |

═══════════════════════════════════════════════════════════════════════
