(function ($) {

    var node;

    $.fn.initTable = function (options) {

        $.extend($.fn.initTable.defaults, options);

        node = $(this);

        $.fn.initTableData();
    };

    $.fn.isSelections = function () {

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
        method: 'post',
        url: "",
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        HeadUrl: "meters/queryDataItemHeader",
        columns: [],
        isNeedOperation: true,
        isNeedRequestHeader: true,      //是否需要请求表头
        RequestHeaderData: null,           //请求表头的参数
        toolbar: '#toolbar',
        striped: true,                      //是否显示行间隔色
        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,                   //是否显示分页（*）
        queryParams: "",
        sortable: true,                     //是否启用排序
        sortOrder: "asc",                   //排序方式
        showPaginationSwitch: true,    //展示页数的选择？
        showExport: true,
        buttonsAlign: "right",         //按钮位置
        exportDataType: "all",              //basic', 'all', 'selected'.
        exportTypes: ['excel', 'xlsx'],
        Icons: 'glyphicon-export',
        height: "",
        sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
        pageNumber: 1,
        pageSize: 12,
        pageList: [5, 10, 12, 15, 24, 36],        //可供选择的每页的行数（*）
        showColumns: true,                  //是否显示所有的列
        showRefresh: true,                  //是否显示刷新按钮
        minimumCountColumns: 3,             //最少允许的列数
        clickToSelect: true,                //是否启用点击选中行
        checkboxHeader: false,
        cardView: false,                    //是否显示详细视图
        showToggle: false,
        detailView: false,                   //是否显示父子表
        exportOptions: "",
        isOtherOperation: null,
        uniqueId: "mpId",
        locale: 'zh-CN',
        ajaxOptions: {async: true, timeout: 120000},
        formatLoadingMessage: function () {
            return "请稍等，正在加载中...";
        },
        responseHandler: function (res) {

            var temp = {
                "rows": res.rows,
                "total": res.total
            };
            $.each(res.rows, function (index, item) {

                $.each(item.items, function (x, Item) {

                    var val = Item.id;
                    if (null != Item.unit) {
                        temp.rows[index][val] = Item.value + Item.unit;//这是第几个对象
                    } else {
                        temp.rows[index][val] = Item.value;//这是第几个对象
                    }
                });
                $.each(item.data, function (x, Item) {

                    var val = Item.id;
                    if (null != Item.unit) {
                        temp.rows[index][val] = Item.value + Item.unit;//这是第几个对象
                    } else {
                        temp.rows[index][val] = Item.value;//这是第几个对象
                    }
                });
            });
            return temp;
        },
        onExpandRow: function (index, row, $detail) {
            /* eslint no-use-before-define: ["error", { "functions": false }]*/
            console.log(index + row + $detail);
            initSubTable($detail.html('<table></table>').find('table'),row);
        }
    };

    $.fn.initTableData = function () {

        var newcolumns = this.initTable.defaults.columns;

        if (this.initTable.defaults.isNeedRequestHeader) {

            newcolumns = this.requestHeader($.fn.initTable.defaults.HeadUrl, newcolumns,
                $.fn.initTable.defaults.RequestHeaderData);
        }

        if (this.initTable.defaults.isNeedOperation) {

            this.addOperatColumn(newcolumns);
        }

        this.initTable.defaults.columns = newcolumns;

        node.bootstrapTable("destroy");

        node.bootstrapTable($.fn.initTable.defaults);
    };

    $.fn.requestHeader = function (url, newcolumns, parameter) {

        var itemsId = [];

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
    };

    $.fn.addOperatColumn = function (newcolumns) {

        var obj = {
            title: '操作',
            align: 'center',
            formatter: $.fn.initTable.defaults.operater,
            events: {}
        };

        var operations = $.fn.initTable.defaults.isOtherOperation;

        if (operations && operations instanceof Array) {

            $.each(operations, function (index, n, arr) {

                obj.events["click ." + n] = function (e, value, row, index) {
                    $.fn.initTable.defaults[n](e, value, row, index);
                }
            })
        }
        newcolumns.push(obj);

    }

})(jQuery);


