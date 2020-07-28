var globalSelectedRow = null;

$(document).ready(function () {
    var windowHeight = $(window).height();
    initTopTime();
    //设置树的面板高度
    $("#treepanel").height((windowHeight - $("#head-top-model").height()));
    $("#runTimePanel").height((windowHeight - $("#head-top-model").height()));
    //设置树的滚动条的高度
    $("#treebody").height($("#treepanel").height() * 0.93);

    //设置 表计基本信息和数据项信息的滚动条高度
    // $(".MpInfobody").height($("#treepanel").height());
    // $("#MpInfobody").height(windowHeight * 0.36);
    // $("#DataItembody").height((windowHeight - $("#MpInfobody").height()) * 0.58);

    InitAreaTree();
    //1.初始化Table
    var oTable = new TableInit();
    oTable.Init();


    //2.初始化Button的点击事件
    var oButtonInit = new ButtonInit();
    $("#hide-selet").css("visibility", "visible");
    $("#customer-type").css("visibility", "visible");
    oButtonInit.Init();
    refreshTable();
    /* var newVisitor = isNewVisitor();// 如果是新访客
     if (newVisitor === true) {
         alert('您是新用户！');
         setCookie("gznotes-visited", "true", 5);
         pageBoot();
     }*/

    topMenu.Init("0", "index", "authority/getAuthoritysBySysUserAndMenuCode", "realTimeInfo");


    //*********小屏幕适配
    smallScreenAdapt();

    //表右上角按钮点击事件
    $("#btn_open").click(function () {clickButtonOption("open",$("#tb_departments"));});
    $("#btn_close").click(function () {clickButtonOption("close",$("#tb_departments"));});
    $("#btn_update").click(function () {clickButton($("#tb_departments"));});
    $("#btn_command").click(function () {clickButtonList($("#tb_departments"));});

    bindTreeViewSelected();                     //绑定树点击事件

    tableDefaultInit()
});


function smallScreenAdapt() {
    if ( $(window).width() <= 1000) {
        console.log("判断窗口宽度小于1000了");

        document.getElementById("runTimePanelWrapper").classList.remove("row");
        // var treePanel= document.getElementById("treepanel");
        // var runTimePanel = document.getElementById("runTimePanel");
        // var table = document.getElementById("tb_departments");
        //
        // treePanel.style.height = 540 + 'px';
        // runTimePanel.style.height = 540 + 'px';
        // table.style.height = 540 + 'px';
        //
        // console.log("treePanelHeight=" + treePanel.offsetHeight);
        // console.log("checkOutPanelHeight=" + runTimePanel.offsetHeight);
        // console.log("tableHeight=" + table.offsetHeight);
        //
        // $("#treebody").height($("#treepanel").height() * 0.93);
    }

}

function formatDateByTimeStamp(value, row, index) {
    return Common.formatDateByTimeStamp(value, row, index);
}

function formatBatterry(value, row, index){
    if (value == "OFF") {
        value = '<span style="color:red">掉电</span>';
    }else{
        value = '<span style="color:black">正常</span>';
    }
    return value;
}

function refreshTable() {
    /* var interval = setInterval(function () {
         $("#tb_departments").bootstrapTable("refresh", {silent: true});
     }, 10000);*/
}

function InitAreaTree() {
    Common.initTreeView($("#treeview"), "roleArea/getAreasBySysUser", "id=0");
}

function bindTreeViewSelected(){
    $('#treeview').on('nodeSelected',function (event, data) {
        var temp = {
            dataUrl: "runTimeTable"
        };
        var menuCode = topMenu.getMenuCodeByUrl(temp, "authority/getSigleSysAuthorityByUrl");
        temp.type = menuCode;
        temp.id = data.id;
        $("#tb_departments").bootstrapTable("refreshOptions", {columns: gasHead(temp)});
    });
}

/*-------------------------------------------------页面引导-----------------------------------------------------------*/

function pageBoot() {
    introJs().setOptions({
        prevLabel: "上一步",
        nextLabel: "下一步",
        skipLabel: "跳过",
        doneLabel: "结束",
        tooltipPosition: 'right',
        showProgress: true,
        steps: [{
            element: '.list-group',
            intro: '<div class="tour-header"><b>系统使用指引</b>\n</div>' +
                '<div class="tour-step" >单击展开区域\n' +
                '如需关闭指引，请点击跳过按钮</div>',
            position: 'right'
        },
            {
                element: '.bootstrap-table',
                intro: '<div class="tour-header"><b>系统使用指引</b>\n</div>' +
                    '<div class="tour-step" >所查询的表计信息\n</div>',
                position: 'right'
            },
            {
                element: '.form-horizontal',
                intro: '<div class="tour-header"><b>&nbsp;&nbsp;&nbsp;系统使用指引&nbsp;&nbsp;&nbsp;</b>\n</div>' +
                    '<div class="tour-step" >想要更精确的查询表计,填入表钢号或IMEI号,表计状态,表计安装时间任一都可</div>',
                position: 'right'
            },
            {
                element: '.dropdown .function',
                intro: '<div class="tour-header"><b>系统使用指引</b>\n</div>' +
                    '<div class="tour-step">想要更多的功能可以点开功能菜单按钮,这里集合了所有功能模块</div>',
                position: 'bottom'
            },
            {
                element: '.MpInfobody',
                intro: '<div class="tour-header"><b>系统使用指引</b>\n</div>' +
                    '<div class="tour-step" >here!想要的表计基本信息都在这里</div>',
                position: 'right'
            },
            {
                element: '.DataItembody',
                intro: '<div class="tour-header"><b>系统使用指引</b>\n</div>' +
                    '<div class="tour-step" >here!表计的数据项信息在这里</div>',
                position: 'right'
            },
            {
                element: '.hourdata',
                intro: '<div class="tour-header"><b>系统使用指引</b>\n</div>' +
                    '<div class="tour-step" >here!表计的小时数据曲线图</div>',
                position: 'right'
            }
        ]
    }).oncomplete(function () {
        //点击跳过按钮后执行的事件
    }).onexit(function () {
        //点击结束按钮后， 执行的事件
    }).onchange(function (element) {
        console.log(element.id);
    }).start();
}

