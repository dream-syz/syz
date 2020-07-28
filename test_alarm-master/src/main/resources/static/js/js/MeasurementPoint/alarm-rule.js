var alarmRule = (function () {
    var my = {};

    var START = '1';
    var STOP = '0';

    var tableHead = [{
        checkbox: true
    }, {
        field: 'id',
        title: '规则编号'
    }, {
        field: 'strategyName',
        title: '规则名称'
    }, {
        field: 'orEnaable',
        title: '启用',
        formatter: function (value, row, index) {
            if (row['orEnaable'] == "1") {
                return '启用';
            } else if (row['orEnaable'] == "0") {
                return '停用';
            } else {
                return '无状态';
            }
        }
    }, {
        field: 'devTypeName',
        title: '设备类型'
    }, {
        field: 'ruleTypeName',
        title: '规则类型'
    }, {
        field: 'description',
        title: '规则描述',
        formatter: function (value, row, index) {
            return parseDescription(row);
        }
    }, {
        field: 'notifyObj',
        title: '通知对象',
        formatter: function (value, row, index) {
            return parseNotifyObj(row);
        }
    }];


    var opertions = ['start', 'stop', 'update', 'remove', 'check'];

    var windowHeight = $(window).height();
    var windowWidth = $(window).width();

    my.initAlarmInfo = function () {

        console.log("初始化页面高度");

        /!*----------------------------------------------------设置高度------------------------------------------------------*!/

        //设置树的面板高度
        $("#impl-info-panel").height(windowHeight);
        $('#cre-rule-div-cont').width(windowWidth * 0.8);
        $('#historyRule-div-cont').width(windowWidth * 0.8);

        /!*----------------------------------------------------加载公共区域------------------------------------------------------*!/
        $.ajaxSetup({
            async: false //取消异步，先加载load
        });

        //treeArea.initArea();//初始化区域
        treeMeter.initMeter();//初始化表记

        //自定义表记树 表记点击的方法
        var meterOption = {
            bootstrap2: false,
            showTags: true,
            levels: 1,
            data: null,
            unique: true,
            onNodeSelected: function (event, data) {
                alarmRule.initAlarmTable(data.id);//加载报警页面
            }
        };

        treeMeter.initMeterTree(null, meterOption);

        var ScrollbarName = "modal-body";
        $("." + ScrollbarName).mCustomScrollbar({
            scrollButtons: {
                enable: false,
                scrollType: "continuous",
                scrollSpeed: 20,
                scrollAmount: 40
            },
            horizontalScroll: false
        });

    };

    my.getInfoIfrim = function () {
        window.location.href = "alarmHistory";
    }

    /**
     * 生成报警页面
     */
    my.initAlarmTable = function (mpId) {
        alert("生成" + mpId + "的报警页面");
    }

    my.getCreateRule = function () {
        createRule.addRule()
        createRule.emptyInput()
        showCreateRuleModal(null);
    }

    my.conditionalQuery = function () {
        $("#tb_alarm_rule").bootstrapTable("refresh");
    };


    my.initTable = function (tree) {

        tree.initTable(
            {
                url: '/alarmRule/listAlarmRule',
                method: 'POST',
                pageIndex: 1,  //显示第几页
                pageLine: 15,   //每页显示多少行
                isNeedRequestHeader: false,      //是否需要请求表头
                clickToSelect: false,//单击选中行
                isNeedOperation: true,
                key: 'id',
                columns: tableHead,
                isOtherOperation: opertions,
                queryTableParams: function (params) { //查询参数事件
                    return "parameter=" + getRuleDataJson(params);
                },
                start: function (e, value, row, index) { //启动事件
                    startRuleModels(e, value, row, index);
                },
                stop: function (e, value, row, index) { //停止事件
                    stopRuleModels(e, value, row, index);
                },
                remove: function (e, value, row, index) { //删除事件
                    deleteRuleModels(e, value, row, index);
                },
                update: function (e, value, row, index) { //修改事件
                    updateRuleModels(e, value, row, index);
                },
                check: function (e, value, row, index) { //选择事件
                    checkRuleModels(e, value, row, index);
                },
                operater: function () {
                    return ruleStatus();
                }
            });
    };
    my.initHstTable = function (tree, ruleInfo) {

        tree.initTable(
            {
                url: '/alarmRule/listAlarmInfoByRule',
                method: 'POST',
                pageIndex: 1,  //显示第几页
                pageLine: 12,   //每页显示多少行
                isNeedRequestHeader: false,      //是否需要请求表头
                clickToSelect: false,//单击选中行
                isNeedOperation: false,
                key: 'id',
                columns: alarmHst.tableHead,
                queryTableParams: function (params) { //查询参数事件
                    return "parameter=" + getHstDataJson(params, ruleInfo);
                }

            });
    };

    function startRuleModels(e, value, row, index) {
        changeStateCom(START, "该报警规则已开启", "alarmRule/startAlarmRule", row);
    }

    function stopRuleModels(e, value, row, index) {
        changeStateCom(STOP, "该报警规则已停用", "alarmRule/stopAlarmRule", row);
    }

    function deleteRuleModels(e, value, row, index) {//删除功能

        if (ifStateEqOrEnaable(row['orEnaable'], START)) {
            showTip("请先停用该规则，再删除");
        } else {
            //先弹框
            $("#alarm_tip_model").modal('show');

            $("#submit_delete").unbind('click');

            $("#submit_delete").click(function () {
                var msg = commReturnAjax("alarmRule/deleteAlarmRule", "parameter", row);
                refreshTable();
                showTip(msg.description);
            })
        }
    }

    function updateRuleModels(e, value, row, index) {
        //先查询
        var ruleInfo = commReturnAjax("alarmRule/selectRuleById", "parameter", row);

        if (ruleInfo) {
            //再填充
            showCreateRuleModal(ruleInfo);
            //再show

            createRule.updateRule(row)
        } else {
            showTip("后台错误，暂时无法进行修改操作");
        }


    }

    /**
     * 查看 该规则的所有报警信息
     * @param e
     * @param value
     * @param row
     * @param index
     */
    function checkRuleModels(e, value, row, index) {
        my.initHstTable($('#tb_alarmHst'), row);

        $("#tb_alarmHst").bootstrapTable("refresh");
        $("#historyRule-div").modal("show");

    }

    /**
     * 修改状态的公共方法
     * @param state
     * @param tip
     * @param url
     */
    function changeStateCom(state, tip, url, row) {

        if (row) {

            if (ifStateEqOrEnaable(row['orEnaable'], state)) {
                showTip(tip);
                return;
            } else {
                row["orEnaable"] = state;
                console.log("修改状态的规则信息:" + JSON.stringify(row));
                var msg = commReturnAjax(url, "parameter", row);
                showTip(msg.description);

                refreshTable();
            }
        }

    }

    /**
     *  判断 两个状态是否相等
     * @param orEnaable
     * @param state
     * @returns {boolean}
     */
    function ifStateEqOrEnaable(orEnaable, state) {
        if (state === orEnaable) {
            return true;
        } else {
            return false;
        }

    }

    function refreshTable() {
        $('#tb_alarm_rule').bootstrapTable("refresh");
    }


    function getRuleDataJson(params) {
        var page = {
            pageLine: params.limit,   //页面大小
            pageIndex: params.offset / params.limit + 1  //页码
        };

        var temp = {
            'strategyName': changeEmputyStr($('#fault_name').val()),
            'orEnaable': changeEmputyStr($('#alarm_state').val()),
            'ruleTypeName': changeEmputyStr($('#fault_type').val())
        };


        var returnObj = {
            'page': page,
            'property': temp
        };

        // var temp=judgeIsEmpty();
        // return JSON.stringify(page)+"/"+JSON.stringify(temp);
        return JSON.stringify(returnObj);
    }

    function getHstDataJson(params, ruleInfo) {

        var page = {
            pageLine: params.limit,   //页面大小
            pageIndex: params.offset / params.limit + 1  //页码
        };

        var temp = {};

        if (ruleInfo) {
            temp = {
                'strategyId': changeEmputyStr(ruleInfo.id),
                'state': "0"
            };
        } else {
            temp = {
                'strategyId': "*",
                'state': "0"
            };
        }


        var returnObj = {
            'page': page,
            'property': temp
        };
        return JSON.stringify(returnObj);
    }

    function judgeIsEmpty() {
        var mpName = $.trim($("#fault_name").val());
        var state = $.trim($("#alarm_state").val());
        var happenTime = $("#happenTime").val();
        var temp = {
            mpName: mpName == "" ? null : mpName,
            state: state == "" ? "0" : state,
        };
        if ("" != happenTime && null != happenTime) {
            var time = splitTime(happenTime);
            temp.happenTime = $.trim(time[0]);
            temp.deadline = $.trim(time[1]);
        }
        return temp;
    }

    function ruleStatus() {

        var start = '<button  type="button"  class="start btn btn-primary  btn-xs"  title="启用">启用</button>&nbsp;';
        var stop = '<button  type="button"  class="stop btn btn-primary  btn-xs"  title="停用">停用</button>&nbsp;';
        var update = '<button  type="button"  class="update btn btn-primary  btn-xs"  title="修改">修改</button>&nbsp;';
        var remove = '<button  type="button"  class="remove btn btn-primary  btn-xs"  title="删除">删除</button>&nbsp;';
        var check = '<button  type="button"  class="check btn btn-primary  btn-xs"  title="查看报警">查看报警</button>';

        var temp = [];
        temp.push(start, stop, update, remove, check);
        // temp.push(start,stop,update,remove);
        return temp.join('');
    }

    function commReturnAjax(url, name, param) {

        var returnMsg = null;

        $.ajax({
            type: "POST",
            url: url,
            data: name + "=" + JSON.stringify(param),
            async: false,//取消异步
            dataType: "json",
            success: function (msg) {
                returnMsg = msg;
            }
        });

        return returnMsg;
    }

    function parseNotifyObj(row) {

        var notifyObjList = row['notifyObj'];

        var noticeObj = "";

        if (notifyObjList) {
            $.each(notifyObjList, function (index, obj, arr) {
                noticeObj += obj['userName'] + ',';
            })
        }

        return noticeObj;

    }

    function parseDescription(row) {

        var description = "";

        var list = row['description'].split(';');

        var time = '默认';
        var expre = "≥";
        var count = '0';

        if (list) {
            if (list[2]) {
                time = list[2];
            }
            if (list[1]) {
                expre = list[1];
            }
            if (list[0]) {
                count = list[0];
            }
            description += "每次异常情况超过" + time + "分钟，异常次数 " + expre + list[0] + "次，可异常报警";
        }

        return description;

    }

    function showCreateRuleModal(ruleInfo) {
        createRule.showCreateRuleModal(ruleInfo);
    }

    /**
     *  展示 提示modal
     * @param message
     */
    function showTip(message) {
        $("#alarm_message").text(message);
        $("#imfo_tip_alarm").modal('show');
    }

    /**
     * 将“” 转化为 null
     * @param str
     * @returns {*}
     */
    function changeEmputyStr(str) {
        if (str == null || str.trim() == "") {
            return null;
        }
        return str;
    }

    return my;
}());

