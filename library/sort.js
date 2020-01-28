function sort(arr, prop, methods) {
  try {
    function key(x) {
      try {
        if (methods.case_sensitive === false)
          if (typeof prop === typeof "") return x[prop].toLowerCase();
      } catch (e) {}
      if (typeof prop === typeof "") return x[prop];
      return x;
    }
    if (prop instanceof Object) methods = prop;
    let swipe = 1;
    try {
      swipe = methods.reverse === true ? -1 : 1;
    } catch (e) {}
    arr.sort((a, b) => {
      if (key(a) < key(b)) return -1 * swipe;
      if (key(b) < key(a)) return 1 * swipe;
      return 0;
    });
  } catch (err) {
    console.log(err.name);
  }
  return arr;
}


