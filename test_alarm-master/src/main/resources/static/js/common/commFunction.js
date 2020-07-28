var loadingImage = document.getElementById("loadingDiv");

/**
 * 加载头部菜单
 * @param index
 * @param currentPosition
 */
function loadMenuTop(index, currentPosition) {
    $('#head-top-model').load("/menuTop #headMenu");
    topMenu.Init("0", index, "authority/getAuthoritysBySysUserAndMenuCode", currentPosition);
}

var meterTableInit = function () {
    var manageTableInit = Object();
    //初始化Table
    manageTableInit.Init = function () {
        $('#tb_departments').bootstrapTable('destroy');//先销毁表格
        var tableHead = getTableHeader(meterInfo);
        $("#tb_departments").initTable(
            {
                url: "mpInfo/getMpInfoByCondition",//请求的url
                pageIndex: 1,  //显示第几页
                pageLine: 20,   //每页显示多少行
                columns: tableHead,
                showExport: false,
                toolbar: false,
                sortable: true,
                showRefresh: false,
                ajaxOptions: {async: false, timeout: 8000},
                clickToSelect: false,
                height: tableHeight,    //表格高度   不传的话  则不设置高度
                isNeedOperation: true,  //是否需要操作列
                // isOtherOperation: ['update', 'remove', 'site', 'customerDetails', 'meterDetails'],
                isNeedRequestHeader: false,
                key: 'mpId',     //每一行的唯一标识，一般为主键列
                detailView: false,
                queryTableParams: function (params) { //查询参数事件
                    return "parameter=" + getTableQueryCondition(params);
                },
                update: function (e, value, row, index) {// 修改事件,参数分别为事件、undefined、行内容、第几行
                    updateMeterDetails(e, value, row, index);
                },
                remove: function (e, value, row, index) { //废弃事件
                    var oRemove = {
                        "steelNumber": row.steelNumber,
                        "createTime": row.createTime,
                        "manufacture": row.manufacture,
                        "versionName": row.versionName
                    };
                    commonDelMeter(row, "deleteModal", "废弃表计", "mpOperation/scrappedMp", "mpOperation/getScrappedAttrs", delMeterCommit, oRemove);
                },
                site: function (e, value, row, index) {//现场事件
                    siteOperationDetails(e, value, row, index);
                },
                /*customerDetails: function (e, value, row, index) { //客户详情事件
                    loadCustomerDetails(e, value, row, index);
                },*/
                meterDetails: function (e, value, row, index) { //表计详情事件
                    loadMeterDetails(e, value, row, index);
                },
                details: function () {
                    return detailsAdd();
                },
                operate: function () {
                    return matchState();
                }
            });
    };

    return manageTableInit;
};


function loadDefinedRightClickMenu(domID) {
    customOperateMenu.load(domID);
}

//现场操作详情
function siteOperationDetails(e, value, row, index) {
    customOperateMenu.initCustomMenu(e, row);    //初始化自定义菜单,并绑定事件
}


//现场操作模态框初始化
//公共开通
function initCommonOpeningModal(url, fn, row, parObj) {
    initOpeningModal('openingModal', '开通表计', url, fn, row, parObj);
}

//开通
function initOpeningModal(modalId, title, url, fn, row, parObj) {
    modalInit({
        modalFrame: "modal_department",
        modalID: modalId,
        title: title,
        submitUrl: url,
        handleFunction: fn,
        handleAdditionalData: row
    }, {
        modalItemIdList: ["steelNumber-open", "customerId-open", "customerName-open", "dialNumber-open", "fileImport-open"],
        allowModifyList: [false, "", false],
        allowEmptyList: ["", "", "", "", true],
        typeList: ["", "", "", "", "file"],
        labelTextList: ["表钢号", "客户号", "客户名", "表盘示数", "添加文件"],
        modalItemValueList: [parObj.steelNumber],
    });
    // $("#openingModal").modal('show');
    $("#customerId-open").blur(function () {
        var customerIdObj = {};
        customerIdObj.accountId = this.value;
        requestAjax("post", "/mpInfo/getCustomerInfoById", false, paraTransport(customerIdObj), "json", function (result) {
            if (result.state.code === 200) {
                $("#customerName-open").val(result.data.accountName);
                $("#dialNumber-open")[0].focus();
                $('#customerId-open').next().remove();
            } else {
                feedbackPromptsForCustom();
            }
        });
    });
    /*$("#modal-body").append(
        "<div class=\"form-group form-inline modalAddress\" id='dist-select' data-toggle=\"distpicker\">\n" +
        "<h4>\n" +
        "<label class=\"label-control\" for=\"installAddress-open\">安装地址:</label>\n" +
        "</h4>\n" +
        "<span id=\"installAddress-open\">\n" +
        "<select data-province=\"湖南省\" class=\"form-control\"></select>\n" +
        "<span>---</span>\n" +
        "<select data-city=\"长沙市\" class=\"form-control\"></select>\n" +
        "<span>---</span>\n" +
        "<select data-district=\"芙蓉区\" class=\"form-control\"></select>\n" +
        "</span>\n" +
        "</div>" +
        "<div class=\"form-group form-inline\">\n" +
        "<label class=\"label-control\" for=\"detailedAddress\">详细地址:</label>\n" +
        "<input class=\"form-control\" id=\"detailedAddress\"/>\n" +
        "</div>"
    );*/
    $("#dist-select").distpicker();
}

//公共换表
function initCommonChangeModal(modalId, title, url, fn, parObj) {
    initChangeModal(modalId, title, url, fn, parObj);
}

