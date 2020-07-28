
function getTime() {
    var time = new Date();
    var year = time.getFullYear();
    if (year < 1900) year = year + 1900;
    var month = time.getMonth() + 1;
    if (month < 10) month = '0' + month;
    var day = time.getDate();
    if (day < 10) day = '0' + day;
    return year + "-" + month + "-" + day;
}

function initTopTime() {
    var time = new Date();
    var str = "<i class='glyphicon glyphicon-time'></i>&nbsp;&nbsp;";
    var date = getTime();
    var hour = time.getHours();
    if (hour < 10) hour = '0' + hour;
    var minutes = time.getMinutes();
    if (minutes < 10) minutes = '0' + minutes;
    var seconds = time.getSeconds();
    if (seconds < 10) seconds = '0' + seconds;
    str = str + date + " " + hour + ":" + minutes + ":" + seconds;
    $("#sy_time").html(str);
    setTimeout(initTopTime, 1000);
}
