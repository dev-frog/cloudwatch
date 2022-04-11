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

async function getLogStreams() {
  // Get Aws CloudWatch Logs using Credentials
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html#describeLogGroups-property
  var params = {
    logGroupName: '/aws/appsync/apis/xjhoxpb2sjdhfgs7cvlsinc2ge',
    descending: true,
    orderBy: 'LastEventTime',
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
      return data;
    }
  });
}

// function generate 13 digit unix timestamp  start and end time
function generateTimeStamp() {
  var date = new Date();
  var timestamp = date.getTime();
  var startTime = timestamp - 1000 * 60 * 60 * 24 * 7;
  var endTime = timestamp;
  return { startTime, endTime };
}

router.get('/', (req, res) => {
  console.log(generateTimeStamp());
  const { startTime, endTime } = generateTimeStamp();
  const response = {
    logGroupName: '/aws/appsync/apis/xjhoxpb2sjdhfgs7cvlsinc2ge',
    startTime: startTime,
    endTime: endTime,
  };
  cwl.filterLogEvents(response, function (err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      // console.log(data);
      data.events.forEach((stream) => {
        // console.log(data.events.length);
        stream.timestamp = new Date(stream.timestamp).toLocaleString();
        stream.ingestionTime = new Date(stream.ingestionTime).toLocaleString();
      });
      res.json(data);
    }
  });
});

module.exports = router;
