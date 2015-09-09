var React = require("react");
var Settings = require("../../flux/settings/settings");
var sha1 = require("sha1");
var Marty = require("marty");

var Input = require("react-bootstrap/lib/Input");
var Button = require("react-bootstrap/lib/Button");
var Alert = require("react-bootstrap/lib/Alert");
var Icon = require("react-fa");

class Login extends React.Component {
  login(e) {
    e.preventDefault();

    var user = this.refs.username.getValue();
    var pass = this.refs.username.getValue();

    var validLogin = Settings.adminUser;
    var validPassHash = Settings.adminPass;

    var passHash = sha1(pass);
    console.log(pass);
    console.log(passHash);

    if(user == validLogin && passHash == validPassHash ) {
      this.app.authActionCreator.adminLoggedIn();
    } else {
      console.log("Unable to login, something don't match");
    }
  }

  logout() {
    this.app.authActionCreator.logout();
  }

  render() {
    if(this.props.authUser.type == "admin") { // TODO add logout button
      return (
        <div className="login-parent">
          {this.renderAuthUserAlert()}
          <div>
            <Button bsStyle="primary" block bsSize="large" onClick={this.logout.bind(this)}>Log out!</Button>
          </div>
        </div>
      );
    }
    return (
      <form onSubmit={this.login.bind(this)}>
        <div className="login-parent">
          {this.renderAuthUserAlert()}
          <div>
            <Input type="text" placeholder="username" ref="username" />
          </div>
          <div>
            <Input type="password" placeholder="password" ref="password" />
          </div>
          <div>
            <Button bsStyle="primary" block bsSize="large" type="submit">Log in!</Button>
          </div>
        </div>
      </form>
    );
  }

  renderAuthUserAlert() {
    var user = this.props.authUser;
    var style, text;
    if(user.type == "none") {
      style = "warning";
      text = "You are not logged in.";
    } else if (user.type == "admin") {
      style = "success";
      text = "You are logged in as admin.";
    }

    return (
      <Alert bsStyle={style}><Icon name="info-circle" size="lg" /> {text}</Alert>
    );
  }
}

module.exports = Marty.createContainer(Login, {
  listenTo: ["authUserStore"],
  fetch: {
    authUser: function() {
      return this.app.authUserStore.getAuthUser();
    }
  }
})
