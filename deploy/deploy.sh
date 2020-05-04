ECHO Uploading to S3🚀
aws s3 rm s3://$AWS_BUCKET_NAME --recursive
aws s3 cp ./build s3://$AWS_BUCKET_NAME  --recursive
ECHO Done Uploading to S3🚀
ECHO Refreshing Cloudfront Distribution⚡️
aws cloudfront create-invalidation --distribution-id $AWS_CLOUDFRONT_ID --paths "/*"
ECHO Done Refreshing Cloudfront Distribution⚡️
