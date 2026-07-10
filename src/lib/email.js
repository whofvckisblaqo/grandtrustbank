import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM || "GrandTrust Bank <support@grandtrustbank.com>";

// ---------- Shared layout ----------
function wrapEmail({ heading, body, accentColor = "#0A2540" }) {
  return `
  <div style="font-family: Arial, Helvetica, sans-serif; background:#f4f5f7; padding:32px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; margin:0 auto; background:#ffffff; border-radius:8px; overflow:hidden;">
      <tr>
        <td style="background:${accentColor}; padding:24px 32px;">
          <h1 style="color:#ffffff; font-size:20px; margin:0;">GrandTrust Bank</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:32px;">
          <h2 style="font-size:18px; color:#111; margin:0 0 16px;">${heading}</h2>
          <div style="font-size:15px; color:#333; line-height:1.6;">${body}</div>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 32px; background:#fafafa; border-top:1px solid #eee;">
          <p style="font-size:12px; color:#999; margin:0;">
            This is an automated message from GrandTrust Bank. If you did not expect this email, please contact support at grandtrustsuport@outlook.com immediately.
          </p>
        </td>
      </tr>
    </table>
  </div>`;
}

function fmtAmount(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

const SUPPORT_EMAIL = "grandtrustsuport@outlook.com";
const ADMIN_NOTIFICATION_EMAIL = "grandtrustsuport@outlook.com";

async function send({ to, subject, html }) {
  try {
    const result = await resend.emails.send({
      from: FROM,
      to,
      subject,
      html,
      replyTo: SUPPORT_EMAIL,
      bcc: ADMIN_NOTIFICATION_EMAIL,
    });
    return { success: true, result };
  } catch (err) {
    console.error("Email send failed:", err);
    return { success: false, error: err.message };
  }
}

// ---------- 1. Welcome / Signup ----------
export async function sendWelcomeEmail({ to, name, accountNumbers }) {
  const accountsList = accountNumbers
    .map((a) => `<li>${a.type}: <strong>${a.number}</strong></li>`)
    .join("");
  const html = wrapEmail({
    heading: `Welcome, ${name}!`,
    body: `
      <p>Your GrandTrust Bank account has been created successfully.</p>
      <ul>${accountsList}</ul>
      <p>You can now log in to your dashboard to manage transfers, cards, loans, and more.</p>
    `,
  });
  return send({ to, subject: "Welcome to GrandTrust Bank", html });
}

// ---------- 2. Transfers (sent) ----------
export async function sendTransferSentEmail({ to, name, amount, currency, recipientName, accountNumber, newBalance }) {
  const html = wrapEmail({
    heading: "Transfer Sent",
    body: `
      <p>Hi ${name}, a transfer has been made from your account.</p>
      <p><strong>Amount:</strong> ${fmtAmount(amount, currency)}<br/>
      <strong>To:</strong> ${recipientName}<br/>
      <strong>From Account:</strong> ${accountNumber}<br/>
      <strong>New Balance:</strong> ${fmtAmount(newBalance, currency)}</p>
    `,
  });
  return send({ to, subject: "Transfer Confirmation - GrandTrust Bank", html });
}

// ---------- 3. Transfers (received) ----------
export async function sendTransferReceivedEmail({ to, name, amount, currency, senderName, accountNumber, newBalance }) {
  const html = wrapEmail({
    heading: "You've Received a Transfer",
    body: `
      <p>Hi ${name}, your account has been credited.</p>
      <p><strong>Amount:</strong> ${fmtAmount(amount, currency)}<br/>
      <strong>From:</strong> ${senderName}<br/>
      <strong>Account:</strong> ${accountNumber}<br/>
      <strong>New Balance:</strong> ${fmtAmount(newBalance, currency)}</p>
    `,
    accentColor: "#0F5132",
  });
  return send({ to, subject: "You've Received a Transfer - GrandTrust Bank", html });
}

// ---------- 3b. Transfer submitted, pending admin approval ----------
export async function sendTransferPendingEmail({ to, name, amount, currency, recipientName, reference }) {
  const html = wrapEmail({
    heading: "Transfer Submitted",
    body: `
      <p>Hi ${name}, your transfer request has been submitted and is awaiting approval.</p>
      <p><strong>Amount:</strong> ${fmtAmount(amount, currency)}<br/>
      <strong>To:</strong> ${recipientName}<br/>
      <strong>Reference:</strong> ${reference}</p>
      <p>You'll receive another email once it's processed.</p>
    `,
    accentColor: "#8A6D00",
  });
  return send({ to, subject: "Transfer Pending Approval - GrandTrust Bank", html });
}

// ---------- 3c. Transfer declined by admin ----------
export async function sendTransferDeclinedEmail({ to, name, amount, currency, reference, reason }) {
  const html = wrapEmail({
    heading: "Transfer Declined",
    body: `
      <p>Hi ${name}, your transfer request could not be completed.</p>
      <p><strong>Amount:</strong> ${fmtAmount(amount, currency)}<br/>
      <strong>Reference:</strong> ${reference}</p>
      ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ""}
      <p>Please contact support if you have questions.</p>
    `,
    accentColor: "#7A1F1F",
  });
  return send({ to, subject: "Transfer Declined - GrandTrust Bank", html });
}

// ---------- 4. Deposit initiated/pending ----------
export async function sendDepositPendingEmail({ to, name, amount, currency, method }) {
  const html = wrapEmail({
    heading: "Deposit Received - Pending Review",
    body: `
      <p>Hi ${name}, we've received your deposit request of <strong>${fmtAmount(amount, currency)}</strong> via ${method}.</p>
      <p>It is currently under review. You'll receive another email once it's approved or declined.</p>
    `,
    accentColor: "#8A6D00",
  });
  return send({ to, subject: "Deposit Pending Review - GrandTrust Bank", html });
}

// ---------- 5. Deposit approved ----------
export async function sendDepositApprovedEmail({ to, name, amount, currency, newBalance }) {
  const html = wrapEmail({
    heading: "Deposit Approved",
    body: `
      <p>Hi ${name}, your deposit of <strong>${fmtAmount(amount, currency)}</strong> has been approved and credited to your account.</p>
      <p><strong>New Balance:</strong> ${fmtAmount(newBalance, currency)}</p>
    `,
    accentColor: "#0F5132",
  });
  return send({ to, subject: "Deposit Approved - GrandTrust Bank", html });
}

// ---------- 6. Deposit declined ----------
export async function sendDepositDeclinedEmail({ to, name, amount, currency, reason }) {
  const html = wrapEmail({
    heading: "Deposit Declined",
    body: `
      <p>Hi ${name}, unfortunately your deposit request of <strong>${fmtAmount(amount, currency)}</strong> was declined.</p>
      ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ""}
      <p>Please contact support or try again with valid details.</p>
    `,
    accentColor: "#7A1F1F",
  });
  return send({ to, subject: "Deposit Declined - GrandTrust Bank", html });
}

// ---------- 7. Withdrawal ----------
export async function sendWithdrawalEmail({ to, name, amount, currency, newBalance, status = "completed" }) {
  const html = wrapEmail({
    heading: `Withdrawal ${status === "completed" ? "Completed" : "Initiated"}`,
    body: `
      <p>Hi ${name}, a withdrawal of <strong>${fmtAmount(amount, currency)}</strong> has been ${status}.</p>
      <p><strong>New Balance:</strong> ${fmtAmount(newBalance, currency)}</p>
    `,
  });
  return send({ to, subject: "Withdrawal Notification - GrandTrust Bank", html });
}

// ---------- 8. Loan status ----------
export async function sendLoanStatusEmail({ to, name, loanAmount, currency, status, note }) {
  // status: "approved" | "declined" | "pending"
  const colorMap = { approved: "#0F5132", declined: "#7A1F1F", pending: "#8A6D00" };
  const html = wrapEmail({
    heading: `Loan Application ${status.charAt(0).toUpperCase() + status.slice(1)}`,
    body: `
      <p>Hi ${name}, your loan application for <strong>${fmtAmount(loanAmount, currency)}</strong> is now <strong>${status}</strong>.</p>
      ${note ? `<p>${note}</p>` : ""}
    `,
    accentColor: colorMap[status] || "#0A2540",
  });
  return send({ to, subject: `Loan Application ${status} - GrandTrust Bank`, html });
}

// ---------- 9. Card activity ----------
export async function sendCardActivityEmail({ to, name, action, cardLast4 }) {
  // action: "issued" | "frozen" | "unfrozen" | "cancelled"
  const messages = {
    issued: "A new card has been issued to your account.",
    frozen: "Your card has been frozen.",
    unfrozen: "Your card has been unfrozen and is now active.",
    cancelled: "Your card has been cancelled.",
  };
  const html = wrapEmail({
    heading: `Card ${action.charAt(0).toUpperCase() + action.slice(1)}`,
    body: `
      <p>Hi ${name}, ${messages[action] || "there has been activity on your card."}</p>
      <p><strong>Card:</strong> **** **** **** ${cardLast4}</p>
    `,
  });
  return send({ to, subject: `Card ${action} - GrandTrust Bank`, html });
}

// ---------- 10. Account frozen/unfrozen ----------
export async function sendAccountStatusEmail({ to, name, status, accountNumber, reason }) {
  // status: "frozen" | "unfrozen"
  const html = wrapEmail({
    heading: `Account ${status === "frozen" ? "Frozen" : "Unfrozen"}`,
    body: `
      <p>Hi ${name}, your account <strong>${accountNumber}</strong> has been ${status}.</p>
      ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ""}
      ${status === "frozen" ? "<p>Please contact support to resolve this.</p>" : ""}
    `,
    accentColor: status === "frozen" ? "#7A1F1F" : "#0F5132",
  });
  return send({ to, subject: `Account ${status} - GrandTrust Bank`, html });
}

// ---------- 11. OTP verification ----------
export async function sendOtpEmail({ to, name, otp }) {
  const html = wrapEmail({
    heading: "Verify Your Email",
    body: `
      <p>Hi ${name}, use the code below to verify your GrandTrust Bank account.</p>
      <p style="font-size:32px; font-weight:bold; letter-spacing:8px; color:#0A2540; text-align:center; margin:24px 0;">
        ${otp}
      </p>
      <p>This code expires in 10 minutes. If you didn't request this, ignore this email.</p>
    `,
  });
  return send({ to, subject: "Your GrandTrust Bank Verification Code", html });
}

// ---------- 12. KYC status ----------
export async function sendKycStatusEmail({ to, name, status, reason }) {
  // status: "verified" | "rejected"
  const html = wrapEmail({
    heading: status === "verified" ? "Identity Verified" : "Identity Verification Failed",
    body: `
      <p>Hi ${name}, your identity verification (KYC) submission has been <strong>${status === "verified" ? "approved" : "rejected"}</strong>.</p>
      ${status === "verified"
        ? "<p>Your account now has full access to all GrandTrust Bank features.</p>"
        : `${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ""}<p>Please resubmit a clear photo of your ID from your dashboard.</p>`
      }
    `,
    accentColor: status === "verified" ? "#0F5132" : "#7A1F1F",
  });
  return send({ to, subject: `Identity Verification ${status === "verified" ? "Approved" : "Rejected"} - GrandTrust Bank`, html });
}