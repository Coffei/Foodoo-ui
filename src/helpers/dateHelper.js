var moment = require("moment");

class DateHelper {
  static getDatesInRange(from, to, interval) {
    var start = from.clone();
    var results = [];
    while(start.isBefore(to)) {
      results.push(start.clone());
      start.add(1, interval);
    }

    return results;
  }
}

module.exports = DateHelper;
