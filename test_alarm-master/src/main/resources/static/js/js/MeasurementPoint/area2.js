$(document).ready(function () {
    area.init();
});

var area = (function () {

    var my = {};

    var events = [
        {
            name:"新增子节点",       //右键菜单项
            id:"#area_info_model",  //弹出框的id
            event:function (node) { //自定义实现方法
                addAreaModel(node);
            }
        },{
            name:"删除",
            id:"#del_area_model",
            event:function (node) {
                deleteAreaModel(node);
            }
        },{
            name:"修改",
            id:"#area_info_model",
            event:function (node) {
                updateAreaModel(node);
            }
        }

    ]

    var option = {
        url:"area/getNearChildAreaById",          //查询树的url
        arg:0,                                    //初始化树时的传参
        argName:"id",                             //生成树传参的参数名
        tree:"#areaTree",                                //生成树的id
        events:events                                    //绑定事件list

    }

    /*--------------------------------------------------初始化----------------------------------------------------*/
    my.init = function () {
        treeRightMenu.init(option);

        //开启input验证
        judegFormCommon($("#areaInfo_form"), '#submit_area');

        //重置 表单验证
        $('#area_info_model').on('hidden.bs.modal', function () {
            $("#areaInfo_form").data('bootstrapValidator').resetForm();
        });

        //绑定新增根节点
        $("#add_root_zone_button").click(function () {
            var area = {
                nodeId: null,
                id: 0,
                name: 0
            };
            addAreaModel(area);
        });

        //绑定新增管理员
        $("#add_manager_button").click(function () {

            $("#area_manager_model").find("input").val("");
            $("#area_manager_model").find("textarea").val("");
            $("#area_manager_model").modal("show");

        });
        //给确定按键 绑定新增方法
        $("#manager_submit_area").click(function () {
            addManager();
        });
    }





    /*--------------------------------------------------区域私有方法---------------------------------------------------------*/

    /**
     * 新增区域
     * @param area
     */
    function addAreaModel(area) {

        //将所有输入框的值清空
        $('#areaInfo_form').find("input").val("");//清空原值，去除干扰
        $('#areaInfo_form').find("textarea").val("");//清空原值，去除干扰
        $("#address_input").citypicker("reset");

        $('#mg_toolbar').hide();//新增时 不需要表格的新增删除按钮

        //1 将得到的根区域信息 填入下拉框
        $("#parentArea_input").val(area.name);
        $("#parentArea_input").attr("disabled", "disabled");

        $("#area_info_model").modal("show");

        $("#submit_area").unbind('click');
        //2 给确定绑定事件，提交
        $("#submit_area").click(function () {
            $("#areaInfo_form").bootstrapValidator('validate');
            if ($('#areaInfo_form').data('bootstrapValidator').isValid()) {//获取验证结果，如果成功，执行下面代码
                addAjax(area);
            }
        });


        //初始化表格
        //1.初始化Table
        var oTable = new TableInitManager($('#tb_manager'), '#mg_toolbar', 'manager/getAllManager');
        oTable.Init();

    }

    /**
     * 删除区域
     * @param area
     */
    function deleteAreaModel(area) {

        console.log("要删除的区域信息：" + JSON.stringify(area));

        //1 根据内容更改提示框信息

        $("#del_area_model").modal("show");
        //2 绑定确定事件
        //删除事件
        $("#submit_delete").click(function () {
            console.log("绑定删除事件");
            deleteAjax(area);
        });
    }

    /**
     * 修改区域
     * @param area
     */
    function updateAreaModel(area) {

        $('#mg_toolbar').show();

        //1.初始化Table
        var oTable = new TableInitManager($('#tb_manager'), '#mg_toolbar',  'manager/getManagerByArea?property=' + area.id);
        oTable.Init();

        //2.初始化Button的点击事件
        var oButtonInit = new ButtonInit(area);
        oButtonInit.Init();


        getAreaInfo(area);

        //1 先根据id 得到该区域的相关信息 并且填入输入框
        //2.初始化Button的点击事件

        $("#area_info_model").modal("show");
        $("#submit_area").unbind('click');
        //2 绑定确定事件
        $("#submit_area").click(function () {
            $("#areaInfo_form").bootstrapValidator('validate');
            if ($('#areaInfo_form').data('bootstrapValidator').isValid()) {//获取验证结果，如果成功，执行下面代码

                var parentId = $("#parentArea_input").attr("parentId");
                changeAjax(parentId, area);
            }
        });

    }

    /**
     * 新增区域提交
     */
    function addAjax(area) {
        //1 先验证输入框
        var areaInfo = getAreaInfFromHtml(area, "add");

        if (areaInfo) {
            console.log("新增输入框的数据" + JSON.stringify(areaInfo));

            /*if (addressEquestByParent(area.id, areaInfo) == false) {
                showAreaTip("子区域与父区域的地址 的 省 和市必须一致，不一致不能提交")
                return null;
            }
*/
            // judgeAddInput(areaInfo);

            //2 合格后提交

            $.ajax({
                type: "post",
                url: "area/addArea",
                data: "areaInfo=" + JSON.stringify(areaInfo),
                dataType: "json",
                success: function (msg) {
                    console.log("新增区域返回数据：" + JSON.stringify(msg));

                    if (msg) {

                        showAreaTip("新增区域成功");

                        //先隐藏模态框
                        $('#area_info_model').modal('hide');

                        var tree = $('#areaTree');

                        /*$("#areaTree").treeview("addNode", [area.nodeId,{ node: {id:msg.nodeId,  text: msg.nodeName } }]);
                        //展开节点
                        $("#areaTree").treeview('expandNode', area.nodeId);*/
                        //直接再查询一次

                        if (area.nodeId) {
                            var parentNode = tree.treeview('getNode', area.nodeId);
                            if (parentNode.state.expanded) {//已展开
                                console.log("已展开");
                                tree.treeview("addNode", [area.nodeId, {node: {id: msg.nodeId, text: msg.nodeName}}]);
                            } else {//未展开
                                console.log("未展开");
                                //先展开
                                loadChildNode(parentNode, tree);//加载子节点
                                tree.treeview('expandNode', parentNode.nodeId);
                                parentNode.state.selected = false;
                            }

                        } else {
                            tree.treeview("addNode", [-1, {node: {id: msg.nodeId, text: msg.nodeName}}]);
                        }

                        $("#submit_area").unbind("click");//取消绑定事件
                    } else {
                        showAreaTip("新增区域失败");
                    }


                }
            });
        }

    }

    /**
     * 删除区域提交
     * @param id
     */
    function deleteAjax(area) {
        //1 调用后台ajax，得到成功 或者失败的结果
        $.ajax({
            type: "post",
            url: "area/deleteArea",
            data: "areaInfo=" + area.id,
            dataType: "json",
            success: function (msg) {

                if (msg) {
                    //先隐藏模态框
                    $('#del_area_model').modal('hide');

                    console.log("删除区域返回数据：" + JSON.stringify(msg));

                    showAreaTip(msg.description);
                    if (msg.code == 200) {

                        console.log("删除节点：" + JSON.stringify(area.nodeId));
                        $("#areaTree").treeview("deleteNode", [area.nodeId]);
                    }

                    $("#submit_delete").unbind("click");//取消绑定事件
                }


            }

        });
        //2 拿到结果后 跳出提示框 （提示该区域下有绑定设备，无法删除）
    }

    /**
     * 更改区域提交
     */
    function changeAjax(parentId, area) {

        var areaInfo = getAreaInfFromHtml(area, "updata");

        if (areaInfo) {
            areaInfo.areaId = area.id;
            // areaInfo.parentId = $('#parentArea_input').attr("parentId");

           /* if (addressEquestByParent(parentId, areaInfo) == false) {
                showAreaTip("子区域与父区域的地址 的 省 和市必须一致，不一致不能提交");
                return null;
            }*/

            console.log("修改输入框的数据" + JSON.stringify(areaInfo));

            //
            $.ajax({
                type: "post",
                url: "area/updateArea",
                data: "areaInfo=" + JSON.stringify(areaInfo),
                dataType: "json",
                success: function (msg) {

                    if (msg) {
                        console.log("修改区域返回数据：" + JSON.stringify(msg));

                        showAreaTip(msg.description);

                        $("#area_info_model").modal("hide");
                        $("#submit_area").unbind("click");//取消绑定事件

                        var tree = $('#areaTree');

                        //刷新节点
                        // var node = tree.treeview('getNode', area.nodeId);
                        // var newNode = {id: area.id, text: areaInfo.areaName}
                        // tree.treeview("updateNode", [node, newNode, { silent: true } ]);
                        tree.treeview("editNode", [area.nodeId, {text: areaInfo.areaName}]);
                    }
                }
            });
        }

    }

    /**
     * 根据区域id 得到区域信息 填充给进页面
     */
    function getAreaInfo(area) {
        $.ajax({
            type: "post",
            url: "area/selectAreaById",
            data: "id=" + area.id,
            dataType: "json",
            async: false,
            success: function (areaInfo) {
                console.log("根据id查询区域返回数据：" + JSON.stringify(areaInfo));

                //给页面赋值
                $("#areaName_input").val(areaInfo.areaName);
                $("#areaNum_input").val(areaInfo.areaNo);
                $("#telPhone_input").val(areaInfo.telphone);
                $("#remark_textarea").val(areaInfo.remark);
                $("#parentArea_input").val(areaInfo.parentName);
                $("#parentArea_input").attr("parentId", areaInfo.parentId);
                $("#parentArea_input").attr("disabled", "disabled");
                if(null!=areaInfo.areaLng&&""!=areaInfo.areaLng||null!=areaInfo.areaLat&&""!=areaInfo.areaLat){
                    $("#coordinate").val(areaInfo.areaLng+","+areaInfo.areaLat);
                }
                console.log("查询到的区域的地址：");
                console.log(areaInfo.address);
                var addressStrs = areaInfo.address.split('/');
                // $("#address_input").val(addressStrs[0]);
                console.log(addressStrs);
                // $("#address_input").val("贵州省/六盘水市/水城县");
                $("#regin_input").val(addressStrs[3]);

                $("#address_input").citypicker("reset");
                $("#address_input").citypicker("destroy");
                $("#address_input").citypicker({
                    province: addressStrs[0],
                    city: addressStrs[1],
                    district: addressStrs[2]
                });

            }

        });
    }

    /**
     * 字符串判空
     * @param str
     * @returns {boolean}
     */
    function isEmpty(str) {
        if (str == null || str == "") {
            return true;
        }
        return false;
    }

    function getAreaInfFromHtml(area, type) {

        var areaInfo = {
            areaName: null,  //区域名称
            areaNo: null,    //区域编号
            parentId: null,  //父节点id
            telphone: null,  //电话
            address: null,   //地址
            remark: null,     //备注
            areaLng:null,
            areaLat:null
        };

        var coordinate=baiduMaps.splitString($.trim($("#coordinate").val()),",");
        areaInfo.areaName = $("#areaName_input").val();
        areaInfo.areaNo = $("#areaNum_input").val();
        areaInfo.parentId = area.id;
        areaInfo.telphone = $("#telPhone_input").val();
        areaInfo.address = $("#address_input").val() + "/" + $("#regin_input").val();
        areaInfo.remark = $("#remark_textarea").val();

        if(null!=coordinate&&""!=coordinate){
            areaInfo.areaLng=coordinate[0];
            areaInfo.areaLat=coordinate[1];
        }
        if ($("#address_input").val() == null || $("#address_input").val() == "") {
            alert("请输入地址");
            return null;
        }

        if (type == "add") {
            console.log("在" + type + "时 ，获取页面信息");
            areaInfo.manager = getManager($('#tb_manager'));
            if (areaInfo.manager == null) {
                alert("请选择管理员");
                return null;
            }
        }

        return areaInfo
    }





    /*---------------------------------------------------------管理员私有方法--------------------------------------------*/
    function addManager() {

        var areaManager = {
            managerId: null,  //管理员id
            managerName: null,    //管理员姓名
            phoneNumber: null,  //管理员电话
            remark: null,  //备注
        };

        //获取界面信息
        areaManager.managerName = $("#managerName_input").val();
        areaManager.phoneNumber = $("#manager_telPhone_input").val();
        areaManager.remark = $("#manager_remark_textarea").val();

        $.ajax({
            type: "post",
            url: "manager/addManager",
            data: "property=" + JSON.stringify(areaManager),
            dataType: "json",
            success: function (msg) {
                if (msg) {
                    if (msg.code == 200) {
                        showAreaTip("新增管理员，成功")
                        $("#area_manager_model").modal("hide");
                    } else {
                        showAreaTip("新增管理员，失败")
                    }
                } else {
                    showAreaTip("新增管理员，失败")
                }

            }

        });

    }

    /*----------------------------------管理员table--------------------------------------*/

    var TableInitManager = function (element, toolbarText, urlText) {

        element.bootstrapTable('destroy');//先销毁表格

        console.log("初始化管理员")
        var oTableInit = new Object();
        //初始化Table
        oTableInit.Init = function () {
            element.bootstrapTable({
                url: urlText,         //请求后台的URL（*）
                method: 'post',                      //请求方式（*）
                toolbar: toolbarText,                //工具按钮用哪个容器
                striped: true,                      //是否显示行间隔色
                cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
                pagination: false,                   //是否显示分页（*）
                sortable: false,                     //是否启用排序
                sortOrder: "asc",                   //排序方式
                // queryParams: oTableInit.queryParams,//传递参数（*）
                sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
                pageNumber: 1,                       //初始化加载第一页，默认第一页
                pageSize: 'ALL',                       //每页的记录行数（*）
                pageList: [10, 25, 50, 100, 'ALL'],        //可供选择的每页的行数（*）
                search: true,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
                strictSearch: true,
                showColumns: true,                  //是否显示所有的列
                showRefresh: true,                  //是否显示刷新按钮
                minimumCountColumns: 2,             //最少允许的列数
                clickToSelect: true,                //是否启用点击选中行
                height: 200,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
                uniqueId: "managerId",                     //每一行的唯一标识，一般为主键列
                showToggle: false,                    //是否显示详细视图和列表视图的切换按钮
                cardView: false,                    //是否显示详细视图
                detailView: false,                   //是否显示父子表
                columns: [{
                    checkbox: true
                }, {
                    field: 'managerId',
                    title: '管理员编号'
                }, {
                    field: 'managerName',
                    title: '管理员姓名'
                }, {
                    field: 'phoneNumber',
                    title: '联系电话'
                }, {
                    field: 'remark',
                    title: '备注'
                }]
            });
        };

        //得到查询的参数
        oTableInit.queryParams = function (params) {
            var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
                limit: params.limit,   //页面大小
                offset: params.offset,  //页码

            };
            return temp;
        };
        return oTableInit;
    };

    /* 管理员 新增 删除 方法绑定*/
    var ButtonInit = function (area) {
        var oInit = new Object();
        var postdata = {};

        $("#btn_add_mg").unbind('click');
        $("#btn_delete_mg").unbind('click');

        oInit.Init = function () {
            $("#btn_add_mg").click(function () {
                addAreaManager(area.id)
            });
            $("#btn_delete_mg").click(function () {
                deleteAreaManager(area.id)
            });
        };

        return oInit;
    };

    /**
     * 新增 某区域下的管理员
     */
    function addAreaManager(areaId) {

        // $("#tb_area_manager").bootstrapTable('destroy');
        var oTable = new TableInitManager($("#tb_area_manager"), '#area_mg_toolbar',
             'manager/getManagerExceptArea?property=' + areaId);

        oTable.Init();
        $("#add_area_manager_model").modal("show");

        $("#btn_add_area_mg").unbind("click");
        $("#btn_cancel_area_mg").unbind("click");


        $("#btn_add_area_mg").click(function () {
            addAreaManagerAjax(areaId);
        });
        $("#btn_cancel_area_mg").click(function () {
            $("#add_area_manager_model").modal("hide");
        });

    }

    /**
     * 修改中 新增页面 新增某区域的管理员
     * @param areaId
     */
    function addAreaManagerAjax(areaId) {

        var managerId = getManager($("#tb_area_manager"));

        $.ajax({
            type: "post",
            url: "manager/addAreaManagerMap",
            data: "areaId=" + areaId + "&managerId=" + JSON.stringify(managerId),
            dataType: "json",
            success: function (msg) {
                if (msg) {
                    if (msg.code == 200) {
                        showAreaTip("新增区域下管理员，成功");

                        $("#add_area_manager_model").modal("hide");

                        $('#tb_manager').bootstrapTable(
                            "refresh",
                            {
                                url: 'manager/getManagerByArea?property=' + areaId
                            }
                        );

                    } else {
                        showAreaTip("新增区域下管理员，失败")
                    }
                } else {
                    showAreaTip("新增区域下管理员，失败")
                }
            }
        });
    }

    /**
     * 删除 某区域下的管理员
     */
    function deleteAreaManager(areaId) {

        var managerId = getManager($('#tb_manager'));

        $.ajax({
            type: "post",
            url: "manager/delectAreadManager",
            data: "areaId=" + areaId + "&managerId=" + JSON.stringify(managerId),
            dataType: "json",
            success: function (msg) {
                if (msg) {
                    if (msg.code == 200) {
                        showAreaTip("删除区域下管理员，成功");

                        $('#tb_manager').bootstrapTable(
                            "refresh",
                            {
                                url: 'manager/getManagerByArea?property=' + areaId
                            }
                        );

                    } else {
                        showAreaTip("删除区域下管理员，失败");
                    }
                } else {
                    showAreaTip("删除区域下管理员，失败")
                }
            }
        });
    }

    function showAreaTip(message) {
        $("#area_message").text(message);
        $("#imfo_tip_area").modal('show');
    }

    function getManager(element) {

        var manager = [];

        var selectManagerList = element.bootstrapTable("getSelections");

        console.log("得到表格中被选中数据" + JSON.stringify(selectManagerList));

        if (selectManagerList.length < 1 || selectManagerList[0] == "") {

            return null;
        }

        $(selectManagerList).each(function (i, n) {
            manager.push(n.managerId);
        })


        return manager

    }

/*--------------------------------------------------------------返回----------------------------------------------------*/

    return my;
    
}());