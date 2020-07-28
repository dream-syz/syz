$(document).ready(function () {
    initState();
    getConst();
    initTable();
    addStrategy();
});

function getConst() {
    infoWrapper = $("#runTimePanel");
    infoPanelBody = $("#infoPanelBody");
    $table = $("liveDataTable");
    $modal = $("#modal_department");
}

function initTable() {
    liveTable.init(
        {
            tableID: "liveDataTable",
            queryTableParams: getResultDataJson(),
            orderNumber: true,
            checkbox: false,
            loadMethod: 'button',//表格加载方式

            isNeedDetails: true,//是否需要查看列
            details: addInfoButton(),

            otherDetailsArr: ['delDetails'],
            delDetails: getDetails,

            isNeedOperate: true,
            operate: function (value, row, index) {
                return operateBtn(row);                                         //这个增加的按钮部分原本是公用的,获取到的内容需要return，现在单独写
            },

            otherOperationArr: ['update', 'start', 'stop'],
            update: updateStrategy,
            start: showStart,
            stop: showStop
        },
        {
            key: "id",
            showExport: false,
            showRefresh: true,
            showColumns: true,
            search: false,

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
}

//是否启动选择框
function initState() {
    $("<option value=''>" + '-----' + "</option>").appendTo("#alarmStrategy_state");
    $("<option value=是>" + '启动' + "</option>").appendTo("#alarmStrategy_state");
    $("<option value=否>" + '停止' + "</option>").appendTo("#alarmStrategy_state");
}

//启用策略
function showStart(row, e) {
    var handFn = function () {
        let id = row.id;
        var param = {
            "id": id
        };
        // result = commReturnAjaxBodys("/AlarmConfig/startAlarmStrategies", param);
        feedback("/AlarmConfig/startAlarmStrategies", param, $modal, $table);
    };
    hdCommon.confirm("是否启动策略", handFn);
}

//停止策略
function showStop(row, e) {
    var result;
    var handFn = function () {
        let id = row.id;
        var param = {
            "id": id
        };
        //result = commReturnAjaxBodys("/AlarmConfig/stopAlarmStrategies", param);
        feedback("/AlarmConfig/stopAlarmStrategies", param, $modal, $table);
    };
    hdCommon.confirm("是否停止策略", handFn);
}

//反馈结果函数
function feedback(url, param, modal, table) {
    var result = commReturnAjaxBodys(url, param);
    alert2(result.description);
    if (result.code === 200) {
        modal.modal("hide");
        table.bootstrapTable("refresh");
    }
}

//向服务器发请求数据
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

//返回结果集json数据
function getResultDataJson() {
    var name = $("#fault_name").val();
    var state = $("#alarmStrategy_state").val();
    if (name === '') {
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

//行点击事件
function onDblClickRow(index) {
    console.log(index);
}

//增加详情按钮
function addInfoButton() {
    return '<button type="button" class="add delDetails btn btn-primary btn-xs">&nbsp;详情&nbsp;</button>&nbsp;&nbsp;'
}

//对行数据进行操作,修改按钮,是否启用
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

//查看策略详情
function getDetails() {
    // console.log(row);
    var modalConf = {
        id: 'strategyInfo',
        frameObj: $('#modal_department'),
        type: 'browse',
        title: '策略详情'
    };
    var sModal = new comModal();
    sModal.init(modalConf);

    var itemsArr = setModal();//模态框静态属性
    var formOpt = {
        formId: 'nForm',
        initContent: getModalValue()
    }
    var nForm = new comForm();
    nForm.init(formOpt);
    sModal.appendEle(nForm);

    $("#strategyName").attr("disabled", "disabled");
    $("#rule").attr("disabled", "disabled");
    $("#cron").attr("disabled", "disabled");
    $("#alarmObj").attr("disabled", "disabled");
    $("#orEnable").attr("disabled", "disabled");
    $("#orNotice").attr("disabled", "disabled");
    $("#noticeObj").attr("disabled", "disabled");
    $("#noticeType").attr("disabled", "disabled");

}
//新增策略(有待完善)
function addStrategy() {
    $("#btn_add").on("click", function () {
        // var resultRule = commReturnAjaxBodys("AlarmConfig/queryAlarmRules", {});
        // if(resultRule.length==0){
        //     alert2("请先新增规则");
        //     return;
        // }
        var conf = {
            id: "addStrategyModel",
            frameObj: $('#modal_department'),
            title: "创建策略",
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
                // onCommit:commitAddStrategy  
            }
        };

        var sModal = new comModal();
        sModal.init(conf);

        //声明装载创建策略模态框的窗口组件--------------------------------------------
        var wForm = sModal.eles.forms.wrapperForm;

        //左边的面板组件----------------------------------------------------------------------
        var leftPanelConf = {
            title: "策略信息",
            css: {
                width: "48%",                                                                                        //百分数和px均接受
                height: "600px"
            },
            initContent: getLeft()
        };

        var formPanel = new comPanel();
        formPanel.oInit(leftPanelConf);

        //右边树模态框-------------------------------------------------------------------------

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
                            data: getRight()
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
                                chkboxType: { "Y": "s", "N": "s" }
                            },
                            callback: {
                                // beforeClick: function (treeId, treeNode) {
                                // },
                                // onCollapse: function (event, treeId, treeNode) {
                                //     // alert(treeNode.tId + ", " + treeNode.name);
                                // },
                                // onCheck: function (event, treeId, treeNode) {
                                //     var flags = true;
                                //     var content = wForm.layouts[0].items[5];
                                //     console.log(treeNode);
                                //     console.log(wForm.layouts[0].items[5]);
                                //     var ids=[];
                                //     $.each(content.confArr,function (index,value) {
                                //         ids.push(value.field);
                                //     });
                                //    console.log(ids);
                                //     if (treeNode.isParent) {
                                //         if(treeNode.checked){
                                //             $.each(treeNode.children, function (index, e) {
                                //                 var result = {
                                //                     text: e.name,
                                //                     field: e.id,
                                //                 };
                                //                 if(ids.length==0){
                                //                     content.addItem(result);
                                //                 }else {
                                //                     if(ids.indexOf(e.id) <0){
                                //                         content.addItem(result);
                                //                     }
                                //                 }
                                //             })

                                //         }else {
                                //             $.each(treeNode.children, function (index, e) {
                                //                 content.deleteItem(e.id);

                                //             })
                                //         }

                                //     }else {
                                //         if(treeNode.checked){
                                //             var result = {
                                //                 text: treeNode.name,
                                //                 field: treeNode.id,
                                //             };
                                //             if(ids.length==0){
                                //                 content.addItem(result);
                                //             }else {
                                //                 if(ids.indexOf(treeNode.id) <0){
                                //                     content.addItem(result);
                                //                 }
                                //             }

                                //         }else {
                                //             content.deleteItem(treeNode.id)
                                //         }
                                // }

                                // },
                                // onExpand: function (event, treeId, treeNode) {
                                //     // alert(treeNode.tId + ", " + treeNode.name);
                                // },
                                // onClick: function (event, treeId, treeNode) {
                                //     console.log(treeNode.tId + ", " + treeNode.name + "refresh reportSelect");

                                // }
                            },
                            edit: {
                                enable: true,
                                showRemoveBtn: false,
                                showRenameBtn: false
                            }
                        }
                    }
                }
            },

        };
        var treePanel = new comPanel();
        treePanel.oInit(treePanelConf);

        //把两个不同类型的模态框放到窗口组件中----------------------------------------------------
        wForm.appendLayout([formPanel, treePanel]);
        //初始化树
        treePanel.eles.trees.init("reportListSourceTree");

    })

}

