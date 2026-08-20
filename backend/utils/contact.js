const express = require("express");
const router = express.Router();
const { sendEmail } = require("../sendEmail");
module.exports = router.post("/", async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    await sendEmail({
      from: process.env.email,
      to: process.env.email,
      subject: `Contact Form - ${subject}`,
      html: `
        <h2>New Message</h2>

        <p><strong>Name:</strong> ${name}</p>

        <p><strong>Email:</strong> ${email}</p>

        <p><strong>Subject:</strong> ${subject}</p>

        <p><strong>Message:</strong></p>

        <p>${message}</p>
      `,
    });

    res.status(200).json({
      message: "Email sent successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to send email",
    });
  }
});
module.exports = router;
