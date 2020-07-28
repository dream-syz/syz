// let rtBus = myAlarmBus;
$(document).ready(function () {
    getConst();
    initTable();
});

function getConst() {
    infoWrapper = $("#runTimePanel");
    infoPanelBody = $("#infoPanelBody");
    // alarmInformationDataTable
    $table = $("liveDataTable");
    // $modal = $("#modal_department");
}

//表格初始化
function initTable() {
    liveTable.init({
        tableID: "liveDataTable",
        queryTableParams: getResultDataJson(),
        orderNumber: true,//表格是否需要序号
        checkbox: false,
        loadMethod: 'button',
        isNeedOperate: false,
        isNeedDetails: false,

    }, {
        key: "id",
        showExport: false,
        search: false,
        showClumns: true,
        showRefresh: true,
        sidePagination: "client",
        columns: getColumns(),
        data: getTableData(),
        pageNumber: 1,
        pageSize: [12],
        queryParamsType: '',
        onDblClickRow: onDblClickRow,
        responseHandler: function (data) {
            console.log(data);
            return data.data;
        }
    });

    //返回结果集json数据
    function getResultDataJson() {
        var name = $("#fault_name").val();
        var dataParam = { "name": name };
        if (name === '') {
            dataParam = {};
        }
        return dataParam;
    }

    //行点击事件
    function onDblClickRow(row, $element, field) {
        let expandFlag = $element[0].nextElementSibling.classList.value.indexOf("detail-view") > -1;//括号当中为检索项
        let rowEvent = expandFlag ? "collapseRow" : "expandRow";
        let index = $element[0].getAttribute('data-index');
        liveTable.hdstTable(rowEvent, index);
    }
}
function queryAlarmInfo() {
    $("#btn_alarm_query").bootstrapTable("refresh")
}