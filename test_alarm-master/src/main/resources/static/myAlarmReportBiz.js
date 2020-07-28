let c = hdCommon;
let liveTable = new commTable();//右边表格

//表格列名
function getColumns() {
    return [
        { checkbox: true},
        { field: "alarmObjId", title: "报警对象编号", sortable: false },
        { field: "alarmObjName", title: "报警对象", sortable: false },
        { field: "1", title: "压力异常", sortable: false },
        { field: "2", title: "饱和蒸汽异常", sortable: false },
        { field: "3", title: "通讯异常", sortable: false },
    ]
}