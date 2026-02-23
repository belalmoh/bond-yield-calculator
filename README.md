# Bond Yield Calculator

A full-stack web application designed for analyzing and calculating bond metrics, including Yield to Maturity (YTM), Current Yield, Total Interest, Premium/Discount statuses, and a full cash flow schedule.

## Project Structure

The project is structured into two main directories: `frontend` and `backend`.

### Backend
The backend is built with **NestJS**, **TypeScript**, and **class-validator** for robust input validation. It handles all complex financial calculations and serves the REST API.

**Key Features:**
- A single core calculating endpoint: `POST /api/bond/calculate`
- Fully typed data transfer objects (DTOs) for incoming bond parameters and outgoing results.
- **Yield to Maturity (YTM)** calculation implemented using the **Newton-Raphson iterative mathematical method**.
- Validations to handle incorrect, out-of-range, and edge cases gracefully.

**Tech Stack:** NestJS, TypeScript, Jest (for testing)

### Frontend
The frontend is a fast and responsive React application built with **Vite**, **TypeScript**, and **Tailwind CSS**.

**Key Features:**
- A modern financial dashboard layout separating user input from the calculated results.
- Highlight metrics cards for Current Yield, Yield to Maturity, Total Interest, and Trading Status.
- Full Cash Flow Schedule display mapped out cleanly in a responsive table.
- Form validation to capture safe inputs and inform the user of missteps before initiating a backend call.
- Dynamic dark and light mode UI with consistent styling.

**Tech Stack:** React 19, Vite, TypeScript, Tailwind CSS, Lucide React (for icons)

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation & Running

The applications rely on environment variables for API routing and port declarations.
By default:
- **Frontend** runs on port `3005`
- **Backend** runs on port `3006`

#### 1. Start the Backend
```bash
cd backend
npm install
npm run start:dev
```
The NestJS server will start on `http://localhost:3006`.

#### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
The Vite development server will start on `http://localhost:3005`.

## API Documentation

### `POST /api/bond/calculate`

**Request Body Example:**
```json
{
  "faceValue": 1000,
  "couponRate": 5,
  "marketPrice": 950,
  "yearsToMaturity": 10,
  "frequency": "semi-annual"
}
```

**Response Body Example:**
```json
{
  "currentYield": 5.26,
  "yieldToMaturity": 5.66,
  "totalInterest": 500,
  "status": "discount",
  "cashFlows": [
    {
      "period": 1,
      "paymentDate": "2024-08-25T00:00:00.000Z",
      "couponPayment": 25,
      "cumulativeInterest": 25,
      "remainingPrincipal": 0
    },
    ...
  ]
}
```
