$.ajaxSetup({
    contentType:"application/x-www-form-urlencoded;charset=utf-8",
    complete:function(XMLHttpRequest,textStatus){
        var sessionstatus = XMLHttpRequest.getResponseHeader("session-status");

        if(sessionstatus == "timeout"){
            window.location.href = '/toLogin?timeout';
        }

        if(sessionstatus=="kickout"){
            window.location.href = '/toLogin?kickout';
        }
    }
});