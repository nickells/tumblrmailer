var fs = require('fs');
var ejs = require('ejs');
var tumblr = require('tumblr.js');
var csvFile = fs.readFileSync("friend_list.csv","utf8");
var emailTemplate = fs.readFileSync('email_template.html', 'utf8');

function csvParse(csvInput){
	var csvfileLinesArray = csvInput.split("\n");
	var csvfileCommaArray = [];	
	var arrayofObjects = [];
	
	function person(first, last, numMonths, email) {
	    this.firstName = first;
	    this.lastName = last;
	    this.numMonthsSinceContact = numMonths;
	    this.emailAddress = email;
	}

	for (var x=1; x<csvfileLinesArray.length; x++){
		 csvfileCommaArray.push(csvfileLinesArray[x].split(","));
	}	

	//cycle over array of people
	for (var y=0;y<csvfileCommaArray.length; y++){
		var tempPerson = new person(
			csvfileCommaArray[y][0],
			csvfileCommaArray[y][1],
			csvfileCommaArray[y][2],
			csvfileCommaArray[y][3]
			);
		arrayofObjects.push(tempPerson);
	}
	return(arrayofObjects);
}

var csv_data = csvParse(csvFile);

friendList = csvParse(csvFile);

friendList.forEach(function(row){

    var firstName = row["firstName"];
    var numMonthsSinceContact = row["numMonthsSinceContact"];

    var customizedTemplate = ejs.render(emailTemplate, 
        { firstName: firstName,  
          numMonthsSinceContact: numMonthsSinceContact
        });

    

    // we make a copy of the emailTemplate variable to a new variable to ensure
       // we don't edit the original template text since we'll need to us it for 
       // multiple emails

    // var templateCopy = emailTemplate;

    // // use .replace to replace FIRST_NAME and NUM_MONTHS_SINCE_CONTACT with firstName and  monthsSinceLastContact  
    // templateCopy = templateCopy.replace(/FIRST_NAME/gi,
    // firstName).replace(/NUM_MONTHS_SINCE_CONTACT/gi, numMonthsSinceContact);

    console.log(customizedTemplate);



})