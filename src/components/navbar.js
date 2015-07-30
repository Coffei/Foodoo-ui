var React = require("react");
// Bootstraps
var RB = require("react-bootstrap");
var Navbar = RB.Navbar;
var Nav = RB.Nav;
var NavItem = RB.NavItem;

class NavbarComponent extends React.Component {
  render() {
    return (
      <Navbar brand="Foodoo" >
        <Nav>
          <NavItem href="#">Menus</NavItem>
          <NavItem href="#">Salads</NavItem>
          <NavItem href="#/management">Management</NavItem>
        </Nav>
      </Navbar>
    );
  }
}

module.exports = NavbarComponent;
