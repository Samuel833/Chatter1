import  nodemailer  from "nodemailer";

const sendEmail = (options: { to: any; subject: any; text: any; }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: 'noreply',
    to: options.to,
    subject: options.subject,
    html: options.text,
  };

  transporter.sendMail(mailOptions, function (err: any, info: any) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};

export default  sendEmail ;
