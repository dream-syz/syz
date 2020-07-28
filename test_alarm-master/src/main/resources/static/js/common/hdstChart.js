var CommChart = function () {

    var obj = new Object();

    var _standardObj = {
            title: {
                text: '',
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data: []
            },
            xAxis: {
                type: 'category'
            },
            yAxis: {
                type: 'value'
            },
            series: []
        },
        _standardPieObj = {
            title: {
                text: ''
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'horizontal',
                x: 'center',
                data: null
            },
            series: []
        };
    var initOption;
    var currentOption;

    obj.echartObj = null;

    obj.options = {
        url: null,
        par: null,
        type: 'line',                         //提供一次生成多个图的功能,type为数组形式['line','line']或者[obj1,obj2,obj3],待定
        appendFlag: false,
        series: []
    };

    obj.init = function (parObj) {
        //  echarts.init(dom,theme,opts);
        if (parObj.theme) {
            obj.echartObj = echarts.init(parObj.dom, parObj.theme);
        } else {
            obj.echartObj = echarts.init(parObj.dom, "macarons");
        }
        obj.dom = parObj.dom;
        parObj.options && obj.setOption(parObj.options);
        // obj.dataFill();
    };

    // obj.init = function (parObj) {                              //{divID:"curve",url: null,par: null,type:["line","line","line"]}
    //     if (parObj.theme) {
    //         obj.echartObj = echarts.init(document.getElementById(parObj.divID), parObj.theme);
    //     }
    //     obj.echartObj = echarts.init(document.getElementById(parObj.divID), "macarons");
    //     obj.setOption(parObj);
    //     obj.urlRefresh();
    // };

    obj.setOption = function (opts) {
        initOption = opts;
        //判断type类型决定当前的图，原则是设置一次option生成一个chart图
        //不用再判断是否有type,会默认'line'
        var tempOpt = new Object;
        switch (opts.type) {
            case "pie":
                console.log("pie");
                tempOpt = {
                    title: {
                        text: opts.title
                    },
                    legend: {
                        top: '3%',
                        data: opts.name
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    series: [
                        {
                            name: opts.pieName,
                            type: 'pie',
                            radius: ['0%', '65%'],
                            center: ['50%', '50%'],
                            selectedMode: 'single',                                         //选择模式single | multiple = true
                            data: []
                        }
                    ]
                };
                $.each(opts.data, function (index, ele) {
                    tempOpt.series[0].data.push({
                        value: ele,
                        name: opts.name && opts.name[index]
                    })
                });
                currentOption = $.extend(_standardPieObj, tempOpt);
                obj.echartObj.setOption(_standardPieObj);
                break;
            case "nest":
                tempOpt = {
                    title: {
                        text: opts.title
                    },
                    legend: {
                        top: '10%',
                        left: "left",
                        orient: "vertical",
                        data: opts.name
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    series: []
                };
                if (opts.data.length > 1) {
                    $.each(opts.data, function (index, ele) {
                        //判断是否为最后一个，最后一个需要添加丰富提示样式
                        if (index < opts.data.length - 1) {
                            tempOpt.series.push({
                                name: ele.name,
                                type: 'pie',
                                selectedMode: 'single',
                                // radius: [0, '30%'],
                                label: {
                                    normal: {
                                        position: 'inner'
                                    }
                                },
                                labelLine: {
                                    normal: {
                                        show: false
                                    }
                                },
                                data: []
                            });

                            //区分index, index = 1 是中心圆，半径规则不同，之后每个递增25%
                            if (index == 0) {
                                tempOpt.series[0].radius = [0, '30%'];
                            } else {
                                tempOpt.series[index].radius = [(index - 1) * 25 + 40 + '%', (index - 1) * 25 + 40 + 15 + '%'];
                            }

                            //填入具体的data value
                            $.each(ele.items, function (innerIndex, innerEle) {
                                tempOpt.series[index].data.push({
                                    name: innerEle,
                                    value: ele.value[innerIndex]
                                });
                            });

                        } else {
                            tempOpt.series.push({
                                name: ele.name,
                                type: 'pie',
                                selectedMode: 'single',
                                radius: [(index - 1) * 25 + 40 + '%', (index - 1) * 25 + 40 + 15 + '%'],
                                label: {
                                    normal: {
                                        formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                                        backgroundColor: '#eee',
                                        borderColor: '#aaa',
                                        borderWidth: 1,
                                        borderRadius: 4,
                                        shadowBlur: 3,
                                        shadowOffsetX: 2,
                                        shadowOffsetY: 2,
                                        shadowColor: '#999',
                                        padding: [0, 7],
                                        rich: {
                                            a: {
                                                color: '#999',
                                                lineHeight: 22,
                                                align: 'center'
                                            },
                                            abg: {
                                                backgroundColor: '#333',
                                                width: '100%',
                                                align: 'right',
                                                height: 22,
                                                borderRadius: [4, 4, 0, 0]
                                            },
                                            hr: {
                                                borderColor: '#aaa',
                                                width: '100%',
                                                borderWidth: 0.5,
                                                height: 0
                                            },
                                            b: {
                                                fontSize: 16,
                                                lineHeight: 33
                                            },
                                            per: {
                                                color: '#eee',
                                                backgroundColor: '#334455',
                                                padding: [2, 4],
                                                borderRadius: 2
                                            }
                                        }
                                    }
                                },
                                data: []
                            });

                            //区分index, index = 1 是中心圆，半径规则不同，之后每个递增25%
                            if (index == 0) {
                                tempOpt.series[0].radius = [0, '30%'];
                            } else {
                                tempOpt.series[index].radius = [(index - 1) * 25 + 40 + '%', (index - 1) * 25 + 40 + 15 + '%'];
                            }

                            //填入具体的data value
                            $.each(ele.items, function (innerIndex, innerEle) {
                                tempOpt.series[index].data.push({
                                    name: innerEle,
                                    value: ele.value[innerIndex]
                                });
                            });

                        }

                    })
                }

                currentOption = $.extend(_standardPieObj, tempOpt);
                obj.echartObj.setOption(_standardPieObj);
                break;
            case "stack":
                console.log("stack");
                tempOpt = {
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    title: {
                        text: opts.title
                    },
                    legend: {
                        top: '4%',
                        data: opts.data
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    series: []
                };

                //判断主轴,如果是Y,则交替xyz轴的配置
                tempOpt = setChiefAxis(tempOpt, opts);

                //判断一个 | 多个 栈，通过data的格式中第一个是arr还是obj
                if (opts.data[0] instanceof Array) {
                    $.each(opts.data, function (index, ele) {
                        tempOpt.series.push({
                            name: opts.name[index],
                            type: "bar",
                            stack: "stack",
                            data: ele
                        })
                    });
                } else if (opts.data[0] instanceof Object) {
                    $.each(opts.data, function (index, ele) {
                        tempOpt.series.push({
                            name: ele.name,
                            type: "bar",
                            stack: ele.stack,
                            data: ele.value
                        })
                    });
                }

                currentOption = $.extend(_standardObj, tempOpt);
                obj.echartObj.setOption(_standardObj);
                break;
            case "bar":
            case "line":
            default:
                console.log("line");
                tempOpt = {
                    title: {
                        text: opts.title
                    },
                    legend: {
                        top: '3%',
                        data: opts.name instanceof Object ? opts.name : [opts.name]
                    },
                    xAxis: {
                        data: opts.xAxis,
                        type: 'category'
                    },
                    yAxis: {
                        type: 'value'
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    series: []
                };

                //判断主轴,如果是Y,则交替xy轴的配置
                tempOpt = setChiefAxis(tempOpt, opts);

                //根据itemsType 设置series
                if (opts.itemsType && opts.itemsType.length > 1) {
                    $.each(opts.itemsType, function (index, ele) {
                        tempOpt.series.push({
                            type: ele,
                            name: opts.name && opts.name[index],
                            data: opts.data[index]
                        });
                    });
                } else {
                    tempOpt.series.push({
                        type: opts.type ? opts.type : 'line',
                        name: opts.name,
                        data: opts.data
                    })
                }

                // multiple Y
                if (opts.yAxis && opts.yAxis.length > 1) {
                    console.log('多个Y轴');

                    //更改悬浮之后的样式
                    tempOpt.tooltip = {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross'
                        }
                    };

                    tempOpt.yAxis = [];
                    $.each(opts.yAxis, function (index, ele) {

                        //主轴填在第一个,出现在左边，其余默认向右排列
                        if (index == 0) {
                            tempOpt.yAxis.push({
                                type: 'value',
                                name: ele.name,
                                min: ele.min ? ele.min : null,
                                max: ele.max ? ele.max : null,
                                position: 'left',
                                axisLabel: {
                                    formatter: '{value} ' + ele.unit
                                }
                            });
                        } else {
                            tempOpt.yAxis.push({
                                type: 'value',
                                name: ele.name,
                                min: ele.min ? ele.min : null,
                                max: ele.max ? ele.max : null,
                                position: 'right',
                                offset: (index - 1) * 80,
                                axisLabel: {
                                    formatter: '{value} ' + ele.unit
                                }
                            })
                        }
                    });


                    //还需要再为series中的对象添加yIndex属性 && 设置 grid避免内容超出显示
                    $.each(tempOpt.series, function (index, ele) {
                        tempOpt.series[index].yAxisIndex = index;
                    });

                    tempOpt.grid = {
                        right: (opts.yAxis.length - 2) * 20 + '%'
                    }
                }

                // multiple X
                if (opts.xAxis[0] instanceof Object) {
                    console.log('multiple X');

                    //x也更改悬浮之后的样式，单独提出，之后可单独修改
                    tempOpt.tooltip = {
                        // trigger: 'axis',
                        axisPointer: {
                            type: 'cross'
                        }
                    };

                    tempOpt.xAxis = [];
                    $.each(opts.xAxis, function (index, ele) {
                        //按照规则填入xAxis
                        tempOpt.xAxis.push({
                            type: 'category',
                            axisTick: {
                                alignWithLabel: true
                            },
                            axisLine: {
                                onZero: false,
                            },
                            axisPointer: {
                                label: {
                                    formatter: function (params) {
                                        return params.value + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
                                    }
                                }
                            },
                            data: opts.xAxis[index].scale
                        });
                    });

                    //也需要再为series中的对象添加xIndex属性 && 确定是否需要平滑加载
                    $.each(tempOpt.series, function (index, ele) {
                        tempOpt.series[index].xAxisIndex = index;
                        tempOpt.series[index].smooth = opts.xAxis[index].smooth ? opts.xAxis[index].smooth : false;
                    });
                }

                currentOption = $.extend(_standardObj, tempOpt);
                obj.echartObj.setOption(_standardObj);
        }
    };

    obj.setEChartOption = function (options) {
        obj.echartObj.setOption(options);
    };

    obj.getOption = function () {
        return currentOption;
    };

    obj.updateOption = function (opts) {
        obj.setOption($.extend(true, initOption, opts));
    };

    obj.dataFill = function (data) {//远程请求数据并刷新
        if (data) {
            obj.options.series = data;
        }
        if (obj.options.url) {//有url则向url发请求
            $.ajax({
                type: "post",
                async: true,        //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
                url: obj.option.url,
                data: {
                    "parameter": obj.option.par
                },
                dataType: "json",
                success: obj.fillDataStoreAndRefreshChart,
                complete: function (res) {
                    obj.fillDataStoreAndRefreshChart(getChartSeries());
                },
                error: function (errorMsg) {
                    return "";
                }
            });
        }
    };

    obj.dispose = function () {
        echarts.dispose(obj.dom);
    };


    // obj.dataStore = {//数据对象
    //     title: null,
    //     id: [123, 234, 456],
    //     dimensions: [],
    //     legend: {
    //         data: []
    //     },
    //     axis: {
    //         xAxis: {
    //             type: 'category'
    //         },
    //         yAxis: {
    //             scale: true,
    //             splitArea: {
    //                 // show: false
    //                 show: true
    //             },
    //             type: 'value'
    //         }
    //     },
    //     xData: [],//x轴数据
    //     data: []
    // };

    // obj.fillDataPar = function (dataPar) {//仅仅填写数据参数
    //     if (dataPar.title) {
    //         obj.dataStore.title = dataPar.title;
    //     }
    //     if (dataPar.legendData) {
    //         obj.dataStore.legend.data = dataPar.legendData;
    //     }
    //     if (dataPar.axis) {
    //         obj.dataStore.axis = dataPar.axis;
    //     }
    //     if (dataPar.xAxisName) {
    //         obj.dataStore.axis.xAxis['name'] = dataPar.xAxisName;
    //     }
    //     if (dataPar.xData) {
    //         obj.dataStore.xData = dataPar.xData;
    //     }
    // };

    // obj.typeCurve = function (dataObj) {//画曲线
    //     var tempSeries = [];//用于添加不用填写的默认内容
    //     for (i = 0; i < obj.dataStore.data.length; i++) {
    //         tempSeries.push({
    //             type: obj.option.type[i],
    //             name: obj.dataStore.dimensions[i] ? obj.dataStore.dimensions[i] : null,
    //             markPoint: {
    //                 data: [
    //                     { type: 'max', name: '最大值' },
    //                     { type: 'min', name: '最小值' }
    //                 ]
    //             },
    //             symbol: 'rect',
    //             // seriesLayoutBy:'row'
    //             data: obj.dataStore.data[i]
    //         });
    //     }

    //     var tempxAxis = obj.dataStore.axis.xAxis;//用于添加不用填写的默认内容
    //     tempxAxis.data = obj.dataStore.xData;
    //     obj.echartObj.setOption({
    //         title: {
    //             text: obj.dataStore.title
    //         },
    //         tooltip: {
    //             trigger: 'axis'
    //         },
    //         legend: obj.dataStore.legend,
    //         xAxis: tempxAxis,
    //         yAxis: obj.dataStore.axis.yAxis,
    //         series: tempSeries
    //     }, true);
    // };

    // obj.typePie = function (dataObj) {//画饼
    //     var tempSeries = [];//用于添加不用填写的默认内容
    //     for (i = 0; i < obj.dataStore.data.length; i++) {
    //         tempSeries.push({
    //             type: obj.option.type[i],
    //             data: obj.dataStore.data[i]
    //         });
    //     }
    //     obj.echartObj.setOption({
    //         title: {
    //             text: obj.dataStore.title
    //         },
    //         tooltip: {
    //             trigger: 'item'
    //         },
    //         legend: obj.dataStore.legend,
    //         series: tempSeries
    //     }, true);
    // };

    // obj.fillDataStoreAndRefreshChart = function (dataObj) {//title: 测试曲线,dimensions: ["企业1", "企业2", "企业3", "企业4"],legend: null,axis: null, xData: ['1','2','3','4','6','7','8','9','10','11','12'],data: []},
    //     obj.fillDataPar(dataObj);
    //     console.log(obj.option.appendFlag);
    //     console.log(obj.dataStore.id);
    //     console.log(obj.dataStore);
    //     if (dataObj.id && obj.option.appendFlag) {//有id号，
    //         console.log(111);
    //         for (var i = 0; i < dataObj.id.length; i++) {
    //             console.log(333333);
    //             console.log(dataObj.id[i] + "+" + obj.dataStore.id);
    //             var location = $.inArray(dataObj.id[i], obj.dataStore.id);
    //             console.log(location);
    //             if (location >= 0) {//id相同就替换
    //                 console.log(location);
    //                 obj.dataStore.id[location] = dataObj.id[i];
    //                 if (dataObj.dimensions) {
    //                     obj.dataStore.dimensions[location] = dataObj.dimensions[i];
    //                 }
    //                 if (dataObj.data) {
    //                     obj.dataStore.data[location] = dataObj.data[i];
    //                 }
    //             } else {//没有该曲线，则增加到后面
    //                 console.log(location);
    //                 obj.dataStore.id.push(dataObj.id[i]);
    //                 if (dataObj.dimensions)
    //                     obj.dataStore.dimensions.push(dataObj.dimensions[i]);
    //                 if (dataObj.data)
    //                     obj.dataStore.data.push(dataObj.data[i]);
    //             }
    //         }
    //     } else {//没有id号，全盘刷新
    //         console.log(222);
    //         if (dataObj.id) {
    //             obj.dataStore.id = dataObj.id;
    //         }
    //         if (dataObj.dimensions) {
    //             obj.dataStore.dimensions = dataObj.dimensions;
    //         }
    //         if (dataObj.data) {
    //             obj.dataStore.data = dataObj.data;
    //         }
    //     }
    //     if (obj.dataStore.data.length <= obj.option.type.length) {
    //         //do nothing
    //     } else {
    //         for (i = 0; i < obj.dataStore.data.length; i++) {
    //             if (obj.option.type[i]) {
    //                 //do nothing
    //             } else {
    //                 obj.option.type.push(obj.option.type[0]);//添加第一种类型
    //             }
    //         }
    //     }
    //     if (obj.option.type[0] == 'line' || obj.option.type[0] == 'bar') {
    //         obj.typeCurve(dataObj);
    //     } else if (obj.option.type[0] == 'pie') {
    //         obj.typePie(dataObj);
    //     }
    // };

    // obj.setOption = function (parObj) {//url: null,par: null,
    //     console.log(parObj.appendFlag);
    //     if (parObj.url) {
    //         obj.option.url = parObj.url;
    //     }
    //     if (parObj.par) {
    //         obj.option.par = parObj.par;
    //     }
    //     if (parObj.type) {
    //         obj.option.type = parObj.type;
    //     }
    //     if (parObj.appendFlag != null && parObj.appendFlag != undefined) {
    //         if (obj.option.appendFlag != parObj.appendFlag) {//清除上一种模式中的数据
    //             obj.dataStore.title = null;
    //             obj.dataStore.id = [];
    //             obj.dataStore.dimensions = [];
    //             obj.dataStore.data = [];
    //         }
    //         obj.option.appendFlag = parObj.appendFlag;
    //     }
    // };

    // obj.urlRefresh = function (par) {//远程请求数据并刷新
    //     if (par) {
    //         obj.option.par = par;
    //     }
    //     if (obj.option.url) {//有url则向url发请求
    //         $.ajax({
    //             type: "post",
    //             async: true,        //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
    //             url: obj.option.url,
    //             data: {
    //                 "parameter": obj.option.par
    //             },
    //             dataType: "json",
    //             success: obj.fillDataStoreAndRefreshChart,
    //             error: function (errorMsg) {
    //                 return "";
    //             }
    //         });
    //     }
    // };

    function setChiefAxis(obj, opts) {
        if (opts.chiefAxis == "Y") {
            obj.xAxis = {
                type: 'value'
            };
            obj.yAxis = {
                data: opts.xAxis,
                type: 'category'
            };
        } else {
            obj.yAxis = {
                type: 'value'
            };
            obj.xAxis = {
                data: opts.xAxis,
                type: 'category'
            };
        }
        return obj;
    }

    return obj;
};

