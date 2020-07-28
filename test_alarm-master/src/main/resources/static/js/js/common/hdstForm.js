//新的对象形式
var comForm = function () {
    var oForm = {
        _setting: {
            message: 'This value is not valid',                                             //默认的不合法提示
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {}
        },
        _option: {
            formId: '',
            type: 'form',
            formObj: null,
            submit: {
                show: false,
                css: {}
            },
            event: {
                beforeValidate: null,
                onRemoveItem: null,
                onInsertItem: null
            },
            initContent: null
        },
        _dom: {
            obj: null,
            str: "",
            self: null,
            submit: null,
            entire: null
        },
        items: [],
        layouts: []
    };

    oForm.init = function (option) {
        $.extend(oForm._option, option);
        oForm.generate(oForm._option);

        // oForm._dom.str = "<form action='' method='post' id='" + oForm._option.formId + "' name='" + oForm._option.formId + "'><input style='display:none' class='btn btn-primary' type='submit' value='提交'></form>";
        // oForm._dom.str = "<form action='' method='post' id='" + oForm._option.formId + "' name='" + oForm._option.formId + "'></form>";

        // if (oForm._option.submit.show) {
        //     oForm._dom.str = "<form action='' method='post' id='" + oForm._option.formId + "' name='" + oForm._option.formId + "'><input style='display:block' class='btn btn-primary' type='submit' value='提交'></form>"
        // }
    };

    oForm.generate = function (option) {
        oForm._dom.obj = oForm.create(option);
        option.initContent && oForm.itemsInit(option.initContent);
    };

    oForm.itemsInit = function (initArr) {
        var tempArr = [];
        $.each(initArr, function (index, ele) {
            var temp = new comItem();
            temp.oInit(ele);
            tempArr.push(temp);
        });
        oForm.appendItems(tempArr);
    };

    oForm.create = function (option) {
        var _oForm = document.createElement("form");
        _oForm.setAttribute("action", "");
        _oForm.setAttribute("id", oForm._option.formId);
        _oForm.setAttribute("onsubmit","return false");

        if (option.type === "form") {
            var oDiv = document.createElement("div");
            var oBtn = document.createElement("input");
            _oForm.setAttribute("method", "post");
            _oForm.setAttribute("name", oForm._option.formId);

            oBtn.setAttribute("class", "btn btn-primary");
            oBtn.setAttribute("type", "submit");
            oBtn.setAttribute("value", "提交");
            oBtn.onclick = function () {
                oForm.beforeValidate();
            };

            oDiv.style.cssFloat = 'right';
            if (!option.submit.show) {
                oDiv.setAttribute("style", "display:none");
            }

            oDiv.appendChild(oBtn);
            _oForm.appendChild(oDiv);

            oForm._dom.submit = oBtn;
        } else if (option.type === "query") {
            _oForm.classList.add("form-inline");
            _oForm.classList.add("queryForm");
            $(_oForm).css("display", "inline-block");
        }
        return _oForm;
    };

    oForm.appendItems = function (arr) {
        $.each(arr, function (index, ele) {
            console.log(index + " " + typeof ele);
            oForm._dom.obj.insertBefore(ele.getDom(), oForm._dom.obj.lastChild);
            oForm.items.push(ele);
        });
        // oForm.oFormCreate();
        oForm.initValidator();
    };

    oForm.appendLayout = function (arr) {
        $.each(arr, function (index, ele) {
            console.log(index + " " + typeof ele);
            oForm._dom.obj.insertBefore(ele.getDom(), oForm._dom.obj.lastChild);
            oForm.layouts.push(ele);
            // ele.items && oForm.layoutItemsInit(ele.items);
        });
        $.each(oForm.layouts, function (index, ele) {
            console.log(index + " " + typeof ele);
            oForm.items = oForm.items.concat(ele.items);
        });

        oForm.initValidator();
    };

    oForm.removeLayout = function (obj, itemsFlag) {
        for (var i = 0, j = oForm.layouts.length; i < j; i++) {
            if (obj === oForm.layouts[i]) {
                oForm._dom.obj.removeChild(oForm._dom.obj.childNodes[i + 1]);
                //改变itemArr
                oForm.layouts.splice(i, 1);
                oForm._option.event.onRemoveLayout && oForm._option.event.onRemoveLayout(obj, oForm.layout);
                i--;
                j--;
            }
        }
    };

    oForm.getDomStr = function () {
        return oForm._dom.str;
    };

    oForm.getDom = function () {
        return oForm._dom.obj;
    };

    // oForm.genRenderStr = function () {                       //好像暂时不需要，在渲染之后可以获取到jq对象
    //     return oForm.genDomStr();
    // };

    oForm.oFormCreate = function () {
        var oInput = Object();
        var domString = "";
        var tempStr = "";
        $.each(oForm.items, function (index, ele) {
            tempStr = tempStr + ele.getDom();
        });
        // oForm.domObj.html(tempStr);
        oForm.genDomStr(tempStr);
    };

    oForm.getEle = function () {
        return oForm.items;
    };

    oForm.initValidator = function () {
        if (oForm._option.type === "query") {
            return;
        }
        $(oForm._dom.obj).bootstrapValidator('destroy');
        $.each(oForm.items, function (index, ele) {
            if (ele.items) {
                ergodic(ele);
            } else {
                oForm._setting.fields[ele.getId()] = {};
                oForm._setting.fields[ele.getId()].validators = ele.getValidators();
            }
        });
        $(oForm._dom.obj).bootstrapValidator(oForm._setting);

        function ergodic(container) {
            $.each(container.items, function (index, ele) {
                if (ele.items) {
                    ergodic(ele.items)
                } else {
                    oForm._setting.fields[ele.getId()] = {};
                    oForm._setting.fields[ele.getId()].validators = ele.getValidators();
                }
            });
        }
    };

    // oForm.resetForm = function(){
    //     $.each(oForm.items, function (index, ele) {
    //         oForm._setting.fields[ele.getId()] = {};
    //         oForm._setting.fields[ele.getId()].validators = ele.getValidators();
    //         $(oForm._dom.obj).data('bootstrapValidator').addField(ele.getId(),ele.getValidators());
    //     });
    // };

    var changeFlag = false;
    //validate fn 执行后会返回一个验证总结果
    oForm.validate = function () {
        console.log(oForm);
        if (oForm.layouts.length > 0) {
            console.log(oForm.layouts);
            $.each(oForm.layouts, function (index, ele) {
                if (ele.items.length > 0) {
                    oForm.items = oForm.items.concat(ele.items);
                }
            });
            oForm.initValidator();
        }
        /*
        * 循环items,判断是否有variableItems obj && partItems, yes，把variableItems's attr 都添加给form 管理，
        * 先删掉被加入的attr items  重新添加一遍 以即时的items为准
        * 判断是否为attr Items 的标准 ： selectChange之后页面上仍然存留Element
        */
        changeFlag = false;
        $.each(oForm.items, function (index, ele) {
            if (ele.variableItems) {
                for (var prop in ele.variableItems) {
                    oForm.items = oForm.items.concat(ele.variableItems[prop]);
                    changeFlag = true;                                                                     //增加了item
                }
            }
            if (ele.partItems) {
                for (var prop in ele.partItems) {
                    oForm.items = oForm.items.concat(ele.partItems[prop]);
                    changeFlag = true;                                                                     //增加了item
                }
            }
        });
        for (var i = 0; i < oForm.items.length; i++) {
            var $parent = $(oForm.items[i].dom.entire.parentElement);
            if (!$parent[0]) {
                oForm.items.splice(i, 1);                                                                //删掉当前的item
                i--;                                                                                     //代表数组数位变了
                changeFlag = true;                                                                       //删除了item
            }
        }


        if (changeFlag) {
            oForm.initValidator();                                                                         //在发生了改变的前提下去reInit()
        }
        var bo  = $(oForm._dom.obj).data('bootstrapValidator').validate();
        return bo.isValid();
    };

    oForm.isValid = function () {
        return $(oForm._dom.obj).data('bootstrapValidator').isValid();
    };

    oForm.removeItem = function (obj) {
        for (var i = 0, j = oForm.items.length; i < j; i++) {
            if (obj === oForm.items[i]) {
                // obj.destroy();
                //因为form 当中有一个隐藏的submit button ,所以数字需要＋1
                oForm._dom.obj.removeChild(oForm._dom.obj.childNodes[i + 1]);
                //改变itemArr
                oForm.items.splice(i, 1);
                oForm._option.event.onRemoveItem && oForm._option.event.onRemoveItem(obj, oForm.items);
                i--;
                j--;
            }
        }
    };

    oForm.insertItem = function (obj, tObj, flag) {
        for (var i = 0, j = oForm.items.length; i < j; i++) {
            if (tObj === oForm.items[i]) {
                // $(obj.dom.entire).insertAfter($(tObj.dom.entire));
                var _form = oForm._dom.obj;
                switch (flag) {
                    case "before":
                        //因为form 当中有一个隐藏的submit button ,所以数字需要＋1
                        _form.insertBefore(obj.dom.entire, _form.childNodes[i + 1]);
                        //改变itemArr
                        oForm.items.splice(i, 0, obj);
                        break;
                    case "after":
                    default:
                        //因为form 当中有一个隐藏的submit button ,所以数字需要＋1
                        _form.insertBefore(obj.dom.entire, _form.childNodes[i + 1 + 1]);
                        //改变itemArr
                        oForm.items.splice(i + 1, 0, obj);
                        break;
                }
                oForm._option.event.onInsertItem && oForm._option.event.onInsertItem(obj, oForm.items);
                i++;
                j++;
            }
        }
        oForm.initValidator();
    };

    oForm.getItems = function () {
        return oForm.items;
    };

    oForm.getItemById = function (id) {
        var temp;
        $.each(oForm.items, function (index, ele) {
            if (ele.conf.itemId === id) {
                temp = ele;
                return false;                                           //增加上return false 会在找到后跳出整个循环，return true 则只跳出当前这一次循环
            }
        });
        return temp;
    };

    oForm.getValue = function () {
        var temp = {};
        $.each(oForm.items, function (index, ele) {
            temp[ele.getId()] = ele.getValue();
        });
        return temp;
    };

    oForm.beforeValidate = function () {
        oForm.initValidator();
    };

    return oForm;
};