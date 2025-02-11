# Changelog

See the [history](./docs/history/index.md) for older changelog entries.



## [9.3.1](https://github.com/Patternslib/patterns/compare/9.3.0...9.3.1) (2022-09-21)


### Maintenance


* **Build:** Upgrade pat-upload to 3.1.1 to fix the previous pat-upload brown bag release. ([030b801](https://github.com/Patternslib/patterns/commit/030b801ac233188ecbd454e3e84285c764143011))pat-upload 3.1.0 did not include the advertised changes and was basically the same as 3.0.0.

## [9.3.0](https://github.com/Patternslib/patterns/compare/9.3.0-beta.0...9.3.0) (2022-09-20)


### Features


* **pat navigation:** Mark the navigation items after injection. ([ec2a795](https://github.com/Patternslib/patterns/commit/ec2a7957da8bfca9e96f8b1aea6a81002aa79b30))After a pat-inject has updated the navigation, re-mark all navigation items.
This is an alternative and approach to the previous mutation observer based one.


### Maintenance


* **Build:** Upgrade dependencies. ([60b4e2e](https://github.com/Patternslib/patterns/commit/60b4e2e1693dcfbe34e8bf7a3d46de9ddef05f6f))

## [9.3.0-beta.0](https://github.com/Patternslib/patterns/compare/9.2.1...9.3.0-beta.0) (2022-09-16)


### Maintenance


* **core base:** Remove console.log statement from tests. ([09d533e](https://github.com/Patternslib/patterns/commit/09d533e3d8995eb5e72fec374a7a7410a8a7f707))


### Breaking Changes


* **pat navigation:** Improve performance by removing the unnecessary mutation observer. ([7c28913](https://github.com/Patternslib/patterns/commit/7c289134205042f358e458c47a2a695d8e6192a8))Since we're almost always using pat-inject for replacing or adding DOM nodes
and we already have support for pat-inject here, the mutation observer is not
necessary. Removing it improves the performance in situations where the
navigation structure is updated - for example off-canvas navigation updates
with pat-tabs would invoke many mutation observer callback hits. The previous
performance improvement solved the performance penalty by deferring the
callback for 10ms, but this is taking that further by avoiding it at all.

## [9.2.1](https://github.com/Patternslib/patterns/compare/9.2.0...9.2.1) (2022-09-16)


### Bug Fixes


* **pat navigation:** Do not break when no item wrapper is found. ([6c84a41](https://github.com/Patternslib/patterns/commit/6c84a414215f8cfb589a02666a567895a543c4b8))

* **pat navigation:** Improve the performance when the navigation elements change. ([a6ec32b](https://github.com/Patternslib/patterns/commit/a6ec32ba74340b567b8e36e5a2687b1072731f55))Debounce the mutation observer callback which initialized the markings for 100ms for better performance.

* **pat navigation:** Initialize the click handler on the element directly. ([0b099cc](https://github.com/Patternslib/patterns/commit/0b099cc4c170f93d895d6ef536a017e47d8e4150))This way it needs to be initialized only once, even if the subtree changes.
Remove the init_listeners from the mutation observer for better
performance.

* **pat navigation:** Only search within the current element. ([417085e](https://github.com/Patternslib/patterns/commit/417085e7837285a46420ee1ac28ff1e7ee14745f))

* **pat navigation:** Remove mockup-related checking of input fields. ([1e5afe7](https://github.com/Patternslib/patterns/commit/1e5afe7a8a4de67c556d70ad30c4f2feed3ba4a5))

## [9.2.0](https://github.com/Patternslib/patterns/compare/9.1.1...9.2.0) (2022-09-15)


### Features


* **pat close panel:** Support for closing dialog panels. ([7593048](https://github.com/Patternslib/patterns/commit/7593048044126153d7868b36128ac4ec2e3c7564))

* **pat navigation:** Add URL-based navigation markers. ([9a0f7a3](https://github.com/Patternslib/patterns/commit/9a0f7a3dc4684361a3dc6c1c8663f9cb139e6e72))That feature was also present in the old implementation but is now improved.

* **pat navigation:** Always set in-path classes. ([16bc8a2](https://github.com/Patternslib/patterns/commit/16bc8a26733771e7ea184ec7ada018a3a3422043))When doing URL based checkings do always set the in-path classes for an active submenu item, even if it does not match the URL path hierachy.

* **pat navigation:** Support click-only markings. ([904e54f](https://github.com/Patternslib/patterns/commit/904e54fabedf3a128857a45dccf13974e61f7916))Mark the navigation items also on clicks on anchors without pat-inject.

* **pat navigation:** When a navigation wrapper is in-path, also mark the corresponding anchor as in-path. ([e9da003](https://github.com/Patternslib/patterns/commit/e9da00330f2f6a866d1e1b7e688e3fca6f3eeecf))


### Bug Fixes


* **Build:** Register jQuery globally. ([e72f41a](https://github.com/Patternslib/patterns/commit/e72f41aedf1ca45a1c1ac785b726ca9180621231))Since the module federation support jQuery was registered globally too late for some scripts.
Now jQuery is registered as soon as the index.js is loaded.
This allows for following scripts to use jQuery.

* **core base:** Do not break when initialized with no element. ([cd16107](https://github.com/Patternslib/patterns/commit/cd1610732d47a48a2a2d5ba25f56ef8dc5a74458))


### Breaking Changes


* **pat navigation:** Set explicit pattern trigger. ([968edca](https://github.com/Patternslib/patterns/commit/968edca2c677359115ff0687b1174ba1d2307c33))Do only trigger the pattern on the ``.pat-navigation`` class and remove the trigger for ``.navigation`` classes and ``<nav>`` elements.


### Maintenance


* **core dom:** Code optimization for dom.find_parents. ([de1fb71](https://github.com/Patternslib/patterns/commit/de1fb718e794b26ba03fe2c18cec13e560589965))

* **core dom:** Update documentation. ([4ac25cc](https://github.com/Patternslib/patterns/commit/4ac25cc146a7f4dcb3767f8541fe02881714bd87))

* HTMLDialogElement support not in @patternslib/dev 2.7.0. ([d2c279f](https://github.com/Patternslib/patterns/commit/d2c279f22b2db60828014cbe4646c7a76e5876db))

* Modernize header markup in demo files. ([2f366e9](https://github.com/Patternslib/patterns/commit/2f366e9b84caa937db0d9ceb520f49d159933b82))

* **pat inject:** Move core.utils.rebaseURL to inject patterns. ([144240d](https://github.com/Patternslib/patterns/commit/144240de790d6b4e9d6e73f8fef7cd02d8fb66d7))core.utils.rebaseURL was only used by the inject pattern and is in this form not useful for broader use.
If you need to rebase an relative or absolute URL against a base url, use:
new URL(url, base_url)

* **pat inject:** Specify allowed values for the history parameter. ([e36c58c](https://github.com/Patternslib/patterns/commit/e36c58cf147551f77c11e55d2dcf0f16ae024cd4))

* **pat navigation:** Modernize code. ([f5269de](https://github.com/Patternslib/patterns/commit/f5269de5666be68ba0e38989fe22ebb2b63dd5a3))

* **pat navigation:** Refactor implementation for more stability. ([458e76b](https://github.com/Patternslib/patterns/commit/458e76bf47e4ea2ad6ac1741a5872b574862280a))

* Upgrade dependencies. ([806fc24](https://github.com/Patternslib/patterns/commit/806fc24f8bc032df5042e9b76d6fb0da490941e4))

## [9.1.1](https://github.com/Patternslib/patterns/compare/9.1.0...9.1.1) (2022-09-08)


### Bug Fixes


* **pat display time:** Fix relative time for timezone corner cases. ([3c62c65](https://github.com/Patternslib/patterns/commit/3c62c658099be5ef155069cac943bffc3959bf4e))For date-only from-now, just use Intl.RelativeTimeFormat to avoid any
timezone calculation mistakes. This prevents a case where in days in the
future or past were shown as 9 days due to timezone differences in some
circumstances.


### Maintenance


* **pat display time:** Extend the demo. ([2bd1ff6](https://github.com/Patternslib/patterns/commit/2bd1ff6f970c602a84c4e65548e977ddd9b75f1a))

* **pat inject:** Correct docs that the history parameter does not have record set as default. ([7f06eda](https://github.com/Patternslib/patterns/commit/7f06edaa873d67c1105838c989ed9011e73c9cfd))

* **pat inject:** Re-organize the demos. ([3d3e8c3](https://github.com/Patternslib/patterns/commit/3d3e8c356d9156757719a75c2b452a2d3ac44703))- Create dedicated ``demo`` folder and move demo files in there.
- Remove inject-history folder and move demo into inject.

## [9.1.0](https://github.com/Patternslib/patterns/compare/9.1.0-beta.4...9.1.0) (2022-09-06)


### Bug Fixes


* **pat sortable:** Fix sorting functionality when sort item has any other class than .sortable. ([75815a6](https://github.com/Patternslib/patterns/commit/75815a6659b4385c1301f1947424861bcacb08c2))


### Maintenance


* **pat display time:** Fix tests and demo which failed due to timezone offsets around midnight. ([a5d0695](https://github.com/Patternslib/patterns/commit/a5d06958811173445fa6033a2b8a44eb11756a91))

## [9.1.0-beta.4](https://github.com/Patternslib/patterns/compare/9.1.0-beta.3...9.1.0-beta.4) (2022-09-05)


### Bug Fixes


* **Build:** Resolve to jquery 3.6.1 to not include mutliple jquery versions. ([e1c7d01](https://github.com/Patternslib/patterns/commit/e1c7d017d9ae5a6252db9f0f57b13543273f0002))

## [9.1.0-beta.3](https://github.com/Patternslib/patterns/compare/9.1.0-beta.2...9.1.0-beta.3) (2022-09-05)


### Features


* **pat sortable:** Trigger pat-update after sorting changes. ([3bb5513](https://github.com/Patternslib/patterns/commit/3bb5513165c4d0791bafc78533c14d31bfe2038a))Other patterns can react on that for example submitting the form with pat-auto-submit.


### Bug Fixes


* **pat auto submit:** Support pat-clone and pat-sortable. ([4ec72ef](https://github.com/Patternslib/patterns/commit/4ec72ef5bb71ce429ac144e1499c9ca1f4962a1b))When pat-clone adds an element, initialize that element to listen for changes.
When pat-clone removes an element or pat-sortable changes the order, submit the form.


### Maintenance


* **Build:** Upgrade dependencies. ([e5e2c7b](https://github.com/Patternslib/patterns/commit/e5e2c7b1d2377bb9184f3e19db6296a3826c74a4))

## [9.1.0-beta.2](https://github.com/Patternslib/patterns/compare/9.1.0-beta.1...9.1.0-beta.2) (2022-08-23)


### Maintenance


* Upgrade pat-tiptap to 4.5.0. ([423dfc7](https://github.com/Patternslib/patterns/commit/423dfc76267f72a34c69f4f13a1b588f37814bcc))

## [9.1.0-beta.1](https://github.com/Patternslib/patterns/compare/9.1.0-beta.0...9.1.0-beta.1) (2022-08-19)


### Features


* **core base:** Add pattern property autoregister to allow patterns which are not automatically registered in the patternslib registry. ([ef4d234](https://github.com/Patternslib/patterns/commit/ef4d234e7bae2990b556e03159127565b372a0b2))

* **pat inject:** Dispatch a patterns-injected-delayed event 10ms after the injection has been done and pass the injected content with it. This allows to re-scan the injected content in cases where a pattern wasn't registered at injection time. ([00b66fe](https://github.com/Patternslib/patterns/commit/00b66fee54875a40029291a8a884b2ab1762f5d1))


### Bug Fixes


* **pat inject:** Fix code error with not scanning and triggering for comment nodes. ([c281ae4](https://github.com/Patternslib/patterns/commit/c281ae45d8d4c6f6640b57a698a5115a914dddf7))

* **pat validation:** Do not trigger a pat-update after validation. ([b4603c9](https://github.com/Patternslib/patterns/commit/b4603c9ea6e485fb12b5e319f1421dc593d081b6))


### Maintenance


* **Build:** Unlink all eventually linked [@patternslib](https://github.com/patternslib) dependencies before building bundles. ([debeeea](https://github.com/Patternslib/patterns/commit/debeeead65c1f29003367567c254a2ff3150487a))

* **Build:** Upgrade dependencies. ([515bf42](https://github.com/Patternslib/patterns/commit/515bf42d4424459cf1c98b03f0651f63077de411))

* **pat inject:** Minor test restructuring. ([e740a88](https://github.com/Patternslib/patterns/commit/e740a8896fccb3a1b998a93272e0eb76befec5c7))

* **pat validation:** Add input with type URL example to demo. ([b3e98e0](https://github.com/Patternslib/patterns/commit/b3e98e0f9beac543b285e85f009b245b5776787f))

## [9.1.0-beta.0](https://github.com/Patternslib/patterns/compare/9.0.1...9.1.0-beta.0) (2022-08-11)


### Features


* **core utils:** Add date_diff to calculate the difference in days between two dates, respecting DST‌ offsets. ([dd5cc7b](https://github.com/Patternslib/patterns/commit/dd5cc7b310d2d58646892a5e71d17a08f7757909))

* **core utils:** Add is_iso_date check for testing for iso dates only. ([a90afd6](https://github.com/Patternslib/patterns/commit/a90afd6f7e004b4afb6bc0163bd0f1c8efb5008e))

* **pat display time:** Improve the output for date-only dates in relative mode. ([e3909a4](https://github.com/Patternslib/patterns/commit/e3909a4aa1d9f3d1baab934094ce03f096776bdf))When output is from-now (relative date) and the date is a date-only date without a time component, do not include the time in the output.


### Maintenance


* **Build:** Include bundle name and version in generated files (Feature of @patternslib/dev 2.4.0.) ([392998e](https://github.com/Patternslib/patterns/commit/392998efa29264e4e06099ec0ec81742cdc45248))

* **pat display time:** Improve the documentation. ([ef13602](https://github.com/Patternslib/patterns/commit/ef1360264f6cdbbdf4126707ab3a49dd669a0cbf))

* Upgrade dependencies. ([070b262](https://github.com/Patternslib/patterns/commit/070b26269e271091b6b1c071dbc5bffd96ec0ac8))

## [9.0.1](https://github.com/Patternslib/patterns/compare/9.0.0...9.0.1) (2022-07-20)


### Bug Fixes


* **Build:** Fix luxon to 2.4.0 to avoid webpack MF error due to non standard package.json setup. ([784f036](https://github.com/Patternslib/patterns/commit/784f036e34b5cae6f5480a02082d985b6b270760))

* **pat tooltip:** Avoid repositioning of the tooltip arrow. ([880ebdb](https://github.com/Patternslib/patterns/commit/880ebdb9587dfb66b4d0191aa1df9a68f9fe1791))- Setting the tooltip-container class before async calls.
- Avoid unnecessary repaints by grouping dom manipulations together.
- Merge onMount and onShow into onShow method.

## [9.0.0](https://github.com/Patternslib/patterns/compare/9.0.0-beta.1...9.0.0) (2022-07-17)


### Features


* **Webpack Module Federation:** Dispatch the event patternslib_mf--loaded when all remotes have been initialized. ([9c86483](https://github.com/Patternslib/patterns/commit/9c86483b5f5c117fb20c453eb5dd32558115f8b7))


### Bug Fixes


* **pat modal:** Trigger ``pat-modal-ready`` event only once. ([ddb7c5d](https://github.com/Patternslib/patterns/commit/ddb7c5d5adbee5d4436025b332045a11cf6746cc))For pat-modal instances on anchor elements where pat-inject is involved the
event ``pat-modal-ready`` was triggered twice. This is now fixed and the event
is only triggered after the modal was inserted.

* **pat tooltip:** Fix problem with misaligned tooltip arrow with remote content. ([4656100](https://github.com/Patternslib/patterns/commit/46561005cb82c4a7b3f459e8099f37d604d8c95f))

* **pat tooltip:** Initialize Patterns directly after getting content. ([e601fd8](https://github.com/Patternslib/patterns/commit/e601fd8e16690d2819df5f9a77db30963cdcc2df))This fixes a problem where onMount was initializing Patterns before get_content returned and inserted the content.


### Maintenance


* **Bundle:** Upgrade pat-tiptap to 4.3.0. ([24bfa4b](https://github.com/Patternslib/patterns/commit/24bfa4bedab30b54f4b4231a981e3393742bbfb3))

* **core base:** Document prevention of pattern double initialization in asynchronous cases. ([1d9bb38](https://github.com/Patternslib/patterns/commit/1d9bb381e6151fbe0e3f7d642f45b0bd4af8854d))

* **pat modal:** Document how pat-modal works. ([2015e89](https://github.com/Patternslib/patterns/commit/2015e897de7c50fcfa894f2f86f53fb5a1d26056))

## [9.0.0-beta.1](https://github.com/Patternslib/patterns/compare/9.0.0-beta.0...9.0.0-beta.1) (2022-07-08)


### Bug Fixes


* **pat depends:** Allow input names with colons in the parser, as used in Plone. ([48298c2](https://github.com/Patternslib/patterns/commit/48298c2e1ebe5e009b32b041d6ded50476fc3ed5))


### Maintenance


* **Build:** Upgrade Moment to 2.29.4. ([a0bf6fd](https://github.com/Patternslib/patterns/commit/a0bf6fd9cbe29110fb1d40c98fff115dd9097172))

* **Build:** Upgrade to @patternslib/dev 2.3.0. ([a02619e](https://github.com/Patternslib/patterns/commit/a02619eb8a07d14ccc74404ad9d0d188fe3a8f7a))

* **pat checkbox:** Do not include styles and make the demo better usable. ([7cd1dc3](https://github.com/Patternslib/patterns/commit/7cd1dc32ac5ed10edc096b5d0ccfa0f39b81912d))

* **pat depends:** Change Makefile to generate the parser optimized for size and output it as ES module. ([3bfd39f](https://github.com/Patternslib/patterns/commit/3bfd39ff51fbe29003f6c05c4b76ce6bbfe2737a))

* **pat depends:** Depend on latest pegjs for generating the depends parser. ([5339822](https://github.com/Patternslib/patterns/commit/5339822c7b8ab1343912637bda69e0b1c71daf05))

* **pat depends demo:** Add demo with optional date fields. ([bfd5dbe](https://github.com/Patternslib/patterns/commit/bfd5dbe4a363a475b0e65932973420ad0b1044a6))

* **pat depends demo:** Demo colons in input names. ([e882f4f](https://github.com/Patternslib/patterns/commit/e882f4ffd37efa79f61f8cb741e5be69f223ad46))

* **pat depends demo:** Demo multiselection. ([85a824a](https://github.com/Patternslib/patterns/commit/85a824ac241c4a5fe90bc45b6bcdad257b9815d2))

* **pat depends demo:** Set to import styles in JavaScript so that auto-suggest is styled. ([e8b2ea2](https://github.com/Patternslib/patterns/commit/e8b2ea27ed99ccf8123277b7b2bc348325b52038))

* Add .eslintignore and ignore generated depends_parse.js file. ([f9bc55f](https://github.com/Patternslib/patterns/commit/f9bc55f3b3e103e15f48bd2ed0f29bbf6066f2e3))

* Do not define __patternslib_import_styles, so that it can be defined by another script without being overwritten. ([7101d23](https://github.com/Patternslib/patterns/commit/7101d232b2d8e547338d36acef152b360327fcb1))

## [9.0.0-beta.0](https://github.com/Patternslib/patterns/compare/9.0.0-alpha.1...9.0.0-beta.0) (2022-06-29)


### Bug Fixes


* Configure module alias for @patternslib/patternslib so that extended jest config from dev does not fail. ([ce89f24](https://github.com/Patternslib/patterns/commit/ce89f24d13323f6b95d17be3a24f6b2848585f22))

* **pat scroll box:** Fix issue where elastic scrolling on Safari would remove the scroll-position-top class for a moment when overscrolling on top. ([596fd06](https://github.com/Patternslib/patterns/commit/596fd06f87090201e72a4086e4ea0d3313197fae))


### Maintenance


* **Build:** Adapt to latest module federation changes in @patternslib/dev 2.2.0. ([c2f4d37](https://github.com/Patternslib/patterns/commit/c2f4d37ed8858b31d50ebc6102841923cc495bc3))

* **Build:** Add a watch Makefile target and package.json script. ([c48ff3e](https://github.com/Patternslib/patterns/commit/c48ff3eeb37e5fcaf91a9a63662d43070a4032d3))

* **Build:** Update @patternslib/dev to 2.2.0. ([a1550ca](https://github.com/Patternslib/patterns/commit/a1550ca81dcd5e93f5996eb576ccc090643290b1))

* **Build:** Upgrade all pat-* dependency packages to it's latest version. ([4628120](https://github.com/Patternslib/patterns/commit/46281203a81b969d16996250bb47b81f9e05568c))

* **Build:** Upgrade dependencies. ([eaeed1a](https://github.com/Patternslib/patterns/commit/eaeed1acc4f5404c462140561b555b13457e68ad))

* **pat scroll box:** Document that scroll-down and scroll-up classes are not cleared after scrolling has stopped. ([52f4343](https://github.com/Patternslib/patterns/commit/52f4343f583d09bd65bc6de89306515eb768d30d))

* **pat scroll box:** Improve demo styles. ([61fa3d8](https://github.com/Patternslib/patterns/commit/61fa3d8469bbe0a7ec241f75c7a0fb500190e6f9))

## [9.0.0-alpha.1](https://github.com/Patternslib/patterns/compare/9.0.0-alpha.0...9.0.0-alpha.1) (2022-06-15)


### Features


* **Build:** Allow Patternslib add-ons to be built within the Patternslib package as part of a Patternslib bundle distribution by defining an alias for @patternslib/patternslib. ([d4ae08b](https://github.com/Patternslib/patterns/commit/d4ae08b699af1d785efac6005867810869105df3))

* **Bundle:** Create a universal bundle. ([9215532](https://github.com/Patternslib/patterns/commit/92155325fce0f09983f23a0e84c7913819dc2f98))Add more external patterns in order to create a universal drop-in bundle for Patternslib.
Patterns added:

  - pat-content-mirror
  - pat-doclock
  - pat-shopping-cart
  - pat-sortable-table
  - pat-tiptap
  - pat-upload


### Breaking Changes


* Depend on @patternslib/dev and extend config from there. ([aea3681](https://github.com/Patternslib/patterns/commit/aea3681182bed03121c97943113a6a0782b7d2e1))

* Extend babel config from @patternslib/dev. ([83cef90](https://github.com/Patternslib/patterns/commit/83cef9073ba19f7364b8abd18a105655990eb80a))

* Extend commitlint config from @patternslib/dev. ([9216ed7](https://github.com/Patternslib/patterns/commit/9216ed7c90e00ee9e5d7b03c3cfa45d1cc29a16b))

* Extend eslint config from @patternslib/dev. ([2cfeadc](https://github.com/Patternslib/patterns/commit/2cfeadc722b3609102b28fe03beb45a6ad55a06a))

* Extend jest config from @patternslib/dev. ([125a4f7](https://github.com/Patternslib/patterns/commit/125a4f757a0b98dd72ec7ccca4f707ccb6e45fa0))

* Extend Makefile from @patternslib/dev. ([923efe3](https://github.com/Patternslib/patterns/commit/923efe3b9d86a0c757e9757a43c4592a87072a58))

* Extend prettier config from @patternslib/dev. ([0bbbdca](https://github.com/Patternslib/patterns/commit/0bbbdca7b73a56907aeaa9dc062037fec740d924))

* Extend release-it config from @patternslib/dev. ([b692ce0](https://github.com/Patternslib/patterns/commit/b692ce03c195e9dbe6b83e87bf75488dd5856495))

* Extend webpack config from @patternslib/dev. ([208726f](https://github.com/Patternslib/patterns/commit/208726fb750cbd78ec6a599e261b849f94e592be))


### Maintenance


* Do not eslint the generated depends_parse file. ([dbfd33f](https://github.com/Patternslib/patterns/commit/dbfd33fefc6d0b9458d386fcd49de395c829bdd6))

* Move webpack.dist.js back to webpack.config.js. ([20f1d68](https://github.com/Patternslib/patterns/commit/20f1d684a0706730fef4b79ddcc9a629fd2e1911))

* Remove unused variables from Makefile. ([141ade4](https://github.com/Patternslib/patterns/commit/141ade433b3a961531917154abf7f1537c34e045))

## [9.0.0-alpha.0](https://github.com/Patternslib/patterns/compare/8.1.0...9.0.0-alpha.0) (2022-06-14)


### Features


* **Build:** Create Module Federation enabled bundles within Patternslib. ([ef28e21](https://github.com/Patternslib/patterns/commit/ef28e215fc3d6446ab8ca5d84ce29d363f4dbf48))

* **Build:** Externalize Patternslib core webpack config to allow customizing Patternslib bundles without affecting add-on packages which depend on webpack.config.js. ([3e9dd6c](https://github.com/Patternslib/patterns/commit/3e9dd6cae7eceaa0ea8727c2df811daa5945bdc7))


### Bug Fixes


* **Build:** Do not re-initialize already initialized bundles. ([8c0499f](https://github.com/Patternslib/patterns/commit/8c0499f340d78ac3e0d7d9c8b20657babefe66b1))


### Maintenance


* **Build:** Extend jest.config.js in a way that it is extendable by add-on packages. ([f16b3a5](https://github.com/Patternslib/patterns/commit/f16b3a5cf724c4eb4b54f8fa2811f559d5c1d70c))

* **Build:** Extend test setup code. ([00f1a34](https://github.com/Patternslib/patterns/commit/00f1a347e765266a67d4738160343548728c8a01))Add more setup code to mock Web API features for tests from other Patternslib add-on packages.

* **Build:** Remove dependency @babel/plugin-proposal-optional-chaining which is included in Babel since 7.8. ([cfd5cd4](https://github.com/Patternslib/patterns/commit/cfd5cd49b62bba0328a3c8cd87236174383c3d60))

* **Build:** Remove dependency regenerator-runtime except from test setup. The async/await runtime handling is already built-in in current Babel. ([f8a9889](https://github.com/Patternslib/patterns/commit/f8a988909bcd64b1e72996b9d931e03ae82cc446))

* **Build:** Remove unused @testing-library/jest-dom. ([6aeefc5](https://github.com/Patternslib/patterns/commit/6aeefc5bd2d322b9b49050db65ae4adb76d1cffd))

* **Build:** Remove unused inspectpack. ([a586a5d](https://github.com/Patternslib/patterns/commit/a586a5d72cb5a77a0d75cbb776c84911d1bd9641))

* **Build:** Upgrade dependencies. ([d0739d6](https://github.com/Patternslib/patterns/commit/d0739d600ee8784c3651fd55067d7475ac0b67ec))

* **docs:** Move upgrade 2 to 3 guide to history section. ([5449491](https://github.com/Patternslib/patterns/commit/5449491cbb851af9d1a2b3f5f017a6b599f8d9a7))

* **docs:** Remove outdated roadmap and version files. ([8f9e0cb](https://github.com/Patternslib/patterns/commit/8f9e0cb5a992303d961c4a9790a41ceb3e77547c))