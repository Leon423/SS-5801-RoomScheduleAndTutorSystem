//construct AWS objects
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

/*
*   lambda handler (main function)
*   takes an event which holds the payload passed to the api call
*   calls a function to submit tutor info to the tutor table
*   callsback true or false based on database submit request
*/
exports.handler = async (event, context, callback) => {
    console.log(event);
    var response = await submitToTutorTable(event.tutorName,event.availability,event.preferredClasses).then(function(result){
        return true;
    }, function(err) {
        console.log(err);
        return false;
    });
    callback(null,response);
};

/*
*   function responsible for submit tutor info to the database
*   params are user entered data
*/
function submitToTutorTable(tutorName,availability,preferredClasses) {
    var options = {
      TableName: process.env.TutorsTable,
      Key: {
        'tutorName' : tutorName
      },
      UpdateExpression: 'set availability = :a, preferredClasses = :c',
      ExpressionAttributeValues: {
        ':a' : availability,
        ':c' : preferredClasses
      }
    };
    return new Promise(function(resolve,reject) {
        //put the item to the db
        dynamo.update(options, function (err, data) {
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    });
}
