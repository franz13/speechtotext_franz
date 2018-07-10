var express = require('express');
var router = express.Router();
const Spinner = require('clui').Spinner;
const fileUpload = require('express-fileupload');
const cloudStore = require('../libs/cloud-storage');
const cloudSpeech = require('../libs/cloud-speech');
const path = require('path');
const chalk = require('chalk');
var fs = require('fs');
router.use(fileUpload());
/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', { title: 'Express' });
});
router.post('/upload',function (req, res,next) {


    if (!req.files)
        return res.status(400).send('No files were uploaded.');
    var filename =req.files.fileUpload.name;
     var tmp_path=req.files.fileUpload;
     var target_path=__dirname;
    var result;
    result = __dirname+"/text/"+filename+".text";
    tmp_path.mv(target_path+'/files/'+filename);
             try {
                const countdown = new Spinner('Starting...');
                countdown.start();
                // var direct = target_path+'/files/'+filename;
                Promise.resolve(__dirname+'/files/'+filename)
                    .then(wavFile => {
                        console.log('wavefile'+wavFile);
                countdown.message('Storing ${path.basename(wavFile)}...');
                return cloudStore(wavFile);})
                     .then(storageFile => {
                         countdown.message('Transcribing ${storageFile.name}...');
                        return cloudSpeech('gs://sststorage/'+storageFile.name);
                   })
                    .then(transcription => {
                         countdown.stop();
                         console.log("\nfile result>>>>>>\n"+chalk.green(transcription));
                         fs.writeFile(__dirname+'/text/'+filename+".txt", transcription, function(err){
                            if (err) throw err;
                             console.log("success");
                             result = {
                                 url:__dirname+"/text/"+filename+".text",
                                 content:transcription
                            };
                             console.log("success transcription" + result.url);
                        });
                     })
                     .catch(err => {
                        console.error(err);
                         result=err;
                         console.log("err transcription");
                     });}

              catch (err) {
                 console.log(chalk.red(err.message));
                 console.error(err);
                 result=err;
             }finally {
                res.send(result);
            }

});
module.exports = router;