function isNewVisitor() {
    var flg = getCookie("gznotes-visited");
    if (flg === "") {
        return true;
    } else {
        return false;
    }
}

// 写字段到cookie
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires + ";path=/";
}

// 读cookie
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}


/*-------------------------------------------------页面引导结束-----------------------------------------------------------*/
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

function load() {
    var a = setTimeout("loading.style.transition='opacity 0.8s'", 0)
    //设置透明度改变的过渡时间为0.3秒
    var b = setTimeout("loading.style.opacity=0", 500)
    //0.5秒后加载动画开始变为透明
    var c = setTimeout("loading.style.display='none'", 800)
    //当透明度为0的时候，隐藏掉它
}

function initReportTime(mpName) {
    $("#selectedDateStr").text(getTime());//初始化时间

    $("#selectedDeviceName").text(mpName);//初始化表计名
}

/*------------------------------------------------区域树的js------------------------------------------------------*/

function judgementAreaTreeIsSelected() {
    var select_node = $('#treeview').treeview('getSelected');//获得选中的节点
    if (select_node[0]) {
        return select_node[0].id;
    }
    return "";
}

function getTreePrantId() {
    var select_node = $('#treeview').treeview('getSelected');//获得选中的节点
    if (select_node[0]) {
        return select_node[0].parentId;
    }
    return "";
}

/*----------------------------------------------表格的js--------------------------------------------------*/
function streamHead() {
    var tableHead = [{           //表头
        checkbox: true,
        // formatter: stateFormatter
    }, {
        field: 'devId',
        title: '设备Id',
        align: 'center'
    }, {
        field: '1144',
        title: '表钢号',
        align: 'center'
    }, {
        field: '1238',
        title: 'IMEI号',
        align: 'center'
    }];
    return tableHead;
}
function formatConnState(value, row, index){
    var value = value;
    if (value == "通讯异常") {
        value = '<span style="color:red">' + value + '</span>';
    }
    return value;
}
function gasHead(temp) {
    var tableHead = [{           //表头
        checkbox: true,
        formatter: stateFormatter
    }, {
        field: 'devId',
        title: '设备Id',
        align: 'center'
    }, {
        field: '1144',
        title: '表钢号',
        align: 'center'
    }, {
        field: '1238',
        title: 'IMEI号',
        align: 'center'
    }];

    return $('#tb_departments').requestHeader("column/getTableHeaderByMenuCode", tableHead, "parameter=" + JSON.stringify(temp));
}

function tableDefaultInit() {
    var temp = {
        dataUrl: "runTimeTable"
    };
    var menuCode = topMenu.getMenuCodeByUrl(temp, "authority/getSigleSysAuthorityByUrl");

    var selectedNode = $('#treeview').treeview('getSelected');


    temp.type = menuCode;
    temp.id = selectedNode[0].id;
    $("#tb_departments").bootstrapTable("refreshOptions", {columns: gasHead(temp)});
}

var TableInit = function () {
    var oTableInit = new Object();

    //初始化Table
    oTableInit.Init = function () {
        $('#tb_departments').bootstrapTable('destroy');//先销毁表格

        var tableHead = streamHead();//默认蒸汽

        $("#tb_departments").initTable(
            {
                type: "POST", //请求类型
                url: "areaReportData/selectAreaDevReportForRuntime",//请求的url
                pageIndex: 1,  //显示第几页
                pageSize: 20,   //每页显示多少行
                columns: tableHead,
                showExport: false,
                showRefresh: false,
                ajaxOptions: {async: true, timeout: 8000},
                clickToSelect: false,
                height: $("#runTimePanel").height() - 100,    //表格高度   不传的话  则不设置高度
                isNeedOperation: false,  //是否需要操作列
                isNeedRequestHeader: false,
                uniqueId: 'mpId',     //每一行的唯一标识，一般为主键列
                onLoadError: function (status, res) {
                    return loadError(res);
                },
                onLoadSuccess: function (data) {
                    if (globalSelectedRow != null) {
                        //$("#tb_departments").clickRow.bs.table(globalSelectedRow);
                        changeTheTabmeter(globalSelectedRow.mpId);
                        // //初始化数据项信息
                        initdataItem(globalSelectedRow.mpId);
                        // $('.success').removeClass('success');//去除之前选中的行的，选中样式
                        //
                        // $(element).addClass('success');//添加当前选中的 success样式用于区别
                    }
                },
                onClickRow: function (row) {
                    globalSelectedRow = row;
                    onClickChange(row);// 单击改变 曲线 表计基本信息 及数据项信息
                },
                queryParams: function (params) { //查询参数事件
                    return "parameter=" + getMeterDataJson()+"&page="+getPageParams(params);
                }
            });
    };

    return oTableInit;
};

