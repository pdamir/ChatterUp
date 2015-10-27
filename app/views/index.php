<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title></title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/bootstrap.min.css" type="text/css" media="screen">
    <link rel="stylesheet" href="css/style.css" type="text/css" media="screen">
    <link rel="stylesheet" href="css/bootstrap-responsive.min.css" type="text/css" media="screen">
    <script src="js/modernizr-2.6.2.min.js"></script>
    <script src="js/angular.min.js"></script>
    <script src="http://code.jquery.com/jquery-1.9.1.js"></script>
    <script src="http://cdn.pubnub.com/pubnub-3.7.15.min.js"></script>
    <script src="angular-chat.js"></script>
    <script src="js/directives/messages.js"></script>
    <script src="js/services/fakeUsers.js"></script>
    <link rel="stylesheet" href="style.css" rel="stylesheet">
    <link href="css/bootstrap.min.css" rel="stylesheet">
</head>
<body ng-app="ChatterUp">
<div class="container-fluid" ng-controller="chatController">
    <div class="chatterContainer" ng-include="'chatHeader.html'"></div>
    <div ng-Show="!loggedIn" id="login">
        <h3>Enter an alias</h3>
        <label>
            <input type="text" ng-model="message.username" />
        </label>
        <div class="row avatars">
            <label>Choose an avatar:</label>
        <label ng-repeat="singleAvatar in allAvatars">
            <input type="radio" name="avatarPic" value="{{singleAvatar.path}}" ng-model="message.avatar">
            <img ng-src="{{singleAvatar.path}}" height="48" width="48">

        </label>
        </div><br>


      <span ng-click="attemptLogin()">
         <input class="btn btn-primary" type="submit" value="Proceed to chat">
      </span>
    </div>

    <div class="container" ng-Show="loggedIn" id="chat">
        <div class="row">
            <div class="col-md-offset-3 col-md-6">
                <div class="panel panel-primary">
                    <div class="panel-heading">
                        Chat
                        <div class="btn-group pull-right">
                        There are currently {{presence}} users online.
                        </div>
                    </div>
                    <div class="panel-body">

                        <ul class="chat" ng-repeat="chat in chatMessages">
                            <div  ng-if="chat.username === message.username && chat.username!=''">
                                <message-left msg="chat"></message-left>
                            </div>

                            <div ng-if="chat.username !== message.username && chat.username!=''">
                                <message-right msg="chat"></message-right>
                            </div>


                        </ul>

                        <!-- HERE I HAVE CREATED UL TO IMITATE PAST MESSAGES FROM FAKE USERS;
                        FOR EXAMPLE, THEY HAVE WRITTEN THEIR EMAILS -->
                        <ul class="chat" ng-repeat="fake in fakeUsers">
                            <li class="right clearfix">
                                <span class="chat-img pull-right">
                                    <img ng-src="{{defaultAvatar}}" alt="User Avatar" class="img-circle" height="48" width="48"  />
                                </span>
                                <div class="chat-body clearfix">
                                    <div class="header">
                                        <small class=" text-muted"><span>nesto - </span>nesto</small>
                                        <strong class="pull-right primary-font">{{fake.name}}</strong>
                                    </div>
                                    <p class="pull-right">
                                        {{fake.email}}
                                    </p>
                                </div>
                            </li>
                        </ul>


                    </div>
                    <div class="panel-footer">

                        <form class="" ng-Show="loggedIn" ui-keypress="{13:'postMessage()'}">
                            <div class="input-group">
                                    <input id="btn-input" type="text" class="form-control input-sm" placeholder="Type your message here..." ng-model="message.text" />
                                <span class="input-group-btn" ng-click="postMessage()">
                                    <input class="btn btn-warning btn-sm" type="submit" id="btn-chat" value="Send">
                                </span>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

</div>



</body>
</html>