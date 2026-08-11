import { emailLayout } from "./emailLayout.js";


export const adminWelcome = (user) => ({
  subject: "Welcome to the Company 🎉",

  text: `Hello ${user.name},

Welcome to the company! We're delighted to have you onboard as a Super Admin.

Regards,
HR Team`,

  html: emailLayout(`
    <h2>Welcome 🎉</h2>

    <p>Hello <strong>${user.name}</strong>,</p>

    <p>
      Welcome to the company! We're delighted to have you onboard
      as a <strong style="color:#2563eb;">Super Admin</strong>.
    </p>

    <a
      href="${process.env.WEBSITE_BASE}"
      style="
        display:inline-block;
        background:#2563eb;
        color:white;
        padding:12px 20px;
        border-radius:6px;
        text-decoration:none;
      "
    >
      Login to Platform
    </a>
  `)
});