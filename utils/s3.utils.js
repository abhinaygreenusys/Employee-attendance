

import AWS from "aws-sdk";

export const getSignedUrl = async (key) => {
  const s3 = AWS.S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  });
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Expires: 60 * 60,
  };
  const url = await s3.getSignedUrlPromise("getObject", params);
  console.log(url, "url");
  return url;
};

export const uploadFile = async (file, filename) => {
  const s3 = new AWS.S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  });
  console.log(process.env.AWS_REGION);
  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: filename,
    Body: file.buffer,
    mimetype: file.mimetype,
    ContentType: file.mimetype,
    ACL: "public-read",
  };
  const data = await s3.upload(uploadParams).promise();
  
  return data;
};

export const deleteFile=async(key)=>{
  const s3 = new AWS.S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  });

  const params={
      Key:key,
      Bucket:process.env.AWS_BUCKET_NAME
  }

  const data=await s3.deleteObject(params).promise();
  console.log(data);
   return data;
}
