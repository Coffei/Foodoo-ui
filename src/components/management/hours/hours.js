/**
 * Created by Coffei on 9.8.15.
 */
var React = require("react");
var Marty = require("marty");
var moment = require("moment");
var _ = require("lodash");

var TimePicker = require('react-widgets/lib/DateTimePicker');
var Toastr = require("toastr");

var Icon = require("react-fa");
var RB = require("react-bootstrap");
var Grid = RB.Grid;
var Col = RB.Col;
var Button = RB.Button;
var Alert = RB.Alert;

const fmt = "HH:mm";

class Hours extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      changed: false
    };
    if (!_.isEmpty(props.hours)) {
      this.state.start = moment.utc(props.hours.startTime, fmt).local();
      this.state.end = moment.utc(props.hours.endTime, fmt).local();
    }
  }

  componentDidUpdate(oldProps) {
    if (!_.eq(oldProps.hours, this.props.hours)) {
      if (!_.isEmpty(this.props.hours)) {
        var start = moment.utc(this.props.hours.startTime, fmt).local();
        var end = moment.utc(this.props.hours.endTime, fmt).local();
        this.setState({
          start: start,
          end: end
        });
      }
    }

  }

  render() {
    var content = this.props.loading === true ? (
      <Icon name="spinner" spin={true} size="lg"/>) : ( this.hasNoHours() ? (
      <Alert bsStyle="info"><Icon name="info-circle" size="lg"/><strong> Hours not set yet.</strong>
        You can add them by <a href onClick={this.setEmptyHours.bind(this)}>clicking here.</a></Alert>
    ) : (
      <Grid className="autowidth">
        <Col xs={5}>
          <Grid className="autowidth">
            <Col xs={2} className="time-picker-col">Start </Col>
            <Col xs={10}><TimePicker calendar={false} value={this.state.start.toDate()} format={fmt} timeFormat={fmt} step={30}
              onChange={this.onStartChange.bind(this)} max={this.state.end.toDate()}/></Col>
          </Grid>
        </Col>
        <Col xs={5}>
          <Grid className="autowidth">
            <Col xs={2} className="time-picker-col">End </Col>
            <Col xs={10}><TimePicker calendar={false} value={this.state.end.toDate()} format={fmt} timeFormat={fmt} step={30}
              onChange={this.onEndChange.bind(this)} min={this.state.start.toDate()}/></Col>
          </Grid>
        </Col>
        <Col xs={2}>
          <Button bsStyle="primary" className="time-picker-button" disabled={!this.state.changed} onClick={this.submitTime.bind(this)}><Icon
            name="floppy-o"/> Save</Button>
        </Col>
      </Grid>
    ));
    return (
      <span>
        <h3>{this.getTitle()}</h3>
        { content }
      </span>
    );
  }

  hasNoHours() {
    return this.state.start == null && this.state.end == null;
  }

  setEmptyHours(event) {
    event.stopPropagation();
    event.preventDefault();

    this.setState({
      start:moment("08:00", fmt),
      end:moment("18:00", fmt),
      changed: true
    });
  }

  onStartChange(date) {
    var time = moment(date);
    if (time.isBefore(this.state.end, "minute")) {
      this.setState({
        start: time,
        changed: true
      });
    }
  }

  onEndChange(date) {
    var time = moment(date);
    if (time.isAfter(this.state.start, "minute")) {
      this.setState({
        end: time,
        changed: true
      });
    }
  }

  submitTime() {
    if(this.state.changed) {
      var hours = {
        type: this.props.type,
        startTime: this.state.start.utc().format(fmt),
        endTime: this.state.end.utc().format(fmt)
      };

      this.app.hoursActionCreator.setHours(hours).
        then(() => {
          this.setState({
            changed: false
          });
          Toastr.info("Hours updated.");
        }).
        catch(() => Toastr.error("Unable to set hours."));
    }
  }

  getTitle() {
    var hoursName;
    switch (this.props.type) {
      case "GENERAL":
        hoursName = "general business hours";
        break;
      case "MENU":
        hoursName = "menu ordering hours";
        break;
      case "SALAD":
        hoursName = "salad ordering hours";
        break;
    }

    return `Set ${hoursName}.`;
  }
}

module.exports = Marty.createContainer(Hours, {
  listenTo: ["hoursStore"],
  fetch: {
    hours: function () {
      return this.app.hoursStore.getHours(this.props.type);
    }
  },
  pending: function () {
    return this.done({loading: true});
  },
  failed: () => (<Alert bsStyle="danger">Unknown error occurred.</Alert>)
});
