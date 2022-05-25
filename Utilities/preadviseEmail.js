const ejs = require("ejs");
const colors = require("colors");
const nodemailer = require("nodemailer");

const ExpressError = require("./ExpressError.js");

const PreadvisedTender = require("../models/preadvisedTender.js");

const {
    testHost,
    testSenderName,
    testReceiverEmail,
    testSenderEmail,
    testSenderEmailPassword
  } = require('../secrets.js');

const preadviseTenderEmailConfirmation = async function (entryID, fileIdentifier) {
    let matchingPreadvise = await PreadvisedTender.findById(entryID);
    let from = testSenderName;
    let selectedEmail = testReceiverEmail; // Enter the recipient email here
    let subject = "Your tender has been preadvised";
    // let attachement = null;
    let attachement = [{
        filename: `Preadvise Report - ${matchingPreadvise.companyName} - ${fileIdentifier}.pdf`,
        path: `./reports/reportsGenerated/${matchingPreadvise.companyName}_${fileIdentifier}.pdf`
    }]
    let emailBody = await ejs.renderFile("./emails/preadviseConfirm.ejs", {
      userName: "Jean-Marie", // Enter the user name here
      companyName: matchingPreadvise.companyName, // Enter the company name here, it should be gathered from the form
      preadviseId: matchingPreadvise.id, // Enter the preadvise ID here, it should be gathered after being saved in the database
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
      console.log(`${colors.black.bgBrightGreen("* OK *")} An email with the information related to the TENDER PRE-ADVISE of the company ${matchingPreadvise.companyName}, has been sent`);
    } catch (error) {
      console.log(error);
      throw new ExpressError("Error sending email", 500);
    }
}


module.exports = preadviseTenderEmailConfirmation;