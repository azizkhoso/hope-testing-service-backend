module.exports = function thankyouEmail(firstName) {
  return `
    <html>
    <head>
      <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css" integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU" crossorigin="anonymous"><meta name="google-site-verification" content="OBHSOz2bJypVuqhse4EbUNPh6u4nlzaqmKaLoOryaqs" />
      <style>
        body {
          font-family: 'Arial', sans-serif;
        }
        
        .banner {
          background: rgb(119, 120, 240);
          color: white;
        }
        
        .banner, .email-content {
          padding: 2em;
          overflow: hidden;
        }
        
        h1 {
          font-family: 'Questrial', sans-serif;
          font-size: 3em;
          margin: 0 0 .5em 0;
        }
        
        hr {
          margin-top: 2em;
          background: blue;
        }
        
        a {
          text-decoration: none;
        }
        
        .sig {
          font-family: 'Dancing Script', cursive;
          font-size: 3.5em;
          margin: 0;
        }
        
        .email-container {
          background: #ffffff;
        }
        
        footer {
          text-align: center;
          margin: 0;
          padding: 1em;
        }
      </style>
    </head>
    <body>
      <main>
        <div class="email-container">
          <div class="email-body">
            <div class="banner">
              <h4>Registeration Successful!</h4>
              <h1 style="text-align: center;">HOPE TESTING SERVICE</h1>
            </div>
            <div class="email-content">
              <p>Hi ${firstName}!</p>
              <p>Thank you for joinging Hope Testing Service!
                With your account you have the options to prepare for your exams, tests and get ready to grow up!</p>
        <div style="text-align: center;">
          <button type="button" style="color: white; background-color: rgb(119, 120, 240); border: none; border-radius: 4px; padding: 8px;">
            <a style="text-decoration: none; color: white;" href="${process.env.BACKEND_URL}">
              Go to Hope Testing Service
            </a>
          </button>
        </div>
            <p>
              Regards, <br>
              <b>Hope Testing Service<b>
            </p>
            </div>
          </div>
        </div>
      </main>
    </body>
  </html>
  `;
};
