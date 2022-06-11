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
import { LotrClient } from "1885e1f";
import type {Book} from '1885e1f';

const lotrClient: LotrClient = new LotrClient({ apiKey: "MY_API_KEY" });

lotrClient.book
    .list()
    .then((books: Book[]) => {console.log(books)})
    .catch((error) => console.error(error));
```

## Developer Setup

Tests are executed with jest against the live API.

To execute tests, configure a `LOTR_API_KEY` environment variable to be one provided by the dashboard instance.
