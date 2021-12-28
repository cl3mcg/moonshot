const mongoose = require("mongoose")
const Schema = mongoose.Schema

const officeSchema = new Schema({
    recordDate: Date,
    lastModifiedDate: Date,
    cca2: {
        type: String,
        maxlength: 2
    },
    officeSetup: String,
    companyName: String,
    address: String,
    address_postCode: String,
    address_city: String,
    address_cca2: {
        type: String,
        maxlength: 2
    },
    tenderDesk: String,
    latlng: String
})

module.exports = mongoose.model("Office", officeSchema)