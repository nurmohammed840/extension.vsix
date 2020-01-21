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

let arr = [6, 2, 4, 1, 5, 3];
let arr2 = [
  { name: "suma", age: 12 },
  { name: "Num", age: 18 },
  { name: "mamun", age: 30 },
  { name: "asma", age: 15 }
];
sort(arr, { reverse: true }); //  [ 6, 5, 4, 3, 2, 1 ]
sort(arr2, "name", { case_sensitive: false, reverse: true });
let arr3 = sort([...arr2], "age");
// new sorted array created from arr2 (But dosent change orginal array)

console.log(arr);
console.table(arr2);
console.table(arr3);

