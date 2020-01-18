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
function sortNum(a, b) {
  return a - b;
}
function sortNum_reverse(a, b) {
  return b - a;
}
function sort(a, b) {
  if (a < b) {
    return -1;
  }
}
function sort_reverse(a, b) {
  if (b < a) {
    return -1;
  }
}
function reverse(a, b) {
  if (b != a) {
    return -1;
  }
}
