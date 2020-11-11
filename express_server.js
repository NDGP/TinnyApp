const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())
app.set("view engine", "ejs") 

// new url maker
function generateRandomString() {
let newUrl = Math.random().toString(36).substring(7);
return newUrl;
}

generateRandomString()

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

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
   //console.log(Object.keys(req))
   console.log(req.cookies)
  const templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { username: req.cookies["username"] };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: req.params.url,  username: req.cookies["username"] };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body.longURL); 
  let newURL = generateRandomString();
  urlDatabase[newURL] = req.body.longURL;
  console.log(urlDatabase)
  res.redirect(`/urls/${newURL}`);
   // Log the POST request body to the console
   // Respond with 'Ok' (we will replace this)
});

app.get("/u/:shortURL", (req, res) => {
  //console.log(req.params)
  if (urlDatabase[req.params.shortURL] === undefined){
    return res.redirect("https://www.youtube.com/watch_popup?v=N9wsjroVlu8&t=16s")
  }
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL]
  res.redirect("/urls")
});

app.post("/urls/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect("/urls")
});

app.post("/login", (req, res) => {
  console.log(req.body)
  let newUser = req.body.username
  res.cookie("username", newUser)
  res.redirect("/urls")
});

app.post("/logout", (req, res) =>{
  res.clearCookie('username', req.body.username)
  res.redirect("/urls")
})