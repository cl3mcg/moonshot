const mongoose = require("mongoose")
const Schema = mongoose.Schema

const preAdvisedTenderSchema = new Schema({
    recordDate: Date,
    lastModifiedDate: Date,
    companyName: String,
    sugarID: String,
    expectedReceiveDate: {
        type: Date,
        min: "2021-10-01"
    },
    transportMode: Array,
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
    keyTradelanes: Array,
    history: Array,
    existingCustomerSegment: String,
    additionalComment: String,
    countryLocation: String,
})

module.exports = mongoose.model("PreadvisedTender", preAdvisedTenderSchema)