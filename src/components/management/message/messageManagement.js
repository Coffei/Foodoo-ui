var React = require("react");
var Marty = require("marty");
var _ = require("lodash");

var Icon = require("react-fa");
var Toastr = require("toastr");
var Alert = require("react-bootstrap/lib/Alert");
var Panel = require("react-bootstrap/lib/Panel");
var Well = require("react-bootstrap/lib/Well");
var Button = require("react-bootstrap/lib/Button");
var ButtonGroup = require("react-bootstrap/lib/ButtonGroup");
var TabbedArea = require("react-bootstrap/lib/TabbedArea");
var TabPane = require("react-bootstrap/lib/TabPane");

var Editor = require("react-md-editor");
var Markdown = require("react-remarkable");

class MessageManagement extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: props.announcement != null ? props.announcement.content : ""
    };
  }

  render() {
    return (
      <Panel header="Announcement" footer={this.renderFooter()}>
        {this.renderEditor()}
      </Panel>
    );
  }

  renderFooter() {
    if(this.state.text != null) {
      return (
        <span>
          <div style={{height: "2em", width: "0px", display: "inline-block"}}></div>
          <span className="pull-right">
            <ButtonGroup>
              <Button bsStyle="danger" onClick={this.delete.bind(this)}><Icon name="ban"/> Delete</Button>
              <Button bsStyle="primary" onClick={this.submit.bind(this)}><Icon name="save" /> Save</Button>
            </ButtonGroup>
          </span>
        </span>
      );
    }
  }

  renderEditor() {
    if(this.state.text == null) {
      return (
        <Alert bsStyle="info">
          <Icon name="info-circle" size="lg"/> No announcement is created at the moment. You can do so <a href="#" onClick={this.createEmptyAnnouncement.bind(this)}>by clicking here</a>.
          </Alert>
      );
    } else {
      return (
        <TabbedArea defaultActiveKey={1}>
          <TabPane tab="Editor" eventKey={1}><Editor value={this.state.text} onChange={this.valueChanged.bind(this)}/></TabPane>
          <TabPane tab="Preview" eventKey={2}><Markdown source={this.state.text} /></TabPane>
        </TabbedArea>

      );
    }
  }

  createEmptyAnnouncement(e) {
    e.preventDefault();
    this.valueChanged("");
  }

  submit() {
    var msg = _.clone(this.props.announcement);
    msg.content = this.state.text;

    this.app.messageActionCreator.submitMessage(msg)
      .then(() => Toastr.info("Announcement updated!"))
      .catch(() => Toastr.error("Cannot save the announcement now."));
  }

  delete() {
    if(confirm("Are you sure?")) {
      this.app.messageActionCreator.deleteMessage(this.props.announcement)
        .then(() => Toastr.info("Announcement deleted!"))
        .catch(() => Toastr.error("Cannot delete announcement now."));
    }
  }

  valueChanged(value) {
    this.setState({
      text: value
    });
  }
}

module.exports = Marty.createContainer(MessageManagement, {
  listenTo: "messageStore",
  fetch: {
    announcement: function() {
      return this.app.messageStore.getMessage("announcement");
    }
  },
  pending: () => (<Icon name="spinner" spin={true} size="2x" />),
  failed: () => (<Alert bsStyle="danger">Unknown error occurred</Alert>)
});
