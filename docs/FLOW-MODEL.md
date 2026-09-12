# Flow Model Design Pattern

## Description of the Flow Model design pattern

The Flow Model Pattern is a test automation specific design pattern, an enhancement of the Page Object Pattern and addresses the following two issues:
    1. Page Model design breaking the single responsibility principle
    2. The POM has more of a developer's design mindset instead of a tester's one

In the concept of the Flow Model Pattern, the Page Models store only the elements and their locators, whereas the Flow Models store the user actions against those elements, and the user flows, which are combined user actions.

Test scripts are calling directly from Flow Models, and never call from the Page Models.
Flow Models reference the page objects that are stored in Page Models.

Source information:
https://www.peterfoldhazi.com/flow-model-pattern
