var assert = require("chai").assert;

describe("PasswordController.$scope", function () {
    var $rootScope, $controller;

    beforeEach(function () {
        global.window.module("app");
        global.window.inject(function ($injector) {
            $controller = $injector.get("$controller");
            $rootScope = $injector.get("$rootScope");
        });
    });

    it("sets strength weak <= 3 length", function () {
        var $scope = {};
        var controller = $controller("PasswordController", { $scope: $scope });
        for (var i = 1; i <= 3; i++) {
            $scope.password += '-';
            $scope.grade();
            assert.equal($scope.strength, "weak");
        }
    });

    it("sets strength medium > 3 & <= 8", function () {
        var $scope = {};
        var controller = $controller("PasswordController", { $scope: $scope });
        $scope.password = "123";
        while ($scope.password.length < 8) {
            $scope.password += '-';
            $scope.grade();
            assert.equal($scope.strength, "medium");
        }
    });

    it("sets strength strong > 8", function () {
        var $scope = {};
        var controller = $controller("PasswordController", { $scope: $scope });
        $scope.password = "123456789";
        $scope.grade();
        assert.equal($scope.strength, "strong");
    });
});