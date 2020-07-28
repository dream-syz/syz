var commTable = function () {

    var commTableObj = {};
    var _rawTable;
    var _dOption, _bOption;

    commTableObj.rawTable = null;
    commTableObj.numberColumn = [{
        field: 'no',
        title: '序号',
        align: "center",
        switchable: false,
        width: "50px",
        formatter: function (value, row, index) {
            //获取每页显示的数量
            const pageSize = commTableObj.rawTable.bootstrapTable('getOptions').pageSize;
            //获取当前是第几页
            const pageNumber = commTableObj.rawTable.bootstrapTable('getOptions').pageNumber;
            //返回序号，注意index是从0开始的，所以要加上1
            return index + 1;
            // return pageSize * (pageNumber - 1) + index + 1;
        }
    }];

    commTableObj.checkColumn = [{
        field: 'checked',
        checkbox: true,
        align: 'center'
    }];

    commTableObj.defaultOption = {
        orderNumber: true,
        headUrl: null,
        headParam: {},
        dataUrl: null,
        dataParam: {},
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        loadMethod: 'scroll',
        isNeedDetails: false,//分开的目的就是为了让查看和操作更明确
        isNeedOperate: false,
        otherOperationArr: [],
        otherDetailsArr: [],
    };

    commTableObj.bootstrapOption = {
        method: 'post',
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        locale: 'zh-CN',
        showRefresh: false,
        showExport: false,                                                           //是否显示导出按钮
        search: false,
        exportDataType: "all",                                                      //basic当前页', 'all所有, 'selected'
        exportTypes: ['excel'],                                                     //导出文件类型
        exportOptions: {
            // displayTableName: true,
            // ignoreColumn: [0,1],                                                    //忽略某一列的索引
            fileName: "download",                                                      //文件名称设置
            // mso: {
            //     worksheetName: "表格工作区名称",                                    //表格工作区名称
            // },
            // tableName: 'myTableName',
            // excelstyles: ['red', 'blue', '14', '600']
        },
        buttonsAlign: "right",
        showColumns: true,
        striped: true,                                                              //是否显示行间隔色
        icons: {
            paginationSwitchDown: 'glyphicon-collapse-down icon-chevron-down',
            paginationSwitchUp: 'glyphicon-collapse-up icon-chevron-up',
            refresh: 'glyphicon-refresh icon-refresh',
            toggle: 'glyphicon-list-alt icon-list-alt',
            columns: 'glyphicon-th icon-th',
            detailOpen: 'glyphicon-plus icon-plus',
            detailClose: 'glyphicon-minus icon-minus'
        },
        pagination: false,                                                                    //是否在表格底部显示分页条
        pageNumber: 1,                                                                        //首页页码
        pageList: ['All'],                                                                   //可供选择的页面数据条数
        pageSize: 10000,                                                                 	    //页面数据条数。
        showPaginationSwitch: false,                                                         //是否显示切换分页按钮
        sidePagination: "client",
        columns: [],                                                                            //之前columns的所有功能都可以使用，包括formatter
        height: "",
        clickToSelect: true,
        uniqueId: '',                                                                        //每一行的唯一标识，一般为主键列
        ajaxOptions: {async: false, timeout: 20000},
        // queryParams: function (params) {                                                    //查询参数事件
        // return "parameter=" + getReportDataJson(params, false, false, "", type);
        // },
        // queryTableParams: function (params) {                                                   //查询参数事件
        //     console.log("参数是:" + params);
        //     return "parameter=" + commTableObj.getTableQuery(params);
        // },
        responseHandler: function (res) {
            // commTableObj.dataServerFormat(res);
            return res.data;
        },
        onClickRow: function (row, $el, field) {
            console.log(row);
            $('#' + commTableObj.defaultOption.tableID + ' .success').removeClass('success');                 //去除之前选中的行的，选中样式
            $el.addClass('success');                                                                              //添加当前选中的 success样式用于区别
        },
        onPageChange: resetTable,
        onPostBody: resetTable

    };

    commTableObj.init = function (defaultOption, bootstrapOption) {

        // var $table = $('#' + defaultOption.tableID);

        // commTableObj.rawTable = $table.bootstrapTable(bootstrapOption);

        commTableObj.fuseOption(defaultOption, bootstrapOption);

        commTableObj.getHead();

        commTableObj.initTable();

        // commTableObj.loadData();

        // commTableObj.requirementConfigure(commTableObj.defaultOption);
    };

    commTableObj.getHead = function () {
        if (commTableObj.defaultOption.headUrl) {
            $.ajax({
                type: "POST",
                url: commTableObj.defaultOption.headUrl,
                data: commTableObj.defaultOption.headParam.data,
                contentType: commTableObj.defaultOption.headParam.contentType ? commTableObj.defaultOption.headParam.contentType : "application/x-www-form-urlencoded",
                async: false,//取消异步
                dataType: "json",
                success: function (res) {
                    commTableObj.setHead(res);
                },
                // complete: function () {
                //     commTableObj.setHead(getTableHead());
                // }
            });
        }
    };

    commTableObj.fuseOption = function (dOption, bOption) {

        commTableObj.defaultOption = $.extend(commTableObj.defaultOption, dOption);

        commTableObj.bootstrapOption = $.extend(commTableObj.bootstrapOption, bOption);

        if (dOption.loadMethod == "button") {
            commTableObj.bootstrapOption.pagination = true;
        }

        _dOption = commTableObj.defaultOption;
        _bOption = commTableObj.bootstrapOption;
    };

    commTableObj.geneParObj = function () {
        switch (commTableObj.bootstrapOption.sidePagination) {
            case "client":
                return "parameter=" + JSON.stringify(commTableObj.defaultOption.dataParam);
            case "server":
                return "parameter=" + JSON.stringify(commTableObj.defaultOption.dataParam) + "&page=" + JSON.stringify({
                    pageLine: 14,
                    pageIndex: 1
                });
        }
    };

    commTableObj.genParObj = function () {
        switch (commTableObj.bootstrapOption.sidePagination) {
            case "client":
                return {
                    parameter: commTableObj.defaultOption.dataParam
                };
            case "server":
                return {
                    parameter: commTableObj.defaultOption.dataParam,
                    page: {
                        pageLine: 14,   //页面大小
                        pageIndex: 1  //页码
                    }
                };
        }
    };

    commTableObj.setHead = function (data) {
        commTableObj.bootstrapOption.columns = data.data;

        if (data.state.code === 200) {
            // if (commTableObj.defaultOption.orderNumber) {
            //     commTableObj.bootstrapOption.columns = commTableObj.headAlignCenter(commTableObj.numberColumn.concat(data.data));
            // }
            // if (commTableObj.defaultOption.checkbox) {
            //     commTableObj.bootstrapOption.columns = commTableObj.headAlignCenter(commTableObj.checkColumn.concat(data.data));
            // }
            // commTableObj.judgeAdditional();
        }
    };

    commTableObj.fillHead = function (head) {
        // commTableObj.rawTable.bootstrapTable('destroy');                        //先销毁表格
        commTableObj.bootstrapOption.columns = head.data;
        if (commTableObj.defaultOption.orderNumber) {
            commTableObj.bootstrapOption.columns = commTableObj.headAlignCenter(commTableObj.numberColumn.concat(head.data));
        }
        if (commTableObj.defaultOption.checkbox) {
            commTableObj.bootstrapOption.columns = commTableObj.headAlignCenter(commTableObj.checkColumn.concat(head.data));
        }
        commTableObj.judgeAdditional();

        // commTableObj.rawTable.bootstrapTable(commTableObj.bootstrapOption);
        commTableObj.rawTable.bootstrapTable('refreshOptions', commTableObj.bootstrapOption);
    };

    commTableObj.extendColumn = function () {

    };

    commTableObj.judgeAdditional = function () {
        if (commTableObj.defaultOption.isNeedOperate) {
            var oOperate = {
                title: '操作',
                align: 'center',
                formatter: commTableObj.defaultOption.operate,
                events: {}
            };

            var otherOperateArr = commTableObj.defaultOption.otherOperationArr;

            if (otherOperateArr && otherOperateArr instanceof Array) {

                $.each(otherOperateArr, function (index, ele) {

                    oOperate.events["click ." + ele] = function (e, value, row, index) {
                        commTableObj.defaultOption[ele](e, value, row, index);
                    }
                })
            }

            commTableObj.bootstrapOption.columns.push(oOperate);
        }

        if (commTableObj.defaultOption.isNeedDetails) {
            var oDetails = {
                title: '详情',
                align: 'center',
                formatter: commTableObj.defaultOption.details,
                events: {}
            };

            var otherDetailsArr = commTableObj.defaultOption.otherDetailsArr;

            if (otherDetailsArr && otherDetailsArr instanceof Array) {

                $.each(otherDetailsArr, function (index, ele) {

                    oDetails.events["click ." + ele] = function (e, value, row, index) {
                        commTableObj.defaultOption[ele](e, value, row, index);
                    }
                })
            }

            commTableObj.bootstrapOption.columns.push(oDetails);
        }
    };

    commTableObj.setData = function (res) {

        if (res.state.code === 200) {
            switch (commTableObj.bootstrapOption.sidePagination) {
                case "client":
                    commTableObj.bootstrapOption.data = commTableObj.dataClientFormat(res.data);
                    break;
                case "server":
                    commTableObj.defaultOption.data = commTableObj.dataServerFormat(res);
                    break;
            }
        }
    };

    commTableObj.headAlignCenter = function (data) {
        $.each(data, function (index, ele) {                                  //添加默认显示位置
            ele.align = "center"
        });
        return data;
    };

    commTableObj.dataClientFormat = function (data) {
        $.each(data, function (index, ele) {

            $.each(ele.item, function (x, e) {                                                  //转换提供给后台多种接收格式

                var val = e.id;
                data[index][val] = e.value;

            });
        });

        return data;
    };

    commTableObj.dataServerFormat = function (dataObj) {
        var temp = {
            "rows": dataObj.rows,                                                                 // 具体每一个bean的列表
            "total": dataObj.total                                                                // 总共有多少条返回数据
        };
        $.each(dataObj.rows, function (index, item) {

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
    };

    commTableObj.dataScrollFormat = function (data) {
        //暂时用client的代替
        $.each(data, function (index, ele) {

            $.each(ele.item, function (x, e) {                                                  //转换提供给后台多种接收格式

                var val = e.id;
                data[index][val] = e.value;

            });
        });

        return data;
    };

    commTableObj.moreHead = function () {
        if (commTableObj.defaultOption.orderNumber) {
            commTableObj.bootstrapOption.columns = commTableObj.headAlignCenter(commTableObj.numberColumn.concat(data.data));
        }
        if (commTableObj.defaultOption.checkbox) {
            commTableObj.bootstrapOption.columns = commTableObj.headAlignCenter(commTableObj.checkColumn.concat(data.data));
        }
    };

    var _totalRows;
    commTableObj.loadData = function () {

        if (commTableObj.defaultOption.dataUrl) {
            if (commTableObj.defaultOption.loadMethod == "scroll") {
                var _param;
                var pageParam = {
                    pageIndex: 1,
                    pageLine: 40
                };

                //请求成功
                switch (commTableObj.defaultOption.dataParam.contentType) {
                    case "application/x-www-form-urlencoded":
                        _param = commTableObj.defaultOption.dataParam.data + "&page=" + JSON.stringify(pageParam);
                        break;
                    case "application/json":
                        _param = JSON.stringify({
                            data: commTableObj.defaultOption.dataParam.data,
                            page: pageParam
                        });
                        break;
                    default:
                        _param = commTableObj.defaultOption.dataParam.data + "&page=" + JSON.stringify(pageParam);
                }

                $.ajax({
                    type: "POST",
                    url: commTableObj.defaultOption.dataUrl,
                    data: _param,
                    contentType: commTableObj.defaultOption.dataParam.contentType ? commTableObj.defaultOption.dataParam.contentType : "application/x-www-form-urlencoded",
                    async: false,//取消异步
                    dataType: "json",
                    success: function (res) {
                        if (res.code == 200) {
                            commTableObj.fillData(res);
                            _totalRows = res.total;
                            _rawTable.parent().parent().parent().append('<div style="margin-top: 20px;"><span class="pagination-info"> 总 共 ' + '<span style="color:blue">' + res.total + '</span>' + ' 条 记 录 </span></div>');
                        }
                    },
                    // complete: function () {
                    //     commTableObj.fillData(getScrollTableData());
                    //     _totalRows = getScrollTableData().total;
                    //     _rawTable.parent().parent().parent().append('<div style="margin-top:20px;"><span class="pagination-info"> 总 共 ' + getScrollTableData().total + ' 条 记 录 </span></div>');
                    // }
                });
            } else {
                $.ajax({
                    type: "POST",
                    url: commTableObj.defaultOption.dataUrl,
                    // data: "parameter=" + JSON.stringify(commTableObj.defaultOption.dataParam) + "&page=" + JSON.stringify({pageLine: 14, pageIndex: 1}),
                    // data: commTableObj.genParObj(),
                    data: commTableObj.defaultOption.dataParam.data,
                    contentType: commTableObj.defaultOption.dataParam.contentType ? commTableObj.defaultOption.dataParam.contentType : "application/x-www-form-urlencoded",
                    async: false,//取消异步
                    dataType: "json",
                    success: function (res) {
                        //目前对后台的兼容：存在total内容 | 存在code attr | 存在state对象
                        if (res.total || res.total === 0 || res.code === 200 || (res.state && res.state.code === 200)) {
                            commTableObj.fillData(res);
                        } else {
                            commTableObj.rawTable.bootstrapTable('load', []);
                        }
                    },
                    // complete: function () {
                    //     commTableObj.fillData(getClientTableData());
                    //     // commTableObj.fillData(getServerTableData());
                    // }
                });
            }
        }

        if (commTableObj.bootstrapOption.sidePagination === "server") {
            commTableObj.bootstrapOption.url = commTableObj.defaultOption.dataUrl;
            commTableObj.bootstrapOption.queryTableParams = function (params) {                                                   //查询参数事件
                // return "parameter=" + commTableObj.getTableQuery(params);
                return commTableObj.defaultOption.dataParam;
            };
            commTableObj.bootstrapOption.responseHandler = function () {
                return commTableObj.defaultOption.data;
            }
        }

    };

    commTableObj.hdstTable = function (methodName, par) {
        if (!commTableObj[methodName]) {
            return _rawTable.bootstrapTable(methodName, par);
        } else {
            return commTableObj[methodName](par);
        }
    };

    commTableObj.on = function (metehodName, callback) {
        _rawTable.on(metehodName, callback);
    };

    commTableObj.off = function (metehodName) {
        _rawTable.off(metehodName);
    };

// commTableObj.call('methodName',par)
// {
//     if(commTableObj.methodName == null)
//         commTableObj.rawTable.bootstrapTable('methodName', par);
//     else
//     {
//         commTableObj.methodName(par);
//     }
// }

// // commTableObj.methods['methodName']();
// commTableObj.methodName(par)
// {
//     if(commTableObj.methodName == null)
//         commTableObj.rawTable.bootstrapTable('methodName', par);
// }

    commTableObj.appendData = function (data) {
        commTableObj.rawTable.bootstrapTable('append', data);
    };

    commTableObj.fillData = function (data) {
        switch (commTableObj.defaultOption.loadMethod) {
            case "scroll":
                commTableObj.rawTable.bootstrapTable('load', commTableObj.dataScrollFormat(data));
                break;
            case "button":
                switch (commTableObj.bootstrapOption.sidePagination) {
                    case "client":
                        commTableObj.rawTable.bootstrapTable('load', _bOption.responseHandler(data));
                        break;
                    case "server":
                        commTableObj.rawTable.bootstrapTable('load', commTableObj.dataServerFormat(data));
                        break;
                }
                break;
        }
    };

    var _indexCount = 1;
    var _ajaxLock = false;
    commTableObj.initTable = function () {
        var $table = $('#' + commTableObj.defaultOption.tableID);

        //没有找到表的话，需要创建一个
        if ($table.length < 1) {
            var tDom = document.createElement('table');
            tDom.setAttribute('id', commTableObj.defaultOption.tableID);
            $table = $(tDom);
        }

        _rawTable = $table.bootstrapTable('destroy');
        commTableObj.rawTable = $table.bootstrapTable('destroy');                                                    //先销毁表格

        //bootstrapTable自带的columns实现表头加载
        if (commTableObj.defaultOption.orderNumber) {
            commTableObj.bootstrapOption.columns = commTableObj.headAlignCenter(commTableObj.numberColumn.concat(commTableObj.bootstrapOption.columns));
        }
        if (commTableObj.defaultOption.checkbox) {
            commTableObj.bootstrapOption.columns = commTableObj.headAlignCenter(commTableObj.checkColumn.concat(commTableObj.bootstrapOption.columns));
        }
        commTableObj.judgeAdditional();

        commTableObj.rawTable.bootstrapTable(commTableObj.bootstrapOption);
        //refresh: data + url 用于使用refresh方法
        commTableObj.bootstrapOption.url = commTableObj.defaultOption.dataUrl;
        commTableObj.bootstrapOption.contentType = commTableObj.defaultOption.dataParam.contentType;                //queryTableParam不是原生的请求参数.data是需要加载的rows
        commTableObj.bootstrapOption.queryParams = commTableObj.defaultOption.queryTableParams;                     //queryParams是原生请求参数
        commTableObj.rawTable.bootstrapTable("refreshOptions", commTableObj.bootstrapOption);

        if (commTableObj.defaultOption.loadMethod == "scroll") {

            var scrolltop = [];
            var index = 0;
            var pageIndex = 2;
            scrolltop[0] = 0;
            _rawTable.parent()[0].onscroll = function (e) {
                index++;
                scrolltop[index] = $(this).scrollTop();
                if (scrolltop[index] > scrolltop[index - 1]) {
                    console.log("scroll down");
                    if (scrolltop[index] / 400 > _indexCount && _ajaxLock == false) {
                        _ajaxLock = true;
                        pageIndex++;
                        var rowsNumber = commTableObj.getTableData().length;
                        console.log("rowsNumber = " + rowsNumber);
                        if (rowsNumber < _totalRows) {
                            console.log("it's time to send ajax");
                            console.log(_indexCount);
                            var _page = {
                                pageIndex: pageIndex,
                                pageLine: 20
                            };
                            var _contentType = commTableObj.defaultOption.dataParam.contentType;
                            var _data;

                            if (_contentType) {
                                _data = JSON.stringify({
                                    data: commTableObj.defaultOption.dataParam.data,
                                    page: _page
                                });
                            } else {
                                _data = commTableObj.defaultOption.dataParam.data + "&page=" + _page;
                            }

                            $.ajax({
                                data: _data,
                                type: "post",
                                url: commTableObj.defaultOption.dataUrl,
                                contentType: _contentType ? _contentType : "application/x-www-form-urlencoded",
                                async: false,
                                success: function (res) {
                                    commTableObj.appendData(res.data);
                                    _ajaxLock = false;
                                    _indexCount++;
                                },
                                // complete: function (res) {
                                //     commTableObj.appendData(getExtendData().data);
                                //     _ajaxLock = false;
                                //     _indexCount++;
                                // }
                            })
                        }
                    }
                    var clientHeight = this.clientHeight;
                    var scrollHeight = this.scrollHeight;
                    if (scrolltop[index] + clientHeight == scrollHeight) {
                        //   galleryAutoLoad ();
                        console.log("it's the end");
                    }

                } else {
                    console.log("scroll up");
                }
                console.log("table is scrolling" + scrolltop[index]);
            };
        }
    };

    commTableObj.loadTable = function (bootstrapOption) {
        var $table = $('#' + commTableObj.defaultOption.tableID);

        commTableObj.rawTable = $table.bootstrapTable('destroy');                                                    //先销毁表格
        commTableObj.rawTable.bootstrapTable(bootstrapOption);
    };

    commTableObj.refresh = function () {
        commTableObj.rawTable.bootstrapTable("refresh", {silent: true});
    };

    commTableObj.removeRow = function (oRow) {
        commTableObj.rawTable.bootstrapTable('remove', oRow);
    };

    commTableObj.getTableData = function () {
        return commTableObj.rawTable.bootstrapTable('getData');
    };

    commTableObj.getTableQuery = function (params) {
        var pageObj = {
            pageLine: params.limit,   //页面大小
            pageIndex: params.offset / params.limit + 1  //页码
        };

        var parObj = commTableObj.defaultOption.dataParam;

        // pObj.parameter = commTableObj.defaultOption.dataParam;
        // return pObj;

        return "parameter=" + JSON.stringify(parObj) + "&page=" + JSON.stringify(pageObj);
    };

    commTableObj.mergeJsonObject = function (jsonObj1, jsonObj2) {
        var resultJsonObject = {};
        for (var attr in jsonObj1) {
            resultJsonObject[attr] = jsonObj1[attr];
        }
        for (var attr in jsonObj2) {
            resultJsonObject[attr] = jsonObj2[attr];
        }
        return JSON.stringify(resultJsonObject);
    };

    commTableObj.removeAll = function () {
        commTableObj.rawTable.bootstrapTable('removeAll');
    };

    commTableObj.destroy = function () {
        commTableObj.rawTable.bootstrapTable('destroy');
    };

    commTableObj.getObj = function () {
        return commTableObj;
        pagination - info
    };

    commTableObj.resetTable = resetTable;

    function resetTable() {
        //重点就在这里，获取渲染后的数据列td的宽度赋值给对应头部的th,这样就表头和列就对齐了
        var parent = $("#" + commTableObj.defaultOption.tableID).parent().parent().parent();
        var header = parent.find(".fixed-table-header table thead tr th");
        var cell = parent.find(".fixed-table-header table thead tr th .fht-cell");
        var body = parent.find(".fixed-table-body table tbody tr td");
        var footer = parent.find(".fixed-table-footer table tr td .fht-cell");
        body.each(function (index, ele) {
            if (index > header.length - 1 || header.length == 0) return false;//最后一个自动计算，当出现滚动条时，会出现并不相等的情况
            const innerWidth = ele.clientWidth;
            $(header[index]).width(innerWidth);//head与cell的生效情况不一样
            $(cell[index]).width(innerWidth);
            $(footer[index]).width(innerWidth);
        });
    }

    return commTableObj;

};


function getTableHeader(property, checkbox, tableTag, addOperate, operateEvents) {
    var columns = [];
    var requestData = "parameter=" + JSON.stringify(property);
    let numberColumn = {
        field: 'no',
        title: '序号',
        align: "center",
        width: 40,
        formatter: function (value, row, index) {
            //获取每页显示的数量
            const pageSize = $("#" + tableTag).bootstrapTable('getOptions').pageSize;
            //获取当前是第几页
            const pageNumber = $("#" + tableTag).bootstrapTable('getOptions').pageNumber;
            //返回序号，注意index是从0开始的，所以要加上1
            return index + 1;
            // return pageSize * (pageNumber - 1) + index + 1;
        }
    };
    const operationColumn =
        {
            field: 'Button',
            title: '操作',
            align: "center",
            events: operateEvents,
            formatter: AddFunction
        };

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


    requestAjax("POST", "table/getHeader", false, requestData, "json", function (result) {
        if (checkbox === true) {
            let checkboxObj = {
                checkbox: checkbox
            };
            columns.push(checkboxObj);
        }
        columns.push(numberColumn);
        $.each(result, function (x, Item) {
            var val = Item.id;
            var temp = {
                // checked: true,
                field: val, title: Item.name, align: "center"
            };
            columns.push(temp);
        });
        if (addOperate === true) {
            columns.push(operationColumn);
        }
    });
    return columns;
}
