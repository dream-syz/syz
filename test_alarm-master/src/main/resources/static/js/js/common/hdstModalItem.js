var comModalItem = function () {
        var comModalItemObj = Object();
        comModalItemObj.defaults = {
            modalBodyId: null,
            modalItemIdList: [],
            allowModifyList: [],
            allowEmptyList: [],
            typeList: [],
            labelTextList: null,
            modalItemValueList: [],
            dynamicGenerateOptionList: [],
            roleList: [],
            interactiveObj: [],
            switchIdList: []
        };
        comModalItemObj.domObj = {
            div: null,
            label: null,
            modalItem: null,
            modalItems: null
        };

        comModalItemObj.modalObj = null;

        comModalItemObj.modalItemInit = function (parObj) {

            if (parObj.modalBodyId && parObj.modalItemIdList) {
                comModalItemObj.modalItemClear();          //清空模态框
                comModalItemObj.modalItemSetOption(parObj);
            } else {
                console.log("未接收到modalBodyId或者modalItemIdList");
            }
            if (parObj.typeList instanceof Array || !parObj.typeList) {
                comModalItemObj.arrayGenerate(comModalItemObj.defaults);
            } else {
                comModalItemObj.checkBoxItemsCreate();
            }
            if (comModalItemObj.defaults.modalItemValueList) {
                comModalItemObj.valueFill(comModalItemObj.defaults.modalItemIdList, comModalItemObj.defaults.modalItemValueList, comModalItemObj.defaults.typeList);
            }
        };

        comModalItemObj.arrayGenerate = function (parObj) {
            for (let i = 0; i <= parObj.modalItemIdList.length - 1; i++) {
                comModalItemObj.singleGenerate(parObj.modalItemIdList[i], parObj.labelTextList[i], parObj.typeList[i], parObj.dynamicGenerateOptionList[i], parObj.allowModifyList[i], parObj.allowEmptyList[i], parObj.modalItemValueList[i], parObj.roleList[i], parObj.interactiveObj[i], parObj.switchIdList[i]);
            }
            console.log("传入的是数组");
        };

        comModalItemObj.singleGenerate = function (modalItemId, labelText, type, option, authority, empty, value, role, interactiveObj, switchId) {
            comModalItemObj.modalItemObj = $('#' + modalItemId);
            comModalItemObj.modalItemCreate(modalItemId, labelText, type, option, authority, empty, value, role, interactiveObj, switchId);  //生成新的组件
        };

        comModalItemObj.modalItemSetOption = function (options) {
            comModalItemObj.modalObj = $('#' + options.modalBodyId);
            comModalItemObj.defaults.modalItemIdList = options.modalItemIdList;
            comModalItemObj.defaults.modalBodyId = options.modalBodyId;
            comModalItemObj.defaults.labelTextList = options.labelTextList;

            comModalItemObj.defaults = $.extend(comModalItemObj.defaults, options);

            // if (options.allowModifyList) {                      //允许不填写
            //     comModalItemObj.defaults.allowModifyList = options.allowModifyList;
            // }
            // if (options.allowEmptyList) {                      //允许不填写
            //     comModalItemObj.defaults.allowEmptyList = options.allowEmptyList;
            // }
            // if (options.typeList === "checkboxItems") {
            //     comModalItemObj.defaults.typeList.push("checkboxItems");
            // } else if (options.typeList === "radioItems") {
            //     comModalItemObj.defaults.typeList.push("radioItems");
            // } else {
            //     if (options.typeList) {
            //         comModalItemObj.defaults.typeList = options.typeList;
            //     }
            //     comModalItemObj.typeListFill();
            // }
            // if (options.modalItemValueList) {
            //     comModalItemObj.defaults.modalItemValueList = options.modalItemValueList;
            // }
            // if (options.dynamicGenerateOptionList) {
            //     comModalItemObj.defaults.dynamicGenerateOptionList = options.dynamicGenerateOptionList;
            // }
            // console.log("options" + options);
            // console.log("comModalItemObj.defaults" + comModalItemObj.defaults);
        };

        comModalItemObj.modalItemClear = function () {
            console.log("销毁modalItem组件");
            $("comModalItemObj.modalObj").empty();
        };

        comModalItemObj.modalItemFormSubmit = function (obj, url) {
            $(obj).click(function () {
                console.log("绑定按钮提交地址=" + url);
                var data = {
                    "devId": "1231456",
                    "areaId": "2",
                    "totalMp": "1",
                    "dev": {
                        "devVersionId": ""
                    }
                };
                var requestData = "parameter=" + JSON.stringify(data);
                requestAjax("POST", url, false, requestData, "json", function (result) {
                    console.log(result);
                })
            });
        };

        comModalItemObj.modalItemCreate = function (modalItemId, labelText, type, option, authority, empty, value, role, interactiveObj, switchId) {
            console.log("生成modalItem框" + type);
            switch (type) {
                case "input" :
                    comModalItemObj.inputCreate();
                    break;
                case "select" :
                    comModalItemObj.selectCreate();
                    break;
                case "file":
                    comModalItemObj.fileCommitCreate();
                    break;
                case "box":
                    comModalItemObj.BoxCreate();
                    break;
                case "checkboxItems":
                    comModalItemObj.checkBoxItemsCreate();
                    break;
                case "radioItems":
                    comModalItemObj.radioItemsCreate();
                    break;
                case "textArea":
                    comModalItemObj.textAreaCreate();
                    break;
                default :
                    console.log("无法识别的类型用input暂时替代");
                    comModalItemObj.inputCreate();
            }
            console.log(labelText);
            if (type !== "checkboxItems" && type !== "radioItems") {
                comModalItemObj.domObj.modalItem = document.getElementById("modalItemObj");
                console.log(comModalItemObj.domObj.modalItem);
                comModalItemObj.domObj.label = comModalItemObj.domObj.modalItem.previousSibling.previousSibling;
                console.log(comModalItemObj.domObj.label);
                comModalItemObj.domObj.div = comModalItemObj.domObj.modalItem.parentNode;
                console.log(comModalItemObj.domObj.div);
                comModalItemObj.domObj.label.innerHTML = labelText;

                comModalItemObj.refreshId(modalItemId);
                comModalItemObj.enterKeyCommitBind(modalItemId);
            }
            if (option) {
                if (option instanceof Array) {
                    comModalItemObj.selectOptionFillByArray(modalItemId, option, value)
                } else {
                    comModalItemObj.selectOptionFillByUrl(modalItemId, option, value);
                }
            }
            if (authority === false) {
                $("#" + modalItemId).attr("readonly", "readonly");
            }
            if (empty) {
                $("#" + modalItemId).addClass('allowEmpty');
            } else {
                var $label = $("#" + modalItemId).prev();
                $label.html(
                $label.html() + '<span style="color:red;font-size:18px;vertical-align: middle;">&nbsp;*</span>'
                    );
            }
            if (role == "switch") {
                $('#' + modalItemId).parent().parent().append('<div class=' + modalItemId + '-Wrapper' + '></div>');
                comModalItemObj.activeSwitch(modalItemId, interactiveObj);
            } else if (role == "indefiniteItem") {

                $("#" + modalItemId).addClass('indefiniteItem');
                var domParent = $(".indefiniteItem").parent();
                var newDom = domParent.remove();
                var switchDom = $('.' + switchId + '-Wrapper');
                switchDom.append(newDom);
            }
        };

        comModalItemObj.activeSwitch = function (modalItemId, interactiveObj) {
            $('#' + modalItemId).change(function (e) {
                interactiveObj.data.versionId = this.value;

                $.ajax({
                    url: interactiveObj.url,
                    type: 'POST',
                    dataType: "json",
                    data: "parameter=" + JSON.stringify(interactiveObj.data),
                    success: function (res) {
                        if (res.state.code == 200 || res.state.code == 204) {
                            comModalItemObj.recFormData(res.data, modalItemId);
                        }
                    },
                    complete: function () {

                    }
                });
            });
        };

        comModalItemObj.recFormData = function (data, modalItemId) {

            comModalItemObj.modalObj.find('.indefiniteItem').parent().remove();

            $.each(data, function (index, ele) {
                console.log("dataName=          " + ele.name);

                comModalItemObj.modalItemCreate(ele.id, ele.name, "", "", true, false, "", "indefiniteItem", "", modalItemId);       //将服务器返回的输入项添加到模态框中

                comModalItemObj.valueFill(ele.id, ele.value, "input");
            });

            // modalForm.refresh();                                                                                                             //如果append方法不支持自动刷新，则需要执行类似refresh的手动刷新。
        };

        comModalItemObj.selectOptionFillByUrl = function (modalItemId, optionUrl, value) {
            requestAjax("GET", optionUrl, true, "", "json", function (result) {
                console.log(result);
                if (result.state.code === 200) {
                    if (value) {
                        $("#" + modalItemId).append("<option value=" + value[0] + ">" + value[1] + "</option>");
                        $.each(result.data, function (index, element) {
                            if (element.optionId !== value[0]) {
                                $("#" + modalItemId).append("<option value=" + element.optionId + ">" + element.optionName + "</option>");
                            }
                        });
                    } else {
                        $("#" + modalItemId).append("<option value=''>请选择</option>");
                        $.each(result.data, function (index, element) {
                            $("#" + modalItemId).append("<option value=" + element.optionId + ">" + element.optionName + "</option>");
                        });
                    }
                } else {
                    alert('失败');
                }
            });
        };

        comModalItemObj.selectOptionFillByArray = function (modalItemId, option, value) {
            if (value) {
                $("#" + modalItemId).append("<option value=" + value[0] + ">" + value[1] + "</option>");
                $.each(option, function (index, ele) {
                    if (ele.optionId != value[0]) {
                        $("#" + modalItemId).append("<option value=" + ele.optionId + ">" + ele.optionName + "</option>");
                    }
                });
            } else {
                $("#" + modalItemId).append("<option value=''>请选择</option>");
                $.each(option, function (index, ele) {
                    $("#" + modalItemId).append("<option value=" + ele.optionId + ">" + ele.optionName + "</option>");
                });
            }
        };
        comModalItemObj.refreshId = function (modalItemId) {
            comModalItemObj.domObj.modalItem.id = modalItemId;
            comModalItemObj.domObj.label.setAttribute('for', modalItemId);
        };

        comModalItemObj.valueFill = function (modalItemList, valueList, typeList) {
            if (valueList instanceof Array) {
                for (let i = 0; i < modalItemList.length; i++) {
                    if (valueList[i] && typeList[i] !== "select") {
                        $("#" + modalItemList[i]).val(valueList[i]);
                    }
                }
            } else {
                if (typeList !== "select") {
                    $("#" + modalItemList).val(valueList);
                }
            }

        };

        comModalItemObj.typeListFill = function () {
            comModalItemObj.defaults.typeList.length = comModalItemObj.defaults.modalItemIdList.length;
            for (let i = 0; i < comModalItemObj.defaults.typeList.length; i++)
                if (!comModalItemObj.defaults.typeList[i]) {
                    comModalItemObj.defaults.typeList[i] = "input";
                }
        };

        comModalItemObj.inputCreate = function () {
            $('#' + comModalItemObj.defaults.modalBodyId).append(
            "<div class=\"form-group form-inline inputWrapper\">\n" +
            "<label class=\"label-control\"></label>\n" +
            "<input class=\"form-control\" type=\"text\"  id='modalItemObj'/>\n" +
            "</div>"
                );
        };

        comModalItemObj.selectCreate = function () {
            $('#' + comModalItemObj.defaults.modalBodyId).append(
            "<div class=\"form-group form-inline selectWrapper\">\n" +
            "<label class=\"label-control\"></label>\n" +
            "<select class=\"form-control\" id='modalItemObj'><div></div></select>\n" +
            "</div>"
                );
        };

        comModalItemObj.fileCommitCreate = function () {
            $('#' + comModalItemObj.defaults.modalBodyId).append(
            "<div class=\"form-group form-inline\">\n" +
            "<label class=\"label-control\"></label>\n" +
            "<input class=\"file-control\" type=\"file\" multiple='multiple' id='modalItemObj'/>\n" +
            "</div>"
                );
        };

        comModalItemObj.BoxCreate = function () {
            $('#' + comModalItemObj.defaults.modalBodyId).append(
            "<div class=\"form-group form-inline itemsWrapper\">\n" +
            "<label class='label-control'></label>\n" +
            "<div class=\"file-control\" id='modalItemObj'></div>\n" +
            "</div>"
                );
        };

        comModalItemObj.textAreaCreate = function () {
            $('#' + comModalItemObj.defaults.modalBodyId).append(
            "<div class='form-group form-inline'>\n" +
            "<label class='label-control'></label>\n" +
            "<textarea class='form-control' name='textarea' cols='40' rows='6' id='modalItemObj' style='vertical-align:top'></textarea>\n" +
            "</div>"
                );
        };


        comModalItemObj.checkBoxItemsCreate = function () {
            for (let i = 0; i < comModalItemObj.defaults.modalItemIdList.length; i++) {
                $('#' + comModalItemObj.defaults.modalBodyId).append(
                "<input id='" + comModalItemObj.defaults.modalItemIdList[i] + "' type='checkbox' value='" + comModalItemObj.defaults.modalItemIdList[i] + "' name='" + comModalItemObj.defaults.modalBodyId + "' style='margin-left: 20px;'/>\n" +
                "<label for='" + comModalItemObj.defaults.modalItemIdList[i] + "'>" + comModalItemObj.defaults.labelTextList[i] + "</label>\n"
                    );
            }
        };

        comModalItemObj.radioItemsCreate = function () {
            for (let i = 0; i < comModalItemObj.defaults.modalItemIdList.length; i++) {
                $('#' + comModalItemObj.defaults.modalBodyId).append(
                "<input id='" + comModalItemObj.defaults.modalItemIdList[i] + "' type='radio' value='" + comModalItemObj.defaults.modalItemIdList[i] + "' name='" + comModalItemObj.defaults.modalBodyId + "' style='margin-left: 20px;'/>\n" +
                "<label for='" + comModalItemObj.defaults.modalItemIdList[i] + "'>" + comModalItemObj.defaults.labelTextList[i] + "</label>\n"
                    );
            }
        };

        comModalItemObj.enterKeyCommitBind = function (id) {
            let itemObj = $("#" + id);
            itemObj.keypress(function (e) {
                console.log("按钮监听成功");
                //监听输入回车
                // if (e.keyCode === 13) {
                //     alert(itemObj.val());
                // }
            });
        };


//示例范围
        comModalItemObj.tableHeader = {
            columns: [{
                title: null,//表头名
                feild: null//对应的数据对象名
            }],
            idField: null,
            option: {
                checkbox: false
            }
        };
        comModalItemObj.modalItemObj = {};
        comModalItemObj.modalObj = {};

        comModalItemObj.init = function (parObj) {
            if (parObj.divID) {
                comModalItemObj.option.divID = parObj.divID;
                comModalItemObj.bsTableObj = $('#' + commTableObj.option.divID);
                comModalItemObj.setOption(parObj);
            } else
                return;

            comModalItemObj.bsTableObj.bootstrapTable('destroy');//先销毁表格
            comModalItemObj.bsTableObj.bootstrapTable({
                method: 'post', //请求类型
                url: comModalItemObj.option.url,//请求的url
                clickToSelect: false,
                checkboxHeader: false,//是否需要操作列
                idField: comModalItemObj.dataStore.key,     //每一行的唯一标识，一般为主键列
                striped: true,                      //是否显示行间隔色
                cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
                sortable: true,                     //是否启用排序
                sortOrder: "asc",                   //排序方式
                exportDataType: "all",              //basic', 'all', 'selected'.
                exportTypes: ['xlsx', 'excel', 'csv'],
                showExport: true,
                showRefresh: true,                  //是否显示刷新按钮
                showColumns: true,                  //是否显示所有的列
                minimumCountColumns: 3,             //最少允许的列数
                resizable: true,
                liveDrag: true,
                detailView: false,                   //是否显示父子表
                checkboxHeader: true,
                // sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
                search: comModalItemObj.option.search,
                onLoadSuccess: comModalItemObj.recData,
                locale: 'zh-CN'
            });
        };

        comModalItemObj.setOption = function (parObj) {
            if (parObj.url) {
                comModalItemObj.option.url = parObj.url;
            }
            if (parObj.par) {
                comModalItemObj.option.par = parObj.par;
            }
            if (parObj.title != null && parObj.title != undefined) {
                comModalItemObj.option.title = parObj.title;
            }
            if (parObj.search != null && parObj.search != undefined) {
                comModalItemObj.option.search = parObj.search;
            }
        };

        comModalItemObj.refreshOption = function (parObj) {//url: null,par: null,
            comModalItemObj.setOption(parObj);
            comModalItemObj.bsTableObj.bootstrapTable('refreshOptions', comModalItemObj.option)
        };

        comModalItemObj.setTableHeader = function (headerObj) {//设置表头
            if (headerObj.columns) {
                comModalItemObj.tableHeader.columns = headerObj.columns;
            }
            if (headerObj.option != null && headerObj.option != undefined) {
                comModalItemObj.tableHeader.option = headerObj.option;
            }
            if (headerObj.idField) {
                comModalItemObj.tableHeader.idField = headerObj.idField;
            }
            comModalItemObj.genHeader();
        };

        comModalItemObj.genHeader = function () {//生成表头的默认部分
            for (var i = 0; i < comModalItemObj.tableHeader.columns.length; i++) {
                if (!(comModalItemObj.tableHeader.columns[i].align)) {
                    comModalItemObj.tableHeader.columns[i].align = 'center';
                }
                if (!(comModalItemObj.tableHeader.columns[i].sortable)) {
                    comModalItemObj.tableHeader.columns[i].sortable = true;
                }
                if (!(comModalItemObj.tableHeader.columns[i].order)) {
                    comModalItemObj.tableHeader.columns[i].order = 'asc';
                }
            }
            var tempColumns = comModalItemObj.tableHeader.columns;
            if (comModalItemObj.tableHeader.option.checkbox) {
                tempColumns.splice(0, 0, {
                    checkbox: commTableObj.tableHeader.option.checkbox
                });
            }
            comModalItemObj.bsTableObj.bootstrapTable('refreshOptions', {
                columns: comModalItemObj
            });
        };

        comModalItemObj.recData = function (dataObj) {
            if (dataObj.columns || dataObj.option || dataObj.idField) {
                comModalItemObj.setTableHeader(dataObj);
            }
            if (dataObj.data) {
                comModalItemObj.dataStore.data = dataObj.data;
                comModalItemObj.bsTableObj.bootstrapTable('load', commTableObj.dataStore.data);
            }
        };

        comModalItemObj.refreshData = function (parObj) {
            var tempPar = {
                silent: comModalItemObj.option.silent,
                query: parObj ? parObj : comModalItemObj.option.par
            };
            comModalItemObj.bsTableObj.bootstrapTable('refresh', tempPar);
        };


        return comModalItemObj;
    }
;