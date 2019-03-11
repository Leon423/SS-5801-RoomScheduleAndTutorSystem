/*
*	A function that redirects the window to the specified url
*/
function redirect(url) {
	if (url) {
		window.location.assign(url);
	}
}

/*
*	A function that converts a Attribute Name Attribute value array to name value pairs
* 	IE {"Name" : "Example", "Value" : "Example's Value"} => {"Example" : "Example's Value"}
*/
function convertToNameValue(fVArray) {
	var object = new Object();
	for (let i = fVArray.length-1; i >=0; i--) {
		object[fVArray[i].Name] = fVArray[i].Value;
	};
	return object;
}

/*
*	Takes an array of attributes creates an array of cognitoUser attributes
*/
function createUserAttributeList(attributes) {
	var attributeList = [];
	for(let i = attributes.length-1; i >= 0; i--) {
		attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute(attributes[i]));
	}
	return attributeList;
}

/*
*	Takes values specific to SS registration and creates an array of cognitoUser attributes that can be passed to UserObject.signUpSSUser
*/
function createSignUpUserAttributeList(name,email,yId,userType=0) {
	var attributeList = [];
	attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name : 'name', Value : name}));
	attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name : 'email', Value : email}));
	attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name : 'custom:ysuId', Value : yId}));
	attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name : 'custom:userLevel', Value : userType}));
	return attributeList;
}

class UserObject {
	/*
	* Constructor for user object.
	* @param fromStorage If set to true, attempts to pull user from storage, will redirect to the login page on failure.
	*/
	constructor(fromStorage=false) {
		this.userPool = this.initUserPool();
		if (fromStorage) {
			if (this.setCurrentCognitoUser()) {
				this.getSSUserSession()
				.then(result=>console.log('Session retrieved, User logged in!'))
	        	.catch(error=>{
	        		console.log('Attmepted to retireve user session but failed. Error: ' + error);
	        		redirect("https://s3.us-east-2.amazonaws.com/5801-ss/html/signIn.html");
	        	});
			} else {
				console.log('Not Logged in! Redirecting to login!');
				//alert('You must log in. Redirecting to the login page.')
				redirect("https://s3.us-east-2.amazonaws.com/5801-ss/html/signIn.html");
				this.cognitoUser = null;
			}
		} else this.cognitoUser = null;
	}

	/*
	*	Initializes the cognito user pool for the instance
	*/
	initUserPool() {
	    var poolData =  {
	        "UserPoolId" : "us-east-2_0HlnZbskF", // Your user pool id here
	        "ClientId" : "68ol44e7n6t83jdk8j0sqjsh9g" // Your client id here
	    };
	    return new AmazonCognitoIdentity.CognitoUserPool(poolData);
	}

	/*
	*	Creates a cognito authenticationdetails object from user authentication data
	*/
	initAuthDetails(pwd) {
		var authenticationData = {
	        Username : this.username,
	        Password : pwd,
	    };
    	this.authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
	}

	/*
	*	Creates a cognito user object for the instance
	*/
	initCognitoUser() {
    	var userData = {
        	Username : this.username,
        	Pool : this.userPool
    	};
    	this.cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
	}

	/*
	*	User to login
	*	@param username required. Username of user to login
	*	@param password required. Pasword of user
	*	@param redirectUrl optional. Will redirect to the url on succesful login
	*/
	login(username, password, userType, redirectUrl=null) {
		return new Promise((resolve,reject) => {
			this.username = username;
			//https://5801-ss.auth.us-east-2.amazoncognito.com/login?response_type=token&client_id=68ol44e7n6t83jdk8j0sqjsh9g&redirect_uri=https://s3.us-east-2.amazonaws.com/testamplify-tsmith/index.html
			try {
				this.validateLogin(username,password);
				this.initAuthDetails(password);
		    	this.initCognitoUser();
		    	this.checkUserLevel(userType)
		    		.then(result => this.authenticateSSUser())
		    		.then(result => this.getSSUserSession())
		    		.then(result => redirect(redirectUrl))
		    		.then(result => resolve(true))
		    		.catch(error => {
		    			switch (error.code) {
		    				case "UserNotConfirmedException":
		    					console.log("user not confirmed.");
		    					break;
	    					case "UserNotFoundException":
	    						console.log("User not Found!");
	    						alert("No user " + username + " was found.");
	    						break;
		    				default:
		    					console.error(error);
	    				}
	    				reject(false);
		    		});
		    	//setTimeout(this.getSSUserSession(redirectUrl), 1000);
		    	//console.log("Redirecting to: " + redirectUrl);
			} catch(err) {
				alert("Login Failed!\n" + err);
			}
		}).then(result => {return result},error=>{return error});
	}

