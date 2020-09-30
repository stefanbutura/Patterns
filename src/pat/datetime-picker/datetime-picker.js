/* pat-datetime-picker  - Polyfill for input type=datetime-local */
import "regenerator-runtime/runtime"; // needed for ``await`` support
import $ from "jquery";
import Parser from "../../core/parser";
import DatePicker from "../date-picker/date-picker";

// Lazy loading modules.
let Moment;

var parser = new Parser("datetime-picker");
parser.addArgument("behavior", "styled", ["native", "styled"]);
parser.addArgument("format", "YYYY-MM-DD");
parser.addArgument("week-numbers", [], ["show", "hide"]);
parser.addArgument("i18n"); // URL pointing to JSON resource with i18n values
parser.addArgument("today", "Today");
parser.addArgument("clear", "Clear");
parser.addArgument("first-day", 0);

export default DatePicker.extend({
    name: "datetime-picker",
    trigger: ".pat-datetime-picker",
    async init() {
        Moment = await import("moment");
        Moment = Moment.default;

        this.options = $.extend(parser.parse(this.$el), this.options);
        var value = this.$el.val().split("T"),
            date_value = value[0] || "",
            time_value = value[1] || "";

        this.$el.hide();

        this.$wrapper = $('<div class="datetime-picker-wrapper"/>');

        var date_options = {
            behavior: this.options.behavior,
            format: this.options.format,
            weekNumbers: this.options.weekNumbers,
            firstDay: this.options.firstDay,
        };

        this.$date = $(
            '<input class="date" type="date" placeholder="YYYY-MM-DD"/>'
        )
            .attr("value", date_value)
            .patternDatePicker(date_options)
            .on(
                "change",
                function () {
                    if (!this.$time.val()) {
                        // Set time on date change, if time was empty.
                        this.$time.val(this.isotime());
                    }
                    this.update();
                }.bind(this)
            )
            .appendTo(this.$wrapper);

        this.$time = $('<input class="time" type="time" placeholder="hh:mm"/>')
            .attr("value", time_value)
            .on("change", this.update.bind(this))
            .appendTo(this.$wrapper);

        if (this.options.today) {
            // let the buttons be of type button otherwise they are submit buttons
            this.$now = $(
                '<button type="button" class="now" title="' +
                    this.options.today +
                    '"><span class="glyphicon glyphicon-time"/>' +
                    this.options.today +
                    "</button>"
            )
                .on(
                    "click",
                    function (e) {
                        e.preventDefault();
                        this.$date.val(this.isodate());
                        this.$time.val(this.isotime());
                        this.update();
                    }.bind(this)
                )
                .appendTo(this.$wrapper);
        }

        if (this.options.clear) {
            this.$clear = $(
                '<button type="button" class="clear" title="' +
                    this.options.clear +
                    '"><span class="glyphicon glyphicon-trash"/>' +
                    this.options.clear +
                    "</button>"
            )
                .addClass(this.options.classClearName)
                .on(
                    "click",
                    function (e) {
                        e.preventDefault();
                        this.$date.val("");
                        this.$time.val("");
                        this.update();
                    }.bind(this)
                )
                .appendTo(this.$wrapper);
        }

        // TODO: timezone

        this.$wrapper.insertAfter(this.$el);
    },

    update() {
        if (this.$date.val() && this.$time.val()) {
            var date = Moment(this.$date.val()).format(this.options.format);
            this.$el.val(date + "T" + this.$time.val());
        } else {
            this.$el.val("");
        }
        this.$el.trigger("change");
    },

    isotime() {
        var now = new Date();
        return now.toTimeString().substr(0, 5);
    },
});
