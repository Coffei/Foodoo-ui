var React = require("react");

var RB = require("react-bootstrap");
var Panel = RB.Panel;

var Hours = require("./hours");

class HoursManagement extends React.Component {
  render() {
    return (
      <Panel header="Business Hours">
        <Panel><Hours type="GENERAL"/></Panel>

        <Panel><Hours type="MENU"/></Panel>

        <Panel><Hours type="SALAD"/></Panel>

      </Panel>
    );
  }
}

module.exports = HoursManagement;