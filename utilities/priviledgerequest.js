const ejs = require("ejs");
const colors = require("colors");
const nodemailer = require("nodemailer");

const ExpressError = require("./expresserror.js");

const User = require("../models/user.js");

const testHost = process.env.EMAIL_HOST;
const testSenderName = process.env.EMAIL_SENDER_NAME;
const testReceiverEmail = process.env.EMAIL_ADMIN_EMAIL;
const testSenderEmail = process.env.EMAIL_SENDER_EMAIL;
const testSenderEmailPassword = process.env.EMAIL_SENDER_PASSWORD;

const priviledgeEmailRequest = async function (entryID, request) {
    let matchingUser = await User.findById(entryID);
    let from = testSenderName;
    let selectedEmail = testReceiverEmail; // Enter the recipient email here
    let subject = "Priviledge Access Request";
    let attachement = null;
    // let attachement = [{
    //     filename: `Preadvise Report - ${matchingPreadvise.companyName} - ${fileIdentifier}.pdf`,
    //     path: `./reports/reportsGenerated/${matchingPreadvise.companyName}_${fileIdentifier}.pdf`
    // }]
    let emailBody = await ejs.renderFile("./emails/priviledgeRequest.ejs", {
      matchingUser: matchingUser,
      request: request
    });
  
    const send = async function () {
      let transporter = nodemailer.createTransport({
        host: testHost,
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testSenderEmail, // generated ethereal user
          pass: testSenderEmailPassword, // generated ethereal password
        },
      });
  
      let info = await transporter.sendMail({
        from: from, // sender address
        to: selectedEmail, // list of receivers
        subject: subject, // Subject line
        html: emailBody, // html body
        attachments: attachement,
      });
    };
  
  //   Nodemailer launch function - Uncomment below to enable to email launch.
    try {
      await send();
      console.log(`${colors.black.bgBrightGreen("* OK *")} An email with the PRIVILEDGE ACCESS REQUEST from ${matchingUser.username} (${matchingUser.email}), has been sent to an admin`);
    } catch (error) {
      console.log(error);
      throw new ExpressError("Error sending email", 500);
    }
}


module.exports = priviledgeEmailRequest;