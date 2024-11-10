### README.md

```markdown
# SRM Event Connect

SRM Event Connect is a web application designed for the Department of Computing Technologies at SRM Institute of Science and Technology (SRMIST). The application allows the department to manage event proposals submitted by applicants, maintain records, and automate communication via email.

## Features

- **Event Proposal Submission:** Allows users to submit event proposals including details such as event title, category, convenor information, financial support, and estimated budget.
- **Record Maintenance:** Maintains a comprehensive record of all submitted proposals.
- **Automated Email Notifications:** Sends confirmation emails to applicants upon approval of their proposals.
- **Excel File Upload:** Supports uploading data from an Excel file to add multiple event proposals at once.
- **User Authentication:** Secure login and authentication using NextAuth.
- **Responsive Design:** User-friendly interface compatible with various devices.

## Technologies Used

- **Frontend:** React, Next.js, Tailwind CSS
- **Backend:** Next.js API routes
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth
- **Email Service:** Nodemailer
- **Other Libraries:** Axios, XLSX

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/rakeshkanneeswaranofficial/proposal_cms_admin.git
   cd proposal_cms_admin
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Set up environment variables:

   Create a `.env` file in the root directory and add the following variables:

   ```plaintext
   DATABASE_URL=your_postgresql_database_url
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   EMAIL_HOST=your_email_host
   EMAIL_PORT=your_email_port
   EMAIL_USER=your_email_user
   EMAIL_PASSWORD=your_email_password
   ```

4. Run database migrations and generate Prisma client:

   ```sh
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. Start the development server:

   ```sh
   npm run dev
   ```

## Usage

- Visit `http://localhost:3000` to access the application.
- Log in using your credentials.
- Submit event proposals through the form.
- Upload Excel files to bulk add event proposals.
- Manage and view event proposals on the dashboard.

