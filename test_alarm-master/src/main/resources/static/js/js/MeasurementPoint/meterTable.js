/*----------------------------------------------表格的js--------------------------------------------------*/

var TableInit = function () {
    var oTableInit = new Object();

    //初始化Table
    oTableInit.Init = function () {
        $('#tb_departments').bootstrapTable('destroy');//先销毁表格

        var tableHead = [{           //表头
            checkbox: true,
            formatter: stateFormatter
        }, {
            field: 'mpId',
            title: '表计编号',
            align: 'center',
            visible: false
        }, {
            field: 'mpName',
            title: '表计名',
            align: 'center',
        }, {
            field: 'devId',
            title: '设备编号',
            align: 'center',
            visible: false
        }, {
            field: 'createTime',
            title: '安装时间',
            align: 'center'
        }, {
            field: 'state',
            title: '状态',
            align: 'center'
        }, {
            field: 'areaName',
            title: '所属区域',
            align: 'center',
            visible: false
        }, {
            field: 'customerType',
            title: '用户类型',
            align: 'center',
            visible: false
        }, {
            field: 'devTypeName',
            title: '表计类型',
            align: 'center',
            visible: false
        }, {
            field: 'versionName',
            title: '型号',
            align: 'center',
            visible: false
        }, {
            field: 'manufacture',
            title: '厂商',
            align: 'center',
            visible: false
        }, {
            field: 'density',
            title: '密度',
            align: 'center',
            visible: false
        }, {
            field: 'thresholdValue',
            title: '时间阈值',
            align: 'center',
            visible: false
        }];

        $("#tb_departments").initTable(
            {
                type: "POST", //请求类型
                url: "meters/getPageMeters",//请求的url
                pageIndex: 1,  //显示第几页
                pageLine: 6,   //每页显示多少行
                columns: tableHead,
                clickToSelect: false,
                height: 389,    //表格高度   不传的话  则不设置高度
                isNeedOperation: false,
                checkboxHeader: false,//是否需要操作列
                key: 'mpId',     //每一行的唯一标识，一般为主键列
                onLoadError: function (status, res) {
                    return loadError(res);
                },
                onDblClickRow: function (row) {
                    // dbClickUpdate(row);//双击行事件  弹出模态框修改
                },
                onClickRow: function (row) {
                    onClickChange(row);// 单击改变 曲线 表计基本信息 及数据项信息
                    console.log(row);
                    selectDataSingle(row.mpName, row.mpId, true);
                },
                queryTableParams: function (params) { //查询参数事件
                    return "parameter=" + getMeterDataJson(params);
                },
                remove: function (e, value, row, index) { //删除(废弃)事件
                    delMeterDetails(e, value, row, index);
                },
                update: function (e, value, row, index) {// 修改事件
                    updateMeterDetails(e, value, row, index);
                },
                exchange: function (e, value, row, index) {//换表事件 或其他事件
                    exchangeMeterDetails(e, value, row, index);
                },
                details: function (e, value, row, index) { //检测事件
                    communication(e, value, row, index);
                },
                onCheck: function (row) {
                    console.log(row);
                    var a = $('#tb_departments').bootstrapTable('getSelections');
                    if (a.length == 5 || checkBoxArray.length == 4 || overAllIds.length==4) {
                        $('#tb_departments').bootstrapTable('uncheckBy', {
                            field: 'mpId',
                            values: [row.mpId]
                        });
                        return;
                    }
                    var datas = $.isArray(row) ? row : [row];        // 点击时获取选中的行或取消选中的行
                    examine("check", datas);
                    selectData(row.mpName, row.mpId, true);
                }, onUncheck: function (row) {
                    var datas = $.isArray(row) ? row : [row];        // 点击时获取选中的行或取消选中的行
                    examine("uncheck", datas);
                    unSelectData(row);
                },
                operater: function () {
                    // var state=$("#states").val();
                    // return  checkStatus(state);
                }
            });
    };

    return oTableInit;
};


