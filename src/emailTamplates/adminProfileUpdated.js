import { emailLayout } from "./emailLayout.js";

export const adminProfileUpdated = (user, isActive) => ({
  subject: isActive
    ? "Your Admin Account Has Been Activated ✅"
    : "Your Admin Account Has Been Deactivated",

  text: isActive
    ? `Hello ${user.name},

          Your Super Admin account has been activated.

          You can now access the company platform normally.

          If you have any questions or need assistance, please contact the HR Team.

          Regards,
          HR Team`
    : `Hello ${user.name},

          Your Super Admin account has been deactivated.

          You will not be able to access the company platform while your account is inactive.

          If you believe this was done by mistake or you need further assistance, please contact the HR Team.

          Regards,
          HR Team`,

  html: emailLayout(
    isActive
      ? `
        <h2>Account Activated ✅</h2>

        <p>Hello <strong>${user.name}</strong>,</p>

        <p>
          Your <strong style="color:#2563eb;">Super Admin</strong>
          account has been successfully activated.
        </p>

        <div style="
          background:#f0fdf4;
          border:1px solid #bbf7d0;
          padding:15px;
          border-radius:6px;
          margin:20px 0;
          color:#166534;
        ">
          <strong>Account Status:</strong><br>
          Active
        </div>

        <p>
          You can now access the company platform normally.
        </p>

        <p>
          If you have any questions or need assistance,
          please contact the HR Team.
        </p>
      `
      : `
        <h2>Account Deactivated</h2>

        <p>Hello <strong>${user.name}</strong>,</p>

        <p>
          Your <strong style="color:#2563eb;">Super Admin</strong>
          account has been deactivated.
        </p>

        <div style="
          background:#fef2f2;
          border:1px solid #fecaca;
          padding:15px;
          border-radius:6px;
          margin:20px 0;
          color:#991b1b;
        ">
          <strong>Account Status:</strong><br>
          Inactive
        </div>

        <p>
          You will not be able to access the company platform
          while your account is inactive.
        </p>

        <p>
          If you believe this was done by mistake or you need
          further assistance, please contact the HR Team.
        </p>
      `
  )
});