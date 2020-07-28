/*
    var alarmHst = (function () {


           var alarmHistory = new Object();

            alarmHistory.tableHead=[{
               checkbox: true
           }, {
               field: 'id',
               title: '编号',
               align: 'center',
               visible:false
           }, {
               field: 'mpId',
               title: '表计编号',
               align: 'center',
               visible:false
           }, {
               field: 'mpName',
               title: '表计名称',
               align: 'center',
           }, {
               field: 'strategyDes',
               title: '故障描述',
               align: 'center',
               cellStyle:function (value, row, index, field) {
                return {
                css: {"color": "red", "font-size": "15px"} };
              }
           },{
               field: 'devTypeId',
               title: '设备类型编号',
               align: 'center',
               visible:false
           }, {
               field: 'devTypeName',
               title: '设备类型',
               align: 'center',
           },{
               field: 'versionId',
               title: '设备型号',
               align: 'center',
               visible:false
           }, {
               field: 'ruleId',
               title: '规则编码',
               align: 'center',
               visible:false
           }, {
               field: 'ruleName',
               title: '规则名称',
               align: 'center',
           },{
               field: 'happenTime',
               title: '发生时间',
               align: 'center',
           },{
               field: 'state ',
               title: '状态',
               align: 'center',
               formatter: function (value, row, index) {
                   if (row['state'] == "0") {
                       return '未恢复';
                   } else if (row['state'] == "1") {
                       return '已恢复';
                   } else {
                       return '已失效';
                   }
               }
           },{
               field: 'noticeId',
               title: '通知方式编号',
               align: 'center',
               visible:false
           },{
               field: 'noticeDes',
               title: '通知方式',
               align: 'center',
           },{
               field: 'strategyId',
               title: '策略编号',
               align: 'center',
               visible:false
           }];

           alarmHistory.initAlarmInfo = function () {
                //alarmHistory.initSelectpicker();
                alarmHistory.initTable($('#tb_alarm_info'),'alarm/listAlarmInfo',alarmHistory.tableHead);
               setInterval(alarmHistory.conditionalQuery,60000);
            };

           alarmHistory.conditionalQuery = function () {
                $("#tb_alarm_info").bootstrapTable("refresh");
           };

           alarmHistory.batchCloseAlarmInfo = function(){

               if($("#tb_alarm_info").isSelections()){
                 var alarmList = $("#tb_alarm_info").getSelectionsById("id");
                   $("#del_alarm_model").modal("show");
                   //给确定按钮绑定点击事件
                   $("#submit_del").click(function () {
                       commonDelAlarmInfo("alarm/batchCallOffByAlarmInfo",alarmList);
                   });

               }else{
                   Common.showMessageCon("请勾选需要关闭的报警信息");
               }

           };

           /!*alarmHistory.initSelectpicker = function () {

               $(".selectpicker").selectpicker({
                   noneSelectedText: '请选择',
               });

               Common.getSelectPickerList($("#alarm_state"), "alarm/getAlarmState","code","description");

               Common.clickChangeColorByTable($('#tb_alarm_info'));

               datePicker.init($("input[name='happenTime']"), $("#happenTime"), $("#startTime"), $("#endTime"));

           };*!/

            alarmHistory.initTable = function (element,url,columns) {

                element.initTable({
                    url: url,
                    pageSize :15,   //每页显示多少行
                    isNeedRequestHeader:false,      //是否需要请求表头
                    clickToSelect: true,//单击选中行
                    isNeedOperation : true,
                    isOtherOperation:['remove'],
                    uniqueId : 'id',
                    columns: columns,
                    queryParams : function(params) { //查询参数事件
                        return "parameter="+getAlarmDataJson(params);
                    },
                    operater :function (value, row, index) {
                        return alarmStatus();
                    },
                    remove :function (e, value, row, index) { //删除(废弃)事件
                        delAlarmInfoModels(e, value, row, index);
                    }
                });
            };

            function delAlarmInfoModels(e, value, row, index) {
                $("#del_alarm_model").modal("show");
                //给确定按钮绑定点击事件
                $("#submit_del").click(function () {
                    delAlarmInfoEvents("alarm/callOffByAlarmInfo",row);
                });
            }

            function delAlarmInfoEvents(url,row) {
                var temp ={
                    id:row.id,
                    state:"2"
                };

                commonDelAlarmInfo(url,temp);
            };

            function commonDelAlarmInfo(url,alarmList) {

                Common.defaultCommonAjax(url,true,"parameter=" +JSON.stringify(alarmList),
                    function (datas) {
                        Common.showMessageCon("关闭成功");
                        $("#del_alarm_model").modal("hide");
                        $("#tb_alarm_info").bootstrapTable("refresh");
                        $("#submit_del").unbind("click");//取消绑定事件

                    },function (datas) {
                        Common.showMessageCon("关闭失败");
                        $("#submit_del").unbind("click");//取消绑定事件
                    });
            }


            function alarmStatus() {
                var remove='<button  type="button"  class="remove btn btn-primary  btn-xs"  title="关闭">关闭</button>';
                var temp = [];temp.push(remove);
                return temp.join('')
            }

            function getAlarmDataJson(params) {
                var temp = judgeIsEmpty();

                temp.page = {
                    pageLine: params.limit,   //页面大小
                    pageIndex: params.offset/params.limit+1  //页码
                };

                return JSON.stringify(temp);
            }

            function judgeIsEmpty() {
               var mpName=$.trim($("#fault_name").val());
               var state=$.trim($("#alarm_state").val());
               var happenTime=$("#happenTime").val();
               var temp={
                   mpName:mpName=="" ? null:mpName,
                   state:state=="" ? "0":state,
               };
               if(Common.isNull(happenTime)){
                   var time= Common.splitTime(happenTime);
                   temp.happenTime=$.trim(time[0]);
                   temp.deadline=$.trim(time[1]);
               }
               return temp;
            }


    return alarmHistory;
}());*/


