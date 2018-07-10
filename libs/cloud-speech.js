//const speechClient = require('@google-cloud/speech');
const config = {
    'languageCode': 'en-US',
    'sampleRate': 8000,
    'encoding': 'LINEAR16'
};
var SpeechClient=require('@google-cloud/speech/src/v1/speech_client')
var speech=new SpeechClient({
    projectId: 'speech-to-text-209212',
    keyFilename: './speech-to-text-209212-b6f102be1bdc.json'
});
module.exports = fileName =>
    new Promise((resolve, reject) => {
            const audio = {
                uri: fileName,
            };

            const request = {
                config: config,
                audio: audio,
            };

// Detects speech in the audio file. This creates a recognition job that you
// can wait for now, or get its result later.
            speech
                .longRunningRecognize(request)
                .then(data => {
                    const operation = data[0];
                    // Get a Promise representation of the final result of the job
                    return operation.promise();
                })
                .then(data => {
                    const response = data[0];
                    const transcription = response.results
                        .map(result => result.alternatives[0].transcript)
                        .join('\n');
                    console.log(`Transcription: ${transcription}`);
                    resolve(transcription);
                    return transcription;
                })
                .catch(err => {
                    console.error('ERROR:', err);
                    reject(err);
                });
        }
    );

