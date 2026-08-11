import { emailLayout } from "./emailLayout.js";

export const employeeWelcome = (user) => ({
    subject: "Welcome to the Company 🎉",

    text: `Hello ${user.name},

Welcome to the company! We're happy to have you onboard.

You can access the platform here:
${process.env.WEBSITE_BASE}

Regards,
HR Team`,

    html: emailLayout(`
    <h2>Welcome 🎉</h2>

    <p>Hello <strong>${user.name}</strong>,</p>

    <p>
      Welcome to the company! We're happy to have you onboard.
    </p>

    <p>
      You can access the platform using the link below.
    </p>

    <a
      href="${process.env.WEBSITE_BASE}"
      style="
        display:inline-block;
        background:#2563eb;
        color:#fff;
        padding:12px 20px;
        border-radius:6px;
        text-decoration:none;
      "
    >
      Login to Platform
    </a>
  `)
});