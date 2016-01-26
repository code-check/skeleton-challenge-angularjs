var assert = require("chai").assert;

function assertSpecs(name, expected) {
    var suites = global.jasmine.reporter.suites;
    assert.property(suites, name);
    assert.equal(suites[name].getTotal(), expected, "Expected " + expected + " specs");
}

function assertNoFailures(name) {
    var suites = global.jasmine.reporter.suites;
    assert.property(suites, name);
    assert.equal(suites[name].failures, 0, "The '" + name + "' spec failed");
}

describe("PasswordController.$scope.grade", function () {
    var suite = this;

    it("has enough specs", function () {
        assertSpecs(suite.title, 3);
    });

    it("has no failures", function () {
        assertNoFailures(suite.title);
    });
});