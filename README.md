This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


### Core Value Proposition

Users will experience a seamless, intuitive interface that guides them through simple actions to reduce their carbon footprint. The app provides personalized insights based on their activities, helping them make informed decisions and track progress over time.

### Ruthless MVP Scope

1. **User Registration/Login**
2. **Carbon Footprint Calculator**
3. **Daily Action Tracker**
4. **Personalized Insights Dashboard**

### Suggested Vertical Slices Order

1. **User Registration/Login (Feature 1)**
   - Implement user authentication using Supabase.
   - Create a registration and login flow.

2. **Carbon Footprint Calculator (Feature 2)**
   - Develop a simple calculator that estimates carbon emissions based on user inputs (e.g., transportation, energy usage).

3. **Daily Action Tracker (Feature 3)**
   - Integrate a daily action tracker where users can log their activities.
   - Calculate and display the total carbon footprint for the day.

4. **Personalized Insights Dashboard (Feature 4)**
   - Create a dashboard that displays personalized insights based on user data.
   - Provide actionable recommendations to reduce carbon emissions.

### Tech Stack Confirmation

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- @supabase/ssr
- Supabase
- Vercel

### Success Criteria

1. **User Authentication**
   - Users can register and log in successfully.
   - User data is securely stored in Supabase.

2. **Carbon Footprint Calculator**
   - The calculator provides accurate estimates based on user inputs.
   - Results are displayed immediately after input.

3. **Daily Action Tracker**
   - Users can log their daily actions.
   - Total carbon footprint for the day is calculated and displayed.

4. **Personalized Insights Dashboard**
   - The dashboard displays personalized insights.
   - Recommendations to reduce carbon emissions are actionable and relevant.

5. **Responsive Design**
   - The app is fully responsive on both desktop and mobile devices.// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
Brutal Checklist
UI States
Initial State:

User is on the registration/login page.
Registration form fields are empty.
Login form fields are empty.
Registration Form:

Username field is filled with valid input.
Email field is filled with a valid email address.
Password field is filled with a valid password (minimum length, complexity).
Confirm Password field matches the Password field.
Submit button is enabled.
Login Form:

Email field is filled with a valid email address.
Password field is filled with a valid password.
Submit button is enabled.
Error States:

Username field is empty or invalid.
Email field is empty or invalid (not a valid email).
Password field is empty or too short/complex.
Confirm Password field does not match the Password field.
Registration form submission fails due to server error.
Login form submission fails due to server error.
Edge Cases:

User tries to register with an already registered email.
User tries to login with a non-existent email or incorrect password.
User tries to navigate away from the registration/login page while filling out the form.
Errors
Validation Errors:

Username is required.
Email is required and must be a valid email address.
Password is required and must meet complexity requirements.
Confirm Password must match the Password field.
Server Errors:

Registration fails due to duplicate email.
Login fails due to invalid credentials.