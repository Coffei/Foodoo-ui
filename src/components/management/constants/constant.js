/**
 * Created by jtrantin on 9.8.15.
 */
var React = require("react");
var Marty = require("marty");

var Icon = require("react-fa");
var Toastr = require("toastr");
var RB = require("react-bootstrap");
var Alert = RB.Alert;
var Grid = RB.Grid;
var Col = RB.Col;
var Input = RB.Input;
var Button = RB.Button;

class Constant extends React.Component {
  render() {
    var content = this.props.loading ? (<Col xs={9}><Icon name="spinner" spin={true} size="lg"/></Col>) : (
      [
        <Col xs={7}><Input type="text" ref="value" addonAfter="Kč"
                           defaultValue={this.props.constant!=null ? this.props.constant.value : 0}/></Col>,
        <Col xs={2}><Button bsStyle="primary" onClick={this.submitValue.bind(this)}><Icon name="floppy-o"/> Save</Button></Col>
      ]
    );
    return (
      <Grid className="autowidth">
        <Col xs={3}><span className="price-constant-name">{this.getTitle()}</span>
        </Col>
        { content }
      </Grid>
    );
  }

  submitValue() {
    var value = this.refs.value.getValue();
    this.app.constantsActionCreator.setPriceConstant(this.props.name, value).
      then(() => Toastr.info(`Price of ${this.props.name} saved.`)).
      catch(() => Toastr.error("Try to refresh the page", "Unable to save the price."));
  }

  getTitle() {
    var name = this.props.name;
    var titleName;
    if (name === "takeaway") titleName = "Takeaway";

    return `${titleName} price`;
  }
}

module.exports = Marty.createContainer(Constant, {
  listenTo: ["constantsStore"],
  fetch: {
    constant: function () {
      return this.app.constantsStore.getPriceConstant(this.props.name);
    }
  },
  pending: function () {
    return this.done({loading: true});
  },
  failed: function () {
    return (
      <Alert bsStyle="danger">Unknown error occurred.</Alert>
    );
  }
});