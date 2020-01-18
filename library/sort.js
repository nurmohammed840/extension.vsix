let test = [
  "q",
  "w",
  "e",
  "r",
  "c",
  "v",
  86,
  99,
  66,
  51,
  "b",
  "n",
  "m",
  60,
  81,
  62,
  85,
  87,
  12,
  5,
  98,
  26,
  2,
  80,
  8,
  "z",
  28,
  96,
  4,
  34,
  47,
  68,
  "i",
  "o",
  "p",
  "g",
  "h",
  "j",
  92,
  1,
  6,
  27,
  95,
  52,
  "t",
  "y",
  "u",
  "k",
  "l",
  "x",
  46,
  9,
  32,
  50,
  42,
  65,
  10,
  "a",
  "s",
  "d",
  "f",
  94,
  38,
  36,
  22,
  40,
  24,
  39,
  77,
  41,
  70,
  17,
  30,
  72,
  25,
  100,
  16,
  18,
  91,
  29,
  61,
  79,
  23,
  57,
  3,
  31,
  44,
  64,
  45,
  53,
  59,
  37,
  69,
  75,
  71,
  43,
  54,
  63,
  88,
  97,
  90,
  21,
  19,
  15,
  35,
  83,
  93,
  55,
  56,
  82,
  13,
  7,
  67,
  20,
  89,
  74,
  33,
  48,
  78,
  84,
  73,
  14,
  11,
  58,
  49,
  76
];

console.table(test.sort((a,b) => {
  console.log("awd");
  return a-b
}));

// =========================================

function sort(a, b) {
  if (a < b) {
    return -1;
  }
}

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
  if (a > b) {
    return 0
  }
  return 0;
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
