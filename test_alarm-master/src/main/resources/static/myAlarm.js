// let rtBus = myAlarmBus;
$(document).ready(function () {
    getConst();
    initTable();
    initAddRule();//调用创建规则方法
});

function getConst() {
    infoWrapper = $("#runTimePanel");
    infoPanelBody = $("#infoPanelBody");
    treeWrapper = $("#treeWrapper");

    $table = $("liveDataTable");
    $modal = $("#modal_department");
}
//----------------------------------------------------------------------------------------------------------
//表格初始化
function initTable() {
    liveTable.init({
        tableID: "liveDataTable",
        // dataUrl: "http://rap2.taobao.org:38080/app/mock/260449/getTable",
        // dataParam: {
        //     data: JSON.stringify(getResultDataJson()),
        //     contentType: "application/json"
        // },
        queryTableParams: getResultDataJson(),
        orderNumber: true,
        checkbox: false,
        loadMethod: 'button',//表格加载方式

        isNeedDetails: true,//是否需要查看列
        details: addInfoButton,

        otherDetailsArr: ['delDetails'],
        delDetails: getDetails,

        isNeedOperate: true,
        operate: operateBtn,

        otherOperationArr: ['update'],
        update: updateRule,
        // orderRemove: orderRemove,
    },
        {
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

    //增加详情按钮
    function addInfoButton() {
        return '<button type="button" class="add delDetails btn btn-primary btn-xs">&nbsp;详情&nbsp;</button>&nbsp;&nbsp;'
    }

    //对行数据进行操作,修改按钮
    function operateBtn() {
        var update = '<button type="button" class="update btn  btn-primary btn-xs">&nbsp;修改&nbsp;</button>&nbsp;&nbsp;'
        var temp = [];
        temp.push(update);
        return temp.join('');
    }

    //修改规则(暂时没有完成)
    function updateRule(row, e) {
        ruleId = row.id;
        var conf = {
            id: 'updRuleModel',
            frameObj: $('#modal_department'),
            title: '修改规则',
            callbacks: {
                onCommit: commitUpdateRule                                                             //这里是填写方法名
            }
        };
        var sModal = new comModal();
        sModal.init(conf);

        var itemsArr = setRuleModal();//模态框静态属性

        //------------------------------------
        //------------------------------------

        var formOpt = {
            formId: 'nForm',
            initContent: getRuleModalValue()
        }
        var nForm = new comForm();
        nForm.init(formOpt);

        console.log(itemsArr);
        sModal.appendEle(nForm);

        // var initContent = transform(itemsArr);
        // console.log(initContent);
        // initContent[2].options.event = {
        //     onchange: refreshDimensionInfo
        // };
        // var formOpt = {
        //     formId: 'nForm',
        //     initContent: initContent
        // };
        // var form = new comForm();
        // form.init(formOpt);
        // sModal.appendEle(form);
        // var returnMsgs = commReturnAjaxBodys("/DataConfigCenter/querySinglePrivateDs", { "targetId": row.dataSetId });
        // $("#quotaList").empty();
        // $("#dimList").empty();
        // $.each(returnMsgs.data.quotas, function (index, value) {
        //     $("<option value=" + value.quotaId + ">" + value.alias + "</option>").appendTo("#quotaList")
        // });
        // $("<option value=" + returnMsgs.data.dim + ">" + returnMsgs.data.alias + "</option>").appendTo("#dimList");

        // function refreshDimensionInfo(e) {
        //     console.log(form);
        //     if (e.target.value == "&") {
        //         if (form.items.length == 4) {
        //             var checkboxConfig = {
        //                 itemId: "value2",
        //                 label: {
        //                     text: "值2"
        //                 },
        //                 type: "input",
        //                 validType: "value2",
        //                 required: false
        //             };
        //             var input = new comItem();
        //             input.oInit(checkboxConfig);
        //             form.appendItems([input]);
        //         }
        //     } else {
        //         if (form.items.length == 5) {
        //             form.removeItem(form.items[4])
        //         }
        //     }
        // }
    }
    //修改规则提交事件
    function commitUpdateRule(e, row) {
        var ruleName = $("#ruleNameJson").val();
        var condition = $("#condition").find("option:selected").val();
        var rang;
        var expression;
        if (condition != "&") {
            rang = {
                "mid": $("#value1").val(),
                "compare": condition
            }

        } else {
            rang = {
                "lft": $("#value1").val(),
                "rgt": $("#value2").val(),
                "compare": condition
            }
        }
    }

    //查看规则详情------------------------------------------------------------------
    function getDetails() {
        var modalConf = {
            id: 'ruleInfo',
            frameObj: $('#modal_department'),
            title: '规则详情',
            type: 'browse'//控制底部确认取消按钮
        }
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

        //使input框无法输入
        $("#dataList").attr("disabled", "disabled");
        $("#quotaList").attr("disabled", "disabled");
        $("#dimList").attr("disabled", "disabled");
        $("#ruleNameJson").attr("disabled", "disabled");
        $("#rulesJson").attr("disabled", "disabled");
        $("#condition").attr("disabled", "disabled");
        $("#value").attr("disabled", "disabled");



    }
}
//-------------------------------------------------------------------------------------
//创建规则
function initAddRule() {
    var btn = $("#btn_add");
    btn.on("click", function (e) {
        var conf = {
            id: 'createRuleModel',
            frameObj: $('#modal_department'),
            title: '新增规则',
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
                // onCommit:commitRule
            },
            type: 'footer'
        };

        var sModal = new comModal();
        sModal.init(conf);

        //声明装载创建规则模态框的窗口组件--------------------------------------------
        var wForm = sModal.eles.forms.wrapperForm;
        // var itemsArr = creatRuleModal();
        // var wForm = sModal.eles.forms.wrapperForm;
        // var itemsArr = commReturnAjaxBodys("rule/createModel/createRuleModel", null);        //url,name,value
        // var initContent =transform(itemsArr);
        // var initContent=getLeft();
        // console.log(initContent[5])
        // initContent[5].options.event={
        //     onchange:refreshDimensionInfo
        // };
        // console.log(initContent[5]);
        //左边的面板组件----------------------------------------------------------------------
        var leftPanelConf = {
            title: "创建规则",
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
            title: "数据集选项-目录列表",
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
                            // data: getDataSetTreeNodes()//后台获取
                            data: getRight() //暂时写死
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
                                    if (!treeNode.isParent) {
                                        //1.将数据集名称填充
                                        $("#dataList").val(treeNode.name);
                                        $("#dataListId").val(treeNode.id);

                                        //2.将指标填充至下拉框
                                        //根据数据集id获取数据集信息
                                        var returnMsg = commReturnAjaxBodys("/DataConfigCenter/queryCurrentDS", { "dataSetId": treeNode.id });
                                        $("#quotaList").empty();
                                        $("#dimList").empty();
                                        $.each(returnMsg.data.quotas, function (index, value) {
                                            $("<option value=" + value.quotaId + ">" + value.alias + "</option>").appendTo("#quotaList");
                                        });

                                        //获得维度信息(根据数据集id 查询公共数据集详情)
                                        var results = commReturnAjax("/DataConfigCenter/queryDimTypeByDimTypeId", "typeId", returnMsg.data.dimId);
                                        console.log(results);
                                        $("<option value=" + results.data.typeId + ">" + results.data.alias + "</option>").appendTo("#dimList");


                                    }
                                    return true;
                                },
                                //     onCollapse: function (event, treeId, treeNode) {
                                //         // alert(treeNode.tId + ", " + treeNode.name);
                                //     },
                                //     onCheck: function (event, treeId, treeNode) {
                                //         console.log(treeNode);
                                //     },
                                //     onExpand: function (event, treeId, treeNode) {
                                //         // alert(treeNode.tId + ", " + treeNode.name);
                                //     },
                                //     onClick: function (event, treeId, treeNode) {
                                //         console.log(treeNode.tId + ", " + treeNode.name + "refresh reportSelect");
                                //     }
                            },
                            check: {
                                enable: false
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
        //把两个不同类型的模态框放到窗口组件中----------------------------------------------------
        wForm.appendLayout([formPanel, treePanel]);
        //初始化树
        treePanel.eles.trees.init("reportListSourceTree");



    });


}

//查询规则------------------------------------------------------
function queryRule() {
    $("#liveDataTable").bootstrapTable("refresh");
}

//向服务器发请求数据,暂时与commReturnAjax方法合并-------------------
function commReturnAjaxBodys(url, name, param) {
    var returnMsg = null;
    var finalData = null;
    if (name) {
        finalData = name + "=" + JSON.stringify(param);
    }
    else {
        finalData = JSON.stringify(param);
    }
    $.ajax({
        url: url,
        type: "POST",
        data: finalData,
        async: false,//设置为同步请求，取消异步
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (msg) {
            returnMsg = msg;
        }
    });
    return returnMsg;
}

//改变itemArr里面的参数值，与输入参数同步-----------------------------------------
function transform(arr) {
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

