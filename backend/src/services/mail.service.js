import transporter from "../configs/nodemailer.js";
import ApiError from "../utils/api-error.js";

const sendMail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: process.env.GOOGLE_USER,
      to,
      subject,
      html,
    };

    const mailInfo = await transporter.sendMail(mailOptions);
    console.log(mailInfo);
    return mailInfo;
  } catch (error) {
    console.error(error);
    throw new ApiError(400, "Failed to send email", error);
  }
};

export default sendMail;
