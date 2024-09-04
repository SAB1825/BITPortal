import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import multer from 'multer';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadToS3 = async (file) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: 'complaints/' + Date.now().toString() + path.extname(file.originalname),
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read'
  };

  const upload = new Upload({
    client: s3Client,
    params: params
  });

  try {
    const result = await upload.done();
    return result.Location;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error;
  }
};

export { upload, uploadToS3 };