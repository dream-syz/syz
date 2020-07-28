let c = hdCommon;

let liveTable = new commTable();//报警信息表
// let myAlarmBus = {};

//设置表格列名
function getColumns() {
    return [
        { field: "strategyName", title: "策略名" },
        { field: "alarmObjName", title: "报警对象名" },
        { field: "reason", title: "报警原因" },
        { field: "orSend", title: "是否发送消息" },
        { field: "sendTime", title: "消息发送时间"}
    ]
}

//设置表格每行数据
function getTableData() {
    return [
        {
            strategyName: "压力异常",
            // alarmObjName: "",
            reason: "压力异常",
            orSend: "已发",
            sendTime:"2020-06-04 00:00:00"

        },
        {
            strategyName: "通讯异常",
            // alarmObjName: "",
            reason: "通讯异常",
            orSend: "已发",
            sendTime:"2020-06-04 17:05:00"
        },
        {
            strategyName: "饱和蒸汽异常",
            // alarmObjName: "",
            reason: "饱和蒸汽异常",
            orSend: "已发",
            sendTime:"2020-06-04 00:00:00"
        }
    ]
}


//----------------------------------------------------------------

let alertNum = 0;
function initAlertComponent() {
    let userId = ACCESS_PERMISSION.getCurrentUserInfo().userId;
    var stompClient = null;
    var host = "http://192.168.1.126:8193";    //gateway网关的地址
    var socket = new SockJS(host + '/myUrl' + '?token=' + userId);
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        //监听的路径以及回调
        stompClient.subscribe('/user/queue/alarmmsg', function (response) {
            createAlert(response.body)
        });
    });

    function createAlert(data) {
        let comp = new CompAlert();
        alertNum++;
        comp.init({
            name: 'test',
            data: {
                title: '报警' + alertNum,
                type: 'warning',
                description: data + ' <a href="/historyReportNew" target="_blank" class="alert-link">去查看</a>',
                effect: 'light',
            }
        });
    }
}