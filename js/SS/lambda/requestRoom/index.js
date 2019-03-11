//construct aws objects
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const uuid = require('uuid/v1');
const lambda = new AWS.Lambda();

//lambda handler
//callsback true if request is entered to the database and the user is notified false otherwise
exports.handler = async (event,context,callback) => {
	var response = await submitToRequestsTable(event.dateReserved,event.descriptionOfEvent,event.reoccuring,event.timeBlockReservedID,event.roomReservedID,event.status,event.userReservedID).then(
        result=>{return true;},
        error => {
            console.log("error");
            return false;
    });
    console.log(event.status)
    if (response) response = await callNotifyUser(event.userReservedID,event.status).then(result=>{return result},error=>{return error}).then(result=>{return true},error=>{return false});
    console.log(response);
    callback(null,response);
};

//submits the request data to the database
function submitToRequestsTable(date,desc,reoccuring,timeBlockReservedID,roomReservedID,status,userReservedID) {
	var options = {
      TableName: process.env.RequestsTable,
      Item: {
      	"requestID" : uuid(),
      	"dateReserved" : date,
      	"descriptionOfEvent" : desc,
      	"reoccuring" : reoccuring,
      	"timeBlockReservedID" : timeBlockReservedID,
      	"roomReservedID" : roomReservedID,
      	"status" : status,
      	"userReservedID" : userReservedID,
      	"subjectOfEvent" : "Request",
      	"reasonForDenial" : "N/A"
      }
    };
    return new Promise(function(resolve,reject) {
        dynamo.put(options, function (err, data) {
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    });
}

//notifies the user of the request about the status of their request
function callNotifyUser(userId,status) {
    console.log("notify");
    var notifyPayload = {
        "userId" : userId,
        "requestStatus" : status
    };
    var params = {
        FunctionName : process.env.notifyUserFunc,
        InvocationType : "RequestResponse",
        Payload : JSON.stringify(notifyPayload),
    };
    return new Promise((resolve,reject)=> {
        lambda.invoke(params,(err,data) => {
        if (err) {
           console.log(err);
           reject(err);
        }
            console.log(data.Payload);
            resolve(data.Payload);
        });
    });
}