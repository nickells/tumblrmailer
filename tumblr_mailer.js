var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('y247ZzjWtG14nMZaovveJw');

var fs = require('fs');
var ejs = require('ejs');
var tumblr = require('tumblr.js');
var csvFile = fs.readFileSync("friend_list.csv","utf8");
var emailTemplate = fs.readFileSync('email_template.ejs', 'utf8');

// Authenticate via OAuth
var client = tumblr.createClient({
  consumer_key: 'H31GM52bAlA4Q54DLnBNdTXLAGMGhWIROs7lsmDKRBPjtyqZ1M',
  consumer_secret: 'sk6kcHV2cO2QNh1oyDNxD7jKkUVNsYXiBneR69FOlGjBAn46zZ',
  token: 'dapJNz4G6xcbgKPzUxYoEty8Xscabc9nljWyzgPYrM6tg6PesN',
  token_secret: 'boA3hFNrVm2TiNdKSA04RLQN8to5ZDRzUZyVJkWCpDl985smcD'
});



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

// friendList.forEach(function(row){

//     var firstName = row["firstName"];
//     var numMonthsSinceContact = row["numMonthsSinceContact"];

//     var customizedTemplate = ejs.render(emailTemplate, 
//         { firstName: firstName,  
//           numMonthsSinceContact: numMonthsSinceContact,
//           latestPosts: latestPosts
//         });
//     // sendEmail;
//     console.log(customizedTemplate);
// })

client.posts('nickontheinternet.tumblr.com', function(err, blog){
	var d = new Date();
	var now = (Math.round(d.getTime()/1000)); //Current seconds since Jan 1, 1970
	var latestPosts = [];
	function postFinder(title,link){
		this.title = title,
		this.href = link
	}

	//find latestposts:
	for (x=0; x<blog.posts.length;x++){
	var postDate = (blog.posts[x].timestamp);

	if (((now - postDate)/86400) < 7){
		var tempPostfinder = new postFinder(
			blog.posts[x].title,
			blog.posts[x].post_url);
		latestPosts.push(tempPostfinder);
		// console.log(latestPosts);
	}
}
	friendList.forEach(function(row){

	    var firstName = row["firstName"];
	    var numMonthsSinceContact = row["numMonthsSinceContact"];


	    var customizedTemplate = ejs.render(emailTemplate, 
	        { firstName: firstName,  
	          numMonthsSinceContact: numMonthsSinceContact,
	          latestPosts: latestPosts
	        });

	    // console.log(customizedTemplate);
	    
	    sendEmail(firstName, row["emailAddress"], "Nick", "ellsworth.nick@gmail.com", "My Fullstack Blog", customizedTemplate);
	})
});

function sendEmail(to_name, to_email, from_name, from_email, subject, message_html){
	var message = {
	    "html": message_html,
	    "subject": subject,
	    "from_email": from_email,
	    "from_name": from_name,
	    "to": [{
	            "email": to_email,
	            "name": to_name
	        }],
	    "important": false,
	    "track_opens": true,    
	    "auto_html": false,
	    "preserve_recipients": true,
	    "merge": false,
	    "tags": [
	        "Fullstack_Tumblrmailer_Workshop"
	    ]    
	};
	var async = false;
	var ip_pool = "Main Pool";
	mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool}, function(result) {
	    // console.log(message);
	    // console.log(result);   
	}, function(e) {
	    // Mandrill returns the error as an object with name and message keys
	    console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
	    // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
	});
	console.log("email sent to " + to_name + " at " + to_email + ": \n" + "_______________________________________________ \n"+ message_html)
}



