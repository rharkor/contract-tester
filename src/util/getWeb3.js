import Web3 from "web3";

/*
 * 1. Check for injected web3 (mist/metamask)
 * 2. If metamask/mist create a new web3 instance and pass on result
 * 3. Get chainId - Now we can check the user is connected to the right network to use our dApp
 * 4. Get user account from metamask
 * 5. Get user balance
 */

const getWeb3 = new Promise(function (resolve, reject) {
  // Activate web3
  if (window.ethereum) {
    window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((accounts) => {
        resolve({ accounts });
      })
      .catch(() => {
        reject(new Error("Unable to retreive account"));
      });
  }
})
  .then((result) => {
    return new Promise(function (resolve, reject) {
      // Check for injected web3 (mist/metamask)
      const web3js = window.ethereum;
      if (typeof web3js !== "undefined") {
        const web3 = new Web3(window.ethereum);
        result = Object.assign({}, result, {
          injectedWeb3: true,
          web3() {
            return web3;
          },
        });
        resolve(result);
      } else {
        // web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545')) GANACHE FALLBACK
        reject(new Error("Unable to connect to Metamask"));
      }
    });
  })
  .then((result) => {
    return new Promise(function (resolve, reject) {
      // Retrieve network ID
      let { chainId } = result.web3().givenProvider;
      chainId = result.web3().utils.hexToNumber(chainId);
      result = Object.assign({}, result, { chainId });
      resolve(result);
    });
  })
  .then((result) => {
    return new Promise(function (resolve, reject) {
      // Retrieve balance for coinbase
      result.web3().eth.getBalance(result.accounts[0], (err, balance) => {
        if (err) {
          reject(
            new Error(
              "Unable to retrieve balance for address: " + result.accounts[0]
            )
          );
        } else {
          result = Object.assign({}, result, { balance });
          resolve(result);
        }
      });
    });
  });

export default getWeb3;
