var React = require("react");

var Icon = require("react-fa");

class NotFound extends React.Component {
  render() {
    return (
      <span>
        <div className="page-header"><h2><Icon name="exclamation-triangle" /> Page not found</h2></div>
      </span>
    );
  }
}

module.exports = NotFound;
