var React = require("react");
var Marty = require("marty");

// Bootstraps
var Icon = require("react-fa");
var RB = require("react-bootstrap");
var Navbar = RB.Navbar;
var Nav = RB.Nav;
var NavItem = RB.NavItem;
var Badge = RB.Badge;

var LoginIndicator = require("./auth/loginIndicator");

class NavbarComponent extends React.Component {
  render() {
    var numItemsInCart = this.props.currentOrder.orderItems.length;
    var cartBadge = numItemsInCart > 0 ? (<Badge>{numItemsInCart}</Badge>) : "";
    var management = this.props.authUser.type === "admin" ? (<NavItem href="#/management">Management</NavItem>) : "";

    return (
      <Navbar brand={<a href="#/">Foodoo</a>} >
        <Nav>
          <NavItem href="#/menu">Menus</NavItem>
          <NavItem href="#/salad">Salads</NavItem>
          {management}
        </Nav>
        <Nav navbar right>
          <LoginIndicator />
          <NavItem href="#/checkout">{cartBadge}<Icon name="shopping-cart" size="lg"/></NavItem>
        </Nav>
      </Navbar>
    );
  }
}

module.exports = Marty.createContainer(NavbarComponent, {
  listenTo: ["orderStore", "authUserStore"],
  fetch: {
    currentOrder: function () {
      return this.app.orderStore.getCurrentOrder();
    },
    authUser: function() {
      return this.app.authUserStore.getAuthUser();
    }
  }
});
