const { database } = require("./express_server");

// creats random string

function generateRandomString() {
  let newUrl = Math.random().toString(36).substring(7);
  return newUrl;
  }

//creats unique URL database for user

const urlsForUser = (id, database) => {
  const userURLdatabase = {};
  for (let shortURL in database) {
  if (database[shortURL].userID === id) {
      userURLdatabase[shortURL] = database[shortURL];
    }
  }
  return userURLdatabase;
}

// returns user by checking if email presented matches email in database 

const getUserByEmail = function(email, database) {
  for (let user in database) {
    if(database[user].email === email){
      return user;
    }
  }
};

module.exports = {getUserByEmail, generateRandomString, urlsForUser};
