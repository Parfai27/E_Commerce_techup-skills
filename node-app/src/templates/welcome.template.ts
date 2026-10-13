const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export const welcomeEmailTemplate = (name: string) => {
  const safeName = escapeHtml(name);
  const year = new Date().getFullYear();

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to E_Commerce App</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f4f0e8; font-family: Georgia, 'Times New Roman', serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f0e8; padding: 40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #fffdf8; border: 1px solid #e7e1d6;">

            <tr>
              <td style="background-color: #1c1917; padding: 28px 36px;">
                <p style="margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; color: #d6b25e;">KLab TechUp</p>
              </td>
            </tr>
            <tr>
              <td style="height: 4px; background-color: #d6b25e; font-size: 0; line-height: 0;">&nbsp;</td>
            </tr>

            <tr>
              <td style="padding: 40px 36px 8px;">
                <p style="margin: 0 0 12px; font-family: Arial, Helvetica, sans-serif; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #8a8175;">Your account is ready</p>
                <h1 style="margin: 0; color: #1c1917; font-size: 32px; font-weight: normal; line-height: 1.25;">Welcome, ${safeName}.</h1>
              </td>
            </tr>

            <tr>
              <td style="padding: 16px 36px 8px; color: #3f3a34; font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.7;">
                <p style="margin: 0 0 16px;">Thank you for creating an account with KLab TechUp. You can sign in with the email and password you just registered.</p>
                <p style="margin: 0;">Your product catalog is available as soon as you are signed in.</p>
              </td>
            </tr>

            <tr>
              <td style="padding: 28px 36px 8px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 16px 0; border-top: 1px solid #e7e1d6; font-family: Arial, Helvetica, sans-serif;">
                      <p style="margin: 0 0 4px; color: #d6b25e; font-size: 12px; letter-spacing: 1px;">01</p>
                      <p style="margin: 0; color: #1c1917; font-size: 15px; line-height: 1.5;">Sign in with your email and password.</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 16px 0; border-top: 1px solid #e7e1d6; font-family: Arial, Helvetica, sans-serif;">
                      <p style="margin: 0 0 4px; color: #d6b25e; font-size: 12px; letter-spacing: 1px;">02</p>
                      <p style="margin: 0; color: #1c1917; font-size: 15px; line-height: 1.5;">Keep your password private. We will never ask you to share it.</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 16px 0; border-top: 1px solid #e7e1d6; border-bottom: 1px solid #e7e1d6; font-family: Arial, Helvetica, sans-serif;">
                      <p style="margin: 0 0 4px; color: #d6b25e; font-size: 12px; letter-spacing: 1px;">03</p>
                      <p style="margin: 0; color: #1c1917; font-size: 15px; line-height: 1.5;">Browse products once you are signed in.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding: 28px 36px 36px; font-family: Arial, Helvetica, sans-serif; color: #3f3a34; font-size: 15px; line-height: 1.6;">
                <p style="margin: 0;">Warm regards,<br /><strong style="color: #1c1917;">KLab TechUp</strong></p>
              </td>
            </tr>

            <tr>
              <td style="background-color: #1c1917; padding: 22px 36px; text-align: center; font-family: Arial, Helvetica, sans-serif; color: #a8a29e; font-size: 12px; line-height: 1.6;">
                <p style="margin: 0 0 6px;">If you did not create this account, you can ignore this email.</p>
                <p style="margin: 0;">&copy; ${year} KLab TechUp. All rights reserved.</p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
`;
};
