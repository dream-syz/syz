        $(document).ready(function () {

            HistoricalReport.fixedHeight();//固定高度
            HistoricalReport.loadHtml();//导入头部页面
            HistoricalReport.initAreaTree($("#treeview"),"roleArea/getAreasBySysUser","id=0");//初始化区域树

            Common.getSelectPickerList($("#customerType"),"getCustomerType","id","name");
            Common.getSelectPickerList($("#meterType"),"getMeterType","id","name");

            var oButtonInit = new ButtonInit();
            oButtonInit.Init();
    });




    /*-----------------------------------------------------------重构---------------------------------------------------*/

        var  HistoricalReport =  (function () {

            var MpHistorical = new Object();

            var SELECTED_ID = "Metertreeview";

            var AREA_ID = "areaId"; var MP_ID = "mpId";

            MpHistorical.fixedHeight = function () {
                var windowHeight = $(window).height();
                //设置树的面板高度
                $("#treepanel").height((windowHeight- $("#head-top-model").height())*0.90);
                //设置树的滚动条的高度
                $("#treebody").height($("#treepanel").height()*0.90-$("#searchRegion").height());

                //设置树的面板高度
                $("#Meterpanel").height($("#treepanel").height());
                //设置树的滚动条的高度
                $("#Meterbody").height($("#Meterpanel").height()*0.82-$("#searchMeter").height());

                $("#Reportform").height(($("#Meterpanel").height()-$("#SearchReport").height())*0.97);

                //设置搜索框的宽度
                $("#searchMeter").width($("#Metertreeview").width());
                $("#searchRegion").width($("#treeview").width());

                $(window).resize();
            };

            MpHistorical.loadHtml = function () {
                $('#head-top-model').load("menuTop #headMenu");
                topMenu.Init("0","index","authority/getAuthoritysBySysUserAndMenuCode","historicalReport");
                $('#modal-frame-tip').load("tipModel #general-modal-frame");
            };

            /**
             * 初始化区域树
             * @param element
             * @param parameter
             */
            MpHistorical.initAreaTree = function (element,url,parameter) {

                Common.initTreeView(element,url,parameter);

                element.on('nodeSelected',function(event, data) {

                    MpHistorical.clearMeterSelectedAndInput();

                    var datas = element.buildDomTree("meters/getMeterInfoByPage","parameter="+BuildingJSON(data));

                    MpHistorical.buildMeterTree($("#Metertreeview"),datas);
                });

            };

            MpHistorical.regionKeyDown = function(event){

                var pattern = $.trim(event.value);

                if("" == pattern){

                    this.initAreaTree($("#treeview"),"roleArea/getAreasBySysUser","id="+0);

                }else{

                    this.fuzzyQueryAreaTree($("#treeview"),"area/getAreasByLikeAreaName","condition="+pattern);
                }
            };

            MpHistorical.buildMeterTree = function(element,node){

                Common.initTreeViewByDatas(element,node); //根据已经得到格式化的数据 去初始化树

                element.on('nodeSelected',function(event, data) {

                    ReportTable.checkRadioSelected();
                    initTables($(":radio:checked").val());
                });
            };

            MpHistorical.fuzzyQueryAreaTree = function(element,url,parameter){

                Common.initTreeView(element,url,parameter);
            };

            /**
             *    撤销键 清空用户类型和表计类型 以及输入框中的值
             *
             */
            MpHistorical.clearMeterSelectedAndInput = function () {
                document.getElementById("customerType").options.selectedIndex = 0; //回到初始状态
                $("#customerType").selectpicker('refresh');//对customerType这个下拉框进行重置刷新

                document.getElementById("meterType").options.selectedIndex = 0; //回到初始状态
                $("#meterType").selectpicker('refresh');//对meterType这个下拉框进行重置刷新
                $('#txt_Meter').val("");
            };


            MpHistorical.customerChangesEvents = function (obj) {

                var customerValue = obj.options[obj.selectedIndex].value;
                var meterValue = $('#meterType').val();

                changesEvents(customerValue,meterValue,$('#txt_Meter'));
            };

            MpHistorical.meterChangesEvents = function (obj) {

                var meterValue = obj.options[obj.selectedIndex].value;
                var customerValue = $('#customerType').val();

                changesEvents(customerValue,meterValue,$('#txt_Meter'));
            };

            MpHistorical.searchMeterByName = function () {

                   searchMeter();
            };

            MpHistorical.meterKeyDown = function (event) {

                var e = event || window.event || arguments.callee.caller.arguments[0];

                if (e && e.keyCode == 13) { // enter 键

                    searchMeter();
                }
            };

            MpHistorical.tabOnclick = function (event) {

                var obj = event.value;
                initTables(obj);

            };

            MpHistorical.meterDataQuery = function () {

                if($('#Metertreeview .list-group').length
                    && $('#Metertreeview .list-group ').length >0){

                    if(judgeSelected($("#Metertreeview"))){

                        ReportTable.checkRadioSelected();
                        initTables($(":radio:checked").val());

                        return true;
                    }
                }

                Common.showMessageCon("请选择表计!");
            };



            MpHistorical.exportMeterDetailByVendor = function () {

                var mpId = MpHistorical.judgmentIsSelected($('#Metertreeview'));

                commonExport($("#history_date").val(),$("#dateInterval").val(),"9",
                    "exportMeter/exportMeterDetail",mpId,MP_ID);
            };

            MpHistorical.exportAreaDetail = function () {

                var areaId = MpHistorical.judgmentIsSelected($("#treeview"));

                commonExport($("#history_date").val(),$("#dateInterval").val(),"9",
                    "exportMeter/exportMpDetailByDateRangeAndAreaId",areaId,AREA_ID);
            };

            MpHistorical.exportAreaDValueReport = function(){

                var areaId = MpHistorical.judgmentIsSelected($("#treeview"));

                commonExport($("#history_date").val(),$("#dateInterval").val(),"9",
                    "exportMeter/exportAreaDValueReport",areaId,AREA_ID);
            };


            MpHistorical.exportMpDetailByCustomer = function () {

                var mpId = MpHistorical.judgmentIsSelected($('#Metertreeview'));

                commonExport($("#history_date").val(),$("#dateInterval").val(),"9",
                    "exportMeter/exportMpDetailByDateRange",mpId,MP_ID);
            };
            
            function commonExport(createTime,timeInterval,reportId,url,id,key) {

                if(typeof timeInterval == 'undifined'){
                    timeInterval = "";
                }

                var temp = {
                    reportId:reportId,
                    timeInterval :"" != timeInterval ? timeInterval:null
                };

                if(key == AREA_ID){
                    temp.areaId = "" != id ? id :null;
                }

                if(key == MP_ID){
                    temp.mpId = "" != id ? id :null;
                }

                if(Common.isNull(createTime)) {

                    Common.setDateTimeToTemp(temp,createTime);
                    Common.postExcelFile(temp,url);
                    return true;
                }

                Common.showMessageCon("请选择日期 ! ! !");
            }



            function changesEvents(customerValue,meterValue,input) {

                var txtValue = $.trim(input.val());
                var datas = selectChangesEvents(customerValue,meterValue,txtValue);

                MpHistorical.buildMeterTree($("#Metertreeview"),datas);
            }

            function searchMeter() {

                var customerType = $('#customerType').val();
                var meterValue = $('#meterType').val();
                var txtValue = $.trim($('#txt_Meter').val());

                var datas = selectChangesEvents(customerType,meterValue,txtValue);

                MpHistorical.buildMeterTree($("#Metertreeview"),datas);
            }

            function  selectChangesEvents(customerType,meterValue,txtValue) {

                var regionId = MpHistorical.judgmentIsSelected($('#treeview'));

                return vagueQueryMeter(customerType,meterValue,txtValue,regionId);
            }

            /**
             *  表计搜索输入框事件
             */
            function vagueQueryMeter(customerType,meterValue,txtValue,regionId) {

                callbackCount = 1;

                var json = MpHistorical.getSelectJsonData(customerType,meterValue,txtValue,regionId);

                var flag = $.isEmptyObject(json);

                json.page = {

                    pageLine: params_limit,   //页面大小
                    pageIndex: callbackCount  //页码

                };

                if(!flag){

                    return $("#Metertreeview").buildDomTree("meters/getMeterInfoByPage","parameter="+
                        JSON.stringify(json));
                }
                return [];
            }

            /**
             *  判断是否选择区域
             * @returns {boolean}
             */
            function judgeSelected(element) {

                var value = MpHistorical.judgmentIsSelected (element);

                if(Common.isNull(value)){

                    return true;
                }
                return false;
            }

            MpHistorical.judgmentIsSelected = function (element) {

                var select_node = element.treeview('getSelected');

                if(select_node[0] && select_node[0].id != SELECTED_ID){

                    return select_node[0].id;
                }
                return "";//返回一个空字符串
            };

            MpHistorical.getSelectJsonData = function(customerType,meterValue,txtValue,regionId) {

                var  data = {
                    customerType:"" != customerType ? customerType :null,
                    areaId:"" != regionId ? regionId :null,
                    meterValue:"" != meterValue ? meterValue : null,
                    dataItemValue:"" != txtValue ? txtValue : null
                };

                return data;
            }

            function BuildingJSON(node) {

                callbackCount = 1;

                var temp ={
                    areaId:node.id
                };

                temp.page = {
                    pageLine: params_limit,   //页面大小
                    pageIndex: callbackCount,  //页码
                };

                return JSON.stringify(temp);
            }

            /*-------------------------------------------表格的js------------------------------------------------------------*/

            function initTables(type) {

                switch (type) {
                    case "9":
                        ReportTable.initTableMethod("report/queryMeterDetailInfo", "report/getMeterReportHeader", $("#Common_Report"), "2");
                        break;
                    case "5":
                        ReportTable.initTableMethod("report/queryMpDetailByPatron", "report/getDataItemsByReport", $("#Common_Report"), "-1");
                        break;
                    default:
                        ReportTable.initTableMethod("report/getPageMeterReports", "report/getDataItemsByReport", $("#Common_Report"), type);
                }
            }

            return MpHistorical;
        }());



    /*------------------------------------------------表格工具bar的js------------------------------------------------------*/

    var callbackCount = 1 ;
    var params_limit = 17;

    var ButtonInit = function () {

        var oInit = new Object();

        oInit.Init = function () {

            $(".selectpicker").selectpicker({
                noneSelectedText : '请选择',
            });

            Common.clickChangeColorByTable($('#Common_Report'));

            datePicker.init($("input[name='history_date']"),$("#history_date"),$("#history_startTime"),$("#history_endTime"));

            Common.initScrollBarAndCallbacks($(".col-lg-2 .panel-body"),function () {

                callbackCount++;

                var json = HistoricalReport.getSelectJsonData($('#customerType').val(),$('#meterType').val(),
                    $.trim($('#txt_Meter').val()),HistoricalReport.judgmentIsSelected($('#treeview')));

                 json.page = {
                    pageLine: params_limit,   //页面大小
                    pageIndex: callbackCount  //页码
                };

                var data = $("#Metertreeview").buildDomTree("meters/getMeterInfoByPage","parameter="+
                    JSON.stringify(json));

                for ( var i = 0 ;i <data.length ; i++){

                    $("#Metertreeview").treeview("addNode", [-1, {node: data[i]}]);
                }

            });
        };

        return oInit;
    };

        /*------------------------------------------------统一报表 表格的js------------------------------------------------------*/

        var ReportTable = (function () {

            var tabInit = new Object();

            tabInit.initTableMethod = function(url,requestHeaderUrl,elemnt,type){

                var column = tabInit.getTableHeadsBySwitchType(requestHeaderUrl,type);

                if(type == 6){

                  tabInit.initReportTableNotPage(url,elemnt,column);
                  return true;
                }
                tabInit.initReportTable(url,elemnt,column);
            };

            tabInit.initReportTable = function (url,elemnt,column) {

                elemnt.bootstrapTable('destroy');//先销毁表格

                elemnt.initTable(
                    {
                        url : url,//请求的url
                        pageSize :36, //每页显示多少行
                        isNeedOperation : false,  //是否需要操作列
                        isNeedRequestHeader:false,
                        columns:column,
                        height:620,
                        uniqueId : 'mpId',     //每一行的唯一标识，一般为主键列
                        queryParams : function (params) { //查询参数事件
                            return "parameter="+getRepotDataJson(params,true);
                        }
                    });

                elemnt.find('tbody').addClass("Report-body");
            };

            tabInit.initReportTableNotPage =  function(url,elemnt,column){

                elemnt.bootstrapTable('destroy');//先销毁表格

                elemnt.bootstrapTable(
                    {
                        method: 'post',
                        contentType:"application/x-www-form-urlencoded; charset=UTF-8",
                        locale: 'zh-CN',
                        showRefresh: true,
                        showPaginationSwitch: true,
                        showExport: true,
                        buttonsAlign: "right",
                        exportDataType: "basic",
                        showColumns: true,
                        exportTypes: [ 'excel', 'xlsx'],
                        Icons: 'glyphicon-export',
                        url : url,
                        pageNumber:1,
                        pageSize :36,
                        pagination: true,
                        pageList: [10, 15, 25, 50, 100],
                        sidePagination: "client",
                        columns:column,
                        height:620,
                        uniqueId : 'mpId',     //每一行的唯一标识，一般为主键列
                        ajaxOptions: {async:true,timeout:120000},
                        queryParams : function (params) { //查询参数事件
                            return "parameter="+getRepotDataJson(params,false);
                        },
                        responseHandler :function (res){

                            $.each(res, function (index, detail) {

                                $.each(detail.items, function (x, Item) {

                                    var val = Item.id;
                                    res[index][val] = Item.value;

                                });
                            });
                            return res;
                        }
                    });
            };

            tabInit.getTableHeadsBySwitchType = function (requestHeaderUrl,type) {

                var tableHead = returnTableHead();

                return  getTheHead(requestHeaderUrl,tableHead,type);
            };

            tabInit.checkRadioSelected = function () {

                var item = $(":radio:checked");

                if( item.length > 0 ){

                    return true;
                }else {

                    $('input[type="radio"]:eq(0)').parent('label').addClass('active');
                    $('input[type="radio"]:eq(0)').attr("checked", true);
                    return false;
                }

            };

            function getTheHead(url,newcolumns,type) {

                var mpId = HistoricalReport.judgmentIsSelected($('#Metertreeview'));

                var temp = {
                    mpId :""!= mpId ? mpId:null,
                    type:type
                };

                return $('#Metertreeview').requestHeader(url,newcolumns,"parameter="+JSON.stringify(temp));
            }


            function returnTableHead() {

                var tableHead = [{
                    field: 'mpId',
                    title: '表计编号',
                    align: 'center',
                    visible:false
                },{
                    field: 'mpName',
                    title: '表计名',
                    align: 'center',
                },{
                    field: 'dataTime',
                    title: '日期',
                    align: 'center',
                }];

                return tableHead;
            }


            function getRepotDataJson(params,flag) {

                tabInit.checkRadioSelected();

                var tabId = $(":radio:checked").val();

                var temp = judgeIsEmpty(tabId);

                if(flag){
                    temp.page = {
                        pageLine: params.limit,   //页面大小
                        pageIndex: params.offset/params.limit+1  //页码
                    };
                }

                return JSON.stringify(temp);
            }

            function judgeIsEmpty(dataType) {

                var createTime = $("#history_date").val();

                var mpId = HistoricalReport.judgmentIsSelected($('#Metertreeview'));

                var temp = {
                    type:dataType,
                    mpId :"" != mpId ? mpId :null,
                    reportId:dataType
                };
                if(Common.isNull(createTime)){
                    Common.setDateTimeToTemp(temp,createTime);
                }else{
                    defultTime(dataType,temp);
                }
                return temp;
            }

            function defultTime(dataType,temp) {
                var date = new Date();
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                switch(dataType){
                    case "2":
                        if (month < 10) month = "0" + month;
                        temp.startTime = year+"-"+month+"-01 00:00:00";
                        temp.endTime = Common.getYearMonthDayTime()+" 23:59:59";
                        break;
                    case "3":
                        temp.startTime = year+"-01-01 00:00:00";
                        temp.endTime = year+"-12-31 23:59:59";
                        break;
                    case "4":
                        break;
                    default:
                        var hour = date.getHours();
                        var minu = date.getMinutes();//得到分钟
                        if (hour < 10) hour = "0" + hour;
                        if (minu < 10) minu = "0" + minu;
                        temp.startTime = Common.getYearMonthDayTime()+" 00:00:00";
                        temp.endTime = Common.getYearMonthDayTime()+" "+hour+":"+minu+":59";
                }
            }

            return tabInit;
        }());