console.log('\033c');
let myObj = {
    prop: "value",
    fn() {
        console.log("method")
    }
}
function myFn(params) {
    console.log("function")
}

let observe = new Proxy(() => 6, {
    deleteProperty(myObj, prop) {
        console.log('deleteProperty', { myObj, prop });
    },
    set(myObj, prop, value, receiver) {
        console.log('set', { myObj, prop, value, receiver });
    },
    has(myObj, prop) {
        console.log('has', { myObj, prop })
    },
    // get(myObj, prop) {
    //     console.log("get", { myObj, prop });
    //     return myObj[prop]
    // },
    // apply(target, thisArg, argArray) {
    //     console.log("apply", { target, thisArg, argArray })
    // }
});

