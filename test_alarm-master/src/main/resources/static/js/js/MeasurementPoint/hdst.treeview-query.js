(function($) {

    var nodeName;

    $.fn.initTree = function(options) {
        $.extend($.fn.initTree.defaults, options);
        nodeName = $(this);
        init();
    };

    $.fn.buildDomTree = function(url,parameter){
        return  buildDomTree(url,parameter);
    };

    $.fn.loadChildNode = function(parameter,url,node,element){
        loadChildNode(parameter,url,node,element);
    };

    $.fn.initTree.defaults = {
        url: "",
        bootstrap2: false,
        showTags: false,
        levels: 1,
        unique :true
    };

    function init() {
        $.fn.initTreeData();
    }

    $.fn.initTreeData = function() {

        var option={
            bootstrap2 : $.fn.initTree.defaults.bootstrap2,
            showTags : false,
            levels : $.fn.initTree.defaults.levels,
            unique :$.fn.initTree.defaults.unique,
            data : buildDomTree($.fn.initTree.defaults.url,$.fn.initTree.defaults.data),
            backColor: $.fn.initTree.defaults.backColor, //节点的背景色      string
            color:$.fn.initTree.defaults.color,
        };

        if(isExitsFunction($.fn.initTree.defaults.nodeIsSelected)){
            option.onNodeSelected= function(event, data){
                return $.fn.initTree.defaults.nodeIsSelected(event, data);
            };
        }

        if(isExitsFunction($.fn.initTree.defaults.onNodeNotSelected)){
            option.onNodeUnselected =function(event, data){
                return $.fn.initTree.defaults.onNodeNotSelected(event, data);
            }
        }

        if(isExitsFunction($.fn.initTree.defaults.onNodeIsClicked)){
            option.onNodeClicked =function(event, data){
                return $.fn.initTree.defaults.onNodeIsClicked(event, data);
            }
        }else {
            option.onNodeClicked = function (event, data) {
                defaultNodeClicked(event, data);
            }
        }


        //初始化区域树控件
        nodeName.treeview(option);

    };

    function defaultNodeClicked(event, node) {
        var tree = $('#'+event.currentTarget.id);
        deployNode(node,tree);
    }

    function deployNode(node,tree) {
        if(node.state.expanded){
            console.log("已展开"+node.nodeId);
            tree.treeview('collapseNode', node.nodeId);
        } else {
            console.log("未展开"+node.nodeId);
            if(!node.nodes && node.childCount > 0){
                console.log("未定义，且有子节点");
                loadChildNode("id="+node.id,$.fn.initTree.defaults.url,node,tree);//加载子节点

            }else if(node.nodes && node.nodes.length==0){
                console.log("定义，且有子节点");
                loadChildNode("id="+node.id,$.fn.initTree.defaults.url,node,tree);//加载子节点
            }

            tree.treeview('expandNode', node.nodeId);
        }
    }

    function loadChildNode(parameter,url,node,tree) {
        $.ajax({
            type: "POST",
            url: url,
            data:parameter,
            async: false,//取消异步
            dataType: "json",
            success: function (nodes) {
                if (!nodes) { return; }
                $.each(nodes, function (index, data) {
                    if(null != nodes[index]){
                        console.log("加载子节点"+nodes[index]);
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
                        tree.treeview("addNode", [node.nodeId,{ node:ndd }]);
                    }
                });
            }
        });
    }

    function buildDomTree(url,parameter) {
        var data = [];
        $.ajax({
            type: "POST",
            url: url,
            data:parameter,   //id = 0
            async: false,//取消异步
            dataType: "json",
            success: function (msg) {
                walk(msg, data);
            }
        });
        return data;
    }

    function walk(nodes, data) {
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
                walk(node.nodeChildren, obj.nodes);
            }
            data.push(obj);
        });
    };

    function isExitsFunction(funcName) {
        try {
            if (typeof(eval(funcName)) == "function") {
                return true;
            }
        } catch(e) {}
        return false;
    }

})(jQuery);


