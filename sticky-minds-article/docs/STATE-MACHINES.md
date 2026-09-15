# State Machines - Web Shop Example

Mermaid state diagrams derived from the flow diagrams in `docs/WEB-SHOP-FLOW-MODELS.md`.
Each state below corresponds to a step/page in that document; each transition corresponds to
a user action or Flow Model method call from the same document.

## Checkout Flow - Happy Path

Corresponds to "Flow 1: Checkout Flow - Happy Path" in `WEB-SHOP-FLOW-MODELS.md`, orchestrated
by `CheckoutFlow.completeCheckoutHappyPath()`.

```mermaid
stateDiagram-v2
    [*] --> ShoppingCart

    ShoppingCart --> ShippingAddress : Click "Checkout"

    ShippingAddress --> ShippingMethod : Enter Valid Address\n(AddressFlow.enterShippingAddress)

    ShippingMethod --> BillingAddress : Select Shipping Method\n(ShippingMethodFlow.selectShippingMethod)

    BillingAddress --> Payment : Tick "Same as Shipping Address"\n+ Click "Continue"\n(AddressFlow.confirmBillingAddress)

    Payment --> OrderConfirmation : Enter Valid Card & Click "Submit"\n(PaymentFlow.submitPayment)

    OrderConfirmation --> [*] : Verify Payment Successful\n+ Verify Order Details Visible\n(OrderConfirmationFlow.verifyOrderPlaced)
```

## Address Flow (shared Shipping & Billing Page)

Corresponds to "Sub-Flow: Address Flow" in `WEB-SHOP-FLOW-MODELS.md`. `ShippingAddress` and
`BillingAddress` are two different call sites of the same `ShippingBillingPage` Page Model,
reached via two different `AddressFlow` methods. The dashed transition shows the currently
undiagrammed alternate path noted in the design doc.

```mermaid
stateDiagram-v2
    [*] --> ShippingAddress

    state ShippingAddress {
        [*] --> FillingShippingFields
        FillingShippingFields --> ShippingValidated : No validation errors
        ShippingValidated --> [*] : Click "Continue"
    }

    ShippingAddress --> ShippingMethod
    ShippingMethod --> BillingAddress

    state BillingAddress {
        [*] --> BillingChoice
        BillingChoice --> SameAsShipping : Tick "Same as Shipping Address"
        BillingChoice --> DifferentBillingAddress : (future) leave unticked
        SameAsShipping --> [*] : Click "Continue"
        DifferentBillingAddress --> [*] : Fill fields & Click "Continue"
    }

    BillingAddress --> Payment

    ShippingMethod: Shipping Method Page
    Payment: Payment Information Page
```

## Order-Level Lifecycle (including out-of-scope Cart Management)

A wider view combining the happy-path checkout with the cart-management actions called out as
"Out of Scope for the Happy Path Diagram" in `WEB-SHOP-FLOW-MODELS.md`. Cart edits are
self-transitions on the `ShoppingCart` state and occur before `CheckoutFlow` begins.

```mermaid
stateDiagram-v2
    [*] --> ShoppingCart

    ShoppingCart --> ShoppingCart : Add Item to Cart\n(CartFlow.addItemToCart)
    ShoppingCart --> ShoppingCart : Update Item Quantity\n(CartFlow.updateItemQuantity)
    ShoppingCart --> ShoppingCart : Remove Item from Cart\n(CartFlow.removeItemFromCart)

    ShoppingCart --> Checkout : Click "Checkout"\n(CartFlow.proceedToCheckout)

    state Checkout {
        [*] --> ShippingAddress
        ShippingAddress --> ShippingMethod
        ShippingMethod --> BillingAddress
        BillingAddress --> Payment
        Payment --> OrderConfirmation
        OrderConfirmation --> [*]
    }

    Checkout --> [*] : Order Placed
```
