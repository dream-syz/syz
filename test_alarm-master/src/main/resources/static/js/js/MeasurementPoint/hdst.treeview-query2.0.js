(function($) {

    var nodeName;

    $.fn.initTree = function(options) {

        $.extend($.fn.initTree.defaults, options);
        nodeName = $(this);

        $.fn.initTreeData();
    };

    $.fn.initTree.defaults = {
        url: "",
        bootstrap2: false,
        showTags: false,
        levels: 1,
        unique :true,
        backColor:"",
        color:"",
        onNodeClicked:function (event, data) {
            $.fn.defaultNodeClicked(event, data);
        }
    };

    $.fn.initTreeData = function() {
        console.log($.fn.initTree.defaults);
        $.fn.initTree.defaults.data = $.fn.buildDomTree($.fn.initTree.defaults.url,
            $.fn.initTree.defaults.data);

        nodeName.treeview( $.fn.initTree.defaults);
    };

    $.fn.defaultNodeClicked = function (event, node) {

        var tree = $('#'+event.currentTarget.id);

        if(node.state.expanded){

            tree.treeview('collapseNode', node.nodeId);
        } else {

            if(!node.nodes && node.childCount > 0){

                $.fn.loadChildNode("id="+node.id,$.fn.initTree.defaults.url,node,tree);//加载子节点

            }else if(node.nodes && node.nodes.length==0){

                $.fn.loadChildNode("id="+node.id,$.fn.initTree.defaults.url,node,tree);//加载子节点
            }

            tree.treeview('expandNode', node.nodeId);
        }
    };

    $.fn.loadChildNode = function(parameter,url,node,element){

        $.ajax({
            type: "POST",
            url: url,
            data:parameter,
            async: false,//取消异步
            dataType: "json",
            success: function (nodes) {
                if (!nodes) { return; }

                $.each(nodes, function (index, data) {

                    var ndd = {
                        id: data.nodeId,
                        text: data.nodeName,
                        href: data.nodeUrl,
                        tags: [data.childCount > 0 ? data.childCount: ''],
                        childCount:data.childCount > 0 ? data.childCount :0
                    };

                    if (data.childCount > 0) {
                        ndd.nodes = [];
                    }

                    element.treeview("addNode", [node.nodeId,{ node:ndd }]);
                });
            }
        });
    };

    $.fn.buildDomTree = function(url,parameter){

        var data = [];

        $.ajax({
            type: "POST",
            url: url,
            data:parameter,
            async: false,//取消异步
            dataType: "json",
            success: function (msg) {
                $.fn.walkByTreeView(msg, data);
            }
        });

        return data;
    };

    $.fn.walkByTreeView = function (nodes, data) {

        if (!nodes) { return; }

        $.each(nodes, function (id, node) {

            var obj = {
                id: node.nodeId,
                text: node.nodeName,
                href: node.nodeUrl,
                tags: [node.childCount > 0 ? node.childCount: ''],
                childCount:node.childCount > 0 ? node.childCount:0
            };

            if (node.childCount > 0) {
                obj.nodes = [];
                $.fn.walkByTreeView(node.nodeChildren, obj.nodes);
            }
            data.push(obj);
        });
    };

})(jQuery);