//检定、维修换表模态框
function initChangeModal(modalId, title, url, fn, parObj) {
    var modalObj = {
        modalFrame: "modal_department",
        modalID: modalId,
        title: title,
        submitUrl: url,
        handleFunction: fn
    };
    var itemObj = {
        modalItemIdList: ["customerName-testOne", "telephone-testOne"],
        allowModifyList: [false, false],
        labelTextList: ["客户名", "联系电话"],
        modalItemValueList: [parObj.pointName, parObj.telephone]
    };
    modalInit(modalObj, itemObj);
    //手动添加面板
    panelInsert("modal-body", "testOnePanel");
    //面板条目插入
    var panelBody = $("#testOnePanel .panel-body");
    modalItemInit({
        modalBodyId: panelBody[0].id,
        modalItemIdList: ["steelNumber-testOne-maintain", "terminalNumber-testOne-maintain"],
        labelTextList: ["表钢号", "期末表盘示数"],
        allowModifyList: [false],
        modalItemValueList: [parObj.steelNumber]
    });
    modalItemInit({
        modalBodyId: panelBody[1].id,
        modalItemIdList: ["steelNumber-testOne-reserve", "terminalNumber-testOne-reserve"],
        labelTextList: ["表钢号", "起始数"]
    });
    $("#terminalNumber-testOne-maintain").attr("placeholder", "请输入1-32位浮点数");
    $("#steelNumber-testOne-reserve").attr("placeholder", "请输入1-255位数字或字母");
    $("#terminalNumber-testOne-reserve").attr("placeholder", "请输入1-32位浮点数");
    var tempObj = {
        "mpId": parObj.mpId
    };
    requestAjax("post", "mpInfo/getDialDisplay", true, paraTransport(tempObj), "json", function (result) {
        if (result.state.code === 200) {
            $("#terminalNumber-testOne-maintain").val(result.data.value);
        } else {
            //console.log("未读取到表盘示数");
        }
    });
    // $("#testModalOne").modal('show');
}

//公共检定2
function initCommonTestTwo(modalId, title, url, fn) {
    initTestTwo(modalId, title, url, fn);
}

//检定(2)
function initTestTwo(modalId, title, url, fn) {
    modalInit({
        modalFrame: "modal_department",
        modalID: modalId,
        title: title,
        submitUrl: url,
        handleFunction: fn,
    }, {
        modalItemIdList: ["resultSelect-test", "file-test"],
        typeList: ["select", "file"],
        allowEmptyList: [false, true],
        labelTextList: ["检定结果选择", "检定记录单上传"],
    });
    //手动填充select合格与否
    $("#resultSelect-test").append(
        "<option value='1'>合格</option>\n" +
        "<option value='0'>不合格</option>"
    );
}

//公共维修2
function initCommonMaintainTwo(modalId, title, submitUrl, getOptionUrl, fn) {
    initMaintainTwo(modalId, title, submitUrl, getOptionUrl, fn);
}

//维修(2)
function initMaintainTwo(modalId, title, submitUrl, getOptionUrl, fn) {
    var allowEmptyList = [];
    var conclusionIdList = [];
    var conclusionNameList = [];
    var conclusionAnalysisIdList = [];
    var conclusionAnalysisNameList = [];
    var optionIdList = [];
    var optionNameList = [];
    var modalObj = {
        modalFrame: "modal_department",
        modalID: modalId,
        title: title,
        submitUrl: submitUrl,
        handleFunction: fn,
    };

    requestAjax("post", getOptionUrl, false, "", "json", function (result) {
        if (result.state.code === 200) {
            // a = {
            //     "data":
            //         [
            //             {
            //                 "conclusionId": "201903141552541580",
            //                 "conclusionName": "第一大队",
            //                 "option": [
            //                     {
            //                         "conclusionAnalysisId": "201903141553233759",
            //                         "conclusionAnalysisName": "传感器故障",
            //                     },
            //                     {
            //                         "conclusionAnalysisId": "201903141553233831",
            //                         "conclusionAnalysisName": "电路板芯片故障",
            //                     }, {
            //                         "conclusionAnalysisId": "201903141553233892",
            //                         "conclusionAnalysisName": "电池欠压",
            //                     }, {
            //                         "conclusionAnalysisId": "201904221555896666",
            //                         "conclusionAnalysisName": "其他",
            //                     }
            //                 ]
            //             },
            //             {
            //                 "conclusionId": "201903141552541621",
            //                 "conclusionName": "第二大队",
            //                 "option": [
            //                     {
            //                         "conclusionAnalysisId": "201903141553233950",
            //                         "conclusionAnalysisName": "靶片卡死",
            //                     },
            //                     {
            //                         "conclusionAnalysisId": "201903141553233975",
            //                         "conclusionAnalysisName": "阀门故障",
            //                     }, {
            //                         "conclusionAnalysisId": "201903141553234001",
            //                         "conclusionAnalysisName": "干簧管故障",
            //                     }, {
            //                         "conclusionAnalysisId": "201904221555896650",
            //                         "conclusionAnalysisName": "其他",
            //                     }
            //                 ]
            //
            //             }
            //         ],
            //     "state":
            //         {
            //             "code": 200,
            //             "description": "是否需要返回维修的业务属性success"
            //         }
            // };

            //checkbox转换使用部分
            for (let i = 0; i < result.data.length; i++) {
                conclusionIdList.push(result.data[i].conclusionId);
                conclusionNameList.push(result.data[i].conclusionName);
                conclusionAnalysisIdList = [];
                conclusionAnalysisNameList = [];
                for (let j = 0; j < result.data[i].option.length; j++) {
                    conclusionAnalysisIdList.push(result.data[i].option[j].conclusionAnalysisId);
                    conclusionAnalysisNameList.push(result.data[i].option[j].conclusionAnalysisName);
                }
                optionIdList.push(conclusionAnalysisIdList);
                optionNameList.push(conclusionAnalysisNameList);
            }

            modalObj.handleAdditionalData = conclusionIdList;
            //console.log(conclusionIdList);
            //console.log(conclusionNameList);
            //console.log(optionIdList);
            //console.log(optionNameList);

            var checkboxObj = {
                modalItemIdList: conclusionIdList.concat(["resultSelect-maintain", "file-maintain"]),
                typeList: [],
                allowEmptyList: [],
                labelTextList: conclusionNameList.concat(["维修结果选择:", "维修记录单上传"])
            };
            for (let i = 0; i < conclusionIdList.length; i++) {
                checkboxObj.typeList.push("box");
                checkboxObj.allowEmptyList.push(false);
            }
            checkboxObj.typeList = checkboxObj.typeList.concat(["select", "file"]);
            checkboxObj.allowEmptyList = checkboxObj.allowEmptyList.concat([false, true]);
            //以modal为基础生成
            modalInit(modalObj, checkboxObj);
            for (let i = 0; i < conclusionIdList.length; i++) {
                //以div为基础生成
                modalItemInit({
                    modalBodyId: conclusionIdList[i],
                    modalItemIdList: optionIdList[i],
                    typeList: "checkboxItems",
                    labelTextList: optionNameList[i],
                });
            }
            //手动填充select合格与否
            $("#resultSelect-maintain").append(
                "<option value='1'>合格</option>\n" +
                "<option value='0'>不合格</option>"
            );
        }
    });
}

