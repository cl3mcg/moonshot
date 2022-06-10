const S3 = require("aws-sdk/clients/s3");
const fs = require("fs");
const path = require("path");

const endpoint = process.env.CELLAR_ADDON_HOST
const bucketName = process.env.CELLAR_BUCKET_NAME
const region = process.env.CELLAR_ADDON_REGION
const accessKeyId = process.env.CELLAR_ADDON_KEY_ID
const secretAccessKey = process.env.CELLAR_ADDON_KEY_SECRET

// const bucketName = process.env.SCALEWAY_S3_BUCKET_NAME
// const region = process.env.SCALEWAY_S3_REGION
// const endpoint = process.env.SCALEWAY_S3_ENDPOINT
// const accessKeyId = process.env.SCALEWAY_S3_ACCESS_KEY
// const secretAccessKey = process.env.SCALEWAY_S3_SECRET_KEY

const s3 = new S3({
    // endpoint: 'cellar-c2.services.clever-cloud.com',
    endpoint: endpoint,
    region,
    accessKeyId,
    secretAccessKey
});

// Function to upload a file to s3
module.exports.uploadFile = async function (file) {
    const fileContent = await fs.readFile(file.path);
    const params = {
        Bucket: bucketName,
        Key: file.filename,
        Body: fileContent
    };
    return s3.upload(params).promise();
};

// Function to download a file from s3
module.exports.downloadFile = async function (file) {
    const params = {
        Bucket: bucketName,
        Key: file.filename
    };
    let readStream = s3.getObject(params).createReadStream();
    let writeStream = fs.createWriteStream(path.join("./downloads/", `${file.originalname}`));
    readStream.pipe(writeStream);
}

// Function to delete a file from s3
module.exports.deleteFile = async function (file) {
    const params = {
        Bucket: bucketName,
        Key: file.filename
    };
    return s3.deleteObject(params).promise();
}