function checkStatus(state) {
    var update = '<button type="button" class="update btn btn-primary  btn-xs" title="修改">修改</button>&nbsp;';
    var details = '<button   type="button"  class="details btn btn-primary  btn-xs"  title="通讯检测">检测</button>&nbsp;';
    var remove = '<button  type="button"  class="remove btn btn-primary  btn-xs" title="废弃">废弃</button>&nbsp;';
    var exchange = '<button   type="button"  class="exchange btn btn-primary  btn-xs"  title="换表">换表</button>&nbsp;';
    var temp = [];
    if (state == 4) {
        temp.push(update, details);
        return temp.join('');
    } else if (state == 2) {
        temp.push(update, exchange, remove, details);
        return temp.join('');
    } else if (state == 3) {
        temp.push(update, exchange, remove, details);
        return temp.join('');
    } else {
        temp.push(update, exchange, remove);
        return temp.join('');
    }
}


/**
 *   传递参数
 * @param params
 * @returns {string}
 */
function getMeterDataJson() {

    var temp = judgeIsEmpty();

    // temp.page = {
    //     pageLine: params.limit,   //页面大小
    //     pageIndex: params.offset / params.limit + 1  //页码
    // };


    return JSON.stringify(temp);
}
function getPageParams(params){
    var temp = {
        pageLine: params.limit,   //页面大小
        pageIndex: params.offset / params.limit + 1  //页码
    };
    return JSON.stringify(temp);
}
function judgeIsEmpty() {
    var name = $.trim($("#txt_search_steelNumber").val());
    var areaId = judgementAreaTreeIsSelected();//获得选中的节点ID 若未选中则是获取第一个父节点
    var parentId = getTreePrantId();
    var temp = {
        // state:1
    };
    if (null != name && "" != name) {
        temp.pointName = name;
        //temp.dataItemName="表钢号";
    }else{
        temp.pointName =null;
    }
    // if(null!=state&&""!=state){
    //     console.log("state不为空"+state);
    //     temp.state=state;
    // }
    // if(null!=createTime&&""!=createTime&&createTime!="请选择日期范围"){
    //     //分割时间的方法
    //     var time=splitTime(createTime);
    //     temp.createTime=$.trim(time[0]);
    //     temp.deadlineTime=$.trim(time[1]);
    // }
    if (null != areaId && "" != areaId) {
        temp.areaId = areaId;
    }else{
        temp.areaId = null;
    }
    return temp;
}

/**
 *  分割日期字符串
 * @param strTime
 * @returns {string[]}
 */
function splitTime(strTime) {
    var time = strTime.split("至");
    return time;
}

/**
 *  条件查询按钮
 */
function conditionalQuery() {
    var select_node = $('#treeview').treeview('getSelected');//获得选中的节点
    $("#tb_departments").bootstrapTable("refresh");
}

/**
 *  加载错误时处理
 * @param res
 * @returns {*}
 */
function loadError(res) {
    // var myChart=echarts.init(document.getElementById('main'));
    // myChart.dispose();
    $("#selectedDeviceName").text("");
    $("#baseMpInfo").empty();
    $("#baseDataItem").empty();
    return res;
}


/*----------------------------------------------初始化日期控件以及下拉框的js--------------------------------------------------*/
var ButtonInit = function () {
    var oInit = new Object();

    oInit.Init = function () {

        //初始化下拉框

        $(".selectpicker").selectpicker({
            noneSelectedText: '请选择',
        });

        //初始化状态下拉数据
        var obj = "states";
        var url = "meters/getAllMeterState";
        getAllStates(obj, url);

        //初始化滚动条
        var ScrollbarName = "col-lg-2 .panel-body";
        AddScrollbar(ScrollbarName);

        //初始化table上被点击行的颜色改变
        $('#tb_departments').on('click-row.bs.table', function (e, row, element) {
            $('.success').removeClass('success');//去除之前选中的行的，选中样式
            $(element).addClass('success');//添加当前选中的 success样式用于区别
        });

        //初始化日期控件
        $("input[name='date2']").daterangepicker(
            {
                autoApply: true,
                timePicker: true,
                timePicker24Hour: true,
                autoUpdateInput: false,
                timePickerSeconds: true,
                alwaysShowCalendars: true,
                ranges: {
                    '今天': [moment(), moment()],
                    '昨天': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    '近7天': [moment().subtract(7, 'days'), moment()],
                    '这个月': [moment().startOf('month'), moment().endOf('month')],
                    '上个月': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                },
                locale: {
                    format: "YYYY/MM/DD HH:mm:ss",
                    separator: " - ",
                    applyLabel: "确认",
                    cancelLabel: "清空",
                    fromLabel: "开始时间",
                    toLabel: "结束时间",
                    customRangeLabel: "自定义",
                    daysOfWeek: ["日", "一", "二", "三", "四", "五", "六"],
                    monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
                }
            }
            ).on('cancel.daterangepicker', function (ev, picker) {
            $("#date2").val("请选择日期范围");
            $("#startTime").val("");
            $("#endTime").val("");
        }).on('apply.daterangepicker', function (ev, picker) {
            $("#startTime").val(picker.startDate.format('YYYY-MM-DD HH:mm:ss'));
            $("#endTime").val(picker.endDate.format('YYYY-MM-DD HH:mm:ss'));
            $("#date2").val(picker.startDate.format('YYYY-MM-DD HH:mm:ss') + " 至 " + picker.endDate.format('YYYY-MM-DD HH:mm:ss'));
        });

    };
    return oInit;
};

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

