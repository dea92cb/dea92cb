# Design

This SDK example was designed to be a thin SDK around the API defined in github.com/gitfrosh/lotr-api

## Projen

As this is a take-home task, I wanted to do it as quickly/efficiently as possible. As such, the [projen](https://projen.io/) typescript boilerplate was used. This ensures that the scope of changes I needed to make was limited to `.projenrc.js`, `src`.

## SDK Design

There is no point building abstractions unless there is a validated use-case for that abstraction. Given no other information, the design of this follows that theme: it is as a quick-and-dirty thin client based on the API specification. For each API route, an interface was built to expose that route as a `(args..) => Promise<T>` where `T` is the schema of the route's response.

After this thin client was written, a standard backoff/jitter function was applied after we noticed the API failing during parallel test executions as I iterated towards something that worked. 

The few exceptions where a bit of thought was applied before coding are:

1. **Typescript**: it almost always make sense to strongly type APIs, when the underlying data model is typed. In particular following the link to GitHub in the provided API site yields models in [https://github.com/gitfrosh/lotr-api/tree/release/backend/models](https://github.com/gitfrosh/lotr-api/tree/release/backend/models) which can be quickly extracted as typescript.
2. **Client Auth**: Given this is required, and defined once per user, it makes sense to only pass this in once. A `ClientOptions` interface was created to hold the API key. The theme with SDKs is "try to never break the API interface" meaning an object that can be expanded in future is usually preferable to a string primitive argument with the API key.
3. **Pagination/Sort/Filter Options**: Pagination/Sort options can be trivially typed and constructed, but the API's filter options, whilst compliant with RFC3986, do not follow the "key=value" pair semantics that is assumed by most query string client implementations (e.g. `URLSearchParams`). As such, rather than try and build our own type-safe query string builder, we delegate it to the client by accepting an optional "additionalOptions" string.

## Single Dependency

To enable the SDK to be available for usage by both browser and nodejs, a single dependency (cross-fetch) was added.

Node.js 18 would allow even this to be removed, but not many projects have upgraded yet.
