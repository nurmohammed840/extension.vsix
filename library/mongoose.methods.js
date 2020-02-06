const db = require("mongoose");

module.exports = function model(model, Schema) {
  let DEMO;
  Schema.static({
    push: function(obj) {
      new DEMO(obj).save().catch(err => {
        return console.log(err.message);
      });
    }
  });

  return (DEMO = db.model(model, Schema));
};
