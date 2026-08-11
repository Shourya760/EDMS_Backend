import { emailLayout } from "./emailLayout.js";


export const adminRemoved = (user) => ({
  subject: "Admin Access Updated",

  text: `Hello ${user.name},

Your Super Admin access has been removed.

If you believe this was done by mistake, please contact the HR Team.

Regards,
HR Team`,

  html: emailLayout(`
    <h2>Admin Access Updated</h2>

    <p>Hello <strong>${user.name}</strong>,</p>

    <p>
      Your <strong style="color:#dc2626;">Super Admin</strong>
      access has been removed.
    </p>

    <div style="
      background:#fef2f2;
      border:1px solid #fecaca;
      padding:15px;
      border-radius:6px;
      margin:20px 0;
      color:#991b1b;
    ">
      Your account permissions have been changed.
    </div>

    <p>
      If you believe this was done by mistake, please contact
      the HR Team.
    </p>
  `)
});