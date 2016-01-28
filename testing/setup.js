var
    assert = require("chai").assert,
    jsdom = require("jsdom"),
    fs = require("fs");

before(function (done) {
    this.timeout(1e4); // 10s
    jsdom.env({
        html: "",
        scripts: [
            "https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.4.9/angular.min.js",
            "https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.4.9/angular-mocks.js",
            "app.js"
        ],
        resourceLoader: function (resource, callback) {
            // Grab files from the web
            if (resource.url.href.startsWith("http"))
                return resource.defaultFetch(callback);

            // Grab files locally
            return callback(null,
                fs.readFileSync("./wwwroot/" + resource.url.pathname, "utf-8"));
        },
        features: {
            FetchExternalResources: ["script"],
            ProcessExternalResources: ["script"]
        },
        created: function (errors, window) {
            // Polyfills
            window.console.log = console.log;
            window.addEventListener("error", function (event) {
                console.error("script error:", event.error);
            });
            window.mocha = true;
            window.beforeEach = beforeEach;
            window.afterEach = afterEach;
        },
        done: function (errors, window) {
            global.window = window;
            done();
        }
    });
});