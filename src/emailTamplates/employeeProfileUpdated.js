import { emailLayout } from "./emailLayout.js";

export const employeeProfileUpdated = (user) => ({
  subject: "Your Profile Has Been Updated",

  text: `Hello ${user.name},

Your employee profile has been successfully updated.

If you have any questions, please contact the HR Team.

Regards,
HR Team`,

  html: emailLayout(`
    <h2>Profile Updated ✅</h2>

    <p>Hello <strong>${user.name}</strong>,</p>

    <p>
      Your employee profile has been successfully updated.
    </p>

    <p>
      If you have any questions or notice anything incorrect,
      please contact the HR Team.
    </p>
  `)
});