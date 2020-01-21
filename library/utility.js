let util = (function() {
  let util = {
    typeof: typeOf
  };

  //==============================================================
  function typeOf(x) {
    if (typeof x == "object") {
      if (x instanceof Array) return "array";
      if (x instanceof String) return "object of string";
      if (x instanceof Number) return "object of number";
      if (x instanceof Boolean) return "object of boolean";
      if (x instanceof Date) return "object of date";
    }
    return typeof x;
  }
  //==============================================================

  return util;
})();
