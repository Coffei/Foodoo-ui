var Marty = require("marty");
var Constants = require("../constants/authConstants");

class AuthUserStore extends Marty.Store { //TODO add session store backend
  constructor(opts) {
    super(opts);

    this.state = {
      user: {
        type: "none"
      }
    };

    this.handlers = {
      setUser: Constants.SET_AUTH_USER,
      logout: Constants.LOGOUT_AUTH_USER
    }
  }

  logout() {
    this.state.user = {
      type: "none"
    };
    this.app.sessionStorage.logoutAuthUser();
    this.hasChanged();
  }

  setUser(user) {
    this.state.user = user;
    this.app.sessionStorage.setAuthUser(user);
    this.hasChanged();
  }

  getAuthUser() {
    return this.fetch({
      id: "auth_user",
      locally: () => {
        var sessionUser = this.app.sessionStorage.getAuthUser();
        if(sessionUser != null) return sessionUser;

        return this.state.user;
      }
    })
  }
}

module.exports = AuthUserStore;