//公共安检
function initCommonSecurityCheckModal(modalId, title, submitUrl, getOptionUrl, fn, parObj) {
    initSecurityCheckModal(modalId, title, submitUrl, getOptionUrl, fn, parObj);
}

//安检
function initSecurityCheckModal(modalId, title, submitUrl, getOptionUrl, fn, parObj) {
    requestAjax("get", getOptionUrl, false, "", "json", function (result) {
        if (result.state.code === 200) {
            //console.log(result.data);
            var conclusionIdList = [];
            var conclusionNameList = [];
            var typeOptionIdList = [];
            var typeOptionNameList = [];
            var optionIdList = [];
            var optionNameList = [];
            var allowEmptyList = [];
            $.each(result.data, function (index, ele) {
                typeOptionIdList = [];
                typeOptionNameList = [];
                conclusionIdList.push(ele.conclusionId);
                conclusionNameList.push(ele.conclusionName);
                $.each(ele.option, function (index, ele) {
                    typeOptionIdList.push(ele.conclusionAnalysisId);
                    typeOptionNameList.push(ele.conclusionAnalysisName);
                });
                optionIdList.push(typeOptionIdList);
                optionNameList.push(typeOptionNameList);
            });

            var modalObj = {
                modalFrame: "modal_department",
                modalID: modalId,
                title: title,
                submitUrl: submitUrl,
                handleFunction: fn,
                handleAdditionalData: conclusionIdList
            };
            var checkboxObj = {
                modalItemIdList: ["customerName-check", "steelNumber-check", "address-check", "dialDisplay"].concat(conclusionIdList).concat(["file-securityCheck"]),
                typeList: ["", "", "", ""],
                allowModifyList: [false, false, false, true],
                allowEmptyList: [false, false, false, true],
                labelTextList: ["客户名", "表钢号", "安装位置", "表盘示数"].concat(conclusionNameList).concat(["安检记录单上传"]),
                modalItemValueList: [parObj.pointName, parObj.steelNumber, parObj.openLocation, parObj.dialDisplay]
            };
            for (let i = 0; i < conclusionIdList.length; i++) {
                checkboxObj.typeList.push("box");
                checkboxObj.allowEmptyList.push(false);
            }
            checkboxObj.typeList = checkboxObj.typeList.concat(["file"]);
            checkboxObj.allowEmptyList = checkboxObj.allowEmptyList.concat([true]);
            //以modal为基础生成
            modalInit(modalObj, checkboxObj);
            for (let i = 0; i < conclusionIdList.length; i++) {
                //以div为基础生成
                modalItemInit({
                    modalBodyId: conclusionIdList[i],
                    modalItemIdList: optionIdList[i],
                    typeList: "checkboxItems",
                    labelTextList: optionNameList[i],
                });
            }
            $("#dialDisplay").attr("placeholder", "请输入1-32位浮点数");
        }
    });
    // $("#securityCheckModal").modal('show');
}

//公共维护
function initCommonRoutineMaintainModal(modalId, title, submitUrl, getOptionUrl, fn, parObj) {
    initRoutineMaintainModal(modalId, title, submitUrl, getOptionUrl, fn, parObj)
}

//维护
function initRoutineMaintainModal(modalId, title, submitUrl, getOptionUrl, fn, parObj) {
    requestAjax("get", getOptionUrl, false, "", "json", function (result) {
        if (result.state.code === 200) {
            //console.log(result.data);
            var conclusionIdList = [];
            var conclusionNameList = [];
            var typeOptionIdList = [];
            var typeOptionNameList = [];
            var optionIdList = [];
            var optionNameList = [];
            $.each(result.data, function (index, ele) {
                typeOptionIdList = [];
                typeOptionNameList = [];
                conclusionIdList.push(ele.conclusionId);
                conclusionNameList.push(ele.conclusionName);
                $.each(ele.option, function (index, ele) {
                    typeOptionIdList.push(ele.conclusionAnalysisId);
                    typeOptionNameList.push(ele.conclusionAnalysisName);
                });
                optionIdList.push(typeOptionIdList);
                optionNameList.push(typeOptionNameList);
            });

            var modalObj = {
                modalFrame: "modal_department",
                modalID: modalId,
                title: title,
                submitUrl: submitUrl,
                handleFunction: fn,
                handleAdditionalData: conclusionIdList
            };
            var checkboxObj = {
                modalItemIdList: ["customerName-check", "steelNumber-check", "address-check"].concat(conclusionIdList).concat(["file-routineMaintain"]),
                typeList: ["", "", ""],
                allowModifyList: [false, false, false],
                allowEmptyList: ["", "", ""],
                labelTextList: ["客户名    ", "表钢号", "安装位置"].concat(conclusionNameList).concat(["维护记录单上传"]),
                modalItemValueList: [parObj.pointName, parObj.steelNumber, parObj.openLocation]
            };
            for (let i = 0; i < conclusionIdList.length; i++) {
                checkboxObj.typeList.push("box");
                checkboxObj.allowEmptyList.push(false);
            }
            checkboxObj.typeList = checkboxObj.typeList.concat(["file"]);
            checkboxObj.allowEmptyList = checkboxObj.allowEmptyList.concat([true]);

            //以modal为基础生成
            modalInit(modalObj, checkboxObj);
            for (let i = 0; i < conclusionIdList.length; i++) {
                //以div为基础生成
                modalItemInit({
                    modalBodyId: conclusionIdList[i],
                    modalItemIdList: optionIdList[i],
                    typeList: "checkboxItems",
                    labelTextList: optionNameList[i],
                });
            }
        }
    });
}

