import { emailLayout } from "./emailLayout.js";

export const managerAssignedEmail = (employee, department) => ({
    subject: "You Have Been Assigned as a Manager 🎉",

    text: `Hello ${employee.name},

        Congratulations!

        You have been assigned as the manager of the ${department.department_name} department.

        You can now access the platform with your existing account.

        ${process.env.WEBSITE_BASE}

        If you have any questions, please contact the HR Team.

        Regards,
        HR Team`,

    html: emailLayout(`
    <h2 style="margin-top:0; color:#1e293b;">
      Congratulations! 🎉
    </h2>

    <p>
      Hello <strong>${employee.name}</strong>,
    </p>

    <p>
      You have been assigned as the manager of the
      <strong>${department.department_name}</strong> department.
    </p>

    <div style="
      margin:25px 0;
      padding:18px;
      background:#eff6ff;
      border:1px solid #bfdbfe;
      border-radius:8px;
      text-align:center;
    ">
      <strong style="color:#1d4ed8;">
        👔 ${department.department_name} Manager
      </strong>
    </div>

    <p>
      You can now access the platform using your existing account.
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
      If you have any questions, please contact the HR Team.
    </p>

    <p>
      Regards,<br />
      HR Team
    </p>
  `),
});
