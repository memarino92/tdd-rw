# Test Driven Redwood

The purpose of this repository is to explore what development with RedwoodJs in a real-world, outside-in test-driven methodology would look like (whoa that's a lot of hyphens). It is constantly evolving, and welcoming to critiques and pull requests.

Who is this for?

- Me, to learn and explore both outside-in TDD and Redwood
- Developers familiar with testing and TDD but not with Redwood.
- Developers familiar with Redwood, but maybe not as familiar with testing or TDD
- Developers not familiar with testing or Redwood, but do have at least some experience programming.
- Anyone who finds reading technical documents for fun a good use of their time.

This guide is largely inspired by Josh Justice's work on [outsidein.dev](https://outsidein.dev), the book *Learning Test-Driven Development* by Saleem Siddiqui, and Cypress' own educational material found at [learn.cypress.io](https://learn.cypress.io).

Setup:

```bash
yarn create redwood-app tdd-rw
cd tdd-rw
yarn rw dev
```

```bash
git init
git add .
git commit -m "first commit"
# optionally rename branch if set to master
git branch -m master main
```

```bash
gh repo create
# I prefer interactive mode, so follow prompts - public repo, push local, path to repo ( . ), add remote
```

```bash
git checkout -b add_cypress
yarn add cypress --dev
yarn run cypress open

# If using in WSL process is more complicated, link to something explaining how to use WSLg or XServer to launch GUI
```

Click "No thanks, delete example files" in the Cypress GUI.
Create a new file `cypress/integration/app.spec.ts` and put the following code inside:

```js
describe('Renders the homepage successfully', () => {
  it('can navigate to the home page', () => {
    cy.visit('localhost:8910')
  })
})
```
You should be able to run the test from the Cypress GUI and see the Redwood splash page in the Cypress test runner.

```bash
git add .
git commit -m "feat: added cypress and wrote first smoke test"
gh pr create
gh pr merge
```
```bash
git checkout -b ci
yarn rw test
```
Press 'a' to run all tests - see that there's already some tests written for us! Very nice.

Double check that we know how to run in ci mode with
```bash
yarn rw test --no-watch
```

Cypress in CI mode (make sure the dev server is running in another terminal session!):

```bash
yarn run cypress run
```
Everything passing in both our unit tests and e2e - let's put in in action - a GitHub action!

```bash
mkdir -p .github/workflows
code .github/workflows/test.yml
```

Here's our action:

```yml
name: Test

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    name: Test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js
        uses: actions/setup-node@v1
        with:
          node-version: '16.x'
      - name: Install dependencies
        run: yarn install --frozen-lockfile
      - name: Unit tests
        env:
          TEST_DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}
        run: yarn rw test --no-watch
      - name: E2E Tests
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        uses: cypress-io/github-action@v2
        with:
          build: yarn rw build
          start: yarn rw serve
```

For now, we need both a "regular" database for running our e2e tests with Cypress, and "test" database to test out unit and integration tests with Jest. Hopefully down the line we will be able to use the test DB for everything.

Setup a local Postgres install for local dev workflow, or use Railway.

Switch rw project to use pg.

Will be using Railway PG for both "real" and "test" dbs in our CI.
Provision 3 pg instances - environments "production", "test", and "ci" (Why a "production" environment? because that's the default when you start a new Railway project! No reason to delete it, we'll use it in a bit.).

In github, go to your `tdd-rw` repo > Settings > Security > Secrets > Actions, click the 'New Repository Secret' button, and input the connection strings from Railway as `DATABASE_URL` and `TEST_DATABASE_URL`.

Everything should now be set up to run your tests in a github action every pull request - let's test it out!

```bash
git add .
git commit -m "feat: added github action to run tests"
gh pr create
gh pr merge
```

Go ahead and rebase/merge the branch. Once merged, you should be able to go to the "Actions" tab of your repo in GitHub and watch all of your tests execute, and, presumably, pass!

Now that we have a working CI/CD pipeline, let's go ahead and get this puppy deployed. Redwood has built in support for a bunch of different deployment prodivers and environments - one of the easiest to get started with is Netlify, so we'll be using that one for our purposes. Head on over to [Netlify](https://netlify.com) and sign up for an account if you don't have one already.

Back in your terminal, create a new branch:

```bash
git checkout -b deploy
```

and run the redwood netlify setup command:

```bash
yarn rw setup deploy netlify
```
This command created a `netlify.toml` file in the root of your app, and makes a modification to `redwood.toml`. This provides Netlify all the information it needs to build and deploy your application. Go ahead and commit these changes, and open a pull request - making sure our tests pass and we didn't break the app!
We *could* have run our tests locally, but as long as they pass in CI, that's all we really care about.

```bash
git add .
git commit -m "build: setup deploy settings for Netlify"
gh pr create
gh run watch
```

This time, we can watch our tests run in CI right from our terminal with `gh run watch`.

Once our tests pass (and they should), go ahead and merge the branch

```bash
gh pr merge
```
and let's get this app deployed already! Install Netlify's CLI if you don't have it already and log in and set up a new project

```bash
npm install netlify-cli -g
netlify login
netlify init
```

and that should do it! We should be able to visit our site live, in production - although there's not much to look at yet!
