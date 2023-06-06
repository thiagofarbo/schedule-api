import AWS from 'aws-sdk'

AWS.config.credentials =  new AWS.EnvironmentCredentials('AWS');

const config = {
    // accessKeyId: process.env.AWS_ACCESS_KEY_ID, 
    // accessSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
}

AWS.config.update(config);

const s3 = new AWS.S3();

export { s3 };