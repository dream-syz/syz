window.onload = () => {
    getConsts();

    initMenu();

    loadAreaTree();

    initToolbar();

    function getConsts() {
        infoWrapper = $("#reportPanel");
        infoPanelBody = $("#infoPanelBody");
        treeWrapper = $("#treeWrapper");
    }

    function initMenu() {
        let vm = new Vue({
            el: '#menuBar'
        });
    }

    function loadAreaTree() {
        let clickNum = 0;
        areaTree.init({
            tID: "areaTree",
            search: true,
            nodes: {
                data: c.getAreaTree()
            },
            setting: {
                view: {
                    dblClickExpand: false,
                    showLine: false,
                    selectedMulti: false,
                    showIcon: false
                },
                callback: {
                    beforeClick: function (treeId, treeNode) {
                        if (treeNode.isParent) {
                            areaTree.zTree.expandNode(treeNode);
                        }
                        return true;
                    },
                    onClick: function (event, treeId, treeNode) {
                        let nodeId = treeNode.data.nodeId;
                        areaTree.nodeId = nodeId;
                        clickNum++;
                        if (clickNum === 1) {
                            initTable(nodeId);
                        } else {
                            reportDownloadTable.refresh();
                        }
                    }
                }
            }
        });


        flexibleConfig();

        function flexibleConfig() {
            const iconIn = $("#flexibleIcon_in");
            const iconOut = $("#flexibleIcon_out");

            const fullScreenClass = "col-lg-12 col-md-12";
            const partScreenClass = "col-lg-10 col-md-9";
            iconIn.on('click', panelIn);
            iconOut.on('click', panelOut);

            function panelIn() {
                treeWrapper.addClass('hide');
                infoWrapper.addClass(fullScreenClass).removeClass(partScreenClass);
                iconIn.addClass('hide');
                iconOut.removeClass('hide');
                reportDownloadTable.resetTable();
            }

            function panelOut() {
                treeWrapper.removeClass('hide');
                infoWrapper.addClass(partScreenClass).removeClass(fullScreenClass);
                iconOut.addClass('hide');
                iconIn.removeClass('hide');
                reportDownloadTable.resetTable();
            }
        }

        function initTable() {
            var height = infoPanelBody.height();
            reportDownloadTable.init({                                                                      //表头是固定的，数据要url请求
                tableID: "reportLoadTable",
                checkbox: true,
                orderNumber: false,
                loadMethod: 'button',                                                             //默认是scroll 需要其他的写button
                dataUrl: "measure/download/special/export/queryCustomizeFilesByAreaId",
                dataParam: {
                    data: JSON.stringify(getDataParams()),
                    contentType: "application/json"
                },
                queryTableParams: function () { //查询参数事件
                    return getDataParams();
                },
                isNeedOperate: true,                                                                    //isNeedOperate和otherOperationArr配套使用
                otherOperationArr: ['download'],
                operate: addOperateButton,
                download: downloadReport
            }, {
                showExport: false,
                search: true,
                showColumns: true,
                height: height,
                sidePagination: 'client',
                columns: getColumns(),
                pageNumber: 1,
                pageSize: [10000],
                queryParamsType: '',
                responseHandler: function (data) {
                    if (data.code == 204) {
                        return [];
                    } else {
                        return data.data;
                    }
                }
            });

            function getDataParams() {
                return {
                    "areaId": 28200
                }
            }

            function downloadReport(e, value, row, index) {
                let handler = function () {
                    c.downloadFile("measure/download/special/export/downloadOneSpecialExportById", "id", row.id);
                };
                c.confirm("是否下载该文件", handler);
            }

            function addOperateButton() {
                return '<button type="button" class="download btn btn-primary btn-xs">&nbsp;下载&nbsp;</button>&nbsp;&nbsp;';
            }
        }
    }

    function initToolbar() {
        const toolbar = $("#toolbar");
        const loadF = {
            itemId: "multipleDownload",
            label: {
                text: "批量下载"
            },
            type: "button",
            options: {
                buttonType: "download"
            },
            event: {
                onclick: loadReportMultiple                                                   //方法名
            }
        };
        var load = new comItem();
        load.oInit(loadF);

        toolbar.append(load.getDom());

        function loadReportMultiple() {
            let rows = reportDownloadTable.hdstTable("getSelections");

            if (rows && rows.length > 0) {
                // let ids = rows.map((ele, index) => {
                //     return ele.id;
                // });

                let strIds = '';
                rows.forEach((ele, index) => {
                    strIds += index === 0 ? `${ele.id}` : `,${ele.id}`;
                });
                let handler = function () {
                    c.downloadFile("measure/download/special/export/downloadSpecialExportsByIds", "ids", strIds);
                };
                c.confirm("是否批量下载选中文件", handler);
            } else {
                c.alert("请勾选要下载的文件");
            }
        }
    }
};