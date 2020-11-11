const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())
app.set("view engine", "ejs") 

//user object 
const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

// new url maker
function generateRandomString() {
let newUrl = Math.random().toString(36).substring(7);
return newUrl;
}

//url database

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//page gets, posts, listens

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
 });
 
 app.get("/urls", (req, res) => {
  //console.log(req.cookies)
  const templateVars = { urls: urlDatabase, user: users[req.cookies["user_id"]] };
  res.render("urls_index", templateVars);
  //console.log()
});

app.get("/urls/new", (req, res) => {
  const templateVars = { user: users[req.cookies["user_id"]] };
  res.render("urls_new", templateVars);
});

//working here//////////

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: req.params.url,  
    user: users[req.cookies["user_id"]]
  };

  res.render("urls_show", templateVars);
  console.log(templateVars.user)
});

app.post("/urls", (req, res) => {
  //console.log(req.body.longURL); 
  let newURL = generateRandomString();
  urlDatabase[newURL] = req.body.longURL;
  res.redirect(`/urls/${newURL}`);
});

app.get("/u/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL] === undefined){
    return res.redirect("https://www.youtube.com/watch_popup?v=N9wsjroVlu8&t=16s")
  }
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

// add and deleat urls from list

app.post("/urls/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect("/urls")
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL]
  res.redirect("/urls")
});

// login and logout

app.post("/login", (req, res) => {
  
  res.redirect("/urls")
});

app.post("/logout", (req, res) => {
  res.clearCookie('username', req.body.username)
  res.redirect("/urls")
});

// registration section

app.get("/register", (req, res) => {
  const templateVars =  {error: undefined}
  res.render("register", templateVars)
});

app.post("/register", (req, res) => {
  //console.log(req.body)
  for (let user in users){
   // console.log("user log", users[user])
  if(users[user].email === req.body.email){
    const templateVars =  {error: "error coad 400 : email already exists"}
    return res.render("register", templateVars)
  }
  if(req.body.email === "" || req.body.password === ""){
    const templateVars =  {error: "error coad 400 : all fields must be filled"}
    return res.render("register", templateVars)
  }
}
  let randomID = generateRandomString()
  req.body.id = randomID
  users[randomID] = req.body
  res.cookie("user_id", randomID )
  res.redirect("/urls")
});

// const users = { 
//   "userRandomID": {
//     id: "userRandomID", 
//     email: "user@example.com", 
//     password: "purple-monkey-dinosaur"
//   },
//  "user2RandomID": {
//     id: "user2RandomID", 
//     email: "user2@example.com", 
//     password: "dishwasher-funk"
//   }
// }