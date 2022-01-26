/* Utilities for DOM traversal or navigation */
import events from "./events";

const DATA_STYLE_DISPLAY = "__patternslib__style__display";

const toNodeArray = (nodes) => {
    // Return an array of DOM nodes
    if (nodes.jquery || nodes instanceof NodeList) {
        // jQuery or document.querySelectorAll
        nodes = [...nodes];
    } else if (nodes instanceof Array === false) {
        nodes = [nodes];
    }
    return nodes;
};

const querySelectorAllAndMe = (el, selector) => {
    // Like querySelectorAll but including the element where it starts from.
    // Returns an Array, not a NodeList

    if (!el) {
        return [];
    }

    const all = [...el.querySelectorAll(selector)];
    if (el.matches(selector)) {
        all.unshift(el); // start element should be first.
    }
    return all;
};

const wrap = (el, wrapper) => {
    // Wrap a element with a wrapper element.
    // See: https://stackoverflow.com/a/13169465/1337474

    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
};

const hide = (el) => {
    // Hides the element with ``display: none``
    if (el.style.display === "none") {
        // Nothing to do.
        return;
    }
    if (el.style.display) {
        el[DATA_STYLE_DISPLAY] = el.style.display;
    }
    el.style.display = "none";
    el.setAttribute("hidden", "");
};

const show = (el) => {
    // Shows element by removing ``display: none`` and restoring the display
    // value to whatever it was before.
    const val = el[DATA_STYLE_DISPLAY] || null;
    el.style.display = val;
    delete el[DATA_STYLE_DISPLAY];
    el.removeAttribute("hidden", "");
};

const find_parents = (el, selector) => {
    // Return all direct parents of ``el`` matching ``selector``.
    // This matches against all parents but not the element itself.
    // The order of elements is from the search starting point up to higher
    // DOM levels.
    const ret = [];
    let parent = el?.parentNode?.closest?.(selector);
    while (parent) {
        ret.push(parent);
        parent = parent.parentNode?.closest?.(selector);
    }
    return ret;
};

const find_scoped = (el, selector) => {
    // If the selector starts with an object id do a global search,
    // otherwise do a local search.
    return (selector.indexOf("#") === 0 ? document : el).querySelectorAll(selector);
};

const get_parents = (el) => {
    // Return all HTMLElement parents of el, starting from the direct parent of el.
    // The document itself is excluded because it's not a real DOM node.
    const parents = [];
    let parent = el?.parentNode;
    while (parent) {
        parents.push(parent);
        parent = parent?.parentNode;
        parent = parent instanceof HTMLElement ? parent : null;
    }
    return parents;
};

/**
 * Return the value of the first attribute found in the list of parents.
 *
 * @param {DOM element} el - The DOM element to start the acquisition search for the given attribute.
 * @param {string} attribute - Name of the attribute to search for.
 * @param {Boolean} include_empty - Also return empty values.
 * @param {Boolean} include_all - Return a list of attribute values found in all parents.
 *
 * @returns {*} - Returns the value of the searched attribute or a list of all attributes.
 */
const acquire_attribute = (
    el,
    attribute,
    include_empty = false,
    include_all = false
) => {
    let _el = el;
    const ret = []; // array for ``include_all`` mode.
    while (_el) {
        const val = _el.getAttribute(attribute);
        if (val || (include_empty && val === "")) {
            if (!include_all) {
                return val;
            }
            ret.push(val);
        }
        _el = _el.parentElement;
    }
    if (include_all) {
        return ret;
    }
};

const is_visible = (el) => {
    // Check, if element is visible in DOM.
    // https://stackoverflow.com/a/19808107/1337474
    return el.offsetWidth > 0 && el.offsetHeight > 0;
};

const create_from_string = (string) => {
    // Create a DOM element from a string.
    const div = document.createElement("div");
    div.innerHTML = string.trim();
    return div.firstChild;
};

const dom = {
    toNodeArray: toNodeArray,
    querySelectorAllAndMe: querySelectorAllAndMe,
    wrap: wrap,
    hide: hide,
    show: show,
    find_parents: find_parents,
    find_scoped: find_scoped,
    get_parents: get_parents,
    acquire_attribute: acquire_attribute,
    is_visible: is_visible,
    create_from_string: create_from_string,
    add_event_listener: events.add_event_listener, // BBB export. TODO: Remove in an upcoming version.
    remove_event_listener: events.remove_event_listener, // BBB export. TODO: Remove in an upcoming version.
};

export default dom;
