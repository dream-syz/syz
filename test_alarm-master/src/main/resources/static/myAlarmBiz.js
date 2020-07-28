let c = hdCommon;

let liveTable = new commTable();//右边表格
// let form = new comForm();
// let sModal = new comModal();//查看详情模态框
// let infoWrapper;
// let treeWrapper;
// let infoPanelBody;

// let myAlarmBus = {};
//设置表格列名
function getColumns() {
    return [
        { field: "id", title: "规则id", sortable: false },
        { field: "name", title: "规则名", sortable: false },
        { field: "times", title: "超过次数报警", sortable: false },
    ]
}

//设置表格每行数据
function getTableData() {
    return [
        {
            id: 100,
            name: "通讯异常",
            times: 1,
        },
        {
            id: 101,
            name: "饱和蒸汽异常",
            times: 1,
        },
        {
            id: 102,
            name: "压力异常",
            times: 1,
        }
    ]
}

//创建规则模型(左边模态框部分静态数据)
function getLeft() {
    return [
        {
            itemId: "clientTarget",
            label: { text: "数据集" },
            type: "input",
        },
        {
            itemId: "dataItem",
            type: "select",
            label: {
                text: "指标",
            },
            options: {
                content: [
                    { value: "1", text: "区域子表用量" },
                    { value: "2", text: "区域总表用量" },
                ]
            }

        },
        {
            itemId: "objDim",
            label: {
                text: "维度"
            },
            type: "select",
            options: {
                // type: "select",
                content: [
                    { value: "1", text: "计量点" },
                    { value: "2", text: "区域" },
                ]
            }

        },
        {
            itemId: "ruleNameJson",
            label: { text: "规则名称" },
            type: "input",
        },
        {
            itemId: "rulesJson",
            label: { text: "最大次数" },
            type: "input",
        },
        {
            itemId: "condition",
            label: {
                text: "条件",
            },
            type: "select",
            options: {
                type: "select",
                content: [
                    { value: "小于", text: "<" },
                    { value: "大于", text: ">" },
                    { value: "等于", text: "=" },
                    { value: "不小于", text: ">=" },
                    { value: "不大于", text: "<=" },
                    { value: "不等于", text: "!=" },
                    { value: "在之间", text: "between" },
                ]
            }
        },
        {
            itemId: "value1",
            label: { text: "值1" },
            type: "input",
        }
    ]



}
//创建规则模型(右边树组件部分静态数据)
function getRight() {
    return [
        { id: 202004300954608, name: "计量点实时数据集" },
        { id: 202004261729410, name: "表计小时同比环比数据集" },
        { id: 202004270927615, name: "表计日同比环比数据集" },
        { id: 202004271149328, name: "表计月同比环比数据集" },
        { id: 202004271159263, name: "表计小时总表同比环比数据集" },
        { id: 202004271159482, name: "表计小时子表同比环比数据集" },
        { id: 202004271308166, name: "区域小时同比环比数据集" }, 
        { id: 202004280910708, name: "表计子表日同比环比数据集" },
        { id: 202004280915072, name: "区域日同比环比数据集" },
        { id: 202004281051379, name: "表计子表月同比环比数据集" },
        { id: 202004281051265, name: "表计总表月同比环比数据集" },
        { id: 202004281052779, name: "区域月同比环比数据集" },
        { id: 202004301117616, name: "计量点峰时同比环比数据集" },
        { id: 202004301416593, name: "计量点谷时同比环比数据集" },
        { id: 202004301655781, name: "计量点峰时总表同比环比数据集" },
        { id: 202004301654487, name: "计量点峰时子表同比环比数据集" },
        { id: 202004301658479, name: "区域峰时同比环比数据集" },
        { id: 202004301708360, name: "计量点谷时总表同比环比数据集" },
        { id: 202004301707888, name: "计量点谷时子表同比环比数据集" },
        { id: 202004301710550, name: "区域谷时同比环比数据集" },
        { id: 202005091116269, name: "计量点聚合实时数据集" },
        { id: 202005211516589, name: "表计小时用量与计划用量数据集" },
        { id: 202005211523783, name: "表计日用量与计划用量数据集" },
        { id: 202005211531912, name: "表计峰时用量与计划用量数据集" },
        { id: 202005211537563, name: "表计谷时用量与计划用量数据集" },
        { id: 202005211552799, name: "表计月用量与计划用量数据集" }
    ]
}

