let prime = (function() {
  function r() {
    return {
      check: isPrime,
      get: getPrime,
      index: index,
      indexOf: indexOf,
      getFirst: getFirst
    };
  }

  let isPrime = function(num) {
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i == 0) {
        return false;
      }
    }
    return num > 1;
  };

  let getPrime = function(n) {
    let array = Array(n).fill(true);
    output = [];
    for (let i = 2; i <= Math.sqrt(n); i++)
      if (array[i]) for (let j = i * i; j < n; j += i) array[j] = false;
    for (let i = 2; i < n; i++) if (array[i]) output.push(i);
    return output;
  };

  let index = function(i) {
    // max index 9592
    arrOfPrime = getPrime(100000);
    return arrOfPrime[i - 1];
  };
  let indexOf = function(primeNum) {
    // max input number 99991
    arrOfPrime = getPrime(100000);
    return arrOfPrime.indexOf(primeNum) + 1;
  };
  
  let getFirst = function(n) {
    let storage = [],
      num = 2;
    while (storage.length < n) {
      let prime = true;
      for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i == 0) {
          prime = false;
          break;
        }
      }
      if (prime) {
        storage.push(num);
      }
      num++;
    }
    return storage;
  };

  return r();
})();
