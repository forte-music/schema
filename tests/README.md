# tests

A collection of tests for checking the behavior of a graphql resolver. For
these tests to succeed, the resolver must be populated with data from
[`../fixtures`](../fixtures).

## Usage

After installing `@forte-music/schema`, run:

    forte-test-api http://localhost:8000/graphql

This will run the tests and exit with a status of 0 if the endpoint passes.