/*----------------------------------------------表格的操作.js--------------------------------------------------*/
/**
 *   复选框默认被选中
 * @param value
 * @param row
 * @param index
 * @returns {*}
 */
function stateFormatter(value, row, index) {
    if (index == 0) {
        //初始化曲线图 初始化之前，拿到表计id 到数据库查一次，得到其类型，是民用表还是工业表
        //drawChartData(row.mpId);
        //初始化表计名和时间
        initReportTime(row.mpName);
        //初始化最右侧表计信息
        changeTheTabmeter(row.mpId);
        //初始化数据项信息
        initdataItem(row.mpId);

        return {
            checked: false//设置选中
        };
    }
    return value;
}

function valueFormatter(value, row, index) {
    var result = parseFloat(value);
    if (isNaN(result)) {
        alert('传递参数错误，请检查！');
        return false;
    }
    result = Math.round(value * 100) / 100;
    if (result == 0) result = "0.00";
    return result;

}

function lookupTypeByMpId(mpId) {
    var temp = {
        mpId: mpId,
    };
    var data = "";
    $.ajax({
        url: "meters/getMeterType",
        type: "post",
        dataType: "json",
        async: false,//取消异步
        data: "parameter=" + JSON.stringify(temp),
        success: function (datas) {
            data = datas;
        }
    });
    return data;
}

//打开新增表计模态框
function addData() {
    addDev();
}

//打开换表模态框
function exchangeMeterDetails(e, value, row, index) {
    changMp(row.mpId);
}

//打开废弃模态框
function delMeterDetails(e, value, row, index) {
    $("#deleteHaulId").val(row.mpId);
    $('#delcfmOverhaul').modal('show');
    $('#deleteHaulBtn').click(function () {
        btnDelete();
    });

}

/**
 *    打开修改模态框
 */
function updateMeterDetails(e, value, row, index) {
    console.log("执行修改事件");
    changeDev(row.mpId);
}

/**
 *   废弃单个事件
 */
function btnDelete() {  //当点击废弃的时候  会进入这个方法
    var mpId = $("#deleteHaulId").val();
    discardMp(mpId);
    $("#deleteHaulBtn").unbind("click");//取消绑定事件
}

/**
 * 批量废弃事件
 */
function batchDelete() {
    if (editMemberInfoShow()) {


        $("#deleteHaulBtn").unbind("click");//取消绑定事件

        //弹出确认批量废弃的模态框
        $('#delcfmOverhaul').modal('show');

        $('#deleteHaulBtn').click(function () {
            ExecutionDeleting();
        })

    } else {
        //请选中一个的模态框
        $("#message").text("请选择一行进行操作!");
        $("#my-modal-alert").modal('show');
    }
}

/**
 *  执行批量废弃
 */
function ExecutionDeleting() {
    var mpIdList = getIdSelections();//获取表记ID

    BatchDiscardMp(mpIdList);
}

/**
 *  通讯检测按钮
 */
function communication(e, value, row, index) {
    if (row.state != '通讯正常' && row.state != '废弃') {
        executionDetection(e, value, row, index);
    } else {
        $("#message").text("通讯正常,请勿操作!");
        $("#my-modal-alert").modal('show');
    }
}

/**
 * 执行检测
 */
function executionDetection(e, value, row, index) {
    var temp = {
        mpId: row.mpId,
    };
    $.ajax({
        url: "meters/communicationCheck",
        type: "post",
        dataType: "json",
        data: "parameter=" + JSON.stringify(temp),
        success: function (datas) {
            judgingReturnData(datas);
            // refreshTable();
        }
    });
}

/* function refreshTable() {
     document.getElementById("states").options.selectedIndex = 0; //回到初始状态
     $("#states").selectpicker('refresh');//对customerType这个下拉框进行重置刷新
 }*/

function judgingReturnData(datas) {
    if (datas.code == 200) {
        $("#message").text(datas.description);
        $("#tb_departments").bootstrapTable("refresh");
        $("#my-modal-alert").modal('show');
    } else {
        $("#message").text(datas.description);
        $("#my-modal-alert").modal('show')
    }
}

function editMemberInfoShow() {
    var arrselectedData = $("#tb_departments").bootstrapTable(
        'getSelections');
    if (arrselectedData.length <= 0) {
        return false;
    } else {
        return true;
    }
}

//获取选中的id
function getIdSelections() {
    return $.map($("#tb_departments").bootstrapTable('getSelections'), function (row) {
        return row.mpId;
    });
}

/**
 *  双击行的修改事件
 * @param row
 */
function dbClickUpdate(row) {
    changeDev(row.mpId);
}

/**
 *  单击事件
 * @param row
 */
