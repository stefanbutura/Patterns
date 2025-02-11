import Base from "../../core/base";
import dom from "../../core/dom";
import logging from "../../core/logging";
import Modal from "../modal/modal";
import Parser from "../../core/parser";
import registry from "../../core/registry";
import store from "../../core/store";

const log = logging.getLogger("calendar");
export const parser = new Parser("calendar");

parser.addArgument("calendar-controls", null); // Calendar controls must have "id" attr set
parser.addArgument("category-controls", null);
parser.addArgument("column-day", "dddd M/d");
parser.addArgument("column-month", "ddd");
parser.addArgument("column-week", "ddd M/d");
parser.addArgument("initial-date", null);
parser.addArgument("initial-view", "month", [
    // Simple names
    "month",
    "week",
    "day",
    "list",
    // FC 5 names
    "dayGridMonth",
    "dayGridWeek",
    "dayGridDay",
    "timeGridWeek",
    "timeGridDay",
    "listDay",
    "listWeek",
    "listMonth",
    "listYear",
    "listWeek",
    // FC 3 names
    "basicWeek",
    "basicDay",
    "agendaWeek",
    "agendaDay",
]);
parser.addArgument("drag-and-drop", true, [true, false]);
parser.addArgument("drop-external-events", true, [true, false]);
parser.addArgument("external-event-selector", "");
parser.addArgument("first-day", null);
parser.addArgument("first-hour", "6");
parser.addArgument("height", "auto");
parser.addArgument("ignore-url", false);
parser.addArgument("lang", null); // If not set, use "en" (See below)
parser.addArgument("store", "none", ["none", "session", "local"]);
parser.addArgument("time-format", "24h", ["24h", "12h"]);
parser.addArgument("timezone", null);
parser.addArgument("title-day", "dddd, MMM d, YYYY");
parser.addArgument("title-month", "MMMM YYYY");
parser.addArgument("title-week", "MMM D YYYY");
parser.addArgument("event-color", "blue");

parser.addArgument("url", null);
parser.addArgument("event-sources", [], undefined, true);
//parser.addArgument("add-url", null);

// pat-inject support for individual events
parser.addArgument("pat-inject-source", null);
parser.addArgument("pat-inject-target", null);

// pat-modal support for individual events
parser.addArgument("pat-modal-class", null);

// pat-tooltip support for individual events
parser.addArgument("pat-tooltip-source", null, ["ajax", null]);

// pat-switch support for individual events
parser.addArgument("pat-switch-selector", null);
parser.addArgument("pat-switch-remove", null);
parser.addArgument("pat-switch-add", null);

parser.addAlias("default-date", "initial-date");
parser.addAlias("default-view", "initial-view");

