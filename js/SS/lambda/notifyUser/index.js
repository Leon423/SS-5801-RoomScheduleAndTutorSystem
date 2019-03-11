//construct aws objects
const AWS = require('aws-sdk');
const ses = new AWS.SES({region: 'us-east-1'});
var cognito = new AWS.CognitoIdentityServiceProvider({region: 'us-east-2'});

//lambda handler
//callsback true if notification sends succesfully, false otherwise
exports.handler = async (event, context, callback) => {
    //console.log(getUserEmail(event.userId));
    var notification = buildMessage(event);
    var email = {
        Destination : {
            ToAddresses: [await getUserEmail(event.userId)]
        },
        Message : {
            Body : {
                Text : {
                    Data : notification
                }
            },
            Subject: {
                Data: "Math Department Resource Request"
            }
        },
        Source: "5801SSNotifications@gmail.com"
    };
    await sendEmail(email).then(result=>callback(null,"true"),error=>callback("false"));
};

//builds the email bdy based on the status of the request
function buildMessage(event) {
    var message = "Hello, your request to reserve Math Department Resources is ";
    switch (event.requestStatus) {
        case -1:
            message += "declined. \n" + "The reason for denial was: " + event.reasonForDenial + "\n Please contact the Math Department Office for more details.";
            break;
        case 0:
            message += "pending. You will be notified again after the Math Department Office finishes reviewing your request.";
            break;
        case 1:
            message += "approved. You may cancel the reservation at anytime by logging into your Scheduling System account.";
            break;
    }
    return message;
}

//sends the email to the user
function sendEmail(email) {
    return new Promise((resolve,reject)=>{
        ses.sendEmail(email,(err,data)=>{
           if(err) {reject(err)}
           resolve(data);
        });
    });
}

//lists the user in the cognito pool based on specified params
function listUsers(params) {
    return new Promise((resolve,reject)=>{
       cognito.listUsers(params,(err,data)=>{
    	    if(err){
        		reject(err);
        	} else {
        		resolve(data.Users);
        	}
        }); 
    });
}

//gets the user's email by calling list user with filter params to find the user by username
async function getUserEmail(userId) {
    var params = {
	    UserPoolId: 'us-east-2_0HlnZbskF',
	    Filter: "name = \"testUser2\""
    };
    return await listUsers(params).then(result=>{
            return result.filter(user=>{
                return user.Username === userId;
            })[0].Attributes.filter(atr=>{
                return atr.Name === "email";
            })[0].Value;
        },error=>console.log(error));
}
