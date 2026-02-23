---
trigger: always_on
---

Create a Bond Yield Calculator REST API using NestJS and TypeScript.

## Initial Setup
Create a new NestJS project with proper project structure.

## API Requirements

Create a single POST endpoint that accepts bond parameters and returns all calculated values.

### Endpoint
POST `/api/bond/calculate`

### Request Body
Accept JSON with these fields:
- faceValue: number (e.g., 1000)
- couponRate: number (e.g., 5 for 5%)
- marketPrice: number (e.g., 950)
- yearsToMaturity: number (e.g., 10)
- frequency: string ("annual" or "semi-annual")

### Response Body
Return JSON with:
- currentYield: number (percentage)
- yieldToMaturity: number (percentage, calculated with Newton-Raphson)
- totalInterest: number (currency amount)
- status: string ("premium", "discount", or "par")
- cashFlows: array of objects, each containing:
  - period: number
  - paymentDate: string (ISO date)
  - couponPayment: number
  - cumulativeInterest: number
  - remainingPrincipal: number

## Calculation Requirements

### Current Yield
Calculate as: (Annual Coupon Payment / Market Price) × 100

### Yield to Maturity (YTM)
Implement using Newton-Raphson iterative method:
1. Account for payment frequency (annual vs semi-annual)
2. Start with initial guess of 5%
3. Calculate present value of all cash flows at current YTM guess
4. Calculate the derivative for Newton-Raphson adjustment
5. Update YTM estimate: ytm = ytm - (error / derivative)
6. Iterate until error < 0.01 or max 100 iterations
7. Annualize the result based on payment frequency
8. Return as percentage

### Total Interest
Calculate as: Annual Coupon Payment × Years to Maturity

### Premium/Discount Status
Compare market price to face value:
- If marketPrice > faceValue: return "premium"
- If marketPrice < faceValue: return "discount"
- If marketPrice = faceValue: return "par"

### Cash Flow Schedule
Generate an array based on payment frequency:
- Calculate number of periods (years × frequency)
- For each period:
  - Period number (1, 2, 3...)
  - Payment date (calculate from today, incrementing by frequency interval)
  - Coupon payment (annual coupon / periods per year)
  - Cumulative interest (running total of coupon payments)
  - Remaining principal (0 for all periods except last, then face value)

## Technical Implementation

Structure the code properly:
- Create a DTO (Data Transfer Object) for the request body with validation
- Create a DTO for the response
- Create a Service class that contains all calculation logic
- Create a Controller that handles the HTTP endpoint
- Use class-validator for input validation:
  - faceValue, marketPrice, yearsToMaturity must be positive
  - couponRate must be between 0 and 20
  - frequency must be either "annual" or "semi-annual"
- Return proper HTTP status codes
- Handle errors gracefully with appropriate error messages

## Code Organization

- Separate calculation logic into dedicated methods
- Each calculation (currentYield, YTM, totalInterest, etc.) should be its own method
- Add TypeScript types for all parameters and return values
- Include comments explaining the Newton-Raphson algorithm
- Use descriptive variable names
- Follow NestJS best practices

## Validation & Error Handling

- Validate all inputs before processing
- Return 400 Bad Request for invalid inputs with clear error messages
- Return 500 Internal Server Error for calculation failures
- Log errors appropriately

Start with a working API endpoint that correctly calculates all values. We can add features like swagger documentation or additional endpoints later.