//设置模态框：修改规则
function setRuleModal() {
    return [
        {
            id: "ruleNameJson",
            inputType: "text",
            name: "规则名称",
        }, {
            id: "rulesJson",
            inputType: "text",
            name: "最大次数",
        }, {
            id: "condition",
            inputType: "select",
            name: "条件",
            options: [
                {
                    optionId: "1",
                    optionName: "小于"
                }, {
                    optionId: "2",
                    optionName: "大于"
                }, {
                    optionId: "3",
                    optionName: "不大于"
                }, {
                    optionId: "4",
                    optionName: "不小于"
                }, {
                    optionId: "5",
                    optionName: "等于"
                }, {
                    optionId: "6",
                    optionName: "在之间"
                }, {
                    optionId: "7",
                    optionName: "不等于"
                }
            ]
        }, {
            id: "value",
            inputType: "text",
            name: "值",
        }
    ]

}
//修改规则模态框属性对应的值
function getRuleModalValue() {
    return [
        {
            itemId: "ruleNameJson",
            label: {
                text: "规则名称"
            },
            value: "通讯异常",
            type: "browse"                                                     //现有select,input,textarea(小写)
        }, {
            itemId: "rulesJson",
            label: {
                text: "最大次数"
            },
            value: "1",
            type: "browse"                                                     //现有select,input,textarea(小写)
        }, {
            itemId: "condition",
            label: {
                text: "条件"
            },
            value: "<",
            type: "select",                                                    //现有select,input,textarea(小写)
            options: {                                                              //现在不接收地址，参数要确定
                content: [
                    {
                        value: "<",
                        text: "<"
                    },
                    {
                        value: ">",
                        text: ">"
                    },
                    {
                        value: "=<",
                        text: "=<"
                    },
                    {
                        value: ">=",
                        text: ">="
                    },
                    {
                        value: "=",
                        text: "="
                    },
                    {
                        value: "between",
                        text: "between"
                    },
                    {
                        value: "!=",
                        text: "!="
                    },
                ]
            }
        }, {
            itemId: "value",
            label: {
                text: "值"
            },
            value: "20",
            type: "browse"                                                     //现有select,input,textarea(小写)
        }
    ]
}

// 设置模态框：查看规则详情
//模态框属性
function setModal() {
    return [
        {
            id: "dataList",
            inputType: "text",
            name: "数据集",
        }, {
            id: "quotaList",
            inputType: "text",
            name: "指标",
        }, {
            id: "dimList",
            inputType: "text",
            name: "维度",
        }, {
            id: "ruleNameJson",
            inputType: "text",
            name: "规则名称",
        }, {
            id: "rulesJson",
            inputType: "text",
            name: "最大次数",
        }, {
            id: "condition",
            inputType: "text",
            name: "条件",
        }, {
            id: "value",
            inputType: "text",
            name: "值",
        }
    ]

}
//规则详情模态框属性对应的值
function getModalValue() {
    return [
        {
            itemId: "dataList",
            label: {
                text: "数据集"
            },
            value: "通讯异常",
        }, {
            itemId: "quotaList",
            label: {
                text: "指标"
            },
            value: "通讯异常",
        }, {
            itemId: "dimList",
            label: {
                text: "维度"
            },
            value: "202002280915584",
        }, {
            itemId: "ruleNameJson",
            label: {
                text: "规则名称"
            },
            value: "通讯异常",
        }, {
            itemId: "rulesJson",
            label: {
                text: "最大次数"
            },
            value: "1",
        }, {
            itemId: "condition",
            label: {
                text: "条件"
            },
            value: ">=",
        }, {
            itemId: "value",
            label: {
                text: "值"
            },
            value: "20",
        }
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
