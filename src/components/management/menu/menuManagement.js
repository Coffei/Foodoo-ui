var React = require("react");
var moment = require("moment");

// Bootstraps
var RB = require("react-bootstrap");
var Panel = RB.Panel;
var Button = RB.Button;
var Icon = require("react-fa");

//Components
var MenuList = require("./menuList");

class MenuManagement extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      date: moment()
    };
  }

  render() {
    var start = this.state.date.clone().startOf("isoweek");
    var end = this.state.date.clone().endOf("isoweek");

    return (
      <Panel className="with-buttons" header={
            <span>
              <span className="pull-right">
                <Button onClick={this.moveWeek(-1).bind(this)}><Icon name="chevron-circle-left"/></Button>
                <Button onClick={this.moveWeek(1).bind(this)}><Icon name="chevron-circle-right"/></Button>
              </span>
              Menu management ({start.format("YYYY-MM-DD")} - {end.format("YYYY-MM-DD")})
            </span>
        }>
        <MenuList from={start} to={end}/>
      </Panel>

    );
  }

  moveWeek(forwardSteps) {
    return () => {
      this.setState({
        date: this.state.date.add(forwardSteps, "week")
      });
    }
  }
}

module.exports = MenuManagement;
