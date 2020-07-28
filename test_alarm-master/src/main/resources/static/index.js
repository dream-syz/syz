//获取时间动态显示(页面加载时调用)----------------------------------------------------------------------------------------
function time() {    //获得显示时间的div    
    t_div = document.getElementById('sy_time');
    var now = new Date()    //替换div内容    

    var year = now.getFullYear();
    if (year < 1900) year = year + 1900;

    var month = now.getMonth() + 1;
    if (month < 10) month = '0' + month;

    var day = now.getDate();
    if (day < 10) day = '0' + day;

    var hour = now.getHours();
    if (hour < 10) hour = '0' + hour;

    var minutes = now.getMinutes();
    if (minutes < 10) minutes = '0' + minutes;

    var seconds = now.getSeconds();
    if (seconds < 10) seconds = '0' + seconds;

    t_div.innerHTML = year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds;    //等待一秒钟后调用time方法，由于settimeout在time方法内，所以可以无限调用   
    setTimeout(time, 1000);
}

$(document).ready(function () {
    $(".trewview li ").click(function () {
        var val = $(this).index();
        if (val == 0) {
            document.getElementById("iframe-page-content").src = "alarm_rule";
        }
        if (val == 1) {
            document.getElementById("iframe-page-content").src = "alarm_information";
        }
        if (val == 2) {
            document.getElementById("iframe-page-content").src = "alarm_strategy";
        }
        if (val == 3) {
            document.getElementById("iframe-page-content").src = "alarm_report";
        }

    });
});




