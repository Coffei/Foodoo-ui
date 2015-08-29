/**
 * Created by jtrantin on 9.8.15.
 */
var React = require("react");

var RB = require("react-bootstrap");
var Panel = RB.Panel;

var Constant = require("./constant");

class ConstantsManagement extends React.Component {
  render() {
    return (
      <span>
        <Panel header="Price constants">
          <Panel>
            <Constant name="takeaway"/>
          </Panel>
        </Panel>
      </span>
    );
  }
}

module.exports = ConstantsManagement;