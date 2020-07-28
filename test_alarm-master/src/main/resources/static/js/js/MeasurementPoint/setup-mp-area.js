        var lastSelectNodeId = null;//最后一次触发节点的nodeID
        var lastSelectTime = null;//最后一次触发节点的时间

        $(function () {
            var tree = $('#knowledgeTree');
            getTree(tree);//初始化树
            // initAreaTree();

        });
        /*
        function initAreaTree() {
            console.log("初始化树");
            var options = {
                url:"area/getNearChildAreaById",
                bootstrap2: false,
                showTags: true,
                levels: 1,
                data:0,
                unique :true
            };
            $("#knowledgeText").initTree(options);
        }*/

        /*---------------------------------------------------生成树------------------------------------------------------*/

        /**
         * 初始化树
         * @param element 树的id
         */
        function getTree(tree) {
        //初始化区域树控件
            var options = {
                url: "area/getNearChildAreaById",
                bootstrap2: false,
                showTags: true,
                levels: 1,
                data: "id=" + 0,
                unique: true,
                nodeIsSelected: function (event, data) {
                    // $("#treeview").itemOnclick(tree,data);
                },
                onNodeNotSelected: function (event, data) {
                    // $("#treeview").itemUnOnclick(tree,data);
                }
            };
            tree.empty();
            tree.initTree(options);
        }

        /**
         *  根据得到的数据 初始化树
         * @param data
         */
        function initaTree(tree, data) {

            var dataTree = [];
            console.log("得到区域的json");
            console.log(data);

            //解析数据 得到节点树（可递归）
            $(data).each(function (i, n) {
                var node = {text: n.nodeName, id: n.nodeId, nodes: [], selectable: true};
                buildTree(node, n);
                dataTree.push(node);
            });

            //生成树
            $('#knowledgeTree').treeview({
                color: "#428bca",
                data: dataTree
                // showCheckbox: true,
            });
            /*$('#knowledgeTree').treeview({
                color: "#428bca",
                data: dataTree,
                // showCheckbox: true,
                onNodeSelected: function (event, mdata) {

                    //先判断是单击还是双击
                    // judgeRightClick(event,mdata);
                    judgeDoubleClick(event,mdata);

                    /!*$("#areaText_input").val(mdata.text);
                    $("#areaText_input").attr("nodeId",mdata.id);
                    $("#hideDiv").hide();*!/
                }
            });*/
        }


        function judgeRightClick(event, mdata) {
            var btn = event.button;
            console.log("点击的按键为：" + btn)
            if (btn == 2) {
                doubleClick(mdata);
            } else {
                setSelectedNode($('#knowledgeTree'), mdata);
            }
        }

        /**
         * 判断是否是双击事件
         * @param event
         * @param mdata
         */
        function judgeDoubleClick(event, mdata) {

            console.log("上次点击id：" + lastSelectNodeId);
            console.log("当前点击id：" + mdata.id)

            if (lastSelectNodeId && lastSelectTime) {

                var clickTime = new Date().getTime();
                var time = clickTime - lastSelectTime;
                if (lastSelectNodeId == mdata.id && time < 500) {
                    //为双击
                    console.log("进入双击事件")
                    // setSelectedNode($('#knowledgeTree'),mdata);//为单击
                    doubleClick(mdata);
                } else {
                    setSelectedNode($('#knowledgeTree'), mdata);//为单击
                }
            }

            lastSelectTime = new Date().getTime();
            lastSelectNodeId = mdata.id;
            // doubleClick(mdata);
        }

        /**
         * 双击 选中该节点
         * @param mdata
         */
        function doubleClick(mdata) {
            $("#areaText_input").val(mdata.text);
            $("#areaText_input").attr("nodeId", mdata.id);
            $("#hideDiv").hide();
        }

        /**
         * 判断是否是子节点 是子节点就赋值给intup
         */
        function setSelectedNode(tree, mdata) {

            console.log("得到mdata的数据");
            console.log(JSON.stringify(mdata));

            //根据点击的父节点 得到子节点
            $.ajax({
                type: "POST",
                url: "area/getNearChildAreaById",
                data: "id=" + mdata.id,
                async: false,//取消异步
                dataType: "json",
                success: function (nodes) {

                    console.log("得到返回的子节点");
                    console.log(nodes);
                    judegNodeISParentNode(tree, nodes, mdata);
                }
            });
        }

        /**
         * 根据给给定的 nodes 显示界面
         */
        function judegNodeISParentNode(tree, nodes, mdata) {

            if (nodes.length > 1) {
                console.log("含有子节点,不可选中");

                $.each(nodes, function (index, node) {
                    if (null != nodes[index]) {

                        console.log("加载子节点" + JSON.stringify(nodes[index]));
                        tree.treeview("addNode", [mdata.nodeId, {node: {id: node.nodeId, text: node.nodeName}}]);
                    }
                });

                //展开节点
                tree.treeview("expandNode", mdata.nodeId);

            } else if (nodes.length = 1) {
                console.log("为子节点,可选中");

                /* $("#areaText_input").val(mdata.text);
                 $("#areaText_input").attr("nodeId",mdata.id);
                 $("#hideDiv").hide();*/
            }
        }

        /*---------------------------------------------模糊查询 组成树------------------------------------------------------*/

        /*绑定区域input  change 方法*/
        function getAreaChange() {

            var areaName = $('#areaText_input').val();
            console.log("得到输入框中数据:" + areaName);

            var tree = $('#knowledgeTree');

            if (areaName == null || areaName.trim() == "") {
                console.log("没有区域，回到初始化");
                // $("#hideDiv").hide();
                getTree(tree);
                return;

            }
            // 删除原有node
            // deleteChildrenNode(tree);
            tree.treeview('remove');

            //写查询方法
            $.ajax({
                type: "post",
                url: "area/getAreasByLikeAreaName",
                data: "condition=" + areaName,
                dataType: "json",
                success: function (data) {
                    console.log("得到模糊查询后的数据：" + JSON.stringify(data));

                    if (data.length > 0 && data[0] != "") {
                        console.log("初始化tree")
                        initaTree(tree, data);
                        $("#hideDiv").show();
                    } else {
                        $("#hideDiv").hide();
                    }
                }
            });
        }

        function hideAreaTree() {

            var areaName = $('#areaText_input').val();

            console.log("失去焦点后，区域的值" + areaName);

            if ($('#hideDiv li').is(":focus")) {
                console.log("区域选择框 得到焦点")
                // $("#hideDiv").hide();
            } else {
                // $("#hideDiv").hide();
            }

        }

        function selectArea() {

            var mdata = $('#knowledgeTree').treeview('getSelected')[0];

            if (mdata) {
                console.log("被选中的节点：" + JSON.stringify(mdata));

                $("#areaText_input").val(mdata.text);
                $("#areaText_input").attr("nodeId", mdata.id);
                setAddress(mdata.id);
                $("#hideDiv").hide();
            }
        }

        function setAddress(areaId) {

            if (areaId) {

                //写查询方法
                $.ajax({
                    type: "post",
                    url: "area/selectAreaById",
                    data: "id=" + areaId,
                    dataType: "json",
                    success: function (mpInfo) {
                        var addressList = mpInfo.address.split('/');

                        console.log("根据区域id：" + areaId + "：" + JSON.stringify(mpInfo));
                        console.log("得到区域地址：" + addressList);


                        //省市区
                        $("#address_area_input").citypicker("reset");
                        $("#address_area_input").citypicker("destroy");
                        $("#address_area_input").citypicker({
                            province: addressList[0],
                            city: addressList[1],
                            district: addressList[2]
                        });

                        // $('#address_area_input').attr("disabled", "disabled");
                        $("#address_area_input").citypicker("destroy");


                    }
                });
            }


        }

        /*----------------------------------------------基本方法 递归生成树结构 Node---------------------------------------*/

        function buildTree(parentNode, datas) {

            if (datas.childCount > 0) {
                console.log("进入复循环")

                for (var key in datas.nodeChildren) {//遍历总的json数据

                    var data = datas.nodeChildren[key];//得到单个子节点

                    var node = {text: data.nodeName, id: data.nodeId, nodes: [], selectable: true};//把data里的数据传入node
                    parentNode.nodes.push(node);//将node放入父节点

                    buildTree(node, data);//递归
                }
            }

            if (datas.childCount == 0) {
                parentNode.selectable = true;
                delete parentNode.nodes;
            }
        }

        /**
         * 删除全部子节点
         */
        function deleteChildrenNode(tree) {
            var nodeData = tree.treeview()[0];
            $('#knowledgeTree').treeview("deleteChildrenNode", nodeData.id);
        }

        /*function itemOnclick(obj) {

        }*/
