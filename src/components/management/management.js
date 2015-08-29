var React = require("react");
var RouteHandler = require("react-router").RouteHandler;

// Bootstraps
var RB = require("react-bootstrap");
var Grid = RB.Grid;
var Col = RB.Col;
var ButtonGroup = RB.ButtonGroup;
var Button = RB.Button;
var Panel = RB.Panel;


class Management extends React.Component {
  render() {
    return (
      <Panel header={<span>Management</span>}>
        <Grid>
          <Col xs={12} md={2}>
            <ButtonGroup vertical>
              <Button href="#/management/menu">Menus</Button>
              <Button href="#/management/ingredients">Ingredients</Button>
              <Button href="#/management/hours">Business Hours</Button>
              <Button href="#/management/constants">Price Constants</Button>
            </ButtonGroup>
          </Col>
          <Col xs={12} md={10}>
            <RouteHandler />
          </Col>
        </Grid>
      </Panel>
    );
  }
}

module.exports = Management;
