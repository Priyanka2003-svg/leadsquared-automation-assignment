# LeadSquared Automation Engineer Assignment

## Overview
This project contains end-to-end tests using Playwright with TypeScript for web application testing.

## Setup Instructions

1. Clone the repository
2. Install dependencies: `npm install`
3. Install browsers: `npm run install:browsers`
4. Run tests: `npm test`

## Test Scenarios Covered

- ✅ Login workflow with screenshot capture
- ✅ User CRUD operations (Create, Read, Update, Delete)
- ✅ Search and filter functionality
- ✅ UI validation after each operation

## Architecture

- **Page Object Model**: Organized page interactions
- **Helper Functions**: Reusable utilities
- **Environment Configuration**: Flexible test data management
- **Robust Error Handling**: Retry mechanisms and waits

## Reports
- HTML Report: `npx playwright show-report`
- JSON Report: Available in `test-results.json`

## Key Features
- Screenshot capture on login success
- Dynamic test data generation
- Flaky test handling with retries
- Cross-browser support
- Detailed reporting