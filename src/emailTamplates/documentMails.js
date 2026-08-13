import { emailLayout } from "./emailLayout.js";


// All Documents Verified Email
export const allDocumentsVerifiedEmail = (employee) => ({
    subject: "All Your Documents Have Been Verified 🎉",

    text: `Hello ${employee.name},

We're happy to let you know that all of your submitted documents have been successfully verified by the HR Team.

Your document verification process is now complete.

If you have any questions, please contact the HR Team.

Regards,
HR Team`,

    html: emailLayout(`
    <h2 style="margin-top:0; color:#1e293b;">
      All Documents Verified 🎉
    </h2>

    <p>
      Hello <strong>${employee.name}</strong>,
    </p>

    <p>
      We're happy to let you know that all of your submitted documents
      have been successfully verified by the HR Team.
    </p>

    <div style="
      margin:25px 0;
      padding:18px;
      background:#f0fdf4;
      border:1px solid #bbf7d0;
      border-radius:8px;
      text-align:center;
    ">
      <strong style="color:#166534;">
        ✓ Document verification completed
      </strong>
    </div>

    <p>
      Your document verification process is now complete.
    </p>

    <p style="color:#64748b; font-size:14px;">
      If you have any questions, please contact the HR Team.
    </p>

    <p>
      Regards,<br />
      HR Team
    </p>
  `),
});