import { assertEquals } from "https://deno.land/std@0.118.0/testing/asserts.ts";
import { delay } from "https://deno.land/std@0.118.0/async/delay.ts";
import { Deferred } from "./deferred.ts";

Deno.test("has resolve()", () => {
  const deferred = new Deferred<void>();
  assertEquals(typeof deferred.resolve, "function");
});

Deno.test("has reject()", () => {
  const deferred = new Deferred<void>();
  assertEquals(typeof deferred.reject, "function");
});

Deno.test("resolve() resolves with value", async () => {
  const deferred = new Deferred<string>();
  assertEquals(deferred.isPending(), true);
  assertEquals(deferred.isFulfilled(), false);
  assertEquals(deferred.isRejected(), false);
  assertEquals(deferred.isResolved(), false);

  let deferredValue = "";
  deferred.then((val) => {
    deferredValue = val;
  });
  deferred.resolve("foobar");

  await delay(10);

  assertEquals(deferredValue, "foobar");
  assertEquals(deferred.isPending(), false);
  assertEquals(deferred.isFulfilled(), true);
  assertEquals(deferred.isRejected(), false);
  assertEquals(deferred.isResolved(), true);
});

Deno.test("reject() throws with value", async () => {
  const deferred = new Deferred<string>();
  assertEquals(deferred.isPending(), true);
  assertEquals(deferred.isFulfilled(), false);
  assertEquals(deferred.isRejected(), false);
  assertEquals(deferred.isResolved(), false);

  let deferredValue = "";
  let deferredRejection = "";
  deferred.then((val) => {
    deferredValue = val;
  }).catch((err) => {
    deferredRejection = err;
  });
  deferred.reject("foobar");

  await delay(10);

  assertEquals(deferredValue, "");
  assertEquals(deferredRejection, "foobar");
  assertEquals(deferred.isPending(), false);
  assertEquals(deferred.isFulfilled(), false);
  assertEquals(deferred.isRejected(), true);
  assertEquals(deferred.isResolved(), true);
});

Deno.test("cannot resolve after rejection", async () => {
  const deferred = new Deferred<void>();

  let thenCalled = false;
  let catchCalled = false;
  deferred.then(() => {
    thenCalled = true;
  }).catch(() => {
    catchCalled = true;
  });

  deferred.reject();
  deferred.resolve();

  await delay(10);
  assertEquals(thenCalled, false);
  assertEquals(catchCalled, true);
  assertEquals(deferred.isFulfilled(), false);
  assertEquals(deferred.isResolved(), true);
  assertEquals(deferred.isRejected(), true);
});

Deno.test("cannot reject after resolve", async () => {
  const deferred = new Deferred<void>();

  let thenCalled = false;
  let catchCalled = false;
  deferred.then(() => {
    thenCalled = true;
  }).catch(() => {
    catchCalled = true;
  });

  deferred.resolve();
  deferred.reject();

  await delay(10);
  assertEquals(thenCalled, true);
  assertEquals(catchCalled, false);
  assertEquals(deferred.isFulfilled(), true);
  assertEquals(deferred.isResolved(), true);
  assertEquals(deferred.isRejected(), false);
});

Deno.test("finally is called after resolve and reject", async () => {
  let defer = new Deferred<void>();

  let finallyCalled = false;
  defer.then(() => {}).catch(() => {}).finally(() => {
    finallyCalled = true;
  });

  assertEquals(finallyCalled, false);

  defer.reject();

  await delay(10);

  assertEquals(finallyCalled, true);

  defer = new Deferred<void>();

  finallyCalled = false;
  defer.then(() => {}).catch(() => {}).finally(() => {
    finallyCalled = true;
  });

  assertEquals(finallyCalled, false);

  defer.resolve();

  await delay(10);

  assertEquals(finallyCalled, true);
});
