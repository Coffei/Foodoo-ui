var React = require("react");
var Marty = require("marty");

// Bootstraps
var Icon = require("react-fa");
var RB = require("react-bootstrap");
var Navbar = RB.Navbar;
var Nav = RB.Nav;
var NavItem = RB.NavItem;
var Badge = RB.Badge;

class NavbarComponent extends React.Component {
  render() {
    var numItemsInCart = this.props.currentOrder.orderItems.length;
    var cartBadge = numItemsInCart > 0 ? (<Badge>{numItemsInCart}</Badge>) : "";

    return (
      <Navbar brand="Foodoo" >
        <Nav>
          <NavItem href="#/menu">Menus</NavItem>
          <NavItem href="#/salad">Salads</NavItem>
          <NavItem href="#/management">Management</NavItem>
        </Nav>
        <Nav navbar right>
          <NavItem href="#/checkout">{cartBadge}<Icon name="shopping-cart" size="lg"/></NavItem>
        </Nav>
      </Navbar>
    );
  }
}

module.exports = Marty.createContainer(NavbarComponent, {
  listenTo: ["orderStore"],
  fetch: {
    currentOrder: function () {
      return this.app.orderStore.getCurrentOrder();
    }
  }
});
