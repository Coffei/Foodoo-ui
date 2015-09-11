var React = require("react");
var moment = require("moment");

var Icon = require("react-fa");
var RB = require("react-bootstrap");
var Pager = RB.Pager;
var PageItem = RB.PageItem;

var MenuList = require("./menuList");

class MenuHome extends React.Component {
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
      <div>
        <div className="page-header"><h1>Weekly menu</h1></div>
        <MenuList start={start} end={end}/>
        <Pager>
          <PageItem previous onClick={this.moveForward(-1).bind(this)}><Icon name="backward" /> Previous week</PageItem>
          <PageItem next onClick={this.moveForward(1).bind(this)}>Next week <Icon name="forward" /></PageItem>
        </Pager>
      </div>
    );
  }

  moveForward(count) {
    return () => {
      this.setState({
        date: this.state.date.clone().add(count, "week")
      });
    };
  }
}

module.exports = MenuHome
