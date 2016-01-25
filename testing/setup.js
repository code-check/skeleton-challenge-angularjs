var jsdom = require("jsdom"),
    fs = require("fs"),
    reporter = require("./reporter.js"),
    scripts = [
        "jasmine/jasmine.js", // Should ALWAY be the first script
    ]; // This array should include source first, then specs.

before(function (done) {
    // Create the jsdom instance
    jsdom.env({
        html: '',
        resourceLoader: function (resource, callback) {
            // Grab files from the web
            if (resource.url.pathname.startsWith("http"))
                return resource.defaultFetch(callback);

            // Grab files locally
            return callback(null,
                fs.readFileSync("./wwwroot/" + resource.url.pathname, "utf-8"));
        },
        features: {},
        done: function (errors, window) {
            global.window = window;
            boot(done);
        }
    });
});

function boot(done) {
    var tasks = [];

    // Fill task buffer
    for (var i = 0; i < scripts.length; i++) {
        tasks.push({
            script: scripts[i],
            execute: function () {
                var script = window.document.createElement("script");
                script.src = this.script;
                script.index = tasks.indexOf(this);
                script.onload = function () {
                    // Execute next task
                    tasks[this.index + 1].execute();
                };
                window.document.body.appendChild(script);
            }
        });

        if (i == 0)
            tasks.push({
                execute: function () {
                    // Create Jasmine instance
                    createJasmine();
                    // Execute next task
                    tasks[tasks.indexOf(this) + 1].execute();
                }
            });
    }
    // Push the final task
    tasks.push({
        execute: done
    });

    // Trigger the first task in the tree
    tasks[0].execute();
}

function createJasmine() {
    var jasmineRequire = global.window.jasmineRequire,
        jasmine = jasmineRequire.core(jasmineRequire);
    
    global.jasmine = {
        core: jasmine,
        env: jasmine.getEnv(),
        reporter: new reporter()
    };

    global.jasmine.env.addReporter(global.jasmine.reporter);
    extend(global.window,
        jasmineRequire.interface(jasmine, global.jasmine.env));
}

function extend(destination, source) {
    for (var property in source) destination[property] = source[property];
    return destination;
}