function onClickChange(row) {
    //单击行的同时 动态加载曲线图
    //drawChartData(row.mpId);
    //初始化表计名和时间
    initReportTime(row.mpName);
    //动态加载表计的基本信息
    changeTheTabmeter(row.mpId);
    //动态加载设备的数据项信息
    initdataItem(row.mpId);
}

//关闭模态框时重置表单
function close() {
    $('#formModal').on('hide.bs.modal', Clear());
}

/*----------------------------------------------动态加载最右侧表计信息.js--------------------------------------------------*/
/**
 *    根据表计ID动态加载最右侧的表计基本信息
 */
function changeTheTabmeter(parentId) {
    var temp = {
        mpId: parentId,
    };
    var str = "";
    $.ajax({
        url: "meters/meterAndDevInformation",
        type: "post",
        dataType: "json",
        data: "parameter=" + JSON.stringify(temp),
        success: function (datas) {
            $.each(datas, function (index, data) {
                if (index % 2 == 0) {
                    str += "<div class='row'><div class='col-sm-6 col-md-6 col-xs-6'><h5 class='text-center text-primary'>" + data.name + "</h5>" +
                        "<p class='text-center'style='word-wrap:break-word;word-break:break-all;overflow: hidden;'>" + data.value + "</p></div>"
                } else {
                    str += "<div class='col-sm-6 col-md-6 col-xs-6'><h5 class='text-center text-primary'>" + data.name + "</h5>" +
                        "<p class='text-center'style='word-wrap:break-word;word-break:break-all;overflow: hidden;'>" + data.value + "</p></div></div>";
                }
            });
            $("#baseMpInfo").empty();
            $("#baseMpInfo").append(str);
        }
    });
}

/**
 *      根据表计ID动态加载数据项信息
 */
/*function initdataItem(parentId) {
    var temp = {
        mpId: parentId,
    };
    var str = "";
    $.ajax({
        url: "runtime/getMpFuncInfo",
        type: "post",
        dataType: "json",
        data: "parameter=" + JSON.stringify(temp),
        success: function (datas) {
            $("#baseDataItem").empty();
            $("#baseDataItem").append("<div class='row'></div>");
            var div = $("#baseDataItem").find("div");
            $.each(datas, function (index, data) {

                var oneDiv = "<div class='col-sm-6 col-md-6 col-xs-6' style='padding-bottom: 10px'><button class='btn btn-"+data.button+"' code='"+data.code+"' state='"+data.state+"'>" + data.name +"("+data.state+ ")</button></div>";
                div.append(oneDiv);
            });

            div.find("button").on("click",function () {
                alertModal($(this).attr('code'),$(this).attr('state'));
            });



        }
    });

}*/

function clickButton(table) {

    var list = table.bootstrapTable('getSelections');
    if(list && list.length == 1){

        var mpIds = getIds(list,"devId");
        var param = {"mpId":mpIds[0]}
        var returnDate = commReturnAjax("runtime/selectConfigs","property",param);
        // returnDate = [{"id":"1000","name":"开关阀控制","value":"0","state":"配置成功","time":"2019-3-19 13:57:00","inputType":"select","options":[{"id":"0","value":"开阀"},{"id":"1","value":"关阀"}]},{"id":"1001","name":"剩余金额","value":"122","state":"配置失败","time":"2019-3-19 13:57:00","inputType":"input"},{"id":"1002","name":"剩余气量","value":"122","state":"配置中","time":"2019-3-19 13:57:00","inputType":"input"}];
        if(returnDate != null){
            initModal(mpIds[0],returnDate);
        }else {
            showUserTip("该表记没有配置项");
        }
    }else {
        showUserTip("请只勾选一个表记进行配置");
    }

}
function clickButtonOption(msg,table) {
    var list = table.bootstrapTable('getSelections');
    if(list && list.length > 0){

        var mpIds = getIds(list,"devId");
        var param = {"type":msg,"mpIds":mpIds}
        var returnDate = null;

        // var returnDate = commReturnAjax("runtime/valveOperation","property",param);
        returnDate = {"state":{"code":"200","discription":"正在配置设备"}};
        showUserTip(returnDate.state.discription);
    }else {
        showUserTip("请勾选至少一个表记进行操作");
    }

};
function clickButtonList(table) {
    var list = table.bootstrapTable('getSelections');
    if(list && list.length == 1){

        var mpIds = getIds(list,"devId");
        var param = {"mpId":mpIds[0]}
        var returnDate = commReturnAjax("runtime/getOrderList","property",param);
        // var returnDate = [{"id":"1001","name":"表记初始化","code":"0x01","description":"内容","state":"SENT","createTime":"2019-3-19 13:57:00"},{"id":"1002","name":"表记初始化","code":"0x01","description":"内容","state":"TIMEOUT","createTime":"2019-3-19 13:57:00"},{"id":"1003","name":"表记初始化","code":"0x01","description":"内容","state":"DELIVERED","createTime":"2019-3-19 13:57:00"},{"id":"1004","name":"表记初始化","code":"0x01","description":"内容","state":"SUCCESSFUL","createTime":"2019-3-19 13:57:00"},{"id":"1005","name":"表记初始化","code":"0x01","description":"内容","state":"FAILED","createTime":"2019-3-19 13:57:00"}];
        if(returnDate != null){
            initTableModal(returnDate);
        }else {
            showUserTip("该表记没有命令队列");
        }

    }else {
        showUserTip("请只勾选一个表记进行配置");
    }

}

