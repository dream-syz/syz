$(document).ready(function () {


    var height=document.documentElement.clientHeight;
    $("#treepanel").height((height- $("#head-top-model").height())*0.90);
    $("#iframe-page-content").height($("#treepanel").height());
    //设置树的滚动条的高度
    $("#treebody").height($("#treepanel").height()*0.93);


    var option = {
        funHref:"alarm",
        href:"operationManage"
    };

    // ACCESS_MENUBAR.loadframeContent(option);
    // $('#sys-tree').treeview('toggleNodeSelected', [0]);
});

var alarm = (function () {

    var my = {};

    my.initAlarm = function () {

        console.log("初始化页面高度");

        /*----------------------------------------------------设置高度------------------------------------------------------*/
        var windowHeight = $(window).height();

        //设置树的面板高度
        // $("#cre-rule-panel").height(windowHeight * 0.90);

        /*----------------------------------------------------加载公共区域------------------------------------------------------*/
        $.ajaxSetup({
            async: false //取消异步，先加载load
        });

        //加载公共 div
        // $('#head-top-model').load("menu-top #headMenu");//加载导航头

    };


    /*----------------------------------------------------返回------------------------------------------------------*/
    return my;

}());