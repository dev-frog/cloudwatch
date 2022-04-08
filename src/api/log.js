require('dotenv').config();
const express = require('express');
const router = express.Router();
var AWS = require('aws-sdk');

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const cwl = new AWS.CloudWatchLogs({ apiVersion: process.env.AWS_API_VERSION });

router.get('/', (req, res) => {
  // Get Aws CloudWatch Logs using Credentials
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html#describeLogGroups-property

  var params = {
    logGroupName: '/aws/appsync/apis/xjhoxpb2sjdhfgs7cvlsinc2ge',
    descending: true,
    // limit: 10,
    // Dimensions: [
    //   {
    //     Name: '/aws/appsync/apis/xjhoxpb2sjdhfgs7cvlsinc2ge' /* required */,
    //   },
    // ],
    // MetricName: 'IncomingLogEvents',
    // Namespace: 'AWS/Logs',
  };

  cwl.describeLogStreams(params, function (err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      console.log(data);
      // conver time to readable format
      data.logStreams.forEach((stream) => {
        stream.lastEventTimestamp = new Date(
          stream.lastEventTimestamp
        ).toLocaleString();
        stream.creationTime = new Date(stream.creationTime).toLocaleString();
        stream.firstEventTimestamp = new Date(
          stream.firstEventTimestamp
        ).toLocaleString();
      });
      // Get Details of Log Streams
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html#describeLogStreams-property
      res.send(data);
    }
  });
});

module.exports = router;