function getIds(list,name) {
    var mpIds = [];

    $.each(list,function (index,data) {
        mpIds.push(data[name]);
    })

    return mpIds;
}

/**
 *  展示 提示modal
 * @param message
 */
function showUserTip(message) {
    $("#user_message").text(message);
    $("#imfo_tip_run").modal('show');
}

function initModal(mpId,data) {
    if(data){
        $('#com-modal-title').val("详细信息");
        // $('#com_modal_body').style.height = 500;
        // $('#com_modal_body').style.overflow = auto;

        var div = $('<form class="form-horizontal" autocomplete="off">')
        $.each(data,function (index,aData) {
            div.append(getOneInput(aData));
        })
        $('#com-modal_message').empty();
        $('#com-modal_message').append(div);
        $('#com-modal-footer').find(".btn-primary").unbind('click');

        $('#com-modal-footer').find(".btn-primary").on('click',function () {

            var newData = [];

            $.each($('#com-modal-alert').find('input,select'),function (index,aData) {
                newData.push({"id":aData.id,"value":aData.value,"state":getState(aData.id,data)});
            })

            var updateData = judgeChangeParam(data,newData);
            var param = {"mpId":mpId,"configs":updateData};
            var returnData = commReturnAjax("runtime/updateConfigs","property",param);
            if(returnData && returnData.state.description === '修改设备配置项 ， 成功'){
                alert("配置下发成功，请等待配置结果");
            }else {
                alert("配置下发失败，请重新配置");
            }
            $('#com-modal-alert').modal('hide');
        })

        $('#com-modal-alert').modal('show');

    }
}

function getState(id,data) {
    var state = null;
    $.each(data,function (index,aData) {
        if(aData.id === id){
            state = aData.state;
        }
    })
    return state;
}
function initTableModal(data) {
    $('#list_tb').bootstrapTable('destroy');//先销毁表格

    var tableHead = [{
        field: 'sequence',
        title: '命令编号',
        align: 'center',
        visible: false
    }, {
        field: 'name',
        title: '命令名',
        align: 'center'
    }, {
        field: 'code',
        title: '标识码',
        align: 'center'
    }, {
        field: 'state',
        title: '执行状态',
        align: 'center',
        formatter: function (value, row, index) {
            var state = "无状态";
            if (value == "SENT") {
                state = '<span class="text-muted">配置中</span>';
            }else if (value == "TIMEOUT") {
                state = '<span class="text-danger">发送失败</span>';
            }else if (value == "DELIVERED") {
                state = '<span class="text-muted"> 配置中</span>';
            }else if (value == "SUCCESSFUL") {
                state = '<span class="text-primary">执行成功 </span>';
            }else if (value == "FAILED") {
                state = '<span class="text-danger"> 执行失败 </span>';
            }
            return state;
        }
    }, {
        field: 'createTime',
        title: '下发时间',
        align: 'center'
    }];

    $("#list_tb").bootstrapTable(
        {

            detailView:true,
            columns:tableHead,
            showColumns: true,
            data:data,
            onExpandRow:function (index, row, $detail) {
                initChildTable(index, row, $detail);
            }
        });
    $('#list-modal-alert').modal('show');

}

function initChildTable(index, row, $detail) {
    var parentid = row.MENU_ID;
    var cur_table = $detail.html('<table></table>').find('table');
    $(cur_table).bootstrapTable({
        pageSize: 10,
        columns: [ {
            field: 'id',
            title: '主键',
            visible: false
        }, {
            field: 'name',
            title: '命令参数'
        }, {
            field: 'value',
            title: '参数值'
        } ],
        data:row.config
    });
}

function judgeChangeParam(oldData,newData) {

    var list = [];

    for(var i=0;i<oldData.length;i++){
        if(oldData[i].id == newData[i].id && oldData[i].value != newData[i].value){
            list.push(newData[i]);
        }
    }

    if(list.length < 1){
        for(var i=0;i<newData.length;i++){
            if(newData[i].state == '3'){
                list.push(newData[i]);
            }
        }
    }

    return list;
}

function getOneInput(data) {

    var newElement=$('<div class="form-group "></div>');

    var lable = $('<label class="col-lg-2 control-label">'+data.name+'</label>');

    // lable.find('lable').val(data.name);

    var inputDiv = $('<div class="col-lg-6"></div>');
    // var stateDiv = $('<div class="col-lg-2">'+data.state+'</div>');
    // var stateDiv = $('<label class="col-lg-2 control-label glyphicon glyphicon-ok" style="text-align: left">'+data.state+'</label>');
    var stateDiv = $(' <div class="col-lg-12"><p  class="'+getTextCssByState(data.state)+'"> <span class="'+getGlyByState(data.state)+'"></span> '+parseState(data.state)+'</p></div>');
    var timeDiv = $('<div class="col-lg-12"><p class="'+getTextCssByState(data.state)+'">'+data.time+'</p></div>');
    var tipDiv = $('<div class="col-lg-4"></div>');
    tipDiv.append(stateDiv);
    tipDiv.append(timeDiv);
    var input = null;

    if(data.inputType === 'input' ){
        input = $('<input class="form-control" >');

        input.attr('type',data.inputType);

    }else if(data.inputType === 'select'){
        input = $('<select class="form-control"></select>')
        $.each(data.options,function (index,aOption) {
            input.append('<option value="'+aOption.value+'" ">'+aOption.text+'</option>')
        })
    }
    input.attr('id',data.id);
    input.val(data.value);

    inputDiv.append(input);
    newElement.append(lable);
    newElement.append(inputDiv);
    newElement.append(tipDiv);
    // newElement.append(timeDiv);

    return newElement;
}

