(function () {
    var AlarmReportTable = new commTable();
    var c = hdCommon;

    $(document).ready(function () {
        initTable();

        initConditionQuery();                        //初始化查询栏
    });

    function initTable() {
        AlarmReportTable.init(
            {
                dataParam: {data: getDataParam, contentType: "application/json",},
                tableID: "alarmReportTable",
                dataUrl: "/AlarmReport/queryAlarmReportByMonth",
                queryTableParams: getQueryTableParams,
                orderNumber: true,
                checkbox: false,
                isNeedDetails: true,
                details: getDetailsButton,
                otherDetailsArr: ["delDetails"],
                delDetails: delDetails,
                isNeedOperate: false,
            },
            {
                columns: getColumns(),
                search: false,
                height: "",
                sidePagination: "client",
                pageSize: [10000],
                responseHandler: responseHandler,
            },
        );
    }

    function getDataParam() {
        return JSON.stringify({});
    }

    function getQueryTableParams() {

    }

    function getDetailsButton() {
        return '<button type="button" class="delDetails btn-primary btn-xs">&nbsp;查看报警详情&nbsp;</button>&nbsp;&nbsp;'
    }

    function delDetails(e, value, row, index) {
        window.location.replace("/alarmHistory");
    }

    function getColumns() {

        let columns = c.returnAjaxObj("/AlarmReport/queryAlarmReportTableHead",null);

        if(null != columns){

            let tableHead = [{
                checkbox: true,
            }, {
                field: "alarmObjId",
                title: "报警对象编号",
                align: 'center'
            }, {
                field: "alarmObjName",
                title: "报警对象",
                align: 'center'
            }];

            columns.data.forEach((ele) => {
                let oneColumn = {
                    field: ele.ruleId,
                    title: ele.ruleName,
                    align: 'center'
                }
                tableHead.push(oneColumn);
            });

            return tableHead;
        }
    }

    function responseHandler(res) {
        let datas = [];

        res.rows.forEach((ele) => {
            let oneData = {
                alarmObjId:ele.alarmObjId,
                alarmObjName:ele.alarmObjName
            };

            ele.alarmReportItems.forEach((eleItem) => {
                oneData[eleItem.ruleId] = eleItem.count;
            });

            datas.push(oneData);
        });

        return datas;
    }

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

        function downloadAlarmReport(){

            var handler = function  () {
                let columns = c.returnAjaxObj("/AlarmReport/downloadAlarmReport",null);
            };

            c.confirm("是否下载报警报表", handler);
        }
    }

})()