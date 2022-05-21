# deno_deferred

A simple deferred for deno

## usage

```js
import Deferred from 'https://deno.land/x/deferred@v1.0.1/mod.ts';

let defer = new Deferred<string>();

defer.then((val) => {
  // gets called with "foo" when defer.resolve("foo") is executed
}).catch(err => {
  // is not called because its resolved first
});

console.log(defer.isPending()); // true
console.log(defer.isFulfilled()); // false
console.log(defer.isRejected()); // false
console.log(defer.isResolved()); // false

console.log("--------");

defer.resolve("foo");
defer.reject("bar"); // has no effect after It's resolved

console.log(defer.isPending()); // false
console.log(defer.isFulfilled()); // true
console.log(defer.isRejected()); // false
console.log(defer.isResolved()); // true

console.log("--------");

defer = new Deferred<string>();

defer.then((val) => {
  // is not called because its rejected first
}).catch(err => {
  // gets called with "bar" when defer.reject("bar") is executed
});

defer.reject("bar");
defer.resolve("foo"); // has no effect after It's rejected

console.log(defer.isPending()); // false
console.log(defer.isFulfilled()); // false
console.log(defer.isRejected()); // true
console.log(defer.isResolved()); // true

```
