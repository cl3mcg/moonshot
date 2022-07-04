const ejs = require("ejs");
const colors = require("colors");
const nodemailer = require("nodemailer");

const ExpressError = require("./expresserror.js");

const PreadvisedTender = require("../models/preadvisedTender.js");
const RegisteredTender = require("../models/registeredTender.js");
const User = require("../models/user.js");

const {
  findCountryName,
  findcca2,
  findSubRegion,
  findResponsibleTenderOffice,
  currentDateAndTime,
  formatDate,
  capitalize
} = require("../utilities/commonfunctions.js");

const testHost = process.env.EMAIL_HOST;
const testSenderName = process.env.EMAIL_SENDER_NAME;
// const testReceiverEmail = process.env.EMAIL_RECEIVER_EMAIL;
const testSenderEmail = process.env.EMAIL_SENDER_EMAIL;
const testSenderEmailPassword = process.env.EMAIL_SENDER_PASSWORD;

const registerTenderEmailConfirmation = async function (entryID, fileIdentifier) {
    let matchingTender = await RegisteredTender.findById(entryID).populate("author");
    let isPreadvised = false
    if (matchingTender.preadvise) {
      isPreadvised = true
    }
    let from = testSenderName;
    let selectedEmail = matchingTender.author.email; // Enter the recipient email here
    let subject = "Your tender has been registered";
    // let attachement = null;
    let attachement = [{
      filename: `Registration Report - ${matchingTender.companyName} - ${fileIdentifier}.pdf`,
      path: `./reports/reportsGenerated/${matchingTender.companyName}_${fileIdentifier}.pdf`
    }]
    let emailBody = await ejs.renderFile("./emails/registerConfirm.ejs", {
      userName: matchingTender.author.username, // Enter the user name here
      companyName: matchingTender.companyName, // Enter the company name here, it should be gathered from the form
      registerId: matchingTender.id, // Enter the registered ID here, it should be gathered after being saved in the database
      isPreadvised: isPreadvised,
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

const registerTenderEmailCancellation = async function (entryID) {
  let matchingTender = await RegisteredTender.findById(entryID).populate("author");
  let from = testSenderName;
  let recipients = [];
  let allTenderTeamMembers = await User.find({"isTenderTeam": true});
  for(let tenderTeamMember of allTenderTeamMembers) {
    recipients.push(tenderTeamMember.email);
  }
  let selectedEmail = recipients; // Enter the recipient email here
  let subject = "A registered tender has been cancelled";
  let attachement = null
  let emailBody = await ejs.renderFile("./emails/registerCancel.ejs", {
    userName: matchingTender.author.username, // Enter the user name here
    companyName: matchingTender.companyName, // Enter the company name here, it should be gathered from the form
    registerId: matchingTender.id, // Enter the preadvise ID here, it should be gathered after being saved in the database
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
    console.log(`${colors.black.bgBrightGreen("* OK *")} An email with the cancellation notice related to the TENDER PRE-ADVISE of the company ${matchingTender.companyName}, has been sent`);
  } catch (error) {
    console.log(error);
    throw new ExpressError("Error sending email", 500);
  }
}

const registerTenderNotice = async function (entryID, fileIdentifier) {
  let matchingTender = await RegisteredTender.findById(entryID).populate("author");
  let from = testSenderName;
  let recipients = [];
  let allTenderTeamMembers = await User.find({"isTenderTeam": true});
  for(let tenderTeamMember of allTenderTeamMembers) {
    recipients.push(tenderTeamMember.email);
  }
  let selectedEmail = recipients; // Enter the recipient email here
  let subject = "New tender registered";
  // let attachement = null;
  let attachement = [{
    filename: `Registration Report - ${matchingTender.companyName} - ${fileIdentifier}.pdf`,
    path: `./reports/reportsGenerated/${matchingTender.companyName}_${fileIdentifier}.pdf`
  }]
  let emailBody = await ejs.renderFile("./emails/registerNotice.ejs", {
    userName: matchingTender.author.username, // Enter the user name here
    userEmail : matchingTender.author.email, // Enter the user email here
    userID: matchingTender.author.id, // Enter the user ID here
    companyName: matchingTender.companyName, // Enter the company name here, it should be gathered from the form
    registerId: matchingTender.id, // Enter the registered ID here, it should be gathered after being saved in the database
    isPreadvised: matchingTender.isPreadvised,
    deadlineRFQ: formatDate(matchingTender.deadlineRFQ),
    additionalComment: matchingTender.additionalComment,
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
    console.log(`${colors.black.bgBrightGreen("* OK *")} A notification email related to the TENDER REGISTRATION of the company ${matchingTender.companyName}, has been sent to the tender team`);
  } catch (error) {
    console.log(error);
    throw new ExpressError("Error sending email", 500);
  }
}

const registerCancelTenderNotice = async function (entryID) {
  let matchingTender = await RegisteredTender.findById(entryID);
  let from = testSenderName;
  let recipients = [];
  let allTenderTeamMembers = await User.find({"isTenderTeam": true});
  for(let tenderTeamMember of allTenderTeamMembers) {
    recipients.push(tenderTeamMember.email);
  }
  let selectedEmail = recipients; // Enter the recipient email here
  let subject = "A registered tender has been cancelled";
  let attachement = null
  let emailBody = await ejs.renderFile("./emails/registerCancelNotice.ejs", {
    companyName: matchingTender.companyName, // Enter the company name here, it should be gathered from the form
    registerId: matchingTender.id, // Enter the preadvise ID here, it should be gathered after being saved in the database
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
    console.log(`${colors.black.bgBrightGreen("* OK *")} A notification email for the TENDER CANCELLATION, has been sent to tender team members`);
  } catch (error) {
    console.log(error);
    throw new ExpressError("Error sending email", 500);
  }
}

const registerReportEmail = async function (user, entryID, fileIdentifier) {
  let matchingTender = await RegisteredTender.findById(entryID);
  let from = testSenderName;
  let selectedEmail = user.email; // Enter the recipient email here
  let subject = "Tender registration report available";
  let attachement = [{
    filename: `Registration Report - ${matchingTender.companyName} - ${fileIdentifier}.pdf`,
    path: `./reports/reportsGenerated/${matchingTender.companyName}_${fileIdentifier}.pdf`
  }]
  let emailBody = await ejs.renderFile("./emails/reportAvailable.ejs", {
    type: "register",
    userName: user.username,
    companyName: matchingTender.companyName, // Enter the company name here, it should be gathered from the form
    Id: matchingTender.id, // Enter the preadvise ID here, it should be gathered after being saved in the database
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
    console.log(`${colors.black.bgBrightGreen("* OK *")} An email for the TENDER REGISTRATION REPORT, has been sent.`);
  } catch (error) {
    console.log(error);
    throw new ExpressError("Error sending email", 500);
  }
}

module.exports = {
  registerTenderEmailConfirmation,
  registerTenderEmailCancellation,
  registerTenderNotice,
  registerCancelTenderNotice,
  registerReportEmail
}