var React = require("react");
var Settings = require("../flux/settings/settings");
var moment = require("moment");

// Components
var MenuList = require("./menu/menuList");
var Announcement = require("./announcement");

class Home extends React.Component {

  getName() {
    return Settings.siteName || "Foodoo";
  }

  getStart() {
    return moment().startOf("day");
  }

  getEnd() {
    return moment().endOf("day");
  }

  render() {
    return (
      <span>
        <div className="page-header">
          <h1>{this.getName()}</h1>
        </div>
        <MenuList start={this.getStart()} end={this.getEnd()} hideIfEmpty={true} hideIfCannotOrder={true} label="Menu for today:"/>
        <br/>
        <Announcement />
      </span>
    );
  }
}

module.exports = Home;
