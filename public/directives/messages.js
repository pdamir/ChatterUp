
ChatterUp.directive('messageLeft', function() {
    return {
        restrict: 'E',
        scope: {
            msg: '='
        },
        templateUrl: 'directives/messageLeft.html'
    };
});

ChatterUp.directive('messageRight', function() {
    return {
        restrict: 'E',
        scope: {
            msg: '='
        },
        templateUrl: 'directives/messageRight.html'
    };
});

ChatterUp.directive('notification', function($timeout){
    return {
        restrict: 'E',
        replace: true,
        scope: {
            error: '='
        },
        template: '<div class="alert alert-danger"><b>Error:</b>{{error}}</div>'
    }
});
