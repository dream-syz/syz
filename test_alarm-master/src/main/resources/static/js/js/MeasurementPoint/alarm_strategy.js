var dataItem;
var strategyId;

(function () {

    var alarmStrategyTable = new commTable();
    var $table;
    var $modal;

    $(document).ready(function () {
        var height = document.documentElement.clientHeight;
        $("#treepanel").height((height - $("#head-top-model").height()) * 0.90);
        $("#iframe-page-content").height($("#treepanel").height());
        //设置树的滚动条的高度
        $("#treebody").height($("#treepanel").height() * 0.93);
        initState();
        getConst();
        initTable();
        addStrategy();
    });

    function getConst() {
        $modal = $("#modal_department");
        $table = $("#tb_alarm_strategy");
    }

    var tableHead = [{
        checkbox: true,
    }, {
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
    }];

    function initTable() {
        alarmStrategyTable.init({
                tableID: "tb_alarm_strategy",
                dataUrl: "/AlarmConfig/queryAlarmStrategies",
                dataParam: {
                    data: JSON.stringify(getResultDataJson()),
                    contentType: "application/json"
                },
                loadMethod: 'button',                                                           //默认是scroll 需要其他的写button
                orderNumber: true,
                checkbox: false,
                isNeedOperate: true,
                isNeedDetails: true,
                otherOperationArr: ['update', 'start', 'stop'],
                otherDetailsArr: ['delDetails'],
                operate: function (value, row, index) {
                    return operateBtn(row);                                         //这个增加的按钮部分原本是公用的,获取到的内容需要return，现在单独写
                },
                queryTableParams: function () {
                    return getResultDataJson();
                },
                update: function (e, value, row, index) {
                    showUpdate(row, e);
                },
                start: function (e, value, row, index) {
                    showStart(row, e);
                },
                stop: function (e, value, row, index) {
                    showStop(row, e)
                },
                details: function () {
                    return addInfoButton();
                },
                delDetails: function (e, value, row, index) {
                    getDetails(e, value, row, index);
                }
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
    }

    function getResultDataJson() {
        var name = $("#fault_name").val();
        var state = $("#alarmStrategy_state").val();
        if (name === "") {
            name = null;
        }
        if (state === "") {
            state = null;
        }
        var dataParam = {
            "name": name,
            "orEnable": state
        };
        return dataParam;
    }

    function operateBtn(row) {
        var update = '<button type="button" class="update btn  btn-primary btn-xs">&nbsp;修改&nbsp;</button>&nbsp;&nbsp;';
        var blockUp;
        if (row.orEnable == "是") {
            blockUp = '<button type="button" class=" stop btn btn-primary  btn-xs" title="停止">停止</button>&nbsp;';
        } else {
            blockUp = '<button type="button" class=" start btn btn-primary  btn-xs" title="启动">启动</button>&nbsp;';
        }
        var temp = [];
        temp.push(update);
        temp.push(blockUp);
        return temp.join('');
    }

    function initState() {
        $("<option value=''>" + '-----' + "</option>").appendTo("#alarmStrategy_state");
        $("<option value=是>" + '启动' + "</option>").appendTo("#alarmStrategy_state");
        $("<option value=否>" + '停止' + "</option>").appendTo("#alarmStrategy_state");
    }

    function addInfoButton() {
        return '<button type="button" class="add btn delDetails btn-primary btn-xs">&nbsp;详情&nbsp;</button>&nbsp;&nbsp;'
    }

    function showStart(row, e) {
        var handFn = function () {
            let id = row.id;
            var param = {
                "id": id
            };
           // result = commReturnAjaxBodys("/AlarmConfig/startAlarmStrategies", param);
            feedback("/AlarmConfig/startAlarmStrategies", param,$modal, $table);
        };
        hdCommon.confirm("是否启动策略", handFn);

    }

    function showStop(row, e) {
        var result;
        var handFn = function () {
            let id = row.id;
            var param = {
                "id": id
            };
            //result = commReturnAjaxBodys("/AlarmConfig/stopAlarmStrategies", param);
            feedback("/AlarmConfig/stopAlarmStrategies", param,$modal, $table);
        };
        hdCommon.confirm("是否停止策略", handFn);
    }

    function showUpdate(row, e) {
        var conf = {
            id: 'updStrategyModel',
            frameObj: $('#modal_department'),
            title: '修改策略',
            eles: {
                forms: {
                    wrapperForm: {
                        options: {
                            formId: 'wrapperForm',
                        }
                    }
                }
            },
            callbacks: {
                onCommit: commitUpdateStrategy                                                              //这里是填写方法名
            }
        };
        var sModal = new comModal();
        sModal.init(conf);
        var wForm = sModal.eles.forms.wrapperForm;
        var itemsArr = commReturnAjaxBodys("rule/createModel/createUpdStrategyModel", null);
        var returnMsg = commReturnAjaxBodys("AlarmConfig/queryAlarmRules", {});
        var ruleId;
        $.each(returnMsg, function (index, value) {
            if (row.id == value.strategyId) {
                ruleId=value.id;
            }
        });
        itemsArr[0].value = row.name;
        itemsArr[2].value = row.alarmJobConf.el;
        itemsArr[3].value = row.deadTime;
        itemsArr[4].value = row.description;
       // itemsArr[5].value = row.orEnable;
        itemsArr[6].value = row.orEnable;
        strategyId = row.id;
        var initContent = transform(itemsArr);
        initContent[1].options.event = {
            onchange: refreshTree
        };
        initContent[7].options.event = {
            onchange: refreshContent
        };
        var formPanelConf = {
            title: "策略信息",
            css: {
                width: "48%",                                                                                        //百分数和px均接受
                height: "600px"
            },
            initContent: initContent
        };
        var formPanel = new comPanel();
        formPanel.oInit(formPanelConf);
        var treePanelConf = {
            title: "报警对象选择列表",
            css: {
                width: "50%",
                marginLeft: "10px",                                                                                        //百分数和px均接受
                height: "600px"
            },
            eles: {
                trees: {
                    "reportListSourceTree": {
                        tID: "reportListSourceTree",
                        nodes: {
                            data: getDataSetTreeNodes(ruleId)
                        },
                        setting: {
                            view: {
                                dblClickExpand: false,
                                showLine: true,
                                selectedMulti: false,
                                showIcon: true,
                                /* addHoverDom: addHoverDom,
                                 removeHoverDom: removeHoverDom,*/
                            },
                            data: {
                                simpleData: {
                                    enable: true,
                                    idKey: "id",
                                    pIdKey: "pId",
                                    rootPId: ""
                                }
                            },
                            check: {
                                enable: true,
                                chkboxType: {"Y": "ps", "N": "ps"}
                            },
                            callback: {
                                beforeClick: function (treeId, treeNode) {
                                },
                                onCollapse: function (event, treeId, treeNode) {
                                    // alert(treeNode.tId + ", " + treeNode.name);
                                },
                                onCheck: function (event, treeId, treeNode) {
                                    var flags = true;
                                    var content = wForm.layouts[0].items[5];
                                    console.log(treeNode);
                                    console.log(wForm.layouts[0].items[5]);
                                    var ids=[];
                                    $.each(content.confArr,function (index,value) {
                                        ids.push(value.field);
                                    });
                                    console.log(ids);
                                    if (treeNode.isParent) {
                                        if(treeNode.checked){
                                            $.each(treeNode.children, function (index, e) {
                                                if(e.checked){
                                                    var result = {
                                                        text: e.name,
                                                        field: e.id,
                                                    };
                                                    if(ids.length==0){
                                                        content.addItem(result);
                                                    }else {
                                                        if(ids.indexOf(e.id) <0){
                                                            content.addItem(result);
                                                        }
                                                    }
                                                }else {
                                                    content.deleteItem(e.id);
                                                }

                                            })

                                        }else {
                                            $.each(treeNode.children, function (index, e) {
                                                content.deleteItem(e.id);

                                            })
                                        }

                                    }else {
                                        if(treeNode.checked){
                                            var result = {
                                                text: treeNode.name,
                                                field: treeNode.id,
                                            };
                                            if(ids.length==0){
                                                content.addItem(result);
                                            }else {
                                                if(ids.indexOf(treeNode.id) <0){
                                                    content.addItem(result);
                                                }
                                            }

                                        }else {
                                            content.deleteItem(treeNode.id)
                                        }
                                    }

                                },
                                onExpand: function (event, treeId, treeNode) {
                                    // alert(treeNode.tId + ", " + treeNode.name);
                                },
                                onClick: function (event, treeId, treeNode) {
                                    console.log(treeNode.tId + ", " + treeNode.name + "refresh reportSelect");

                                }
                            },
                            edit: {
                                enable: true
                            }
                        }
                    }
                }
            }
        };

        var treePanel = new comPanel();
        treePanel.oInit(treePanelConf);
        wForm.appendLayout([formPanel, treePanel]);

        treePanel.eles.trees.init("reportListSourceTree");
        var reportListSourceTree = treePanel.eles.trees["reportListSourceTree"];

        if(row.alarmObjeList.length>0){
            var treeData = treePanel.conf.eles.trees.reportListSourceTree.nodes.data;
            $.each(row.alarmObjeList,function (index,value) {
                var item = {
                    text:value.alarmObjName,
                    field:value.alarmObjId
                };
                wForm.layouts[0].items[5].addItem(item);
                $.each(treeData,function (index,e) {
                    if(value.alarmObjId == e.id){
                        e.checked=true;
                        console.log(treeData)
                        var node =  treePanel.eles.trees.reportListSourceTree.zTree.getNodeByParam("id", e.id, null);
                        treePanel.eles.trees.reportListSourceTree.zTree.checkNode(node, true, true);
                    }
                })
            })
        }
        console.log("查询规则返回结果：" + returnMsg);
        $.each(returnMsg, function (index, value) {
            if (row.id != value.strategyId) {
                $("<option value=" + value.id + ">" + value.name + "</option>").appendTo("#rule");
            } else {

                $("<option value=" + value.id + ">" + value.name + "</option>").appendTo("#rule");
                $("#rule").val(value.id);
            }
        });
        $("#orNotice").val(row.orNotice);
        $("#orEnable").attr("disabled", "disabled");
        if(row.orNotice == "是"){
            if (wForm.layouts[0].items.length == 8) {
                var selectConfig = {
                    itemId: "noticeType",
                    label: {
                        text: "通知方式"
                    },
                    type: "select",
                    options: {
                        type: "select",
                        content: [{
                            value: "短信通知",
                            text: "短信通知"
                        }/*, {
                            value: "邮件通知",
                            text: "邮件通知"
                        }*/]
                    },
                    required: false
                };
                var inputNoticeObj = {
                    itemId: "noticeObj",
                    label: {
                        text: "通知对象"
                    },
                    type: "dataItem",
                    required: false
                };
                var input = new comItem();
                input.oInit(inputNoticeObj);
                var select = new comItem();
                select.oInit(selectConfig);
                wForm.layouts[0].appendItems([select, input]);
                $("#noticeType option:first").prop("selected", 'selected');
                var result = {
                    text: "添加",
                    field: "1",
                    type: "operate",
                    operate: "add",
                    event: {},
                };
                result.event.onclick = initModel;
                wForm.layouts[0].items[9].addItem(result)
                dataItem = wForm.layouts[0].items[9];
                if(row.alarmNoticeObjectList.length!=0){
                    console.log(row);
                    $.each(row.alarmNoticeObjectList,function (index,value) {
                        var item = {
                            text:value.noticeName,
                            field:value.userId,
                            tel:value.noticePhone
                        };
                        wForm.layouts[0].items[9].addItem(item);
                    })
                }

            }
        }
        function refreshTree(e) {
            wForm.layouts[0].items[5].removeItemsAll();
            reportListSourceTree.destroy();
            reportListSourceTree.refresh(getDataSetTreeNodes(e.target.value))
        }

        function refreshContent(e) {
            if (e.target.value == "是") {
                if (wForm.layouts[0].items.length == 8) {
                    var selectConfig = {
                        itemId: "noticeType",
                        label: {
                            text: "通知方式"
                        },
                        type: "select",
                        options: {
                            type: "select",
                            content: [{
                                value: "短信通知",
                                text: "短信通知"
                            }/*, {
                                value: "邮件通知",
                                text: "邮件通知"
                            }*/]
                        },
                        required: false
                    };
                    var inputNoticeObj = {
                        itemId: "noticeObj",
                        label: {
                            text: "通知对象"
                        },
                        type: "dataItem",
                        required: false
                    };
                    var input = new comItem();
                    input.oInit(inputNoticeObj);
                    var select = new comItem();
                    select.oInit(selectConfig);
                    wForm.layouts[0].appendItems([select, input]);
                    $("#noticeType option:first").prop("selected", 'selected');
                    var result = {
                        text: "添加",
                        field: "1",
                        type: "operate",
                        operate: "add",
                        event: {},
                    };
                    result.event.onclick = initModel;
                    wForm.layouts[0].items[9].addItem(result);
                    dataItem = wForm.layouts[0].items[9];
                }

            } else if (e.target.value == "否") {
                if (wForm.layouts[0].items.length == 10) {
                    wForm.layouts[0].removeItem(wForm.layouts[0].items[9]);
                    wForm.layouts[0].removeItem(wForm.layouts[0].items[8]);
                }
            }
        }
    }

    function commitUpdateStrategy(e,value) {
        console.log(value);
        var strategyName = $("#strategyName").val();
        var ruleId = $("#rule").find("option:selected").val();
        var cron = $("#cron").val();
        var deadTime = $("#deadTime").val();
        var alarmObj = value.eles.forms.wrapperForm.layouts[0].items[5].issuesArr;
        var alarmObjeList = [];
        $.each(alarmObj,function (index,value) {
            var alarmObj = {
                "alarmObjId":value.id,
                "alarmObjName":value.innerText
            };
            alarmObjeList.push(alarmObj)
        });
        if(alarmObjeList.length<1){
            alert2("请确认数据完整性");
            return;
        }
        var alarmNoticeObjectList = [];
        var orEnable = $("#orEnable").find("option:selected").val();
        var orNotice = $("#orNotice").find("option:selected").val();
        if(orNotice == '是'){
            var noticeType = $("#noticeType").find("option:selected").val();
            var noticeObj = value.eles.forms.wrapperForm.layouts[0].items[9].confArr;
            noticeObj.shift();
            $.each(noticeObj,function (index,value) {
                var alarmNoticeObject={
                    "noticeTypeId":noticeType,
                    "noticeName":value.text,
                    "userId":value.field,
                    "noticePhone":value.tel
                };
                alarmNoticeObjectList.push(alarmNoticeObject);
            });
            if(alarmNoticeObjectList.length<1){
                alert2("请确认数据完整性");
                return;
            }
        }

        var result = {
            "id":strategyId,
            "description":$("#strategyDescription").val(),
            "deadTime":deadTime,
            "name":strategyName,
            "orEnable":orEnable,
            "orNotice":orNotice,
            "alarmJobConf":{
                "el": cron,
                "state": orEnable
            },
            "alarmRule":{
                "id":ruleId
            },
            "alarmObjeList":alarmObjeList,
            "alarmNoticeObjectList":alarmNoticeObjectList
        };
        console.log(result);
        feedback("AlarmConfig/updAlarmStrategies",result,$modal, $table)
    }

    function showAddStrategy() {
        var resultRule = commReturnAjaxBodys("AlarmConfig/queryAlarmRules", {});
        if(resultRule.length==0){
            alert2("请先新增规则");
            return;
        }
        var conf = {
            id: 'addStrategyModel',
            frameObj: $('#modal_department'),
            title: '创建策略',
            eles: {
                forms: {
                    wrapperForm: {
                        options: {
                            formId: 'wrapperForm',
                        }
                    }
                }
            },
            callbacks: {
                onCommit: commitAddStrategy                                                              //这里是填写方法名
            }
        };
        var sModal = new comModal();
        sModal.init(conf);
        var wForm = sModal.eles.forms.wrapperForm;
        var itemsArr = commReturnAjaxBodys("rule/createModel/createStrategyModel", null);
        console.log(itemsArr);
        var initContent = transform(itemsArr);

        console.log(initContent[3]);
        initContent[7].options.event = {
            onchange: refreshDimensionInfo
        };
        console.log(initContent[1]);
        initContent[1].options.event = {
            onchange: refreshTree
        };

        initContent[5].options = {};
        initContent[5].options.content = [];
        var formPanelConf = {
            title: "策略信息",
            css: {
                width: "48%",                                                                                        //百分数和px均接受
                height: "600px"
            },
            initContent: initContent
        };
        var formOpt = {
            formId: 'nForm',
            initContent: initContent
        };
        var formPanel = new comPanel();
        formPanel.oInit(formPanelConf);
        var treePanelConf = {
            title: "报警对象选择列表",
            css: {
                width: "50%",
                marginLeft: "10px",                                                                                        //百分数和px均接受
                height: "600px"
            },
            eles: {
                trees: {
                    "reportListSourceTree": {
                        tID: "reportListSourceTree",
                        nodes: {
                            data: getDataSetTreeNodes(initContent[1].options.content[0].value)
                        },
                        setting: {
                            view: {
                                dblClickExpand: false,
                                showLine: true,
                                selectedMulti: false,
                                showIcon: true,
                            },
                            data: {
                                simpleData: {
                                    enable: true,
                                    idKey: "id",
                                    pIdKey: "pId",
                                    rootPId: ""
                                }
                            },
                            check: {
                                enable: true,
                                chkboxType: {"Y": "s", "N": "s"}
                            },
                            callback: {
                                beforeClick: function (treeId, treeNode) {
                                },
                                onCollapse: function (event, treeId, treeNode) {
                                    // alert(treeNode.tId + ", " + treeNode.name);
                                },
                                onCheck: function (event, treeId, treeNode) {
                                    var flags = true;
                                    var content = wForm.layouts[0].items[5];
                                    console.log(treeNode);
                                    console.log(wForm.layouts[0].items[5]);
                                    var ids=[];
                                    $.each(content.confArr,function (index,value) {
                                        ids.push(value.field);
                                    });
                                   console.log(ids);
                                    if (treeNode.isParent) {
                                        if(treeNode.checked){
                                            $.each(treeNode.children, function (index, e) {
                                                var result = {
                                                    text: e.name,
                                                    field: e.id,
                                                };
                                                if(ids.length==0){
                                                    content.addItem(result);
                                                }else {
                                                    if(ids.indexOf(e.id) <0){
                                                        content.addItem(result);
                                                    }
                                                }
                                            })

                                        }else {
                                            $.each(treeNode.children, function (index, e) {
                                                content.deleteItem(e.id);

                                            })
                                        }

                                    }else {
                                        if(treeNode.checked){
                                            var result = {
                                                text: treeNode.name,
                                                field: treeNode.id,
                                            };
                                            if(ids.length==0){
                                                content.addItem(result);
                                            }else {
                                                if(ids.indexOf(treeNode.id) <0){
                                                    content.addItem(result);
                                                }
                                            }

                                        }else {
                                            content.deleteItem(treeNode.id)
                                        }
                                    }

                                },
                                onExpand: function (event, treeId, treeNode) {
                                    // alert(treeNode.tId + ", " + treeNode.name);
                                },
                                onClick: function (event, treeId, treeNode) {
                                    console.log(treeNode.tId + ", " + treeNode.name + "refresh reportSelect");

                                }
                            },
                            edit: {
                                enable: true,
                                showRemoveBtn: false,
                                showRenameBtn: false
                            }
                        }
                    }
                }
            }
        };

        var treePanel = new comPanel();
        treePanel.oInit(treePanelConf);
        wForm.appendLayout([formPanel, treePanel]);

        treePanel.eles.trees.init("reportListSourceTree");
        var reportListSourceTree = treePanel.eles.trees["reportListSourceTree"];
        $("#rule option:first").prop("selected", 'selected');
        $("#alarmObj option:first").prop("selected", 'selected');
        //$("#strategyName").attr("placeholder", "请输入1-255位中文或者英文");
        $("#orNotice option:first").prop("selected", 'selected');
        $("#orEnable option:first").prop("selected", 'selected');

        function refreshDimensionInfo(e) {
            if (e.target.value == "是") {
                if (wForm.layouts[0].items.length == 8) {
                    var selectConfig = {
                        itemId: "noticeType",
                        label: {
                            text: "通知方式"
                        },
                        type: "select",
                        options: {
                            type: "select",
                            content: [{
                                value: "短信通知",
                                text: "短信通知"
                            }/*, {
                                value: "邮件通知",
                                text: "邮件通知"
                            }*/]
                        },
                        required: false
                    };
                    var inputNoticeObj = {
                        itemId: "noticeObj",
                        label: {
                            text: "通知对象"
                        },
                        type: "dataItem",
                        required: false
                    };
                    var input = new comItem();
                    input.oInit(inputNoticeObj);
                    var select = new comItem();
                    select.oInit(selectConfig);
                    wForm.layouts[0].appendItems([select, input]);
                    $("#noticeType option:first").prop("selected", 'selected');
                    var result = {
                        text: "添加",
                        field: "1",
                        type: "operate",
                        operate: "add",
                        event: {},
                    };
                    result.event.onclick = initModel;
                    wForm.layouts[0].items[9].addItem(result)
                    dataItem = wForm.layouts[0].items[9];
                }
                console.log(wForm.layouts[0].items[9])
            } else if (e.target.value == "否") {
                if (wForm.layouts[0].items.length == 10) {
                    wForm.layouts[0].removeItem(wForm.layouts[0].items[10]);
                    wForm.layouts[0].removeItem(wForm.layouts[0].items[9]);
                }
            }
        }


        function refreshTree(e) {
            wForm.layouts[0].items[5].removeItemsAll();
            reportListSourceTree.destroy();
            reportListSourceTree.refresh(getDataSetTreeNodes(e.target.value))
        }

    }

    function commitAddStrategy(e,value) {//e，modal
        var strategyName = $("#strategyName").val();
        var ruleId = $("#rule").find("option:selected").val();
        var cron = $("#cron").val();
        var deadTime = $("#deadTime").val();
        var alarmObj = value.eles.forms.wrapperForm.layouts[0].items[5].issuesArr;
        var alarmObjeList = [];
        $.each(alarmObj,function (index,value) {
            var alarmObj = {
                "alarmObjId":value.id,
                "alarmObjName":value.innerText
            };
            alarmObjeList.push(alarmObj)
        });
       /* if(alarmObjeList.length<1){
            alert2("请确认数据完整性");
            return;
        }*/
        var alarmNoticeObjectList = [];
        var orEnable = $("#orEnable").find("option:selected").val();
        var orNotice = $("#orNotice").find("option:selected").val();
        if(orNotice == '是'){
            var noticeType = $("#noticeType").find("option:selected").val();
            var noticeObj = value.eles.forms.wrapperForm.layouts[0].items[9].confArr;
            noticeObj.shift();
            $.each(noticeObj,function (index,value) {
                var alarmNoticeObject={
                    "noticeTypeId":noticeType,
                    "noticeName":value.text,
                    "userId":value.field,
                    "noticePhone":value.tel
                };
                alarmNoticeObjectList.push(alarmNoticeObject);
            });
            if(alarmNoticeObjectList.length<1){
                alert2("请确认数据完整性");
                return;
            }
        }

        if(alarmObjeList.length<1){
            alert2("请确认数据完整性");
            return;
        }

        var result = {
            "description":$("#strategyDescription").val(),
            "deadTime":deadTime,
            "name":strategyName,
            "orEnable":orEnable,
            "orNotice":orNotice,
            "alarmJobConf":{
                "el": cron,
                "state": orEnable
            },
            "alarmRule":{
                "id":ruleId
            },
            "alarmObjeList":alarmObjeList,
            "alarmNoticeObjectList":alarmNoticeObjectList
        };
        console.log(result);
        feedback("AlarmConfig/addAlarmStrategies",result,$modal, $table)
    }

    function addStrategy() {
        $("#btn_add").on("click", function () {
            showAddStrategy();
        })
    }


    function getDetails(e, value, row, index) {
        console.log(row);
        var modalConf = {
            id: 'strategyInfo',
            frameObj: $('#modal_department'),
            type: 'browse',
            title: '策略详情'
        };
        var sModal = new comModal();
        sModal.init(modalConf);

        var returnStr = commReturnAjaxBodys("rule/createModel/createStrategyInfoModel", null);
        returnStr[0].value = row.name;
        returnStr[2].value = row.alarmJobConf.el;
        //returnStr[3].value = row.alarmObjeList[0].alarmObjName;
        returnStr[4].value = row.orEnable;
        returnStr[5].value = row.orNotice;

        var initContent = transform(returnStr);
        var formOpt = {
            formId: 'nForm',
            initContent: initContent
        };
        var form = new comForm();
        form.init(formOpt);
        sModal.appendEle(form);
        var returnMsg = commReturnAjaxBodys("AlarmConfig/queryAlarmRules", {});
        console.log("查询规则返回结果：" + returnMsg);
        $.each(returnMsg, function (index, value) {
            if (row.id == value.strategyId) {
                $("#rule").val(value.name)
            }

        });
        if (row.orNotice == "是") {
            var selectConfig = {
                itemId: "noticeType",
                label: {
                    text: "通知方式"
                },
                type: "input",
                required: false
            };
            var inputNoticeObj = {
                itemId: "noticeObj",
                label: {
                    text: "通知对象"
                },
                type: "dataItem",
                required: false
            };
            var input = new comItem();
            input.oInit(inputNoticeObj);
            var item = new comItem();
            item.oInit(selectConfig);
            form.appendItems([item, input]);

           // $("#noticeObj").val(returnMsg[0].name)
            var noticeObj = row.alarmNoticeObjectList;
            var noticeType;
            if(noticeObj.length>0){
                $.each(noticeObj,function (index,value) {
                    var result = {
                        text: value.noticeName,
                        field: value.userId,
                    };
                    form.items[7].addItem(result);
                    noticeType = value.noticeTypeId;
                });
                $("#noticeType").val(noticeType);
            }

            console.log(form);
        } else {
            $("#noticeObj").attr("type", "hidden");
            $("#noticeObj").prev().hide();
            $("#noticeType").attr("type", "hidden");
            $("#noticeType").prev().hide();
            console.log($("#noticeObj").prev())
        }
        var alarmObjList = row.alarmObjeList;
        $.each(alarmObjList,function (i,val) {
            var result = {
                text: val.alarmObjName,
                field: val.alarmObjId,
            };
            sModal.items[0].items[3].addItem(result);
        });
        $("#strategyName").attr("disabled", "disabled");
        $("#rule").attr("disabled", "disabled");
        $("#cron").attr("disabled", "disabled");
        $("#alarmObj").attr("disabled", "disabled");
        $("#orEnable").attr("disabled", "disabled");
        $("#orNotice").attr("disabled", "disabled");
        $("#noticeObj").attr("disabled", "disabled");
        $("#noticeType").attr("disabled", "disabled");
    }



})();

function queryAlarmStrategy() {
    $("#tb_alarm_strategy").bootstrapTable("refresh")
}

function commReturnAjaxBodys(url, param) {

    var returnMsg = null;
    $.ajax({
        url: url,
        type: "POST",
        data: JSON.stringify(param),
        async: false,//取消异步
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (msg) {
            returnMsg = msg;
        }
    });
    return returnMsg;
}

/*function feedback(modal, table, result) {
    alert2(result.description);
    if (result.code === 200) {
        modal.modal("hide");
        table.bootstrapTable("refresh");
    }
}*/

/**
 * 根据规则id获得报警对象
 * @param e
 * @returns {*[]}
 */
function getDataSetTreeNodes(e) {

    var result = commReturnAjax("/AlarmConfig/getTreeObjByRuleId","ruleId",e);
    console.log(result);
    var treeNodes=[];
    processingResultData(treeNodes,result.data,"0");
   /* return [
        {
            id: 1,
            pId: 0,
            name: "对象01",
            isHidden: true,
            open: true
        }, {
            id: 101,
            pId: 1,
            name: "对象101",
            isHidden: false,
        }, {
            id: 102,
            pId: 1,
            name: "对象102",
        }, {
            id: 103,
            pId: 1,
            name: "对象103",
        }, {
            id: 2,
            pId: 0,
            name: "对象02",
            open: true
        }, {
            id: 201,
            pId: 2,
            name: "对象201",
        }]*/
   return treeNodes;

}
function showNoticeObj() {
    var conf = {
        id: 'createNoticeObjModel',
        frameObj: $('#modal_upper'),
        title: '通知对象',
        eles:{
            forms: {
                wrapperForm: {
                    options: {
                        formId: 'wrapperForm',
                    }
                }
            }
        },
        callbacks: {
            onCommit: commitNoticeObj                                                              //这里是填写方法名
        }
    };
    var sModal = new comModal();
    sModal.init(conf);
    var wForm = sModal.eles.forms.wrapperForm;
    var itemsArr = commReturnAjaxBodys("rule/createModel/getNoticeObjModel", null);        //url,name,value
    var initContent = transform(itemsArr);
    var formPanelConf ={
        title: "选择通知对象",
        css: {
            width: "48%",                                                                                        //百分数和px均接受
            height: "600px"
        },
        initContent:initContent
    };
    var formPanel = new comPanel();
    formPanel.oInit(formPanelConf);
    var treePanelConf = {
        title: "通知人选项-目录列表",
        css: {
            width: "50%",
            marginLeft: "10px",                                                                                        //百分数和px均接受
            height: "600px"
        },
        eles: {
            trees: {
                "noticeObjSourceTree": {
                    tID: "noticeObjSourceTree",
                    nodes: {
                        data: getNoticeObjTreeNodes()
                    },
                    setting: {
                        view: {
                            dblClickExpand: false,
                            showLine: true,
                            selectedMulti: false,
                            showIcon: true,
                        },
                        data: {
                            simpleData: {
                                enable: true,
                                idKey: "id",
                                pIdKey: "pId",
                                rootPId: ""
                            }
                        },
                        callback: {
                            beforeClick: function (treeId, treeNode) {

                            },
                            onCollapse: function (event, treeId, treeNode) {
                                // alert(treeNode.tId + ", " + treeNode.name);
                            },
                            onCheck: function (event, treeId, treeNode) {
                                var content = wForm.layouts[0].items[0];
                                console.log(treeNode);
                                console.log(wForm.layouts[0].items[0]);
                                var ids=[];
                                $.each(content.confArr,function (index,value) {
                                    ids.push(value.field);
                                });
                                console.log(ids);
                                if (treeNode.isParent) {
                                    if(treeNode.checked){
                                        $.each(treeNode.children, function (index, e) {
                                            if(e.checked){
                                                var result = {
                                                    text: e.name,
                                                    field: e.id,
                                                    tel:e.tel
                                                };
                                                if(ids.length==0){
                                                    content.addItem(result);
                                                }else {
                                                    if(ids.indexOf(e.id) <0){
                                                        content.addItem(result);
                                                    }
                                                }
                                            }else {
                                                content.deleteItem(treeNode.id)
                                            }

                                        })

                                    }else {
                                        $.each(treeNode.children, function (index, e) {
                                            content.deleteItem(e.id);

                                        })
                                    }

                                }else {
                                    if(treeNode.checked){
                                        var result = {
                                            text: treeNode.name,
                                            field: treeNode.id,
                                            tel:treeNode.tel
                                        };
                                        if(ids.length==0){
                                            content.addItem(result);
                                        }else {
                                            if(ids.indexOf(treeNode.id) <0){
                                                content.addItem(result);
                                            }
                                        }

                                    }else {
                                        content.deleteItem(treeNode.id)
                                    }
                                }
                                console.log(content)

                            },
                            onExpand: function (event, treeId, treeNode) {
                                // alert(treeNode.tId + ", " + treeNode.name);
                            },
                            onClick: function (event, treeId, treeNode) {
                                console.log(treeNode.tId + ", " + treeNode.name + "refresh ");
                            }
                        },
                        check: {
                            enable: true,
                            chkboxType: {"Y": "ps", "N": "ps"}
                        },
                        edit: {
                            enable: true,
                            showRemoveBtn: false,
                            showRenameBtn: false
                        }
                    }
                }
            }
        }
    };
    /* var nForm = new comForm();
     nForm.init(formOpt);*/
    var treePanel = new comPanel();
    treePanel.oInit(treePanelConf);

    wForm.appendLayout([formPanel, treePanel]);
    treePanel.eles.trees.init("noticeObjSourceTree");
    var dataResult = dataItem.confArr;
    if(dataResult.length>1){
        dataResult.shift();
        wForm.layouts[0].items[0].refreshItems(dataResult);
        var treeData = treePanel.conf.eles.trees.noticeObjSourceTree.nodes.data;
       $.each(dataResult,function (index,value) {
            $.each(treeData,function (index,e) {
                if(value.field == e.id){
                    e.checked=true;
                    console.log(treeData)
                   var node =  treePanel.eles.trees.noticeObjSourceTree.zTree.getNodeByParam("id", e.id, null);
                    treePanel.eles.trees.noticeObjSourceTree.zTree.checkNode(node, true, true);
                }
            })
       })

    }
}

function commitNoticeObj(e,value) {
    console.log(value.items[0].items[0].confArr);
    var result = {
        text: "添加",
        field: "1",
        type: "operate",
        operate: "add",
        event: {},
    };
    result.event.onclick = initModel;
    dataItem.removeItemsAll();
    dataItem.addItem(result);
    dataItem.refreshItems(value.items[0].items[0].confArr);
    console.log(dataItem);
    $('#modal_upper').modal("hide");

}
function getNoticeObjTreeNodes() {

    var result = commReturnAjaxBodys("/NoticeObjInfo/getUser",null);
    console.log(result)
    var treeNodes=[];
    processingResultDataForUserTree(treeNodes,result.data,"0");
return treeNodes;

}
function initModel() {
    showNoticeObj();
}

function feedback(url,param,modal, table) {
    var result = commReturnAjaxBodys(url,param);
    alert2(result.description);
    if (result.code === 200) {
        modal.modal("hide");
        table.bootstrapTable("refresh");
    }
}

function processingResultData(treeNodes, datas , pId) {
    if(datas==undefined){
        return;
    }
    for (let i = 0; i < datas.length; i++) {
        if(datas[i].beParent){
            treeNodes.push({id: datas[i].nodeId, pId: pId, name:datas[i].nodeName});
            if(datas[i].children != null) {
                processingResultData(treeNodes, datas[i].children, datas[i].id);
            }
        }else {
            treeNodes.push({id: datas[i].nodeId, pId: datas[i].parentId, name:datas[i].nodeName});
            if(datas[i].children != null) {
                processingResultData(treeNodes, datas[i].children, datas[i].id);
            }
        }

    }
}

function processingResultDataForUserTree(treeNodes, datas , pId) {
    console.log(datas);
    for (let i = 0; i < datas.length; i++) {
        if(datas[i].beParent){
            treeNodes.push({id: datas[i].nodeId, pId: pId, name:datas[i].nodeName,tel:1});
            if(datas[i].children != null) {
                processingResultData(treeNodes, datas[i].children, datas[i].id);
            }
        }else {
            treeNodes.push({id: datas[i].nodeId, pId: datas[i].parentId, name:datas[i].nodeName,tel:datas[i].data[0].telPhone});
            if(datas[i].children != null) {
                processingResultData(treeNodes, datas[i].children, datas[i].id);
            }
        }

    }
}

function commReturnAjax(url,name,param) {

    var returnMsg = null;

    $.ajax({
        type: "POST",
        url: url,
        data: name+"=" + param,
        async: false,//取消异步
        dataType: "json",
        success: function (msg) {
            returnMsg =  msg;
        }
    });

    return returnMsg;
}

function transform(arr) {

    //transform item 接受的格式
    var newArr = [];
    $.each(arr, function (index, ele) {
        var oNew = {
            itemId: ele.id,
            label: {
                text: ele.name
            },
            type: ele.inputType,
            value: ele.value,
            validType: ele.name
        };
        if (ele.options && ele.options.length > 0) {
            oNew.options = {};
            oNew.options.content = [];
            $.each(ele.options, function (index, opt) {
                oNew.options.content[index] = {};
                oNew.options.content[index].value = opt.optionId ? opt.optionId : opt.value;
                oNew.options.content[index].text = opt.optionName ? opt.optionName : opt.text;
            });
        }
        newArr[index] = oNew;
    });

    return newArr;

}



