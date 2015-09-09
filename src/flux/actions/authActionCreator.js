var Marty = require("marty");
var Constants = require("../constants/authConstants");

class AuthActionCreator extends Marty.ActionCreators {
  adminLoggedIn() {
    var user = {
      type: "admin"
    };
    this.dispatch(Constants.SET_AUTH_USER, user);
  }

  logout() {
    this.dispatch(Constants.LOGOUT_AUTH_USER);
  }
}

module.exports = AuthActionCreator;
