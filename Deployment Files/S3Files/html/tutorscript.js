// displays the tutors inside the select html element so that they may be clicked on and the information can be  edited in the form.
function displayTutors() {

    //make sure stylesheet is right
    document.getElementById('dynamicStyleSheet').innerHTML = "<link rel='stylesheet' href='viewTutors.css'>";

    // create API call to our GetTutors() Lambda function.
    var xhttp = new XMLHttpRequest();
    if(this.readyState == 4 && this.status == 200) {
        //what to do when document is ready.
    }
    console.log("I am happening!");
    xhttp.open("GET", "https://rmhlulauwc.execute-api.us-east-2.amazonaws.com/prod/gettutors", false);
    xhttp.send();

    console.log(xhttp.responseText);


    //JSON object created from the data received from the API call.
    var data = JSON.parse(xhttp.responseText);
    // html code to put inside the dynamicDiv. Starts with code that is always generated
    var newHTML = "<div class ='container'><form class='border border-light p-5'><div class='row' id='row1'><div class='col-md-12'><h1><span class='fa fa-user-plus'></span>EDIT OR ADD TUTOR</h1><button onclick='spawnFormWithInfo()' class='btn btn-default contents'>EDIT<span class='fa fa-pencil'></span></button></div></div><div class='row' id='row2'><div class='col-md-12 box'><div class='form-group contents'><select multiple class='form-control' id='selectTutor'>";

    // loops through each tutor
    // create array of strings for the Tutor Names, this is so we can sort it alphabetically since the LAMBDA function does not return them alphabetically.
    var nameString = [];
    for(i in data) {
        nameString[i] = data[i].tutorName;
    }

    nameString.sort();
    // perform creation of html inside the scrollbox here.
    for(i in data) {
        newHTML += "<option id='tutorID'>" + nameString[i] + "</option>";

    }
    // end creation of the scrollbox here and finish spawning the page.
    newHTML += "</select></div></div></div><div class='row' id='row3'><div class='col-md-12'><button onclick='spawnForm()' class='btn btn-default bottom'>ADD<span class ='fa fa-plus'></span></button></div></div></form></div>";

    // set the dynamicDiv of the page to be the generated HTML, which will create the page.
    document.getElementById('dynamicDiv').innerHTML = newHTML;

}

