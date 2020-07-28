var commChart = (function () {

    var obj = new Object();

    obj.echartObj = null;
    obj.init = function (parObj) {//{divID:"curve",url: null,par: null,type:["line","line","line"]}
        if (parObj.theme) {
            obj.echartObj = echarts.init(document.getElementById(parObj.divID), parObj.theme);
        }
        obj.echartObj = echarts.init(document.getElementById(parObj.divID), "macarons");
        obj.setOption(parObj);
        obj.urlRefresh();
    };
    obj.dataStore = {//数据对象
        title: null,
        id: [123, 234, 456],
        dimensions: [],
        legend: {
            data: []
        },
        axis: {
            xAxis: {
                type: 'category'
            },
            yAxis: {
                scale: true,
                splitArea: {
                    // show: false
                    show: true
                },
                type: 'value'
            }
        },
        xData: [],//x轴数据
        data: []
    };

    obj.fillDataPar = function (dataPar) {//仅仅填写数据参数
        if (dataPar.title) {
            obj.dataStore.title = dataPar.title;
        }
        if (dataPar.legendData) {
            obj.dataStore.legend.data = dataPar.legendData;
        }
        if (dataPar.axis) {
            obj.dataStore.axis = dataPar.axis;
        }
        if (dataPar.xAxisName) {
            obj.dataStore.axis.xAxis['name'] = dataPar.xAxisName;
        }
        if (dataPar.xData) {
            obj.dataStore.xData = dataPar.xData;
        }
    };

    obj.typeCurve = function (dataObj) {//画曲线
        var tempSeries = [];//用于添加不用填写的默认内容
        for (i = 0; i < obj.dataStore.data.length; i++) {
            tempSeries.push({
                type: obj.option.type[i],
                name: obj.dataStore.dimensions[i] ? obj.dataStore.dimensions[i] : null,
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                },
                symbol: 'rect',
                // seriesLayoutBy:'row'
                data: obj.dataStore.data[i]
            });
        }

        var tempxAxis = obj.dataStore.axis.xAxis;//用于添加不用填写的默认内容
        tempxAxis.data = obj.dataStore.xData;
        obj.echartObj.setOption({
            title: {
                text: obj.dataStore.title
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: obj.dataStore.legend,
            xAxis: tempxAxis,
            yAxis: obj.dataStore.axis.yAxis,
            series: tempSeries
        }, true);
    };

    obj.typePie = function (dataObj) {//画饼
        var tempSeries = [];//用于添加不用填写的默认内容
        for (i = 0; i < obj.dataStore.data.length; i++) {
            tempSeries.push({
                type: obj.option.type[i],
                data: obj.dataStore.data[i]
            });
        }
        obj.echartObj.setOption({
            title: {
                text: obj.dataStore.title
            },
            tooltip: {
                trigger: 'item'
            },
            legend: obj.dataStore.legend,
            series: tempSeries
        }, true);
    };

    obj.fillDataStoreAndRefreshChart = function (dataObj) {//title: 测试曲线,dimensions: ["企业1", "企业2", "企业3", "企业4"],legend: null,axis: null, xData: ['1','2','3','4','6','7','8','9','10','11','12'],data: []},
        obj.fillDataPar(dataObj);
        console.log(obj.option.appendFlag);
        console.log(obj.dataStore.id);
        console.log(obj.dataStore);
        if (dataObj.id && obj.option.appendFlag) {//有id号，
            console.log(111);
            for (var i = 0; i < dataObj.id.length; i++) {
                console.log(333333);
                console.log(dataObj.id[i] + "+" + obj.dataStore.id);
                var location = $.inArray(dataObj.id[i], obj.dataStore.id);
                console.log(location);
                if (location >= 0) {//id相同就替换
                    console.log(location);
                    obj.dataStore.id[location] = dataObj.id[i];
                    if (dataObj.dimensions) {
                        obj.dataStore.dimensions[location] = dataObj.dimensions[i];
                    }
                    if (dataObj.data) {
                        obj.dataStore.data[location] = dataObj.data[i];
                    }
                } else {//没有该曲线，则增加到后面
                    console.log(location);
                    obj.dataStore.id.push(dataObj.id[i]);
                    if (dataObj.dimensions)
                        obj.dataStore.dimensions.push(dataObj.dimensions[i]);
                    if (dataObj.data)
                        obj.dataStore.data.push(dataObj.data[i]);
                }
            }
        } else {//没有id号，全盘刷新
            console.log(222);
            if (dataObj.id) {
                obj.dataStore.id = dataObj.id;
            }
            if (dataObj.dimensions) {
                obj.dataStore.dimensions = dataObj.dimensions;
            }
            if (dataObj.data) {
                obj.dataStore.data = dataObj.data;
            }
        }
        if (obj.dataStore.data.length <= obj.option.type.length) {
            //do nothing
        } else {
            for (i = 0; i < obj.dataStore.data.length; i++) {
                if (obj.option.type[i]) {
                    //do nothing
                } else {
                    obj.option.type.push(obj.option.type[0]);//添加第一种类型
                }
            }
        }
        if (obj.option.type[0] == 'line' || obj.option.type[0] == 'bar') {
            obj.typeCurve(dataObj);
        } else if (obj.option.type[0] == 'pie') {
            obj.typePie(dataObj);
        }
    };

    obj.option = {
        url: null,
        par: null,
        type: ['line'],
        appendFlag: false
    };

    obj.setOption = function (parObj) {//url: null,par: null,
        console.log(parObj.appendFlag);
        if (parObj.url) {
            obj.option.url = parObj.url;
        }
        if (parObj.par) {
            obj.option.par = parObj.par;
        }
        if (parObj.type) {
            obj.option.type = parObj.type;
        }
        if (parObj.appendFlag != null && parObj.appendFlag != undefined) {
            if (obj.option.appendFlag != parObj.appendFlag) {//清除上一种模式中的数据
                obj.dataStore.title = null;
                obj.dataStore.id = [];
                obj.dataStore.dimensions = [];
                obj.dataStore.data = [];
            }
            obj.option.appendFlag = parObj.appendFlag;
        }
    };

    obj.urlRefresh = function (par) {//远程请求数据并刷新
        if (par) {
            obj.option.par = par;
        }
        if (obj.option.url) {//有url则向url发请求
            $.ajax({
                type: "post",
                async: true,        //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
                url: obj.option.url,
                data: {
                    "parameter": obj.option.par
                },
                dataType: "json",
                success: obj.fillDataStoreAndRefreshChart,
                error: function (errorMsg) {
                    return "";
                }
            });
        }
    };

    return obj;
})();

