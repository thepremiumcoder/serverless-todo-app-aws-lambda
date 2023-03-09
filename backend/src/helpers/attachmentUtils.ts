import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic
const s3BucketName = process.env.S3_BUCKET_NAME
// const urlExpiration = process.env.S3_URL_EXPIRATION

export class AttachmentUtils {
  constructor(
    private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' }),
    private readonly bucketName = s3BucketName // private readonly expiration = urlExpiration
  ) {}

  getAttachmentUrl(todoId: string) {
    return `https://${s3BucketName}.s3.amazonaws.com/${todoId}`
  }

  getUploadUrl(todoId: string): string {
    const url = this.s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: todoId,
      Expires: 800
    })
    return url as string
  }
}
