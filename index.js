class P {
  constructor(executorFunc) {
    this.promiseChain = [];
    this.handleError = () => {};
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
    executorFunc(this.resolve, this.reject);
  }

  then(func) {
    this.promiseChain.push(func);
    return this;
  }

  catch(func) {
    this.handleError = func;
    return this;
  }

  resolve(arg) {
    if (this.promiseChain.length === 0) return;
    let nextFunc = this.promiseChain.shift();
    try {
      let nextArg = nextFunc(arg);
      if (nextArg instanceof P) {
        nextArg
          .then((res) => {
            this.resolve(res);
          })
          .catch((e) => this.reject(e));
      } else {
        return this.resolve(nextArg);
      }
    } catch (e) {
      this.reject(e);
    }
  }

  reject(arg) {
    this.handleError(arg);
  }
}

P.all = function (promises) {
  const thisAll = new P(() => {});
  thisAll.store = promises.map(() => "unresolved");
  for (let i = 0; i < promises.length; i++) {
    let prom = promises[i];
    prom
      .then((res) => {
        thisAll.store[i] = res;
        if (
          thisAll.store.filter((elem) => elem === "unresolved").length === 0
        ) {
          thisAll.resolve(thisAll.store);
        }
      })
      .catch((e) => {
        thisAll.onReject(e);
      });
  }
  return thisAll;
};

P.race = function (promises) {
  const thisRace = new P(() => {});
  for (let i = 0; i < promises.length; i++) {
    let prom = promises[i];
    prom
      .then((res) => {
        thisRace.resolve(res);
      })
      .catch((e) => {
        thisRace.onReject(e);
      });
  }
  return thisRace;
};

module.exports = P;