//replaces the dynamicDiv with a form that will add a tutor into the database or replace a tutor that already exists. Also changes the css stylesheet to the appropriate one.
function spawnForm() {
    //html for the form is static, this simply spawns it in.
    var newHTML = "<div class='container'><div class='row'></div><!-- div for the gray box for form --><div class='main-form'><div class='heading'><h1>Tutor Infomation</h1><hr></div><form class='form' method='post' action='#'><div class='form-group'><label for='name' class='text-control'>Name</label><input type='text' class='form-control' name='name' id='name' placeholder='Enter Tutors Name'></div><!-- Mondays availability --><div class='form-group'><label for='monday' class='text-control'>Monday</label><br><div class='form-check-inline'><input class='form-check-input' name='monday' type='checkbox' id='monday-2' ><label class='form-check-label' for='inlineCheckbox2'>9-10</label></div><div class='form-check-inline'><input class='form-check-input' name='monday' type='checkbox' id='monday-3' value='option3'><label class='form-check-label' for='inlineCheckbox3'>10-11</label></div><div class='form-check-inline'><input class='form-check-input' name='monday' type='checkbox' id='monday-4'><label class='form-check-label' for='inlineCheckbox1'>11-12</label></div><div class='form-check-inline'><input class='form-check-input' name='monday' type='checkbox' id='monday-5'><label class='form-check-label' for='inlineCheckbox1'>12-1</label></div><div class='form-check-inline'><input class='form-check-input' name='monday' type='checkbox' id='monday-6'><label class='form-check-label' for='inlineCheckbox2'>1-2</label></div><br><div class='form-check-inline'><input class='form-check-input' name='monday' type='checkbox' id='monday-7'><label class='form-check-label' for='inlineCheckbox3'>2-3</label></div><div class='form-check-inline'><input class='form-check-input' name='monday' type='checkbox' id='monday-8'><label class='form-check-label' for='inlineCheckbox1'>3-4</label></div><div class='form-check-inline'><input class='form-check-input' name='monday' type='checkbox' id='monday-9'><label class='form-check-label' for='inlineCheckbox2'>4-5</label></div><div class='form-check-inline'><input class='form-check-input' name='monday' type='checkbox' id='monday-10'><label class='form-check-label' for='inlineCheckbox3'>5-6</label></div></div><!-- Tuesday availability --><div class='form-group'><label for='tuesday' class='text-control'>Tuesday</label><br><div class='form-check-inline'><input class='form-check-input' name='tuesday' type='checkbox' id='tuesday-2' ><label class='form-check-label' for='inlineCheckbox2'>9-10</label></div><div class='form-check-inline'><input class='form-check-input' name='tuesday' type='checkbox' id='tuesday-3' value='option3'><label class='form-check-label' for='inlineCheckbox3'>10-11</label></div><div class='form-check-inline'><input class='form-check-input' name='tuesday' type='checkbox' id='tuesday-4'><label class='form-check-label' for='inlineCheckbox1'>11-12</label></div><div class='form-check-inline'><input class='form-check-input' name='tuesday' type='checkbox' id='tuesday-5'><label class='form-check-label' for='inlineCheckbox1'>12-1</label></div><div class='form-check-inline'><input class='form-check-input' name='tuesday' type='checkbox' id='tuesday-6'><label class='form-check-label' for='inlineCheckbox2'>1-2</label></div><br><div class='form-check-inline'><input class='form-check-input' name='tuesday' type='checkbox' id='tuesday-7'><label class='form-check-label' for='inlineCheckbox3'>2-3</label></div><div class='form-check-inline'><input class='form-check-input' name='tuesday' type='checkbox' id='tuesday-8'><label class='form-check-label' for='inlineCheckbox1'>3-4</label></div><div class='form-check-inline'><input class='form-check-input' name='tuesday' type='checkbox' id='tuesday-9'><label class='form-check-label' for='inlineCheckbox2'>4-5</label></div><div class='form-check-inline'><input class='form-check-input' name='tuesday' type='checkbox' id='tuesday-10'><label class='form-check-label' for='inlineCheckbox3'>5-6</label></div></div><!-- Wednesday availability --><div class='form-group'><label for='wednesday' class='text-control'>Wednesday</label><br><div class='form-check-inline'><input class='form-check-input' name='wednesday' type='checkbox' id='wednesday-2' ><label class='form-check-label' for='inlineCheckbox2'>9-10</label></div><div class='form-check-inline'><input class='form-check-input' name='wednesday' type='checkbox' id='wednesday-3' value='option3'><label class='form-check-label' for='inlineCheckbox3'>10-11</label></div><div class='form-check-inline'><input class='form-check-input' name='wednesday' type='checkbox' id='wednesday-4'><label class='form-check-label' for='inlineCheckbox1'>11-12</label></div><div class='form-check-inline'><input class='form-check-input' name='wednesday' type='checkbox' id='wednesday-5'><label class='form-check-label' for='inlineCheckbox1'>12-1</label></div><div class='form-check-inline'><input class='form-check-input' name='wednesday' type='checkbox' id='wednesday-6'><label class='form-check-label' for='inlineCheckbox2'>1-2</label></div><br><div class='form-check-inline'><input class='form-check-input' name='wednesday' type='checkbox' id='wednesday-7'><label class='form-check-label' for='inlineCheckbox3'>2-3</label></div><div class='form-check-inline'><input class='form-check-input' name='wednesday' type='checkbox' id='wednesday-8'><label class='form-check-label' for='inlineCheckbox1'>3-4</label></div><div class='form-check-inline'><input class='form-check-input' name='wednesday' type='checkbox' id='wednesday-9'><label class='form-check-label' for='inlineCheckbox2'>4-5</label></div><div class='form-check-inline'><input class='form-check-input' name='wednesday' type='checkbox' id='wednesday-10'><label class='form-check-label' for='inlineCheckbox3'>5-6</label></div></div><!-- Thursday availabilty --><div class='form-group'><label for='thursday' class='text-control'>Thursday</label><br><div class='form-check-inline'><input class='form-check-input' name='thursday' type='checkbox' id='thursday-2' ><label class='form-check-label' for='inlineCheckbox2'>9-10</label></div><div class='form-check-inline'><input class='form-check-input' name='thursday' type='checkbox' id='thursday-3' value='option3'><label class='form-check-label' for='inlineCheckbox3'>10-11</label></div><div class='form-check-inline'><input class='form-check-input' name='thursday' type='checkbox' id='thursday-4'><label class='form-check-label' for='inlineCheckbox1'>11-12</label></div><div class='form-check-inline'><input class='form-check-input' name='thursday' type='checkbox' id='thursday-5'><label class='form-check-label' for='inlineCheckbox1'>12-1</label></div><div class='form-check-inline'><input class='form-check-input' name='thursday' type='checkbox' id='thursday-6'><label class='form-check-label' for='inlineCheckbox2'>1-2</label></div><br><div class='form-check-inline'><input class='form-check-input' name='thursday' type='checkbox' id='thursday-7'><label class='form-check-label' for='inlineCheckbox3'>2-3</label></div><div class='form-check-inline'><input class='form-check-input' name='thursday' type='checkbox' id='thursday-8'><label class='form-check-label' for='inlineCheckbox1'>3-4</label></div><div class='form-check-inline'><input class='form-check-input' name='thursday' type='checkbox' id='thursday-9'><label class='form-check-label' for='inlineCheckbox2'>4-5</label></div><div class='form-check-inline'><input class='form-check-input' name='thursday' type='checkbox' id='thursday-10'><label class='form-check-label' for='inlineCheckbox3'>5-6</label></div></div><!-- Friday availabilty --><div class='form-group'><label for='friday' class='text-control'>Friday</label><br><div class='form-check-inline'><input class='form-check-input' name='friday' type='checkbox' id='friday-2' ><label class='form-check-label' for='inlineCheckbox2'>9-10</label></div><div class='form-check-inline'><input class='form-check-input' name='friday' type='checkbox' id='friday-3' value='option3'><label class='form-check-label' for='inlineCheckbox3'>10-11</label></div><div class='form-check-inline'><input class='form-check-input' name='friday' type='checkbox' id='friday-4'><label class='form-check-label' for='inlineCheckbox1'>11-12</label></div><div class='form-check-inline'><input class='form-check-input' name='friday' type='checkbox' id='friday-5'><label class='form-check-label' for='inlineCheckbox1'>12-1</label></div><div class='form-check-inline'><input class='form-check-input' name='friday' type='checkbox' id='friday-6'><label class='form-check-label' for='inlineCheckbox2'>1-2</label></div><br><div class='form-check-inline'><input class='form-check-input' name='friday' type='checkbox' id='friday-7'><label class='form-check-label' for='inlineCheckbox3'>2-3</label></div><div class='form-check-inline'><input class='form-check-input' name='friday' type='checkbox' id='friday-8'><label class='form-check-label' for='inlineCheckbox1'>3-4</label></div><div class='form-check-inline'><input class='form-check-input' name='friday' type='checkbox' id='friday-9'><label class='form-check-label' for='inlineCheckbox2'>4-5</label></div><div class='form-check-inline'><input class='form-check-input' name='friday' type='checkbox' id='friday-10'><label class='form-check-label' for='inlineCheckbox3'>5-6</label></div></div><!-- Classes Tutors can teach --><div class='form-group'><label for='tuesday' class='text-control'>Classes</label><br><div class='form-check-inline'><input class='form-check-input' name='tutorClasses' type='checkbox' id='1501' ><label class='form-check-label'>1501</label></div><div class='form-check-inline'><input class='form-check-input' name='tutorClasses' type='checkbox' id='1505'><label class='form-check-label'>1505</label></div><div class='form-check-inline'><input class='form-check-input' name='tutorClasses' type='checkbox' id='1507'><label class='form-check-label'>1507</label></div><div class='form-check-inline'><input class='form-check-input' name='tutorClasses' type='checkbox' id='1510'><label class='form-check-label'>1510</label></div><div class='form-check-inline'><input class='form-check-input' name='tutorClasses' type='checkbox' id='1511'><label class='form-check-label'>1511</label></div><div class='form-check-inline'><input class='form-check-input' name='tutorClasses' type='checkbox' id='1513'><label class='form-check-label'>1513</label></div><div class='form-check-inline'><input class='form-check-input' name='tutorClasses' type='checkbox' id='1552'><label class='form-check-label'>1552</label></div><div class='form-check-inline'><input class='form-check-input' name='tutorClasses' type='checkbox' id='1564'><label class='form-check-label'>1564</label></div><div class='form-check-inline'><input class='form-check-input' name='tutorClasses' type='checkbox' id='1570'><label class='form-check-label'>1570</label></div><div class='form-check-inline'><input class='form-check-input' name='tutorClasses' type='checkbox' id='1571'><label class='form-check-label'>1571</label></div><div class='form-check-inline'><input class='form-check-input' name='tutorClasses' type='checkbox' id='1580'><label class='form-check-label'>1580</label></div><div class='form-check-inline'><input class='form-check-input' name='tutorClasses' type='checkbox' id='1585'><label class='form-check-label'>1585</label></div><div class='form-check-inline'><input class='form-check-input' name='tutorClasses' type='checkbox' id='1586'><label class='form-check-label'>1586</label></div><div class='form-check-inline'><input class='form-check-input' name='tutorClasses' type='checkbox' id='1623'><label class='form-check-label'>2623</label></div><div class='form-check-inline'><input class='form-check-input' name='tutorClasses' type='checkbox' id='2651'><label class='form-check-label'>2651</label></div><div class='form-check-inline'><input class='form-check-input' name='tutorClasses' type='checkbox' id='2601'><label class='form-check-label'>2601</label></div><div class='form-check-inline'><input class='form-check-input' name='tutorClasses' type='checkbox' id='2625'><label class='form-check-label'>2625</label></div><div class='form-check-inline'><input class='form-check-input' name='tutorClasses' type='checkbox' id='3717'><label class='form-check-label'>3717</label></div></div><!-- submit button --><input class='btn btn-secondary btn-lg btn-block' onclick='submitInfo()' type='button' value='Submit'></form></div></div>"

    document.getElementById('dynamicStyleSheet').innerHTML = "<link rel='stylesheet' href='tutorFormStyle.css'>";

    document.getElementById('dynamicDiv').innerHTML = newHTML;
}

