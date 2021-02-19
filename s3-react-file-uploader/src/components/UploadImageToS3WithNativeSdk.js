import React ,{useState} from 'react';
import AWS from 'aws-sdk';

const S3_BUCKET ='<aws-s3-bucket-name>';
const REGION ='<aws-region>';

AWS.config.update({
    accessKeyId: '<accessKeyId>',
    secretAccessKey: '<secretAccessKey>'
});

const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET},
    region: REGION,
});

const UploadImageToS3WithNativeSdk = () => {

  const [progress , setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileInput = (e) => {
      setSelectedFile(e.target.files[0]);
  }
  const uploadFile = (file) => {
      const params = {
          ACL: 'public-read',
          Body: file,
          Bucket: S3_BUCKET,
          Key: file.name
      };
      myBucket.putObject(params)
          .on('httpUploadProgress', (evt) => {
              setProgress(Math.round((evt.loaded / evt.total) * 100))
          })
          .send((err) => {
              if (err) console.log(err)
          })
  }

  let uploadMessage;
  if(progress === 0) {
    uploadMessage = 'FILE UPLOADER USING AWS S3, REACT JS';
  } else if(progress != 100) {
    uploadMessage = 'File Upload is in Progress: ' + progress + '% ....';
  } else {
    uploadMessage = 'File Upload SUCCESS!';
  }
  
  let button;
  if(selectedFile === null) {
      button = <p>Please select a file to upload!</p>;
    } else {
      button = <button onClick={() => uploadFile(selectedFile)}> Upload to S3</button>;
    }
  return <div>
      <div>{uploadMessage}</div>
      <input type="file" onChange={handleFileInput}/>
      {button}
  </div>
}

export default UploadImageToS3WithNativeSdk;