<h3 align="center">Pundi X Technical Test</h3>

  <p align="center">
    Pundi X technical test
  </p>

<!-- ABOUT THE PROJECT -->

## About The Project

This is a github repo that stores the Pundi X technical test.

## Getting Started

### Prerequisites

If you do not have npm, please install the latest stable version of npm

```sh
npm install npm@latest -g
```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/howardleejh/pundix-technical-test.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. create a `.env` file with
   ```sh
   touch .env
   ```
4. Enter all the relevant items in the `.env` file
   ```env
   ETHERSCAN_API_KEY=
   ```

<!-- USAGE EXAMPLES -->

## Usage

### To retrieve token data, enter:

```sh
npx hardhat run scripts/getTokens.js
```

    or with shorthand:

```sh
hh run scripts/getTokens.js
```

Note that the data will be stored in the `fx-bridge-token-supply.json` file.
<br />

### To display tokens information, enter:

```sh
npx hardhat run scripts/displayTokens.js
```

    or with shorthand:

```sh
hh run scripts/displayTokens.js
```

### To get a return of the first 20 validator addresses that were created on f(x)Core blockchain, enter:

```sh
curl -X POST https://fx-json.functionx.io:26657 -d "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"validators\",\"params\":{\"height\":\"1\", \"page\":\"1\", \"per_page\":\"20\"}}"
```

The genesis validators are also stored in the `genesis-validators.json` file.
