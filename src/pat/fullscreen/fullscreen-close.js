import Base from "../../core/base";
import screenful from "screenfull";

export default Base.extend({
    name: "fullscreen-close",
    trigger: ".close-fullscreen",
    init: function ($el, opts) {
        this.$el[0].addEventListener("click", function () {
            // no prevent-default nor stop propagation to let
            // the button also do other stuff.
            screenful.exit();
        });
    },
});
