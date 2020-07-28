
(function ($) {

    var nodeName;

     $.fn.initTree = function (options) {

        $.extend($.fn.initTree.defaults, options);

        nodeName = $(this);

        $.fn.initTreeData();

    };

    $.fn.initTree.defaults = {
        id: "treeview",
        url: "",
        bootstrap2: false,
        showTags: false,
        level: 2,
        unique: true,
        backColor: "",
        color: "",
        expand: false,
        childNodeAutoSelected: true,
        onNodeClicked: function (event, data) {
            console.log(event);
            $.fn.defaultNodeClicked(event, data);
        }
    };

    $.fn.initTreeData = function () {
        console.log($.fn.initTree.defaults);
        $.fn.initTree.defaults.showTags = false;        //不显示图标
        $.fn.initTree.defaults.data = $.fn.buildDomTree($.fn.initTree.defaults.url, $.fn.initTree.defaults.data);

        nodeName.treeview($.fn.initTree.defaults);

        if ($.fn.initTree.defaults.expand) {
            $.fn.treeviewDefaultExpand($.fn.initTree.defaults.level, $.fn.initTree.defaults.id);
        }
    };

    $.fn.defaultNodeClicked = function (event, node) {

        console.log(node);

        var tree = $('#' + event.currentTarget.id);

        if (node.state.expanded) {

            tree.treeview('collapseNode', node.nodeId);
        } else {

            if (!node.nodes && node.childCount > 0) {

                $.fn.loadChildNode("id=" + node.id, $.fn.initTree.defaults.url, node, tree);//加载子节点

            } else if (node.nodes && node.nodes.length == 0) {

                $.fn.loadChildNode("id=" + node.id, $.fn.initTree.defaults.url, node, tree);//加载子节点
            }

            tree.treeview('expandNode', node.nodeId);

            if ($.fn.initTree.defaults.childNodeAutoSelected === false && node.childCount > 0) {            //展开父节点部分

                var $parent = $('ul .' + node.id);

                $.fn.childNodesSelected($parent);

            }

        }
    };

    $.fn.loadChildNode = function (parameter, url, node, element) {

        $.ajax({
            type: "POST",
            url: url,
            data: parameter,
            async: false,//取消异步
            dataType: "json",
            success: function (nodes) {
                console.log(nodes);
                if (!nodes) {
                    return;
                }

                $.each(nodes, function (index, data) {

                    var ndd = {
                        id: data.nodeId,
                        text: data.nodeName,
                        href: data.nodeUrl,
                        tags: [data.childCount > 0 ? data.childCount : ''],
                        childCount: data.childCount > 0 ? data.childCount : 0
                    };

                    if (data.childCount > 0) {
                        ndd.nodes = [];
                    }

                    element.treeview("addNode", [node.nodeId, {node: ndd}]);
                });
            },
            // complete: function () {
            //     var nodes = getChildNode();
            //     $.each(nodes, function (index, data) {
            //
            //         var ndd = {
            //             id: data.nodeId,
            //             text: data.nodeName,
            //             href: data.nodeUrl,
            //             tags: [data.childCount > 0 ? data.childCount : ''],
            //             childCount: data.childCount > 0 ? data.childCount : 0
            //         };
            //
            //         if (data.childCount > 0) {
            //             ndd.nodes = [];
            //         }
            //
            //         element.treeview("addNode", [node.nodeId, {node: ndd}]);
            //     });
            // }
        });
    };

    $.fn.buildDomTree = function (url, parameter) {
        var data = [];
        $.ajax({
            type: "POST",
            url: url,
            data: parameter,
            async: false,//取消异步
            dataType: "json",
            success: function (msg) {
                $.fn.walkByTreeView(msg, data);
            }
        });

        return data;
    };

    $.fn.walkByTreeView = function (nodes, data) {

        if (!nodes) {
            return;
        }

        $.each(nodes, function (id, node) {

            var obj = {
                id: node.nodeId,
                text: node.nodeName,
                href: node.nodeUrl,
                tags: [node.childCount > 0 ? node.childCount : ''],
                childCount: node.childCount > 0 ? node.childCount : 0
            };

            if (node.childCount > 0) {
                obj.nodes = [];
                $.fn.walkByTreeView(node.nodeChildren, obj.nodes);
            }
            data.push(obj);
        });
    };

    $.fn.getAreaId = function (nodeId) {
        return nodeId;
    };

    $.fn.treeviewDefaultExpand = function (level, treeId) {
        for (var i = 0; i < level; i++) {
            $('#' + treeId + ' ul li').eq(i).trigger('click');
        }
    };

    $.fn.childNodesSelected = function ($parent) {
        $parent.next().trigger('click');
    }

})(jQuery);