//spawns the form by calling spawnForm() and then fills it with the selected tutors information.
function spawnFormWithInfo() {
    //before doing any dynamic HTML, we must get the selected tutor so we have their information.
    var selectTag = document.getElementById('selectTutor');
    // tutor name
    var selectedTutorName = selectTag.options[selectTag.selectedIndex].text;
    //spawn in the form
    spawnForm();

    //getTutors from the database so we can get this tutors information
    var xhttp = new XMLHttpRequest();
    if(this.readyState == 4 && this.status == 200) {

    }
    xhttp.open("GET", "https://rmhlulauwc.execute-api.us-east-2.amazonaws.com/prod/gettutors", false);
    xhttp.send();

    // JSON object of API call information.
    var data = JSON.parse(xhttp.responseText);

    //set a flag in case there is an error getting information.
    var tutorData = "XXXXXXXXXXXX";

    // search for our tutors name in the database, if we find it we set tutorData to be that tutor so we clear the flag.
    for(i in data) {
        if(data[i].tutorName == selectedTutorName) {
            tutorData = data[i];
            break;
        }
    }

    //flag check
    if(tutorData != "XXXXXXXXXXXX") {
        document.getElementById('name').value = tutorData.tutorName;


        // Availability checks, each if statement is for a different day. If a tutor has availability on that day, we go into the if statement, else we skip to the next day.
        if(tutorData.availability.Monday != undefined) {
            // loop through monday checkboxes
            for(i in tutorData.availability.Monday.values) {
                // loop through each value on this day
                var hour = tutorData.availability.Monday.values[i];
                console.log(tutorData.availability);
                if(hour < 2 || hour > 10) {
                    // error in databse, the MAC is open from 9-6
                    alert("Tutor has an error in database, cannot work before 9 or after 6. This will resolve itself upon submitting this form!");
                } else {
                    // the html was designed with the javascript replacement in mind, so the ID of each element was chosen while trying to keep the javascript as short as possible. Our availability for example is always in the form 'dayOfWeek-startHour-startHour+1' so the javascript can be efficient.
                    document.getElementById("monday-"+hour).checked = true;
                }

            }
        }
        // Tuesday
        if(tutorData.availability.Tuesday != undefined) {
            // loop through tuesday checkboxes
            for(i in tutorData.availability.Tuesday.values) {
                // loop through each value on this day
                var hour = tutorData.availability.Tuesday.values[i];
                if(hour < 2 || hour > 10) {
                    // error in databse, the MAC is open from 9-6
                    alert("Tutor has an error in database, cannot work before 9 or after 6. This will resolve itself upon submitting this form!");
                } else {
                    document.getElementById("tuesday-"+hour).checked = true;
                }

            }
        }
        //Wednesday
        if(tutorData.availability.Wednesday != undefined) {
            // loop through wednesday checkboxes
            for(i in tutorData.availability.Wednesday.values) {
                // loop through each value on this day
                var hour = tutorData.availability.Wednesday.values[i];
                if(hour < 2 || hour > 10) {
                    // error in databse, the MAC is open from 9-6
                    alert("Tutor has an error in database, cannot work before 9 or after 6. This will resolve itself upon submitting this form!");
                } else {
                    document.getElementById("wednesday-"+hour).checked = true;
                }

            }
        }
        // Thursday
        if(tutorData.availability.Thursday != undefined) {
            // loop through thursday checkboxes
            for(i in tutorData.availability.Thursday.values) {
                // loop through each value on this day
                var hour = tutorData.availability.Thursday.values[i];
                if(hour < 2 || hour > 10) {
                    // error in databse, the MAC is open from 9-6
                    alert("Tutor has an error in database, cannot work before 9 or after 6. This will resolve itself upon submitting this form!");
                } else {
                    document.getElementById("thursday-"+hour).checked = true;
                }

            }
        }
        // Friday
        if(tutorData.availability.Friday != undefined) {
            // loop through friday checkboxes
            for(i in tutorData.availability.Friday.values) {
                // loop through each value on this day
                var hour = tutorData.availability.Friday.values[i];
                if(hour < 2 || hour > 10) {
                    // error in databse, the MAC is open from 9-6
                    alert("Tutor has an error in database, cannot work before 9 or after 6. This will resolve itself upon submitting this form!");
                } else {
                    document.getElementById("friday-"+hour).checked = true;
                }

            }
        }

        // loop through all the preferred classes checkboxes and find the ones our tutor already said they could tutor and check those.
        for(i in tutorData.preferredClasses.values) {
            document.getElementById(tutorData.preferredClasses.values[i]).checked = true;
        }

    } else {
        alert("Something went wrong, please refresh the page and try again");
    }

}

