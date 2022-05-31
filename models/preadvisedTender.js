const mongoose = require("mongoose")
const Schema = mongoose.Schema

const preAdvisedTenderSchema = new Schema({
    recordDate: {
        type: Date,
        required: true
    },
    author: {
        type: Schema.Types.ObjectID,
        ref: "user",
    },
    lastModifiedDate: {
        type: Date,
        min: "2021-01-01"
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
    expectedReceiveDate: {
        type: Date,
        min: "2021-01-01",
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
    keyTradelanes: {
        type: Array,
        required: true
    },
    history: {
        type: Array,
        required: true
    },
    existingCustomerSegment: {
        type: String,
    },
    additionalComment: String,
    register: {
        type: Schema.Types.ObjectID,
        ref: "registeredTender"
    },
})

module.exports = mongoose.model("preadvisedTender", preAdvisedTenderSchema)