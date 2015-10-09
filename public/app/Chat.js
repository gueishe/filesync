var showButtonClick = document.querySelector("#btnShow"),
            hideButtonClick = document.querySelector("#btnHide"),
            content = document.querySelector("#chat");
        //Show wrapper div content
        showButtonClick.addEventListener("click", function () {
            if( content.className.indexOf("hidden") !== -1 ) {
                content.className = content.className.replace(" hidden","");
            }
        }, false);

        //Hide wrapper div content
        hideButtonClick.addEventListener("click", function () {
            if( content.className.indexOf("hidden") === -1 ) {
                content.className += " hidden";
            }
        }, false);