//记录
function initSceneRecordModal() {
    modalInit({
        modalFrame: "modal_department",
        modalID: "sceneRecordModal",
        title: "现场操作记录",
    });
    var requestObj = {
        "mpId": globalObjRow.mpId //表计Id
    };
    //var accountName;
    /*requestAjax("post","mpInfo/getCustomerInfoByMpId",false, paraTransport(requestObj),"json",function (result) {
        if (result.state.code === 200) {
            accountName=result.data.accountName;
        }
    });*/
    requestAjax("post", "mpOperation/getMpBusinessOperationList", false, paraTransport(requestObj), "json", function (result) {
        var boxObj = {
            modalItemIdList: ["steelNumber-record", "customerName-record"],
            labelTextList: ["表钢号", "客户名"],
            typeList: ["", ""],
            allowModifyList: [false, false],
            modalItemValueList: [globalObjRow.steelNumber, globalObjRow.pointName]
        };
        console.log("查询操作记录" + result)
        if (result.state.code === 200) {
            $.each(result.data.businessOperationRecords, function (index, ele) {
                boxObj.modalItemIdList.push(ele.flowName + "--" + index);
                boxObj.typeList.push("box");
                boxObj.labelTextList.push("操作条目------------------------------------------");

            });
            modalItemInit(boxObj);
            $("#modal-body .itemsWrapper").removeClass('form-inline');
            var itemObj = {
                modalBodyId: null,
                modalItemIdList: [],
                allowModifyList: [false, false, false, false, false],
                labelTextList: ["操作时间", "操作类型", "状态", "操作内容", "操作人"],
                typeList: ["", "", "", "textArea"],
                modalItemValueList: [],
            };
            var userName;
            $.each(result.data.businessOperationRecords, function (index, ele) {
                var user = {
                    "userId": ele.operatorId
                }

                requestAjax("post", "UserInfo/getUserInfo", false, paraTransport(user), "json", function (result) {
                    if (result.code === 200) {
                        userName = result.data.name;
                    }
                });
                itemObj.modalBodyId = ele.flowName + "--" + index;
                itemObj.modalItemIdList = ["operationTime-" + index, "flowName-" + index, "status-" + index, "operationContent-" + index, "operator-" + index];
                itemObj.modalItemValueList = [ele.operationTime, ele.flowName, ele.status, ele.operationContent, userName];
                modalItemInit(itemObj);
                itemObj = {
                    modalBodyId: null,
                    modalItemIdList: [],
                    allowModifyList: [false, false, false, false, false],
                    labelTextList: ["操作时间", "操作类型", "状态", "操作内容", "操作人"],
                    modalItemValueList: [],
                };
            });
            console.log(result.data);
        } else {
            console.log("未获得记录");
        }
    });
}

//公共废弃
function commonDelMeter(row, modalId, title, submitUrl, optionUrl, fn, parObj) {
    delMeterDetails(row, modalId, title, submitUrl, optionUrl, fn, parObj);
}

//废弃
function delMeterDetails(row, modalId, title, submitUrl, optionUrl, fn, parObj) {
    var modalPar = {
        modalFrame: "modal_department",
        modalID: modalId,
        title: title,
        submitUrl: submitUrl,
        handleFunction: fn,
        handleAdditionalData: row
    };

    var conclusionIdList = [];
    var conclusionNameList = [];
    var conclusionAnalysisIdList = [];
    var conclusionAnalysisNameList = [];
    var optionIdList = [];
    var optionNameList = [];
    requestAjax("post", optionUrl, false, "", "json", function (result) {
        if (result.state.code === 200) {
            //checkbox转换使用部分
            for (let i = 0; i < result.data.length; i++) {
                conclusionIdList.push(result.data[i].conclusionId);
                conclusionNameList.push(result.data[i].conclusionName);
                conclusionAnalysisIdList = [];
                conclusionAnalysisNameList = [];
                /*for (let j = 0; j < result.data[i].option.length; j++) {
                    conclusionAnalysisIdList.push(result.data[i].option[j].conclusionAnalysisId);
                    conclusionAnalysisNameList.push(result.data[i].option[j].conclusionAnalysisName);
                }*/
                /*optionIdList.push(conclusionAnalysisIdList);
                optionNameList.push(conclusionAnalysisNameList);*/
            }
            var checkboxObj = {
                modalItemIdList: ["steelNumber-del", "openingTime-del", "factory-del", "devVersion-del", "typeSelect-del"].concat(conclusionIdList).concat(["file-delete"]),
                allowModifyList: [false, false, false, false],
                allowEmptyList: [false, false, false, false, false, true, true, true],
                typeList: ["", "", "", "", "select", "box", "box", "file"],
                labelTextList: ["表钢号", "创建时间", "厂家", "型号", "废弃原因选择"].concat(["", ""]).concat(["废弃文件上传"]),
                modalItemValueList: [parObj.steelNumber, parObj.createTime, parObj.manufacture, parObj.versionName].concat(conclusionIdList)
            };
            //以modal为基础生成
            modalInit(modalPar, checkboxObj);
            for (let i = conclusionIdList.length - 1; i >= 0; i--) {
                //手动填充select正常与非正常
                $("#typeSelect-del").append(
                    "<option value='" + conclusionIdList[i] + "'>" + conclusionNameList[i] + "</option>"
                );
            }
            var data = {
                "conclusionId": conclusionIdList[1]
            };
            requestAjax("post", "mpOperation/getBusinessAttrsByConclusionId", false, paraTransport(data), "json", function (result) {
                if (result.state.code == 200) {
                    $.each(result.data, function (index, obj) {
                        optionIdList.push(obj.conclusionAnalysisId);
                        optionNameList.push(obj.conclusionAnalysisName);
                    })
                }
            });
            modalItemInit({
                modalBodyId: conclusionIdList[1],
                modalItemIdList: optionIdList,
                typeList: "radioItems",
                labelTextList: optionNameList,
            });
            $("#" + conclusionIdList[0]).parent().hide();

            // 以div为基础生成
            $("#typeSelect-del").change(function () {
                optionIdList = [];
                optionNameList = [];
                // for (let i = conclusionIdList.length - 1; i >= 0; i--) {
                $("#" + conclusionIdList[1]).empty();
                // if ($("#typeSelect-del").val() === conclusionIdList[i]) {
                var datas = {
                    "conclusionId": $("#typeSelect-del").val()
                };
                requestAjax("post", "mpOperation/getBusinessAttrsByConclusionId", false, paraTransport(datas), "json", function (result) {
                    if (result.state.code == 200) {
                        $.each(result.data, function (index, obj) {
                            optionIdList.push(obj.conclusionAnalysisId);
                            optionNameList.push(obj.conclusionAnalysisName);
                        })
                    }
                });
                modalItemInit({
                    modalBodyId: conclusionIdList[1],
                    modalItemIdList: optionIdList,
                    typeList: "radioItems",
                    labelTextList: optionNameList
                });
                // }
                // }
            });

        }
    });

}

