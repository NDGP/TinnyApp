const cookieSession = require('cookie-session');
const {getUserByEmail, generateRandomString, urlsForUser} = require('./helpers');
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bcrypt = require('bcrypt');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ["key1", "key2"],
  maxAge: 24 * 60 * 60 * 1000
})
);
app.set("view engine", "ejs");

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
};

// new url maker


//url database

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

//page gets, posts, listens

app.get("/", (req, res) => {
  res.redirect("/urls");
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

// rendering the url page with appropriet data showing 

app.get("/urls", (req, res) => {
  const userID = req.session.user_id;
  if (!userID) {
    const templateVars = { user: ""};
    res.render("urls_index", templateVars);
  } else {
    const userURLdatabase = urlsForUser(userID, urlDatabase);
    const templateVars = { urls: userURLdatabase, user: users[userID] };
    res.render("urls_index", templateVars);
  }
});

// rendering creat new page and blocking if user is not loged in or registerd 

app.get("/urls/new", (req, res) => {
  const userID = req.session.user_id;
  const templateVars = { user: users[userID] };
  if (!userID) {
    res.redirect("/login");
  } else {
    res.render("urls_new", templateVars);
  }
});



app.get("/urls/:shortURL", (req, res) => {
  const userID = req.session.user_id;
  const templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: req.params.url,  
    user: users[userID]
  };
  let shortURL = req.params.shortURL
  if (!userID) {
    return res.redirect("/urls", templateVars);
  } else if(!urlDatabase[shortURL]) {
    return res.send("<html><body><b>Not a valid Short URL</b></body></html>\n");
  }else{
    res.render("urls_show", templateVars);
  }
});

// generating new short url for users input of long url

app.post("/urls", (req, res) => {

  let newURL = generateRandomString();
  urlDatabase[newURL] = {shortURL: newURL, longURL : req.body.longURL, userID : req.session.user_id};
  res.redirect(urlDatabase[newURL].longURL);
});

app.get("/u/:shortURL", (req, res) => {
  const templateVars = {urlDatabase: urlDatabase}
  let shortURL = req.params.shortURL;
  if (!urlDatabase[shortURL]) {
    return res.send("<html><body><b>Not a valid Short URL</b></body></html>\n");
  }
  res.redirect(urlDatabase[shortURL].longURL);
});

//  edit and deleat urls from list

app.post("/urls/:shortURL", (req, res) => {
  console.log(req.params)

  let shortUrl = req.params.shortURL;
  const userID = req.session.user_id;
  if (!userID) {
    res.redirect("/urls");
  } else {
    urlDatabase[shortUrl] = {
      shortURL : shortUrl, 
      longURL : req.body.longURL, 
      userID : req.session.user_id}
      ;
    res.redirect("/urls");
  }
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const userID = req.session.user_id;
  if (!userID) {
    res.redirect("/urls");
  } else {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  }
});

// login and logout, renders login page, acceptets user data from login testing if user existes in database

app.get("/login", (req, res) => {
  const templateVars =  {error: undefined};
  res.render("login", templateVars);
});


app.post("/login", (req, res) => {
  const existingUser = getUserByEmail(req.body.email, users);
  if (existingUser && bcrypt.compareSync(req.body.password, users[existingUser].password)) {
    req.session.user_id = users[existingUser].id;
    return res.redirect("/urls");
  }

  const templateVars =  {error: "403 error : hmmmm try again"};
  res.render("login", templateVars);
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

// registration section and fileing of registerd user 

app.get("/register", (req, res) => {
  const templateVars =  {error: undefined};
  res.render("register", templateVars);
});

app.post("/register", (req, res) => {
  const existingUser = getUserByEmail(req.body.email, users);
  if (existingUser) {
    const templateVars =  {error: "error coad 400 : email already exists"};
    return res.render("register", templateVars);
  }
  if (req.body.email === "" || req.body.password === "") {
    const templateVars =  {error: "error coad 400 : all fields must be filled"};
    return res.render("register", templateVars);
  }
  const pass = req.body.password;
  const hashedPassword = bcrypt.hashSync(pass, 10);
  let randomID = generateRandomString();
  req.body.id = randomID;
  users[randomID] = { id: randomID, email: req.body.email, password: hashedPassword };
  req.session.user_id = randomID; 
  res.redirect("/urls");
});


module.exports = {urlDatabase};