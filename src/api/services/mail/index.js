const nodemailer = require('nodemailer');
const { google } = require('googleapis')
const {clientID,clientSecret,refreshToken,from}= require('../../../config')
const OAuth2 = google.auth.OAuth2;
const OAuth2_client = new OAuth2(clientID, clientSecret);
OAuth2_client.setCredentials({ refresh_token:refreshToken });

async function login_mail(recipient,otp) {
    try {
      const accessToken = await OAuth2_client.getAccessToken();
      const transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          type: "OAuth2",
          user: from,
          clientId: clientID,
          clientSecret: clientSecret,
          refreshToken: refreshToken,
          accessToken: accessToken.token,
        },
      });
  
      const mailOptions = {
        from: from,
        to: recipient,
        subject: "login success",
        text: `OTP : ${otp}`,
      };
  
       transport.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }

async function forgotPassword(recipient,token) {
    try {
      const accessToken = await OAuth2_client.getAccessToken();
      const transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          type: "OAuth2",
          user: from,
          clientId: clientID,
          clientSecret: clientSecret,
          refreshToken: refreshToken,
          accessToken: accessToken.token,
        },
      });
  
      const mailOptions = {
        from: from,
        to: recipient,
        subject: "forgotPassword",
        text: `Token : ${token}`,
      };
  
       transport.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending email:", error);
    }
}

async function deliveryOtp(recipient,otp) {
    try {
      const accessToken = await OAuth2_client.getAccessToken();
      const transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          type: "OAuth2",
          user: from,
          clientId: clientID,
          clientSecret: clientSecret,
          refreshToken: refreshToken,
          accessToken: accessToken.token,
        },
      });
  
      const mailOptions = {
        from: from,
        to: recipient,
        subject: "forgotPassword",
        text: `Otp : ${otp} `,
      };
  
       transport.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending email:", error);
    }
}


  module.exports ={
    login_mail,
    forgotPassword,
    deliveryOtp
  }