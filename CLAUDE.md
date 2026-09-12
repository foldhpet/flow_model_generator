# Flow Model Generator

## Project Purpose

This project demonstrates how to build a **Flow Model generator** for test automation purposes. The Flow Model generator automates the creation of reusable test automation components that follow industry-leading design patterns and architectural principles.

The primary goal is to provide a tool that enables test automation engineers to:
- Efficiently generate Flow Models for test scripts
- Maintain separation of concerns between UI elements and user actions
- Enable building scalable Test Automation Frameworks (TAF) following the Tri-Layer Testing Architecture

## Core Concepts

### Flow Model Pattern

The Flow Model Pattern is an enhancement of the Page Object Model (POM), and addresses two key limitations:

1. **Single Responsibility Principle**: Traditional Page Object Models often violate SRP by combining element locators with action methods, leading to bloated, hard-to-maintain classes.
2. **Tester's Perspective**: POM has a developer-centric design mindset, whereas the Flow Model Pattern aligns with how test automation engineers naturally think about user interactions.

#### Key Principles:

- **Page Models**: Store only UI elements and their locators
- **Flow Models**: Store user actions performed against elements and combined sequences of user actions (user flows) that accomplish business goals

This separation enables better code reuse, clearer intent in test scripts, and easier maintenance as applications evolve.

**Reference**: https://www.peterfoldhazi.com/flow-model-pattern

### Tri-Layer Testing Architecture

The Tri-Layer Testing Architecture provides a structured blueprint for designing any Test Automation Solution (TAS). It defines three distinct layers, each with specific responsibilities:

#### Layer 1: Core Libraries
Independent, reusable libraries that form the foundation of the framework. These are designed to be tool-agnostic and portable across projects.

**Example libraries:**
- Base Test
- Base Page
- User Action
- Logger
- Reporter

#### Layer 2: Business Logic
Application-specific libraries that implement domain-relevant behavior and use the core libraries.

**Example libraries:**
- Page Model
- Flow Model
- Environment Properties

#### Layer 3: Test Scripts
Runnable test scripts that leverage both business logic and core libraries to validate application behavior.

**Example components:**
- Test Script

#### Key Advantages:

1. **Scalability**: Core libraries can be reused across multiple projects, reducing development time for new TAFs.
2. **Maintainability**: Clear separation of concerns makes the framework easier to update and extend.
3. **Abstraction**: Initial architecture design remains tool-agnostic before concrete tools are selected.
4. **Incremental Build**: Start with the first test, then progressively extract logic into core and business logic layers.

## Development Workflow

When implementing a TAF following this architecture:

1. **Design Phase**: Create an abstract, tool-agnostic Test Automation Architecture
2. **Foundation Phase**: Identify and select core tools (browser automation, test harness, etc.)
3. **Implementation Phase**:
   - Write your first test script
   - Extract reusable logic into business logic layer
   - Promote proven patterns into core libraries
   - Progressively add capabilities as more tests are created

## Project Structure

```
flow_model_generator/
├── README.md                               # Project overview
├── CLAUDE.md                               # This file
├── LICENSE
├── package.json                            # Root devDependency on @playwright/test
├── .claude/
│   └── skills/
│       └── flow-model-generation/
│           └── SKILL.md                    # The Flow Model generator itself (see below)
├── docs/
│   ├── FLOW-MODEL.md                       # Flow Model Pattern documentation
│   ├── TRI-LAYER.md                        # Tri-Layer Architecture documentation
│   ├── FLOW-MODELS-DESIGN-EXAMPLE.md       # Example flow diagram/design doc output
│   ├── FLOW-MODEL-JAVA-EXAMPLE.md          # Flow Model Pattern example for Java
│   ├── FLOW-MODEL-PYTHON-EXAMPLE.md        # Flow Model Pattern example for Python
│   └── FLOW-MODEL-TYPESCRIPT-EXAMPLE.md    # Flow Model Pattern example for TypeScript
├── example-playwright-taf/                 # Baseline Playwright TAF, single test, no Flow Models yet
│   └── src/{business,config,core}, tests/LandingPageTest.spec.ts
└── example-playwright-taf-with-models/     # Same TAF after running the generator
    ├── docs/                               # EXAMPLE-PROMPT.md, FLOW-MODELS-DESIGN.md, USER-FLOWS.md
    ├── src/business/flows/                 # login.flow.ts, menu-navigation.flow.ts
    ├── src/business/pages/                 # about, articles, blog, conferences, contact,
    │                                        # header-navigation, home, login page models
    └── tests/                              # LandingPageTest, LoginTest, MenuNavigationTest specs
```

### The Generator Skill

The actual Flow Model generator is implemented as a Claude Code skill at
`.claude/skills/flow-model-generation/SKILL.md`. Given a test file (or a test name pattern), it:

1. Analyzes the test to identify the user workflow and required page/flow interactions
2. Updates `docs/FLOW-MODELS-DESIGN.md` in the target project with a flow diagram
3. Generates/updates flow model classes in `business/flows/{flow-name}.flow.ts`
4. Generates/updates page model classes in `business/pages/{page-name}.page.ts`

`example-playwright-taf-with-models` is the running example of this skill's output: it started
as a copy of `example-playwright-taf` (a single landing-page test with no models) and now has
page models, flow models, and multiple generated test specs.

## Collaboration Notes

When working with this codebase:
- Reference the Flow Model Pattern documentation when designing new Flow Models
- Ensure all components align with the Tri-Layer Testing Architecture
- Prioritize code generation tools that respect the separation between Page Models and Flow Models
- Keep core libraries portable and tool-independent
