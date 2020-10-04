## A basic promise library built for fun

This is just a fun project. It supports the many common uses of promises. I recommend using native promises or another well supported promise library that will fully meet A+ promise specs. https://promisesaplus.com/

### Includes

- new Promise instance
- Promise.then
- Promise.catch
- Promise.all
- Promise.race

### Examples

Here is some basic setup that will be used in the examples below. Using setTimeout wrapped in a promise to imitate an API call or I/O operation.

```
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
```

### Creating a promise

```

new P((resolve, reject) => {
    fs.readFile('/foo.txt', function(err, data) {
        if (err) {
            reject(err)
        } else {
            resolve(data)
        }
    });
});

```

#### .then and .catch

```
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
```

Will output as follows:

```
3 // return value from api call one, added as argument into api call two
Any errors will above will be thrown here Example of an error being thrown
```

#### P.all

```
P.all([fakeApiCallOne(), fakeApiCallTwo()]).then((res) => {
  console.log(res);
});
```

Will output as follows after roughly 1000 ms:

```
[ { value: 1 }, { value: 2 } ]
```

#### P.race

```
P.race([fakeApiCallOne(), fakeApiCallTwo()]).then((res) => {
  console.log(res);
});
```

Will output as follows after roughly 900ms:

```
{ value: 1 }
```