function examine(type, datas) {
    console.log(datas);
    if (type.indexOf('uncheck') == -1) {
        $.each(datas, function (i, v) {
            // 添加时，判断一行或多行的 id 是否已经在数组里 不存则添加　
            overAllIds.indexOf(v.mpId) == -1 ? overAllIds.push(v.mpId) : -1;
        });
    } else {
        $.each(datas, function (i, v) {
            console.log(v);
            console.log(overAllIds);
            console.log(overAllIds.indexOf(v.mpId));
            if (overAllIds.indexOf(v.mpId) > -1) {
                overAllIds.splice(overAllIds.indexOf(v.mpId), 1);
            }
            //删除取消选中行
        });
        console.log(console.log(overAllIds));
    }

    //console.log(overAllIds);
}



/**
 *   传递参数
 * @param params
 * @returns {string}
 */
function getMeterDataJson(params) {

    var temp = judgeIsEmpty();

    temp.page = {
        pageLine: params.limit,   //页面大小
        pageIndex: params.offset / params.limit + 1  //页码
    };


    return JSON.stringify(temp);
}

function judgeIsEmpty() {
    var name = $.trim($("#txt_search_departmentname").val());
    var state = $("#states").val();
    var createTime = $("#date2").val();
    var areaId = judgementAreaTreeIsSelected();//获得选中的节点ID 若未选中则是获取第一个父节点
    var temp = {
        state: 1
    };
    if (null != name && "" != name) {
        temp.dataItemValue = name;
        //temp.dataItemName="表钢号";
    }
    if (null != state && "" != state) {
        console.log("state不为空" + state);
        temp.state = state;
    }
    if (null != createTime && "" != createTime && createTime != "请选择日期范围") {
        //分割时间的方法
        var time = splitTime(createTime);
        temp.createTime = $.trim(time[0]);
        temp.deadlineTime = $.trim(time[1]);
    }
    if (null != areaId && "" != areaId) {
        temp.areaId = areaId;
    }
    return temp;

}



/**
 *  分割日期字符串
 * @param strTime
 * @returns {string[]}
 */
function splitTime(strTime) {
    var time = strTime.split("至");
    return time;
}


/**
 *  条件查询按钮
 */
function conditionalQuery() {
    var select_node = $('#treeview').treeview('getSelected');//获得选中的节点
    $("#tb_departments").bootstrapTable("refresh");
}


/**
 *  加载错误时处理
 * @param res
 * @returns {*}
 */
function loadError(res) {
    var myChart = echarts.init(document.getElementById('main'));
    myChart.dispose();
    $("#selectedDeviceName").text("");
    $("#baseMpInfo").empty();
    $("#baseDataItem").empty();
    return res;
}



/*----------------------------------------------表格的操作.js--------------------------------------------------*/
/**
 *   复选框默认被选中
 * @param value
 * @param row
 * @param index
 * @returns {*}
 */
function stateFormatter(value, row, index) {
    if (index == 0) {
        //初始化曲线图 初始化之前，拿到表计id 到数据库查一次，得到其类型，是民用表还是工业表
        //drawChartData(row.mpId);
        //初始化表计名和时间
        initReportTime(row.mpName);
        //初始化最右侧表计信息
        changeTheTabmeter(row.mpId);
        //初始化数据项信息
        initdataItem(row.mpId);

        // return {
        //     checked : true//设置选中
        // };
    }
    if ($.inArray(row.mpId, overAllIds) != -1) {// 因为 判断数组里有没有这个 id
        return {
            checked: true               // 存在则选中
        }
    }
    return value;
}

function lookupTypeByMpId(mpId) {
    var temp = {
        mpId: mpId,
    };
    var data = "";
    $.ajax({
        url: "meters/getMeterType",
        type: "post",
        dataType: "json",
        async: false,//取消异步
        data: "parameter=" + JSON.stringify(temp),
        success: function (datas) {
            data = datas;
        }
    });
    return data;
}


