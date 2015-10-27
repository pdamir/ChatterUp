ChatterUp.controller('chatController', function ($scope, $http, fakeUsers, $timeout) {


    /** Initialize PubNub connection with my account keys **/

    PUBNUB = PUBNUB.init({
        publish_key: 'pub-c-fe025501-52fa-4374-9ffe-07bd829735d4',
        subscribe_key: 'sub-c-adece190-7979-11e5-a4dc-0619f8945a4f',
    });


    /** Configurable variables **/
    $scope.usedChannel = "public_chat";
    $scope.messagesLimit = 100;

    var i = Math.floor(Math.random() * 1000);
    $scope.defaultUsername = "Guest" + i; //generate random username

    $scope.defaultAvatar = '/img/avatar1.png';
    $scope.presence = 0;
    $scope.online = [];
    $scope.alert = false;

    $scope.usernameList = [];

    /** Static variables **/
    $scope.loggedIn = false;
    $scope.errorMsg;
    $scope.connectionState = 0;

    /** Function to hide connection status alert if wanted **/
    $scope.hideMe = function () {
        $scope.alert = true;
    };

    /** Array containing avatar path and value so they can be loaded on landing screen **/

    $scope.allAvatars = [
        {
            val: 1,
            path: '/img/avatar1.png'
        },
        {
            val: 2,
            path: '/img/avatar2.png'
        },
        {
            val: 3,
            path: '/img/avatar3.png'
        },
        {
            val: 4,
            path: '/img/avatar4.png'
        },
        {
            val: 5,
            path: '/img/avatar5.png'
        },
        {
            val: 6,
            path: '/img/avatar6.png'
        },
        {
            val: 7,
            path: '/img/avatar7.png'
        }
    ];


    /** Reset message **/

    $scope.resetMessage = function () {
        $scope.message = {
            username: $scope.defaultUsername,
            text: '',
            avatar: $scope.defaultAvatar


        };
    };
    $scope.resetMessage();

    /** Get data from fakeUsers service, and pass it to fakeUsers variable **/

    fakeUsers.success(function (data) {
        $scope.fakeUsers = data;
    });

    /** Function which takes current date, and returns yesterdays date
     in order to show it in messages from fake users (like they wrote them yesterday) **/

    $scope.yesterdayDate = function () {
        var date = new Date();
        var yesterday = new Date(date.getTime());
        yesterday.setDate(date.getDate() - 1);
        return yesterday;
    };

    /** Function which loads existing chat logs from PubNub **/

    $scope.chatLogs = function () {
        PUBNUB.history({
            channel: $scope.usedChannel,
            limit: $scope.messagesLimit,
            count: 10
        }, function (messages) {
            //show messages
            $scope.$apply(function () {
                $scope.chatMessages = messages.reverse();
            });
        });
    };

    /** Add class to <li> element depending on whether it is user or someone else **/

    $scope.liClass = function (chat) {

        if (chat.username == $scope.message.username && typeof chat.username !== 'undefined') {
            return 'left clearfix';
        }
        else if (chat.username != $scope.message.username && typeof chat.username !== 'undefined') {
            return 'right clearfix';
        }
    };

    /** Function written in order to place appropriate directive inside existing <li> element**/

    $scope.leftRight = function (chat, rl) {
        if (rl == 'left' && chat.username == $scope.message.username && chat.username != '' && typeof chat.username !== 'undefined') {
            return true;
        }
        else if (rl == 'right' && chat.username != $scope.message.username && chat.username != '' && typeof chat.username != 'undefined') {
            return true;
        }

        return false;
    };

    /** Because empty message rows were displayed while retrieving history from PubNub
     this function was added so they wouldn't be shown in chatbox **/

    $scope.showItem = function (chat) {
        if (typeof chat.username !== 'undefined') {
            return true;
        }

        return false;
    };

    /** Login function **/

    $scope.tryLogin = function () {
        $scope.errorMsg = "";

        //if username is not entered, display error
        if (!$scope.message.username) {
            $scope.errorMsg = "Username is required.";
            $timeout(function () {
                $scope.errorMsg = false;
            }, 2000);
            return;
        }
        //if connection is not established, display error
        if (!$scope.connectionState) {
            $scope.errorMsg = "You are disconnected from PubNub.";
            $timeout(function () {
                $scope.errorMsg = false;
            }, 2000);
            return;
        }

        $scope.loggedIn = true;

    };

    /**Logout function**/

    $scope.tryLogout = function () {
        $scope.resetMessage();
        $scope.loggedIn = false;
    };

    /** If user enters something inside message input after empty message error
     appears, error will disappear**/

    $scope.$watch('message.text', function (newVal, oldVal) {
        if (newVal !== "")
            $scope.errorMsg = "";

    }, true);

    /** Function to send a message. User has to be logged in  **/

    $scope.sendMessage = function () {

        //display error if user is not logged in
        if (!$scope.loggedIn) {
            $scope.errorMsg = "Please login first";
            $timeout(function () {
                $scope.errorMsg = false;
            }, 2000);
            return;
        }

        //display error if there is no message input
        if (!$scope.message.text) {
            $scope.errorMsg = "You must enter a message.";
            $timeout(function () {
                $scope.errorMsg = false;
            }, 2000);

            return;
        }

        //set the message date
        msgDate = new Date();

        $scope.message.date = new Date(msgDate.getTime());
        $scope.message.date.setDate(msgDate.getDate());
        $scope.message.time = msgDate.toLocaleTimeString();


        PUBNUB.publish({
            channel: $scope.usedChannel,
            message: $scope.message

        });

        $scope.message.text = "";
    };

    /** Connect and subscribe to PubNub channel **/

    PUBNUB.subscribe({
        channel: $scope.usedChannel,
        restore: false,
        callback: function (message) {
            //update messages with the new message
            $scope.$apply(function () {
                $scope.chatMessages.unshift(message);

            });
        },

        error: function (data) {
            $scope.errorMsg = data;
        },

        disconnect: function () {
            $scope.$apply(function () {
                $scope.connectionState = 0;
            });
        },

        reconnect: function () {
            $scope.$apply(function () {
                $scope.connectionState = 1;
            });
        },

        connect: function () {
            $scope.$apply(function () {
                $scope.connectionState = 2;
                //load the chat logs
                $scope.chatLogs();
            });
        }

    });

    /** PubNub call to get number of users connected, their uuids, etc.**/
    PUBNUB.here_now({
        channel: $scope.usedChannel,
        callback: function (m) {
            $scope.presence = m.occupancy
        }

    });

});