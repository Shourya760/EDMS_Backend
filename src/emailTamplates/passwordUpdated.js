import { emailLayout } from "./emailLayout.js";

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
      You can login to your account using the button below.
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
  `),
});

