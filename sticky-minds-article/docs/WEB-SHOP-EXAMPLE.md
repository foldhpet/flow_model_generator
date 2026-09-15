# Web Shop Example

This is an example web shop, for demonstrating the Flow Model design pattern.
Users of this web shop are able to add items to their cart, make changes to their cart items, such as the amount to be bought of certain items, or removing items from the cart.
On the Users are able to fill in their

## Pages
Think about the payment process of a web shop, and let’s define the below pages:

Shopping Cart Page – Displays items in cart with quantities and prices
Shipping & Billing Page – Collects and validates customer delivery address
Shipping Method Page – Presents available shipping options with costs and delivery times
Payment Information Page – Captures card details and billing address
Order Confirmation Page – Displays order number, summary, tracking info, and receipt

## Happy Path Scenario
Below is a happy path scenario:
[Shopping Cart]
    ↓ (Click Checkout)
[Shipping Address]
    ↓ (Enter Valid Address)
    ↓ (Tick the box that says Same as Shipping Address)
    ↓ (Click Continue)
[Shipping Method]
    ↓ (Select Shipping Method)
    ↓ (Click Continue)
[Payment Information]
    ↓ (Enter Valid Card Info)
    ↓ (Click Submit)
[Order Confirmation]
    ↓ (Validate that the payment was successful)
    ↓ (Validate that the order details are visible)

