
//新的对象形式
var comModal = function () {
    var _consts = {
        type: {
            OPERATE: "operate",
            BROWSE: "browse"
        }
    };

    var oModal = {
        conf: {
            id: '',
            frameObj: null,
            // obj: null,
            title: '模态框',
            type: _consts.type.OPERATE,
            css: {
                size: 'normal'
            },
            callbacks: {
                onCreated: null,
                beforeCommit: null,
                onCommit: null
            }
        },
        dom: {
            modal: null,
            str: '',
            submit: null,
            obj: null,
            eles: {}
        },
        items: [],
        data: null,
        eles: {}
    };

    oModal.init = function (conf) {
        $.extend(oModal.conf, conf);
        oModal.conf.frameObj.empty();

        // oModal.dom = oModal.createDom();
        oModal.create();
        // oModal.setStyle();
        if (conf.eles) {
            oModal.fillEles(conf.eles);
        }

        oModal.bind(oModal.conf.callbacks);

    };

    oModal.createDom = function () {
        var oDom = {};
        var _conf = oModal.conf;
        var size;
        switch (oModal.conf.css.size) {
            case "normal" :
                size = 300;
                break;
            case "large" :
                size = 400;
                break;
            case "enlarge" :
                size = 450;
                break;
            default :
                size = 300;
        }

        var aPartStr = "<div class='modal-dialog modal-lg' style='width:" + size * 3 + "px;' role='document' id=" + _conf.id + ">" +
            "<div class='modal-content'>" +
            "<div class='modal-header'>" +
            "<button type='button' class='close' data-dismiss='modal' aria-label='close'><span>×</span></button>" +
            "<h4 class='modal-title'>" + _conf.title + "</h4>" +
            "</div>" +
            "<div class='modal-body' style='max-height:" + size * 2 + "px;overflow:auto;'></div>";

        var bPartStr = "<div class='modal-footer'>" +
            "<button type='button' class='btn btn-default cancel' data-dismiss='modal'>" +
            "取消" +
            "</button>" +
            "<button type='button' class='btn btn-primary submit' id='modal-commit'>" +
            "确定" +
            "</button>" +
            "</div>" +
            "</div>" +
            "</div>";

        switch (oModal.conf.type) {                                                                                   //后期需要优化
            case _consts.type.OPERATE:
                oDom.str = aPartStr + bPartStr;
                oDom.submit = '#' + _conf.id + ' .submit';
                break;
            case _consts.type.BROWSE:
                oDom.str = aPartStr;
                break;
            default:
                oDom.str = aPartStr + bPartStr;
                oDom.submit = '#' + _conf.id + ' .submit';
                break;
        }

        if (oModal.conf.style) {                                                                                        //后期优化，现在没有
            // var $modalDocument = $('.modal-dialog');
            // var $modalContent = $('.modal-content');
            // switch (oModal.conf.style) {
            //     case "large" :
            //         $modalDocument.addClass('modal-lg');
            //         $modalContent.css('maxHeight', '850px');
            //         break;
            //     case "enlarge" :
            //         $modalDocument.width('1300px');
            //         $modalContent.css('maxHeight', '900px');
            // }
        }
        return oDom;
    };

    oModal.fillEles = function (eles) {
        if (eles.forms) {
            oModal.eles.forms = {};
            for (var propF in eles.forms) {
                if (eles.forms.hasOwnProperty(propF)) {
                    // var fDom = document.createElement('form');
                    // fDom.setAttribute('id', propF);
                    // oModal.dom.modal.find('.modal-body').append(fDom);
                    var _tempForm = new comForm();
                    _tempForm.init(eles.forms[propF].options);
                    oModal.appendEle(_tempForm);
                    oModal.eles.forms[propF] = _tempForm;
                }
            }
        }
        if (eles.tables) {
            oModal.eles.tables = {};
            for (var prop in eles.tables) {
                if (eles.tables.hasOwnProperty(prop)) {
                    var tDom = document.createElement('table');
                    tDom.setAttribute('id', prop);
                    oModal.dom.modal.find('.modal-body').append(tDom);
                    var _tempTable = new commTable();
                    _tempTable.init(eles.tables[prop].defaultOptions, eles.tables[prop].btOptions);
                    oModal.eles.tables[prop] = _tempTable;
                }
            }
        }
    };

    oModal.create = function () {
        var $frame = oModal.conf.frameObj;
        oModal.dom = oModal.createDom();

        $frame.html(oModal.dom.str);
        $frame.modal('show');

        oModal.dom.modal = $('#' + oModal.conf.id);
        oModal.dom.submit = $(oModal.dom.submit);

        oModal.conf.callbacks.onCreated && oModal.conf.callbacks.onCreated(oModal.dom.modal);
    };

    oModal.bind = function (cb) {
        for (var prop in cb) {
            switch (prop) {
                case 'onCommit':
                    oModal.dom.submit.on('click', function (e) {
                        var fnName = cb[prop];
                        oModal.items[0].validate();
                        var res = oModal.items[0].isValid();
                        if (res) {
                            fnName(e, oModal);
                        }
                    });
                    break;
            }
        }
    };

    // oModal.validator = function (){
    //     oModal.dom.form.validator(oModal.findItem());
    // };

    oModal.appendText = function (txt) {
        oModal.dom.modal.find('.modal-body').append('<h3>' + txt + '</h3>');
        oModal.items.push({
            txt: txt
        });
    };

    oModal.appendTable = function (tObj) {
        var _mTable = tObj.getObj();
        var _rTable = _mTable.rawTable;

        oModal.dom.modal.find('.modal-body').append(_rTable);
        _rTable.bootstrapTable(_mTable.bootstrapOption);
        oModal.dom.table = _mTable;
        oModal.items.push(_mTable);
    };

    oModal.appendEle = function (obj) {
        //用于添加form
        oModal.dom.modal.find('.modal-body').append(obj.getDom());
        //模态框把form添加之后再验证
        // obj.initValidator();
        oModal.dom.form = obj;
        oModal.items.push(obj);
    };

    oModal.getEle = function () {
        return [oModal.dom.form];
    };

    oModal.getValues = function () {
        var oForm = oModal.getEle();                 //return formList[]
        if (!oForm) return;
        if (oForm.length > 1) {
            var valueArr = [];
            $.each(oForm, function (index, form) {
                var oValue = {};
                $.each(form.items, function (index, ele) {
                    var B = ele.getEle();                           //return B{};
                    oValue[B.name] = B.value;
                    if (B.variableItems) {
                        oValue[B.name] = {};
                        oValue[B.name].value = B.value;
                        oValue[B.name].variableItems = [];
                        for (var prop in B.variableItems) {
                            if (B.variableItems.hasOwnProperty(prop)) {
                                var e = B.variableItems[prop];
                                oValue[B.name].variableItems.push({
                                    "id": prop,
                                    "value": e
                                });
                            }
                        }
                    }
                });
                valueArr.push(oValue);
            });
            return valueArr;
        } else {
            var value = {};
            $.each(oForm[0].items, function (index, ele) {
                var B = ele.getEle();                           //return B{};
                value[B.name] = B.value;
                if (B.variableItems) {
                    value[B.name] = {};
                    value[B.name].value = B.value;
                    value[B.name].variableItems = [];
                    for (var prop in B.variableItems) {
                        if (B.variableItems.hasOwnProperty(prop)) {
                            var e = B.variableItems[prop];
                            value[B.name].variableItems.push({
                                "id": prop,
                                "value": e
                            });
                        }
                    }
                }
            });
            return value;
        }

    };

    oModal.hide = function () {
        oModal.conf.frameObj.modal('hide');
    };

    oModal.hdHide = function (emptyFlag) {
        oModal.conf.frameObj.modal('hide');
        if(emptyFlag){
            oModal.conf.frameObj.empty();
        }
    };

    // oModal.findItem = function (){
    //     var $form = $('#' + oModal.conf.id);
    //     return $form.find('input').add($form.find('select'));
    // };

    oModal.setData = function (data) {
        oModal.data = data;
    };

    oModal.getData = function () {
        return oModal.data;
    };

    return oModal;
};