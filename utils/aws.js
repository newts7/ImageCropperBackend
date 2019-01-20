const fs = require('fs');
const AWS = require('aws-sdk');
const  path = require('path');
const to = require('await-to-js');

const s3 = new AWS.S3({
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey
});


const getFile = async (fileName) => {
    return  new Promise(function(resolve, reject){
    fs.readFile(path.join(__dirname,fileName), (err, data) => {
        err ? reject(err) : resolve(data);
    });
  });
}

const uploadToS3  = (params) => {
    return new Promise(function(resolve, reject){
            s3.upload(params, (s3Err, data) => {
            s3Err ? reject(s3Err) : resolve(data);
            console.log(`File uploaded successfully at ${data.Location}`);
            });
    });
}
const uploadFile = async (fileName, type) => {
    return getFile(fileName).then((data) => {
         var base64data = new Buffer(data, 'binary');
        const params = {
         Bucket: 'imagetestinsider',
         Key: fileName,
        Body: base64data,
         ContentType: type,
         ACL: 'public-read'
     };
        return uploadToS3(params);
    }).then(response => {
        fs.unlink(path.join(__dirname,fileName), (err) => {
        if (err) throw err;
        console.log(`${fileName} was deleted`);
        });
        return { fileName: response.Key};
    }).
    catch(error => Promise.reject(error));
};



module.exports = {
    uploadFile
};