
var hisButton = "瞬时流量";
function refreshCurve() {//刷新曲线
    if (checkBoxArray.length > 0) {
        var a = checkBoxArray.concat();
        checkBoxArray.length = 0;
        for (var i = 0; i < a.length; ++i) {
            selectData(a[i].name, a[i].mpId);
        }
        if(checkBoxArray.length==0){
            checkBoxArray = a.concat();
        }
        var x = getXData(getCurvType());
        reLoadChart(getCurvType(), x);
    }
    else
        selectDataSingle(null,null,true);
}
function changeCurveType(type) {
    $("#showCurveType").text(type);
    //var a = $('#tb_departments').bootstrapTable('getSelections');

    refreshCurve();
}
function changHistoryType(t) {
    hisButton = $(t).text().replace(/\ +/g, "").replace(/[\r\n]/g, "");
    $("#orderbutton").children().removeClass("active");
    $(t).addClass("active");//每次都添加这个样式

    // var a = $('#tb_departments').bootstrapTable('getSelections');
    //  var a = checkBoxArray;
    refreshCurve();
}



/*-----------------------------------------------曲线图的js---------------------------------------------------------*/

function drawChartData(parentId) {

    var datas = lookupTypeByMpId(parentId);

    var microtimeTems = [];         //瞬时流量数组（存放服务器返回的所有温度值）
    var pressureTems = [];         //压力数组
    var temperatureTems = [];          //温度数组
    var hourTems = [];        //小时用量数组
    var installDates = [];        //时间数组

    var myChart = echarts.init(document.getElementById('main'));

    myChart.showLoading();    //数据加载完之前先显示一段简单的loading动画
    if (datas.value == "3") {        //民用表
        //civilMeter(myChart,parentId,hourTems,installDates);
    } else {          //工业表
        //industrialMeter(myChart, parentId, microtimeTems, pressureTems, temperatureTems, hourTems, installDates);
    }
    setTimeout(function () {
        window.onresize = function () {
            myChart.resize();
        }
    }, 200);
}

function industrialMeter(myChart, parentId, microtimeTems, pressureTems, temperatureTems, hourTems, installDates) { //工业表
    var option = industrialOption();//获取默认对象
    // $.ajax({
    //     type : "post",
    //     async : true,        //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
    //     url : "report/getAHourMeterData",
    //     data : "parameter="+hourlyDataParameters(parentId),
    //     dataType : "json",
    //     success : function(result) {
    //         if (result != null && result.length > 0) {
    //             for(var i=0;i<result.length;i++){
    //                 microtimeTems.push(result[i].microtime);
    //                 pressureTems.push(result[i].pressure);
    //                 temperatureTems.push(result[i].temperature);
    //                 hourTems.push(result[i].hour);
    //                 installDates.push(result[i].installDate);
    //             }
    //             myChart.hideLoading();    //隐藏加载动画
    //
    //             myChart.setOption({        //载入数据
    //                 xAxis: {
    //                     data: installDates    //填入X轴数据
    //                 },
    //                 series:getSeries(microtimeTems)
    //             });
    //             window.onresize = myChart.resize;
    //         }
    //         else {
    //             myChart.hideLoading();
    //         }
    //     },
    //     error : function(errorMsg) {
    //         myChart.hideLoading();
    //     }
    // });
    //初始化曲线图
    myChart.clear();
    myChart.setOption(option);  //载入图表
}

function getSeries(a) {
    var pa = [{
        name: '瞬时流量1',
        data: a
    }]
    return pa;
}

/**
 * 选中处理曲线
 */
var s_name;//静态
var s_mpId;//静态
var checkBoxArray = [];
function selectDataSingle(name, mpId, runTime) {
    if(name != null && mpId != null)
    {
        s_name = name;
        s_mpId = mpId;
    }

    var obj = {
        name: null,
        data: '',
        mpId: ''
    };
    obj.name = s_name;
    obj.mpId = s_mpId;
    var curveType = getCurvType();//当前数据类型
    var x = getXData(curveType);//横轴数据
    var param = {
        "curveType": curveType,
        "mpId": obj.mpId,
        "hisButton": hisButton
    }
    var json = JSON.stringify(param);
    $.ajax({
        type: "post",
        async: false,        //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url: "meterCurve/getMultData",
        data: {
            "parameter": json
        },
        dataType: "json",
        success: function (result) {
            console.log(result);
            obj.data = result;
            console.log(obj.name);
            console.log("数组选择后：");
            if (runTime){
                var myChart = echarts.init(document.getElementById('main'));
                myChart.clear();
                var option = industrialOption();//获取默认对象
                myChart.setOption(option);  //载入图表
                myChart.hideLoading();    //隐藏加载动画

                myChart.setOption({        //载入数据
                    xAxis: {
                        data: x    //填入X轴数据
                    },
                    series: [obj]
                });
                window.onresize = myChart.resize;
            }
        },
        error: function (errorMsg) {
            return "";
        }
    });


}

