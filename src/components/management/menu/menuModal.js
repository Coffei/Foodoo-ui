var React = require("react");
var moment = require("moment");
var _ = require("lodash");

var RB = require("react-bootstrap");
var Modal = RB.Modal;
var Button = RB.Button;
var Input = RB.Input;
var Icon = require("react-fa");

class MenuModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shown: false,
      menu : {}
    };
  }

  render() {
    var dateString = this.state.menu.date != null ? moment(this.state.menu.date).format("Do MMMM YYYY") : "";
    return (
      <span>
        <Modal show={this.state.shown} ref="modal" key="modal" bsSize="large" onHide={this.hide.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>{this.getTitle()}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form className="form-horizontal">
              <Input type="text" label="Menu number" placeholder="Enter menu number" labelClassName="col-xs-2" wrapperClassName="col-xs-10"
                bsStyle={this.getValidationStyle("number")} value={this.state.menu.number} onChange={this.menuPropChanged("number").bind(this)} />
              <Input type="text" label="Name" placeholder="Enter menu name" labelClassName="col-xs-2" wrapperClassName="col-xs-10"
                 bsStyle={this.getValidationStyle("name")} value={this.state.menu.name} onChange={this.menuPropChanged("name").bind(this)} />
               <Input type="text" label="Price" placeholder="Enter price" labelClassName="col-xs-2" wrapperClassName="col-xs-10"
                bsStyle={this.getValidationStyle("price")} addonAfter="Kč" value={this.state.menu.price} onChange={this.menuPropChanged("price")}/>
              <Input type="text" label="Date" value={dateString} disabled={true} labelClassName="col-xs-2" wrapperClassName="col-xs-10"/>
              <Input type="textarea" label="Description" value={this.state.menu.description} labelClassName="col-xs-2" wrapperClassName="col-xs-10"
                bsStyle={this.getValidationStyle("description")} onChange={this.menuPropChanged("description").bind(this)}/>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.accept.bind(this)} bsStyle="primary"><Icon name="floppy-o"/> Save</Button>
            <Button onClick={this.hide.bind(this)}>Close</Button>
          </Modal.Footer>
        </Modal>
      </span>
    );
  }

  componentWillUnmount() {
    if(this.state.shown) this.refs.modal.onHide();
  }

  getTitle() {
    if(this.state.menu.id!=null) {
      return "Edit menu";
    } else {
      return "Create menu";
    }
  }

  getValidationStyle(name) {
    var errorPaths = _.map(this.state.errors || [], "path");
    if(_.contains(errorPaths, name)) {
      console.log("returning error to " + name);
      return "error";
    }

  }

  menuPropChanged(propName) {
    return (event) => {
      this.state.menu[propName] = event.target.value;
      this.forceUpdate();
    }
  }

  accept() {
    if(this.props.onSave!=null) this.props.onSave(this.state.menu);
  }

  open(menu, errors) {
    var newMenu = menu;
    if(menu==null) {
      newMenu = {};
    }

    this.setState({
      menu: _.clone(newMenu),
      errors: errors,
      shown: true
    });
  }

  hide() {
    this.setState({
      shown: false
    });
  }
}

module.exports = MenuModal;