// called when the tutor information is submitted. Uploads info into database.
function submitInfo() {

    //Tutor Name from textbox.
    var tName = document.getElementById('name').value;

    //Monday Availability Checkboxes
    var monCheck = document.getElementsByName('monday');
    //Tuesday Availability Checkboxes
    var tuesCheck = document.getElementsByName('tuesday');
    //Wednesday Availability Checkboxes
    var wedCheck = document.getElementsByName('wednesday');
    //Thursday Availability Checkboxes
    var thursCheck = document.getElementsByName('thursday');
    //Friday Availability Checkboxes
    var friCheck = document.getElementsByName('friday');

    // construct empty arrays to fill with availability

    var monAvail = [];
    var tuesAvail =[];
    var wedAvail = [];
    var thursAvail = [];
    var friAvail = [];

    //go through each days checkboxes and get the correct start hour from the id of the checkbox
    for(i in monCheck) {
        if(monCheck[i].checked== true) {
            // id is set up as day-starthour-endhour so [1] gives the blocks start hour
            var splitStr = monCheck[i].id.split("-");
            monAvail[monAvail.length] = Number(splitStr[1]);
        }
    }
    //Tuesday
    for(i in tuesCheck) {
        if(tuesCheck[i].checked == true) {
            var splitStr = tuesCheck[i].id.split("-");
            tuesAvail[tuesAvail.length] = Number(splitStr[1]);
        }
    }
    //Wednesday
    for(i in wedCheck) {
        if(wedCheck[i].checked == true) {
            var splitStr = wedCheck[i].id.split("-");
            wedAvail[wedAvail.length] = Number(splitStr[1]);
        }
    }
    //Thursday
    for(i in thursCheck) {
        if(thursCheck[i].checked == true) {
            var splitStr = thursCheck[i].id.split("-");
            thursAvail[thursAvail.length] = Number(splitStr[1]);
        }
    }
    //Friday
    for(i in friCheck) {
        if(friCheck[i].checked == true) {
            var splitStr = friCheck[i].id.split("-");
            friAvail[friAvail.length] = Number(splitStr[1]);
        }
    }

    // Classes Tutored Checkboxes
    var classCheck = document.getElementsByName('tutorClasses');
    //Selected Classes Array
    var classesTutored = [];
    //Loop through classes tutored checkboxes and add the checked ones to our array.
    for(i in classCheck) {
        if(classCheck[i].checked == true) {
            classesTutored[classesTutored.length] = classCheck[i].id;
        }
    }

    // create HTTP request to be used with API call.
    var xhttp = new XMLHttpRequest();
    //once API call finishes we want to refresh the time blocks
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            //what to do when document is ready.
            // call DateChanged() to refresh the time blocks. This will call DisplayRooms again with the correct date.
            displayTutors();
        }
    }  

    //Availability variable to be sent in the API call
    var totalAvail = {};

    //If we have availability on a day, we add a new wrapper with its values set to that days array of availability. Else we do not add the wrapper so the API knows we have no availability that day.
    if(monAvail.length != 0) {
        totalAvail["Monday"]={"wrapperName":"Set","values":monAvail,"type":"Number"}
    }
    // Tuesday
    if(tuesAvail.length != 0) {
        totalAvail["Tuesday"]={"wrapperName":"Set","values":tuesAvail,"type":"Number"}
    }
    //Wednesday
    if(wedAvail.length != 0) {
        totalAvail["Wednesday"]={"wrapperName":"Set","values":wedAvail,"type":"Number"}
    }
    //Thursday
    if(thursAvail.length != 0) {
        totalAvail["Thursday"]={"wrapperName":"Set","values":thursAvail,"type":"Number"}
    }
    //Friday
    if(friAvail.length != 0) {
        totalAvail["Friday"]={"wrapperName":"Set","values":friAvail,"type":"Number"}
    }
    //Check that we have at least one class checked, if not we send an alert to check one.
    if(classesTutored.length == 0) {
        alert("You cannot have a tutor that has no classes selected. Please select a class the tutor can teach.");
    }else if(monAvail.length == 0 && tuesAvail.length == 0 && wedAvail.length == 0 && thursAvail.length == 0 && friAvail.length == 0) {
        //If we had no availability checked, we need to send the string "None" to the API so it can handle this. It is ok for a tutor to have no availability, such as when on vacation.
        var dataUpload = {
            "tutorName": tName,
            "availability": "None",
            "preferredClasses":{
                "wrapperName":"Set","values":classesTutored, "type":"String"
            }
        };
        xhttp.open("POST", "https://rmhlulauwc.execute-api.us-east-2.amazonaws.com/prod/submittutorinfo", "false");
        xhttp.send(JSON.stringify(dataUpload));
        window.location.reload(false);

    } else {
        // Tutor has availability and classes selected so make the data object.
        var dataUpload = {
            "tutorName": tName,
            "availability": totalAvail,
            "preferredClasses":{
                "wrapperName":"Set","values":classesTutored, "type":"String"
            }
        };

        //Make API call to send the data.
        xhttp.open("POST", "https://rmhlulauwc.execute-api.us-east-2.amazonaws.com/prod/submittutorinfo", "false");
        xhttp.send(JSON.stringify(dataUpload));
        // reload the page so the tutor selection form comes back.
        //setTimeout(displayTutors 1000);
    }

}

//Display Tutors is called when the page loads.
displayTutors();