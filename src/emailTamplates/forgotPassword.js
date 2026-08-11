import { emailLayout } from "./emailLayout.js";

export const forgotPasswordEmail = (user, token) => ({
    subject: "Reset Your Password",

    text: `Dear ${user.name},

        A request has been received to reset the password for your account.

        To reset your password, please use the link below:

        ${process.env.WEBSITE_BASE}/forgot-password?token=${token}

        If you did not request this password reset, please ignore this email. Your account will remain secure.

        Regards,
        HR Team`,

    html: emailLayout(`
    <h2 style="margin-top:0; color:#1e293b;">
      Reset Your Password
    </h2>

    <p>
      Dear <strong>${user.name}</strong>,
    </p>

    <p>
      A request has been received to reset the password for your account.
    </p>

    <p>
      To reset your password, please click the button below.
    </p>

    <div style="text-align:center; margin:30px 0;">
      <a
        href="${process.env.WEBSITE_BASE}/forgot-password?token=${token}"
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
      If you did not request this password reset, please ignore this email.
      Your account will remain secure.
    </p>
  `)
});