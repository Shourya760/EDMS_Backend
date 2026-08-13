import { emailLayout } from "./emailLayout.js";


// 1. Employee Welcome Email
export const employeeWelcomeEmail = (employee) => ({
    subject: "Welcome to the Company 🎉",

    text: `Hello ${employee.name},

Welcome to the company!

We're happy to have you onboard.

You can now access the platform using your registered email address.

${process.env.WEBSITE_BASE}

Regards,
HR Team`,

    html: emailLayout(`
    <h2 style="margin-top:0; color:#1e293b;">
      Welcome to the Company 🎉
    </h2>

    <p>
      Hello <strong>${employee.name}</strong>,
    </p>

    <p>
      Welcome to the company!
    </p>

    <p>
      We're happy to have you onboard.
    </p>

    <p>
      You can now access the platform using your registered email address.
    </p>

    <div style="text-align:center; margin:30px 0;">
      <a
        href="${process.env.WEBSITE_BASE}"
        style="
          display:inline-block;
          background:#2563eb;
          color:#ffffff;
          padding:12px 24px;
          border-radius:6px;
          text-decoration:none;
          font-weight:bold;
        "
      >
        Login to Platform
      </a>
    </div>

    <p style="color:#64748b; font-size:14px;">
      Regards,<br />
      HR Team
    </p>
  `),
});


// 2. Employee Deleted Email
export const employeeDeletedEmail = (employee) => ({
    subject: "Account Update",

    text: `Hello ${employee.name},

We would like to inform you that your employee account has been deactivated.

You will no longer be able to access the company platform.

If you believe this was done by mistake or you need further information, please contact the HR Team.

Regards,
HR Team`,

    html: emailLayout(`
    <h2 style="margin-top:0; color:#1e293b;">
      Account Update
    </h2>

    <p>
      Hello <strong>${employee.name}</strong>,
    </p>

    <p>
      We would like to inform you that your employee account has been
      <strong>deactivated</strong>.
    </p>

    <p>
      You will no longer be able to access the company platform.
    </p>

    <p style="color:#64748b; font-size:14px;">
      If you believe this was done by mistake or you need further
      information, please contact the HR Team.
    </p>

    <p>
      Regards,<br />
      HR Team
    </p>
  `),
});