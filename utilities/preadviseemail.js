const ejs = require("ejs");
const colors = require("colors");
const nodemailer = require("nodemailer");

const ExpressError = require("./expresserror.js");

const PreadvisedTender = require("../models/preadvisedTender.js");

const testHost = process.env.EMAIL_HOST;
const testSenderName = process.env.EMAIL_SENDER_NAME;
// const testReceiverEmail = process.env.EMAIL_RECEIVER_EMAIL;
const testSenderEmail = process.env.EMAIL_SENDER_EMAIL;
const testSenderEmailPassword = process.env.EMAIL_SENDER_PASSWORD;

const preadviseTenderEmailConfirmation = async function (entryID, fileIdentifier) {
    let matchingPreadvise = await PreadvisedTender.findById(entryID).populate("author");
    let from = testSenderName;
    let selectedEmail = matchingPreadvise.author.email; // Enter the recipient email here
    let subject = "Your tender has been preadvised";
    // let attachement = null;
    let attachement = [{
        filename: `Preadvise Report - ${matchingPreadvise.companyName} - ${fileIdentifier}.pdf`,
        path: `./reports/reportsGenerated/${matchingPreadvise.companyName}_${fileIdentifier}.pdf`
    }]
    let emailBody = await ejs.renderFile("./emails/preadviseConfirm.ejs", {
      userName: matchingPreadvise.author.username, // Enter the user name here
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

const preadviseTenderEmailCancellation = async function (entryID) {
  let matchingPreadvise = await PreadvisedTender.findById(entryID).populate("author");
  let from = testSenderName;
  let selectedEmail = matchingPreadvise.author.email; // Enter the recipient email here
  let subject = "Your tender preadvise has been cancelled";
  let attachement = null;
  let emailBody = await ejs.renderFile("./emails/preadviseCancel.ejs", {
    userName: matchingPreadvise.author.username, // Enter the user name here
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
    console.log(`${colors.black.bgBrightGreen("* OK *")} An email with the cancellation notice related to the TENDER PRE-ADVISE of the company ${matchingPreadvise.companyName}, has been sent`);
  } catch (error) {
    console.log(error);
    throw new ExpressError("Error sending email", 500);
  }
}

module.exports = {
  preadviseTenderEmailConfirmation,
  preadviseTenderEmailCancellation
}