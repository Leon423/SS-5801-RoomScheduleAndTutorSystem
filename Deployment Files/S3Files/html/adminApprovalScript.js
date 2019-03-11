// alters the InnerHTML of the dyanmicDiv to display the requests that are currently in a pending state
function displayPendingRequests() {
    // object for API call
    var xhttp = new XMLHttpRequest();
    // ViewRooms API call takes a date as input.

    if(this.readyState == 4 && this.status == 200) {
        //what to do when document is ready.
    }
    // API call
    xhttp.open("GET", "https://v7bt1yty0b.execute-api.us-east-2.amazonaws.com/prod/adminviewrequests", false);
    xhttp.send();

    console.log(xhttp.responseText);

    //JSON object from API receieved data
    var data = JSON.parse(xhttp.responseText);

    //the html that will be generated.
    var newHTML = "";

    //loop through each pending request.
    for(i in data) {

        //name of user who made request
        var name = data[i].userReservedID;
        //date of request
        var date = data[i].dateReserved;
        //array of time blocks
        var times = data[i].timeBlockReservedID;
        //requested room
        var room = data[i].roomReservedID;
        //description of the request
        var description = data[i].descriptionOfEvent;
        //reqID used to create unique identifiers on buttons
        var reqID = data[i].requestID;

        //reoccuring
        var reoccurText = "No";
        if(data[i].reoccuring != -1) {
            reoccurText = "Yes";
        }
        //smallest time block (the start blocks ID)
        var smallestTB = 999;
        // biggest time block (the end blocks ID)
        var biggestTB = 0;
        //get the biggest and smallest time block
        for(i = 0; i < times.values.length; i++) {

            if(times.values[i] < smallestTB) {
                smallestTB = times.values[i];
            }

            if(times.values[i] > biggestTB) {
                biggestTB = times.values[i];
            }
        }

        //error checking, have never had it happen.
        if(biggestTB == 0 || smallestTB == 999) {
            alert("SOMETHING WENT WRONG!: BIGGEST:" + biggestTB + " SMALLEST: " +smallestTB);
        }

        // start time based on the smallblock ID. Gives a number 0-11 and a 0 is turned into a 12.
        var startTime = (smallestTB + 7) % 12;
        // end time based on biggestblock ID. Works the same as above but adds one to get the end time of the block instead of the start time.
        var endTime = (biggestTB + 8) % 12;

        //turn a 0 into a 12
        if(startTime == 0) {
            startTime = 12;
        }

        //turn a 0 into a 12
        if(endTime == 0) {
            endTime = 12;
        }

        // Create the 'acordion' on adminApproval page.
        newHTML += "<div id='reqContainer"+reqID+"'><div class='card'><div class='card-header'><div class='row body'><div class='col'><span>"+name+"</span></div><div class='col'><span>"+date+"</span></div><div class='col'><span>"+startTime + "-" + endTime+"</span></div><div class='col'><span>"+room+"</span></div><div class='col'><span>"+reoccurText+"</span></div><div class='col'><h5><a href='#collapse" + reqID + "' data-toggle='collapse'>Details</a></h5></div></div></div></div><div id='collapse" + reqID + "' class='collapse'><div class='card-body'><div class='row'><div class='col'> <textarea rows='5' id='reason' placeholder='" + description + "' disabled></textarea></div><div class='col'><textarea rows='3' class='adminReason' id='adminReason/"+reqID+"' placeholder='If the request is declined please give a reason'></textarea><button id='button/"+reqID+"/approve/"+name+"' class='btn btn-success' onclick=approveRequest(this.id)><i class='fa fa-check'></i>Approve</button><button id='button/"+reqID+"/decline/"+name+"' class='btn btn-danger' onclick=denyRequest(this.id)><i class='fa fa-times'></i>Decline</button></div></div></div></div></div>";
    }

    console.log(newHTML);

    //replace the html in dynamicDiv
    document.getElementById('dynamicDiv').innerHTML = newHTML;
}

//called when the Approve button for a request is pressed. Params: RQID = ID of the button which is used to get the ID of the request.
function approveRequest(RQID) {

    //API call is done the same as in every other script.
    var xhttp = new XMLHttpRequest();
    if(this.readyState == 4 && this.status == 200) {

    }

    //The ApproveButton's ID is dynamically generated in the form button/reqID/approve so we split the ID of the button and get the second element of the split.
    var reqID = RQID.split('/');
    
    //the user who made this request.
    var uName = reqID[3];
    //reason for denial
    var reason = document.getElementById('adminReason/'+reqID[1]).value;
    // JSON object to pass to the API. Just needs the ID of the request we are denying.
    var data = {"requestID" : reqID[1],
               "userID" : uName,
               "comments" : reason};
    
    console.log("Request Approved");
    //API call
    xhttp.open("POST", "https://v7bt1yty0b.execute-api.us-east-2.amazonaws.com/prod/adminapproverequest", false);
    xhttp.send(JSON.stringify(data));

    document.getElementById('reqContainer'+reqID[1]).innerHTML = "";
}

//called when the Denied button for a request is pressed. Params: RQID = ID of the button which is used to get the ID of the request.
function denyRequest(RQID) {

    //API call done in same way as every other script.
    var xhttp = new XMLHttpRequest();
    if(this.readyState == 4 && this.status == 200) {

    }

    //The DenyButton's ID is dynamically generated in the form button/reqID/decline so we split the ID of the button and get the second element of the split.
    var reqID = RQID.split('/');
    //the user who made this request.
    var uName = reqID[3];
    //reason for denial
    var reason = document.getElementById('adminReason/'+reqID[1]).value;
    // JSON object to pass to the API. Just needs the ID of the request we are denying.
    var data = {"requestID" : reqID[1],
               "userID" : uName,
               "comments" : reason};

    console.log("Request Denied");
    //API call
    xhttp.open("POST", "https://v7bt1yty0b.execute-api.us-east-2.amazonaws.com/prod/admindeclinerequest", false);
    xhttp.send(JSON.stringify(data));

    document.getElementById('reqContainer'+reqID[1]).innerHTML = "";

}
//Call displayPendingRequests() when the page loads.
displayPendingRequests();