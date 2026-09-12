---
name: flow-model-generation
description: Analyze tests and generate flow models, page models, and design documentation
---

# Flow Model Generation Skill

Analyzes Playwright test files and generates or updates flow models, page models, and design documentation for the TAF (Test Automation Framework).

## What It Does

1. **Analyzes Test Files** — Reads selected test files to understand user workflows
2. **Updates Documentation** — Creates or updates flow diagrams in target folder's `docs/FLOW-MODELS-DESIGN.md`
3. **Generates Flow Models** — Creates or updates flow model classes in target folder's `business/flows/`
4. **Generates Page Models** — Creates or updates page model classes in target folder's `business/pages/`

## Process

### Step 1: Analyze Test & Identify Flow Models
- Read the selected test file(s)
- Identify the test scenario and user workflow
- Determine if existing flow models can be reused or if new ones are needed
- Identify page interactions and whether new page models are required

### Step 2: Update FLOW-MODELS-DESIGN.md
- Add or update the flow diagram showing the user journey
- Include step-by-step flow visualization (ASCII art)
- Document which test(s) use this flow
- Link to corresponding flow model and page model classes

### Step 3: Create or Update Flow Models
- Create flow model files in `business/flows/` directory
- Follow naming convention: `{flow-name}.flow.ts`
- Each flow model should:
  - Orchestrate page interactions into cohesive workflows
  - Have clear, single-purpose methods for each step
  - Delegate to sub-flows where appropriate
  - Include comprehensive console logging with emoji indicators
  - Have proper error handling

### Step 4: Create or Update Page Models
- Create page model files in `business/pages/` directory
- Follow naming convention: `{page-name}.page.ts`
- Each page model should:
  - Encapsulate selectors and interactions for a specific page
  - Have methods for each user action (click, fill, select, etc.)
  - Have getters for page validation (isVisible, hasError, etc.)
  - Include proper waits and error handling

## Usage

Ask Claude Code directly:

```
Generate flow models for: tests/my-test.spec.ts
```

Or by test name pattern:

```
Generate flow models for test: 'open EPAM base page and retrieve page title'
```

## Output

The skill will:
1. Display analysis of the test and identified flows
2. Show the updated flow diagram(s)
3. List created/modified files
4. Provide implementation summary
