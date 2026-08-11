import { emailLayout } from "./emailLayout.js";

export const employeeRemoved = (user) => ({
  subject: "Employee Account Updated",

  text: `Hello ${user.name},

Your employee account has been removed from the company platform.

If you believe this was done by mistake, please contact the HR Team.

Regards,
HR Team`,

  html: emailLayout(`
    <h2>Account Updated</h2>

    <p>Hello <strong>${user.name}</strong>,</p>

    <p>
      Your employee account has been removed from the
      company platform.
    </p>

    <div style="
      background:#fef2f2;
      border:1px solid #fecaca;
      padding:15px;
      border-radius:6px;
      color:#991b1b;
      margin:20px 0;
    ">
      You no longer have access to the company platform.
    </div>

    <p>
      If you believe this was done by mistake, please contact
      the HR Team.
    </p>
  `)
});