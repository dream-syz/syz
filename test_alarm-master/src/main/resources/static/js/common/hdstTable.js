(function ($) {

    var node;

    $.fn.initTable = function (options) {
        $.extend($.fn.initTable.defaults, options);
        node = $(this);
        init();
    };

    $.fn.initTable.defaults = {
        type: "POST",
        url: "",
        HeadUrl: "report/devStatus/get",
        columns: [],
        /* fixedColumns: true,
         fixedNumber: 5, //固定列数*/
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        isNeedOperation: false,
        isNeedRequestHeader: true,         //是否需要请求表头
        isNeedHeaderData: false,
        toolbar: '#toolbar',
        striped: true,                      //是否显示行间隔色
        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,                   //是否显示分页（*）
        sortable: true,                     //是否启用排序
        sortOrder: "asc",                   //排序方式
        showPaginationSwitch: true,        //展示页数的选择？
        showExport: true,
        buttonsAlign: "right",              //按钮位置
        exportDataType: "basic",              //basic', 'all', 'selected'.
        exportTypes: ['csv', 'txt', 'sql', 'doc', 'excel', 'xlsx'],
        Icons: 'glyphicon-export',
        height: "",
        sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
        pageList: [5, 10, 15, 20],            //可供选择的每页的行数（*）
        showColumns: true,                  //是否显示所有的列
        showRefresh: true,                  //是否显示刷新按钮
        minimumCountColumns: 1,             //最少允许的列数
        clickToSelect: true,                //是否启用点击选中行
        cardView: false,                    //是否显示详细视图
        showToggle: false,
        detailView: false,                   //是否显示父子表
        exportOptions: "",
        onClickRow: function (row, $element, field) {
            $('.info').removeClass('info');
            $($element).addClass('info');
            // console.log('selectedRowSuccess');
        }
        // onExpandRow: function (index, row, $detail) {
        //     /* eslint no-use-before-define: ["error", { "functions": false }]*/
        //     console.log(index + row + $detail);
        //     initSubTable($detail.html('<table></table>').find('table'), 4, 2);
        // }
    };

    function init() {
        $.fn.initTableData();
    }

    $.fn.loadTableData = function (obj) {
        $.ajax({
            type: "post",
            url: $.fn.initTable.defaults.url,
            dataType: 'json',
            data: "parameter=" + getJsonData(obj),
            async: false,//取消异步
            success: function (res) {
                node.bootstrapTable("load", res);
            }
        });
    };

    function getJsonData(obj) {
        var temp = {
            areaId: obj.id
        };
        var page = {
            pageLine: $.fn.initTable.defaults.pageLine,   //页面大小
            pageIndex: $.fn.initTable.defaults.pageIndex  //页码
        };

        return JSON.stringify(page) + "/" + JSON.stringify(temp);
    }

    $.fn.initTableData = function () {

        var newcolumns = $.fn.initTable.defaults.columns;

        if ($.fn.initTable.defaults.isNeedRequestHeader) {
            newcolumns = requestHeader(newcolumns);
        }

        addOperation(newcolumns);

        var option = {
            url: $.fn.initTable.defaults.url,
            method: $.fn.initTable.defaults.type,
            contentType: $.fn.initTable.defaults.contentType,
            toolbar: $.fn.initTable.defaults.toolbar,
            striped: $.fn.initTable.defaults.striped,
            cache: $.fn.initTable.defaults.cache,
            pagination: $.fn.initTable.defaults.pagination,
            sortable: $.fn.initTable.defaults.sortable,
            sortOrder: $.fn.initTable.defaults.sortOrder,
            showPaginationSwitch: $.fn.initTable.defaults.showPaginationSwitch,
            showExport: $.fn.initTable.defaults.showExport,
            buttonsAlign: $.fn.initTable.defaults.buttonsAlign,
            exportDataType: $.fn.initTable.defaults.exportDataType,
            exportTypes: $.fn.initTable.defaults.exportTypes,
            Icons: $.fn.initTable.defaults.Icons,
            queryParams: queryParams,
            sidePagination: $.fn.initTable.defaults.sidePagination,
            pageNumber: $.fn.initTable.defaults.pageIndex,
            pageSize: $.fn.initTable.defaults.pageLine,
            pageList: $.fn.initTable.defaults.pageList,
            showColumns: $.fn.initTable.defaults.showColumns,
            showRefresh: $.fn.initTable.defaults.showRefresh,
            checkboxHeader: $.fn.initTable.defaults.checkboxHeader,
            minimumCountColumns: $.fn.initTable.defaults.minimumCountColumns,
            clickToSelect: $.fn.initTable.defaults.clickToSelect,
            uniqueId: $.fn.initTable.defaults.key,
            cardView: $.fn.initTable.defaults.cardView,
            showToggle: $.fn.initTable.defaults.showToggle,
            detailView: $.fn.initTable.defaults.detailView,
            columns: newcolumns,
            fixedColumns: $.fn.initTable.defaults.fixedColumns,
            fixedNumber: $.fn.initTable.defaults.fixedNumber, //固定列数

            onExpandRow: $.fn.initTable.defaults.onExpandRow,
            locale: 'zh-CN',
        };

        if ("" != $.fn.initTable.defaults.exportOptions) {
            option.exportOptions = $.fn.initTable.defaults.exportOptions;
        }

        if ("" != $.fn.initTable.defaults.height) {
            option.height = $.fn.initTable.defaults.height;
        }
        if (isExitsFunction($.fn.initTable.defaults.onDblClickRow)) {
            option.onDblClickRow = function (row) {
                return $.fn.initTable.defaults.onDblClickRow(row);
            }
        }

        if (isExitsFunction($.fn.initTable.defaults.onClickRow)) {
            option.onClickRow = function (row,$el,field) {
                return $.fn.initTable.defaults.onClickRow(row,$el,field);
            }
        }
        if (isExitsFunction($.fn.initTable.defaults.onCheck)) {
            option.onCheck = function (row) {
                return $.fn.initTable.defaults.onCheck(row);
            }
        }
        if (isExitsFunction($.fn.initTable.defaults.onUncheck)) {
            option.onUncheck = function (row) {
                return $.fn.initTable.defaults.onUncheck(row);
            }
        }
        if (isExitsFunction($.fn.initTable.defaults.onLoadSuccess)) {
            option.onLoadSuccess = function (data) {
                return $.fn.initTable.defaults.onLoadSuccess(data)
            }
        }
        if (isExitsFunction($.fn.initTable.defaults.onLoadError)) {
            option.onLoadError = function (status, res) {
                return $.fn.initTable.defaults.onLoadError(status, res)
            }
        }

        if (isExitsFunction($.fn.initTable.defaults.responseHandler)) {
            option.responseHandler = function (res) {
                return $.fn.initTable.defaults.responseHandler(res);
            }
        } else {
            option.responseHandler = function (res) {

                var temp = {
                    "rows": res.rows, // 具体每一个bean的列表
                    "total": res.total  // 总共有多少条返回数据
                };
                $.each(res.rows, function (index, item) {
                    $.each(item.items, function (x, Item) {
                        var val = Item.id;
                        if (null != Item.unit) {
                            console.log(Item.value + Item.unit);
                            temp.rows[index][val] = Item.value + Item.unit;//这是第几个对象
                        } else {
                            temp.rows[index][val] = Item.value;//这是第几个对象
                        }
                    });
                });
                return temp;
            }
        }

        node.bootstrapTable(option);

    };

    function operateFormatter(value, row, index) {
        return $.fn.initTable.defaults.operate(value, row, index);
    }

    function detailsFormatter(value, row, index) {
        return $.fn.initTable.defaults.details(value, row, index);
    }

    function queryParams(params) {
        return $.fn.initTable.defaults.queryTableParams(params);
    }

    function requestHeader(newcolumns) {
        var itemsId = [];  //全局变量
        $.ajax({
            type: "post",
            url: $.fn.initTable.defaults.HeadUrl,
            dataType: 'json',
            async: false,//取消异步
            success: function (res) {
                $.each(res, function (x, Item) {
                    var isInArray = $.inArray(Item.id, itemsId);
                    if (-1 == isInArray) {
                        var val = Item.id;
                        var temp = {field: val, title: Item.name, align: "center"};
                        newcolumns.push(temp);
                        itemsId.push(Item.id);
                    }
                });
            }
        });
        return newcolumns;
    }

    function isExitsFunction(funcName) {
        try {
            if (typeof(eval(funcName)) == "function") {
                return true;
            }
        } catch (e) {
        }
        return false;
    }

    function addOperation(newcolumns) {
        if ($.fn.initTable.defaults.isNeedOperation) {
            let operateObj = {
                field: 'operate',
                title: '操作',
                align: 'center',
                events: {
                    // "operateEvents"
                    'click .update': function (e, value, row, index) {
                        $.fn.initTable.defaults.update(e, value, row, index);
                    },
                    'click .remove': function (e, value, row, index) {
                        $.fn.initTable.defaults.remove(e, value, row, index);
                    },
                    'click .site': function (e, value, row, index) {
                        $.fn.initTable.defaults.site(e, value, row, index);
                    },
                    'click .disable': function (e, value, row, index) {
                        $.fn.initTable.defaults.disable(e, value, row, index);
                    },
                    'click .enable': function (e, value, row, index) {
                        $.fn.initTable.defaults.enable(e, value, row, index);
                    },
                    'click .approval': function (e, value, row, index) {
                        $.fn.initTable.defaults.approval(e, value, row, index);
                    },
                    'click .print': function (e, value, row, index) {
                        $.fn.initTable.defaults.print(e, value, row, index);
                    },
                    'click .apply': function (e, value, row, index) {
                        $.fn.initTable.defaults.apply(e, value, row, index);
                    }

                },
                formatter: operateFormatter
            };
            let detailsObj = {
                field: 'details',
                title: '详情',
                align: 'center',
                events: {
                    // "detailsEvents"
                    'click .customerDetails': function (e, value, row, index) {
                        $.fn.initTable.defaults.customerDetails(e, value, row, index);
                    },
                    'click .meterDetails': function (e, value, row, index) {
                        $.fn.initTable.defaults.meterDetails(e, value, row, index);
                    }
                },
                formatter: detailsFormatter
            };
            newcolumns.push(operateObj);
            newcolumns.push(detailsObj);
            /* if(operateFormatter()!=""){
                 obj.formatter=operateFormatter
             }*/
        }
    }

    function initSubTable($el, cells, rows) {
        var i;
        var j;
        var k;
        var row;
        var columns = [];
        var data = [];
        for (i = 0; i < cells; i++) {
            columns.push({
                field: 'field' + i,
                title: 'sub' + i,
                // sortable: true
            })
        }
        for (i = 0; i < rows; i++) {
            row = {};
            for (j = 0; j < cells; j++) {
                row['field' + j] = 'sub-' + i + '-' + j
            }
            data.push(row);
        }
        var page = {
            "page": {
                pageLine: 10,   //页面大小
                pageIndex: 1 //页码
                // ,sort : params.sort,
                // order : params.order
            }
        };
        var property = {
            "mpLifeInfo": {
                "areaId": "282000",
                "cycleId": "1258",
                "remainingTime": "1098"
            }
        };
        $el.initTable({
            url: "mpLifeCycle/getLifeCycleInfo",//请求的url
            sortable: true,
            showRefresh: false,
            ajaxOptions: {async: false, timeout: 8000},
            clickToSelect: false,
            isNeedOperation: true,  //是否需要操作列
            // isOtherOperation: ['update', 'remove', 'site', 'customerDetails', 'meterDetails'],
            isNeedRequestHeader: false,
            key: 'mpId',     //每一行的唯一标识，一般为主键列
            data: data,
            columns: columns,
            queryTableParams: function (params) { //查询参数事件
                return "parameter=" + mergeJsonObject(page, property);
            },
            // sortable: true,
            // ajaxOptions: {async: false, timeout: 8000},
            // clickToSelect: false,
            // isNeedRequestHeader: false,
            // key: 'mpId',     //每一行的唯一标识，一般为主键列
        });
    }

})(jQuery);