//初始化模态框
/**
 *
 * @param modalPar
 * @param modalItemPar
 */
function modalInit(modalPar, modalItemPar) {
    if (modalPar.modalID) {
        modal = commModal();
        modal.modalInit(modalPar);
        if (modalItemPar) {
            modalItemInit(modalItemPar);
        }
        $("#modal_department").modal("show");
    } else {
        //console.log("未接收到modalID");
    }
}

//初始化modalItem
function modalItemInit(modalItemPar) {
    modalItem = comModalItem();
    if (!modalItemPar.modalBodyId) {
        modalItemPar.modalBodyId = modal.domObj.body.id;
    }
    modalItem.modalItemInit(modalItemPar);
}

/**
 * 判断变量是否为空
 * @param str
 * @returns {boolean}
 */
function judgeIsEmpty(str) {
    console.log("进入了commFunction");
    var judge = false;
    if (str == null || str === '' || str.length === 0) {
        judge = true;
        return judge;
    }
    return judge;
}

/**
 * 判断区域树是否被选中
 * @returns {*}
 */
function judgementAreaTreeIsSelected() {
    const select_node = $('#treeview').treeview('getSelected');//获得选中的节点
    if (select_node[0]) {
        return select_node[0].id;
    }
    return "";
}

function unifiedOperationalFeedbackPrompts(result) {
    // console.log("操作反馈的统一提示方法" + "公共方法中的结果:     " + result.state.description);
    // alert("公共方法中的结果:     " + result.state.description);
    alert2(result.state.description);
    if (result.state.code === 200) {
        $("#modal_department").modal("hide");
        $("#modal_department").empty();
        $("#tb_departments").bootstrapTable("refresh");
    }
}

function operationalFeedbackPrompts(result, tableID) {
    // console.log("操作反馈的统一提示方法" + "公共方法中的结果:     " + result.state.description);
    // alert("公共方法中的结果:     " + result.state.description);
    alert2(result.state.description);
    if (result.state.code === 200) {
        $("#modal_department").modal("hide");
        $("#modal_department").empty();
        $("#" + tableID).bootstrapTable("refresh");
    }
}

function feedbackPromptsForCustom() {
    if ($('#customerId-open').siblings().length == 1) {
        $('#customerId-open').after('<span style="color:red"> * 客户号不存在<span>');
    }
}


function paraTransport(requestData) {
    return "parameter=" + JSON.stringify(requestData);
}

function ajaxWithFiles(url, textObj, fileImportId) {
    let requestObj = new FormData();
    let filesUrl = document.getElementById(fileImportId).files;
    for (let i = 0; i < filesUrl.length; i++) {              // 多个文件上传的情况，需要啊后台进行字段匹配如：上方的importFile
        requestObj.append('uploadFileList', filesUrl[i]);
    }
    requestObj.set('parameter', JSON.stringify(textObj));
    $.ajax({
        url: url,
        type: 'post',
        data: requestObj,
        cache: false,
        async: false,
        dataType: 'json',
        processData: false,
        contentType: false,
        success: function (result) {
            console.log("操作反馈的统一提示方法");
            unifiedOperationalFeedbackPrompts(result);
        }
    });
}

function ajaxFiles(url, textObj, fileImportId) {
    let res;
    let requestObj = new FormData();
    let filesUrl = document.getElementById(fileImportId).files;
    for (let i = 0; i < filesUrl.length; i++) {              // 多个文件上传的情况，需要啊后台进行字段匹配如：上方的importFile
        requestObj.append('uploadFileList', filesUrl[i]);
    }
    requestObj.set('parameter', JSON.stringify(textObj));
    $.ajax({
        url: url,
        type: 'post',
        data: requestObj,
        cache: false,
        async: false,
        dataType: 'json',
        processData: false,
        contentType: false,
        success: function (result) {
            console.log("允许传表格id的公共处理");
            res = result;
        }
    });
    return res;
}


function panelInsert(modalId, panelId) {
    $("#" + modalId).append(
        "                <div class=\"form-group form-inline modalInfoCard\" id=\"" + panelId + "\">\n" +
        // "                    <h2 class=\"text-center\">表计信息</h2>\n" +
        "                    <div class=\"panel panel-default panel-originalMeter d-inlineBlock\" style=\"width:48%;\">\n" +
        "                        <div class=\"panel-heading\">\n" +
        "                            <h3 class=\"panel-title\">现场表计信息</h3>\n" +
        "                        </div>\n" +
        "                        <div class=\"panel-body\" id='maintainDev'>\n" +
        "                        </div>\n" +
        "                    </div>\n" +
        "                    <div class=\"panel panel-default panel-spareMeter d-inlineBlock\" style=\"width:48%;\">\n" +
        "                        <div class=\"panel-heading\">\n" +
        "                            <h3 class=\"panel-title\">未开通表计信息</h3>\n" +
        "                        </div>\n" +
        "                        <div class=\"panel-body\" id='reserveDev'>\n" +
        "                        </div>\n" +
        "                    </div>\n" +
        "                </div>"
    );
}

function commReturnAjax(url, name, param) {

    var returnMsg = null;

    $.ajax({
        type: "POST",
        url: url,
        data: getData(name, param),
        async: false,                                                                       //取消异步
        dataType: "json",
        success: function (msg) {
            returnMsg = msg;
        }
    });

    function getData(name, param) {
        var data = "";
        if (name) data += name + "=";
        if (param) data += JSON.stringify(param);
        return data.trim() != "" ? data : null;
    }

    return returnMsg;
}

function commReturnAjaxBody(url, param) {

    var returnMsg = null;

    $.ajax({
        url: url,
        type: "POST",
        data: JSON.stringify(param),
        async: false,//取消异步
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (msg) {
            returnMsg = msg;
        }
    });
    return returnMsg;
}

