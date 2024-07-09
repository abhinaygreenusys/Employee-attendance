import twilio from "twilio";

export const sentMessage = (number, otp) => {
  const client = twilio(process.env.ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  client.messages
    .create({
      body: `Your Tracking Account verification code: ${otp} `,
      from: process.env.SENDER_PHONE_NUMBER,
      to: `+91${number}`,
    })
    .then((message) => console.log(message.sid))
    .catch((err) => console.log(err.message));
};
