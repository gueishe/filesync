'use strict';
angular
  .module('FileSync')
  .controller('SocialCtrl', ['$scope', 'SocketIOService', function($scope, SocketIOService) {
    this.viewers = [];
    this.messages = [];
    this.message = '';
    var bannedWord = ["","*"," "];


    function onViewersUpdated(viewers) {
      this.viewers = viewers;
      $scope.$apply();
    }

    function onMessagesUpdated(messages) {
      this.messages = messages;
      $scope.$apply();
      /* Use a directive
      var $cont = document.getElementById("chat");
      $cont.scrollTop = $cont.scrollHeight;
      */
    }

    function addBannedWord(word) {
        this.bannedWord.push(word);
    }

    function isMsgOk(message) {
        return bannedWord.filter((word) => word === message ).length === 0;
    }

    this.sendMessage = function() {
        if( isMsgOk(this.message) ){
            SocketIOService.sendMessage(this.message);
            this.message = "";
        } else {
            console.log("Mot interdit !" + bannedWord);
        }
    }

    SocketIOService.onViewersUpdated(onViewersUpdated.bind(this));
    SocketIOService.onMessagesUpdated(onMessagesUpdated.bind(this));
  }]);
