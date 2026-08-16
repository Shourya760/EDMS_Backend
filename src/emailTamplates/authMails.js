import { emailLayout } from "./emailLayout.js";


// 1. Welcome Email
export const welcomeEmail = (user) => ({
  subject: "Welcome to Our Platform",

  text: `Hello ${user.name},

Welcome to our platform!

Your account has been successfully created.

You can now login using your registered email address.

${process.env.WEBSITE_BASE}

Regards,
HR Team`,

  html: emailLayout(`
    <h2 style="margin-top:0; color:#1e293b;">
      Welcome to Our Platform 🎉
    </h2>

    <p>
      Hello <strong>${user.name}</strong>,
    </p>

    <p>
      Welcome! Your account has been successfully created.
    </p>

    <p>
      You can now login to your account using your registered email address.
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


// 2. Account Status Updated Email
export const accountStatusEmail = (user, status) => ({
  subject:
    status === true || status === "active"
      ? "Your Account Has Been Activated"
      : "Your Account Has Been Deactivated",

  text:
    status === true || status === "active"
      ? `Hello ${user.name},

Your account has been activated successfully.

You can now login to the platform:

${process.env.WEBSITE_BASE}

Regards,
HR Team`
      : `Hello ${user.name},

Your account has been deactivated.

If you believe this was done by mistake, please contact the HR Team.

Regards,
HR Team`,

  html: emailLayout(
    status === true || status === "active"
      ? `
        <h2 style="margin-top:0; color:#1e293b;">
          Account Activated ✅
        </h2>

        <p>
          Hello <strong>${user.name}</strong>,
        </p>

        <p>
          Your account has been <strong>activated</strong> successfully.
        </p>

        <p>
          You can now login to the platform.
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
      `
      : `
        <h2 style="margin-top:0; color:#1e293b;">
          Account Deactivated
        </h2>

        <p>
          Hello <strong>${user.name}</strong>,
        </p>

        <p>
          Your account has been <strong>deactivated</strong>.
        </p>

        <p style="color:#64748b; font-size:14px;">
          If you believe this was done by mistake, please contact the HR Team.
        </p>

        <p>
          Regards,<br />
          HR Team
        </p>
      `
  ),
});


// 3. Forgot Password Email
export const forgotPasswordEmail = (user, token) => {
  const baseUrl = (process.env.WEBSITE_BASE || "http://localhost:5173").replace(/\/$/, "");
  const resetUrl = `${baseUrl}/forgot-password?token=${encodeURIComponent(token)}`;

  return {
    subject: "Reset Your Password",

    text: `Hello ${user.name},

We received a request to reset your password.

You can reset your password using the link below:

${resetUrl}

This link will expire in 24 hours.

If you did not request a password reset, you can safely ignore this email.

Regards,
HR Team`,

    html: emailLayout(`
      <h2 style="margin-top:0; color:#1e293b;">
        Reset Your Password 🔐
      </h2>

      <p>
        Hello <strong>${user.name}</strong>,
      </p>

      <p>
        We received a request to reset your password.
      </p>

      <p>
        Click the button below to create a new password.
      </p>

      <div style="text-align:center; margin:30px 0;">
        <a
          href="${resetUrl}"
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
          Reset Password
        </a>
      </div>

      <p style="color:#64748b; font-size:14px;">
        This link will expire in 24 hours.
      </p>

      <p style="color:#64748b; font-size:14px;">
        If you did not request a password reset, you can safely ignore this email.
      </p>

      <p>
        Regards,<br />
        HR Team
      </p>
    `),
  };
};


// 4. Password Updated Email
export const passwordUpdatedEmail = (user) => ({
  subject: "Password Updated Successfully",

  text: `Hello ${user.name},

Your password has been updated successfully.

You can login to your account using the link below:

${process.env.WEBSITE_BASE}

If you did not make this change, please contact the HR Team immediately.

Regards,
HR Team`,

  html: emailLayout(`
    <h2 style="margin-top:0; color:#1e293b;">
      Password Updated Successfully
    </h2>

    <p>
      Hello <strong>${user.name}</strong>,
    </p>

    <p>
      Your password has been updated successfully.
    </p>

    <p>
      You can now login to your account.
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
      If you did not make this change, please contact the HR Team immediately.
    </p>

    <p>
      Regards,<br />
      HR Team
    </p>
  `),
});


// 5. User Information Updated Email
export const informationUpdatedEmail = (user) => ({
  subject: "Your Information Was Updated Successfully",

  text: `Hello ${user.name},

Your account information has been updated successfully.

You can login to your account using the link below:

${process.env.WEBSITE_BASE}

If you did not make this change, please contact the HR Team immediately.

Regards,
HR Team`,

  html: emailLayout(`
    <h2 style="margin-top:0; color:#1e293b;">
      Information Updated Successfully
    </h2>

    <p>
      Hello <strong>${user.name}</strong>,
    </p>

    <p>
      Your account information has been updated successfully.
    </p>

    <p>
      You can now login to your account to view your updated information.
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
      If you did not make this change, please contact the HR Team immediately.
    </p>

    <p>
      Regards,<br />
      HR Team
    </p>
  `),
});