import { AppError } from "./app-error";
import nodemailer from "nodemailer";
import { GMAIL_USERNAME, GMAIL_PASSWORD } from "../config/index";

const sendMailGmail = async (body: string, to: string[], subject?: string) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: GMAIL_USERNAME, // generated ethereal user
      pass: GMAIL_PASSWORD, // generated ethereal password
    },
  });
  const recipients: string = to.toString();
  let mailOptions = {
    from: '"shippers" <noreply@shippers.com>',
    to: recipients,
    subject: subject ? subject : "New mail from myPaddi",
    generateTextFromHTML: true,
    html: body,
  };
  let info = await transporter.sendMail(mailOptions);
  // if (info) {
  //     return info;
  // }
  return info;
};
export const sendPasswordReset = async (code: string, user: any) => {
  const message = `<h3>Hi ${user.username},</h3>
        <p>Here's the password reset code you requested: <strong>${code}</strong></p>
        <p>If you believe you did this in error, please ignore this email.</p>`;
  let sentMail = await sendMailGmail(
    message,
    [user.email],
    "Password Reset Code"
  );
  if (sentMail) {
    return "success";
  }
  throw new AppError("Could not send mail");
};

export const sendMailAfterRegister = async (user: any) => {
  const message = `<h3>Hi ${user.username},</h3>
        <p>You have registered <strong>successfully</strong></p>
        <p>If you believe you did this in error, please ignore this email.</p>`;
  let sentMail = await sendMailGmail(
    message,
    [user.email],
    "Registered Successfully"
  );
  if (sentMail) {
    return "success";
  }
  throw new AppError("Could not send mail");
};

export const sendMailAfterDeleteAccount = async (user: any) => {
  const message = `<h3>Hi ${user.username},</h3>
        <p>Your account has been deleted <strong>successfully</strong></p>
        <p>If you believe you did this in error, please ignore this email.</p>`;
  let sentMail = await sendMailGmail(message, [user.email], "Account Deleted");
  if (sentMail) {
    return "success";
  }
  throw new AppError("Could not send mail");
};