	/*
	*	Authenticates the user against the cognito identity pool and in turn the cognito user pool
	*/
	authenticateSSUser() {
		return new Promise((resolve,reject) => {
			this.cognitoUser.authenticateUser(this.authenticationDetails, {
		        onSuccess: function(result) {
		        	console.log("authenticate success");
		        	AWS.config.region = 'us-east-2';
		        	//if (!AWS.config.credentials) {
	        		console.log("creds" + AWS.config.credentials)
					AWS.config.credentials = new AWS.CognitoIdentityCredentials({
				        IdentityPoolId : 'us-east-2:af8894ab-ac91-4780-9316-b0c730dc8476', // your identity pool id here
				        Logins : {
				            // Change the key below according to the specific region your user pool is in.
				            'cognito-idp.us-east-2.amazonaws.com/us-east-2_0HlnZbskF' : result.getIdToken().getJwtToken()
				        }
				    });
					    //console.log(result.getIdToken().getJwtToken());
					    //console.log("AWS conf:"+AWS.config.credentials.Logins['cognito-idp.us-east-2.amazonaws.com/us-east-2_0HlnZbskF']);
				    //} else {
				    //AWS.config.credentials.IdentityPoolId = 'us-east-2:af8894ab-ac91-4780-9316-b0c730dc8476';
				    //AWS.config.credentials.Logins['cognito-idp.us-east-2.amazonaws.com/us-east-2_0HlnZbskF']  = result.getIdToken().getJwtToken();
				    //}
				    console.log("refresh cred");
				    //refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
				    AWS.config.credentials.refresh((error) => {
				        if (error) {
				        	console.log("refresh failed");
			             	AWS.config.credentials.refresh((error1) => {
				        		if (error1) {
				        			console.log("refresh failed");
			             			reject(error1);
			             		}
			             		resolve(true);
				    		});
			             }
			             resolve(true);
				    });
		        },
		        onFailure: function(err) {
		            reject(err);
		        },
		    });
	    });
	}

