var React = require("react");

//Bootstraps
var RB = require("react-bootstrap");
var Grid = RB.Grid;
var Col = RB.Col;
var Panel = RB.Panel;
var Badge = RB.Badge;

class Menu extends React.Component {
  render() {
    var menu = this.props.menu;
    return (
      <Grid className="autowidth">
        <Col xs={11}><span className="menu-name">{menu.name}</span></Col>
        <Col xs={1}><span className="menu-price">{menu.price}Kč</span></Col>
        <Col xs={11}><span className="menu-description">{menu.description}</span></Col>

      </Grid>
    );
  }
}

module.exports = Menu;