function dataFormat(date, fmt) {
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)

    var timestamp = date.getTime();

    var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "H+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;

}


//获取表头
function getTableHeader(tableName, statusCode) {
    const columnsArray = [];
    var requestObj = {};
    requestObj.tableName = tableName;
    const requestData = "parameter=" + JSON.stringify(requestObj);
    console.log(requestData);
    requestAjax("POST", "table/getHeader", false, requestData, "json", function (result) {
        $.each(result.data, function (x, Item) {
            var temp = {
                field: Item.id,
                title: Item.name,
                align: "center"
            };
            columnsArray.push(temp);
        });
    });
    return columnsArray;
}

function requestAjax(type, url, async, data, dataType, callback) {
    // var myUrl = 'http://api.com';
    // var result = Mock.mock(myUrl, {
    //     "user|5-10": [{
    //         'name': '@cname', //中文名称
    //         'age|1-100.1-3': 100, //100以内随机整数
    //         'birthday': '@date("yyyy-MM-dd")', //日期
    //         'city': '@city(true)' //中国城市
    //     }]
    // });

    var myTimeOut = null;
    $.ajax({
        type: type,
        // url:myUrl,
        url: url,
        beforeSend: function () {
            console.log("准备好发送请求了");
        },
        complete: function () {
            console.log("请求发送完毕了");
        },
        async: async,
        data: data,
        dataType: dataType,
        success: function (result) {
            // console.log(result);
            callback(result);
        },
        error: function (result) {
            callback(result);
        }
    });
}

/**
 *   获取表格查询条件
 * @param params
 * @returns {string}
 */
function getTableQueryCondition(params, tableName) {
    var page = getTableQueryPage(params);
    var property = getTableQueryProperty(tableName);
    return mergeJsonObject(page, property);
}

/**
 * 获取表格的page
 * @param params
 * @returns {{page: {pageLine: *, pageIndex: number}}}
 */
function getTableQueryPage(params) {
    var page = {
        "page": {
            pageLine: params.limit,   //页面大小
            pageIndex: params.offset / params.limit + 1  //页码
            // ,sort : params.sort,
            // order : params.order
        }
    };
    return page;
}

function mergeJsonObject(jsonObject1, jsonObject2) {
    var resultJsonObject = {};
    for (var attr in jsonObject1) {
        resultJsonObject[attr] = jsonObject1[attr];
    }
    for (var attr in jsonObject2) {
        resultJsonObject[attr] = jsonObject2[attr];
    }
    return JSON.stringify(resultJsonObject);
}

function splitTime(strTime) {
    var time = strTime.split("至");
    return time;
}

function loadFrameHeight(headId, panelId) {
    // $("#" + panelId).height($(window).height() - 66 - 30);
    $("#" + panelId).height($(window).height() - 2);
}

function setInnerItemHeight(wrapper, item, coe) {
    item.height(wrapper.height() * coe);
}

function alert2(data) {
    // alert(data);
    console.log(data);
    var showModal = '<div class="modal fade" id="modal_tips" tabindex="-10" role="dialog">' +
        '<div class="modal-dialog" role="document" style="top:100px;">' +
        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">' +
        '&times;' +
        '</button>' +
        '<h4 class="modal-title">提示信息</h4>' +
        '</div>' +
        '<div class="modal-body">' +
        '<h4>' + data + '</h4>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';

    var selector = '#modal_tips';
    if ($(selector)) {
        $(selector).remove();
    }
    $('body').append(showModal);
    $(selector).modal('show');

}