export default Base.extend({
    name: "calendar",
    trigger: ".pat-calendar",
    classMap: {
        month: ".view-month",
        agendaWeek: ".view-week",
        agendaDay: ".view-day",
    },
    viewMap: {
        month: "dayGridMonth",
        week: "timeGridWeek",
        day: "timeGridDay",
        list: "listMonth",
        basicWeek: "dayGridWeek",
        basicDay: "dayGridDay",
        agendaWeek: "timeGridWeek",
        agendaDay: "timeGridDay",
    },
    dayNames: ["su", "mo", "tu", "we", "th", "fr", "sa"],
    active_categories: null,
    parser: parser,

    async init() {
        this.options = store.updateOptions(this.el, parser.parse(this.el, this.options));

        const Calendar = (await import("@fullcalendar/core")).Calendar;
        const fcDayGrid = (await import("@fullcalendar/daygrid")).default;
        const fcInteraction = (await import("@fullcalendar/interaction")).default;
        const fcList = (await import("@fullcalendar/list")).default;
        const fcLuxon = (await import("@fullcalendar/luxon2")).default;
        const fcTimeGrid = (await import("@fullcalendar/timegrid")).default;

        // Save some UI elements for reuse.
        const calendar_controls = this.options.calendarControls
            ? document.querySelector(this.options.calendarControls)
            : this.el;
        this.el_jump_next = calendar_controls.querySelector(".jump-next");
        this.el_jump_prev = calendar_controls.querySelector(".jump-prev");
        this.el_jump_today = calendar_controls.querySelector(".jump-today");
        this.el_view_month = calendar_controls.querySelector(".view-month");
        this.el_view_week = calendar_controls.querySelector(".view-week");
        this.el_view_day = calendar_controls.querySelector(".view-day");
        this.el_view_list_year = calendar_controls.querySelector(".view-listYear");
        this.el_view_list_month = calendar_controls.querySelector(".view-listMonth");
        this.el_view_list_week = calendar_controls.querySelector(".view-listWeek");
        this.el_view_list_day = calendar_controls.querySelector(".view-listDay");
        this.el_timezone = calendar_controls.querySelector("select[name='timezone']");
        this.el_title =
            this.el.querySelector(".cal-title") ||
            calendar_controls.querySelector(".cal-title");

        const storage_prefix = `${this.name}-${window.location.pathname}`;
        this.storage =
            this.options.store === "none"
                ? null
                : store[this.options.store](storage_prefix);

        const query_string = new URLSearchParams(window.location.search);

        const config = {};
        config.headerToolbar = false;
        config.initialDate =
            query_string.get("date") ||
            this.storage?.get?.("date") ||
            this.options.initial.date;
        config.initialView =
            query_string.get("view") ||
            this.storage?.get?.("view") ||
            this.options.initial.view;
        config.initialView = this.viewMap[config.initialView] || config.initialView;
        config.editable = this.options.editable || false;
        config.plugins = [fcDayGrid, fcInteraction, fcList, fcLuxon, fcTimeGrid];
        config.eventColor = this.options.eventColor;

        let lang = this.options.lang || dom.acquire_attribute(this.el, "lang") || "en";
        // we don't support any country-specific language variants, always use first 2 letters
        lang = lang.substr(0, 2).toLowerCase();
        if (lang !== "en") {
            const locale = await import(`@fullcalendar/core/locales/${lang}.js`);
            config.locale = locale.default;
            log.debug(`Loaded locale for ${lang}`);
        }
        if (this.options.first.day !== null) {
            config.firstDay = this.options.first.day;
            if (this.dayNames.indexOf(this.options.first.day) >= 0) {
                // Set firstDay as string
                config.firstDay = this.dayNames.indexOf(this.options.first.day);
            }
        }

        let timezone = this.el_timezone?.value || this.options.timezone || null;
        if (timezone) {
            config.timeZone = timezone;
        }

        if (this.options.timeFormat == "12h") {
            // 12h format
            config.eventTimeFormat = {
                hour12: true,
                meridiem: "narrow",
                hour: "numeric",
            };
        } else {
            // 24h format
            config.eventTimeFormat = {
                hour12: false,
                meridiem: "false",
                hour: "numeric",
            };
        }

        const sources = [...(this.options.event.sources || [])];
        if (this.options.url && !sources.includes(this.options.url)) {
            // add, but do not re-add same source twice.
            sources.push(this.options.url);
        }
        config.eventSources = [];
        for (const [idx, url] of sources.entries()) {
            const src = this.create_event_source(idx, url);
            config.eventSources.push(src);
        }

        // Restore category controls from local storage before showing events.
        this._restoreCategoryControls();
        this._registerCategoryControls();
        this.reset_active_categories();
        config.eventDidMount = (args) => this.init_event(args);

        // Need to create a sub-element of ``pat-calendar`` to allow custom
        // controls within pat-calendar to not be overwritten.
        const cal_el = document.createElement("div");
        cal_el.setAttribute("class", "pat-calendar__fc");
        this.el.appendChild(cal_el);

        if (this.options.addUrl) {
            config.dateClick = this.addNewEvent.bind(this);
            // Create a element for modals/injections
            this.mod_el = document.createElement("section");
            this.mod_el.setAttribute("class", "pat-calendar__modal");
            this.el.appendChild(this.mod_el);
        }

        let calendar = (this.calendar = new Calendar(cal_el, config));
        calendar.render();

        calendar.on("datesSet", this._viewChanged.bind(this));
        calendar.on("dateClick", this._viewChanged.bind(this));

        if (this.el_title) {
            this.el_title.innerHTML = calendar.view.title;
        }

        this._registerCalendarControls();
        this.setActiveClasses();
    },

    create_event_source(idx, url) {
        return {
            id: `event-source--${idx + 1}`,
            events: (info, success, failure) =>
                this._fetch_events(url, info, success, failure),
            className: `event-source--${idx + 1}`,
        };
    },

    event_mapper(event) {
        // Maps backend results to the fullcalendar event schema.
        // Default implementation confirms to plone.restapi conventions.
        const ret = {
            id: event.UID,
            title: event.title,
            start: new Date(event.start),
            end: new Date(event.end),
            allDay: event.whole_day,
            url: event.url || event["@id"],

            backgroundColor: event.color,
            borderColor: event.color,
            classNames: event.class ? event.class.split(" ") : [],

            // non fullcalendar standard fields
            description: event.description,
            text: event.text,
            location: event.location,
            open_end: event.open_end,
            recurrence: event.recurrence,
            attendees: event.attendees,
            contact_name: event.contact_name,
            contact_phone: event.contact_phone,
            contact_email: event.contact_email,
            event_url: event.event_url,
        };
        for (const prop in ret) {
            if (!ret[prop]) {
                delete ret[prop];
            }
        }
        return ret;
    },

    update_event(event, data) {
        // Updated an existing event with new event properties.
        event.setDates(data.start, data.end);
        event.setAllDay(data.allDay);
        event.setProp("id", data.id);
        event.setProp("title", data.title);
        event.setProp("url", data.url);

        event.setProp("backgroundColor", data.color);
        event.setProp("borderColor", data.color);

        event.setExtendedProp("description", data.description);
        event.setExtendedProp("text", data.text);
        event.setExtendedProp("location", data.location);
        event.setExtendedProp("open_end", data.open_end);
        event.setExtendedProp("recurrence", data.recurrence);
        event.setExtendedProp("attendees", data.attendees);
        event.setExtendedProp("contact_name", data.contact_name);
        event.setExtendedProp("contact_phone", data.contact_phone);
        event.setExtendedProp("contact_email", data.contact_email);
        event.setExtendedProp("event_url", data.event_url);
    },

    async _fetch_events(url, info, success, failure) {
        let results = [];
        while (url) {
            url = url
                .replace("${start_str}", info.startStr.split("T")[0])
                .replace("${end_str}", info.endStr.split("T")[0]);

            let response;
            try {
                response = await fetch(url, {
                    method: "GET",
                    mode: "cors",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                    },
                });
            } catch (e) {
                failure(e);
                return;
            }
            let result = await response.json();
            let results_ = result.items?.map(this.event_mapper) || [];
            results = results.concat(results_);

            // resolve all ``next`` batching urls
            url = result.batching?.next || null;
        }

        success(results);
    },

    init_event(args) {
        this.filter_event(args.event);

        let do_scan = false;

        // pat-inject support
        const source = this.options.pat["inject-source"];
        const target = this.options.pat["inject-target"];
        if (args.event.url && (source || target)) {
            // Only set pat-inject if event has a url
            args.el.classList.add("pat-inject");
            args.el.setAttribute(
                "data-pat-inject",
                `target: ${target || "body"}; source: ${source || "body"}`
            );
            do_scan = true;
        }

        // pat-modal support
        if (args.event.url && this.options.pat["modal-class"]) {
            // Only set pat-modal if event has a url
            args.el.classList.add("pat-modal");
            args.el.setAttribute(
                "data-pat-modal",
                `class: ${this.options.pat["modal-class"]}`
            );
            do_scan = true;
        }

        // pat-tooltip support
        if (args.event.url && this.options.pat["tooltip-source"] === "ajax") {
            // Only set pat-tooltip if event has a url
            args.el.classList.add("pat-tooltip");
            args.el.setAttribute("data-pat-tooltip", "source: ajax");
            do_scan = true;
        }

        // pat-switch support
        const switch_sel = this.options.pat["switch-selector"];
        if (switch_sel) {
            const switch_add = this.options.pat["switch-add"];
            const switch_rm = this.options.pat["switch-remove"];

            args.el.classList.add("pat-switch");
            args.el.setAttribute(
                "data-pat-switch",
                `selector: ${switch_sel}${switch_add ? "; add: " + switch_add : ""}${
                    switch_rm ? "; remove: " + switch_rm : ""
                }`
            );
            do_scan = true;
        }

        if (do_scan) {
            registry.scan(args.el);
        }
    },

    filter_event(event) {
        let show = true;
        if (this.active_categories !== null) {
            // intersection
            show =
                this.active_categories.filter((it) => event.classNames.includes(it))
                    .length > 0;
        }
        if (show) {
            event.setProp("display", "auto");
        } else {
            event.setProp("display", "none");
        }
    },

    reset_active_categories() {
        const ctrls = this.get_category_controls();
        this.active_categories = null;
        if (ctrls.length) {
            this.active_categories = ctrls.filter((el) => el.checked).map((el) => el.id);
        }
        this.storage && this.storage.set("active_categories", this.active_categories);
    },

    get_category_controls() {
        const ctrl_containers = this.options.categoryControls
            ? document.querySelectorAll(this.options.categoryControls)
            : [this.el];
        const ctrls = [];
        for (const it of ctrl_containers) {
            const inp = it.querySelectorAll("input[type=checkbox]");
            ctrls.push(...inp);
        }
        return [...new Set(ctrls)]; // do not return the same inputs multiple times
    },

    _registerCategoryControls() {
        /* The "category controls" are checkboxes that cause different
         * types of events to be shown or hidden.
         */
        let timer;
        for (const ctrl of this.get_category_controls()) {
            ctrl.addEventListener("change", () => {
                clearTimeout(timer); // Cancel scheduled filter runs
                timer = setTimeout(() => {
                    this.reset_active_categories();
                    this.calendar.getEvents().map(this.filter_event.bind(this));
                }, 50);
            });
        }
    },

    _restoreCategoryControls() {
        /* Restore values of the category controls as stored in store.
         * NOTE: run BEFORE _registerCalendarControls
         */
        const ctrls = this.get_category_controls();
        const active_categories =
            (this.storage && this.storage.get("active_categories")) || null;

        if (!ctrls.length || active_categories === null) {
            // No category controls or never set, use default un/checked status.
            return;
        }

        for (const ctrl of ctrls) {
            if (ctrl.hidden) {
                // Do not set non-user-interactable inputs.
                // They are programmatically set.
                continue;
            }
            if (active_categories.includes(ctrl.id)) {
                ctrl.checked = true;
            } else {
                ctrl.checked = false;
            }
            ctrl.dispatchEvent(new Event("change", { bubbles: true, cancelable: true }));
        }
    },

    _registerCalendarControls() {
        this.el_jump_next?.addEventListener("click", (event) => {
            event.preventDefault();
            this.calendar.next();
        });

        this.el_jump_prev?.addEventListener("click", (event) => {
            event.preventDefault();
            this.calendar.prev();
        });

        this.el_jump_today?.addEventListener("click", (event) => {
            event.preventDefault();
            this.calendar.today();
        });

        this.el_view_month?.addEventListener("click", (event) => {
            event.preventDefault();
            this.calendar.changeView("dayGridMonth");
        });

        this.el_view_week?.addEventListener("click", (event) => {
            event.preventDefault();
            this.calendar.changeView("timeGridWeek");
        });

        this.el_view_day?.addEventListener("click", (event) => {
            event.preventDefault();
            this.calendar.changeView("timeGridDay");
        });

        this.el_view_list_year?.addEventListener("click", (event) => {
            event.preventDefault();
            this.calendar.changeView("listYear");
        });

        this.el_view_list_month?.addEventListener("click", (event) => {
            event.preventDefault();
            this.calendar.changeView("listMonth");
        });

        this.el_view_list_week?.addEventListener("click", (event) => {
            event.preventDefault();
            this.calendar.changeView("listWeek");
        });

        this.el_view_list_day?.addEventListener("click", (event) => {
            event.preventDefault();
            this.calendar.changeView("listDay");
        });

        this.el_timezone?.addEventListener("change", (event) => {
            event.preventDefault();
            this.calendar.setOption("timeZone", event.target.value);
        });
    },

    setActiveClasses() {
        // Set active classes of UI elements.

        this.el_jump_today?.classList.remove("active");
        this.el_view_month?.classList.remove("active");
        this.el_view_week?.classList.remove("active");
        this.el_view_day?.classList.remove("active");
        this.el_view_list_year?.classList.remove("active");
        this.el_view_list_month?.classList.remove("active");
        this.el_view_list_week?.classList.remove("active");
        this.el_view_list_day?.classList.remove("active");

        const cdate = this.calendar.currentData.currentDate;
        const today = new Date();
        if (
            cdate.getYear() === today.getYear() &&
            cdate.getMonth() === today.getMonth() &&
            cdate.getDate() === today.getDate()
        ) {
            this.el_jump_today?.classList.add("active");
        }

        switch (this.calendar.view.type) {
            case "dayGridMonth":
                this.el_view_month?.classList.add("active");
                break;
            case "timeGridWeek":
                this.el_view_week?.classList.add("active");
                break;
            case "timeGridDay":
                this.el_view_day?.classList.add("active");
                break;
            case "listYear":
                this.el_view_list_year?.classList.add("active");
                break;
            case "listMonth":
                this.el_view_list_month?.classList.add("active");
                break;
            case "listWeek":
                this.el_view_list_week?.classList.add("active");
                break;
            case "listDay":
                this.el_view_list_day?.classList.add("active");
                break;
        }
    },

    _viewChanged(data) {
        // Set title
        if (this.el_title) {
            this.el_title.innerHTML = data.view.title;
        }
        // store current date and view
        const date = data.view.currentStart.toISOString();
        const view = data.view.type;
        this.storage && this.storage.set("date", date);
        this.storage && this.storage.set("view", view);

        const query = new URLSearchParams(window.location.search);
        query.set("date", date);
        query.set("view", view);
        history.replaceState(null, null, "?" + query.toString());

        this.setActiveClasses();
    },

    async addNewEvent(info) {
        let addUrl = this.options.addUrl;
        if (!addUrl) {
            return;
        }

        let start, end, allDay;
        if (this.calendar.view.type === "timeGridMonth") {
            start = info.date;
            end = info.date;
            allDay = true;
        } else {
            start = info.date;
            end = new Date(start.getTime() + 1 * 60 * 60 * 1000); // same as start, 1h offset
            allDay = false;
        }
        addUrl = addUrl
            .replace("${start_str}", start)
            .replace("${end_str}", end)
            .replace("${all_day}", allDay ? "1" : "0");

        const event = this.calendar.addEvent(
            {
                title: "New Event",
                start: start,
                end: end,
            },
            true
        );

        await new Modal(this.mod_el, {
            url: addUrl,
            trigger: "autoload",
        });

        //const mod_el = document.querySelector("#pat-modal form");
        //mod_el.addEventListener("submit", (e) => {
        document.addEventListener("submit", async (e) => {
            const form = e.target;
            const form_data = new FormData(form);
            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: form_data,
                });
                let data = await response.json();
                data = this.event_mapper(data);
                this.update_event(event, data);
            } catch (error) {
                log.error(error);
                event.remove();
            }
        });
    },
});
