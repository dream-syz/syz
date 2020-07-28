(function ($) {

    var node;

    $.fn.initTable = function (options) {
        $.extend($.fn.initTable.defaults, options);
        node = $(this);
        init();
    };

    $.fn.requestHeader = function (url, newcolumns, parameter) {
        return requestHeader(url, newcolumns, parameter);
    };

    $.fn.isSelections = function () {
        console.log("进入是否选中一行事件");
        var selectData = $(this).bootstrapTable('getSelections');
        if (selectData.length <= 0) {
            return false;
        } else {
            return true;
        }
    };


    $.fn.getSelectionsById = function (key) {
        return $.map($(this).bootstrapTable('getSelections'), function (row) {
            return row[key];
        });
    };

    $.fn.initTable.defaults = {
        type: "POST",
        url: "",
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        HeadUrl: "meters/queryDataItemHeader",
        columns: [],
        isNeedOperation: true,
        isNeedRequestHeader: true,      //是否需要请求表头
        isNeedHeaderData: false,
        toolbar: '#toolbar',
        striped: true,                      //是否显示行间隔色
        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,                   //是否显示分页（*）
        sortable: true,                     //是否启用排序
        sortOrder: "asc",                   //排序方式
        showPaginationSwitch: true,    //展示页数的选择？
        showExport: true,
        buttonsAlign: "right",         //按钮位置
        exportDataType: "basic",              //basic', 'all', 'selected'.
        exportTypes: ['csv', 'txt', 'sql', 'doc', 'excel', 'xlsx'],
        Icons: 'glyphicon-export',
        height: "",
        sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
        pageList: [5, 10, 12, 15, 24, 36],        //可供选择的每页的行数（*）
        showColumns: true,                  //是否显示所有的列
        showRefresh: true,                  //是否显示刷新按钮
        minimumCountColumns: 3,             //最少允许的列数
        clickToSelect: true,                //是否启用点击选中行
        cardView: false,                    //是否显示详细视图
        showToggle: false,
        detailView: false,                   //是否显示父子表
        exportOptions: "",
        isOtherOperation: null
    };

    function init() {
        $.fn.initTableData();
    }

    $.fn.initTableData = function () {

        var newcolumns = $.fn.initTable.defaults.columns;

        if ($.fn.initTable.defaults.isNeedRequestHeader) {
            newcolumns = requestHeader($.fn.initTable.defaults.HeadUrl, newcolumns, "");
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
            locale: 'zh-CN',
            ajaxOptions: {async: true, timeout: 120000},
            formatLoadingMessage: function () {
                return "请稍等，正在加载中...";
            }
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
            option.onClickRow = function (row) {
                return $.fn.initTable.defaults.onClickRow(row);
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
        return $.fn.initTable.defaults.operater(value, row, index);
    }


    function queryParams(params) {
        return $.fn.initTable.defaults.queryTableParams(params);
    }

    function requestHeader(url, newcolumns, parameter) {
        var itemsId = [];  //全局变量
        $.ajax({
            type: "post",
            url: url,
            data: parameter,
            dataType: 'json',
            async: false,//取消异步
            success: function (res) {
                $.each(res, function (x, Item) {
                    var isInArray = $.inArray(Item.id, itemsId);
                    var temp;
                    if (-1 == isInArray) {
                        var val = Item.id;
                        var visible = "" == Item.value ? true : Item.value;
                        var sortable = "" == Item.sortable ? false : Item.sortable;
                        temp = {
                            field: val,
                            title: Item.name,
                            align: "center",
                            sortable: Boolean(sortable == "false" ? null : sortable),
                            visible: Boolean(visible == "false" ? null : visible)
                        };
                        if ("" != Item.formatter) {
                            temp.formatter = function (value, row, index) {
                                return eval("" + Item.formatter + "");
                            };
                        }
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
            var obj = {
                title: '操作',
                align: 'center',
                events: {
                    'click .remove': function (e, value, row, index) {
                        $.fn.initTable.defaults.remove(e, value, row, index);
                    },
                    'click .update': function (e, value, row, index) {
                        $.fn.initTable.defaults.update(e, value, row, index);
                    },
                    'click .exchange': function (e, value, row, index) {
                        $.fn.initTable.defaults.exchange(e, value, row, index);
                    },
                    'click .details': function (e, value, row, index) {
                        $.fn.initTable.defaults.details(e, value, row, index);
                    },
                    'click .check': function (e, value, row, index) {
                        $.fn.initTable.defaults.check(e, value, row, index);
                    }
                },
                formatter: operateFormatter
            };

            addOtherOption(obj);
            newcolumns.push(obj);
        }

    }

    function addOtherOption(obj) {

        var oldOperation = ["remove", "update", "exchange", "details", "check"];

        var operations = $.fn.initTable.defaults.isOtherOperation;

        if (operations && operations instanceof Array) {

            $.each(operations, function (index, n, arr) {

                if (oldOperation.indexOf(n) == -1) {

                    obj.events["click ." + n] = function (e, value, row, index) {
                        $.fn.initTable.defaults[n](e, value, row, index);
                    }
                }
            })
        }
    }

})(jQuery);


