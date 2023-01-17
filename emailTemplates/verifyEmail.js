module.exports = function verifyEmail(firstName, email, confirmationCode) {
  return `
  <html>
    <body>
      <div
        style="width: 100%; margin-left: auto, margin-right: auto; padding: 12px; font-family: Arial;"
      >
        <div
          style="
            background-color: #3c7daa;
            color: white;
            padding: 8px;
            padding-top: 48px;
            padding-bottom: 48px;
            text-align: center;
            font-weight: bold;
            font-size: 36px;
          "
        >
          HOPE TESTING SERVICE
        </div>
        <h3 style="color: gray">Hi ${firstName},</h3>
        <p>
          Thank you for registering in Hope Testing Service. Please click on the button to complete the
          verification process for ${email}
        </p>
        <div style="text-align: center">
          <button
            type="button"
            style="
              color: white;
              background-color: #3c7daa;
              border: none;
              border-radius: 4px;
              padding: 8px;
            "
          >
            <a
              style="text-decoration: none; color: white"
              href="${process.env.BACKEND_URL}/verify-email?email=${email}&confirmationCode=${confirmationCode}"
            >
              Verify Your Email
            </a>
          </button>
        </div>
        <p>
          If you didn't attempt to verify your email address with Hope Testing Service, please delete this
          email.
        </p>
        <p>
          Regards, <br />
          <b>Hope Testing Service</b>
        </p>
      </div>
    </body>
  </html>
  `;
};
