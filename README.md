# Shared Wallet

Built using Truffle Box, Angular, and Angular Material.

## Prerequisites

In order to run the Truffle box, you will need [Node.js](https://nodejs.org) (tested with version 10.x.y). This will include `npm`, needed
to install dependencies. In order install these dependencies, you will also need [Python](https://www.python.org) (version 2.7.x) and
[git](https://git-scm.com/downloads). You will also need the [MetaMask](https://metamask.io/) plugin for Chrome.

## Building

1. Install truffle, Angular CLI and an Ethereum client. If you don't have a test environment, we recommend ganache-cli

```bash
npm install -g truffle
npm install -g @angular/cli
npm install -g ganache-cli
```

2. Download the box.

```bash
truffle unbox Quintor/angular-truffle-box
```

3. Run your Ethereum client. For Ganache CLI:

```bash
ganache-cli
```

Note the mnemonic 12-word phrase printed on startup, you will need it later.

4. Compile and migrate your contracts.

```bash
truffle compile && truffle migrate
```

## Configuration

1. In order to connect with the Ethereum network, you will need to configure MetaMask
2. Log into the `ganache-cli` test accounts in MetaMask, using the 12-word phrase printed earlier.
   1. A detailed explaination of how to do this can be found [here](https://truffleframework.com/docs/truffle/getting-started/truffle-with-metamask)
      1. Normally, the available test accounts will change whenever you restart `ganache-cli`.
      2. In order to receive the same test accounts every time you start `ganache-cli`, start it with a seed like this: `ganache-cli --seed 0` or `ganache-cli -m "put your mnemonic phrase here needs twelve words to work with MetaMask"`
3. Point MetaMask to `ganache-cli` by connecting to the network `localhost:8545`

## Running

1. Run the app using Angular CLI:

```bash
npm start
```

The app is now served on localhost:4200

2. Making sure you have configured MetaMask, visit http://localhost:4200 in your browser.

3. Send MetaCoins!

## Testing

1. Running the Angular component tests:

```bash
ng test
```

2. Running the Truffle tests:

```bash
truffle test
```

3. Running Protactor end-to-end tests

```bash
ng e2e
```
