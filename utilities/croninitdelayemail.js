const schedule = require('node-schedule');
const colors = require("colors");
const ExpressError = require("./expresserror.js");

const PreadvisedTender = require("../models/preadvisedTender.js");
const RegisteredTender = require("../models/registeredTender.js");

const {
    testSenderName,
    testReceiverEmail,
    testSenderEmail,
    testSenderEmailPassword
  } = require('../secrets.js');

const initDelayEmail = async function (entryID) {

let matchingPreadvise = await PreadvisedTender.findById(entryID);
let matchingRegister = await RegisteredTender.findById(entryID);

let referenceDate = null;

if (!matchingPreadvise && !matchingRegister) {
    throw new ExpressError("Entry not found", 404);
} else if (!matchingPreadvise) {
    referenceDate = matchingRegister.decisionDate;
} else {
    referenceDate = matchingPreadvise.expectedReceiveDate;
}

console.log(`Reference date: ${referenceDate}`)

let emailSendDate = new Date(referenceDate.setDate(referenceDate.getDate() - 5))
console.log(`Email would be sent :${emailSendDate}`)

try {

    if (!matchingPreadvise) {
        // Input the function to send emails for registered tenders
    } else {
        // Input the function to send emails for preadvised tenders
    }

    schedule.scheduleJob(emailSendDate, function(){
        console.log(`Job running at: ${emailSendDate}`);
      });
} catch (error) {
    throw new ExpressError("Error CRON setup", 500);
}

}

const initEmailScheduler = async function () {

    const today = new Date();
    const in5days = today.setDate(today.getDate() + 5);
    
    const relevantPreadvisedTenders = await PreadvisedTender.find({expectedReceiveDate: {$gt: new Date(in5days)}});
    const relevantRegisteredTenders = await RegisteredTender.find({decisionDate: {$gt: new Date(in5days)}});

    for (let entry of relevantPreadvisedTenders) {
        let emailSendDate = new Date(entry.expectedReceiveDate.setDate(entry.expectedReceiveDate.getDate() - 5))
        console.log(`${colors.black.bgBrightBlue("* SCHEDULED TASK *")} For preadvised tender ${entry.companyName}, a reminder email will be sent on ${emailSendDate} (5 days before expected tender reception date)`)
        schedule.scheduleJob(emailSendDate, function(){
            // Input the function to send emails for preadvised tenders
            console.log(`Job running for ${entry.companyName} at: ${emailSendDate}`);
        });
    }

    for (let entry of relevantRegisteredTenders) {
        let emailSendDate = new Date(entry.decisionDate.setDate(entry.decisionDate.getDate() - 5))
        console.log(`${colors.black.bgBrightBlue("* SCHEDULED TASK *")} For registered tender ${entry.companyName}, a reminder email will be sent on ${emailSendDate} (5 days before expected decision date)`)
        schedule.scheduleJob(emailSendDate, function(){
            // Input the function to send emails for registered tenders
            console.log(`Job running for ${entry.companyName} at: ${emailSendDate}`);
        });
    }

}

module.exports = initEmailScheduler;
