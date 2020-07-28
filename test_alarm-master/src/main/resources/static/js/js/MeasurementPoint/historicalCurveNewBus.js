let c = hdCommon;

let areaTreeWrap;
let customTreeWrap;

let historicalCurveBusiness = {};

function getCustomTree(nodeId) {
    let cusData;
    let par = {
        areaId: nodeId
    };
    let page = {
        pageLine: 26,
        pageIndex: 1
    };

    $.ajax("point/pointInfo/getPointInfoByArea", {
        type: 'POST',
        async: false,
        data: "parameter=" + JSON.stringify(par) + "&page=" + JSON.stringify(page),
        dataType: "json",
        success: function (result) {
            cusData = c.ztreeDeepFormat(result);
        },
        error: function (result) {
            console.log(result);
        }
    });
    return cusData;
}

function getChartOptions(nodeId) {
    var data = ["区域总表用量", "区域子表用量"].concat(getAreaDevice(nodeId));
    return {
        title: {
            text: '汽损量分析'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: data
        },
        xAxis: {
            data: ["2020-04-15", "2020-04-16", "2020-04-17", "2020-04-18", "2020-04-19"]
        },
        yAxis: [{
            type: 'value',
            axisLabel: {
                formatter: '{value} t'
            }
        },
            {
                type: 'value',
                axisLabel: {
                    formatter: '{value} %'
                }
            }],
        series: [{
            name: data[0],
            type: 'line',
            data: [
                35.62, 33.02, 22.11, 15.94, 18.50
            ]
        }, {
            name: data[1],
            type: 'line',
            data: [
                32.35, 31.16, 18.12, 11.12, 11.43
            ]
        }, {
            name: data[2],
            type: 'bar',
            stack: 'meter',
            yAxisIndex: 1,
            data: [
                5.62, 3.02, 2.11, 5.94, 8.50
            ]
        }, {
            name: data[3],
            type: 'bar',
            stack: 'meter',
            yAxisIndex: 1,
            data: [
                6.2, 3.02, 2.11, 1.94, 1.50
            ]
        }]
    };
}

function getAreaDevice(nodeId){
    var treeData = getCustomTree(nodeId);
    var arr = [];
    treeData && treeData.forEach((ele,index) => {
        arr.push(ele.name);
    });
    return arr;
}


function getZNodes() {
    return [
        {id:1, pId:0, name:"北京"},
        {id:2, pId:0, name:"天津"},
        {id:3, pId:0, name:"上海"},
        {id:6, pId:0, name:"重庆"},
        {id:4, pId:0, name:"河北省", open:true, nocheck:true},
        {id:41, pId:4, name:"石家庄"},
        {id:42, pId:4, name:"保定"},
        {id:43, pId:4, name:"邯郸"},
        {id:44, pId:4, name:"承德"},
        {id:5, pId:0, name:"广东省", open:true, nocheck:true},
        {id:51, pId:5, name:"广州"},
        {id:52, pId:5, name:"深圳"},
        {id:53, pId:5, name:"东莞"},
        {id:54, pId:5, name:"佛山"},
        {id:6, pId:0, name:"福建省", open:true, nocheck:true},
        {id:61, pId:6, name:"福州"},
        {id:62, pId:6, name:"厦门"},
        {id:63, pId:6, name:"泉州"},
        {id:64, pId:6, name:"三明"}
    ];
}