/*------------------------------------------------------新历史规则页面-------------------------------------------------*/

var ruleId;
(function () {
    var alarmRuleTable = new commTable();
    var $table;
    var $modal;

    var tableHead = [{
        checkbox: true,
    }, {
        field: "id",
        title: "规则id",
        align: 'center',
        visible: true
    }, {
        field: "name",
        title: "规则名",
        align: 'center',
    }, {
        field: "times",
        title: "超过次数报警",
        align: 'center'
    }];

    $(document).ready(function () {
        alarmRule.initAlarmInfo();//初始化报警主界面
        initTable();
        getConst();
        initAddRule();
        //changeCondition();
    });

    function getConst() {
        $modal = $("#modal_department");
        $table = $("#tb_alarm_rule");
    }

    function initTable() {
        alarmRuleTable.init({
            tableID: "tb_alarm_rule",
            dataUrl: "/AlarmConfig/queryAlarmRule",
            dataParam: {
                data: JSON.stringify(getResultDataJson()),
                contentType: "application/json"
            },
            loadMethod: 'button',                                                           //默认是scroll 需要其他的写button
            orderNumber: true,
            checkbox: false,
            isNeedOperate: true,
            isNeedDetails: true,
            otherOperationArr: ['update'],
            otherDetailsArr: ['delDetails'],
            operate: function () {
                return operateBtn();                                         //这个增加的按钮部分原本是公用的,获取到的内容需要return，现在单独写
            },
            update: function (e, value, row, index) {
                showUpdate(row, e);
            },
            queryTableParams: function () {
                return getResultDataJson();
            },
            details: function () {
                return addInfoButton();
            },
            delDetails:function(e, value, row, index){
                getDetails(e, value, row, index);
            },
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
        });
    }

    function getResultDataJson() {
        var name = $("#fault_name").val();
        var dataParam = {"name": name};
        if (name === '') {
            dataParam = {};
        }

        return dataParam;
    }

    function addInfoButton() {
        return '<button type="button" class="add delDetails btn btn-primary btn-xs">&nbsp;详情&nbsp;</button>&nbsp;&nbsp;'
    }

    function operateBtn() {
        var update = '<button type="button" class="update btn  btn-primary btn-xs">&nbsp;修改&nbsp;</button>&nbsp;&nbsp;'
        var temp = [];
        temp.push(update);
        return temp.join('');
    }

    function initAddRule() {
        var btn = $("#btn_add");

        btn.on("click",function (e) {
            var conf = {
                id: 'createRuleModel',
                frameObj: $('#modal_department'),
                title: '新增规则',
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
                    onCommit: commitRule                                                              //这里是填写方法名
                }
            };
            var sModal = new comModal();
            sModal.init(conf);

            var wForm = sModal.eles.forms.wrapperForm;

            var itemsArr = commReturnAjaxBodys("rule/createModel/createRuleModel", null);        //url,name,value
            var initContent =transform(itemsArr);
            console.log(initContent[5]);
            initContent[5].options.event={
                onchange:refreshDimensionInfo
            };
            console.log(initContent[5]);
            var formPanelConf ={
                title: "创建规则",
                css: {
                    width: "48%",                                                                                        //百分数和px均接受
                    height: "600px"
                },
                initContent:initContent
            };


            var formOpt = {
                formId: 'nForm',
                initContent: initContent
            };
            var formPanel = new comPanel();
            formPanel.oInit(formPanelConf);

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
                                data: getDataSetTreeNodes()
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
                                callback: {
                                    beforeClick: function (treeId, treeNode) {
                                        if (!treeNode.isParent) {
                                            //1.将数据集名称填充
                                            $("#dataList").val(treeNode.name);

                                            $("#dataListId").val(treeNode.id);

                                            //2.将指标填充至下拉框
                                            //根据数据集id获取数据集信息
                                            var returnMsg = commReturnAjaxBodys("/DataConfigCenter/queryCurrentDS",{"dataSetId":treeNode.id});

                                            $("#quotaList").empty();

                                            $("#dimList").empty();

                                            $.each(returnMsg.data.quotas,function (index,value) {

                                                $("<option value="+value.quotaId+">"+value.alias+"</option>").appendTo("#quotaList");

                                            });

                                            //获得维度信息
                                            var results = commReturnAjax("/DataConfigCenter/queryDimTypeByDimTypeId","typeId",returnMsg.data.dimId);
                                            console.log(results);
                                            $("<option value="+results.data.typeId+">"+results.data.alias+"</option>").appendTo("#dimList");


                                        }
                                        return true;
                                    },
                                    onCollapse: function (event, treeId, treeNode) {
                                        // alert(treeNode.tId + ", " + treeNode.name);
                                    },
                                    onCheck: function (event, treeId, treeNode) {
                                        console.log(treeNode);
                                    },
                                    onExpand: function (event, treeId, treeNode) {
                                        // alert(treeNode.tId + ", " + treeNode.name);
                                    },
                                    onClick: function (event, treeId, treeNode) {
                                        console.log(treeNode.tId + ", " + treeNode.name + "refresh reportSelect");
                                    }
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
           /* var nForm = new comForm();
            nForm.init(formOpt);*/
            var treePanel = new comPanel();
            treePanel.oInit(treePanelConf);

            wForm.appendLayout([formPanel, treePanel]);
            treePanel.eles.trees.init("reportListSourceTree");

            function refreshDimensionInfo(e) {
                if(e.target.value == "&"){
                    if(wForm.layouts[0].items.length==8){
                        var checkboxConfig = {
                            itemId: "value2",
                            label: {
                                text: "值2"
                            },
                            type: "input",
                            validType:"value2",
                            /*options: {
                                type: "input",
                                content: []
                            },*/
                            required: false
                        };
                        var input = new comItem();
                        input.oInit(checkboxConfig);
                        wForm.layouts[0].appendItems([input]);
                    }
                }else {
                    if(wForm.layouts[0].items.length==9){
                        wForm.layouts[0].removeItemById(wForm.layouts[0].items[8].conf.itemId)
                    }
                }
            }

            //sModal.appendEle(nForm);
            $("#dataList").attr("placeholder","请选择数据集");
            $("#dataList").attr("disabled","disabled");
            /*$("#ruleNameJson").attr("placeholder","请输入1-255位规则名称");*/
            /*$("#rulesJson").attr("placeholder","最大次数只能输入数字");*/
            $("#condition option:first").prop("selected", 'selected');
            $("#dataListId").attr("type","hidden");
            $("#dataListId").prev().hide();
            var reportListTree = treePanel.eles.trees["reportListSourceTree"].content;

            console.log(treePanelConf.eles.trees.reportListSourceTree.nodes.data);
            var dataLists = [];
            $.each(treePanel.conf.eles.trees.reportListSourceTree.nodes.data,function (index,value) {
                if(value.pId!=-1){
                    dataLists.push(value);
                }
            });
            var value = dataLists[0];
            $("#dataList").val(value.name);
            $("#dataListId").val(value.id);
            //2.将指标填充至下拉框
            var returnMsg = commReturnAjaxBodys("/DataConfigCenter/queryCurrentDS",{"dataSetId":value.id});
            $("#quotaList").empty();

            $("#dimList").empty();
            $.each(returnMsg.data.quotas,function (index,value1) {
                $("<option value="+value1.quotaId+">"+value1.alias+"</option>").appendTo("#quotaList")
            });
            var results = commReturnAjax("/DataConfigCenter/queryDimTypeByDimTypeId","typeId",returnMsg.data.dimId);
            console.log(results);
            $("<option value="+results.data.typeId+">"+results.data.alias+"</option>").appendTo("#dimList");
            //3.将维度填充至下拉框



        });
    }


    function showUpdate(row, e) {
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

        var itemsArr = commReturnAjaxBodys("rule/createModel/createUpdRuleModel", null);        //url,name,value
        console.log(itemsArr);
        var compare = row.clientTarget.target.quotas[0].rang.compare;
        itemsArr[0].value = row.name;
        itemsArr[1].value =  row.times;
        itemsArr[2].value =  compare;
        var rang = row.clientTarget.target.quotas[0].rang;
        var value6;
        var value8;
        if(compare != "&"){
            if(rang.lft!="" && rang.lft!=null ){
                value6 = rang.lft;
            } else if(rang.rgt!="" && rang.rgt!=null ){
                value6 = rang.rgt;
            }else if(rang.mid!="" && rang.mid!=null ){
                value6 = rang.mid;
            }
            itemsArr[3].value = value6;
        }else {
            var json = {id: "value2", name: "值2", inputType: "input", value: "", options: Array(0)};
            itemsArr.push(json);
            value6 =rang.lft;
            value8 = rang.rgt;
            itemsArr[3].value = value6;
            itemsArr[4].value = value8;
        }


        var initContent = transform(itemsArr);
        console.log(initContent);
        initContent[2].options.event={
            onchange:refreshDimensionInfo
        };
        var formOpt = {
            formId: 'nForm',
            initContent: initContent
        };
        var form = new comForm();
        form.init(formOpt);
        sModal.appendEle(form);
        var returnMsgs = commReturnAjaxBodys("/DataConfigCenter/querySinglePrivateDs",{"targetId":row.dataSetId});
        $("#quotaList").empty();
        $("#dimList").empty();
        $.each(returnMsgs.data.quotas,function (index,value) {
            $("<option value="+value.quotaId+">"+value.alias+"</option>").appendTo("#quotaList")
        });
        $("<option value="+returnMsgs.data.dim+">"+returnMsgs.data.alias+"</option>").appendTo("#dimList");

        function refreshDimensionInfo(e) {
            console.log(form);
            if(e.target.value == "&"){
                if(form.items.length==4){
                    var checkboxConfig = {
                        itemId: "value2",
                        label: {
                            text: "值2"
                        },
                        type: "input",
                        validType:"value2",
                        required: false
                    };
                    var input = new comItem();
                    input.oInit(checkboxConfig);
                    form.appendItems([input]);
                }
            }else {
                if(form.items.length==5){
                    form.removeItem(form.items[4])
                }
            }
        }
        /*var form = new comForm();
        form.init(formOpt);*/
        //sModal.appendEle(form);
    }

    function getDetails(e, value, row, index) {
        var modalConf = {
            id: 'ruleInfo',
            frameObj: $('#modal_department'),
            type: 'browse',
            title: '规则详情'
        };
        var sModal = new comModal();
        sModal.init(modalConf);

        var returnStr = commReturnAjaxBodys("rule/createModel/createRuleInfoModel", null);

        var rang = row.clientTarget.target.quotas[0].rang;

        var expression = rang.compare;
        var value6;
        var value8;
        if(expression != "&"){
            if(rang.lft!="" && rang.lft!=null ){
                value6 = rang.lft;
            } else if(rang.rgt!="" && rang.rgt!=null ){
                value6 = rang.rgt;
            }else if(rang.mid!="" && rang.mid!=null ){
                value6 = rang.mid;
            }
            returnStr[6].value = value6;
        }else {
            var json = {id: "value2", name: "值2", inputType: "input", value: "", options: Array(0)};
            returnStr.push(json);
            value6 =rang.lft;
            value8 = rang.rgt;
            returnStr[6].value = value6;
            returnStr[7].value = value8;
        }
        returnStr[0].value = row.clientTarget.target.alias;
        returnStr[1].value = row.clientTarget.target.quotas[0].alias;
        returnStr[2].value = row.objDimId;
        returnStr[3].value = row.name;
        returnStr[4].value = row.times;
        var result;
        if(row.clientTarget.target.quotas[0].rang.compare == "&"){
            result = "between"
        }else {
            result = row.clientTarget.target.quotas[0].rang.compare;
        }
        returnStr[5].value = result;
        returnStr[6].value = value6;
        var initContent =transform(returnStr);
        var formOpt = {
            formId: 'nForm',
            initContent: initContent
        };

        var form = new comForm();
        form.init(formOpt);
        sModal.appendEle(form);
        $("#dataList").attr("disabled","disabled");
        $("#quotaList").attr("disabled","disabled");
        $("#dimList").attr("disabled","disabled");
        $("#ruleNameJson").attr("disabled","disabled");
        $("#rulesJson").attr("disabled","disabled");
        $("#condition").attr("disabled","disabled");
        $("#value").attr("disabled","disabled");
        $("#value2").attr("disabled","disabled");
    }

    function commitRule() {
        var rang;
        var condition = $("#condition").find("option:selected").val();
        var expression;
        var ruleName  = $("#ruleNameJson").val();
        if(condition != "&"){
                rang = {
                    "mid":$("#value1").val(),
                    "compare":condition
                }
        }else {
            rang={
                "lft":$("#value1").val(),
                "rgt":$("#value2").val(),
                "compare":condition
            }
        }
        var dimId = $("#dimList").find("option:selected").val();
        var result = {
            "name":ruleName,
            "objDimId":dimId,
            "times":$("#rulesJson").val(),
            "pushOrPull":"调用",
            "clientTarget":{
                "alias":ruleName,
                "expire":"0",
                "source":{
                    "dataSetId":$("#dataListId").val(),
                    "quotaId":$("#quotaList").find("option:selected").val()
                },
                "target":{
                    "alias":ruleName,
                    "dimId":dimId,
                    "quotas":[
                        {
                            "alias":ruleName,
                            "valueType":"boolean",
                            "rang":rang
                        }
                    ]
                }
            }
        };

        feedback("/AlarmConfig/addAlarmRule",result,$modal,$table);

    }

    function commitUpdateRule(e,row) {
        console.log(row);
        var ruleName = $("#ruleNameJson").val();
        var condition = $("#condition").find("option:selected").val();
        var expression;
        var rang;
        if(condition != "&"){
            //expression = $("#dimList").find("option:selected").val()+""+$("#condition").find("option:selected").val()+""+$("#value1").val();
                rang = {
                    "mid":$("#value1").val(),
                    "compare":condition
                }

        }else {
           // expression = $("#dimList").find("option:selected").val()+" & "+$("#value1").val()+" "+$("#value2").val();
            rang={
                "lft":$("#value1").val(),
                "rgt":$("#value2").val(),
                "compare":condition
            }
        }
      var result = {
          "id":ruleId,
          "name":ruleName,
          "times":$("#rulesJson").val(),
          "clientTarget":{
              "alias":ruleName,
              "target":{
                  "alias":ruleName,
                  "quotas":[
                      {
                          "alias":ruleName,
                          "rang":rang
                      }
                  ]
              }
          }
      }
        feedback("/AlarmConfig/updAlarmRule",result,$modal,$table);
    }
})();


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

function getDataSetTreeNodes() {
    var result = commReturnAjaxBodys("DataConfigCenter/expandPublicDs",{});
   var treeNodes=[];
   processingResultData(treeNodes,result.data,"0");
    return treeNodes;

}

function processingResultData(treeNodes, datas , pId) {
    console.log(treeNodes);
    for (let i = 0; i < datas.length; i++) {
        treeNodes.push({id: datas[i].id, pId: pId, name:datas[i].data.alias, data: datas[i].data});
        if(datas[i].children != null) {
            processingResultData(treeNodes, datas[i].children, datas[i].id);
        }
    }
}

function feedback(url,param,modal, table) {
    var result = commReturnAjaxBodys(url,param);
    console.log(result);
    alert2(result.description);
    if (result.code === 200) {
        modal.modal("hide");
        table.bootstrapTable("refresh");
    }
}
function queryRule() {
    $("#tb_alarm_rule").bootstrapTable("refresh");
}

function commReturnAjax(url,name,param) {

    var returnMsg = null;

    $.ajax({
        type: "POST",
        url: url,
        data: name+"=" + JSON.stringify(param),
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







