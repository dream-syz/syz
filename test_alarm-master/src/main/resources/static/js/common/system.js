var _wasPageCleanedUp = false;

function xx() {

    console.log("ready");
    window.onbeforeunload = function (event) {
        console.log("confirm");
        $.ajax({
            url:"hdst/logout",
            type: "POST",
            data: {},
            contentType: "application/json",
            async: false,
            dataType: "json",
            success: function (res) {
                console.log(res);
            },
            complete: function () {
                console.log("complete");
            }
        });
        event.returnValue = "xxxxxxx";
    };
}


function pageCleanup() {

    if (!_wasPageCleanedUp) {

        $.ajax({

            type: 'GET',

            async: false,

            url: 'SomeUrl.com/PageCleanup?id=123',

            success: function () {

                _wasPageCleanedUp = true;

            }

        });

    }

}


window.onbeforeunload =  function () {

    //this will work only for Chrome

    pageCleanup();

};


window.onunload = function () {

    //this will work for other browsers

    pageCleanup();

};