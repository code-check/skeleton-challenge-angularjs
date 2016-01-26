var jsdom = require("jsdom"),
    fs = require("fs"),
    reporter = require("./reporter.js"),
    jasmineSrc = "jasmine/jasmine.js",
    scripts = [
        "https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular.min.js",
        "https://code.angularjs.org/1.3.15/angular-mocks.js",
        // Sources
        "app.js",
        // Specs
        "specs/password-controller.spec.js"
    ]; // This array should include source first, then specs.

before(function (done) {
    // Create the jsdom instance
    jsdom.env({
        html: '',
        resourceLoader: function (resource, callback) {
            // Grab files from the web
            if (resource.url.href.startsWith("http"))
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

    // Push Jasmine script as task
    tasks.push({
        execute: function () {
            var script = window.document.createElement("script");
            script.src = jasmineSrc;
            script.index = tasks.indexOf(this);
            script.onload = function () {
                // Create Jasmine instance
                createJasmine();
                // Execute next task
                tasks[this.index + 1].execute();
            };
            window.document.body.appendChild(script);
        }
    });

    // Fill task buffer with the scripts
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
    }
    // Push the done trigger
    tasks.push({
        execute: function () {
            global.jasmine.env.execute();
            done();
        }
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