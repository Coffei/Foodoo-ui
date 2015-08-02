var React = require("react");
var _ = require("lodash");

var RB = require("react-bootstrap");
var Modal = RB.Modal;
var Input = RB.Input;
var Button = RB.Button;
var Icon = require("react-fa");

class IngredientModal extends React.Component {
  constructor(opts) {
    super(opts);
    this.state = {
      shown: false,
      ingredient: {}
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
            <Input type="text" value={this.state.ingredient.name} label="Name" placeholder="Enter ingredient name" onChange={this.propChanged("name").bind(this)}
              bsStyle={this.getValidationStyle("name")} labelClassName="col-xs-2" wrapperClassName="col-xs-10" />
            <Input type="text" value={this.state.ingredient.price} label="Price" placeholder="Enter ingredient price" onChange={this.propChanged("price").bind(this)}
              bsStyle={this.getValidationStyle("price")} labelClassName="col-xs-2" wrapperClassName="col-xs-10" />
            <Input type="textarea" value={this.state.ingredient.description} label="Description" placeholder="Enter ingredient description" onChange={this.propChanged("description").bind(this)}
              bsStyle={this.getValidationStyle("description")} labelClassName="col-xs-2" wrapperClassName="col-xs-10" />
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="primary" onClick={this.saveClicked.bind(this)}><Icon name="floppy-o"/> Save</Button>
          <Button onClick={this.hide.bind(this)}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  propChanged(name) {
    return (event) => {
      this.state.ingredient[name] = event.target.value;
      this.forceUpdate();
    };
  }

  componentWillUnmount() {
    if(this.state.shown) this.refs.modal.onHide();
  }

  saveClicked() {
    if(this.props.onSave!=null) this.props.onSave(this.state.ingredient);
  }

  getValidationStyle(name) {
    var errorPaths = _.map(this.state.errors || [], "path");
    if(_.contains(errorPaths, name)) {
      return "error";
    }
  }

  getTitle() {
    if(this.state.ingredient.id!=null) {
      return "Edit ingredient";
    } else {
      return "Create ingredient"
    }
  }

  open(ingredient, errors) {
    if(ingredient == null) {
      ingredient = {};
    }

    this.setState({
      shown: true,
      ingredient :  _.clone(ingredient),
      errors: errors
    });
  }

  hide() {
    this.setState({
      shown: false
    });
  }
}

module.exports = IngredientModal;
