const { assert } = require('chai');

const { getUserByEmail }  = require('../helpers');

const testUsers = {
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

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedOutput = "userRandomID";
    assert.strictEqual(user, expectedOutput, "it worked, expected user")
    // Write your assert statement here
  });
  it("should return undifened is non existent email", function(){
    const user = getUserByEmail("user@dddxample.com", testUsers)
    const expectedOutput = undefined;
    console.log(user)
    assert.strictEqual(user, expectedOutput, "it worked, user was undefined")
  })
});
