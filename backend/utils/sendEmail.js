import nodemailer from 'nodemailer';

const sendEmail = async (options) => {

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });

  // Define the email options
  const mailOptions = {
    from: 'eunivate@gmail.com', 
    to: options.email, // Recipient address
    subject: options.subject, // Subject of the email
    text: options.message, // Plain text body
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
