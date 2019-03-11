// Generates the html that is put into the DynamicDiv based on the information available in the database. Takes a date as input.
function displayRooms(dateInput) {

    // object for API call
    var xhttp = new XMLHttpRequest();
    // ViewRooms API call takes a date as input.
    var myData = {"date" : dateInput};
    if(this.readyState == 4 && this.status == 200) {
        //what to do when document is ready.
    }
    console.log("I am happening!");
    // API call
    //TODO: Change this to the proper API call, Trevor needs to update it to be a POST so I can send the date!
    xhttp.open("POST", "https://v7bt1yty0b.execute-api.us-east-2.amazonaws.com/prod/adminviewrooms", false);
    xhttp.send(JSON.stringify(myData));

    console.log(xhttp.responseText);

    //JSON object from API receieved data
    var data = JSON.parse(xhttp.responseText);
    //current Column we are in
    var currentCol = 0;

    //current row we are in
    var currentRow = 1;
    //where the newHTML will go
    var parentDiv = document.getElementById("dynamicDiv");
    //the row we were in during the last loop
    var previousRow = 1;        
    //html to be added into the dynamicDiv
    var newHTML = "<div class='row' id='row" + currentRow+"'>";

    //loop through each room
    for(i in data) {

        //Each row is 3 columns wide, so we change the row ever 3 columns.
        currentRow = Math.floor(currentCol/3 + 1);

        // if currentRow changed, we need to update our row and create new html for it.
        if(currentRow != previousRow ) {
            // need to create a new row div.
            newHTML += "</div>"; // close previous row
            //create new row.
            newHTML += "<div class='row' id='row"+currentRow+"'>"

        }

        //once we know what row we are in, we create a new 'card'. These are the physical representation of a room on the webpage. Each cards background image is created with the name room# where # is that rooms number so that we can easily generate the html inside javascript.
        //newHTML += "<div class='col-md-4'><div class='card' id='"+data[i].roomID+"-col' style='width: 20rem;'><img class='card-img-top' src='room"+data[i].roomNumber+".png' alt='Card image cap'><div class='card-body'>";

        newHTML += "<div class='col-md-4'><div class='card' id='"+data[i].roomID+"-col' style='width: 20rem;'><img class='card-img-top' src='room"+data[i].roomNumber+".png' alt='Card image cap'><button class='reserve' data-toggle='collapse' data-target='#collapse"+data[i].roomID+"' aria-expanded='false' aria-constrols='collapse"+data[i].roomID+"' class='btn btn-secondary active'><span class='reserve'>Reserve</span></button><div class='card-body'>";
        
        // how many blocks we have created
        var trackNumberofBlocks = 0;

        // create initial div for the timeblocks.
        newHTML += "<div class='btn-group-toggle' data-toggle='buttons'>";

        // loop through each timeblock
        for(u in data[i].timeBlocks)
        {
            // increment number of blocks to be the currentones we have made.
            trackNumberofBlocks++;
            //Blocks are in rows of four, so every 5th block we need to create a new div and close our current one.
            if(((trackNumberofBlocks % 4) == 1)) {
                newHTML += "</div><div class='btn-group-toggle' data-toggle='buttons'>";
            }


            //This html creates the actual timeBlock button on the screen. The different information, such as ID, of the block's html was designed with the javascript in mind. Each html tag that needs to be unique is made in a similiar way using the blocks unique ID or the current rooms unique ID.
            //newHTML += "<label data-toggle='collapse' data-target='#collapse" + data[i].roomID+"' aria-expanded='false' aria-controls='collapse"+data[i].roomID+"' class='btn btn-secondary active'><input class='checkboxes' type='checkbox' checked autocomplete='off' id='"+data[i].roomID+"-"+data[i].timeBlocks[u].timeBlockId+"'><span class='times'>";

            newHTML += "<label class='btn btn-secondary active'><input class='checkboxes' type='checkbox' checked autocomplete='off' id='"+data[i].roomID+"-"+data[i].timeBlocks[u].timeBlockId+"'><span class='times'>";
            
            // gets the start hour in standard time
            var startHourRem = data[i].timeBlocks[u].startHour % 12;
            // end hour in standard time
            var endHourRem = data[i].timeBlocks[u].endHour % 12;

            // HTML for start hour
            var startHourHTML = "";
            //HTML for end hour
            var endHourHTML = "";
            //HTML for either PM or AM
            var pmHTML = "";

            // if the time blocks start hour is 12 we want a 12, not a 0. Else we want the remainder.
            if(startHourRem == 0) {
                startHourHTML += 12;
            } else {
                startHourHTML += startHourRem;
            }
            //if the time blocks end hour is 12 we want a 12 and not a 0. Else we want the remainder.
            if(endHourRem == 0) {
                endHourHTML += 12;
            } else {
                endHourHTML += endHourRem;
            }
            //checks whether it is AM or PM.
            if(data[i].timeBlocks[u].startHour >= 12) {
                pmHTML += " PM";
            } else {
                pmHTML += " AM"
            }
            //create the value on the time block the user will see.
            newHTML += startHourHTML + "-" + endHourHTML + pmHTML + "</span></label>";

        }

        // Once all time blocks are created, close out the final timeblocks div and create the collapseable drop down that spawns when you click a timeblock.
        newHTML += "</div><div id='collapse"+data[i].roomID+"' aria-expanded='false' class='collapse'><label for='reason'>Reason for Reservation:</label><textarea class='reason' rows='5' id='reason"+data[i].roomID+"'></textarea><button class='btn btn-primary' onclick='submitRequest(this.id)' type='button' id='"+data[i].roomID+"-submitButton'>Submit!</button></div>";
        newHTML += "</div></div></div>";
        // new column for the next row
        currentCol++;
        //update previousRow.
        previousRow = currentRow;
    }

    // close out the last div
    newHTML += "</div>"
    console.log(newHTML);
    //set the dynamicDiv to be the newHTML which will spawn the page in.
    parentDiv.innerHTML = newHTML;

}