function getGlyByState(state) {
    if(state == '1'){
        return 'glyphicon glyphicon-time';
    }else if(state === '2'){
        return 'glyphicon glyphicon-ok-circle';
    } else if(state === '3'){
        return 'glyphicon glyphicon-remove-circle';
    }
}
function getTextCssByState(state) {
    if(state == '1'){
        return 'text-muted';
    }else if(state === '2'){
        return 'text-primary';

    } else if(state === '3'){
        return 'text-danger';
    }
}
function parseState(state) {
    if(state == '1'){
        return '配置中';
    }else if(state === '2'){
        return '配置成功';
    } else if(state === '3'){
        return '配置失败';
    }
}

function initTipModal(data) {
    $('#com-modal-title').val("提示");
    $('#com-modal_message').empty();
    $('#com-modal_message').append(data.state.discription);
    $('#com-modal-alert').modal('show');
    $('#com-modal-footer').find(".btn-primary").attr("data-dismiss","");
    $('#com-modal-footer').find(".btn-primary").attr("data-dismiss","modal");
}

function commReturnAjax(url,name,param) {

    var returnMsg = null;

    $.ajax({
        type: "POST",
        url: url,
        data: name+"=" + JSON.stringify(param),
        async: false,//取消异步
        dataType: "json",
        success: function (msg) {
            returnMsg =  msg;
        }
    });

    return returnMsg;
}
/**
 *      根据表计ID动态加载数据项信息
 */
function initdataItem(parentId) {
    var temp = {
        mpId: parentId,
    };
    var str = "";
    $.ajax({
        url: "meters/initdataItem",
        type: "post",
        dataType: "json",
        data: "parameter=" + JSON.stringify(temp),
        success: function (datas) {
            $.each(datas, function (index, data) {
                if (index % 2 == 0) {
                    str += "<div class='row'><div class='col-sm-6 col-md-6 col-xs-6'><h5 class='text-center text-primary'>" + data.name + "</h5>" +
                        "<p class='text-center'style='word-wrap:break-word;word-break:break-all;overflow: hidden;'>" + data.value + "</p></div>"
                } else {
                    str += "<div class='col-sm-6 col-md-6 col-xs-6'><h5 class='text-center text-primary'>" + data.name + "</h5>" +
                        "<p class='text-center'style='word-wrap:break-word;word-break:break-all;overflow: hidden;'>" + data.value + "</p></div></div>";
                }
            });
            $("#baseDataItem").empty();
            $("#baseDataItem").append(str);
        }
    });

}

/*-----------------------------------------------曲线图的js---------------------------------------------------------*/

function drawChartData(parentId) {
    var datas = lookupTypeByMpId(parentId);

    var microtimeTems = [];         //瞬时流量数组（存放服务器返回的所有温度值）
    var pressureTems = [];         //压力数组
    var temperatureTems = [];          //温度数组
    var hourTems = [];        //小时用量数组
    var installDates = [];        //时间数组

    var myChart = echarts.init(document.getElementById('main'));

    myChart.showLoading();    //数据加载完之前先显示一段简单的loading动画
    if (datas.value == "3") {        //民用表
        civilMeter(myChart, parentId, hourTems, installDates);
    } else {          //工业表
        industrialMeter(myChart, parentId, microtimeTems, pressureTems, temperatureTems, hourTems, installDates);
    }
    setTimeout(function () {
        window.onresize = function () {
            myChart.resize();
        }
    }, 200);
}

function industrialMeter(myChart, parentId, microtimeTems, pressureTems, temperatureTems, hourTems, installDates) { //工业表
    var option = industrialOption();//获取默认对象
    $.ajax({
        type: "post",
        async: true,        //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url: "report/getAHourMeterData",
        data: "parameter=" + hourlyDataParameters(parentId),
        dataType: "json",
        success: function (result) {
            if (result != null && result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    microtimeTems.push(result[i].microtime);
                    pressureTems.push(result[i].pressure);
                    temperatureTems.push(result[i].temperature);
                    hourTems.push(result[i].hour);
                    installDates.push(result[i].installDate);
                }
                myChart.hideLoading();    //隐藏加载动画

                myChart.setOption({        //载入数据
                    xAxis: {
                        data: installDates    //填入X轴数据
                    },
                    series: [    //填入系列（内容）数据
                        {
                            // 根据名字对应到相应的系列
                            name: '瞬时流量',
                            data: microtimeTems
                        },
                        {
                            name: '压力',
                            data: pressureTems
                        },
                        {
                            name: '温度',
                            data: temperatureTems
                        },
                        {
                            name: '小时用量',
                            data: hourTems
                        }
                    ]
                });
                window.onresize = myChart.resize;
            }
            else {
                myChart.hideLoading();
            }
        },
        error: function (errorMsg) {
            myChart.hideLoading();
        }
    });
    //初始化曲线图
    myChart.clear();
    myChart.setOption(option);  //载入图表
}

