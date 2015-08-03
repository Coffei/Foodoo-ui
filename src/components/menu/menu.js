var React = require("react");

var RB = require("react-bootstrap");
var Grid = RB.Grid;
var Col = RB.Col;
var Badge = RB.Badge;

class Menu extends React.Component {
  render() {
    var menu = this.props.menu;
    return (
      <span>
        <Grid className="autowidth">
          <Col xs={1}><Badge><span className="menu-number">{ menu.number }</span></Badge></Col>
          <Col xs={10}><span className="menu-name">{ menu.name }</span></Col>
          <Col xs={1}><span className="menu-price">{ menu.price }Kč</span></Col>
          <Col xs={12} xsOffset={1}><span className="menu-description">{ menu.description }</span></Col>
        </Grid>
      </span>
    );
  }
}

module.exports = Menu;