function selectData(name, mpId, runTime) {

    var obj = {
        name: null,
        data: '',
        mpId: ''
    };
    obj.name = name;
    obj.mpId = mpId;
    var curveType = getCurvType();//当前数据类型
    var x = getXData(curveType);//横轴数据
    var param = {
        "curveType": curveType,
        "mpId": mpId,
        "hisButton": hisButton
    }
    var json = JSON.stringify(param);
    $.ajax({
        type: "post",
        async: false,        //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url: "meterCurve/getMultData",
        data: {
            "parameter": json
        },
        dataType: "json",
        success: function (result) {
            console.log(result);
            obj.data = result;
            checkBoxArray.push(obj);
            console.log(obj.name);
            console.log("数组选择后：" + checkBoxArray.length);
            if (runTime) reLoadChart(curveType, x);
        },
        error: function (errorMsg) {
            return "";
        }
    });


}

function reLoadChart(curveType, x) {
    var myChart = echarts.init(document.getElementById('main'));
    myChart.clear();
    var option = industrialOption();//获取默认对象
    myChart.setOption(option);  //载入图表
    myChart.hideLoading();    //隐藏加载动画

    myChart.setOption({        //载入数据
        xAxis: {
            data: x    //填入X轴数据
        },
        series: checkBoxArray
    });
    window.onresize = myChart.resize;
}

function getXData(curveType) {
    if (curveType == 1) {
        return getXH();
    } else if (curveType == 2) {
        return getXD();
    } else if (curveType == 3) {
        return getXM();
    } else if (curveType == 4) {
        return getXY();
    }
}

function getCurvType() {
    var curveType = $("#showCurveType").text();
    if (curveType == "小时曲线") {
        curveType = 1;
    } else if (curveType == "日曲线") {
        curveType = 2;
    } else if (curveType == "月曲线") {
        curveType = 3;
    } else if (curveType == "年曲线") {
        curveType = 4;
    }
    return curveType;
}

/**
 * 取消选中处理曲线
 */
function unSelectData(row) {
    var curveType = getCurvType();
    var l = checkBoxArray.length;
    console.log("-数组长度：" + l)
    if (l > 0) {
        for (var i = 0; i < l; i++) {
            console.log(checkBoxArray[i].name + "    " + row.mpName);
            if (checkBoxArray[i].name == row.mpName) {
                checkBoxArray.splice(i, 1);//删除该数组
                break;
            }
        }
        var x = getXData(getCurvType());
        reLoadChart(curveType, x);
    }
    console.log("数组取消后：" + checkBoxArray.length);
}

function getData(mpId, curveType) {

    var param = {
        "curveType": curveType,
        "mpId": mpId,
        "hisButton": hisButton
    }
    var json = JSON.stringify(param);
    $.ajax({
        type: "post",
        async: true,        //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
        url: "meterCurve/getMultData",
        data: {
            "parameter": json
        },

        dataType: "json",
        success: function (result) {
            console.log(result);
            console.log(result[0]);
            return result;
        },
        error: function (errorMsg) {
            return "";
        }
    });
}

function civilMeter(myChart, parentId, hourTems, installDates) { //民用表
    var option = meterOption();
    $.ajax({
        type: "post",
        async: true,
        url: "report/getAHourMeterData",
        data: "parameter=" + hourlyDataParameters(parentId),
        dataType: "json",
        success: function (result) {
            if (result != null && result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    hourTems.push(result[i].hour);
                    installDates.push(result[i].installDate);
                }
                myChart.hideLoading();    //隐藏加载动画

                myChart.setOption({        //载入数据
                    xAxis: {
                        data: installDates    //填入X轴数据
                    },
                    series: [    //填入系列（内容）数据
                        {
                            name: '小时用量',
                            data: hourTems
                        }
                    ]
                });
                window.onresize = myChart.resize;
            }
            else {
                myChart.hideLoading();
            }
        },
        error: function (errorMsg) {
            myChart.hideLoading();
        }
    });
    //初始化曲线图
    myChart.clear();
    myChart.setOption(option);  //载入图表
}


function hourlyDataParameters(parentId) {
    var temp = {
        dataType: 1,
        startTime: getTime() + " 00:00:00",
        endTime: getTime() + " 23:59:00"
    };
    if ("" != parentId && null != parentId) {
        temp.mpId = parentId;
    }
    return JSON.stringify(temp);
}

/**
 *     所点击的日折线图改变
 * @param dateType
 */
