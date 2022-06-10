// const Joi = require("joi")
const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.preadviseSchema = Joi.object({
    companyName: Joi.string().required().escapeHTML(),
    sugarID: Joi.string().required().escapeHTML(),
    expectedReceiveDate: Joi.date().required(),
    keyTradelanes: Joi.alternatives().try(Joi.string().required().escapeHTML(), Joi.array().required()),
    transportMode: Joi.alternatives().try(Joi.string().required().escapeHTML(), Joi.array().required()),
    airFreightVol: Joi.number().optional(),
    seaFreightFCLVol: Joi.number().optional(),
    seaFreightLCLVol: Joi.number().optional(),
    railFreightVol: Joi.number().optional(),
    history: Joi.alternatives().try(Joi.string().required().escapeHTML(), Joi.array().required()),
    existingCustomerSegment: Joi.optional(),
    additionalComment: Joi.optional(),
    countryLocation: Joi.string().required().escapeHTML()
})

module.exports.registerSchema = Joi.object({
    countryLocation: Joi.string().required().escapeHTML(),
    isPreadvised: Joi.string().required().escapeHTML(),
    preadviseID: Joi.alternatives().conditional("isPreadvised", { is: "yes", then: Joi.string().required().escapeHTML(), otherwise: Joi.any()}),
    companyName: Joi.string().required(),
    sugarID: Joi.string().required(),
    businessVertical: Joi.string().required().escapeHTML(),
    contactName: Joi.string().required().escapeHTML(),
    contactJobTitle: Joi.string().required().escapeHTML(),
    contactEmail: Joi.string().required().escapeHTML(),
    decisionMaker: Joi.string().required().escapeHTML(),
    transportMode: Joi.alternatives().try(Joi.string().required().escapeHTML(), Joi.array().required()),
    airFreightVol: Joi.number().optional(),
    seaFreightFCLVol: Joi.number().optional(),
    seaFreightLCLVol: Joi.number().optional(),
    railFreightVol: Joi.number().optional(),
    specialHandling: Joi.alternatives().try(Joi.string().required().escapeHTML(), Joi.array().required()),
    commodity: Joi.string().required().escapeHTML(),
    linkedRFI: Joi.string().required().escapeHTML(),
    deadlineRFI: Joi.alternatives().conditional("linkedRFI", { is: "yes", then: Joi.date().required(), otherwise: Joi.any()}),
    receptionDate: Joi.date().required(),
    deadlineRFQ: Joi.date().required(),
    decisionDate: Joi.date().required(),
    startBusinessDate: Joi.string().required().escapeHTML(),
    keyTradelanes: Joi.alternatives().try(Joi.string().required().escapeHTML(), Joi.array().required()),
    lanesAmount: Joi.number().required(),
    transportationScope: Joi.alternatives().try(Joi.string().required().escapeHTML(), Joi.array().required()),
    ratesValidityAir: Joi.number().optional(),
    ratesValidityFCL: Joi.number().optional(),
    ratesValidityLCL: Joi.number().optional(),
    ratesValidityRail: Joi.number().optional(),
    contractPeriod: Joi.number().required(),
    paymentTerms: Joi.number().required(),
    bidRestrictions: Joi.alternatives().try(Joi.string().required().escapeHTML(), Joi.array().required()),
    bidRequirements: Joi.alternatives().try(Joi.string().required().escapeHTML(), Joi.array().required()),
    roundsAmount: Joi.number().required(),
    tenderLaunchMethod: Joi.string().required().escapeHTML(),
    history: Joi.alternatives().try(Joi.string().required().escapeHTML(), Joi.array().required()),
    existingCustomerSegment: Joi.optional(),
    visitFrequency: Joi.string().required().escapeHTML(),
    visitHistory: Joi.string().required().escapeHTML(),
    currentServiceProvider: Joi.string().required().escapeHTML(),
    competitorAmount: Joi.string().required().escapeHTML(),
    volumeSplit: Joi.string().required().escapeHTML(),
    reasonForTender: Joi.string().required().escapeHTML(),
    decisionCritera: Joi.string().required().escapeHTML(),
    feedbackAvailable: Joi.string().required().escapeHTML(),
    potential: Joi.string().required().escapeHTML(),
    additionalComment: Joi.optional(),
    toDeleteDoc: Joi.array()
})

module.exports.decisionSchema = Joi.object({
    tenderTeamDecisionComment: Joi.string().required().escapeHTML()
})

module.exports.officeSchema = Joi.object({
    countryLocation: Joi.string().required().escapeHTML(),
    companyName: Joi.string().required().escapeHTML(),
    address: Joi.string().required().escapeHTML(),
    city: Joi.string().required().escapeHTML(),
    postCode: Joi.string().required().escapeHTML(),
    countryName: Joi.string().required().escapeHTML(),
    lat: Joi.number().required(),
    lng: Joi.number().required(),
    officeSetup: Joi.string().required().escapeHTML(),
    tenderDesk: Joi.string().required().escapeHTML()
})