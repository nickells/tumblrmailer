var fs = require('fs');
var ejs = require('ejs');
var tumblr = require('tumblr.js');
var csvFile = fs.readFileSync("friend_list.csv","utf8");
var emailTemplate = fs.readFileSync('email_template.html', 'utf8');

// Authenticate via OAuth
var tumblr = require('tumblr.js');
var client = tumblr.createClient({
  consumer_key: 'H31GM52bAlA4Q54DLnBNdTXLAGMGhWIROs7lsmDKRBPjtyqZ1M',
  consumer_secret: 'sk6kcHV2cO2QNh1oyDNxD7jKkUVNsYXiBneR69FOlGjBAn46zZ',
  token: 'dapJNz4G6xcbgKPzUxYoEty8Xscabc9nljWyzgPYrM6tg6PesN',
  token_secret: 'boA3hFNrVm2TiNdKSA04RLQN8to5ZDRzUZyVJkWCpDl985smcD'
});


client.posts('nickontheinternet.tumblr.com', function(err, blog){
  console.log(blog);
})