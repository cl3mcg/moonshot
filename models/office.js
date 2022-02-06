const mongoose = require("mongoose")
const Schema = mongoose.Schema

const officeSchema = new Schema({
    recordDate: {
        type: Date,
        required: true
    },
    lastModifiedDate: Date,
    cca2: {
        type: String,
        maxlength: 2,
        required: true
    },
    officeSetup: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    address_postCode: {
        type: String,
        required: true
    },
    address_city: {
        type: String,
        required: true
    },
    address_cca2: {
        type: String,
        maxlength: 2,
        required: true
    },
    tenderDesk: {
        type: String,
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model("Office", officeSchema)