function civilMeter(myChart, parentId, hourTems, installDates) { //民用表
    var option = meterOption();
    $.ajax({
        type: "post",
        async: true,
        url: "report/getAHourMeterData",
        data: "parameter=" + hourlyDataParameters(parentId),
        dataType: "json",
        success: function (result) {
            if (result != null && result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    hourTems.push(result[i].hour);
                    installDates.push(result[i].installDate);
                }
                myChart.hideLoading();    //隐藏加载动画

                myChart.setOption({        //载入数据
                    xAxis: {
                        data: installDates    //填入X轴数据
                    },
                    series: [    //填入系列（内容）数据
                        {
                            name: '小时用量',
                            data: hourTems
                        }
                    ]
                });
                window.onresize = myChart.resize;
            }
            else {
                myChart.hideLoading();
            }
        },
        error: function (errorMsg) {
            myChart.hideLoading();
        }
    });
    //初始化曲线图
    myChart.clear();
    myChart.setOption(option);  //载入图表
}


function hourlyDataParameters(parentId) {
    var temp = {
        dataType: 1,
        startTime: getTime() + " 00:00:00",
        endTime: getTime() + " 23:59:00"
    };
    if ("" != parentId && null != parentId) {
        temp.mpId = parentId;
    }
    return JSON.stringify(temp);
}

/**
 *     所点击的日折线图改变
 * @param dateType
 */
function changeBackContent(dateType) {
    if (dateType == 1) {
        $("#echartsType").text("← 日折线图");
    } else if (dateType == 4) {
        $("#echartsType").text("← 分钟折线图");
    } else {
        $("#echartsType").text("← 小时折线图");
    }
}


/**
 *  工业表的默认初始化对象
 */
function industrialOption() {
    var option = {
        title: {
            //text: '表计实时数据曲线图',
            subtext: ''
        },
        tooltip: {
            trigger: 'axis'
        },
        color: [
            '#a23531', '#2f4554', '#61a0a8', '#d48265'
        ],
        dataZoom: [
            {
                type: 'inside',    //支持单独的滑动条缩放
                start: 0,            //默认数据初始缩放范围为10%到90%
                end: 100
            }
        ],
        legend: {   //图表上方的类别显示
            show: true,
            data: ['瞬时流量', '压力', '温度', '小时用量']   //从后台取 组成此数据
        },
        toolbox: {
            show: true,
            feature: {
                dataView: {readOnly: false},
                magicType: {type: ['line']},
                restore: {},
                saveAsImage: {}
            },
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [] //先设置数据值为空，后面用Ajax获取动态数据填入
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value}'
            }
        },
        series: [
            {
                name: '瞬时流量',
                type: 'line',
                data: [],
                symbol: 'circle',
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                },
                markLine: {
                    data: [
                        {type: 'average', name: '平均值'}
                    ]
                }
            },
            {
                name: '压力 (mPa)',
                type: 'line',
                data: [],
                symbol: 'circle',
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                },
                markLine: {
                    data: [
                        {type: 'average', name: '平均值'}
                    ]
                }
            },
            {
                name: '温度 （℃）',
                type: 'line',
                data: [],
                symbol: 'circle',
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                },
                markLine: {
                    data: [
                        {type: 'average', name: '平均值'}
                    ]
                }
            },
            {
                name: '小时用量',
                type: 'line',
                data: [],//先设置数据值为空，后面用Ajax获取动态数据填入
                symbol: 'circle',    //设置折线图中表示每个坐标点的符号；emptycircle：空心圆；emptyrect：空心矩形；circle：实心圆；emptydiamond：菱形
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                },
                markLine: {
                    data: [
                        {type: 'average', name: '平均值'}
                    ]
                }
            },
        ]
    };
    return option;
}

/**
 *  民用表的默认对象
 */
function meterOption() {
    var option = {
        title: {
            //text: '表计实时数据曲线图',
            subtext: ''
        },
        tooltip: {
            trigger: 'axis'
        },
        color: [
            '#d48265'
        ],
        dataZoom: [
            {
                type: 'inside',    //支持单独的滑动条缩放
                start: 0,            //默认数据初始缩放范围为10%到90%
                end: 100
            }
        ],
        legend: {   //图表上方的类别显示
            show: true,
            data: ['小时用量']   //从后台取 组成此数据
        },
        toolbox: {
            show: true,
            feature: {
                dataView: {readOnly: false},
                magicType: {type: ['line']},
                restore: {},
                saveAsImage: {}
            },
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: []    //先设置数据值为空，后面用Ajax获取动态数据填入
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value}'
            }
        },
        series: [
            {
                name: '小时用量',
                type: 'line',
                data: [],//先设置数据值为空，后面用Ajax获取动态数据填入
                symbol: 'circle',    //设置折线图中表示每个坐标点的符号；emptycircle：空心圆；emptyrect：空心矩形；circle：实心圆；emptydiamond：菱形
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                },
                markLine: {
                    data: [
                        {type: 'average', name: '平均值'}
                    ]
                }
            },
        ]
    };
    return option;
}

function  exportExl() {
    var id = judgementAreaTreeIsSelected();
    var temp={
        "areaId":id
    };
    Common.postExcelFile(temp,"/runtime/downRuntimeExcel");
}
