var commZTree = function () {

    var commZTreeObj = Object();

    commZTreeObj.rawTreeView = null;                         //treeview的容器

    commZTreeObj.defaultOption = {
        // divID: null,
        // url: "",
        // bootstrap2: false,
        // showTags: false,
        // level: 2,
        // unique: true,
        backColor: "",
        // color: "",
        // expand: false,
        // childNodeAutoSelected: true,
        // onNodeExpanded:function (e) {
        //     console.log(e);
        // },
        active: false,
        onNodeClicked: function (event, data) {
            commZTreeObj.nodeSingleClick(event, data);
        }
    };

    commZTreeObj.init = function (option) {

        commZTreeObj.setOption(option);

        var tempDom = $('#' + option.divID);

        commZTreeObj.rawTreeView = tempDom.treeview(commZTreeObj.defaultOption);

        commZTreeObj.requirementConfigure(commZTreeObj.defaultOption);

    };

    commZTreeObj.requirementConfigure =function(configure){
        if(configure.expanded) {
            commZTreeObj.spreadTree();
        }
    };

    commZTreeObj.setOption = function (option) {
        commZTreeObj.defaultOption = $.extend(commZTreeObj.defaultOption, option);
        if (option.url) {
            $.ajax({
                type: "POST",
                url: option.url,
                data: "id=" + option.param,
                async: false,//取消异步
                dataType: "json",
                success: function (res) {
                    commZTreeObj.extendData(res);
                }
            });
        }
    };

    commZTreeObj.setData = function (data) {

        commZTreeObj.extendData(data);

        commZTreeObj.rawTreeView.treeview(commZTreeObj.defaultOption);

    };

    commZTreeObj.extendData = function (res) {
        var dataFormat;

        if(res.state && res.state.code === 200){
            dataFormat = commZTreeObj.changeDataFormat(res.data);
        } else {
            dataFormat = commZTreeObj.changeDataFormat(res);                                                     //为现有的接口返回提供的处理
        }

        commZTreeObj.defaultOption = $.extend(commZTreeObj.defaultOption, {data: dataFormat});
    };

    commZTreeObj.changeDataFormat = function (data) {
        var tempArray = [];
        $.each(data, function (index, ele) {

            var obj = commZTreeObj.objFormat(ele);

            if (ele.childCount > 0) {
                obj.nodes = commZTreeObj.changeDataFormat(ele.nodeChildren);
            }

            tempArray.push(obj);

        });
        return tempArray;
    };

    commZTreeObj.objFormat = function (customObj) {
        //返回treeview接收的对象形式
        return {
            id: customObj.nodeId,
            text: customObj.nodeName,
            href: customObj.nodeUrl,
            tags: [customObj.childCount > 0 ? customObj.childCount : ''],
            childCount: customObj.childCount > 0 ? customObj.childCount : 0
        };
    };

    commZTreeObj.nodeSingleClick = function (event, node) {

        console.log(node);

        if (node.childCount > 0) {

            if (node.state.expanded) {

                commZTreeObj.rawTreeView.treeview('collapseNode', node.nodeId);

            } else {

                if ((!node.nodes && node.childCount > 0) || (node.nodes && node.nodes.length === 0)) {

                    commZTreeObj.loadChildNode(commZTreeObj.defaultOption.url, node); //添加子节点

                }

                commZTreeObj.rawTreeView.treeview('expandNode', node.nodeId);

                $("ul ." + node.id).next().trigger('click');
            }
        } else {
            if (!node.state.selected) {

                $("ul ." + node.id).trigger('click');                                                   //刷新点击

            }
        }
    };

    commZTreeObj.loadChildNode = function (url, node) {

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

                    commZTreeObj.rawTreeView.treeview("addNode", [node.nodeId, {node: ndd}]);
                });
            }
        });
    };

    commZTreeObj.spreadTree = function () {
        commZTreeObj.rawTreeView.children().children().eq(0).trigger('click');
    };

    commZTreeObj.on = function (type,fn) {
        commZTreeObj.rawTreeView.on(type,fn);
    };

    return commZTreeObj;

};