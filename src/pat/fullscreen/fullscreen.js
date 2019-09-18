define([
    "pat-base",
    "pat-logger",
    "screenful"
], function(Base, logging, screenful) {
    var log = logging.getLogger("fullscreen");

    return Base.extend({
        name: "fullscreen",
        trigger: ".pat-fullscreen",

        init: function() {
            var el = this.$el[0];
            el.addEventListener('click', function (e) {
                e.preventDefault();
                // querying the fullscreen element fs_el and inside the event
                // handler instead of outside allows for dynamic injecting
                // fullscreen elements even after pattern initialization.
                var fs_el = document.querySelector(el.getAttribute('href'));
                if (fs_el) {
                    // setting up the exit button
                    var exit_el = document.createElement('a');
                    exit_el.className = 'fullscreen-exit';
                    exit_el.appendChild(document.createTextNode('Exit fullscreen'));
                    exit_el.addEventListener('click', function (e) {
                        e.preventDefault();
                        screenful.exit();
                        fs_el.removeChild(exit_el);
                    });
                    // setting page to fullscreen
                    screenful.request(fs_el);
                    fs_el.appendChild(exit_el);

                } else {
                    log.error('No fullscreen element found.');
                }
            });
        }
    });
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
