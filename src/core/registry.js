/**
 * Patterns registry - Central registry and scan logic for patterns
 *
 * Copyright 2012-2013 Simplon B.V.
 * Copyright 2012-2013 Florian Friesdorf
 * Copyright 2013 Marko Durkovic
 * Copyright 2013 Rok Garbas
 * Copyright 2014-2015 Syslab.com GmBH, JC Brand
 */

/*
 * changes to previous patterns.register/scan mechanism
 * - if you want initialised class, do it in init
 * - init returns set of elements actually initialised
 * - handle once within init
 * - no turnstile anymore
 * - set pattern.jquery_plugin if you want it
 */
import $ from "jquery";
import dom from "./dom";
import logging from "./logging";
import utils from "./utils";

const log = logging.getLogger("registry");
const disable_re = /patterns-disable=([^&]+)/g;
const dont_catch_re = /patterns-dont-catch/g;
const disabled = {};
let dont_catch = false;
let match;

while ((match = disable_re.exec(window.location.search)) !== null) {
    disabled[match[1]] = true;
    log.info("Pattern disabled via url config:", match[1]);
}

while ((match = dont_catch_re.exec(window.location.search)) !== null) {
    dont_catch = true;
    log.info("I will not catch init exceptions");
}

/**
 * Global pattern registry.
 *
 * This is a singleton and shared among any instance of the Patternslib
 * registry since Patternslib version 8.
 *
 * You normally don't need this as the registry handles it for you.
 */
if (typeof window.__patternslib_registry === "undefined") {
    window.__patternslib_registry = {};
}
export const PATTERN_REGISTRY = window.__patternslib_registry;
if (typeof window.__patternslib_registry_initialized === "undefined") {
    window.__patternslib_registry_initialized = false;
}

const registry = {
    patterns: PATTERN_REGISTRY, // reference to global patterns registry
    // as long as the registry is not initialized, pattern
    // registration just registers a pattern. Once init is called,
    // the DOM is scanned. After that registering a new pattern
    // results in rescanning the DOM only for this pattern.
    init() {
        $(document).ready(function () {
            if (window.__patternslib_registry_initialized) {
                // Do not reinitialize a already initialized registry.
                return;
            }
            window.__patternslib_registry_initialized = true;
            log.debug("Loaded: " + Object.keys(registry.patterns).sort().join(", "));
            registry.scan(document.body);
            log.debug("Finished initial scan.");
        });
    },

    clear() {
        // Removes all patterns from the registry. Currently only being
        // used in tests.
        for (const name in registry.patterns) {
            delete registry.patterns[name];
        }
    },

    transformPattern(name, content) {
        /* Call the transform method on the pattern with the given name, if
         * it exists.
         */
        if (disabled[name]) {
            log.debug(`Skipping disabled pattern: ${name}.`);
            return;
        }

        const pattern = registry.patterns[name];
        const transform = pattern.transform || pattern.prototype?.transform;
        if (transform) {
            try {
                transform($(content));
            } catch (e) {
                if (dont_catch) {
                    throw e;
                }
                log.error(`Transform error for pattern ${name}.`, e);
            }
        }
    },

    initPattern(name, el, trigger) {
        /* Initialize the pattern with the provided name and in the context
         * of the passed in DOM element.
         */
        const $el = $(el);
        const pattern = registry.patterns[name];
        if (pattern.init) {
            const plog = logging.getLogger(`pat.${name}`);
            if ($el.is(pattern.trigger)) {
                plog.debug("Initialising.", $el);
                try {
                    pattern.init($el, null, trigger);
                    plog.debug("done.");
                } catch (e) {
                    if (dont_catch) {
                        throw e;
                    }
                    plog.error("Caught error:", e);
                }
            }
        }
    },

    orderPatterns(patterns) {
        // XXX: Bit of a hack. We need the validation pattern to be
        // parsed and initiated before the inject pattern. So we make
        // sure here, that it appears first. Not sure what would be
        // the best solution. Perhaps some kind of way to register
        // patterns "before" or "after" other patterns.
        if (patterns.includes("validation") && patterns.includes("inject")) {
            patterns.splice(patterns.indexOf("validation"), 1);
            patterns.unshift("validation");
        }
        return patterns;
    },

    scan(content, patterns, trigger) {
        if (!content) {
            return;
        }

        if (typeof content === "string") {
            content = document.querySelector(content);
        } else if (content.jquery) {
            content = content[0];
        }

        const selectors = [];
        patterns = this.orderPatterns(patterns || Object.keys(registry.patterns));
        for (const name of patterns) {
            this.transformPattern(name, content);
            const pattern = registry.patterns[name];
            if (pattern.trigger) {
                selectors.unshift(pattern.trigger);
            }
        }

        let matches = dom.querySelectorAllAndMe(
            content,
            selectors.map((it) => it.trim().replace(/,$/, "")).join(",")
        );
        matches = matches.filter((el) => {
            // Filter out patterns:
            // - with class ``.disable-patterns``
            // - wrapped in ``.disable-patterns`` elements
            // - wrapped in ``<pre>`` elements
            // - wrapped in ``<template>`` elements
            return (
                !el.matches(".disable-patterns") &&
                !el?.parentNode?.closest?.(".disable-patterns") &&
                !el?.parentNode?.closest?.("pre") &&
                !el?.parentNode?.closest?.("template") && // NOTE: not strictly necessary. Template is a DocumentFragment and not reachable except for IE.
                !el.matches(".cant-touch-this") && // BBB. TODO: Remove with next major version.
                !el?.parentNode?.closest?.(".cant-touch-this") // BBB. TODO: Remove with next major version.
            );
        });

        // walk list backwards and initialize patterns inside-out.
        for (const el of matches.reverse()) {
            for (const name of patterns) {
                this.initPattern(name, el, trigger);
            }
        }
        document.body.classList.add("patterns-loaded");
    },

    register(pattern, name) {
        name = name || pattern.name;
        if (!name) {
            log.error("Pattern lacks a name.", pattern);
            return false;
        }
        if (registry.patterns[name]) {
            log.debug(`Already have a pattern called ${name}.`);
            return false;
        }
        // register pattern to be used for scanning new content
        registry.patterns[name] = pattern;

        // register pattern as jquery plugin
        if (pattern.jquery_plugin) {
            const plugin_name = ("pat-" + name).replace(
                /-([a-zA-Z])/g,
                function (match, p1) {
                    return p1.toUpperCase();
                }
            );
            $.fn[plugin_name] = utils.jqueryPlugin(pattern);
            // BBB 2012-12-10 and also for Mockup patterns.
            $.fn[plugin_name.replace(/^pat/, "pattern")] = $.fn[plugin_name];
        }
        log.debug(`Registered pattern ${name}`, pattern);
        if (window.__patternslib_registry_initialized) {
            // Once the first initialization has been done, do only scan for
            // newly registered patterns.
            registry.scan(document.body, [name]);
            log.debug(`Re-scanned dom with newly registered pattern ${name}.`);
        }
        return true;
    },
};

export default registry;
