document.write("<script language=javascript src='/js/js/MeasurementPoint/topTime.js?v=20181114'></script>");
document.write("<script language=javascript src='/js/js/MeasurementPoint/tutorial-hisCurvey.js?v=20181114'></script>");
document.write("<script language=javascript src='/js/js/MeasurementPoint/areaTree.js?v=20181114'></script>");
document.write("<script language=javascript src='/js/js/MeasurementPoint/meterTable.js?v=20181114'></script>");
document.write("<script language=javascript src='/js/js/MeasurementPoint/meterChartCurve.js?v=20181114'></script>");
document.write("<script language=javascript src='/js/js/MeasurementPoint/datePicker.js?v=20181114'></script>");

var overAllIds = new Array();  //全局数组

$(document).ready(function () {
    var windowHeight = $(window).height();

    initTopTime();
    //设置树的面板高度
    $("#treepanel").height((windowHeight - $("#head-top-model").height()));
    //设置树的滚动条的高度
    $("#treebody").height($("#treepanel").height() * 0.93);

    //设置 表计基本信息和数据项信息的滚动条高度
    $("#MpInfobody").height(windowHeight * 0.36);
    $("#DataItembody").height((windowHeight - $("#MpInfobody").height()) * 0.66);

    ACCESS_PERMISSION.InitCurrentAreaTree({},$("#treeview"));
    //1.初始化Table
    var oTable = new TableInit();
    oTable.Init();
    //2.初始化Button的点击事件
    var oButtonInit = new ButtonInit();
    $("#hide-selet").css("visibility", "visible");
    $("#customer-type").css("visibility", "visible");
    oButtonInit.Init();


    $("#firstbutton").click();//选中第一个瞬时流量按钮

    ACCESS_MENUBAR.loadMenuBar("toMeterCurve", "operationManage");
});


function load() {
    var a = setTimeout("loading.style.transition='opacity 0.8s'", 0);
    //设置透明度改变的过渡时间为0.3秒
    var b = setTimeout("loading.style.opacity=0", 500);
    //0.5秒后加载动画开始变为透明
    var c = setTimeout("loading.style.display='none'", 800);
    //当透明度为0的时候，隐藏掉它
}

function initReportTime(mpName) {
    $("#selectedDateStr").text(getTime());//初始化时间

    $("#selectedDeviceName").text(mpName);//初始化表计名
}



//下拉状态数据加载
function getAllStates(obj, url) {
    $.ajax({
        type: 'post',
        url: url,
        dataType: "json",
        success: function (data) {
            $.each(data, function (i, n) {
                $("#" + obj).append(" <option value=\"" + n.id + "\">" + n.name + "</option>");
            });
            $("#" + obj).selectpicker('val', '');
            $('.selectpicker').selectpicker('refresh');
        }
    });
}

//设置滚动条
function AddScrollbar(ScrollbarName) {
    $("." + ScrollbarName).mCustomScrollbar({
        scrollButtons: {
            enable: false,
            scrollType: "continuous",
            scrollSpeed: 20,
            scrollAmount: 40
        },
        horizontalScroll: false
    });
}


