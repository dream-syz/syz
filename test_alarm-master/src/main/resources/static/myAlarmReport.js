$(document).ready(function () {
    getConst();
    initTable();
    initConditionQuery();
});

function getConst() {
    infoWrapper = $("#runTimePanel");
    infoPanelBody = $("#infoPanelBody");

}

function initTable() {
    liveTable.init({
        tableID: "liveDataTable",
        queryTableParams: getQueryTableParams(),
        orderNumber: true,
        checkbox: false,
        isNeedDetails: true,
        details: getDetailsButton(),
        otherDetailsArr: ["delDetails"],
        delDetails: delDetails,
        isNeedOperate: false,

    },
        {
            columns: getColumns(),
            search: false,
            sidePagination: "client",
            pageSize: [10000],
            responseHandler: responseHandler,
        }
    );
}

//返回表格的参数数据如果值为空则返回''
function getQueryTableParams() {
    var name = $("#fault_name").val();
    var dataParam = { "name": name };
    if (name === '') {
        dataParam = {};
    }
    return dataParam;
}

//报表中展示报警详情
function getDetailsButton() {
    return '<button type="button" class="delDetails btn-primary btn-xs">&nbsp;查看报警详情&nbsp;</button>&nbsp;&nbsp;'
}

//下载报表按钮事件
function initConditionQuery() {
    var toolbar = $("#toolbar");

    var addF = {
        itemId: "downloadAlarmReport",
        label: {
            text: "下载报表"
        },
        type: "button",
        options: {
            buttonType: "download"
        },
        event: {
            onclick: downloadAlarmReport                                                      //方法名
        }
    };

    var add = new comItem();
    add.oInit(addF);

    toolbar.append(add.getDom());

    //未完成应该是
    function downloadAlarmReport() {

        var handler = function () {
            let columns = c.returnAjaxObj("/AlarmReport/downloadAlarmReport", null);
        };

        c.confirm("是否下载报警报表", handler);
    }
}

//用来查看报警历史记录的
function delDetails(e, value, row, index) {
    window.location.replace("/alarmHistory");
}

//响应处理器函数
function responseHandler(res) {
    let datas = [];

    res.rows.forEach((ele) => {
        let oneData = {
            alarmObjId: ele.alarmObjId,
            alarmObjName: ele.alarmObjName
        };

        ele.alarmReportItems.forEach((eleItem) => {
            oneData[eleItem.ruleId] = eleItem.count;
        });

        datas.push(oneData);
    });

    return datas;
}