// Called when the date on the page is changed, this will update the rooms to the correct date.
function dateChanged() {
    var d = getFormattedDate();
    displayRooms(d);
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

// asynchronous function that submits the information into the database.
async function submitRequest(button_id) {
    // gets all the checkboxes (timeblocks) on the page.
    var boxes = document.getElementsByClassName("checkboxes");


    var splitBtnId = button_id.split('-');
    //boxes for this room that are checked.
    var roomboxes = [];

    //loop through all boxes to find boxes for this room. We check if it is false because our checkboxes are currently checked by default for aesthetic purposes.
    for(i = 0; i < boxes.length; i++) {
        var splitId = boxes[i].id.split('-');
        if(splitId[0] == splitBtnId[0] && boxes[i].checked == false) {
            roomboxes[roomboxes.length] = boxes[i];
        }
    }

    //the room we want to reserve
    var roomID = splitBtnId[0];
    // the timeblocks ID
    //var timeBlockID = "";
    // the text the user typed in.
    var requestDescription = "";


    // get the room ID and the timeblock ID from the checked boxes id. The boxes ID is in the form 'RoomID-TimeBlockID'
    var timeBlockID = [];
    for(i = 0; i < roomboxes.length; i++) {
        var tmpSplitArr = roomboxes[i].id.split("-");
        timeBlockID[timeBlockID.length] = tmpSplitArr[1];
    }

    console.log("Before sort: " + timeBlockID);

    timeBlockID.sort(function(a,b){return a-b;});

    console.log("After Sort: " + timeBlockID);

    var lastTimeBlock = 0;
    for(i = 0; i < timeBlockID.length; i++) {
        if(i == 0) {
            lastTimeBlock = timeBlockID[i];
        } else {
            if(lastTimeBlock == timeBlockID[i]-1) {
                lastTimeBlock = timeBlockID[i];
            } else {
                alert("Please select time blocks that do not have a gap of time between them!");
                console.log(timeBlockID);
                lastTimeBlock = -1;
                break;
            }
        }
    }

    if(lastTimeBlock != -1) {


        // get the date selected.
        var dateReserved = getFormattedDate();
        // variable is a different number for day of the week. If the reservation is not reoccuring this will be -1, else it will be a number 0-6 for each day of the week where 0 is Sunday and 6 is Saturday.
        var isReoccuring = -1;

        // the radial buttons on the page for reocurring.
        var reoccurOptions = document.getElementsByName('reocurring');
        // loop through them to see which is checked.
        for(var i = 0; i < reoccurOptions.length; i++) {
            if(reoccurOptions[i].checked) {
                // if the first radial button (the YES button) is checked then we need to get the day.
                if(i==0) {
                    //create new date object
                    var d = new Date();
                    // split our selectedDate
                    var dateSplit = dateReserved.split("/");
                    // Set the month, day , and year for our Date object.
                    d.setDate(dateSplit[1]);
                    d.setMonth(dateSplit[0] - 1);
                    d.setFullYear(dateSplit[2]);

                    //set isReocurring to a 0-6 for Sunday - Saturday
                    isReoccuring = d.getDay();
                } 
            }
        }

        //user id
        var userReservedID = user.getSSUsername();

        //status of request. 1 = approved (this happens if faculty)
        var status = 0;
        // whether the user is faculty or not.
        var isFaculty = await user.getSSUserAttributes()
        .then(result=>
              {return result['custom:userLevel']
              })
        .catch(error=>console.log('failed to get user level'));


        // update status to 1 if the user is faculty.
        if(isFaculty == 1) {
            status = 1;
        }

        //update requestDescription

        requestDescription = document.getElementById("reason"+roomID).value;
        if(requestDescription == "" || requestDescription == null) {
            requestDescription = "No Reason Given";
        }

        if(timeBlockID.length > 0) {

            // data to upload.
            var dataUpload = {"dateReserved":dateReserved,
                              "descriptionOfEvent":requestDescription,
                              "reoccuring":isReoccuring,
                              "timeBlockReservedID":timeBlockID,
                              "roomReservedID":roomID,
                              "userReservedID":userReservedID,
                              "status": status};



            // create API call to SubmitRequest
            var xhttp = new XMLHttpRequest();
            //once API call finishes we want to refresh the time blocks
            xhttp.onreadystatechange = function() {
                if(this.readyState == 4 && this.status == 200) {
                    //what to do when document is ready.
                    // call DateChanged() to refresh the time blocks. This will call DisplayRooms again with the correct date.
                    dateChanged();
                }
            }
            xhttp.open("POST", "https://v7bt1yty0b.execute-api.us-east-2.amazonaws.com/prod/adminrequestroom", "false");
            xhttp.send(JSON.stringify(dataUpload));
        }
        else {
            alert("Please select at least one time block");
        }

    }
}

// gets todays date for the initial call to displayRooms.
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

// this isn't getting called for some reason: Was supposed to update the date on the page to be todays date.
function setInitialDate() {
    var d = getInitialDate();
    var dSplit = d.split("/");
    document.getElementById('datePicker').value = dSplit[0]+dSplit[1]+dSplit[2];

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

datePickerString += yearString+"-"+monthString.slice(-2)+"-"+dayString.slice(-2);// set the date on our page to be todays date.
document.getElementById('datePicker').value = datePickerString;
//display the rooms for today.
displayRooms(d);