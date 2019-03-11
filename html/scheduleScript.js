// object for API call
var xhttp = new XMLHttpRequest();

if(this.readyState == 4 && this.status == 200) {
    //what to do when document is ready.
}
console.log("I am happening!");
// API call
xhttp.open("GET", "https://rmhlulauwc.execute-api.us-east-2.amazonaws.com/prod/suggestschedule", false);
xhttp.send();

console.log(xhttp.responseText);

//JSON object from API receieved data
var data = JSON.parse(xhttp.responseText);

//displays the tutors for the proper day.
function displayTutors(dayID) {
    //the data for just the selected day.
    var dayData = null;
    
    
    
    if(dayID == "monday") {
        dayData = data.days[0];
    } else if(dayID == "tuesday") {
        dayData = data.days[1];
    } else if(dayID == "wednesday") {
        dayData = data.days[2];
    } else if(dayID == "thursday") {
        dayData = data.days[3];
    } else {
        dayData = data.days[4];
    }

    for(i in dayData.courses) {
        var courseName = dayData.courses[i].cName;
        var courseFull = true;
        for(t in dayData.courses[i].timeBlocks) {
            var htmlToEdit = document.getElementById(courseName+"-"+dayData.courses[i].timeBlocks[t].timeBlockId);
            if(htmlToEdit != null) {
                htmlToEdit.innerHTML = dayData.courses[i].timeBlocks[t].tutor;
                if(dayData.courses[i].timeBlocks[t].tutor == null) {
                    courseFull = false;
                    document.getElementById(courseName+"head").className = "card-header bad";
                }
            }
            
            if(courseFull == true) {
                document.getElementById(courseName+"head").className = "card-header good";
            } else {
                document.getElementById(courseName+"head").className = "card-header bad";
            }

        }
    }

}