//修改策略
function updateStrategy() {
    //声明一个模态框并初始化
    var conf = {
        id: "updStrategyModel",
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
            // onCommit:commitUpdateStrategy
        }

    };
    var sModal = new comModal();
    sModal.init(conf);

    //
    var wForm = sModal.eles.forms.wrapperForm;

    //左边的面板组件----------------------------------------------------------------------
    var leftPanelConf = {
        title: "策略信息",
        css: {
            width: "48%",                                                                                        //百分数和px均接受
            height: "600px"
        },
        initContent: getLeft()
    };

    var formPanel = new comPanel();
    formPanel.oInit(leftPanelConf);

    //右边树模态框-------------------------------------------------------------------------

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
                        data: getRight()
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
                            chkboxType: { "Y": "s", "N": "s" }
                        },
                        callback: {
                            // beforeClick: function (treeId, treeNode) {
                            // },
                            // onCollapse: function (event, treeId, treeNode) {
                            //     // alert(treeNode.tId + ", " + treeNode.name);
                            // },
                            // onCheck: function (event, treeId, treeNode) {
                            //     var flags = true;
                            //     var content = wForm.layouts[0].items[5];
                            //     console.log(treeNode);
                            //     console.log(wForm.layouts[0].items[5]);
                            //     var ids=[];
                            //     $.each(content.confArr,function (index,value) {
                            //         ids.push(value.field);
                            //     });
                            //    console.log(ids);
                            //     if (treeNode.isParent) {
                            //         if(treeNode.checked){
                            //             $.each(treeNode.children, function (index, e) {
                            //                 var result = {
                            //                     text: e.name,
                            //                     field: e.id,
                            //                 };
                            //                 if(ids.length==0){
                            //                     content.addItem(result);
                            //                 }else {
                            //                     if(ids.indexOf(e.id) <0){
                            //                         content.addItem(result);
                            //                     }
                            //                 }
                            //             })

                            //         }else {
                            //             $.each(treeNode.children, function (index, e) {
                            //                 content.deleteItem(e.id);

                            //             })
                            //         }

                            //     }else {
                            //         if(treeNode.checked){
                            //             var result = {
                            //                 text: treeNode.name,
                            //                 field: treeNode.id,
                            //             };
                            //             if(ids.length==0){
                            //                 content.addItem(result);
                            //             }else {
                            //                 if(ids.indexOf(treeNode.id) <0){
                            //                     content.addItem(result);
                            //                 }
                            //             }

                            //         }else {
                            //             content.deleteItem(treeNode.id)
                            //         }
                            // }

                            // },
                            // onExpand: function (event, treeId, treeNode) {
                            //     // alert(treeNode.tId + ", " + treeNode.name);
                            // },
                            // onClick: function (event, treeId, treeNode) {
                            //     console.log(treeNode.tId + ", " + treeNode.name + "refresh reportSelect");

                            // }
                        },
                        edit: {
                            enable: true,
                            showRemoveBtn: false,
                            showRenameBtn: false
                        }
                    }
                }
            }
        },

    };
    var treePanel = new comPanel();
    treePanel.oInit(treePanelConf);


    //把两个不同类型的模态框放到窗口组件中----------------------------------------------------
    wForm.appendLayout([formPanel, treePanel]);

    treePanel.eles.trees.init("reportListSourceTree");
}