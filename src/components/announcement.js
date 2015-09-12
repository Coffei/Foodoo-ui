var React = require("react");
var Marty = require("marty");

var Icon = require("react-fa");
var Alert = require("react-bootstrap/lib/Alert");
var Markdown = require("react-remarkable");

class Announcement extends React.Component {
  render() {
    return (
      <Markdown source={this.props.announcement.content} />
    );
  }
}

module.exports = Marty.createContainer(Announcement, {
  listenTo: "messageStore",
  fetch: {
    announcement: function() {
      return this.app.messageStore.getMessage("announcement");
    }
  },
  pending: () => (<Icon name="spinner" spin={true} size="2x" />),
  failed: () => (<Alert bsStyle="danger">Unable to load the announcement.</Alert>)
});
