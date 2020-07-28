
/*document.write("<script src='/js/js/authority/common/access-menu.js'></script>");
document.write("<script src='/js/js/authority/common/access-cache.js'></script>");
document.write("<script src='/js/js/authority/common/access-permission.js'></script>");*/
/*--------------------------------------通用的日期选择器js----------------------------------------------------------------------*/





var datePicker = (function () {

    var date = new Object();

    date.init = function (element, dateElement, startElement, endElement) {
        element.daterangepicker(
            {
                autoApply: true,
                timePicker: true,
                timePicker24Hour: true,
                autoUpdateInput: false,
                timePickerSeconds: true,
                alwaysShowCalendars: true,
                ranges: {
                    '今天': [moment(), moment()],
                    '昨天': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    '近7天': [moment().subtract(7, 'days'), moment()],
                    '这个月': [moment().startOf('month'), moment().endOf('month')],
                    '上个月': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                },
                locale: {
                    format: "YYYY/MM/DD HH:mm:ss",
                    separator: " - ",
                    applyLabel: "确认",
                    cancelLabel: "清空",
                    fromLabel: "开始时间",
                    toLabel: "结束时间",
                    customRangeLabel: "自定义",
                    daysOfWeek: ["日", "一", "二", "三", "四", "五", "六"],
                    monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
                }
            }
            ).on('cancel.daterangepicker', function (ev, picker) {
            dateElement.val("");
            startElement.val("");
            endElement.val("");
        }).on('apply.daterangepicker', function (ev, picker) {
            startElement.val(picker.startDate.format('YYYY-MM-DD HH:mm:ss'));
            endElement.val(picker.endDate.format('YYYY-MM-DD HH:mm:ss'));
            dateElement.val(picker.startDate.format('YYYY-MM-DD HH:mm:ss') + " 至 " + picker.endDate.format('YYYY-MM-DD HH:mm:ss'));
        });
    };

    return date;
}());

