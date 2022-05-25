const schedule = require('node-schedule');

const ExpressError = require("./expressError.js");

const PreadvisedTender = require("../models/preadvisedTender.js");
const RegisteredTender = require("../models/registeredTender.js");

const delayEmail = async function (entryID) {

let matchingPreadvise = await PreadvisedTender.findById(entryID);
let matchingRegister = await RegisteredTender.findById(entryID);

let referenceDate 

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


module.exports = delayEmail;