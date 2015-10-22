var buttonClick = document.querySelector("#btnHide"),
        buttonInputColor = document.querySelector("#controlInputColor"),
            chat = document.querySelector("#chat");

buttonClick.addEventListener("click", function () {
    var history = document.querySelector("#history");
    if( buttonClick.id === "btnHide" ) {
        hide(buttonClick, chat, history);
    } else if ( buttonClick.id === "btnShow" ) {
        show(buttonClick, chat, history);
    } else {
        console.log("Erreur dans le toggle du chat.");
    }
}, false);


buttonInputColor.addEventListener("click", function () {
  $(buttonInputColor).toggleClass("active")
  var containerColor = document.querySelector("#containerColor");
  $(containerColor).toggleClass("hidden");
}, false);

function hide(button, content, content2) {
    if( content.className.indexOf("hidden") === -1 ) {
        content.className += " hidden";
        content2.className = content2.className.replace("col-xs-9", "col-xs-12");
        button.id = "btnShow";
        console.log(button);
        button.innerHTML = "Show Chat";
    }
}

function show(button, content, content2) {
    if( content.className.indexOf("hidden") !== -1 ) {
        content.className = content.className.replace(" hidden","");
        content2.className = content2.className.replace("col-xs-12", "col-xs-9");
        button.id = "btnHide";
        button.innerHTML = "Hide Chat";
    }
}

function chatSubmit(idInputChat,idMessageChat) {
    eraseInput(idInputChat);
    downChat(idMessageChat);
}

function downChat(idMessageChat) {
    setTimeout(function() {
        var $cont = document.getElementById(idMessageChat);
        $cont.scrollTop = $cont.scrollHeight;
    } , 401);

}

function eraseInput(idInputChat) {
    document.getElementById(idInputChat).value = "";
}
