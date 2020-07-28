var createRule = (function () {
    var my = {};

    var obj = {
        url: "",
        param: "",
        selectId: "",
        list: []
    };

    var OR_YASE = '1' ;
    var OR_NO = '0' ;

    var ruleCount = 0;
    /**
     * 初始化 新增规则方法
     */
    my.initRuleInfo = function () {

        /*----------------------------------------------------加载公共区域------------------------------------------------------*/
        $.ajaxSetup({
            async: false //取消异步，先加载load
        });

        $('span[name = "showSleepTip"]').popover();//悬停提示


        /*----------------------------------------------------初始化所有下拉框------------------------------------------------------*/

        initSelect("alarmRule/listProduct", "", $("#product_select"));//设备型号

        initSelect("alarmRule/listRule", "", $(".rule_select"));//规则描述

        initSelect("alarmRule/listNotice", "", $("#notice_select"));//初始化联系人

        initSelect("alarmRule/listNoticeType", "", $("#noticeType_select"));//初始化联系方式

        // 选择设备型号和表记 默认消失
        // $("#devVersion_select").attr("style", "display:none;");
        // $("#mp_select").attr("style", "display:none;");

        $(".devVersion_select").selectpicker('hide');
        $(".mp_select").selectpicker('hide');

        /*----------------------------------------------------绑定 change 方法------------------------------------------------------*/
        $("#product_select").change(function () {
            initSelect("alarmRule/listDevVersion", $("#product_select").val(), $(".devVersion_select[num]"));
            initSelect("alarmRule/listMp", $(".devVersion_select[num='0']").val()[0], $("mp_select[num]"));
        })

        $(".devVersion_select[num]").change(function () {
            var index = $(this).attr("num");
            initSelect("alarmRule/listMp", $(this).val()[0], $(".mp_select[num='"+index+"']"));
        })

    };


    /**
     *新增 规则
     */
    my.addRule = function () {

        $('#createRule_submit').unbind('click');

        $('#createRule_submit').click(function () {
            addRuleInfo();
        });

    }

    my.updateRule = function(row){
        $('#createRule_submit').unbind('click');

        $('#createRule_submit').click(function () {
            updateRuleInfo(row);
        });
    }

    my.emptyInput= function(){
        $(".strategyName_input").val("");
        $("[name='description_input']").eq(2).val("");
        $("#context_input").val("");
    }




    my.showCreateRuleModal = function (createRule) {
        var windowWidth = $(window).width();
        var windowHeight = $(window).height();
        $('#cre-rule-div-cont').width(windowWidth * 0.8);
        $('#cre-rule-div-cont').height(windowHeight * 0.9 );

        if (createRule) {
            //修改
            setRuleInfoToModal(createRule);
            $("#addRuleSpan").attr("style","display:none;");
            $("#delRuleSpan").attr("style","display:none;");
        }else{
            //新增
            $("[name='isHasVersion_0']").eq(1).attr("checked",true);
            $("[name='isHasMp_0']").eq(1).attr("checked",true);

            $('#notice_select').selectpicker("val","");
            $('#cre-rule-div').find("input").empty();

            $(".devVersion_select").selectpicker('hide');
            $(".mp_select").selectpicker('hide');

            $("#addRuleSpan").attr("style","display:block");
            $("#delRuleSpan").attr("style","display:block");
        }
        emptyAddRule();

        $('#cre-rule-div').modal('show');
    }
    
    function emptyAddRule() {

        var count =$(".addRule_dev").length ;

        while (count > 1){
            my.deleteRuleDiv();
            count --;
        }
        
    }

    function disableSelect(ele,flag){
        ele.prop('disabled', flag);
        ele.selectpicker('refresh');
    }


    /*-----------------------------------------------选择设备型号和表记-------------------------------------------------*/

    my.showDevVersion = function (ele) {
        var index = $(ele).attr("num");
        $(".devVersion_select[num='"+index+"']").selectpicker('show');
        initSelect("alarmRule/listDevVersion", $("#product_select").val(), $(".devVersion_select[num='"+index+"']"));
    }

    my.hideDevVersion = function (ele) {
        // $("#devVersion_select").attr("style", "display:none;");
        var index = $(ele).attr("num");
        $(".devVersion_select[num='"+index+"']").selectpicker('hide');

    }

    my.showMp = function (ele) {
        var index = $(ele).attr("num");
        $(".mp_select[num='"+index+"']").selectpicker('show');
        initSelect("alarmRule/listMp", $(".devVersion_select[num='"+index+"']").val(), $(".mp_select[num='"+index+"']"));
    }

    my.hideMp = function (ele) {
        // $("#mp_select").attr("style", "display:none;");
        var index = $(ele).attr("num");
        $(".mp_select[num='"+index+"']").selectpicker('hide');
    }

    /*------------------------------------------------------多条规则-------------------------------------------------*/

    my.deleteRuleDiv = function () {

        var ruleCount = $(".addRule_dev").length;

        if(ruleCount >1){
            $(".addRule_dev").last().remove();
            ruleCount--;
        }else {
            showTip("不可删除")
        }

        
    }

    my.addRuleDiv = function () {
        var ruleCount = $(".addRule_dev").length-1;

        var old = ruleCount;
        ruleCount++;

        var cloneDiv = $("#addRuleCopy").load("addRule .addRule_dev").clone(true);
        $("#addRuleCopy").empty();

        cloneDiv.find(".addRule").attr("num",ruleCount);
        // cloneDiv.find("[id='devVersion_select_"+old+"']").attr("id","devVersion_select_"+ruleCount);
        cloneDiv.find("[name='isHasVersion']").attr("name","isHasVersion_"+ruleCount);
        cloneDiv.find("[name='isHasMp']").attr("name","isHasMp_"+ruleCount);

        $("#addRule").append(cloneDiv);
        // $(".selectpicker").selectpicker('refresh');
        $('.selectpicker').selectpicker('render');
        $(".devVersion_select[num='"+ruleCount+"']").selectpicker('hide');
        $(".mp_select[num='"+ruleCount+"']").selectpicker('hide');

        $(".devVersion_select[num='"+ruleCount+"']").change(function () {
            initSelect("alarmRule/listMp", $(this).val()[0], $(".mp_select[num='"+ruleCount+"']"));
        })
        initSelect("alarmRule/listRule", "", $(".rule_select[num='"+ruleCount+"']"));//规则描述

    }


    /*------------------------------------------------------provider-------------------------------------------------*/

    function addRuleInfo(){
        var len = $(".addRule_dev").length;
        var ruleInfoList = [];

        for(var i = 0;i<len;i++ ){
            var ruleInfo = getRuleInfoFormHTML(i);//得到对象
            ruleInfo.orEnaable = "0";
            ruleInfoList.push(ruleInfo);
        }



        if(judgeRuleInfoList(ruleInfoList)){
            // console.log("新增的对象list："+JSON.stringify(ruleInfoList));
            var msg = commReturnAjax("alarmRule/addRule", "parameter", JSON.stringify(ruleInfoList));

            if (msg) {
                showTip(msg.description);
            }
        };//判断对象



        refreshTable();
    }
    function updateRuleInfo(row){
        var ruleInfo = getRuleInfoFormHTML(0);//得到对象

        ruleInfo.orEnaable = row["orEnaable"];
        ruleInfo.id = row["id"];

        if(judgeRuleInfo(ruleInfo)){
            var msg = commReturnAjax("alarmRule/updataRule", "parameter", JSON.stringify(ruleInfo));

            if (msg) {
                showTip(msg.description);
            }

            refreshTable();
        };//判断对象


    }

    function getIndex(index) {
        if(index){
            return index*2+1;
        }
        return 0;
    }

    function getRuleInfoFormHTML(index) {
        var ruleInfo = {
            strategyName: $(".strategyName_input[num='"+index+"']").val(),
            description: getDescription(),
            deadTime: $("#deadTime_select").val(),
            orMp: $("[name='isHasMp_"+index+"'][num='"+index+"']:checked").val(),
            orVersion: $("[name='isHasVersion_"+index+"'][num='"+index+"']:checked").val(),
            orEnaable: null,
            ruleId: $(".rule_select[num='"+index+"']").val(),
            productId: $("#product_select").val(),
            versionList: getList($(".devVersion_select[num='"+index+"']")),
            mpList: getList($(".mp_select[num='"+index+"']")),
            userList: getList($("#notice_select")),
            noticeType: $("#noticeType_select").val(),
            context: $("#context_input").val(),
            orNotice: $("[name='isNotice']:checked").val()
        };
        return ruleInfo;
    }

    function setRuleInfoToModal(createRule) {
        if (createRule) {

            $(".strategyName_input[num='0']").val(changeEmputyStr(createRule.strategyName));
            $("#deadTime_select").val(changeEmputyStr(createRule.deadTime));
            $(".rule_select[num='0']").val(changeEmputyStr(createRule.ruleId));
            $("#product_select").val(changeEmputyStr(createRule.productId));
            $("#noticeType_select").val(changeEmputyStr(createRule.noticeType));
            $("#context_input").val(changeEmputyStr(createRule.context));
            setRadio('isNotice',changeEmputyStr(createRule.orNotice));

            setList($("#notice_select"),changeEmputyStr(createRule.userList));
            initSelect("alarmRule/listDevVersion", $("#product_select").val(), $(".devVersion_select[num='0']"));
            setRadioList('isHasVersion_0',changeEmputyStr(createRule.orVersion),$(".devVersion_select[num='0']"), createRule.versionList);

            initSelect("alarmRule/listMp", $(".devVersion_select[num='0']").val(), $(".mp_select[num='0']"));
            setRadioList('isHasMp_0',changeEmputyStr(createRule.orMp),$(".mp_select[num='0']"), createRule.mpList);

            setDescription(changeEmputyStr(createRule.description));
        }
    }
    
    function setRadio(radioName,radioValue) {
        if(OR_YASE === radioValue){

            $("[name= "+radioName+"]").eq(0).attr("checked",true);

        }else if(OR_NO === radioValue){
            $("[name= "+radioName+"]").eq(1).attr("checked",true);
        }
        
    }

    function setRadioList(radioName,radioValue,element,list) {
        if(OR_YASE === radioValue){

            $("[name= "+radioName+"]").eq(0).attr("checked",true);
            setList(element,list);
            // element.attr("style", "display:block;");
            element.selectpicker('show');


        }else if(OR_NO === radioValue){
            $("[name= "+radioName+"]").eq(1).attr("checked",true);
            // element.attr("style", "display:none;");
            element.selectpicker('hide');
        }
    }
    
    function setList(element,list) {

        if(element.hasClass("selectpicker")){
            element.selectpicker('val', list)
        }else {
            element.val(list[0]);
        }

    }

    function getList(element) {
        // var arr = [];
        // arr.push(element.val());
        // return arr;
        return element.val();
    }
    
    function judgeRuleInfoList(ruleInfoList) {
        $(ruleInfoList).each(function (i,n) {
            if(!judgeRuleInfo(n)){
                return false;
            };
        })

        return true;
        
    }

    function judgeRuleInfo(ruleInfo) {
        var flag = false;

        var nameList = [];

        if (ruleInfo) {

            if (isEmpty(ruleInfo.strategyName)) {
                showTip("请输入规则名称");
                return false;
            }else if(isEmptyList(ruleInfo.userList) ){
                showTip("请选择通知对象");
                return false;
            }else if( isEmpty(ruleInfo.noticeType) ){
                showTip("请选择通知方式");
                return false;
            } else if( ruleInfo.orVersion == OR_YASE && isEmptyList(ruleInfo.versionList) ){
                showTip("请选择至少一种设备型号");
                return false;
            } else if( ruleInfo.orMp == OR_YASE && isEmptyList(ruleInfo.mpList) ){
                showTip("请选择至少一种表记");
                return false;
            }else if(nameList.indexOf(ruleInfo.strategyName) != -1){
                showTip("规则名不可重复");
                return false;
            }else {
                nameList.push(ruleInfo.strategyName);
                flag = true;
            }

        } else {
            showTip("请填写内容")
            return false;
        }

        return flag;
    }

    function isEmpty(str) {
        if (null === str || "" === str.trim()) {
            return true;
        }
        return false;
    }

    function isEmptyList(list) {
        if (null === list || 0 === list.length) {
            return true;
        }
        return false;
    }

    /**
     * 将“” 转化为 null
     * @param str
     * @returns {*}
     */
    function changeEmputyStr(str) {
        // if (str == null || str.trim() == "") {
        //     return null;
        // }
        return str;
    }

    function getDescription() {
        var description = '';

        $("[name='description_input'][num='0']").each(function () {
            description += $(this).val() + ";"
        })

        return description;
    }
    function setDescription(description) {
        var strList = description.split(';');

        $(strList).each(function (i,n) {
            $("[name='description_input'][num='0']").eq(i).val(n);
        })
    }

    /**
     * 初始化 下拉框
     * @param obj
     */
    function initSelect(url, param, select) {
        var obj = {
            url: url,
            param: param,
            select: select,
            list: []
        };

        obj.list = commReturnAjax(obj.url, "parameter", obj.param);
        addSelect(obj);
    }


    function addSelect(obj) {

        var select = obj.select;

        select.empty();//清空 select

        if (obj.list) {
            $.each(obj.list, function (i, n, arr) {
                select.append("<option value='" + n.id + "'>" + n.value + "</option>");
            })
        }

        if(select.hasClass('selectpicker')){
            select.selectpicker('refresh');
        }

    }

    function commReturnAjax(url, name, param) {

        var returnMsg = null;

        $.ajax({
            type: "POST",
            url: url,
            data: name + "=" + param,
            async: false,//取消异步
            dataType: "json",
            success: function (msg) {
                returnMsg = msg;
            }
        });

        return returnMsg;
    }

    /**
     *  展示 提示modal
     * @param message
     */
    function showTip(message) {
        $("#alarm_message").text(message);
        $("#imfo_tip_alarm").modal('show');
    }

    function refreshTable() {
        $('#tb_alarm').bootstrapTable("refresh");
    }


    return my;
}());