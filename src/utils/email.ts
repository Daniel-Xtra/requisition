import { AppError } from "./app-error";
import nodemailer from "nodemailer";

import hbs from "nodemailer-express-handlebars";
import { GMAIL_USERNAME, GMAIL_PASSWORD } from "../config/index";

const sendMailGmail = async (
  template,
  firstname: string,
  to: string[],
  code?: string,
  subject?: string
) => {
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
  const handlebarOptions = {
    viewEngine: {
      extName: ".hbs",
      partialsDir: "./src/views",
      defaultLayout: false,
    },
    viewPath: "./src/views",
    extName: ".hbs",
  };

  transporter.use("compile", hbs(handlebarOptions));
  const recipients: string = to.toString();
  let mailOptions = {
    from: '"shippers" <noreply@shippers.com>',
    to: recipients,
    subject: subject ? subject : "New mail from shipper`s council",
    template,
    context: {
      firstname: firstname,
      code: code,
    },
  };
  let info = await transporter.sendMail(mailOptions);

  return info;
};
export const sendPasswordReset = async (code: string, user: any) => {
  let sentMail = await sendMailGmail(
    "password-reset",
    user.first_name,
    [user.email],
    code,
    "Password Reset Code"
  );
  if (sentMail) {
    return "success";
  }
  throw new AppError("Could not send mail");
};

export const sendMailAfterRegister = async (user: any) => {
  let sentMail = await sendMailGmail(
    " registration",
    user.first_name,
    [user.email],
    "",
    "Registered Successfully"
  );
  if (sentMail) {
    return "success";
  }
  throw new AppError("Could not send mail");
};

// export const sendMailAfterDeleteAccount = async (user: any) => {
//   const message = `<h3>Hi ${user.email},</h3>
//         <p>Your account has been deleted <strong>successfully</strong></p>
//         <p>If you believe you did this in error, please ignore this email.</p>`;
//   let sentMail = await sendMailGmail(message, [user.email], "Account Deleted");
//   if (sentMail) {
//     return "success";
//   }
//   throw new AppError("Could not send mail");
// };

export const sendEmailVerification = async (
  code: string,

  user: any
) => {
  let sentMail = await sendMailGmail(
    "verification",

    user.first_name,
    [user.email],
    code,
    "Email Verification Code"
  );
  if (sentMail) {
    return "success";
  }
  throw new AppError("Could not send email verification code");
};
