'use strict';
angular
  .module('FileSync')
  .controller('SocialCtrl', ['$scope', 'SocketIOService', function($scope, SocketIOService) {
    this.viewers = [];
    this.messages = [];
    this.message = '';
    this.viewer = '';

    function onViewersUpdated(viewers) {
      this.viewers = viewers;
      $scope.$apply();
    }

    function onMessagesUpdated(messages) {
      this.messages = messages;
      $scope.$apply();
      var $cont = document.getElementById("chat");
      $cont.scrollTop = $cont.scrollHeight;
    }

    this.sendMessage = function() {
      SocketIOService.sendMessage(this.message);
    }

    SocketIOService.onViewersUpdated(onViewersUpdated.bind(this));
    SocketIOService.onMessagesUpdated(onMessagesUpdated.bind(this));
  }]);
