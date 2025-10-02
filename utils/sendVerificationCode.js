import dotenv from 'dotenv';
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";


export const sendVerificationEmail = async (email, codigo, purpose = 'verify') => {
 dotenv.config()
 const mailersend = new MailerSend({
   apiKey: process.env.MAILERSEND_KEY,
});


 const sentFrom = new Sender("test-86org8e56yzgew13.mlsender.net", "ExplorAR");


const recipients = [
 new Recipient(email)
];


const title = purpose === 'reset' ? 'Password Reset' : 'Email Verification';
const subtitle = purpose === 'reset' ? 'Usa este código para resetear tu contraseña.' : 'Usa este código para verificar tu email.';


const emailParams = new EmailParams()
 .setFrom(sentFrom)
 .setTo(recipients)
 .setReplyTo(sentFrom)
 .setSubject(title)
 .setHtml(`
   <!DOCTYPE html>
   <html>
   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <style>
       body {
         margin: 0;
         padding: 0;
         font-family: Arial, sans-serif;
         background-color: #f4f4f4;
         color: #333;
       }
       .email-container {
         max-width: 600px;
         margin: 20px auto;
         background-color: #ffffff;
         border-radius: 8px;
         box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
         overflow: hidden;
       }
       .email-header {
         background-color: #007bff;
         color: #ffffff;
         text-align: center;
         padding: 20px;
       }
       .email-header h1 {
         margin: 0;
         font-size: 24px;
       }
       .email-body {
         padding: 20px;
         line-height: 1.6;
         text-align: center;
       }
       .email-body p {
         font-size: 16px;
         margin-bottom: 20px;
       }
       .token {
         display: inline-block;
         padding: 10px 20px;
         background-color: #007bff;
         color: #ffffff;
         font-size: 18px;
         font-weight: bold;
         text-decoration: none;
         border: none;
         border-radius: 5px;
         cursor: pointer;
         margin-top: 20px;
       }
       .token:hover {
         background-color: #0056b3;
       }
       .email-footer {
         background-color: #f4f4f4;
         text-align: center;
         padding: 10px;
         font-size: 14px;
         color: #777;
       }
     </style>
   </head>
   <body>
     <div class="email-container">
      <div class="email-header">
        <h1>${title}</h1>
       </div>
       <div class="email-body">
        <p>${subtitle}</p>
        <p>Código:</p>
        <div class="token">${codigo}</div>
       </div>
       <div class="email-footer">
        <p>© 2024 ExplorAR. All rights reserved.</p>
       </div>
     </div>
    
   </body>
   </html>
   `)
  
.setText(`${title}: ${codigo}`);


try {
 let data = await mailersend.email.send(emailParams);
 return(data);


} catch (error) {
 return error;
}
}
