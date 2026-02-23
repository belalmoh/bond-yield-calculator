---
trigger: always_on
---

Create a Bond Yield Calculator frontend using React, Vite, and TypeScript. This is the UI only - all calculations will be handled by a separate NestJS backend API.

## Initial Setup
Create a new React TypeScript project with Vite and set up Tailwind CSS for styling.

## Application Requirements

Build a single-page calculator interface that communicates with a backend API.

### Input Form
Create a form with these fields:
- Face Value (number input, default: 1000, label: "Face Value ($)")
- Annual Coupon Rate (number input with decimals, default: 5, label: "Annual Coupon Rate (%)")
- Market Price (number input, default: 950, label: "Market Price ($)")
- Years to Maturity (number input, default: 10, label: "Years to Maturity")
- Coupon Frequency (dropdown with options: "annual" and "semi-annual", default: "semi-annual")

Add a "Calculate" button that sends the inputs to the backend API.

### Display Results
Show the API response in a clean, organized layout:

**Metrics Cards** (4 separate cards/sections):
- Current Yield (percentage with 2 decimals)
- Yield to Maturity / YTM (percentage with 2 decimals, make this prominent)
- Total Interest Earned (currency with 2 decimals)
- Premium/Discount Status (text badge: "Trading at Premium", "Trading at Discount", or "Trading at Par")

**Cash Flow Schedule Table**:
Display the cash flow data from API as a table with columns:
- Period
- Payment Date
- Coupon Payment (currency)
- Cumulative Interest (currency)
- Remaining Principal (currency)

### API Integration

Create a service/hook to call the backend:
- Endpoint: POST `/api/bond/calculate`
- Request body: all 5 input values as JSON
- Response: will contain all calculated values and cash flow array
- Handle loading states while waiting for API response
- Handle and display any API errors gracefully

### Design Requirements

Create a modern, professional financial dashboard:
- Clean layout separating inputs from results
- Visual cards for each metric with proper spacing
- Color-code the premium/discount indicator (green for discount, blue for premium, gray for par)
- Scrollable table with sticky header if content is long
- Responsive design (works on mobile and desktop)
- Professional color scheme suitable for financial applications
- Show loading spinner/state while API call is in progress
- Disable the Calculate button while loading

Use Tailwind CSS for all styling.

### Technical Requirements

- Use React hooks (useState for form inputs, API response state)
- Use fetch or axios for API calls
- TypeScript interfaces for:
  - Input form data
  - API request body
  - API response structure
- Format all currency values with commas and 2 decimal places
- Format all percentages with 2 decimal places
- Input validation before sending to API (positive numbers, reasonable ranges)
- Show clear error messages if validation fails

### User Experience

- Real-time input validation with error messages
- Clear visual feedback when Calculate button is clicked
- Smooth loading state during API call
- Results should appear clearly after calculation completes
- Ability to modify inputs and recalculate

Start with a working implementation that can call the backend API and display results. We can iterate on design and features after the core functionality works.