function changeBackContent(dateType) {
    if (dateType == 1) {
        $("#echartsType").text("← 日折线图");
    } else if (dateType == 4) {
        $("#echartsType").text("← 分钟折线图");
    } else {
        $("#echartsType").text("← 小时折线图");
    }
}


/**
 *  工业表的默认初始化对象
 */
function industrialOption() {
    var option = {
        title: {
            //text: '表计实时数据曲线图',
            subtext: ''
        },
        tooltip: {
            trigger: 'axis'
        },
        // color:[
        //     '#a23531','#2f4554','#61a0a8','#d48265'
        // ],
        dataZoom: [
            {
                type: 'inside',    //支持单独的滑动条缩放
                start: 0,            //默认数据初始缩放范围为10%到90%
                end: 100
            }
        ],
        // legend: {   //图表上方的类别显示
        //     show:false,
        //     data:['瞬时流量','压力','温度','小时用量'],   //从后台取 组成此数据
        //     selectedMode : 'single'
        // },
        toolbox: {
            show: true,
            feature: {
                dataView: {readOnly: false},
                magicType: {type: ['line']},
                restore: {},
                saveAsImage: {}
            },
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [] //先设置数据值为空，后面用Ajax获取动态数据填入
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value}'
            }
        },
        series: [
            {
                name: '瞬时流量',
                type: 'line',
                data: [],
                symbol: 'circle',
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                },
                markLine: {
                    data: [
                        {type: 'average', name: '平均值'}
                    ]
                }
            },
            {
                name: '压力 (mPa)',
                type: 'line',
                data: [],
                symbol: 'circle',
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                },
                markLine: {
                    data: [
                        {type: 'average', name: '平均值'}
                    ]
                }
            },
            {
                name: '温度 （℃）',
                type: 'line',
                data: [],
                symbol: 'circle',
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                },
                markLine: {
                    data: [
                        {type: 'average', name: '平均值'}
                    ]
                }
            },
            {
                name: '小时用量',
                type: 'line',
                data: [],//先设置数据值为空，后面用Ajax获取动态数据填入
                symbol: 'circle',    //设置折线图中表示每个坐标点的符号；emptycircle：空心圆；emptyrect：空心矩形；circle：实心圆；emptydiamond：菱形
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                },
                markLine: {
                    data: [
                        {type: 'average', name: '平均值'}
                    ]
                }
            }
        ]
    };
    return option;
}

/**
 *  民用表的默认对象
 */
function meterOption() {
    var option = {
        title: {
            //text: '表计实时数据曲线图',
            subtext: ''
        },
        tooltip: {
            trigger: 'axis'
        },
        color: [
            '#d48265'
        ],
        dataZoom: [
            {
                type: 'inside',    //支持单独的滑动条缩放
                start: 0,            //默认数据初始缩放范围为10%到90%
                end: 100
            }
        ],
        legend: {   //图表上方的类别显示
            show: true,
            data: ['小时用量']   //从后台取 组成此数据
        },
        toolbox: {
            show: true,
            feature: {
                dataView: {readOnly: false},
                magicType: {type: ['line']},
                restore: {},
                saveAsImage: {}
            },
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: []    //先设置数据值为空，后面用Ajax获取动态数据填入
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value}'
            }
        },
        series: [
            {
                name: '小时用量',
                type: 'line',
                data: [],//先设置数据值为空，后面用Ajax获取动态数据填入
                symbol: 'circle',    //设置折线图中表示每个坐标点的符号；emptycircle：空心圆；emptyrect：空心矩形；circle：实心圆；emptydiamond：菱形
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                },
                markLine: {
                    data: [
                        {type: 'average', name: '平均值'}
                    ]
                }
            },
        ]
    };
    return option;
}

function getXH() {
    var x = [];
    for (var i = 1; i < 25; i++) {
        x.push(i);
    }
    return x;
}

function getXD() {
    var x = [];
    var d = getCountDays();
    for (var i = 1; i <= d; i++) {
        x.push(i);
    }
    return x;
}

function getXM() {
    var x = [];
    for (var i = 1; i < 13; i++) {
        x.push(i)
    }
    return x;
}

function getXY() {
    var x = [];
    var date = new Date;
    var year = date.getFullYear();
    var start = year - 10;
    for (i = start; i <= year; i++) {
        x.push(i);
    }
    return x;
}

/**
 * 获得当月天数
 * @returns {number}
 */
function getCountDays() {
    var curDate = new Date();
    /* 获取当前月份 */
    var curMonth = curDate.getMonth();
    /*  生成实际的月份: 由于curMonth会比实际月份小1, 故需加1 */
    curDate.setMonth(curMonth + 1);
    /* 将日期设置为0, 这里为什么要这样设置, 我不知道原因, 这是从网上学来的 */
    curDate.setDate(0);
    /* 返回当月的天数 */
    return curDate.getDate();
}
