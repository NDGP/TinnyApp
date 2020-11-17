const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bcrypt = require('bcrypt');
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
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
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

 //URL url colection and new url
 
 app.get("/urls", (req, res) => {
  //console.log(req.cookies)
  const userID = req.cookies["user_id"]
  if (!userID){
    const templateVars = { user: ""};
    res.render("urls_index", templateVars);
  }else{
  const userURLdatabase = urlsForUser(userID)
  const templateVars = { urls: userURLdatabase, user: users[userID] };
  console.log("this is the database", userURLdatabase)
  res.render("urls_index", templateVars);
  }
});

const urlsForUser = (id) => {
  const userURLdatabase = {};
  for (let shortURL in urlDatabase) {
  if (urlDatabase[shortURL].userID === id) {
      userURLdatabase[shortURL] = urlDatabase[shortURL];
    }
  }
  return userURLdatabase;
}

app.get("/urls/new", (req, res) => {
  const userID = req.cookies["user_id"]
  const templateVars = { user: users[userID] };
  //console.log(req.cookie)
  if(!userID){
    res.redirect("/login")
  }else{
  res.render("urls_new", templateVars);
  }
});


app.get("/urls/:shortURL", (req, res) => {
  const userID = req.cookies["user_id"]
  const templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: req.params.url,  
    user: users[userID]
  };

  if(!userID){
    return res.redirect("/urls", templateVars)
  }else{
  res.render("urls_show", templateVars);
  //console.log(templateVars.user)
  }
});


app.post("/urls", (req, res) => {
  console.log(req.body.longURL); 
  let newURL = generateRandomString();
  urlDatabase[newURL]= {longURL : req.body.longURL, userID : req.cookies.user_id};
  res.redirect(`/urls`);
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
  const userID = req.cookies["user_id"]
  if(!userID){
    const templateVars = { user: users[userID] };
    res.redirect("/urls", templateVars)
  }else{
  const templateVars = { user: users[userID] };
  urlDatabase[shortURL] = {longURL : req.body.longURL, userID : req.cookies.user_id};
  res.redirect("/urls", templateVars);
  console.log(urlDatabase);
  }
});

app.post("/urls/:shortURL/delete", (req, res) => {
    const userID = req.cookies["user_id"]
    if(!userID) {
      const templateVars = { user: users[userID] }
      res.redirect("/urls", templateVars);
    }else {
      const templateVars = { user: users[userID] }
      delete urlDatabase[req.params.shortURL]
      res.redirect("/urls", templateVars);
  }
});

// login and logout

app.get("/login", (req, res) => {
  const templateVars =  {error: undefined}
  res.render("login", templateVars)
})

app.post("/login", (req, res) => {
  //console.log(req.body.email)
  for (let user in users){
    if (users[user].email !== req.body.email || users[user].password !== req.body.password){
      continue
    }else if(users[user].email === req.body.email && users[user].password === req.body.password){
      res.cookie("user_id", users[user].id)
      return res.redirect("/urls")
    }
  }
  const templateVars =  {error: "403 error : hmmmm try again"}
  res.render("login", templateVars)
});

app.post("/logout", (req, res) => {
  res.clearCookie('user_id', req.body.id)
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
  console.log(req.params)
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