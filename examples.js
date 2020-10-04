const P = require("./index");

function fakeApiCallOne() {
  return new P((resolve, reject) => {
    setTimeout(() => {
      resolve({ value: 1 });
    }, 900);
  });
}

function fakeApiCallTwo(add = 0) {
  return new P((resolve, reject) => {
    setTimeout(() => {
      resolve({ value: 2 + add });
    }, 1000);
  });
}

function fakeApiCallThree() {
  return new P((resolve, reject) => {
    setTimeout(() => {
      reject("Example of an error being thrown");
    }, 1000);
  });
}

fakeApiCallOne()
  .then((res) => {
    return fakeApiCallTwo(res.value);
  })
  .then((res) => {
    console.log(res.value);
    return fakeApiCallThree();
  })
  .catch((e) => {
    console.log(`Any errors will above will be thrown here === ${e}`);
  });

P.all([fakeApiCallOne(), fakeApiCallTwo()]).then((res) => {
  console.log(res);
});

P.race([fakeApiCallOne(), fakeApiCallTwo()]).then((res) => {
  console.log(res);
});
