        var addressArray = ['mpProvince', 'mpCity', 'mpDistrict'];
        var DEV_INTEM_CONDTION = "表钢号";
        var SHOW_MODEL_TYPE = null;
        var TYPE_OF_DEV = 1;

        /*==================================================对外接口方法==================================================*/

        /* =========================新增表记===========================
        *  无参数
        *  返回 true 成功创建 false 创建失败
        * */
        function addDev() {

            $("#submit_dev").unbind("click");//取消绑定事件

            SHOW_MODEL_TYPE = null;//清空type值 消除原值影响

            initChoiceDevModel();//初始化 设备选择弹框

            if (SHOW_MODEL_TYPE == 1) {
                //仅添加表记
                $('#submit_dev').click(function () {

                    $("#devInfo_form").bootstrapValidator('validate');
                    if ($('#devInfo_form').data('bootstrapValidator').isValid()) {//获取验证结果，如果成功，执行下面代码
                        console.log("执行方法");
                        addsubmitInfoDev();
                        $("#setUpMpModal").modal('hide');

                    }
                });
            } else if (SHOW_MODEL_TYPE == 2) {
                //先添加设备 再添加表记
                $('#submit_dev').click(function () {
                    $("#devInfo_form").bootstrapValidator('validate');
                    if ($('#devInfo_form').data('bootstrapValidator').isValid()) {//获取验证结果，如果成功，执行下面代码
                        addSubmitInfoDevVersion();
                        $("#setUpMpModal").modal('hide');
                        $("#tb_departments").bootstrapTable('refresh');
                    }
                });
            }

        }

        /*========================修改表记===========================
        * 有参数，表记id
        * 返回 true修改成功 false修改失败*/
        function changeDev(mpId) {
            $("#submit_dev").unbind("click");//取消绑定事件

            console.log("需要修改的表记id：" + JSON.stringify(mpId));

            //ajax先查询到 mpId对应的设备id

            $.ajax({
                type: "post",
                url: "mp/getMpInfo",
                data: "property=" + mpId,
                dataType: "json",
                success: function (mpInfo) {

                    console.log("得到表记信息" + JSON.stringify(mpInfo));
                    if (mpInfo) {

                        //1 生成修改界面 插入方法，将查询到的值赋给表记
                        initMpInfoModel(TYPE_OF_DEV, mpInfo.devId, mpInfo,mpInfo.customerType);//更改方法，默认为表记已经有绑定的设备

                        //给确定按钮绑定方法
                        $('#submit_dev').click(function () {
                            $("#devInfo_form").bootstrapValidator('validate');
                            if ($('#devInfo_form').data('bootstrapValidator').isValid()) {//获取验证结果，如果成功，执行下面代码
                                changeDevSubmitInfo(mpId);//修改表记的ajax
                                $("#setUpMpModal").modal('hide');
                                $("#tb_departments").bootstrapTable('refresh');

                            }
                        });

                        if (mpInfo != null) {
                            //表记名
                            $('#mpName_input').val(mpInfo.mpName);
                            $('#mpName_input').attr('devId', changeEmputyStr(mpInfo.devId));
                            // $('#mpName_input').attr("disabled", true);
                            // 给界面填充表记信息
                            setMpInfoToHtml(mpInfo);
                        }

                        $("#dev_info").modal('show');//展示模态框
                    }else {
                        showDevTip("未查询到该表记数据，无法进行更新操作");
                    }
                }
            });
        }

        /*============================换表=========================
        *有参数 更换的表记id
        * 返回值 true修改成功 false修改失败
        * */
        function changMp(mpId) {

            $("#submit_dev").unbind("click");//取消绑定事件
            $("#nextTip").unbind("click");//取消绑定事件

            SHOW_MODEL_TYPE = null;//清空type值 消除原值影响

            // 查询表记信息，填写信息
            $.ajax({
                type: "post",
                url: "mp/getMpInfo",
                data: "property=" + mpId,
                dataType: "json",
                success: function (mpInfo) {

                    console.log("得到表记信息" + JSON.stringify(mpInfo));

                    if (mpInfo) {
                        initChoiceDevModel();//初始化model
                        // 给界面填充表记信息

                        $("#nextTip").unbind('click');
                        $("#nextTip").click(function () {
                            showMpInfo(mpInfo);
                        });

                        if (SHOW_MODEL_TYPE == 1) {
                            //仅添加表记
                            $('#submit_dev').click(function () {
                                $("#devInfo_form").bootstrapValidator('validate');
                                if ($('#devInfo_form').data('bootstrapValidator').isValid()) {//获取验证结果，如果成功，执行下面代码
                                    changeMpSubmitInfoDev(mpId);
                                    $("#setUpMpModal").modal('hide');
                                    $("#tb_departments").bootstrapTable('refresh');

                                }
                            });
                        } else if (SHOW_MODEL_TYPE == 2) {
                            //先添加设备 再添加表记
                            $('#submit_dev').click(function () {
                                $("#devInfo_form").bootstrapValidator('validate');
                                if ($('#devInfo_form').data('bootstrapValidator').isValid()) {//获取验证结果，如果成功，执行下面代码
                                    changeMpSubmitInfoDevVersion(mpId);
                                    $("#setUpMpModal").modal('hide');
                                    $("#tb_departments").bootstrapTable('refresh');

                                }
                            });
                        }


                    }else {
                    }
                }
            });

        }

        /**
         * ===废弃===
         */
        function discardMp(mpId) {

            $.ajax({
                type: "POST",
                url: "mp/discardMpInfo",
                dataType: "json",
                data: "property=" + mpId,
                success: function (msg) {

                    if (msg) {
                        if (msg.code == 200) {

                            $('#delcfmOverhaul').modal('hide');
                            $("#deleteHaulId").val("");
                            $("#tb_departments").bootstrapTable('refresh');

                        } else {
                            showDevTip("废弃失败");
                        }
                    }else {
                        showDevTip("未查询到该表记数据，无法进行废弃操作");
                    }

                }
            });

        }


        /**
         * ===批量废弃===
         */
        function BatchDiscardMp(mpIdList) {

            console.log("批量废弃的list");
            console.log(mpIdList);

            $.ajax({
                type: "POST",
                url: "mp/batchDiscardMpInfo",
                dataType: "json",
                data: "property=" + JSON.stringify(mpIdList),
                success: function (msg) {

                    if (msg) {
                        if (msg.code == 200) {

                            $('#delcfmOverhaul').modal('hide');
                            $("#deleteHaulId").val("");
                            $("#tb_departments").bootstrapTable('refresh');

                        } else {
                            showDevTip("批量废弃失败");
                        }
                    }
                }
            });

        }


        /*===================================================内部实现方法===========================================*/

        /*======================生成 选择设备（设备类型） 模态框==========================*/
        /**
         * 初始化 选择设备界面
         */
        function initChoiceDevModel() {

            $('#setUp_select').val("");

            $.ajax({
                type: "post",
                url: "mp/judgeIfExistDevNoMap",
                data: "",
                dataType: "json",
                async: false,
                success: function (msg) {
                    /*返回的数据为 设备信息，包括设备类型和设备型号具体信息*/
                    console.log("得到设备信息" + JSON.stringify(msg));

                    if (msg) {
                        SHOW_MODEL_TYPE = msg.type;
                        showSetUpModel(msg);//展示 选择设备界面
                    }
                }
            });

        }

        /*  展示安装表记 页面*/
        function showSetUpModel(dataJson) {

            if (dataJson.type == 1) {//有未绑定的设备
                showDevModel()
            } else if (dataJson.type == 2) {//没有未绑定的设备，选择设备型号
                showDevVersionModel()
            }

        }

        /* 更改 选择模态框信息，为设备*/
        function showDevModel() {
            $("#setUpMpModal h4").text("选择设备：");
            $("#setUpMpModal h4").val(1);
            $("#select_dev label").text("设备：");

            $("#setUpMpModal").modal('show');
            select2Ajax($("#setUp_select"), "mp/selectDevInfoLike", "请输入表钢号或IMEI号（必填）", false);
        }

        /* 更改 选择模态框信息，为设备型号*/
        function showDevVersionModel() {

            console.log("选择设备型号")

            $("#setUpMpModal h4").text("选择设备型号：");
            $("#setUpMpModal h4").val(2);
            $("#select_dev label").text("设备型号：");

            $("#setUpMpModal").modal('show');
            select2Ajax($("#setUp_select"), "mp/selectDevVersionLike", "请输入设备名称（必填）", false);

        }

        /* 动态填充 设备（设备型号） 信息*/
        function setSelectModelData(condition, data) {

            console.log("插入设备数据");
            console.log(data);
            // $("#setUp_select").empty();

            $("#setUp_select").empty();

            if (data) {

                $(data).each(function (i, n) {

                    $("#setUp_select").append("<option id='" + n.id + "' value = '" + n.name + "'>" + n.name + "&#40;" + n[condition] + "&#41;</option>");

                })
                $('.selectpicker').selectpicker('refresh');//填充完后需要刷新
            }

        }

        /*=========================================生成 具体表记信息填写 模态框========================================*/

        /* 展示 表记信息页面（填写信息）
        *  直接绑定在 setUpMpModal模态框 的 nextTip 按键上
        * */
        function showMpInfo(mpInfo) {

            //得到选中的设备（设备型号）id 和 name
            var findOption = $('#setUp_select').select2("data")[0];

            if(findOption == null){
                return;
            }

            var id = findOption.id;
            var devName = findOption.name;

            //得到用户类型
            var customerType = $('#mp_user_type option:selected').val();

            console.log("选择框的id:" + JSON.stringify(id) + ",name:" + JSON.stringify(devName));
            console.log("用户类型选择框的customerType:" + JSON.stringify(customerType));

            //判断是否选取了数据，没有不能进行下一步
            if (id == null || id.length < 1 || customerType == "" || customerType == null) {
                console.log("没有选取设备，无法进入下一步");
                return;
            }

            //看是设备还是设备型号
            var type = $("#setUpMpModal h4").val();

            console.log(type);

            initMpInfoModel(type, id, mpInfo,customerType);//初始化具体信息框

            if (mpInfo != null) {
                // 给界面填充表记信息
                setMpInfoToHtml(mpInfo);
            }

            $("#setUpMpModal").modal('hide');
            $("#dev_info").modal('show');

        }

        /*
        初始化 表记信息的模态框（公用方法）
        * 参数，设备
        * */
        function initMpInfoModel(type, id, mpInfo,customerType) {


            $('#devInfo').empty();//将选择框内容制空，避免原数据的影响
            $('#devInfo_form').find("input").val("");//清空原值，去除干扰
            $('#devInfo_form').find("textarea").val("");//清空原值，去除干扰

            $('#mp_user_type').val(customerType);

            //判断type
            if (type == 1) {    //设备
                showDevInfo(id,customerType);
            } else if (type == 2) {     //设备型号
                showDevVersionInfo(id,customerType);
            }

            /*重新导入js，实现省市区 和 下拉树功能*/
            $.getScript('js/dist-picker/city-picker.js');
            $.getScript('js/bootstrap-treeview/bootstrap-treeview(2).js');
            $.getScript('js/js/MeasurementPoint/setup-mp-area.js');
            $.getScript('js/js/MeasurementPoint/validator-form.js');

            judegFormCommon($("#devInfo_form"), '#submit_dev');//增加验证

            $('#dev_info').unbind('hidden.bs.modal');

            //重置 表单验证
            $('#dev_info').on('hidden.bs.modal', function() {
                $("#devInfo_form").data('bootstrapValidator').resetForm();
            });
        }

        /**
         * 展示 选择设备 模态框
         * @param devId
         */
        function showDevInfo(devId,customerType) {

            console.log("选择的设备id为" + devId);

            //url得到设备的名称 和 密度

            $.ajax({
                type: "post",
                url: "mp/selectDevInfo",
                data: "property=" + devId,
                dataType: "json",
                async: false,
                success: function (dev) {
                    console.log("返回设备的信息：" + JSON.stringify(dev));

                    if (dev) {
                        //添加设备名称
                        $('#mpName_input').val(dev.deviceName);
                        $('#mpName_input').attr('devId', devId);
                        // $('#mpName_input').attr("disabled", "disabled");

                        jugdeDensity(customerType);
                    }
                }
            });


        }

        /**
         * 展示 选择设备型号 模态框
         * @param devVersionId
         */
        function showDevVersionInfo(devVersionId,customerType) {

            console.log("选择的设备id为" + devVersionId);
            //url得到是否为工业表和数据项，参数为设备型号id

            $.ajax({
                type: "post",
                url: "mp/selectDevVersion",
                data: "property=" + devVersionId,
                dataType: "json",
                async: false,
                success: function (devVersionInfo) {
                    console.log("返回设备型号的信息：" + JSON.stringify(devVersionInfo));
                    $('#devInfo').empty();

                    if (devVersionInfo) {
                        $('#mpName_input').attr('devVersionId', devVersionInfo.devVersionId);
                        $('#mpName_input').attr('typeId', devVersionInfo.typeId);

                        $(devVersionInfo.item).each(function (i, n) {

                            var itemHtml = '<div class=" col-md-4"> \n' +
                                '                                    <div class="col-md-3">\n' +
                                '                                        <label class="form-label" style="padding-bottom:10px; ">' + n.name + '</label>\n' +
                                '                                    </div>\n' +
                                '                                    <div class="col-md-9">\n' +
                                '                                        <input  type="text"  class="form-control itemInput" id="' + n.id + '" code="' + n.code + '">\n' +
                                '                                    </div>\n' +
                                '                                </div>';

                            $('#devInfo').append(itemHtml);
                        })

                        jugdeDensity(customerType);
                    }

                }
            });

        }

        /* 判断 密度
         * 参数 密度
         * 根据工业还是民用表，显示不同页面
         * 工业，显示经纬度，不显示地址
         * 民用，不显示经纬度，显示地址
          * */
        function jugdeDensity(density) {

            var densityHtml = '<div class=" col-md-4" id="north"> \n' +
                '                                    <div class="col-md-3">\n' +
                '                                        <label class="form-label" style="padding-bottom:10px; ">经度</label>\n' +
                '                                    </div>\n' +
                '                                    <div class="col-md-9">\n' +
                '                                        <input id="mpLng_input"   type="text" class="form-control"  >\n' +
                '                                    </div>\n' +
                '           </div>' +
                '<div class=" col-md-4" id="west"> \n' +
                '                                    <div class="col-md-3">\n' +
                '                                        <label class="form-label" style="padding-bottom:10px; ">纬度</label>\n' +
                '                                    </div>\n' +
                '                                    <div class="col-md-9">\n' +
                '                                        <input id="mpLat_input"    type="text" class="form-control" >\n' +
                '                                    </div>\n' +
                '           </div>';

            console.log(density);

            if (density == "1" || density == "2") {
                $('#devInfo').append(densityHtml);
                // $('#address_panel').hide();
                $('#address_panel').attr("style","display:none;")
            } else if(density == "3"){
                // $('#address_panel').show();
                $('#address_panel').attr("style","display:block;border-color: #FFFFFF");
            }
        }

        /*===============================================提交信息=======================================================*/
        /**
         * 新增 表记 绑定设备
         */
        function addsubmitInfoDev() {

            var addMpInfo = getMpInfoFromHtml();

            if(!judegTotalMp(addMpInfo)){
                showDevTip("请选择是否为总表");
                return;
            }

            if (addMpInfo) {
                //新增的状态为 1
                addMpInfo.state = 1;
                addMpInfo.devId = changeEmputyStr($('#mpName_input').attr('devId'));
                addMpInfo.mpId = 0;//防止解析后台解析null 报错

                console.log("新增的表记信息为：" + JSON.stringify(addMpInfo));
                console.log(addMpInfo);

                $.ajax({
                    type: "post",
                    url: "mp/addMpInfoByDev",
                    data: "property=" + JSON.stringify(addMpInfo),
                    dataType: "json",
                    success: function (msg) {
                        if (msg) {
                            showDevTip(msg.description);
                            $('#dev_info').modal("hide");
                            $("#tb_departments").bootstrapTable('refresh');
                        }
                    }
                });
            }


        }

        /**
         * 新增表记 绑定设备型号 新增设备
         */
        function addSubmitInfoDevVersion() {
            var addDevInfo = getMpInfoFromHtml();

            if(!judegTotalMp(addDevInfo)){
                showDevTip("请选择是否为总表");
                return;
            }

            if (addDevInfo) {
                addDevInfo.state = 1;
                addDevInfo.devVersionId = changeEmputyStr($('#mpName_input').attr('devVersionId'));
                addDevInfo.typeId = changeEmputyStr($('#mpName_input').attr('typeId'));
                addDevInfo.mpId = 0;

                var items = getItemsFromHtml();

                var addMpInfo = {
                    data: addDevInfo,
                    item: items
                }

                console.log("新增的表记(设备)信息为：" + JSON.stringify(addMpInfo));
                console.log(addMpInfo);

                $.ajax({
                    type: "post",
                    url: "mp/addMpInfoByDevVersion",
                    data: "property=" + JSON.stringify(addMpInfo),
                    dataType: "json",
                    success: function (msg) {
                        if (msg) {
                            /*if (msg.code == 200) {
                                showDevTip("新增成功");
                            } else {
                                showDevTip("新增失败");
                            }*/
                            showDevTip(msg.discription);
                            $('#dev_info').modal("hide");
                        }
                    }
                });
            }

        }

        /**
         * 修改表记
         */
        function changeDevSubmitInfo(mpId) {
            var updateInfo = getMpInfoFromHtml();

            if(!judegTotalMp(updateInfo)){
                showDevTip("请选择是否为总表");
                return;
            }


            if (updateInfo) {
                //修改状态未定
                updateInfo.state = 1;
                updateInfo.devId = changeEmputyStr($('#mpName_input').attr('devId'));
                updateInfo.mpId = mpId;

                console.log("修改的表记信息为：" + JSON.stringify(updateInfo));
                console.log(updateInfo);

                $.ajax({
                    type: "post",
                    url: "mp/updateMpInfo",
                    data: "property=" + JSON.stringify(updateInfo),
                    dataType: "json",
                    success: function (msg) {
                        if (msg) {
                            if (msg.code == 200) {
                                $("#tb_departments").bootstrapTable("refresh");
                                showDevTip("修改成功");
                            } else {
                                showDevTip("修改失败");
                            }
                            $('#dev_info').modal("hide");
                        }
                    }
                });

            }
        }

            /**
             * 换表 ajax 绑定设备
             * @param mpId
             */
            function changeMpSubmitInfoDev(mpId) {

                var changeMpInfo = getMpInfoFromHtml();

                if(!judegTotalMp(changeMpInfo)){
                    showDevTip("请选择是否为总表");
                    return;
                }

                if (changeMpInfo) {
                    //新增的状态为 1
                    changeMpInfo.state = 1;
                    changeMpInfo.devId = changeEmputyStr($('#mpName_input').attr('devId'));
                    changeMpInfo.mpId = mpId;

                    console.log("换绑的表记信息为：" + JSON.stringify(changeMpInfo));
                    console.log(changeMpInfo);

                    $.ajax({
                        type: "post",
                        url: "mp/changeMpInfoByDev",
                        data: "property=" + JSON.stringify(changeMpInfo),
                        dataType: "json",
                        success: function (msg) {
                            if (msg) {
                                showDevTip(msg.discription);
                                $('#dev_info').modal("hide");
                            }
                        }
                    });
                }


            }

            /**
             * 换表 ajax  绑定设备型号
             * @param mpId
             */
            function changeMpSubmitInfoDevVersion(mpId) {

                var changeDevInfo = getMpInfoFromHtml();

                if(!judegTotalMp(changeDevInfo)){
                    showDevTip("请选择是否为总表");
                    return;
                }

                if (changeMpInfo) {
                    changeDevInfo.state = 1;
                    changeDevInfo.devVersionId = changeEmputyStr($('#mpName_input').attr('devVersionId'));
                    changeDevInfo.typeId = changeEmputyStr($('#mpName_input').attr('typeId'));
                    changeDevInfo.mpId = mpId;

                    var items = getItemsFromHtml();

                    var changeMpInfo = {
                        data: changeDevInfo,
                        item: items
                    }

                    console.log("新增的表记(设备)信息为：" + JSON.stringify(changeMpInfo));
                    console.log(changeMpInfo);

                    $.ajax({
                        type: "post",
                        url: "mp/addMpInfoByDevVersion",
                        data: "property=" + JSON.stringify(changeMpInfo),
                        dataType: "json",
                        success: function (msg) {
                            if (msg) {
                                showDevTip(msg.discription);
                                $('#dev_info').modal("hide");
                            }
                        }
                    });
                }

            }
            
            function judegTotalMp(mpInfo) {

                if(mpInfo){
                    if(null === mpInfo.totalMp  || mpInfo.totalMp.trim() === ""){
                        return false;
                    }

                    return true;
                }

                return false;
            }

            /**
             * 从页面获取 数据项数据
             */
            function getItemsFromHtml() {
                var items = [];

                var item = {
                    id: null,       //数据项id
                    value: null,    //数据项值
                    devProId: null, //数据项code
                };

                $(".itemInput").each(function (i, n) {

                    var id = changeEmputyStr($(this).attr("id"));
                    var code = changeEmputyStr($(this).attr("code"));
                    var value = changeEmputyStr($(this).val());

                    var aItem = {
                        id: id,
                        value: value,
                        devProId: code,
                    };

                    items.push(aItem);
                });

                console.log("从界面得到的item数据" + JSON.stringify(items));

                return items;
            }


            /**
             * 从页面得到 表记数据
             * @returns
             */
            function getMpInfoFromHtml() {

                var mpInfo = {
                    mpId: null,          //计量点id
                    devId: null,         //设备id
                    mpName: null,        //计量点name
                    mpLng: null,         //经度
                    mpLat: null,         //纬度
                    mpProvince: null,    //省
                    mpCity: null,        //市
                    mpDistrict: null,    //区
                    mpAddress: null,     //详细地址
                    areaId: null,        //区域id
                    remark: null,        //备注
                    state: null,         //状态
                    customerType:null,    //用户类型
                    totalMp:null          //是否为总表

                };

                mpInfo.mpName = changeEmputyStr($('#mpName_input').val()).replace("\t","");
                mpInfo.mpLng = changeEmputyStr($('#mpLng_input').val());
                mpInfo.mpLat = changeEmputyStr($('#mpLat_input').val());
                mpInfo.mpAddress = changeEmputyStr($('#address_textarea').val());
                mpInfo.areaId = changeEmputyStr($('#areaText_input').attr('nodeId'));
                mpInfo.remark = changeEmputyStr($('#mp_remark_textarea').val());
                mpInfo.customerType = changeEmputyStr($('#mp_user_type').val());
                mpInfo.totalMp = changeEmputyStr($('#ifTotal_input').val());

                //解析省市区
                var addressList = $('#address_area_input').val().split('/');
                $(addressList).each(function (i, n) {
                    mpInfo[addressArray[i]] = changeEmputyStr(n);
                });

                if (judegAreaIsEmpty(mpInfo.areaId)) {
                    return null;
                }

                return mpInfo;
            }

            function judegAreaIsEmpty(areaId) {
                if (areaId == null) {
                    console.log("该区域非法");
                    /* $('#areaText_input').attr('placeholder', '请选择有效区域');
                     $('#areaText_input').css('backgroundcolor', 'red');*/
                    showDevTip("请选择有效区域");
                    return true;
                }
                return false;
            }

            /**
             * 把后台表记信息 赋值到界面
             * @param mpInfo
             */
            function setMpInfoToHtml(mpInfo) {

                console.log("给界面赋值：" + JSON.stringify(mpInfo));

               /* //表记名
                $('#mpName_input').val(mpInfo.mpName);
                $('#mpName_input').attr('devId', changeEmputyStr(mpInfo.devId));
                $('#mpName_input').attr("disabled", true);*/


                $('#mpLng_input').val(changeEmputyStr(mpInfo.mpLng));
                $('#mpLat_input').val(changeEmputyStr(mpInfo.mpLat));
                $('#address_textarea').val(changeEmputyStr(mpInfo.mpAddress));

                $('#areaText_input').val(changeEmputyStr(mpInfo.areaName));
                $('#areaText_input').attr('nodeId', changeEmputyStr(mpInfo.areaId));

                $('#mp_remark_textarea').val(changeEmputyStr(mpInfo.remark));
                $('#ifTotal_input').val(changeEmputyStr(mpInfo.totalMp));

                //省市区
                $("#address_area_input").citypicker("reset");
                $("#address_area_input").citypicker({
                    province: mpInfo.mpProvince,
                    city: mpInfo.mpCity,
                    district: mpInfo.mpDistrict
                });
                $("#address_area_input").citypicker("destroy");

            }

            /**
             * 将“” 转化为 null
             * @param str
             * @returns {*}
             */
            function changeEmputyStr(str) {
                if (str == null || str.trim() == "") {
                    return null;
                }
                return str;
            }

        function showDevTip(message) {
            $("#dev_message").text(message);
            $("#imfo_tip_dev").modal('show');
        }

            /*------------------------------------验证---------------------------------------*/
            function judegSetUpForm() {

                $("#devInfo_form").bootstrapValidator({
                    live: 'disabled',    //提交再验证
                    excluded: [':disabled', ':hidden', ':not(:visible)'],  //排除控件
                    submitButtons: '#submit_area',   //指定提交按钮
                    feedbackIcons: { //根据验证结果显示的各种图标
                        valid: 'glyphicon glyphicon-ok',
                        invalid: 'glyphicon glyphicon-remove',
                        validating: 'glyphicon glyphicon-refresh'
                    },
                    fields: {
                        noEmptyInput: {
                            validators: {
                                notEmpty: {//检测非空，radio也可用
                                    message: '输入框不为空'
                                }

                            }
                        },
                        telphone: {
                            validators: {
                                notEmpty: {//检测非空，radio也可用
                                    message: '电话号码不能为空'
                                },
                                regexp: {//正则验证
                                    regexp: /^1[1-9][0-9]{9}$/,
                                    message: '请输入正确的电话号码'
                                },

                            }
                        }
                    }
                });
            }





