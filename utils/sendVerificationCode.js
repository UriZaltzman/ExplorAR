// import dotenv from 'dotenv';
// import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";


// export const sendVerificationEmail = async (email, codigo, purpose = 'verify') => {
//  dotenv.config()
//  const mailersend = new MailerSend({ apiKey: process.env.MAILERSEND_KEY });
//  const sentFrom = new Sender("test-86org8e56yzgew13.mlsender.net", "ExplorAR");
//  const recipients = [ new Recipient(email) ];
//  const title = purpose === 'reset' ? 'Password Reset' : 'Email Verification';
//  const subtitle = purpose === 'reset' ? 'Usa este código para resetear tu contraseña.' : 'Usa este código para verificar tu email.';
//  const emailParams = new EmailParams()
//   .setFrom(sentFrom)
//   .setTo(recipients)
//   .setReplyTo(sentFrom)
//   .setSubject(title)
//   .setHtml(`...`)
//   .setText(`${title}: ${codigo}`);
//  try { return await mailersend.email.send(emailParams); } catch (error) { return error; }
// }

// Stub: mail sending disabled (returns immediately)
//export const sendVerificationEmail = async (email, codigo, purpose = 'verify') => {
// return { disabled: true };
// }
