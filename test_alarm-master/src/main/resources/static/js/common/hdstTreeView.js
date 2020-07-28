var commTreeView = function () {

    var commTreeViewObj = Object();

    commTreeViewObj.dom = null;

    commTreeViewObj.rawTreeView = null;                                  //treeview的容器

    /*可用事件列表
    nodeChecked (event, node)  nodeCollapsed (event, node)  nodeDisabled (event, node)   nodeEnabled (event, node)
    nodeExpanded (event, node) nodeSelected (event, node)   nodeUnchecked (event, node)  nodeUnselected (event, node)：取消选择一个节点。
    searchComplete (event, results)                         searchCleared (event, results)
    */

    commTreeViewObj.defaultOption = {
        // divID: null,
        // url: "",
        // bootstrap2: false,
        // showTags: false,
        levels: 1,                                                         //展开等级，设置为1   原生的treeview 设置为2
        // unique: true,                                                    //
        // backColor: "",
        // color: "",
        // expand: "",
        select: true,                                                     //是否需要有默认选中节点
        search: false,                                                     //是否需要查询框
        // childNodeAutoSelected: true,
        // onNodeExpanded:function (e) {
        //     console.log(e);
        // },
        // active: false,
        onNodeClicked: function (event, data) {
            commTreeViewObj.nodeSingleClick(event, data);
        }
    };

    commTreeViewObj.init = function (option) {

        commTreeViewObj.setOption(option);

        var tempDom = $('#' + option.divID);

        commTreeViewObj.rawTreeView = tempDom.treeview(commTreeViewObj.defaultOption);
        commTreeViewObj.dom = commTreeViewObj.rawTreeView[0];

        commTreeViewObj.requirementConfigure(commTreeViewObj.defaultOption);

    };

    commTreeViewObj.requirementConfigure =function(configure){
        if(configure.select) {
            commTreeViewObj.defaultSelect();
        }
        if(configure.search){
            var tree = $("#" + configure.divID);
            var zTree = $.fn.zTree.getZTreeObj("tree");
            var inp = document.createElement("input");
            //赋予style + attr
            inp.setAttribute("id","tv_searchFuzzy");
            inp.setAttribute("class","form-control");
            inp.setAttribute("placeholder","模糊查询");
            inp.style.marginBottom = "10px";
            commTreeViewObj.dom.parentElement.insertBefore(inp,commTreeViewObj.dom);
            inp.oninput = inp.onporpertychange = debounce(function (e) {
                console.log(this.value);
                /*
                *   获取对应节点的过程
                */
                // $.fn.zTree.init(tree, setting, zNodes);
                // var nodes = zTree.getNodesByParamFuzzy("name", this.value, null);
                // console.log(this.value);
                // console.log(nodes);
                // //重新初始化即可
                // if (this.value !== "") {
                //     // var _nodes = zTree.transformToArray(zTree.getNodesByParam("isHidden", true, null));
                //     // zTree.showNodes(_nodes);
                //     // } else {
                //     $.each(nodes, function (index, ele) {
                //         if (ele.children && ele.children.length > 0) {
                //             ele.children = [];
                //         }
                //     });
                //     $.fn.zTree.init(tree, setting, nodes);
                //     // var _all = zTree.transformToArray(zTree.getNodes());
                    // zTree.hideNodes(_all);
                    // zTree.showNodes(nodes);
                // }
            }, 1000);

            function debounce(handler, delay) {
                var timer = null;
                return function () {
                    var _self = this;
                    var _arg = arguments;
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        handler.apply(_self, _arg);
                    }, delay)
                }
            }
        }
    };

    commTreeViewObj.setOption = function (option) {
        commTreeViewObj.defaultOption = $.extend(commTreeViewObj.defaultOption, option);
        if (option.url) {
            $.ajax({
                type: "POST",
                url: option.url,
                data: "id=" + option.param,
                async: false,//取消异步
                dataType: "json",
                success: function (res) {
                    commTreeViewObj.extendData(res);
                }
            });
        }
    };

    commTreeViewObj.setData = function (data) {

        commTreeViewObj.extendData(data);

        commTreeViewObj.rawTreeView.treeview(commTreeViewObj.defaultOption);

    };

    commTreeViewObj.extendData = function (res) {
        var dataFormat;

        if(res.state && res.state.code === 200){
            dataFormat = commTreeViewObj.changeDataFormat(res.data);
        } else {
            dataFormat = commTreeViewObj.changeDataFormat(res);                                                     //为现有的接口返回提供的处理
        }

        commTreeViewObj.defaultOption = $.extend(commTreeViewObj.defaultOption, {data: dataFormat});
    };

    commTreeViewObj.changeDataFormat = function (data) {
        var tempArray = [];
        $.each(data, function (index, ele) {

            var obj = commTreeViewObj.objFormat(ele);

            if (ele.childCount > 0) {
                obj.nodes = commTreeViewObj.changeDataFormat(ele.nodeChildren);
            }

            tempArray.push(obj);

        });
        return tempArray;
    };

    commTreeViewObj.objFormat = function (customObj) {
        //返回treeview接收的对象形式
        return {
            id: customObj.nodeId,
            text: customObj.nodeName,
            href: customObj.nodeUrl,
            tags: [customObj.childCount > 0 ? customObj.childCount : ''],
            childCount: customObj.childCount > 0 ? customObj.childCount : 0
        };
    };

    commTreeViewObj.nodeSingleClick = function (event, node) {

        console.log(node);

        if (node.childCount > 0) {

            if (node.state.expanded) {

                commTreeViewObj.rawTreeView.treeview('collapseNode', node.nodeId);

            } else {

                if ((!node.nodes && node.childCount > 0) || (node.nodes && node.nodes.length === 0)) {

                    commTreeViewObj.loadChildNode(commTreeViewObj.defaultOption.url, node); //添加子节点

                }

                commTreeViewObj.rawTreeView.treeview('expandNode', node.nodeId);

                $("ul ." + node.id).next().trigger('click');
            }
        } else {
            if (!node.state.selected) {

                $("ul ." + node.id).trigger('click');                                                   //刷新点击

            }
        }
    };

    commTreeViewObj.loadChildNode = function (url, node) {

        $.ajax({
            type: "POST",
            url: url,
            data: 'id=' + node.id,
            async: false,//取消异步
            dataType: "json",
            success: function (res) {
                console.log(res);
                if (!res) {
                    return;
                }

                $.each(res, function (index, ele) {

                    var ndd = {
                        id: ele.nodeId,
                        text: ele.nodeName,
                        href: ele.nodeUrl,
                        tags: [ele.childCount > 0 ? ele.childCount : ''],
                        childCount: ele.childCount > 0 ? ele.childCount : 0
                    };
                    if (ele.childCount > 0) {
                        ndd.nodes = [];
                    }

                    commTreeViewObj.rawTreeView.treeview("addNode", [node.nodeId, {node: ndd}]);
                });
            }
        });
    };

    commTreeViewObj.defaultSelect = function () {
        commTreeViewObj.rawTreeView.children().children().eq(0).trigger('click');
    };

    commTreeViewObj.on = function (type,fn) {
        commTreeViewObj.rawTreeView.on(type,fn);
    };

    return commTreeViewObj;

};