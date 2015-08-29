var React = require("react");
var Marty = require("marty");
var _ = require("lodash");

var RB = require("react-bootstrap");
var Panel = RB.Panel;
var Alert = RB.Alert;
var Icon = require("react-fa");

var Group = require("./group");

class GroupList extends React.Component {
  render() {
    var groups = _.sortByOrder(this.props.groups, ["required", "name"], ["desc","asc"]);

    return (
      <div>
        { this.generateNoGroupsWarning() }
        { _.map(groups, (group) => (
          <Group group={group}/>
        )) }
      </div>
    );
  }

  generateNoGroupsWarning() {
    if(this.props.groups==null || this.props.groups.length == 0) {
      return (<span className="text-muted">no groups exist yet</span>);
    }
  }

}

module.exports = Marty.createContainer(GroupList, {
  listenTo: ["ingredientStore"],
  fetch: {
    groups: function() {
      return this.app.ingredientStore.getAllGroups();
    }
  },
  pending: () => (<Icon name="spinner" spin={true} size="2x"/>),
  failed: () => (<Alert bsStyle="danger"><Icon name="times-circle" size="lg"/> Unknown error occurred.</Alert>)
});
