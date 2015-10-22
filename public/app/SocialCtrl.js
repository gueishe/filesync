'use strict';
angular
  .module('FileSync')
  .controller('SocialCtrl', ['$scope', 'SocketIOService', function($scope, SocketIOService) {
    this.viewers = [];
    this.messages = [];
    this.message = '';
    this.color = '#6BACF6';
    this.colors = ['RED','BLUE','BLACK','PURPLE','#6BACF6','#346398','#983455','#44AC34'];
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

    function showColor(color) {
      console.log(color);
    }

    this.updateColor = function() {
      SocketIOService.updateColor(this.color);
      this.color = "BLUE";
    }

    SocketIOService.onViewersUpdated(onViewersUpdated.bind(this));
    SocketIOService.onMessagesUpdated(onMessagesUpdated.bind(this));
  }]);
