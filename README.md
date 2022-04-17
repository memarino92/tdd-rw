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