	/*
	*	Validates login in information entered by the end user
	*/
	validateLogin(username, password) {
		console.log("Validating input");
		if (!username | !password) throw "Must input an email and password!";
		if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(username)) throw "You entered an invalid email!"
	}

	/*
	*	sets the instance cognito user to the user stored in storage
	*/
	setCurrentCognitoUser() {
		try {
	    	this.cognitoUser = this.userPool.getCurrentUser();
	    	return true;
	    } catch (err) {
	    	return false;
	    }
	}

	/*
	*	Gets a session for the cognito user and stores in local session storage
	*/
	getSSUserSession() {
		return new Promise((resolve,reject) => {
			console.log("get session");
			this.cognitoUser.getSession((err, session)=>{
		        if (err) {
		        	console.log(err);
		        	reject(err);
		        }
    			this.refreshUserIDToken();
		        console.log('session validity: ' + session.isValid());
		        resolve(session);
		    });
		});
	}

	/*
	*	Returns the current user IdToken which is used to make api calls
	*/
	getUserIdToken() {
		return this.cognitoUser.getSignInUserSession().getIdToken().getJwtToken();
	}

	signUpSSUser(username, password, attributeList) {
		return new Promise((resolve,reject)=>{
			this.userPool.signUp(username,password,attributeList,null,(err, result)=>{
		        if (err) {
		            reject(err.message);
		        }
		        this.cognitoUser = result.user;
		        resolve(result);
		    });
		});
	}

	/*
	*	Signs out the currently logged in user
	*/
	signOutSSUser(redirectUrl=null) {
		try {
			//AWS.config.credentials.clearCachedId();
			this.cognitoUser.signOut();
			//AWS.config.credentials.clearCachedId();
			redirect(redirectUrl);
			console.log('Signed out!');
			return true;
		} catch (err) {
			console.error(err);
			return false;
		}
	}

	/*
	*	retunrs the curent user's attributes in JSON format
	*/
	getSSUserAttributes() {
		if (this.cognitoUser != null) {
			return new Promise((resolve,reject) => {
				this.cognitoUser.getUserAttributes(function(err,result) {
					if (err) {
						reject(err);
					}
					resolve(convertToNameValue(result));
				});
			}).then(result => {
					return result;
				})
				.catch(error=>{console.log(error)});
		} else {
			console.log('cognitoUser is null');
		}
	}

	/*
	*	returns the current user's username
	*/
	getSSUsername() {
		return this.cognitoUser.getUsername();
	}

	verifySSUser(confCode) {
		return new Promise((resolve,reject) => {
			this.cognitoUser.confirmRegistration(confCode, true, (err,result)=>{
				if(err) {
					console.log(err.message);
					reject(err);
				}
				console.log('Registration Confirmed');
				resolve(result);
			});
		});
	}

	/*
	*	resends a verification code to the current user which is used to verify the account
	*/
	resendVerificationCode() {
		return new Promise((resolve,reject) => {
			this.cognitoUser.resendConfirmationCode((err,result) => {
				if (err) {
					console.log(err.message);
					reject(err);
				}
				console.log('Confirmation code resent');
				resolve(result);
			});
		});
	}

	/*
	*	Deletes the currently authenticated user
	*/
	deleteSSUser() {
		return new Promise((resolve,reject) => {
			this.cognitoUser.deleteUser((err,result) => {
				if (err) {
					//console.log(err);
					reject(err);
				} else {
					console.log('User deleted');
					resolve(result);
				}
			});
		});
	}

	/*
	*	sets the ID token to refresh upon expiration, ID tokens expire every hour
	*/
	refreshUserIDToken() {
		setInterval(()=>{
			if (AWS.config.credentials.needsRefresh()) {
				this.cognitoUser.refreshSession(refresh_token, (err, session) => {
					if(err) {
						console.log(err);
					} else {
						AWS.config.credentials.params.Logins['cognito-idp.us-east-2.amazonaws.com/us-east-2_0HlnZbskF']  = session.getIdToken().getJwtToken();
						AWS.config.credentials.refresh((err)=> {
	            			if(err)  {
	              				console.log(err);
	            			} else {
	              				console.log("TOKEN SUCCESSFULLY UPDATED");
	            			}
	          			});
	        		}
	      		});
			}
		}, 600000);
	}

	/*
	*	Takes an array of cognito user attributes and sets the current cognito user's attributes equal to it
	*/
	updateSSUserAttribute(attributeList) {
		return new Promise((resolve,reject)=>{
			cognitoUser.updateAttributes(attributeList, (err, result)=>{
		        if (err) {
		            console.log(err.message);
		            reject(err.message);
		        }
		        resolve(result);
		    });
		});
	}

	checkUserLevel(userLevel) {
		var params = {
			"typeCheck" : userLevel,
			"userID" : this.username
		};
		return new Promise((resolve,reject) => {
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					console.log(this.responseText);
					if(this.responseText == 'true') resolve(true);
					else {
						alert("Your account is not a(n) " + userLevel + " account. Please use the appropiate logon for your account.");
						reject("user level check failed");
					} 
				}
			};
			xhttp.open("POST", "https://v7bt1yty0b.execute-api.us-east-2.amazonaws.com/prod/checkuserlevel", true);
			xhttp.send(JSON.stringify(params));
		});
	}
}