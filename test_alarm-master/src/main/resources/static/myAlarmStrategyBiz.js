let c = hdCommon;
let liveTable = new commTable();//声明右边表格

//设置表格列名
function getColumns() {
    return [
        {
            checkbox: true,
        },
        {
            field: "id",
            title: "策略id",
            align: 'center',
            visible: true
        }, {
            field: "name",
            title: "策略名",
            align: 'center',
        }, {
            field: "description",
            title: "策略描述",
            align: 'center'
        }, {
            field: "orEnable",
            title: "是否启动",
            align: 'center'
        }
    ]
}
//设置表格每行数据
function getTableData() {
    return [
        {
            id: 64,
            name: "压力异常",
            description: "压力异常",
            orEnable: "否"

        },
        {
            id: 65,
            name: "饱和蒸汽异常",
            description: "饱和蒸汽异常",
            orEnable: "否"
        },
        {
            id: 66,
            name: "通讯异常",
            description: "通讯异常",
            orEnable: "否"
        }
    ]
}

//设置模态框查看策略详情
function setModal() {
    return [
        {
            id: "strategyName",
            inputType: "text",
            name: "策略名",
        }, {
            id: "rule",
            inputType: "text",
            name: "规则",
        }, {
            id: "cron",
            inputType: "text",
            name: "表达式",
        }, {
            id: "alarmObj",
            inputType: "text",
            name: "报警对象",
        }, {
            id: "orEnable",
            inputType: "text",
            name: "是否启动",
        }, {
            id: "orNotice",
            inputType: "text",
            name: "是否开启通知",
        }, {
            id: "noticeType",
            inputType: "text",
            name: "通知方式",
        }, {
            id: "noticeObj",
            inputType: "text",
            name: "通知对象",
        }
    ]

}

//策略详情模态框属性对应的值
function getModalValue() {
    return [
        {
            itemId: "strategyName",
            label: {
                text: "策略名"
            },
            value: "压力异常",
        },
        {
            itemId: "rule",
            label: {
                text: "规则"
            },
            value: "压力异常",
        },
        {
            itemId: "cron",
            label: {
                text: "表达式"
            },
            value: "0/10***?",
        },
        {
            itemId: "alarmObj",
            label: {
                text: "报警对象"
            },
            value: "朱建波餐饮",
        },
        {
            itemId: "orEnable",
            label: {
                text: "是否启动"
            },
            value: "否",
        },
        {
            itemId: "orNotice",
            label: {
                text: "是否开启通知"
            },
            value: "是",
        }, {
            itemId: "noticeType",
            label: {
                text: "通知方式"
            },
            value: "短信通知",
        },
        {
            itemId: "noticeObj",
            label: {
                text: "通知对象"
            },
            value: "mist",
        }
    ]
}

//创建策略模型(左边模态框部分静态数据)
function getLeft() {
    return [
        {
            itemId: "strategyName",
            label: { text: "策略名" },
            type: "input",
        },
        {
            itemId: "rule",
            type: "select",
            label: {
                text: "规则",
            },
            options: {
                content: [
                    { value: "102", text: "压力异常" },
                    { value: "100", text: "通讯异常" },
                    { value: "101", text: "饱和蒸汽异常" },
                ]
            }

        },
        {
            itemId: "cron",
            label: { text: "表达式" },
            type: "input",
        },
        {
            itemId: "deadTime",
            label: { text: "沉默时间" },
            type: "input",
        },
        {
            itemId: "strategyDescription",
            label: { text: "策略说明" },
            type: "areaText",
        },
        {
            itemId: "alarmObjList",
            label: { text: "选择报警对象(右侧树勾选)" },
            type: "dataItem",
        },
        {
            itemId: "orEnable",
            type: "select",
            label: {
                text: "是否启动",
            },
            options: {
                content: [
                    { value: "1", text: "是" },
                    { value: "0", text: "否" },
                ]
            }
        },
        {
            itemId: "orNotice",
            type: "select",
            label: {
                text: "是否开启通知",
            },
            options: {
                content: [
                    { value: "1", text: "是" },
                    { value: "0", text: "否" },
                ]
            }
        },
    ]

}

//创建策略模型(右边树组件部分静态数据)
function getRight(){
    return[
        {id: 114805, name: "长沙市万时红食品饮料有限公司"},
        {id: 319081, name: "湖南天味食品配料有限公司（表1）"},
        {id: 297731, name: "湖南浏阳河饲料有限公司）"},
        {id: 786301, name: "京港化工"},
        {id: 800945, name: "浏阳市明发管业有限公司"},
        {id: 200842, name: "湖南欧亚药业有限公司"},
        {id: 930072, name: "湖南圆通药业有限公司"},
        {id: 730943, name: "长沙普济生物科技股份有限公司"},
        {id: 432505, name: "长沙苍绒纺织品有限公司"},
        {id: 395592, name: "湖南坛坛香食品科技有限公司"},
        {id: 161901, name: "湖南味香源生物科技有限公司（表2）"},
        {id: 181233, name: "湖南味香源生物科技有限公司（表1）"},
    ]
}

//-------------------------------------------------------------------------------------------------------------------
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
