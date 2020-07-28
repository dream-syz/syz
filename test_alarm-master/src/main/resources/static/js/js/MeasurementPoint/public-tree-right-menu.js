var treeRightMenu = (function () {

    var my = {};

    var defaultOption = {
        url:undefined,          //查询树的url
        arg:undefined,          //初始化树时的传参
        argName:"id",           //生成树传参的参数名
        tree:undefined,         //生成树的id
        events:[]               //绑定事件list

    }

    /*--------------------------------------------------初始化----------------------------------------------------------*/
    
    my.init = function (option) {
        $.extend(defaultOption,option);

        var eventAggregator = new EventAggregator();

        initEvent(eventAggregator,defaultOption.events);

        //初始化 树
        initAreaTree(defaultOption.url,defaultOption.arg,defaultOption.tree);
        //初始化 右键菜单
        rightMenu(defaultOption.tree,defaultOption.events,eventAggregator);
    }

    /**
     * 新增完节点后 展开节点
     * @param parentNode
     * @param tree
     */
    my.addNode = function (tree,parentNode,newNode) {
        if (parentNode.nodeId) {
            var parentNode = tree.treeview('getNode', parentNode.nodeId);
            if (parentNode.state.expanded) {//已展开
                console.log("已展开");
                tree.treeview("addNode", [parentNode.nodeId, {node: {id: newNode.nodeId, text: newNode.nodeName}}]);
            } else {//未展开
                console.log("未展开");
                //先展开
                loadChildNode(parentNode, tree);//加载子节点
                tree.treeview('expandNode', parentNode.nodeId);
                parentNode.state.selected = false;
            }

        } else {
            tree.treeview("addNode", [-1, {node: {id: newNode.nodeId, text: newNode.nodeName}}]);
        }
    }
    /**
     * 删除完节点后 删除节点
     * @param tree
     * @param node
     */
    my.deleteNode = function (tree,node) {
        console.log("删除节点：" + JSON.stringify(node.nodeId));
        $(tree).treeview("deleteNode", [node.nodeId]);
    }

    my.updataNode = function (tree,node,nodeName) {
        tree.treeview("editNode", [node.nodeId, {text: nodeName}]);
    }

    /**
     * 添加子节点
     * @param obj
     * @param tree
     */
    function loadChildNode(obj, tree) {
        console.log(obj);
        $.ajax({
            type: "POST",
            url: $.fn.initTree.defaults.url,
            data: "id=" + obj.id,
            async: false,//取消异步
            dataType: "json",
            success: function (nodes) {
                if (!nodes) {
                    return;
                }
                $.each(nodes, function (index, node) {
                    if (null != nodes[index]) {
                        console.log("加载子节点" + nodes[index]);
                        tree.treeview("addNode", [obj.nodeId, {node: {id: node.nodeId, text: node.nodeName}}]);
                    }
                });
            }
        });
    }



    /*------------------------------------------------私有方法-----------------------------------------------------------*/
    
    function initEvent(eventAggregator,events) {

        events.forEach(function (event) {
            eventAggregator.subscribe(event.name,event.event);
        });
    }

    /* 初始化 区域树 */
    function initAreaTree(url,arg,tree) {
        var options = {
            url: url,
            bootstrap2: false,
            showTags: true,
            levels: 1,
            data: defaultOption.argName+"="+ arg,
            unique: true
        };

        $(tree).initTree(options);

    }

    /* 右键菜单 */
    function rightMenu(tree,events,eventAggregator) {

        addMousePutColor(tree);//右键菜单变色
        var body = initContextBody(tree,eventAggregator);

        //            右键弹出菜单
        context.init({preventDoubleContext: false});//初始化
        context.settings({compress: true});

        context.attach(tree+' li', body);
    }

    /*初始化 菜单的方法体*/
    function initContextBody(tree,eventAggregator) {

        var body = [];

        body.push({header: '执行操作'});

        $(defaultOption.events).each(function (i,event) {

            var obj = {
                text: event.name,
                action: function () {

                    var node = getAreaIdOfLi(tree);
                    console.log(node);
                    eventAggregator.publish(event.name, node);
                    $(event.id).modal('show');
                }
            }

            body.push(obj);
        });

        return body;
    }

    /* 得到当前选中的区域元素 获取信息 */
    function getAreaIdOfLi(tree) {
        var area = {
            nodeId: null,
            id: null,
            name: null
        };

        $(tree+" ul li").each(function () {

            var backGroundColor = $(this).css("background-color");

            if ("rgb(66, 139, 202)" == backGroundColor) {

                var nodeId = $(this).attr("data-nodeid");
                var areaName = $(this).text();
                var node = $(tree).treeview('getNode', nodeId);
                console.log(node);

                area.nodeId = node.nodeId;
                area.id = node.id;
                area.name = node.text;
                area.href =node.href;
                return false;
            }
        });

        return area;
    }

    /* 右键后 选项框变色 */
    function addMousePutColor(tree) {

        $(document).on("mousedown", ""+tree+" ul li", function () {
                $(tree+" ul li").css("background-color", "#fff");
                $(tree+" ul li").css("color", "black");
                $(this).css("background-color", "rgb(66, 139, 202)");
            }
        )
    }
    
    function Event(name) {
        var handlers = [];

        this.getName = function () {
            return name;
        }

        this.addHandler = function (handler) {
            handlers.push(handler);
        }
        
        this.removeHandler = function (handler) {
            for(var i = 0; i < handlers.length; i ++){
                if(handlers[i] == handler){
                    handlers.splice(i,1);
                    break;
                }
            }
        }

        this.fire = function (eventArgs) {
            handlers.forEach(function (h) {
                h(eventArgs);
            })
        }
    }

    function EventAggregator() {
        var events = [];

        function getEvent(eventName) {
            return $.grep(events, function (event) {
                return event.getName() === eventName;
            })[0];
        }

        this.publish = function (eventName, eventArgs) {
            var event = getEvent(eventName);

            if (!event) {
                event = new Event(eventName);
                events.push(event);
            }
            event.fire(eventArgs);
        };

        this.subscribe = function (eventName, handler) {
            var event = getEvent(eventName);

            if (!event) {
                event = new Event(eventName);
                events.push(event);
            }

            event.addHandler(handler);
        };
    }




    /*---------------------------------------------------返回-----------------------------------------------------------*/
    return my;

}());