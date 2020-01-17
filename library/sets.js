let set = (function() {
  function _return() {
    return {
      union: union,
      intersection: intersection,
      complement: complement,
      equals: equals,
      powerSet: powerSet
    };
  }
  //====================================================================
  let union = function(set) {
    try {
      let sets = new Set(set);
      for (let i = 1; i < arguments.length; i++) {
        for (const e of arguments[i]) sets.add(e);
      }
      return [...sets];
    } catch (err) {
      console.log(err.name, ": only accept arrays , strings or sets");
    }
  };
  //====================================================================
  let intersection = function(a, b) {
    try {
      let set = [];
      for (let i = 0; i < arguments.length; i++) {
        set.push(new Set(arguments[i]));
      }
      let result = set.reduce((a, b) => {
        return new Set([...a].filter(x => b.has(x)));
      });
      return [...result];
    } catch (err) {
      console.log(err.name, ": only accept arrays , strings or sets");
    }
  };
  //====================================================================
  let complement = (a, b) => {
    try {
      return a.filter(e => !b.includes(e));
    } catch (err) {
      console.log(err.name);
    }
  };
  //====================================================================
  let equals = (LHS, RHS) => {
    if (!(LHS instanceof Array)) return "false > L.H.S is't an array";
    if (!(RHS instanceof Array)) return "false > R.H.S is't an array";
    if (LHS.length != RHS.length) return false;
    let to_string = x => JSON.stringify(x.sort((a, b) => a - b));
    return to_string(LHS) == to_string(RHS);
  };
  //====================================================================
  let powerSet = arr => {
    var res = [];
    var len = arr.length;
    for (var i = 0; i < Math.pow(2, len); i++) {
      var aux = [];
      for (var j = 0; j < len; j++) {
        if (i & (1 << j)) {
          aux.push(arr[j]);
        }
      }
      res.push(aux);
    }
    return res;
  };
  //====================================================================
  return _return();
})();
