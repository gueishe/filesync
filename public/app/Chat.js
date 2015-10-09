var showButtonClick = document.querySelector("#btnShow"),
            hideButtonClick = document.querySelector("#btnHide"),
            chat = document.querySelector("#chat");
        showButtonClick.addEventListener("click", function () {
            console.log(history);
            if( chat.className.indexOf("hidden") !== -1 ) {
                var history = document.querySelector("#history");
                chat.className = chat.className.replace(" hidden","");
                history.className = history.className.replace("col-xs-12", "col-xs-9");
            }
        }, false);

        hideButtonClick.addEventListener("click", function () {
            if( chat.className.indexOf("hidden") === -1 ) {
                var history = document.querySelector("#history");
                chat.className += " hidden";
                history.className = history.className.replace("col-xs-9", "col-xs-12");
            }
        }, false);
