# Changelog

## [0.3.0](https://github.com/minmoto/payment-channels/compare/payment-channels-v0.2.0...payment-channels-v0.3.0) (2026-08-29)


### ⚠ BREAKING CHANGES

* remove PaymentActor, support.actors, and the actor registry filter. Product role and permission mappings now belong to consuming applications and provider integrations.
* remove PaymentFlow, support.flows, and the flow registry filter. Product workflow mappings now belong to consuming applications and provider integrations.

### Bug Fixes

* **release:** keep breaking changes pre-major ([14e72dc](https://github.com/minmoto/payment-channels/commit/14e72dcf42a27b2188f6d496e715d463ba9f61a6))


### Code Refactoring

* remove product actor metadata ([7657c05](https://github.com/minmoto/payment-channels/commit/7657c0514b54fd78347c524ea5d9a0e07a0ec556))
* remove product flow metadata ([67068f6](https://github.com/minmoto/payment-channels/commit/67068f62e0a756b5065a44f5a29db301a4aadd82))

## [0.2.0](https://github.com/minmoto/payment-channels/compare/payment-channels-v0.1.0...payment-channels-v0.2.0) (2026-08-05)


### Features

* establish payment channel registry library ([bbb9a06](https://github.com/minmoto/payment-channels/commit/bbb9a0609b1e9e3bac05e3cef7cfdf910e32ba23))
* qualify payment channel schemas by market ([55443a1](https://github.com/minmoto/payment-channels/commit/55443a1012b6ad1dfcdf1a55d745a9c363dc1722))


### Bug Fixes

* address payment channel review feedback ([547026a](https://github.com/minmoto/payment-channels/commit/547026a44c336045fbd3a36e3ccb94463707cb9e))
* **ci:** address release workflow review ([1e2b445](https://github.com/minmoto/payment-channels/commit/1e2b445b9391a4d82b5b8c301997b7e160ae7063))

## Changelog

Notable changes to this package are recorded here. Release Please updates this file from Conventional Commit messages whenever it prepares a release.
