//construct aws objects
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

/*
* lambda handler
* callsback an array of tutors on success
*/
exports.handler = async (event,context,callback) => {
    var Tutors = await getTutors().then(function(result) {
      return(result);
    }, function(err) {
      callback(err);
    });
    callback(null,Tutors);
};

/*
* Scans the DB tutor table for tutors
*/
function getTutors() {
  var options = {TableName : process.env.TutorsTable};
  return new Promise(function(resolve,reject) {
    dynamo.scan(options, function(err,data){
      if (err) {
        reject(err);
      } else {
        console.log("Scan results" + data);
        resolve(data.Items);
      }
    });
  });
}