var React = require("react");

// Bootstraps
var RB = require("react-bootstrap");
var Alert = RB.Alert;
var Icon = require("react-fa");

class EmptyManagement extends React.Component {
  render() {
    return (
      <Alert bsStyle="info"><Icon name="info-circle" size="lg"/> Select entity to manage.</Alert>
    );
  }
}

module.exports = EmptyManagement;
