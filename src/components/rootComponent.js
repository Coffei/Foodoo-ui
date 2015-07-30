var React = require("react");
var Router = require("react-router");
var RouteHandler = Router.RouteHandler;

var Navbar = require("./navbar");

class RootComponent extends React.Component {
  render() {
    return (
      <div>
        <Navbar />
        <div id="content">
          <RouteHandler />
        </div>
      </div>
    );
  }
}

module.exports = RootComponent;
