import { emailLayout } from "./emailLayout.js";

export const documentVerified = (user, document) => ({
  subject: "Document Verified ✅",

  text: `Hello ${user.name},

Your ${document.document_type} has been successfully verified.

Regards,
HR Team`,

  html: emailLayout(`
    <h2>Document Verified ✅</h2>

    <p>Hello <strong>${user.name}</strong>,</p>

    <p>
      Your document has been successfully verified.
    </p>

    <div style="
      background:#f0fdf4;
      border:1px solid #bbf7d0;
      padding:15px;
      border-radius:6px;
      margin:20px 0;
    ">
      <strong>Document:</strong>
      ${document.document_type}
      <br><br>
      <strong>Status:</strong>
      <span style="color:#16a34a;">Verified</span>
    </div>

    <p>
      No further action is required for this document.
    </p>
  `)
});