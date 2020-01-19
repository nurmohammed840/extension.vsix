// let sort = require("./sort");

// // let obj = {
// //   arr1: [1, 3, 2, "a", "c", "b"],
// //   arr2: [1, 3, 2, "a", "c", "b"],
// //   arr3: [1, 3, 2, "a", "c", "b"]
// // };
// // sort(obj.arr1, "reverse");
// // sort(obj.arr2, "reverse", "disorder", "order_num");
// // sort(obj.arr3, "reverse", "order");


// let arr = [1,4,3,2,5]


//  let f = sort([...str],"reverse").join("")

// console.table(f);


const sort_by = (field, reverse, primer) => {

  const key = primer
    ? function(x) {
        return primer(x[field]);
      }
    : function(x) {
        return x[field];
      };

      
  reverse = reverse ? -1 : 1;
  

  return function(a, b) {
    console.log(key(a));
    return (a = key(a)), (b = key(b)), reverse * ((a > b) - (b > a));
  };
};

//Now you can sort by any field at will...

const homes = [
  { h_id: "3", city: "Dallas", state: "TX", zip: "75201", price: "162500" },
  {
    h_id: "4",
    city: "Bevery Hills",
    state: "CA",
    zip: "90210",
    price: "319250"
  },
  { h_id: "5", city: "New York", state: "NY", zip: "00010", price: "962500" }
];

// // Sort by price high to low
// console.log(homes.sort(sort_by("price", true, parseInt)));

// Sort by city, case-insensitive, A-Z
console.log(homes.sort(sort_by("city", false, a => a.toUpperCase())));
