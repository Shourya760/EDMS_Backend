export const emailLayout = (content) => `
  <div style="
    font-family: Arial, sans-serif;
    background: #f4f7fb;
    padding: 30px;
  ">
    <div style="
      max-width: 600px;
      margin: auto;
      background: white;
      border-radius: 10px;
      overflow: hidden;
    ">

      <div style="
        background: #2563eb;
        color: white;
        padding: 25px;
        text-align: center;
      ">
        <h2 style="margin:0;">Company</h2>
      </div>

      <div style="padding:30px;">
        ${content}
      </div>

      <div style="
        background:#f8fafc;
        padding:20px 30px;
        color:#64748b;
      ">
        Regards,<br>
        <strong>HR Team</strong>
      </div>

    </div>
  </div>
`;