var hdstSystem = (function () {

    var oSystem = Object();
    var $window = $(window);

    var hdstTreeView = new commTreeView();
    var hdstTable = new commTable();

    oSystem.hdTable = hdstTable;

    oSystem.windowHeight = $window.height() < 600 ? 600 : $window.height();
    oSystem.windowWidth = $window.width();

    // oSystem.innerPanelStandardHeight = oSystem.windowHeight - $('#head-top-model').height() - 100;

    oSystem.innerPanelStandardHeight = oSystem.windowHeight - 66 - 80;                             //现在用66顶替

    oSystem.loadPage = function (headId, ...arg) {
        var $head = $("#" + headId);
        arg.forEach(function (value, index) {
            $("#" + value).height(oSystem.windowHeight - $head.height() - 30);
        });
    };

    oSystem.initCommTree = function (pObj) {
        var testTreeView = new commTreeView();
        var tObj = {
            divID: "treeview",
            showTags: false,
            param: "id=0",
            expanded: false,
            url: "roleArea/getAreasBySysUser"
        };
        tObj = $.extend(tObj, pObj);
        testTreeView.init(tObj);

        // testTreeView.setData(getTreeViewData());
    };

    oSystem.initClientTable = function (tableID, dataUrl, dataParam, headUrl, headParam, configure) {
        var testTable = new commTable();
        testTable.init({
            tableID: tableID,
            // dataUrl: dataUrl,
            // dataParam: dataParam,
            // headUrl: headUrl,
            // headParam: headParam,
            // configure: configure
        });

        testTable.setHead(getTableHead());
        testTable.setData(getClientTableData());

    };


    //分割线
    oSystem.initDomTree = function (treeId, expand, level, Selected, url, par) {
        var $tree = $("#" + treeId);
        var options = {
            url: url ? url : "roleArea/getAreasBySysUser",
            bootstrap2: false,
            showTags: false,
            // levels: 1,
            data: par ? par : 'id=0',
            unique: true,
            expand: expand,
            level: level ? level : 1,
            id: treeId,
            childNodeAutoSelected: Selected
        };
        $tree.initTree(options);
        var selectedNode = $tree.treeview('getSelected');
        console.log(selectedNode);
        if (expand) {
            // areaData = selectedNode[0];
            // areaIdCommon = areaData.id;
        }
    };

    oSystem.initTree = function (options) {
        var configure = {
            url: null,
            childNodeAutoSelected: false,
            bootstrap2: false,
            showTags: false,
            // levels: 1,
            // data: "id=0",
            unique: true,
            expand: true,
            level: 2
        };
        $.extend(configure, options);

        var commTreeObj = new commTreeView();

        commTreeObj.Init(configure);
    };

    oSystem.initInTree = function (par) {
        var $wrapper = $("#" + par.wrapperId);

        $wrapper.append('<div id=' + par.divID + '></div>');

        hdstTreeView.init({
            divID: par.divID,
            url: par.url,                                                 //实际对接填入url和param即可
            param: par.param,
        });
    };

    oSystem.initInTable = function (par) {
        var $wrapper = $("#" + par.wrapperId);
        if (par.type === "modal") {
            $('.modal-body').append('<table id=' + par.tableId + '></table>');
        } else {
            $wrapper.append('<div class="tableInfo table-responsive"><table id=' + par.tableId + '></table></div>');
        }
        hdstTable.init({
            tableID: par.tableId,
            dataUrl: par.dataUrl,
            dataParam: {
                data:"parameter=" + JSON.stringify(par.dataParam)
            },
            headUrl: par.headUrl,
            headParam:{
                data:"parameter=" + JSON.stringify(par.headParam)
            }
        }, {
            showRefresh: false,
            showExport: false,
            showColumns: false,
            showPaginationSwitch: false,
            search: par.search ? par.search : false,
            height: 420,
            pageNumber: 1,
            pageSize: 1000,
            pageList: [],                                                          //pageSize和pageList最好配套传，需要选择回最合适的高度
        });
    };

    oSystem.initInnerTable = function (wrapperId, tableId, dataUrl, type, searchConfigure, head, param) {

        var $modal = $("#" + wrapperId);

        if (type === "modal") {
            $('.modal-body').append('<table id=' + tableId + '></table>');
        } else {
            $modal.append('<table id=' + tableId + '></table>');
        }
        console.log($modal);
        $("#" + tableId).bootstrapTable({
            showRefresh: false,
            showExport: false,
            showColumns: false,
            search: searchConfigure,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            url: dataUrl,
            method: 'post',
            pageNumber: 1,
            pageSize: 10000,
            pagination: false,
            sidePagination: "client",
            columns: head,//表头
            height: 500,
            uniqueId: 'mpId',     //每一行的唯一标识，一般为主键列
            ajaxOptions: {
                async: true,
                timeout: 120000
            },
            queryParams: function (params) { //查询参数事件
                return "parameter=" + param;
                // return "parameter= " + getParams();
            },
            responseHandler: function (res) {

                // res = getModalTableResponse();

                $.each(res, function (index, detail) {

                    $.each(detail.data, function (x, Item) {

                        var val = Item.id;
                        res[index][val] = Item.value;

                    });
                });
                return res;
            }
        });
    };

    oSystem.initChart = function (divId, type, title, dimensions, xData, data, theme) {
        commChart.init({
            divID: divId,
            type: [type],
            theme: theme
        });
        commChart.fillDataStoreAndRefreshChart({
            title: title,
            data: data,
            dimensions: dimensions,
            xData: xData,
        });
    };

    oSystem.resultFeedback = function (res) {
        alert(res.state.description);
    };

    return oSystem;
})();