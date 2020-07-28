        $(function () {

            //1.初始化Table
            var oTable = new TableInit();
            oTable.Init();

            //2.初始化Button的点击事件
            var oButtonInit = new ButtonInit();
            oButtonInit.Init();

        });


        var TableInit = function () {
            var oTableInit = new Object();
            //初始化Table
            oTableInit.Init = function () {
                $('#tb_sub').bootstrapTable({
                    url: '/sub/getSubList',         //请求后台的URL（*）
                    method: 'get',                      //请求方式（*）
                    toolbar: '#sub_toolbar',                //工具按钮用哪个容器
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
                    height: 500,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
                    uniqueId: "id",                     //每一行的唯一标识，一般为主键列
                    showToggle: false,                    //是否显示详细视图和列表视图的切换按钮
                    cardView: false,                    //是否显示详细视图
                    detailView: false,                   //是否显示父子表
                    columns: [{
                        checkbox: true
                    }, {
                        field: 'id',
                        title: '订阅编号'
                    }, {
                        field: 'sendUrl',
                        title: '发送网址'
                    }, {
                        field: 'recieveUrl',
                        title: '接受网址'
                    }, {
                        field: 'state',
                        title: '订阅状态'
                    }, {
                        field: 'createTime',
                        title: '订阅时间'
                    }, {
                        field: 'operate',
                        title: '操作',
                        events: operateEvent,//事件
                        formatter: operateFormatter //自定义方法，添加操作按钮
                    }]
                });
            };

            window.operateEvent = {
                'click #sub_btn': function (e, value, row, index) {
                    var sub = {
                        sendUrl: row.sendUrl,
                        recieveUrl: row.recieveUrl
                    }
                    sub_url(sub);
                },
                'click #update_btn': function (e, value, row, index) {
                    updateSub(row);
                }
            };

            function operateFormatter(value, row, index) {//赋予的参数
                return [
                    '<button  type="button" id="sub_btn" class="btn btn-primary" >订阅</button> &nbsp;&nbsp;',
                    '<button  type="button" id="update_btn" class="btn btn-primary" >修改</button>'
                ].join('');
            }

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


        var ButtonInit = function () {
            var oInit = new Object();
            var postdata = {};

            oInit.Init = function () {
                $('#btn_add_sub').click(function () {

                    $('#area_sub_form input').val('');

                    $('#add_sub_model').modal("show");

                    $('#sub_submit').unbind("click");
                    $('#sub_submit').click(function () {
                        subUrl()
                    })
                })
            };
            return oInit;
        };

        function subUrl() {
                var sub = {
                    sendUrl: $("#sendUrl_input").val(),
                    recieveUrl: $("#recieveUrl_input").val()
                }
                subAjax("sub/addSubscibe",sub);

        }

        function subAjax(url,sub) {
            $.ajax({
                type: "post",
                url: url,
                data: "property=" + JSON.stringify(sub),
                dataType: "json",
                success: function (msg) {

                    if (msg) {
                        //先隐藏模态框
                        $('#add_sub_model').modal('hide');
                        alert(msg.description);
                    }
                }
            });
        }

        function updateSub(row) {
            $("#sendUrl_input").val(row.sendUrl);
            $("#recieveUrl_input").val(row.recieveUrl);
            $('#add_sub_model').modal("show");

            $('#sub_submit').unbind("click");
            $('#sub_submit').click(function () {
                updateAjax(row);
            })

        }
        
        function updateAjax(sub) {
            sub.sendUrl = $("#sendUrl_input").val();
            sub.recieveUrl = $("#recieveUrl_input").val()

            subAjax("sub/updateSubscibe",sub);
        }

