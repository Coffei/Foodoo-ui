var React = require("react");
var _ = require("lodash");

var RB = require("react-bootstrap");
var Modal = RB.Modal;
var Input = RB.Input;
var Button = RB.Button;
var Icon = require("react-fa");

class GroupModal extends React.Component {
  constructor(opts) {
    super(opts);
    this.state = {
      shown: false,
      group: {}
    };
  }

  render() {
    return (
      <Modal show={this.state.shown} ref="modal" bsSize="large" onHide={this.hide.bind(this)}>
        <Modal.Header closeButton>
          <Modal.Title>{this.getTitle()}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="form-horizontal">
            <Input type="text" value={this.state.group.name} label="Name" placeholder="Enter group name" onChange={this.groupPropChanged("name").bind(this)}
              bsStyle={this.getValidationStyle("name")} labelClassName="col-xs-2" wrapperClassName="col-xs-10" />
            <Input type="text" value={this.state.group.price} label="Generic price" placeholder="Enter price of ingredients in this group"
              bsStyle={this.getValidationStyle("price")} onChange={this.groupPropChanged("price").bind(this)} labelClassName="col-xs-2" wrapperClassName="col-xs-10" addonAfter="Kč" />
            <Input type="checkbox" checked={this.state.group.required} label="Is mandatory" help="Are ingredients in this group required?"
              onChange={this.groupBooleanPropChanged("required").bind(this)}  wrapperClassName="col-xs-10 col-xs-offset-2" />
            <Input type="checkbox" checked={this.state.group.allowMore} label="Allow more ingredients" help="Is use of multiple ingredients from this group allowed?"
              onChange={this.groupBooleanPropChanged("allowMore").bind(this)}  wrapperClassName="col-xs-10 col-xs-offset-2" />
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="primary" onClick={this.saveClicked.bind(this)}><Icon name="floppy-o"/> Save</Button>
          <Button onClick={this.hide.bind(this)}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  componentWillUnmount() {
    if(this.state.shown) this.refs.modal.onHide();
  }

  saveClicked() {
    if(this.props.onSave!=null) this.props.onSave(this.state.group);
  }

  getValidationStyle(name) {
    var errorPaths = _.map(this.state.errors || [], "path");
    if(_.contains(errorPaths, name)) {
      return "error";
    }
  }

  getTitle() {
    if(this.state.group.id!=null) {
      return "Create group";
    } else {
      return "Edit group"
    }
  }

  groupPropChanged(name) {
    return (event) => {
      this.state.group[name] = event.target.value;
      this.forceUpdate();
    }
  }

  groupBooleanPropChanged(name) {
    return (event) => {
      this.state.group[name] = event.target.checked;
      this.forceUpdate();
    }
  }

  open(group, errors) {
    if(group == null) {
      group = {};
    }

    this.setState({
      shown: true,
      group :  _.clone(group),
      errors: errors
    });
  }

  hide() {
    this.setState({
      shown: false
    });
  }
}

module.exports = GroupModal;
