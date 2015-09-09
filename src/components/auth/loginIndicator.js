var React = require("react");
var Marty = require("marty");

var Icon = require("react-fa");
var NavItem = require("react-bootstrap/lib/NavItem");

class LoginIndicator extends React.Component {
  render() {
    var info = "";
    if(this.props.user.type == "admin") {
      info = "Admin ";
    }

    return (
      <NavItem href="#/login">
        {info}
        <Icon name="user" size="lg"/>
      </NavItem>
    );
  }
}

module.exports = Marty.createContainer(LoginIndicator, {
  listenTo: "authUserStore",
  fetch: {
    user: function() {
      return this.app.authUserStore.getAuthUser();
    }
  }
});
