const ejs = require("ejs");
const colors = require("colors");
const nodemailer = require("nodemailer");

const ExpressError = require("./expresserror.js");

const PreadvisedTender = require("../models/preadvisedTender.js");
const RegisteredTender = require("../models/registeredTender.js");

const testHost = process.env.EMAIL_HOST;
const testSenderName = process.env.EMAIL_SENDER_NAME;
const testReceiverEmail = process.env.EMAIL_RECEIVER_EMAIL;
const testSenderEmail = process.env.EMAIL_SENDER_EMAIL;
const testSenderEmailPassword = process.env.EMAIL_SENDER_PASSWORD;

const registerTenderEmailConfirmation = async function (entryID, fileIdentifier) {
    let matchingTender = await RegisteredTender.findById(entryID);
    let from = testSenderName;
    let selectedEmail = testReceiverEmail; // Enter the recipient email here
    let subject = "Your tender has been registered";
    // let attachement = null;
    let attachement = [{
      filename: `Registration Report - ${matchingTender.companyName} - ${fileIdentifier}.pdf`,
      path: `./reports/reportsGenerated/${matchingTender.companyName}_${fileIdentifier}.pdf`
    }]
    let emailBody = await ejs.renderFile("./emails/registerConfirm.ejs", {
      userName: "Jean-Marie", // Enter the user name here
      companyName: matchingTender.companyName, // Enter the company name here, it should be gathered from the form
      registerId: matchingTender.id, // Enter the registered ID here, it should be gathered after being saved in the database
      isPreadvised: matchingTender.isPreadvised,
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
      console.log(`${colors.black.bgBrightGreen("* OK *")} An email with the information related to the TENDER REGISTRATION of the company ${matchingTender.companyName}, has been sent`);
    } catch (error) {
      console.log(error);
      throw new ExpressError("Error sending email", 500);
    }
}

module.exports = registerTenderEmailConfirmation;