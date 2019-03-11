function displayRequests(dateInput) {
    // object for API call
    var xhttp = new XMLHttpRequest();
    //data to send to API
    var myData = {"date" : dateInput};
    if(this.readyState == 4 && this.status == 200) {
        //do stuff when document ready
    }

    console.log(myData);

    xhttp.open("POST", "https://v7bt1yty0b.execute-api.us-east-2.amazonaws.com/prod/adminviewallreserved" ,false);
    xhttp.send(JSON.stringify(myData));

    console.log(xhttp.responseText);
    requestData = JSON.parse(xhttp.responseText);

    var rooms = [];
    // loop through each request to build array of rooms
    for(i in requestData) {
        var roomNum = requestData[i].roomReservedID;

        if(!rooms.includes(roomNum)) {
            rooms[rooms.length] = roomNum;
        }
    }

    var newHTML = "<div class ='container border main'>";

    // loop through each room and create html
    for(i in rooms) {
        newHTML += "<div class='card'><div class='card-header'><div class='row body'><div class='col'><span id='"+rooms[i]+"'>"+rooms[i]+"</span></div><div class='col'><h5><a href='#collapse"+rooms[i]+"' data-toggle='collapse'>Details</a></h5></div></div></div></div><div class='collapse' id='collapse"+rooms[i]+"'><div class='card-body'><div class='container'><table class='table table-bordered'><thead><tr><th>8</th><th>9</th><th>10</th><th>11</th><th>12</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th></tr></thead><tbody><tr><td><a class='timeSlot' href='javascript:;' id='"+rooms[i]+"/time/1' onclick='displayDetails(this.id)'></a></td><td><a class='timeSlot' href='javascript:;' id='"+rooms[i]+"/time/2' onclick='displayDetails(this.id)'></a></td><td><a class='timeSlot' href='javascript:;' id='"+rooms[i]+"/time/3' onclick='displayDetails(this.id)'></a></td><td><a class='timeSlot' href='javascript:;' id='"+rooms[i]+"/time/4' onclick='displayDetails(this.id)'></a></td><td><a class='timeSlot' href='javascript:;' id='"+rooms[i]+"/time/5' onclick='displayDetails(this.id)'></a></td><td><a class='timeSlot' href='javascript:;' id='"+rooms[i]+"/time/6' onclick='displayDetails(this.id)'></a></td><td><a class='timeSlot' href='javascript:;' id='"+rooms[i]+"/time/7' onclick='displayDetails(this.id)'></a></td><td><a class='timeSlot' href='javascript:;' id='"+rooms[i]+"/time/8' onclick='displayDetails(this.id)'></a></td><td><a class='timeSlot' href='javascript:;' id='"+rooms[i]+"/time/9' onclick='displayDetails(this.id)'></a></td><td><a class='timeSlot' href='javascript:;' id='"+rooms[i]+"/time/10' onclick='displayDetails(this.id)'></a></td><td><a class='timeSlot' href='javascript:;' id='"+rooms[i]+"/time/11' onclick='displayDetails(this.id)'></a></td><td><a class='timeSlot' href='javascript:;' id='"+rooms[i]+"/time/12' onclick='displayDetails(this.id)'></a></td></tr></tbody></table><div class='row'><table class='table'><thead><tr><th scope='col'>First</th><th scope='col'>Last</th><th scope='col'>Reocurring</th><th scope='col'>Reason</th></tr></thead><tbody><tr><th id='"+rooms[i]+"First'></th><th id='"+rooms[i]+"Last'></th><th id='"+rooms[i]+"Reocurring'></th><th id='"+rooms[i]+"Reason'></th></tr></tbody></table></div></div></div></div>"
    }

    // closeout first div
    newHTML += "</div>";
    
    document.getElementById('dynamic').innerHTML = newHTML;

    // loop through all of todays request and fill the table.
    for(i in requestData) {
        for(u in requestData[i].timeBlockReservedID.values) {
            console.log(requestData[i].roomReservedID +"/time"+requestData[i].timeBlockReservedID.values[u]);
            document.getElementById(requestData[i].roomReservedID +"/time/"+requestData[i].timeBlockReservedID.values[u]).innerHTML = requestData[i].userReservedID;
        }
    }
}

function displayDetails(reserveInfo) {
    // name of reservee
    var nameUser = null;
    //reason for reservation
    var reason = null;
    //if it reoccurs or not
    var reoccur = "No";
    //id is in form roomnumber/time/timeblockid
    var splitID = reserveInfo.split('/');
    var breakCheck = false;
    for(i in requestData) {
        if(requestData[i].roomReservedID == splitID[0]) {
            // same room. check time block
            for(u in requestData[i].timeBlockReservedID.values) {
                //check if they are the same, if so we are in the same room and time block so we have the right reservation.
                if(requestData[i].timeBlockReservedID.values[u] == splitID[2]) {
                    nameUser = requestData[i].userReservedID;
                    reason = requestData[i].descriptionOfEvent;
                    if(requestData[i].reoccuring != -1) {
                        reoccur = "Yes";
                    }
                    breakCheck = true;
                    break;
                }
            }
        }
        
        if(breakCheck) {
            break;
        }
    }
    
    var splitName = nameUser.split(" ");
    
    document.getElementById(splitID[0]+'First').innerHTML = splitName[0];
    
    
    document.getElementById(splitID[0]+'Last').innerHTML = splitName[1];
    document.getElementById(splitID[0]+'Reocurring').innerHTML = reoccur;
    document.getElementById(splitID[0]+'Reason').innerHTML = reason;
}

// gets todays date on page load
function getInitialDate(){
    var d = new Date();
    var returnString = "";
    if((d.getMonth() + 1) < 10) {
        returnString += "0" + (d.getMonth()+1) + "/";

    } else {
        returnString += (d.getMonth() + 1) + "/";
    }
    if(d.getDate() < 10) {
        returnString += "0" + d.getDate() + "/";
    } else {
        returnString += d.getDate() + "/";
    }
    returnString += d.getFullYear();

    return returnString;
}

// Called when the date on the page is changed, this will update the requests to show the ones for this date
function dateChanged() {
    var d = getFormattedDate();
    displayRequests(d);
}

// returns the date selected on the page, properly formatted for the API call.
function getFormattedDate() {
    //get the date from the datepicker
    var dateP = document.getElementById("datePicker").value;
    //split date at -
    var dateSplit = dateP.split("-");
    // return in form MM/DD/YYYY
    return dateSplit[1] + "/" + dateSplit[2] + "/" + dateSplit[0];
}

// formatted for API date of today.
var d = getInitialDate();
// used to change the date on the page.
var date = new Date();
// what the date is set to on the page.
var datePickerString = "";
// gets todays date, formatted properly for the date HTML object.
monthString = "0"+(date.getMonth()+1);
yearString = date.getFullYear();
dayString = "0"+date.getDate();

var requestData = null;

datePickerString += yearString+"-"+monthString.slice(-2)+"-"+dayString.slice(-2);
// set the date on our page to be todays date.
document.getElementById('datePicker').value = datePickerString;
//display the requests for today
displayRequests(d);