const Joi = require("joi")

module.exports.preadvisedSchema = Joi.object({
    companyName: Joi.string().required(),
    sugarID: Joi.string().required(),
    expectedReceiveDate: Joi.date().required(),
    keyTradelanes: Joi.alternatives().try(Joi.string().required(), Joi.array().required()),
    transportMode: Joi.alternatives().try(Joi.string().required(), Joi.array().required()),
    airFreightVol: Joi.number().optional(),
    seaFreightFCLVol: Joi.number().optional(),
    seaFreightLCLVol: Joi.number().optional(),
    railFreightVol: Joi.number().optional(),
    history: Joi.alternatives().try(Joi.string().required(), Joi.array().required()),
    existingCustomerSegment: Joi.optional(),
    additionalComment: Joi.optional(),
    countryLocation: Joi.string().required()
    })

module.exports.officeSchema = Joi.object({
    countryLocation: Joi.string().required(),
    companyName: Joi.string().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    postCode: Joi.string().required(),
    countryName: Joi.string().required(),
    lat: Joi.number().required(),
    lng: Joi.number().required(),
    officeSetup: Joi.string().required(),
    tenderDesk: Joi.string().required()
    })