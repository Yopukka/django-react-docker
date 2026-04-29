def verification_email_html(first_name: str, verification_link: str) -> str:
    return f"""
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#111827;padding:32px;text-align:center;">
              <p style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:1px;">Sho - ping</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:48px 40px;text-align:center;">
              <p style="margin:0 0 8px;font-size:14px;color:#9ca3af;text-transform:uppercase;letter-spacing:2px;">Account Activation</p>
              <h1 style="margin:0 0 16px;font-size:28px;font-weight:700;color:#111827;">Verify your email address</h1>
              <p style="margin:0 0 32px;font-size:16px;color:#6b7280;line-height:1.6;">
                Hi <strong>{first_name}</strong>, thanks for signing up!<br>
                Click the button below to activate your account.<br>
                This link expires in <strong>30 minutes</strong>.
              </p>

              <!-- Button -->
              <a href="{verification_link}"
                 style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 36px;border-radius:8px;letter-spacing:0.5px;">
                Activate my account
              </a>

              <p style="margin:32px 0 0;font-size:12px;color:#9ca3af;">
                If the button doesn't work, copy and paste this link:<br>
                <a href="{verification_link}" style="color:#6b7280;word-break:break-all;">{verification_link}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                If you didn't create an account, you can safely ignore this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""


def reset_password_email_html(first_name: str, reset_link: str) -> str:
    return f"""
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#111827;padding:32px;text-align:center;">
              <p style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:1px;">Sho - ping</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:48px 40px;text-align:center;">
              <p style="margin:0 0 8px;font-size:14px;color:#9ca3af;text-transform:uppercase;letter-spacing:2px;">Password Reset</p>
              <h1 style="margin:0 0 16px;font-size:28px;font-weight:700;color:#111827;">Reset your password</h1>
              <p style="margin:0 0 32px;font-size:16px;color:#6b7280;line-height:1.6;">
                Hi <strong>{first_name}</strong>, we received a request to reset your password.<br>
                This link expires in <strong>30 minutes</strong>.
              </p>

              <!-- Button -->
              <a href="{reset_link}"
                 style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 36px;border-radius:8px;letter-spacing:0.5px;">
                Reset my password
              </a>

              <p style="margin:32px 0 0;font-size:12px;color:#9ca3af;">
                If the button doesn't work, copy and paste this link:<br>
                <a href="{reset_link}" style="color:#6b7280;word-break:break-all;">{reset_link}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                If you didn't request a password reset, you can safely ignore this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""
