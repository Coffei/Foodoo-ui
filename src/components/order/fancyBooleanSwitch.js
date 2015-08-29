/**
 * Created by jtrantin on 12.8.15.
 */
var React = require("react");

var RB = require("react-bootstrap");
var Button = RB.Button;

class FancyBooleanSwitch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      checked: props.defaultValue || false
    };
  }

  render() {
    return (
      <div>
        <h3>
          <span className="pull-right"><Button active={this.props.value || this.state.checked} bsStyle={this.props.bsStyle || "default"}
                                               onClick={this.clicked.bind(this)}>{this.getContent()}</Button></span>
          {this.props.label}
        </h3>
      </div>
    );
  }

  clicked() {
    var newValue = !(this.props.value || this.state.checked);
    this.setState({
      checked: newValue
    });
    if(this.props.valueChanged != null) {
      this.props.valueChanged(newValue);
    }
  }

  getValue() {
    return this.props.value || this.state.checked;
  }

  getContent() {
    if (this.props.value || this.state.checked) {
      return this.props.yesContent || "Yes";
    } else {
      return this.props.noContent || "No";
    }
  }
}

module.exports = FancyBooleanSwitch;
