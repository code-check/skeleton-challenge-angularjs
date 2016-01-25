var reporter = function () {
    // This will contain all collected information about the test results
    this.suites = {};

    // Temp value holders
    var failures, passes;

    // Called from Jasmine when a suite is finished
    this.suiteStarted = function (result) {
        failures = 0;
        passes = 0;
    };

    // Called from Jasmine when a suite is done
    this.suiteDone = function (result) {
        this.suites[result.description] = {
            failures: failures,
            passes: passes,
            getTotal: function () {
                return this.passes + this.failures;
            }
        };
    };

    // Called from Jasmine when a spec is done
    this.specDone = function (result) {
        if (result.status == "passed")
            passes++;
        else
            failures++;
    };
};

module.exports = reporter;