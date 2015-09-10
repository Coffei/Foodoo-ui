var React = require("react");
var _ = require("lodash");

var ProgressBar = require("react-bootstrap/lib/ProgressBar");
var Badge = require("react-bootstrap/lib/Badge");

var colors = {
  1: "primary",
  2: "warning",
  3: "info",
  4: "danger"
};

class ItemsBar extends React.Component {
  render() {
    var menus = _.filter(this.props.items || [], {type: "MENU"});
    var menusCount = {};
    _.forEach(menus, (item) => {
      var menuNumber = item.menu.number;
      if(menusCount[menuNumber] == null) menusCount[menuNumber] = 0;

      menusCount[menuNumber] += item.times || 1;
    });

    console.log(menusCount);
    var max = _.sum(_.values(menusCount));
    return (
      <div>
        <ProgressBar max={max}>
          {_.map(_.keys(menusCount), (menuNumber) => (
            <ProgressBar max={max} now={menusCount[menuNumber]} label={<span><Badge>{menuNumber}</Badge> <b>{menusCount[menuNumber]} times</b></span>} bsStyle={colors[menuNumber]} />
          ))}
        </ProgressBar>
      </div>
    );
  }
}

module.exports = ItemsBar;
