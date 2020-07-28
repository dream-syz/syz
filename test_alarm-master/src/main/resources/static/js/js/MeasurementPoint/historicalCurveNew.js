let hcBus = historicalCurveBusiness;

let areaTree = new hdTree();
let customTree = new hdTree();

let graphDom;

$(document).ready(function () {
    getConst();

    ACCESS_MENUBAR.loadMenuBar("historicalCurveNew", "operationManage");   //加载顶部菜单

    initTree();

    initConditionQuery();

});

function getConst() {
    infoWrapper = $("#linesPanel");
    infoPanelBody = $("#infoPanelBody");
    treeWrapper = $("#treeWrapper");
}

function initTree() {
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
            data: {
                simpleData: {
                    enable: true,
                    idKey: "id",
                    pIdKey: "pId",
                    rootPId: ""
                }
            },
            callback: {
                beforeClick: function (treeId, treeNode) {
                    if (treeNode.isParent) {
                        areaTree.zTree.expandNode(treeNode);
                    }
                    return true;
                },
                onClick: function (event, treeId, treeNode) {
                    // var expandFlag = treeNode.isParent;

                    let nodeId = treeNode.data.nodeId;
                    areaTree.nodeId = nodeId;

                    // clickNum++;
                    // if (clickNum === 1) {
                    //     customTreeInit(nodeId);
                    // } else {
                    //     customTree.refresh(getCustomTree(nodeId));
                    // }

                    loadGraph();
                }
            }
        }
    });


    flexibleConfig();


    function customTreeInit(nodeId) {
        customTree.init({
            tID: "customTree",
            search: true,
            nodes: {
                data: getCustomTree(nodeId)
            },
            setting: {
                view: {
                    dblClickExpand: false,
                    showLine: false,
                    selectedMulti: false,
                    showIcon: false
                },
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "id",
                        pIdKey: "pId",
                        rootPId: ""
                    }
                },
                callback: {
                    beforeClick: function (treeId, treeNode) {
                        if (treeNode.isParent) {
                            customTree.zTree.expandNode(treeNode);
                        }
                        return true;
                    },
                    onClick: function (event, treeId, treeNode) {
                        // var expandFlag = treeNode.isParent;
                        // areaTree.nodeId = treeNode.data.nodeId;
                        // clickNum++;
                        // if (clickNum === 1) {
                        //     initTable();
                        // } else {
                        //     // console.log("refresh:    " + modeFlag + "       " + treeNode.data.nodeId);
                        //     refreshTable();
                        // }
                        console.log("refresh:    " + "       " + treeNode.data.nodeId + treeNode.name);
                    }
                }
            }
        });
    }

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

            resizeGraph();
        }

        function panelOut() {
            treeWrapper.removeClass('hide');
            infoWrapper.addClass(partScreenClass).removeClass(fullScreenClass);
            iconOut.addClass('hide');
            iconIn.removeClass('hide');

            resizeGraph();
        }
    }
}

function loadGraph() {
    graphDom = document.getElementById('graphLine');
    var myChart = echarts.init(graphDom);
    window.onresize = () => {
        resizeGraph();
    };
    myChart.setOption(getChartOptions(areaTree.nodeId));
}

function resizeGraph() {
    echarts.getInstanceByDom(graphDom).resize();
}

function initConditionQuery() {
    var toolbar = $("#queryConditions");

    var browseF = {
        itemId: "browse",
        label: {
            text: "查看命令队列"
        },
        type: "button",
        event: {
            onclick: c.throttle(browseOrders, 1000)                                                    //方法名
        }
    };
    var browse = new comItem();
    browse.oInit(browseF);
    toolbar.append(browse.getDom());

    function browseOrders() {
        c.alert("browseOrders");
    }

    function beforeClick(treeId, treeNode) {
        customTree.zTree.checkNode(treeNode, !treeNode.checked, null, true);
        return false;
    }

    function onCheck(e, treeId, treeNode) {
        var nodes = customTree.zTree.getCheckedNodes(true),
            v = "";
        for (var i = 0, l = nodes.length; i < l; i++) {
            v += nodes[i].name + ",";
        }
        if (v.length > 0) v = v.substring(0, v.length - 1);
        var cityObj = $("#citySel");
        cityObj.attr("value", v);
    }

    customTree.init({
        tID: "customTree",
        select: {
            default: false
        },
        nodes: {
            data: getZNodes()
        },
        setting: {
            check: {
                enable: true,
                chkboxType: {"Y": "", "N": ""}
            },
            view: {
                dblClickExpand: false
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback: {
                beforeClick: beforeClick,
                onCheck: onCheck
            }
        }
    });
}

function showMenu() {
    var cityObj = $("#citySel");
    var cityOffset = $("#citySel").offset();
    $("#menuContent").css({left:cityOffset.left + "px", top:cityOffset.top + cityObj.outerHeight() + "px"}).slideDown("fast");

    $("body").bind("mousedown", onBodyDown);
}
function hideMenu() {
    $("#menuContent").fadeOut("fast");
    $("body").unbind("mousedown", onBodyDown);
}
function onBodyDown(event) {
    if (!(event.target.id == "menuBtn" || event.target.id == "citySel" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length>0)) {
        hideMenu();
    }
}

