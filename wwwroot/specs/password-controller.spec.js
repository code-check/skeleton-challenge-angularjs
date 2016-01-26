describe("PasswordController.$scope.grade", function () {
    beforeEach(module("app"));

    var $controller;

    beforeEach(inject(function (_$controller_) {
        $controller = _$controller_;
    }));

    it("sets strength weak <= 3 length", function () {
        var $scope = {};
        var controller = $controller("PasswordController", { $scope: $scope });
        for (var i = 1; i <= 3; i++) {
            $scope.password += '-';
            $scope.grade();
            expect($scope.strength).toEqual("weak");
        }
    });

    it("sets strength medium > 3 & <= 8", function () {
        var $scope = {};
        var controller = $controller("PasswordController", { $scope: $scope });
        $scope.password = "123";
        while ($scope.password.length < 8) {
            $scope.password += '-';
            $scope.grade();
            expect($scope.strength).toEqual("medium");
        }
    });

    it("sets strength strong > 8", function () {
        var $scope = {};
        var controller = $controller("PasswordController", { $scope: $scope });
        $scope.password = "123456789";
        $scope.grade();
        expect($scope.strength).toEqual("strong");
    });
});