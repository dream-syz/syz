let commModal = function () {
    let commModalObj = Object.create(null);
    commModalObj.defaults = {
        modalID: null,
        title: "未定义",
        type: null,
        purpose: null,
        submitUrl: null,
        modalFrame: null,
        handleFunction: null,
        handleAdditionalData: null
    };
    commModalObj.domObj = {
        head: null,
        body: null,
        foot: null
    };

    commModalObj.modalInit = function (parObj) {
        if (parObj.modalID) {
            commModalObj.modalSetOption(parObj);
            commModalObj.modalObj = $('#' + commModalObj.defaults.modalID);
            commModalObj.modalFrameFill(parObj.modalFrame, commModalObj.defaults.type, commModalObj.defaults.purpose);
        } else {
            console.log("未接收到modalID");
        }
        commModalObj.modalClear();         //清空模态框
        commModalObj.modalFill();          //加载新的模态框
    };

    commModalObj.modalSetOption = function (options) {
        commModalObj.defaults = $.extend({}, commModalObj.defaults, options);

        // commModalObj.defaults.modalID = options.modalID;
        // commModalObj.defaults.modalFrame = options.modalFrame;
        // if (options.title) {
        //     commModalObj.defaults.title = options.title;
        // }
        // if (options.submitUrl) {
        //     commModalObj.defaults.submitUrl = options.submitUrl;
        // }
        // if (options.type) {
        //     commModalObj.defaults.type = options.type;
        // }
        if (options.handleFunction) {
            commModalObj.defaults.handleFunction = options.handleFunction;
        } else {
            commModalObj.defaults.handleFunction = function (res) {
                // var temp = {
                //     "rows": res.rows, // 具体每一个bean的列表
                //     "total": res.total  // 总共有多少条返回数据
                // };
                // $.each(res.rows, function (index, item) {
                //     $.each(item.items, function (x, Item) {
                //         var val = Item.id;
                //         if(null!=Item.unit){
                //             console.log(Item.value+Item.unit);
                //             temp.rows[index][val] = Item.value+Item.unit;//这是第几个对象
                //         }else{
                //             temp.rows[index][val] = Item.value;//这是第几个对象
                //         }
                //     });
                // });
                // return temp;
                console.log("默认处理方法");
            }
            // }
            // if (options.handleAdditionalData) {
            //     commModalObj.defaults.handleAdditionalData = options.handleAdditionalData;
            // }
            // console.log(options);
            // console.log(commModalObj.defaults);
            // }
        }
    };
    commModalObj.modalClear = function () {
        console.log("清空模态框");
        commModalObj.domObj.head.innerHTML = "";
        $(commModalObj.domObj.body).empty();
    };

    commModalObj.modalFill = function () {
        console.log("加载新的模态框");
        commModalObj.domObj.head.innerHTML = commModalObj.defaults.title;
    };

    commModalObj.modalFormSubmit = function (obj, url) {
        $(obj).click(function () {
            if ($(obj).text() === "确定") {
                $('#' + commModalObj.defaults.modalFrame).modal('hide');
            } else {
                console.log("绑定按钮提交地址=" + url);
                commModalObj.getInputValueList(commModalObj.defaults.modalFrame, commModalObj.defaults.handleFunction, commModalObj.defaults.submitUrl);
            }
        });
    };

    commModalObj.modalFrameFill = function (modalFrame, modalType, purpose) {
        console.log("加载模态框框架");
        $('#' + modalFrame).html("<div class='modal-dialog' role='document' id=" + commModalObj.defaults.modalID + ">" +
        "<div class='modal-content''>\n" +
        "<div class='modal-header'>\n" +
        "<button type='button' class='close' data-dismiss='modal' aria-label='close'><span>×</span></button>\n" +
        "<h4 class='modal-title' id='modal-title'></h4>\n" +
        "</div>\n" +
        "<div class='modal-body' id='modal-body'  style='max-height:600px;overflow-y:scroll;'></div>\n" +
        "<div class='modal-footer'>\n" +
        "<button type='button' class='btn btn-default' data-dismiss='modal'>\n" +
        "取消\n" +
        "</button>\n" +
        "<button type='button' class='btn btn-primary' id='modal-commit'>\n" +
        "提交\n" +
        "</button>\n" +
        "</div>\n" +
        "</div>\n" +
        "</div>");

        if (!commModalObj.defaults.submitUrl) {
            $("#modal-commit").text("确定");
        }
        if (modalType) {
            var $modalDocument = $('.modal-dialog');
            var $modalContent = $('.modal-content');
            switch (modalType) {
                case "large" :
                    $modalDocument.addClass('modal-lg');
                    $modalContent.css('maxHeight', '850px');
                    break;
                case "enlarge" :
                    $modalDocument.width('1300px');
                    $modalContent.css('maxHeight', '900px');
            }
        }
        if (purpose === "browse") {
            $('#' + commModalObj.defaults.modalID + ' .modal-footer').remove();
        }
        commModalObj.domObj.head = document.getElementById('modal-title');
        commModalObj.domObj.body = document.getElementById("modal-body");
        commModalObj.domObj.foot = document.getElementById("modal-commit");

        //绑定提交地址
        commModalObj.modalFormSubmit(commModalObj.domObj.foot, commModalObj.defaults.submitUrl);
    };


    commModalObj.getInputValueList = function (modalBody, handleName, callbackUrl) {
        let inputList = $("#" + modalBody).find("input,select,textarea");
        inputList = [].slice.call(inputList, 0);

        //allInputList为了解决allowEmpty部分
        let allInputList = inputList.slice(0);

        for (let j = 0; j < inputList.length; j++) {
            if ($(inputList[j]).hasClass('allowEmpty')) {
                inputList.splice(j, 1);
                j--;
            }
        }

        //获取包含allowEmpty的另一个数组
        let allValueList;
        if (allInputList) {
            allValueList = Array();
            for (var j = 0; j < allInputList.length; j++) {
                allValueList.push($(allInputList).eq(j).val().trim());
            }
        } else {
            allValueList = allInputList.val().trim();
        }


        let inputValueList;
        if (inputList) {
            inputValueList = Array();
            for (var i = 0; i < inputList.length; i++) {
                inputValueList.push($(inputList).eq(i).val().trim());
            }
        } else {
            inputValueList = inputList.val().trim();
        }

        let judgeEmptyResult = true;
        for (let i = 0; i < inputList.length; i++) {
            if (judgeIsEmpty(inputValueList[i])) {
                judgeEmptyResult = false;
            }
        }
        if (judgeEmptyResult) {
            // handleName(callbackUrl, inputValueList, commModalObj.defaults.handleAdditionalData);
            handleName(callbackUrl, allValueList, commModalObj.defaults.handleAdditionalData);
        } else {
            alert2("请确认信息完整");
        }
    };

    commModalObj.getObjList = function () {
        let domList = $('#' + commModalObj.defaults.modalFrame).find("input,select");
        let oItems = [];
        $.each(domList, function (index, ele) {
            oItems.push({
                'id': ele.id,
                'value': ele.value,
            })
        });
        return oItems;
    };


    //分割线
    commModalObj.tableHeader = {
        columns: [{
            title: null,//表头名
            field: null//对应的数据对象名
        }],
        idField: null,
        option: {
            checkbox: false
        }
    };
    commModalObj.modalObj = {};
    commModalObj.init = function (parObj) {
        if (parObj.divID) {
            commModalObj.option.divID = parObj.divID;
            commModalObj.bsTableObj = $('#' + commTableObj.option.divID);
            commModalObj.setOption(parObj);
        } else
            return;

        commModalObj.bsTableObj.bootstrapTable('destroy');//先销毁表格
        commModalObj.bsTableObj.bootstrapTable({
            method: 'post', //请求类型
            url: commModalObj.option.url,//请求的url
            clickToSelect: false,
            checkboxHeader: false,//是否需要操作列
            idField: commModalObj.dataStore.key,     //每一行的唯一标识，一般为主键列
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
            // sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
            search: commModalObj.option.search,
            onLoadSuccess: commModalObj.recData,
            locale: 'zh-CN'
        });
    };

    commModalObj.setOption = function (parObj) {
        if (parObj.url) {
            commModalObj.option.url = parObj.url;
        }
        if (parObj.par) {
            commModalObj.option.par = parObj.par;
        }
        if (parObj.title != null && parObj.title != undefined) {
            commModalObj.option.title = parObj.title;
        }
        if (parObj.search != null && parObj.search != undefined) {
            commModalObj.option.search = parObj.search;
        }
    };

    commModalObj.refreshOption = function (parObj) {//url: null,par: null,
        commModalObj.setOption(parObj);
        commModalObj.bsTableObj.bootstrapTable('refreshOptions', commModalObj.option)
    };

    commModalObj.setTableHeader = function (headerObj) {//设置表头
        if (headerObj.columns) {
            commModalObj.tableHeader.columns = headerObj.columns;
        }
        if (headerObj.option != null && headerObj.option != undefined) {
            commModalObj.tableHeader.option = headerObj.option;
        }
        if (headerObj.idField) {
            commModalObj.tableHeader.idField = headerObj.idField;
        }
        commModalObj.genHeader();
    };

    commModalObj.genHeader = function () {//生成表头的默认部分
        for (var i = 0; i < commModalObj.tableHeader.columns.length; i++) {
            if (!(commModalObj.tableHeader.columns[i].align)) {
                commModalObj.tableHeader.columns[i].align = 'center';
            }
            if (!(commModalObj.tableHeader.columns[i].sortable)) {
                commModalObj.tableHeader.columns[i].sortable = true;
            }
            if (!(commModalObj.tableHeader.columns[i].order)) {
                commModalObj.tableHeader.columns[i].order = 'asc';
            }
        }
        var tempColumns = commModalObj.tableHeader.columns;
        if (commModalObj.tableHeader.option.checkbox) {
            tempColumns.splice(0, 0, {
                checkbox: commModalObj.tableHeader.option.checkbox
            });
        }
        commModalObj.bsTableObj.bootstrapTable('refreshOptions', {
            columns: commModalObj
        });
    };

    commModalObj.recData = function (dataObj) {
        if (dataObj.columns || dataObj.option || dataObj.idField) {
            commModalObj.setTableHeader(dataObj);
        }
        if (dataObj.data) {
            commModalObj.dataStore.data = dataObj.data;
            commModalObj.bsTableObj.bootstrapTable('load', commTableObj.dataStore.data);
        }
    };

    commModalObj.refreshData = function (parObj) {
        var tempPar = {
            silent: commModalObj.option.silent,
            query: parObj ? parObj : commModalObj.option.par
        };
        commModalObj.bsTableObj.bootstrapTable('refresh', tempPar);
    };

    return commModalObj;

};









