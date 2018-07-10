const gcs = require('@google-cloud/storage')({
    projectId: 'speech-to-text-209212',
    keyFilename: './speech-to-text-209212-b6f102be1bdc.json'
});
const bucket = gcs.bucket('sststorage');
module.exports = filePath => new Promise((resolve, reject) =>
bucket.upload(filePath, function (err, file) {
    console.log(filePath);
    if (err) {
        reject(err);
    } else {
        resolve(file);
        return(file);
    }
})
);