function refreshTable() {
    document.getElementById("states").options.selectedIndex = 0; //回到初始状态
    $("#states").selectpicker('refresh');//对customerType这个下拉框进行重置刷新
}

function judgingReturnData(datas) {
    if (datas.code == 200) {
        $("#message").text(datas.description);
        $("#tb_departments").bootstrapTable("refresh");
        $("#my-modal-alert").modal('show');
    } else {
        $("#message").text(datas.description);
        $("#my-modal-alert").modal('show')
    }
}

function editMemberInfoShow() {
    var arrselectedData = $("#tb_departments").bootstrapTable(
        'getSelections');
    if (arrselectedData.length <= 0) {
        return false;
    } else {
        return true;
    }
}

//获取选中的id
function getIdSelections() {
    return $.map($("#tb_departments").bootstrapTable('getSelections'), function (row) {
        return row.mpId;
    });
}

/**
 *  双击行的修改事件
 * @param row
 */
function dbClickUpdate(row) {
    changeDev(row.mpId);
}

/**
 *  单击事件
 * @param row
 */
function onClickChange(row) {
    //单击行的同时 动态加载曲线图
    //drawChartData(row.mpId);
    //初始化表计名和时间
    initReportTime(row.mpName);
    //动态加载表计的基本信息
    changeTheTabmeter(row.mpId);
    //动态加载设备的数据项信息
    initdataItem(row.mpId);
}






/*----------------------------------------------动态加载最右侧表计信息.js--------------------------------------------------*/
/**
 *    根据表计ID动态加载最右侧的表计基本信息
 */
function changeTheTabmeter(parentId) {
    var temp = {
        mpId: parentId,
    };
    var str = "";
    $.ajax({
        url: "meters/meterAndDevInformation",
        type: "post",
        dataType: "json",
        data: "parameter=" + JSON.stringify(temp),
        success: function (datas) {
            $.each(datas, function (index, data) {
                if (index % 2 == 0) {
                    str += "<div class='row'><div class='col-sm-6 col-md-6'><h5 class='text-center text-primary'>" + data.name + "</h5>" +
                        "<p class='text-center'style='word-wrap:break-word;word-break:break-all;overflow: hidden;'>" + data.value + "</p></div>"
                } else {
                    str += "<div class='col-sm-6 col-md-6'><h5 class='text-center text-primary'>" + data.name + "</h5>" +
                        "<p class='text-center'style='word-wrap:break-word;word-break:break-all;overflow: hidden;'>" + data.value + "</p></div></div>";
                }
            });
            $("#baseMpInfo").empty();
            $("#baseMpInfo").append(str);
        }
    });
}

/**
 *      根据表计ID动态加载数据项信息
 */
function initdataItem(parentId) {
    var temp = {
        mpId: parentId,
    };
    var str = "";
    $.ajax({
        url: "meters/initdataItem",
        type: "post",
        dataType: "json",
        data: "parameter=" + JSON.stringify(temp),
        success: function (datas) {
            $.each(datas, function (index, data) {
                if (index % 2 == 0) {
                    str += "<div class='row'><div class='col-sm-6 col-md-6'><h5 class='text-center text-primary'>" + data.name + "</h5>" +
                        "<p class='text-center'style='word-wrap:break-word;word-break:break-all;overflow: hidden;'>" + data.value + "</p></div>"
                } else {
                    str += "<div class='col-sm-6 col-md-6'><h5 class='text-center text-primary'>" + data.name + "</h5>" +
                        "<p class='text-center'style='word-wrap:break-word;word-break:break-all;overflow: hidden;'>" + data.value + "</p></div></div>";
                }
            });
            $("#baseDataItem").empty();
            $("#baseDataItem").append(str);
        }
    });

}
