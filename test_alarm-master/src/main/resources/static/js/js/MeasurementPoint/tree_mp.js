var treeMeter = (function () {

                var my = {};

                var defaulMeterOption = {
                        bootstrap2: false,
                        showTags: true,
                        levels: 1,
                        data:null,
                        unique :true
                };

                my.initMeter = function () {

                    /*----------------------------------------------------设置高度------------------------------------------------------*/
                    var windowHeight = $(window).height();
                    $("#tree-mp-panel").height(windowHeight*0.90);
                    //设置树的滚动条的高度
                    $("#treebody").height($("#tree-area-panel").height()*0.90-$("#searchRegion").height());
                    //设置搜索框的宽度
                    $("#searchRegion").width($("#treeview").width());

                    //设置树的面板高度
                    $("#tree-mp-panel").height(windowHeight*0.90);
                    //设置树的滚动条的高度
                    $("#Meterbody").height($("#tree-mp-panel").height()*0.82-$("#searchMeter").height());

                    //设置搜索框的宽度
                    $("#searchMeter").width($("#Metertreeview").width());

                    /*----------------------------------------------------初始化控件------------------------------------------------------*/

                    var ScrollbarName="col-lg-2 .panel-body";
                    AddScrollbar(ScrollbarName);

                   /* var Customer="customerType";
                    var customerUrl="getCustomerType";
                    getAllSelectList(Customer,customerUrl);


                    var MeterType="meterType";
                    var meterUrl="getMeterType";

                    getAllSelectList(MeterType,meterUrl);*/

                    /**
                     *   用户类型的下拉框选择事件
                     * @param obj
                     */
                    my.customerChangesEvents = function  (obj) {
                        var customerValue = obj.options[obj.selectedIndex].value;
                        var meterValue=$('#meterType').val();
                        var txtValue=$.trim($('#txt_Meter').val());
                        var data=selectChangesEvents(customerValue,meterValue,txtValue);
                        initMeterTree(data);
                    }

                    /**
                     *   表计类型的下拉框选择事件
                     * @param obj
                     */
                    my.meterChangesEvents = function (obj) {
                        var meterValue = obj.options[obj.selectedIndex].value;
                        var customerValue=$('#customerType').val();
                        var txtValue=$.trim($('#txt_Meter').val());
                        var data=selectChangesEvents(customerValue,meterValue,txtValue);
                        initMeterTree(data);
                    }

                    /**
                     *   树的表计放大镜搜索查询
                     */
                    my.searchMeterByName = function () {
                        searchMeter();
                    }
                    /**
                     *   表计搜索输入框的enter键事件
                     * @param event
                     */
                    my.meterKeyDown = function (event) {
                        var e = event || window.event || arguments.callee.caller.arguments[0];
                        if (e && e.keyCode == 13) { // enter 键
                            searchMeter();
                        }
                    }

                    /**
                     *    撤销键 清空用户类型和表计类型 以及输入框中的值
                     *
                     */
                    my.EmptyingMeter = function () {
                        document.getElementById("customerType").options.selectedIndex = 0; //回到初始状态
                        $("#customerType").selectpicker('refresh');//对customerType这个下拉框进行重置刷新

                        document.getElementById("meterType").options.selectedIndex = 0; //回到初始状态
                        $("#meterType").selectpicker('refresh');//对meterType这个下拉框进行重置刷新
                        $('#txt_Meter').val("");
                    }

                    my.initMeterTree = function (datas,option) {



                        if(option){
                            $.extend(defaulMeterOption,option);
                        }

                        if(!datas){return;}

                        defaulMeterOption.data = datas;

                        //初始化区域树控件
                        $("#Metertreeview").empty();
                        $("#Metertreeview").treeview(defaulMeterOption);
                    };

                    my.buildingMeterTree = function (node) {
                        var data = [];
                        $.ajax({
                            type: "POST",
                            url: "meters/getMeterInfo",
                            data:"parameter="+BuildingJSON(node),
                            async : false,//取消异步
                            dataType: "json",
                            success: function(nodes){
                                walk(nodes,data);
                            }
                        });
                        return data;
                    }

                }

                /*------------------------------------------------------------------------------------------------------------------*/

                function BuildingJSON(node) {
                    var temp={
                        areaId:node.id
                    };
                    return JSON.stringify(temp);
                }

                /**
                 *  执行搜索符合条件的表计，先得到选择的用户类型和表计类型的值，如果为空，则只传入输入框中的值
                 */
                function searchMeter() {
                    var customerType=$('#customerType').val();
                    var meterValue=$('#meterType').val();
                    var txtValue=$.trim($('#txt_Meter').val());
                    var datas = selectChangesEvents(customerType,meterValue,txtValue);
                    my.initMeterTree(datas);
                }

                function  selectChangesEvents(customerType,meterValue,txtValue) {
                    var regionId="";
                    if(judgeSelected()){  //true 是选择了 false是没选
                        regionId=judgmentIsSelected ();//选择了区域 则获取区域ID
                    }
                    return vagueQueryMeter(customerType,meterValue,txtValue,regionId);//得到请求处理后的值 重新加载表计树
                }

                /**
                 *  判断是否选择区域
                 * @returns {boolean}
                 */
                function judgeSelected() {
                    var value=judgmentIsSelected ();
                    if(""!=value){
                        return true;
                    }
                    return false;
                }

                /**
                 *  获取选中的节点id 若没有选中，则默认返回顶层的第一个父节点
                 * @returns {*}
                 */
                function judgmentIsSelected () {
                    var select_node = $('#treeview').treeview('getSelected');//获得选中的节点

                    if(select_node[0]){
                        return select_node[0].id;
                    }
                    return "";//返回一个空字符串
                }

                /**
                 *  表计搜索输入框事件
                 * @param customerValue
                 * @param meterValue
                 * @param txtValue
                 * @param regionId
                 * @returns {Array}
                 */
                function vagueQueryMeter(customerType,meterValue,txtValue,regionId) {
                    var json=getSelectJsonData(customerType,meterValue,txtValue,regionId);
                    var flag = $.isEmptyObject(json);
                    var data = [];
                    if(!flag){
                        $.ajax({
                            type: 'post',
                            url: 'meters/getMeterInfo',
                            dataType: "Json",
                            async : false,//取消异步
                            data:"parameter="+JSON.stringify(json),
                            success: function (nodes) {
                                walk(nodes,data)
                            }
                        });
                    }
                    return data;
                }

                function getSelectJsonData(customerType,meterValue,txtValue,regionId) {
                    var  data = {};

                    if(""!=customerType&&null!=customerType){
                        data.customerType=customerType;        //暂时用不上
                    }
                    if(""!=regionId&&null!=regionId){
                        data.areaId=regionId;//区域id
                    }
                    if(""!=meterValue&&null!=meterValue){
                        data.meterValue=meterValue;             //暂时用不上
                    }
                    if(""!=txtValue&&null!=txtValue){
                        data.dataItemValue=txtValue;//输入框的值
                    }
                    return data;
                }

                function walk(nodes,data) {
                    if (!nodes) { return; }
                    $.each(nodes, function (id, node) {
                        var obj = {
                            id: node.nodeId,
                            text: node.nodeName
                        };
                        data.push(obj);
                    });
                }

                /**
                 *  下拉框的数据加载公共方法
                 * @param obj
                 * @param requestAddress
                 */
                function getAllSelectList(obj,requestAddress) {
                    $.ajax({
                        type: 'post',
                        url: requestAddress,
                        dataType: "Json",
                        success: function (data) {
                            $.each(data, function (i, n) {
                                $("#"+obj).append(" <option value=\"" + n.id+ "\">" + n.name + "</option>");
                            });
                            $("#"+obj).selectpicker('val', '');
                            $('.selectpicker').selectpicker('refresh');
                        }
                    });
                }

                /**
                 *  初始化滚动条
                 * @param ScrollbarName
                 *
                 */
                function AddScrollbar(ScrollbarName) {
                    //设置滚动条
                    $("."+ScrollbarName).mCustomScrollbar({
                        scrollButtons: {
                            enable: false,
                            scrollType: "continuous",
                            scrollSpeed: 20,
                            scrollAmount: 40
                        },
                        horizontalScroll: false
                    });
                }

                return my;

}());