var hdCommon = (function () {
        var com = Object();

        com.alert = function (data) {
            var showModal = '<div class="modal fade" id="modal_tips" tabindex="-10" role="dialog">' +
                '<div class="modal-dialog" role="document" style="top:100px;">' +
                '<div class="modal-content">' +
                '<div class="modal-header">' +
                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">' +
                '&times;' +
                '</button>' +
                '<h4 class="modal-title">提示信息</h4>' +
                '</div>' +
                '<div class="modal-body">' +
                '<h4>' + data + '</h4>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
            var selector = '#modal_tips';
            if ($(selector)) {
                $(selector).remove();
            }
            $('body').append(showModal);
            $(selector).modal('show');
        };

        com.splitTime = function (strTime) {
            if (strTime) {
                var time = strTime.split(" 至 ");
                return time;
            } else {
                return [];
            }
        };

        com.completeTime = function (time, type) {
            let timeArr = this.splitTime(time);
            let timeObj = {}
            switch (type) {
                case 1:
                case 2:
                    timeObj.startTime = timeArr[0] + " 00:00:00";
                    timeObj.endTime = timeArr[1] + " 00:00:00";
                    break;
                case 3:
                    timeObj.startTime = timeArr[0] + "-01 00:00:00";
                    timeObj.endTime = timeArr[1] + "-01 00:00:00";
                    break;
                case 4:
                    timeObj.startTime = timeArr[0] + "-01-01 00:00:00";
                    timeObj.endTime = timeArr[1] + "-01-01 00:00:00";
                    break;
                case 0:
                default:
                    timeObj.startTime = timeArr[0].slice(0, 13) + ":00:00";
                    timeObj.endTime = timeArr[1].slice(0, 13) + ":00:00";
                    break;
            }
            return timeObj;
        };

        com.initTimePlugin = function (ele, type, rangeOrNot, format, done) {
            var obj = {
                elem: ele
            }
            if (format) {
                obj.format = format;
            }
            if (type) {
                obj.type = type;
            }
            if (rangeOrNot) {
                obj.range = rangeOrNot;
            }
            if (done) {
                obj.done = done;
            }
            laydate.render(obj);
        };

        com.initTimeObj = function (ele, confObj) {
            var defaultObj = {
                elem: ele
            }
            $.extend(defaultObj, confObj, true);
            laydate.render(defaultObj);
        };

        com.getFullTime = function (type) {
            var tf = function (i) {
                return (i < 10 ? '0' : '') + i
            };
            var time = new Date();
            var year = time.getFullYear();
            year = year < 1900 ? year + 1900 : year;
            var month = tf(time.getMonth() + 1);
            var day = tf(time.getDate());
            var hour = tf(time.getHours());
            var minutes = tf(time.getMinutes());
            var seconds = tf(time.getSeconds());

            if (!type || type == "date") {
                return year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds;
            } else if (type == "day") {
                return year + "-" + month + "-" + day;
            } else if (type == "month") {
                return year + "-" + month;
            }
        };

        com.getFullTimeObj = function () {
            var tf = function (i) {
                return (i < 10 ? '0' : '') + i
            };
            var time = new Date();
            var year = time.getFullYear();
            year = year < 1900 ? year + 1900 : year;
            var month = tf(time.getMonth() + 1);
            var day = tf(time.getDate());
            var hour = tf(time.getHours());
            var minutes = tf(time.getMinutes());
            var seconds = tf(time.getSeconds());
            return {
                year: year,
                month: month,
                day: day,
                hour: hour,
                minutes: minutes,
                seconds: seconds
            }
        };

        com.getRelativeBeforeTime = function (dateType, dateTime, num) {
            var xHour;
            var num = num ? num : 1;

            function tf(i) {
                return (i < 10 ? '0' : '') + i
            };

            function getMonthDate(year, month) {
                var d = new Date(year, month, 0);
                return d.getDate();
            };

            function getYearDate(year) {
                if (year % 4 === 0 && year % 100 !== 0) {
                    return 366;
                } else if (year % 400 === 0) {
                    return 366;
                }
                else {
                    return 365;
                }
            };

            switch (dateType) {
                case "1":
                    xHour = 1 * num;
                    break;
                case "2":
                    xHour = 24 * num;
                    break;
                case "3":
                    xHour = 24 * num * getMonthDate(dateTime.slice(0, 4), dateTime.slice(5, 7));   //29
                    break;
                case "4":
                    xHour = 24 * num * getYearDate(dateTime.slice(0, 4));   //29
                    break;
            }
            var chooseDate = new Date(dateTime.replace(/-/g, '/'));  //开始时间
            var t = chooseDate.getTime() - xHour * 60 * 60 * 1000;
            let d = new Date(t);
            let theMonth = tf(d.getMonth() + 1);
            let theDate = tf(d.getDate());
            let theHours = tf(d.getHours());
            let theMinutes = tf(d.getMinutes());
            let theSeconds = tf(d.getSeconds());

            let date = d.getFullYear() + '-' + theMonth + '-' + theDate;
            let time = theHours + ':' + theMinutes + ":" + theMinutes;
            let oSpare = date + ' ' + time;
            return oSpare;
        };

        //节流
        com.throttle = function (handler, wait) {
            //执行 等待一秒 执行 等待一秒 时间戳
            var lastTime = 0;
            return function (e) {
                var nowTime = new Date().getTime();
                console.log(nowTime - lastTime);
                if (nowTime - lastTime > wait) {

                    // handler();
                    handler.apply(this, arguments);
                    lastTime = nowTime;             //新老时间节点交替
                }
            }
        };

        //防抖
        com.debounce = function (handler, delay) {
            var timer = null;
            return function () {
                var _self = this;
                var _arg = arguments;
                clearTimeout(timer);
                timer = setTimeout(function () {
                    handler.apply(_self, _arg);
                }, delay)
            }
        };

        com.itemsFormat = function (arr) {
            //transform item 接受的格式
            var newArr = [];
            $.each(arr, function (index, ele) {
                var oNew = {
                    itemId: ele.id,
                    label: {
                        text: ele.name
                    },
                    type: ele.inputType,
                    value: ele.value,
                    validType: ele.validType
                };
                if (ele.options && ele.options.length > 0) {
                    oNew.options = {}
                    oNew.options.content = [];
                    $.each(ele.options, function (index, opt) {
                        oNew.options.content[index] = {};
                        oNew.options.content[index].value = opt.optionId ? opt.optionId : opt.value;
                        oNew.options.content[index].text = opt.optionName ? opt.optionName : opt.text;
                    });
                }
                newArr[index] = oNew;
            });

            return newArr;
        };

        com.feedback = function (modal, table, result) {
            com.alert(result.state.description);
            if (result.state.code === 200) {
                modal.modal("hide");
                table.bootstrapTable("refresh");
            }
        };

        com.confirm = function (msg, handler) {
            var showModal = '<div class="modal fade" id="modal_confirm" tabindex="-10" role="dialog">' +
                '<div class="modal-dialog" role="document" style="top:100px;">' +
                '<div class="modal-content">' +
                '<div class="modal-header">' +
                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">' +
                '&times;' +
                '</button>' +
                '<h4 class="modal-title">提示信息</h4>' +
                '</div>' +
                '<div class="modal-body">' +
                '<h4>' + msg + '</h4>' +
                '</div>' +
                '<div class="modal-footer">' +
                '<button type="button" class="btn btn-default cancel" data-dismiss="modal">取消</button>' +
                '<button type="button" class="btn btn-primary submit" data-dismiss="modal" id="confirm-sure">确定</button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
            var selector = '#modal_confirm';
            var confirmBtn = '#confirm-sure';

            if ($(selector)) {
                $(selector).remove();
            }
            $('body').append(showModal);
            $(selector).modal('show');

            $(confirmBtn).on("click", function () {
                handler();
            });

        };

        com.request = function (obj) {
            var _temp = {
                url: "",
                async: false,
                data: "",
                type: "POST",
                dataType: "json",
                beforeSend: function () {
                    // console.log("准备好发送请求了");
                },
                success: function () {
                    // console.log("发送请求成功了");
                },
                complete: function () {
                    // console.log("请求发送完毕了");
                },
                error: function (res) {
                    com.alert("请求失败");
                }
            };
            $.extend(true, _temp, obj);
            $.ajax(_temp);
        };

        //attrItems适用
        com.attrItemsFormat = function (arr) {
            var formatArr = [];
            var temp = {};
            $.each(arr, function (index, ele) {
                temp = {
                    itemId: ele.id,
                    label: {
                        text: ele.name
                    },
                    value: ele.value,
                    validType: ele.validType ? ele.validType : ele.name
                };
                formatArr.push(temp);
            });
            return formatArr;
        }

        com.ajaxFiles = function (url, textObj, fileImportId) {
            let res;
            let requestObj = new FormData();
            let filesUrl = document.getElementById(fileImportId).files;
            for (let i = 0; i < filesUrl.length; i++) {              // 多个文件上传的情况，需要啊后台进行字段匹配如：上方的importFile
                requestObj.append('uploadFileList', filesUrl[i]);
            }
            requestObj.set('parameter', JSON.stringify(textObj));
            $.ajax({
                url: url,
                type: 'post',
                data: requestObj,
                cache: false,
                async: false,
                dataType: 'json',
                processData: false,
                contentType: false,
                success: function (result) {
                    console.log("允许传表格id的公共处理");
                    res = result;
                }
            });
            return res;
        }

        com.operationalFeedbackPrompts = function (result, $tableID, $modalID) {
            com.alert(result.state.description);
            if (result.state.code == 200) {
                $modalID.modal("hide");
                $modalID.empty();
                $tableID.bootstrapTable("refresh");
            }
        }

        com.operationalFeedbackPromptsNoState = function (result, $tableID, $modalID) {
            com.alert(result.description);
            if (result.code == 200) {
                $modalID.modal("hide");
                $modalID.empty();
                $tableID.bootstrapTable("refresh");
            }
        }

        com.operationalFeedbackPromptsOnlyModal = function (result, $modalID) {
            com.alert(result.description);
            if (result.code == 200) {
                $modalID.modal("hide");
                $modalID.empty();
            }
        }

        com.feedbackPromptsByComponents = function (result, table, modal) {
            com.alert(result.description);
            if (result.code == 200) {
                modal.hdHide(true);
                table.hdstTable("refresh");
            }
        }

        com.returnAjax = function (url, name, param) {                                              //name是否存在决定传输格式？
            var returnMsg = "";
            $.ajax({
                type: "POST",
                url: url,
                data: getData(name, param),
                async: false,                                                                       //取消异步
                dataType: "json",
                success: function (msg) {
                    returnMsg = msg;
                }
            });

            function getData(name, param) {
                var data = "";
                if (name) data += name + "=";
                if (param) data += JSON.stringify(param);
                return data.trim() != "" ? data : null;
            }

            return returnMsg;
        }

        com.returnAjaxObj = function (url, obj) {                                              //name是否存在决定传输格式？
            var returnMsg = "";
            $.ajax({
                type: "POST",
                url: url,
                contentType: "application/json",
                data: JSON.stringify(obj),
                async: false,                                                                       //取消异步
                dataType: "json",
                success: function (msg) {
                    returnMsg = msg;
                }
            });

            return returnMsg;
        };

        com.ztreeFormat = function (data) {
            var ztreeData = [];
            $.each(data, function (index, ele) {
                var node = {
                    id: ele.nodeId,
                    pId: ele.parentId,
                    name: ele.nodeName,
                    data: ele
                };
                ztreeData.push(node);
            });
            return ztreeData;
        }

        com.ztreeDeepFormat = function (treeData) {
            var ztreeData = [];
            loop(treeData, ztreeData);

            function loop(data, contain) {
                $.each(data, function (index, ele) {
                    var node = {
                        id: ele.nodeId,
                        pId: ele.parentId,
                        name: ele.nodeName,
                        children: ele.nodeChildren,
                        data: ele
                    };
                    contain.push(node);
                    if (node.children && node.children.length > 0) {
                        var container = [];
                        loop(node.children, container)
                        node.children = container;
                    }
                });
            }

            return ztreeData;
        }

        com.resetTable = function (table) {
            //重点就在这里，获取渲染后的数据列td的宽度赋值给对应头部的th,这样就表头和列就对齐了
            var parent = $("#" + commTableObj.defaultOption.tableID).parent().parent().parent();
            var header = parent.find(".fixed-table-header table thead tr th");
            var cell = parent.find(".fixed-table-header table thead tr th .fht-cell");
            var body = parent.find(".fixed-table-body table tbody tr td");
            var footer = parent.find(".fixed-table-footer table tr td .fht-cell");
            body.each(function (index, ele) {
                if (index > header.length - 1 || header.length == 0) return false;//最后一个自动计算，当出现滚动条时，会出现并不相等的情况
                const innerWidth = ele.clientWidth;
                $(header[index]).width(innerWidth);//head与cell的生效情况不一样
                $(cell[index]).width(innerWidth);
                $(footer[index]).width(innerWidth);
            });
        }

        com.stateJudge = function (res) {
            let obj = JSON.parse(res);
            if (obj.code == 200 || obj.code == 204) {
                return obj.data;
            }
        }

        com.headerFormat = function (arr) {
            let contain = [];
            $.each(arr, function (index, ele) {
                let head = {
                    title: ele.alias,
                    field: ele.id,
                    data: ele.unit,
                };
                contain.push(head);
            });
            return contain;
        }

        com.headerFormatName = function (arr) {
            let contain = [];
            $.each(arr, function (index, ele) {
                let head = {
                    title: ele.name,
                    field: ele.id,
                    data: ele.unit,
                    sortable: ele.sortable
                };
                if (ele.visible == false) {
                    head.visible = false;
                }
                if (ele.order) head.order = ele.order;
                contain.push(head);
            });
            return contain;
        }

        com.getUserName = function () {
            return document.cookie.split("username=")[1];
        };

        com.getAreaTree = function () {
            let treeData;
            $.ajax("hdst/area/getAuthorityAreaTree", {
                type: 'GET',
                success: function (result) {
                    treeData = com.ztreeDeepFormat(result);
                },
                error: function (result) {
                    console.log(result);
                }
            });
            return treeData;
        }

        com.downloadFile = function () {
            var temp = document.createElement("form"); //创建form表单
            temp.target = "self";
            var url = arguments[0];
            temp.action = url;
            temp.method = "post";
            temp.style.display = "none";//表单样式为隐藏
            for (var i = 1; i < arguments.length; i++) {
                var opt = document.createElement("input");  //添加input标签
                opt.type = "text";   //类型为text
                opt.name = arguments[i++];    //设置name属性
                opt.value = arguments[i];   //设置value属性
                temp.appendChild(opt);
            }
            document.body.appendChild(temp);
            temp.submit();
        }

        Array.prototype.remove = function (val) {
            var index = this.indexOf(val);
            if (index > -1) {
                this.splice(index, 1);
            }
        };

        return com;
    }()
);