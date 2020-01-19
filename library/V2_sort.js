module.exports = function sort(arr) {
  var sortMethod = {
    order: order,
    orderNum: orderNum,
    disorder: disorder,
    disorderNum: disorderNum,
    reverse: reverse
  }; 
  if (arr instanceof Array) {
    var array = arr.sort();
  } else throw "1st argument should be an Array";

  for (let i = 1; i < arguments.length; i++) {
    sortMethod[arguments[i]](array);
  }

  function order(arr) {
    return arr.sort((a, b) => {
      if (a < b) {
        return -1;
      }
    });
  }
  function orderNum(arr) {
    return arr.sort((a, b) => {
      return a - b;
    });
  }
  function disorder(arr) {
    return arr.sort((a, b) => {
      if (b < a) {
        return -1;
      }
    });
  }
  function disorderNum(arr) {
    return arr.sort((a, b) => {
      return b - a;
    });
  }
  function reverse(arr) {
    return arr.sort((a, b) => {
      if (b != a) {
        return -1;
      }
    });
  }
  return array;
};
