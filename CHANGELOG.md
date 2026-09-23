# Changelog

## [0.4.0](https://github.com/minmoto/payment-channels/compare/payment-channels-v0.3.0...payment-channels-v0.4.0) (2026-09-23)


### Features

* add cash channels for Malawi and South Africa ([74805bc](https://github.com/minmoto/payment-channels/commit/74805bc0d7eea249b2dcc7686c5872ba03f6a4f2))
* add Kenyan PesaLink account channel ([eaca68b](https://github.com/minmoto/payment-channels/commit/eaca68bd8897de189e22b0cddca293e9a57b6a39))
* add M-Pesa Pochi la Biashara channel ([4fb4c2a](https://github.com/minmoto/payment-channels/commit/4fb4c2a02027020cb5dc9b1824e7572085eb1c5d))
* add reusable cash channel composition ([8713f4d](https://github.com/minmoto/payment-channels/commit/8713f4d22f2aaab5934158bac258f174aea53f29))
* add South African PayShap channels ([2e5bd37](https://github.com/minmoto/payment-channels/commit/2e5bd377c6eade1da5f9e167d9116ac87a441ee8))
* add South Sudan cash channel ([31653c9](https://github.com/minmoto/payment-channels/commit/31653c90cdaca2a02604200b6c21ccc61bfe203d))
* **channel:** add Ethiopia cash channel ([1d2d935](https://github.com/minmoto/payment-channels/commit/1d2d935e4facdd57b86999d98a75d059f35d4e14))
* **channel:** add Tunisia cash payment channel ([081b184](https://github.com/minmoto/payment-channels/commit/081b1847107d23a8ef97db473e3866b51594fe81))
* **channel:** export and import Northern Africa payment channel schemas ([8bc57f5](https://github.com/minmoto/payment-channels/commit/8bc57f597966aa3b46e4b01d76407e622fddc7dc))
* **channels:** add Algeria cash payment channel ([92aaba3](https://github.com/minmoto/payment-channels/commit/92aaba3c08ca50d551cd489d4beb6e4941b8e612))
* **channels:** add Angola cash payment channel ([c2f0b1a](https://github.com/minmoto/payment-channels/commit/c2f0b1a3e5967d5a0c94cea1d26ed23914f410fd))
* **channels:** add Botswana cash payment channel ([1f72046](https://github.com/minmoto/payment-channels/commit/1f720463c3ea6975749181f25c76e51b7c8edca9))
* **channels:** add Burundi cash channel ([2bd5ee5](https://github.com/minmoto/payment-channels/commit/2bd5ee5ea09435d22801ced3f0ad0d759849f43b))
* **channels:** add Egypt cash payment channel ([33f3fba](https://github.com/minmoto/payment-channels/commit/33f3fbab846aab07b86ae4a1886827812d33c9f5))
* **channels:** add Eswatini cash payment channel ([775ff3e](https://github.com/minmoto/payment-channels/commit/775ff3e0e6a8a70b9800a4bbec89c5caba17f2b0))
* **channels:** add Lesotho cash payment channel ([1b3c24a](https://github.com/minmoto/payment-channels/commit/1b3c24a8b43d2cb032378d404d02637e24668fe6))
* **channels:** add Libya cash payment channel ([6d81ebb](https://github.com/minmoto/payment-channels/commit/6d81ebb5cf6e8b7519263f05c635e445de87d238))
* **channels:** add missing fiat currency and payment channels ([#28](https://github.com/minmoto/payment-channels/issues/28)) ([207da1b](https://github.com/minmoto/payment-channels/commit/207da1b2e2dbb86b86acc34e9f8e3231a126b176))
* **channels:** add Morocco cash payment channel ([6ec5eac](https://github.com/minmoto/payment-channels/commit/6ec5eac89aa37b40ecfee9a515ad3b0769950ec7))
* **channels:** add Mozambique cash payment channel ([6960bc0](https://github.com/minmoto/payment-channels/commit/6960bc0120e71420d6de1b490564eefec74bb7a1))
* **channels:** add Namibia cash payment channel ([8ad4c31](https://github.com/minmoto/payment-channels/commit/8ad4c31b79e8d9fcaa9f408107fc902d0c6197a3))
* **channels:** add Rwanda cash channel ([743d47c](https://github.com/minmoto/payment-channels/commit/743d47ca81d0cff17267162309b73eed8f2dc355))
* **channels:** add Sudan cash payment channel ([86a97ac](https://github.com/minmoto/payment-channels/commit/86a97ac8daa4cc44b6af098c46d616d62103039a))
* **channels:** add Tanzania cash channel ([aedb577](https://github.com/minmoto/payment-channels/commit/aedb577e5b03843c610e6cb79ec05e2ff160fd2b))
* **channels:** add test to verify every represented country has a built-in cash channel ([5b6abe1](https://github.com/minmoto/payment-channels/commit/5b6abe146f81364a6261c7bcf977894436e59167))
* **channels:** add Uganda cash channel ([e449744](https://github.com/minmoto/payment-channels/commit/e449744966aac7cedc7ac56e26c3333ef4d512ba))
* **channels:** add Zambia cash payment channel ([73e9bb7](https://github.com/minmoto/payment-channels/commit/73e9bb705b9efb21ef69ecf7f56aad49e99da038))
* **channels:** export and import east africa cash channels in index.ts ([a0442aa](https://github.com/minmoto/payment-channels/commit/a0442aa0da1cd32b91fc996b7485ff3fec271aad))
* **channels:** register and export South African region cash payment channels ([4025c58](https://github.com/minmoto/payment-channels/commit/4025c58491e103d31ee557c49af618e60ea33b63))
* support dual ESM and CommonJS exports ([f40a612](https://github.com/minmoto/payment-channels/commit/f40a61288f3c94fe15124e57296bc3e1c050fbb6))
* **test:** add test for built-in cash channels for South African markets ([41dac1a](https://github.com/minmoto/payment-channels/commit/41dac1aef515f3ea280e58edbccedb99681f9656))
* **test:** verify every represented country from Nothern Africa has a built in cash channel ([f7a5dba](https://github.com/minmoto/payment-channels/commit/f7a5dba58557d3acd18fa1b326c3e29a834585f8))


### Code Refactoring

* group channel sources by country ([c210a07](https://github.com/minmoto/payment-channels/commit/c210a07e73861fda603ef2b51f523dccb737c2da))


### Documentation

* add agent-friendly registry guidance ([b664608](https://github.com/minmoto/payment-channels/commit/b664608a9145d8bea88653d3aefe511db33de492))
* **channels:** add cash channel documentation for east african countries added ([3c84fde](https://github.com/minmoto/payment-channels/commit/3c84fdee7175f3176da3d486cde187a931f2459f))
* **channels:** add South African market cash payment channels to the seed registry ([9d5c054](https://github.com/minmoto/payment-channels/commit/9d5c0540ce85701b36620ff4531453c8118a2ee5))
* **channels:** update generated registry documentation for North African cash channels ([f531f74](https://github.com/minmoto/payment-channels/commit/f531f7430e8f8dd93e1df3eb313ced25989775c8))

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
