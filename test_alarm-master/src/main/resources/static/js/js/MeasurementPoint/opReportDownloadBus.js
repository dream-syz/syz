let c = hdCommon;

let areaTree = new hdTree();
let reportDownloadTable = new commTable();

let infoWrapper;
let treeWrapper;
let infoPanelBody;

function getColumns() {
    return [
        {
            title: '文件标题',
            field: "fileName"
        },
        {
            title: '文件类别',
            field: "fileType"
        },
        {
            title: '描述',
            field: "description"
        },
        {
            title: '创建时间',
            field: "crtTime"
        }
    ];
}

function getReportList() {
    return [
        {
            name: '特制历史峰谷报表',
            id: 0
        },
        {
            name: '特制日统计报表',
            id: 1
        },
        {
            name: '昼夜统计报表',
            id: 2
        }
    ];
}
