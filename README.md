# Example SDK : Node.js

This SDK has being designed as an example SDK for the-one-api.dev

## Requirements

Node 16 or higher

## Installation

Install the package with:

```
npm install --save 1885e1f 
```

## Usage

The package needs to be configured with your account's API key, available in the [the-one-api.dev](https://the-one-api.dev) Dashboard.

```ts
import LotrSDK from '1885e1f';
import type {LotrClient, Book} from '1885e1f';

const lotrClient: LotrClient = new LotrSDK({apiKey: 'MY_API_KEY'});

lotrClient.book.list()
    .then((book): Book => console.log(book.id))
    .catch(error => console.error(error));
```

## API Reference


