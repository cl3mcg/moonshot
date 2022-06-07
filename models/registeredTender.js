const mongoose = require("mongoose")
const Schema = mongoose.Schema

const registeredTenderSchema = new Schema({
    recordDate: {
        type: Date,
        required: true
    },
    author: {
        type: Schema.Types.ObjectID,
        ref: "user",
    },
    lastModifiedDate: Date,
    preadvise: {
        type: Schema.Types.ObjectID,
        ref: "preadvisedTender"
    },
    countryLocation: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    sugarID: String,
    businessVertical: {
        type: String,
        required: true
    },
    contactName: {
        type: String,
        required: true
    },
    contactJobTitle: {
        type: String,
        required: true
    },
    contactEmail: {
        type: String,
        required: true
    },
    decisionMaker: {
        type: String,
        required: true
    },
    transportMode: {
        type: Array,
        required: true
    },
    airFreightVolume: {
        type: Number,
        min: 0
    },
    seaFreightFCLVolume: {
        type: Number,
        min: 0
    },
    seaFreightLCLVolume: {
        type: Number,
        min: 0
    },
    railFreightVolume: {
        type: Number,
        min: 0
    },
    commodity: {
        type: String,
        required: true
    },
    specialHandling: {
        type: Array,
        required: true
    },
    linkedRFI: {
        type: Boolean,
        required: true
    },
    deadlineRFI: {
        type: Date,
        min: "2021-01-01",
    },
    receptionDate: {
        type: Date,
        min: "2021-01-01",
        required: true
    },
    deadlineRFQ: {
        type: Date,
        min: "2021-01-01",
        required: true
    },
    decisionDate: {
        type: Date,
        min: "2021-01-01",
        required: true
    },
    startBusinessDate: {
        type: Date,
        min: "2021-01-01",
        required: true
    },
    keyTradelanes: {
        type: Array,
        required: true
    },
    lanesAmount: {
        type: Number,
        min: 1
    },
    transportationScope: {
        type: Array,
        required: true
    },
    ratesValidityAir: Number,
    ratesValidityFCL: Number,
    ratesValidityLCL: Number,
    ratesValidityRail: Number,
    contractPeriod: {
        type: Number,
        required: true
    },
    paymentTerms: {
        type: Number,
        required: true
    },
    bidRestrictions: {
        type: Array,
        required: true
    },
    bidRequirements: {
        type: Array,
        required: true 
    },
    roundsAmount: {
        type: Number,
        required: true
    },
    tenderLaunchMethod: {
        type: String,
        required: true
    },
    history: {
        type: Array,
        required: true
    },
    existingCustomerSegment: {
        type: String,
    },
    visitFrequency: {
        type: String,
        required: true
    },
    visitHistory: {
        type: String,
        required: true
    },
    currentServiceProvider: {
        type: String,
        required: true
    },
    competitorAmount: {
        type: String,
        required: true
    },
    volumeSplit: {
        type: String,
        required: true
    },
    reasonForTender: {
        type: String,
        required: true
    },
    decisionCritera: {
        type: String,
        required: true
    },
    feedbackAvailable: {
        type: String,
        required: true
    },
    documentUpload: Array,
    potential: {
        type: String,
        required: true
    },
    additionalComment: String,
    tenderTeamDecision: {
        type: String,
    },
    tenderTeamDecisionDate: {
        type: Date,
        min: "2021-01-01"
    },
    tenderTeamDecisionMaker: {
        type: String
    },
    tenderTeamComment: {
        type: String
    },
    tenderTeamSubmissionDate: {
        type: Date,
        min: "2021-01-01"
    },
    outcome: {
        type: String
    }
})

module.exports = mongoose.model("registeredTender", registeredTenderSchema)