var Common = (function () {

    var com = new Object();

    com.isEmpty = function (str) {

        if (typeof str == "null") {
            return true;
        }

        return (!str || 0 === str.length);
    };

    com.splitTime = function (strTime) {
        var time = strTime.split("至");
        return time;
    };

    com.equals = function (param, param2) {
        return JSON.stringify(param) === JSON.stringify(param2);
    };

    //是否存在指定函数
    com.isExitsFunction = function (funcName) {
        try {
            if (typeof(eval(funcName)) == "function") {
                return true;
            }
        } catch (e) {
        }
        return false;
    };

    com.getSelectPickerList = function (obj, url, fieldOne, fieldTwo) {

        com.commonAjax(url, true, null, function (data) {

            $.each(data, function (i, n) {
                obj.append(" <option value=\"" + n[fieldOne] + "\">" + n[fieldTwo] + "</option>");
            });

            obj.selectpicker('val', '');
            $('.selectpicker').selectpicker('refresh');

        }, null);
    };

    com.initScrollBar = function (element) {
        element.mCustomScrollbar({
            scrollButtons: {
                enable: false,
                scrollType: "continuous",
                scrollSpeed: 20,
                scrollAmount: 40
            },
            theme: "3d-dark",
            horizontalScroll: false
        });
    };

    com.initScrollBarAndCallbacks = function (element, callback) {

        element.mCustomScrollbar({
            scrollButtons: {
                enable: false,
                scrollType: "continuous",
                scrollSpeed: 20,
                scrollAmount: 40
            },
            theme: "3d-dark",
            horizontalScroll: false,
            callbacks: {
                onTotalScroll: function () {
                    callback();
                },
            }
        });
    };

    com.arrayFilter = function (datas, name, value) {

        var data = datas.filter(function (item) {
            return item[name] == value;
        });

        return data.length > 0 ? data : null;
    };

    com.InitAreaTreeBySysUser = function (url, element, parameter) {

        com.initTreeView(element, url, parameter);
    };

    com.initTreeView = function (element, url, parameter) {

        var options = {
            url: url,
            data: parameter,
            bootstrap2: false,
            showTags: false,
            expand: true
        };

        console.log(options);
        element.initTree(options);
    };

    com.initTreeViewByDatas = function (element, datas) {

        var options = {
            bootstrap2: false,
            showTags: false,
            levels: 1,
            data: datas,
            unique: true
        };
        element.empty();
        element.treeview(options);
    };

    com.judgementTreeIsSelected = function (element) {

        var select_node = element.treeview('getSelected');//获得选中的节点
        if (select_node[0]) {
            return select_node[0].id;
        }
        return "";
    };

    com.filterHeader = function (tableHeaders, filterHeaders) {
        var length1 = tableHeaders.length;
        var length2 = filterHeaders.length;
        var arr = [];
        for (var i = 0; i < length1; i++) {
            var flag = true;
            for (var j = 0; j < length2; j++) {
                if (tableHeaders.length > 0) {
                    if (com.isObjectValueEqual(tableHeaders[i], filterHeaders[j])) {
                        flag = false;
                    }
                }
            }
            if (flag) {
                arr.push(tableHeaders[i]);
            }
        }
        return arr;
    };

    com.filterHeaderByOneAttribute = function (tableHeaders, filterHeaders, attribute) {
        var length1 = tableHeaders.length;
        var length2 = filterHeaders.length;
        var arr = [];
        for (var i = 0; i < length1; i++) {
            var flag = true;
            for (var j = 0; j < length2; j++) {
                if (tableHeaders.length > 0) {
                    if (com.isObjectValueEqualByOneAttribute(tableHeaders[i], filterHeaders[j], attribute)) {
                        flag = false;
                    }
                }
            }
            if (flag) {
                arr.push(tableHeaders[i]);
            }
        }
        return arr;

    };

    com.isObjectValueEqualByOneAttribute = function (a, b, attribute) {

        if (a[attribute] !== b[attribute]) {
            return false;
        }

        return true;
    };

    com.isObjectValueEqual = function (a, b) {

        var aProps = Object.getOwnPropertyNames(a);
        var bProps = Object.getOwnPropertyNames(b);

        if (aProps.length != bProps.length) {
            return false;
        }

        for (var i = 0; i < aProps.length; i++) {
            var propName = aProps[i];

            if (a[propName] !== b[propName]) {
                return false;
            }
        }

        return true;
    };

    com.mergeArray = function (arr1, arr2) {
        for (var i = 0; i < arr1.length; i++) {
            for (var j = 0; j < arr2.length; j++) {
                if (com.equals(arr1[i], arr2[j])) {
                    arr1.splice(i, 1); //利用splice函数删除元素，从第i个位置，截取长度为1的元素
                }
            }
        }
    };

    com.formatDateByTimeStamp = function (value, row, index) {

        var value = value;

        if (typeof(value) != "undefined") {
            var y = "20" + value.substring(0, 2);
            var m = value.substring(2, 4);
            var d = value.substring(4, 6);
            var h = value.substring(6);
            var mm = "00";
            var s = "00";
            return y + "-" + m + "-" + d + " " + h + ":" + mm + ":" + s;
        }
        return "";
    };

    com.showMessageCon = function (message) {

        $("#message").text(message);
        $("#message_alert").modal('show');
    };

    com.clickChangeColorByTable = function (elements) {
        elements.on('click-row.bs.table', function (e, row, element) {
            $('.success').removeClass('success');//去除之前选中的行的，选中样式
            $(element).addClass('success');//添加当前选中的 success样式用于区别
        });
    };

    com.setDateTimeToTemp = function (temp, dataTime, selectTimeObj, reportType) {

        switch (reportType) {
            case "2":
                temp.startTime = year + "-" + month + "-" + "01" + " " + "00:00:00";       // "2019-06-12 00:00:00";
                temp.endTime = fullDate + " " + "00:00:00";                                      // "2019-06-13 00:00:00";
                break;
            case "3":
                temp.startTime = year + "-" + "01" + "-" + day + " " + "00:00:00";        // "2019-05-13 00:00:00";
                temp.endTime = fullDate + " " + "00:00:00";                                       // "2019-06-13 00:00:00";
                break;
            case "4":
                temp.startTime = (year - 10) + "-" + month + "-" + day + " " + "00:00:00";        // "2018-06-13 00:00:00";
                temp.endTime = fullDate + " " + "00:00:00";                                      // "2019-06-13 00:00:00";
                break;
            default:
                temp.startTime = fullDate + " " + "00:00:00";    // "2019-06-12 15:00:00";
                temp.endTime = fullDate + " " + hour + ":00:00";            // "2019-06-12 16:00:00";
        }
    };

    com.setDateTimeToTempNew = function (temp, selectTime, selectTimeObj, reportType,modeType) {
        if(modeType == 'meter'){
            switch (reportType) {
                case "1":
                case "2":
                case "3":
                case "4":
                    temp.startTime = Common.splitTime(selectTime)[0].trim();
                    temp.endTime = Common.splitTime(selectTime)[1].trim();
                    break;

                // case "1":
                //     temp.startTime = selectTime;
                //     temp.endTime = selectTimeObj.year + "-" + Common.fillDigits(selectTimeObj.month) + "-" + Common.fillDigits(selectTimeObj.date) + " " + Common.fillDigits(selectTimeObj.hours + 1) + ":00:00";
                //     break;
                // case "2":
                //     temp.startTime = selectTime + " 00:00:00";
                //     // temp.endTime = selectTimeObj.year + "-" + Common.fillDigits(selectTimeObj.month) + "-" + Common.fillDigits(selectTimeObj.date + 1) + " " + "00:00:00";
                //     temp.endTime = com.getRelativeTime("2",temp.startTime);
                //     break;
                // case "3":
                //     temp.startTime = selectTime + "-01 00:00:00";
                //     temp.endTime = com.getRelativeTime("3",temp.startTime);
                //     break;
                // case "4":
                //     temp.startTime = selectTime + "-01-01 00:00:00";
                //     temp.endTime = (selectTimeObj.year + 1) + "-" + "01-01 00:00:00";
                //     break;
                case "5":
                    temp.startTime = Common.splitTime(selectTime)[0] + "00:00:00";
                    temp.endTime = $.trim(Common.splitTime(selectTime)[1]) + " 00:00:00";
                    break;
                // case "5":
                //     temp.timeSet[0].startTime =  selectTime + " 08:00:00";
                //     temp.timeSet[1].startTime = temp.timeSet[0].endTime =  selectTime + " " + "20:00:00";
                //     temp.timeSet[1].endTime = com.getRelativeTime("2",temp.timeSet[1].startTime).slice(0,11) + "08:00:00";
                //     break;
                case "6":
                    temp.startTime = Common.splitTime(selectTime)[0];
                    temp.endTime = Common.splitTime(selectTime)[1];
                    break;
            }
        } else {
            switch (reportType) {
                case "1":
                    temp.startTime = selectTime;
                    temp.endTime = selectTimeObj.year + "-" + Common.fillDigits(selectTimeObj.month) + "-" + Common.fillDigits(selectTimeObj.date) + " " + Common.fillDigits(selectTimeObj.hours + 1) + ":00:00";
                    break;
                case "2":
                    temp.startTime = selectTime + " 00:00:00";
                    // temp.endTime = selectTimeObj.year + "-" + Common.fillDigits(selectTimeObj.month) + "-" + Common.fillDigits(selectTimeObj.date + 1) + " " + "00:00:00";
                    temp.endTime = com.getRelativeTime("2",temp.startTime);
                    break;
                case "3":
                    temp.startTime = selectTime + "-01 00:00:00";
                    temp.endTime = com.getRelativeTime("3",temp.startTime);
                    break;
                case "4":
                    temp.startTime = selectTime + "-01-01 00:00:00";
                    temp.endTime = (selectTimeObj.year + 1) + "-" + "01-01 00:00:00";
                    break;
                case "5":
                    temp.startTime = Common.splitTime(selectTime)[0] + "00:00:00";
                    temp.endTime = $.trim(Common.splitTime(selectTime)[1]) + " 00:00:00";
                    break;
                // case "5":
                //     temp.timeSet[0].startTime =  selectTime + " 08:00:00";
                //     temp.timeSet[1].startTime = temp.timeSet[0].endTime =  selectTime + " " + "20:00:00";
                //     temp.timeSet[1].endTime = com.getRelativeTime("2",temp.timeSet[1].startTime).slice(0,11) + "08:00:00";
                //     break;
                case "6":
                    temp.startTime = Common.splitTime(selectTime)[0];
                    temp.endTime = Common.splitTime(selectTime)[1];
                    break;
            }
        }
    };

    com.getRelativeTime = function (dateType, chooseTime) {
        var xHour;
        switch (dateType) {
            case "1":
                console.log("小时");
                xHour = 1;
                break;
            case "2":
                console.log("日");
                xHour = 24;
                break;
            case "3":
                xHour = 24 * com.getMonthDate(chooseTime.slice(0, 4), chooseTime.slice(5, 7));   //29
                console.log("月");
                break;
            case "4":
                xHour = 24 * com.getYearDate(chooseTime.slice(0, 4));   //29
                console.log("年");
                break;
        }

        var chooseDate = new Date(chooseTime.replace(/-/g, '/'));  //开始时间
        var t = chooseDate.getTime() + xHour * 60 * 60 * 1000;
        let d = new Date(t);
        let theMonth = d.getMonth() + 1;
        let theDate = d.getDate();
        let theHours = d.getHours();
        let theMinutes = d.getMinutes();
        if (theMonth < 10) {
            theMonth = '0' + theMonth
        }
        if (theDate < 10) {
            theDate = '0' + theDate
        }
        if (theHours < 10) {
            theHours = '0' + theHours
        }
        if (theMinutes < 10) {
            theMinutes = '0' + theMinutes
        }
        let date = d.getFullYear() + '-' + theMonth + '-' + theDate;
        let time = theHours + ':' + theMinutes;
        let oSpare = date + ' ' + time + ":00";
        console.log(date);
        console.log(time);
        console.log(oSpare);
        return oSpare;
    };

    com.getPrevPointTime = function (dateType, chooseTime) {
        var xHour;
        switch (dateType) {
            case "1":
                console.log("小时");
                xHour = 1;
                break;
            case "2":
                console.log("日");
                xHour = 24;
                break;
            case "3":
                xHour = 24 * com.getMonthDate(chooseTime.slice(0, 4), chooseTime.slice(5, 7) - 1);   //29
                console.log("月");
                break;
            case "4":
                xHour = 24 * com.getYearDate(chooseTime.slice(0, 4));   //29
                console.log("年");
                break;
            default:
                xHour = 24;
                console.log("默认前一天");
                break;
        }

        var chooseDate = new Date(chooseTime.replace(/-/g, '/'));  //开始时间
        var t = chooseDate.getTime() - xHour * 60 * 60 * 1000;
        let d = new Date(t);
        let theMonth = d.getMonth() + 1;
        let theDate = d.getDate();
        let theHours = d.getHours();
        let theMinutes = d.getMinutes();
        if (theMonth < 10) {
            theMonth = '0' + theMonth
        }
        if (theDate < 10) {
            theDate = '0' + theDate
        }
        if (theHours < 10) {
            theHours = '0' + theHours
        }
        if (theMinutes < 10) {
            theMinutes = '0' + theMinutes
        }
        let date = d.getFullYear() + '-' + theMonth + '-' + theDate;
        let time = theHours + ':' + theMinutes;
        let oSpare = date + ' ' + time + ":00";
        console.log(date);
        console.log(time);
        console.log(oSpare);
        return oSpare;
    };

    com.getYearMonthDayTime = function () {
        var time = new Date();
        var year = time.getFullYear();
        year = year < 1900 ? year + 1900 : year;
        var month = time.getMonth() + 1;
        month = Common.fillDigits(month);
        var day = time.getDate();
        day = Common.fillDigits(day);
        return year + "-" + month + "-" + day;
    };


    com.fillDigits = function (time) {
        return time < 10 ? '0' + time : time;
    };


    com.getMonthDate = function (year, month) {
        var d = new Date(year, month, 0);
        return d.getDate();
    };

    com.getYearDate = function (year) {
        if (year % 4 === 0 && year % 100 !== 0) {
            return 366;
        } else if (year % 400 === 0) {
            return 366;
        }
        else {
            return 365;
        }
    };


    com.isNull = function (args) {

        if (null != args && "" != args) {
            return true;
        }
        return false;
    };

    com.setLabelToStr = function (datas) {
        var str = "";
        $.each(datas, function (index, data) {

            if (index % 2 == 0) {
                str += "<div class='row'><div class='col-sm-6 col-md-6'><h5 class='text-center text-primary'>" + data.name + "</h5>" +
                    "<p class='text-center'style='word-wrap:break-word;word-break:break-all;overflow: hidden;'>" + data.value + "</p></div>"
            } else {
                str += "<div class='col-sm-6 col-md-6'><h5 class='text-center text-primary'>" + data.name + "</h5>" +
                    "<p class='text-center'style='word-wrap:break-word;word-break:break-all;overflow: hidden;'>" + data.value + "</p></div></div>";
            }
        });
        return str;
    };

    com.setLabelToStrOnCheckbox = function (datas) {
        var str = "";
        $.each(datas, function (index, data) {
            if (index % 2 == 0) {
                str += "<div class='col-sm-6 col-md-6'><div class='checkbox checkbox-primary'>" +
                    "<input id=" + data.id + " class='styled' type='checkbox' name='buttonCode' value=" + data.buttonCode + ">" +
                    "<label for=" + data.id + ">" + data.buttonName + "</label></div>";
            } else {
                str += "<div class='checkbox checkbox-primary'><input id=" + data.id + " class='styled' name='buttonCode' type='checkbox' value=" + data.buttonCode + ">" +
                    "<label for=" + data.id + ">" + data.buttonName + "</label></div></div>";
            }
        });
        return str;
    };

    com.setLabelToStrOnRadio = function (datas) {
        var str = "";
        if (!datas) return;
        $.each(datas, function (index, data) {
            if (index % 2 == 0) {
                str += "<div class='col-sm-4 col-md-4'><div class='radio radio-primary'>" +
                    "<input id=" + data.id + "  class='styled' type='radio' name='btncode' value=" + data.buttonCode + ">" +
                    "<label for=" + data.id + ">" + data.buttonName + "</label></div></div>";
            } else {
                str += "<div class='col-sm-4 col-md-4'><div class='radio radio-primary'><input id=" + data.id + "" +
                    " class='styled' name='btncode' type='radio' value=" + data.buttonCode + ">" +
                    "<label for=" + data.id + ">" + data.buttonName + "</label></div></div>";
            }
        });
        return str;
    };

    com.postExcelFile = function (params, url) {
        var form = document.createElement("form");
        form.style.display = 'none';
        form.action = url;
        form.method = "post";
        document.body.appendChild(form);

        for (var key in params) {
            var input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = params[key];
            form.appendChild(input);
        }

        // form.set('parameter',JSON.stringify(params));
        form.submit();
        form.remove();
    };

    com.exportTable = function (para,url){
        let requestObj = new FormData();
        requestObj.set('parameter', JSON.stringify(para));
        $.ajax({
            url: url,
            type: 'post',
            data: requestObj,
            cache: false,
            async: false,
            dataType: 'json',
            processData: false,
            contentType: false,
            success: function (result) {
                console.log("完成");
            }
        });
    };


    com.commonAjax = function (url, async, data, successCallBack, errorCallBack) {
        var result;
        $.ajax({
            url: url,
            type: "post",
            dataType: "json",
            async: async,//取消异步
			contentType: "application/json",
            data: data,
            success: function (datas) {

                result = datas;
                if (com.isExitsFunction(successCallBack)) {
                    successCallBack(datas);
                }
            },
            error: function (datas) {

                if (com.isExitsFunction(errorCallBack)) {
                    errorCallBack(datas);
                }
            }
        });
        return result;
    };

    com.defaultCommonAjax = function (url, async, data, successCallBack, errorCallBack) {
        var result;
        $.ajax({
            url: url,
            type: "post",
            dataType: "json",
            async: async,//取消异步
            data: data,
            success: function (datas) {

                result = datas;
                if (com.isExitsFunction(successCallBack)) {
                    successCallBack(datas);
                }
            },
            error: function (datas) {

                if (com.isExitsFunction(errorCallBack)) {
                    errorCallBack(datas);
                }
            }
        });
        return result;
    };

    return com;
}());

var initContent = (function () {

    var content = new Object();

    content.init = function (elementTree, elementiframe) {
        var node = elementTree.treeview('getNode', 0);
        elementiframe.attr('src', node.href);
    };

    return content;
}());

/**
 *  曲线的默认初始化对象
 */
function industrialOption() {
    var option = {
        title: {
            subtext: ''
        },
        tooltip: {
            trigger: 'axis'
        },
        color: [
            '#a23531', '#2f4554', '#61a0a8', '#d48265'
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
            data: ['瞬时流量', '压力', '温度', '小时用量']   //从后台取 组成此数据
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
                name: '压力',
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
                name: '温度',
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
            },
        ]
    };
    return option;
}

/*$.ajaxSetup({
    async: false //取消异步，先加载load，保证菜单加载顺序
});*/