$(document).ready(function () {
    //default selected

    //var height = document.documentElement.clientHeight;
    /* $("#treepanel").height((height - $("#head-top-model").height()) * 0.90);
     $("#iframe-page-content").height($("#treepanel").height());*/
    //设置树的滚动条的高度
    /* $("#treebody").height($("#treepanel").height() * 0.93);*/
    var table = new commTable();
    alarmInfo.initTable(table);

});
var alarmInfo = (function () {
    var my = {};
    my.initTable = function (table) {
        table.init({
                tableID: 'tb_alarm_info',
                dataUrl: "/AlarmConfig/queryAlarInfo",
                dataParam: {
                    data: JSON.stringify(getResultDataJson()),
                    contentType: "application/json"
                },
                loadMethod: 'button',                                                           //默认是scroll 需要其他的写button
                orderNumber: true,
                checkbox: false,
                isNeedOperate: false,
                isNeedDetails: false,
                otherOperationArr: [],
                otherDetailsArr: [],
                queryTableParams: function () {
                    return getResultDataJson();
                },
            }, {

                showRefresh: true,
                showExport: false,
                showColumns: true,
                search: false,
                key: 'id',
                //height: panelHeight,
                // sidePagination: 'client',
                pageNumber: 1,
                pageSize: [12],
                columns: tableHead.slice(1, tableHead.length),

                onDblClickRow: function (row, $element, field, index) {
                    console.log(index);
                },
                responseHandler: function (data) {
                    console.log(data);
                    return data.rows;
                }
            }
        )
    };
    return my;
})();

var tableHead = [{
    checkbox: true,
}, {
    field: "strategyName",
    title: "策略名",
    align: 'center',
}, {
    field: "alarmObjName",
    title: "报警对象名",
    align: 'center'
}, {
    field: "reason",
    title: "报警原因",
    align: 'center'
}, {
    field: "orSend",
    title: "是否发送消息",
    align: 'center'
}, {
        field: "sendTime",
        title: "消息发送时间",
        align: 'center'
    }];


function getResultDataJson() {
    return {
        "strategyName":$("#fault_name").val()
    };
}

function queryAlarmInfo() {
    $("#tb_alarm_info").bootstrapTable("refresh")
}
