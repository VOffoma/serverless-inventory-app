import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';

const XAWS = AWSXRay.captureAWS(AWS);
const bucketName = process.env.IMAGES_S3_BUCKET;
const urlExpiration = process.env.SIGNED_URL_EXPIRATION;


export class MediaBucketAccess {
    constructor(
        private readonly s3Client = createS3Client(),
    ){}


    getUploadUrl(id: string): string {
        return this.s3Client.getSignedUrl('putObject', {
            Bucket: bucketName,
            Key: id,
            Expires: parseInt(urlExpiration)
        });
    }
}


function createS3Client() {
    return new XAWS.S3({
        signatureVersion: 'v4'
      })
}