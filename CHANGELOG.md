## <small>2.0.4 (2020-03-25)</small>

-   build(deps-dev): bump eslint-config-prettier from 6.10.0 to 6.10.1 ([e1ce98a](https://github.com/Fdawgs/sanitize-middleware/commit/e1ce98a))
-   build(deps-dev): bump prettier from 2.0.0 to 2.0.1 ([154ab9e](https://github.com/Fdawgs/sanitize-middleware/commit/154ab9e))
-   build(deps): update dependencies ([63b5147](https://github.com/Fdawgs/sanitize-middleware/commit/63b5147))
-   ci(travis): move npm release into own job ([7d18d17](https://github.com/Fdawgs/sanitize-middleware/commit/7d18d17))
-   ci(travis): rotate npm token ([902ad67](https://github.com/Fdawgs/sanitize-middleware/commit/902ad67))

## <small>2.0.3 (2020-03-21)</small>

-   ci(travis): add deploy steps ([9596d9a](https://github.com/Fdawgs/sanitize-middleware/commit/9596d9a))
-   ci(travis): add release tags to branch safelist ([5366518](https://github.com/Fdawgs/sanitize-middleware/commit/5366518))
-   ci(travis): allow osx builds to fail ([4672391](https://github.com/Fdawgs/sanitize-middleware/commit/4672391))
-   ci(travis): test osx ([ccf2873](https://github.com/Fdawgs/sanitize-middleware/commit/ccf2873))
-   build(deps-dev): bump coveralls from 3.0.9 to 3.0.11 ([813c5aa](https://github.com/Fdawgs/sanitize-middleware/commit/813c5aa))
-   build(deps-dev): bump prettier from 1.19.1 to 2.0.0 ([26b3ca7](https://github.com/Fdawgs/sanitize-middleware/commit/26b3ca7))
-   build(deps-dev): increase min version of coveralls ([83d0e07](https://github.com/Fdawgs/sanitize-middleware/commit/83d0e07))
-   build(deps): bump validator from 12.2.0 to 13.0.0 ([50bcb38](https://github.com/Fdawgs/sanitize-middleware/commit/50bcb38))
-   chore(package): add prettier call to changelog gen script ([078f281](https://github.com/Fdawgs/sanitize-middleware/commit/078f281))
-   chore(package): update description; add keywords array ([34b57ff](https://github.com/Fdawgs/sanitize-middleware/commit/34b57ff))
-   chore(package): use test-only script when testing ([accd6d5](https://github.com/Fdawgs/sanitize-middleware/commit/accd6d5))

## <small>2.0.2 (2020-03-19)</small>

-   refactor(index): merge if statement into above statement ([8c8a88d](https://github.com/Fdawgs/sanitize-middleware/commit/8c8a88d))
-   refactor(index): remove redundant case block from switch statement ([1456b5a](https://github.com/Fdawgs/sanitize-middleware/commit/1456b5a))
-   style(index): start comments with uppercase letter ([f0f5876](https://github.com/Fdawgs/sanitize-middleware/commit/f0f5876))
-   tests(index): add tests for control character removal ([bbea07f](https://github.com/Fdawgs/sanitize-middleware/commit/bbea07f))
-   tests(index): add tests for html parsing ([6116b14](https://github.com/Fdawgs/sanitize-middleware/commit/6116b14))

## <small>2.0.1 (2020-03-16)</small>

-   chore: update dependencies ([d4c0364](https://github.com/Fdawgs/sanitize-middleware/commit/d4c0364))
-   build(deps-dev): bump eslint-plugin-json from 2.1.0 to 2.1.1 ([c16a0e1](https://github.com/Fdawgs/sanitize-middleware/commit/c16a0e1))

## 2.0.0 (2020-03-14)

-   docs: update jsdoc tags ([2698275](https://github.com/Fdawgs/sanitize-middleware/commit/2698275))
-   docs(readme): add further example uses; flesh out api docs ([390346e](https://github.com/Fdawgs/sanitize-middleware/commit/390346e))
-   docs(readme): update example uses ([837a829](https://github.com/Fdawgs/sanitize-middleware/commit/837a829))
-   fix(tests): fix tests where deep cloning is needed ([bb91e66](https://github.com/Fdawgs/sanitize-middleware/commit/bb91e66))
-   tests: add tests for new length check functionality ([91100f0](https://github.com/Fdawgs/sanitize-middleware/commit/91100f0))
-   feat: add check for length of request element key ([8b70419](https://github.com/Fdawgs/sanitize-middleware/commit/8b70419))
-   feat: allow differentiation between elements of request ([87d2b4b](https://github.com/Fdawgs/sanitize-middleware/commit/87d2b4b))
-   feat: allow parsing of all request elements regardless of method ([11d2a45](https://github.com/Fdawgs/sanitize-middleware/commit/11d2a45))
-   build(deps-dev): bump cross-env from 7.0.0 to 7.0.1 ([ea1f170](https://github.com/Fdawgs/sanitize-middleware/commit/ea1f170))
-   build(deps-dev): bump cross-env from 7.0.1 to 7.0.2 ([f7d1fce](https://github.com/Fdawgs/sanitize-middleware/commit/f7d1fce))
-   build(deps-dev): bump eslint-config-airbnb-base from 14.0.0 to 14.1.0 ([a49139c](https://github.com/Fdawgs/sanitize-middleware/commit/a49139c))
-   build(deps-dev): bump eslint-plugin-jest from 23.8.1 to 23.8.2 ([d878c9b](https://github.com/Fdawgs/sanitize-middleware/commit/d878c9b))
-   build(deps): bump sanitize-html from 1.22.0 to 1.22.1 ([c456fed](https://github.com/Fdawgs/sanitize-middleware/commit/c456fed))
-   chore: update lockfile ([3e22f91](https://github.com/Fdawgs/sanitize-middleware/commit/3e22f91))

### BREAKING CHANGE

-   `config` argument of sanitizeMiddleware function now allows you to specify what element of the request it corresponds to. Use `body`, `params`, and `query` to differentiate.

## <small>1.0.1 (2020-03-03)</small>

-   tests(config): add test for invalid types for arguments in config ([bde06f5](https://github.com/Fdawgs/sanitize-middleware/commit/bde06f5))
-   build(deps): remove cross-env ([93726c8](https://github.com/Fdawgs/sanitize-middleware/commit/93726c8))

## 1.0.0 (2020-03-02)

-   chore: Initial code commit ([65fa8e9](https://github.com/Fdawgs/sanitize-middleware/commit/65fa8e9))
-   chore(package): add package description ([0f8a317](https://github.com/Fdawgs/sanitize-middleware/commit/0f8a317))
-   docs(contributing): add contributing docs ([50be8dd](https://github.com/Fdawgs/sanitize-middleware/commit/50be8dd))
-   docs(readme): update readme file ([a83677d](https://github.com/Fdawgs/sanitize-middleware/commit/a83677d))
-   Initial commit ([1b5e941](https://github.com/Fdawgs/sanitize-middleware/commit/1b5e941))
