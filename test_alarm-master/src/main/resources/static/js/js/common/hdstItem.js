var comItem = function () {
    var comObj = {
        conf: {
            itemId: null,
            label: {
                text: null
            },
            value: null,
            type: "input", //现有select,input,textArea
            enable: true,
            readonly: false,
            required: true,
            options: {
                type: "text",
                autoComplete: true,
                content: []
            },
            validType: null,
            validators: {},
            event: {},
            tips: null,
            visible: true
        },
        dom: {
            entire: null,
            self: null
        },
        tools: {}
    };

    comObj.oInit = function (configure) {

        $.extend(true, comObj.conf, configure); //外部配置的所有内容存在comObj.conf中，深度克隆的形参是第一个deep，true代表属性对象也会递归覆盖

        //button && dataItem another way ，both don't need to valid
        if (configure.type === "button" || configure.type === "dataItem") {
            console.log(configure.itemId);
            comObj.conf.enable = true;
            comObj.conf.required = false;
        }

        comObj.generate(comObj.conf);
        if (comObj.conf.event) {                 //进入事件绑定的条件
            comObj.eventBind(comObj.conf.event); //事件bind
        }
    };

    comObj.generate = function (conf) {
        create(conf);
        if (conf.value) {
            comObj.fillValue(conf.value, conf.type);
        }
        comObj.extraFill(conf);
        conf.validType && comObj.validFill(conf.validType, conf.validators);

        if (!conf.enable) {
            comObj.dom.self.setAttribute("disabled", "disabled");
        }
        if (conf.readonly) {
            comObj.dom.self.setAttribute("readonly", "readonly");
        }
        if (conf.required) {
            conf.validators.notEmpty = {
                message: '内容不能为空'
            };
        }
        if (conf.variable) {
            var innerWrapper = document.createElement("div");
            innerWrapper.setAttribute("class", "innerWrapper");
            innerWrapper.style.marginTop = '15px';
            addVariableItem(conf.variable.content);
            comObj.dom.entire.appendChild(innerWrapper);

            comObj.dom.self.onchange = function (e) {
                if (e.target.value) {
                    var data;
                    conf.variable.params ? data = conf.variable.params : data = {};
                    conf.variable.variableParamName ? data[conf.variable.variableParamName] = comObj.dom.self.value : data = null;
                    $.ajax({
                        url: conf.variable.url,
                        type: 'POST',
                        dataType: "json",
                        data: "parameter=" + JSON.stringify(data),
                        success: function (res) {
                            $(innerWrapper).empty();
                            if (res.state.code == 200 || res.state.code == 204) {
                                conf.variable.responseHandle ? res = conf.variable.responseHandle(res) : null;
                                addVariableItem(res);
                            }
                        },
                        complete: function (res) {
                            // console.log('has complete');
                            // innerWrapper.innerHTML = '';
                            // var res = [{
                            //     itemId: "femaleGoodA",
                            //     label: {
                            //         text: 'new1'
                            //     },
                            //     validators: {
                            //         notEmpty: {
                            //             message: '不能为空'
                            //         }
                            //     }
                            // }, {
                            //     itemId: "femaleGoodB",
                            //     label: {
                            //         text: 'new2'
                            //     },
                            //     validators: {
                            //         notEmpty: {
                            //             message: '选项不能为空'
                            //         }
                            //     }
                            // }, {
                            //     itemId: "femaleGoodC",
                            //     label: {
                            //         text: 'new3'
                            //     },
                            //     value: '123',
                            //     validators: {
                            //         notEmpty: {
                            //             message: '不能为空'
                            //         }
                            //     }
                            // }];
                            // conf.variable.responseHandle ? res = conf.variable.responseHandle(res) : null;
                            // addVariableItem(res);
                        }
                    });
                } else {
                    $(innerWrapper).empty();
                }
            };
        }

        function addVariableItem(data) {
            comObj.variableItems = {};
            $.each(data, function (index, ele) {
                var t = new comItem();
                t.oInit(ele);
                console.log(t);
                innerWrapper.appendChild(t.dom.entire);
                comObj.variableItems[ele.itemId] = t;
            });
        }
    };

    //obj不提供给外部使用的function不要注册到comObj上
    function create(conf) {
        switch (conf.type) {
            case "input":
                comObj.dom.entire = oInputCreate(conf.options);
                comObj.dom.self = comObj.dom.entire.getElementsByTagName("input")[0];
                if (conf.options.event) inputEventBind(conf.options.event, conf.options);
                break;
            case "select":
                comObj.dom.entire = oSelectCreate(conf.options);
                comObj.dom.self = comObj.dom.entire.getElementsByTagName("select")[0];
                if (conf.options.event) selectEventBind(conf.options.event);
                break;
            case "textArea":
            case "textarea":
                comObj.dom.entire = oTextAreaCreate(conf.options);
                comObj.dom.self = comObj.dom.entire.getElementsByTagName("textarea")[0];
                break;
            case "button":
                comObj.dom.self = comObj.dom.entire = oButtonCreate(conf.options);
                break;
            case "time":
                comObj.dom.entire = oTimeCreate(conf.options);
                comObj.dom.self = comObj.dom.entire.getElementsByTagName("input")[0];
                break;
            case "address":
                comObj.dom.entire = oAddressCreate(conf.options);
                comObj.dom.self = comObj.dom.entire.getElementsByTagName("select")[0];
                break;
            case "preciseAddress":
                comObj.dom.entire = oPreciseAddress(conf.options);
                comObj.dom.self = comObj.dom.entire.getElementsByTagName("select")[0];
                break;
            case "image":
                comObj.dom.entire = oImageCreate(conf.options);
                comObj.dom.self = comObj.dom.entire.getElementsByTagName("img")[0];
                break;
            case "images":
                comObj.dom.entire = oImagesCreate(conf.options);
                comObj.dom.self = comObj.dom.entire.getElementsByTagName("div")[0];
                break;
            case "itemList":
                comObj.dom.self = comObj.dom.entire = oItemListCreate(conf.options);
                break;
            case "inputPart":
                comObj.dom.self = comObj.dom.entire = oInputPartCreate(conf.options);
                break;
            case "selectPart":
                comObj.dom.self = comObj.dom.entire = oSelectPartCreate(conf.options);
                break;
            case "dataItem":
                comObj.dom.self = comObj.dom.entire = oDataItemCreate(conf.options);
                break;
            case "dynamicContainer":
                comObj.dom.entire = oDynamicContainer(conf.options);
                comObj.dom.self = comObj.dom.entire.getElementsByTagName("div")[0];
                break;
            default:
                comObj.dom.entire = oInputCreate(conf.options);
                comObj.dom.self = comObj.dom.entire.getElementsByTagName("input")[0];
        }

        if (conf.required) {
            comObj.dom.entire.childNodes[0].innerHTML += "<span style='color:red;'> * <span>";
        }

        if (!conf.visible) {
            comObj.hide();
        }

        if (conf.tips) {
            var span = document.createElement('span');
            span.style.marginLeft = "8px";
            span.innerText = conf.tips.txt;
            switch (conf.tips.state) {
                case "primary":
                    span.setAttribute("class", "text-primary");
                    break;
                case "danger":
                    span.setAttribute("class", "text-danger");
                    break;
                case "muted":
                    span.setAttribute("class", "text-muted");
                    break;
                default:
                    span.setAttribute("class", "text-primary");
            }
            comObj.dom.entire.appendChild(span);
        }

        function oInputCreate(options) {
            //file text checkbox radio button hidden image password reset submit

            var oInput = document.createElement("input");
            var oDiv = document.createElement("div");
            var oLabel = document.createElement("label");
            oDiv.setAttribute("class", "form-group inputWrapper");
            comObj.conf.display === "inline" && oDiv.classList.add('form-inline');
            oLabel.setAttribute("class", "label-control");
            oLabel.innerText = conf.label.text;

            switch (options.type) {
                //添加name才可以使验证被识别
                case "file":
                    oInput.setAttribute("name", conf.itemId);
                    oInput.setAttribute("type", options.type);
                    oInput.setAttribute("id", conf.itemId);
                    oInput.setAttribute("multiple", "multiple");
                    break;
                case "text":
                    oInput.setAttribute("name", conf.itemId);
                    oInput.setAttribute("class", "form-control");
                    oInput.setAttribute("type", options.type);
                    oInput.setAttribute("id", conf.itemId);
                    if (!options.autoComplete) {
                        oInput.setAttribute("autocomplete", "off");
                    }
                    break;
                case "checkbox":
                case "radio":
                    var wDiv = document.createElement("div");
                    wDiv.setAttribute("class", "optWrapper");
                    wDiv.setAttribute("id", conf.itemId);
                    setContent(wDiv, options.content);
                    oInput = wDiv;

                    comObj.reloadContent = function (content) {
                        console.log("reloadContent");
                        comObj.conf.options.content = content;
                        $("#" + comObj.conf.itemId).empty();
                        setContent(wDiv, content)
                    };
                    break;
            }
            if (conf.label.text) oDiv.appendChild(oLabel);
            oDiv.appendChild(oInput);

            function setContent(wrapper, content) {
                $.each(content, function (index, ele) {
                    var newDiv = document.createElement("div");
                    var newInput = document.createElement("input");
                    var newLabel = document.createElement("label");

                    newInput.setAttribute("name", ele.name);
                    newInput.setAttribute("type", options.type);
                    newInput.setAttribute("value", ele.value);
                    if(ele.checked) newInput.checked = true;

                    newLabel.style.marginLeft = "14p";
                    newLabel.appendChild(newInput);
                    newLabel.append(ele.label);

                    newDiv.setAttribute("class", options.type);
                    newDiv.appendChild(newLabel);
                    wrapper.appendChild(newDiv);
                });
            }

            return oDiv;
        }

        function oSelectCreate(options) {
            var oSelect = document.createElement("select"),
                oDiv = document.createElement("div"),
                oLabel = document.createElement("label");

            oDiv.setAttribute("class", "form-group selectWrapper");
            if (comObj.conf.display === "inline") {
                oDiv.classList.add('form-inline');
            }
            if (comObj.conf.display === "inline-block") {
                oDiv.classList.add('form-inline');
                oDiv.style.display = "inline-block";
            }
            oLabel.setAttribute("class", "label-control");
            oLabel.innerText = conf.label.text;
            oSelect.setAttribute("class", "form-control");
            oSelect.setAttribute("id", conf.itemId);
            oSelect.setAttribute("name", conf.itemId);
            // oSelect.style.width = "auto";

            //url & content 不要同时使用
            if (options.dynamic) {
                $.ajax({
                    type: "post",
                    url: options.dynamic.url,
                    dataType: 'json',
                    data: options.dynamic.data ? options.dynamic.data : "",
                    async: false,//取消异步
                    success: function (res) {
                        if (res.state.code == 200) {
                            var temp;
                            options.content = [{
                                value: "",                                                          //为"",会进行为空判断
                                text: "请选择"
                            }];
                            $.each(res.data, function (index, ele) {
                                temp = {
                                    value: ele.optionId,
                                    text: ele.optionName
                                };
                                options.content.push(temp);
                            });
                            if (options.dynamic.format) {
                                options.content = options.dynamic.format(options.content);
                            }
                        }
                    }
                });
            }

            setContent(oSelect, options.content);
            oDiv.appendChild(oLabel);
            oDiv.appendChild(oSelect);

            comObj.reloadOptions = (content) => {
                console.log("reloadOptions");
                comObj.conf.options.content = content;
                $(oSelect).empty();
                setContent(oSelect, content)
            };

            function setContent(wrapper, content) {
                $.each(content, function (index, ele) {
                    var oTemp = document.createElement('option');
                    oTemp.value = ele.value;
                    oTemp.innerText = ele.text;
                    wrapper.appendChild(oTemp)
                });
            }

            return oDiv;
        }

        function oTextAreaCreate(options) {
            var oTextArea = document.createElement("textarea"),
                oDiv = document.createElement("div"),
                oLabel = document.createElement("label");

            oDiv.setAttribute("class", "form-group textAreaWrapper");
            oLabel.setAttribute("class", "label-control");
            oLabel.innerText = conf.label.text;
            oTextArea.setAttribute("class", "form-control");
            oTextArea.setAttribute("id", conf.itemId);
            //添加name才可以使验证被识别
            oTextArea.setAttribute("name", conf.itemId);

            if (options) {
                oTextArea.cols = options.cols;
                oTextArea.rows = options.rows ? options.rows : 5;
            }

            oDiv.appendChild(oLabel);
            oDiv.appendChild(oTextArea);
            return oDiv;
        }

        function oButtonCreate(options) {
            var oButton = document.createElement("button"),
                oSpan = document.createElement("span");

            oButton.setAttribute("id", conf.itemId);
            oButton.setAttribute("class", "btn btn-primary");
            oButton.setAttribute("type", "button");
            oSpan.setAttribute("class", "glyphicon");
            oSpan.innerText = " " + conf.label.text;

            //class类名添加 目前只写增删
            switch (options.buttonType) {
                case "add":
                    oSpan.classList.add("glyphicon-plus");
                    break;
                case "delete":
                    oSpan.classList.add("glyphicon-remove");
                    break;
                case "update":
                    oSpan.classList.add("glyphicon-pencil");
                    break;
                case "menu":
                    oSpan.classList.add("glyphicon-list");
                    break;
                case "download":
                    oSpan.classList.add("glyphicon-download-alt");
                    break;
                default:
                    console.log(oSpan.classList);
            }
            if (options.space) {
                oButton.style.marginLeft = '8px';
            }
            oButton.appendChild(oSpan);
            return oButton;
        }

        function oTimeCreate(options) {
            comObj.initTime = function (formId) {
                //this fn need to optimize in the future
                // hdCommon.initTimePlugin("#" + comObj.conf.itemId, options.timeType, options.rangeOrNot, "", function (value, date) {
                //     // console.log('你选择的日期是：' + value + '\n获得的对象是' + JSON.stringify(date));
                //     if (comObj.conf.required) {
                //         setTimeout(function () {
                //             $("#" + formId).bootstrapValidator('updateStatus', comObj.conf.itemId, 'NOT_VALIDATED').bootstrapValidator('validateField', comObj.conf.itemId);
                //         }, 0);
                //     }
                //     if (options.change) {
                //         options.change(value, date);
                //     }
                // });
                var confObj = {
                    type: options.timeType,
                    range: options.rangeOrNot,
                    max: options.max,
                    min: options.min,
                    value: options.value,
                    done: function (value, date) {
                        // console.log('你选择的日期是：' + value + '\n获得的对象是' + JSON.stringify(date));
                        if (comObj.conf.required) {
                            setTimeout(function () {
                                $("#" + formId).bootstrapValidator('updateStatus', comObj.conf.itemId, 'NOT_VALIDATED').bootstrapValidator('validateField', comObj.conf.itemId);
                            }, 0);
                        }
                        if (options.change) {
                            options.change(value, date);
                        }
                        options.done ? setTimeout(() => options.done(value, date),0) : "";
                    }
                };
                if (options.format) confObj.format = options.format;
                hdCommon.initTimeObj("#" + comObj.conf.itemId, confObj);
            };

            var oInput = document.createElement("input");
            var oDiv = document.createElement("div");
            var oLabel = document.createElement("label");
            oDiv.setAttribute("class", "form-group inputWrapper timeWrapper");
            oLabel.setAttribute("class", "label-control");
            oLabel.innerText = conf.label.text;

            //添加name才可以使验证被识别
            oInput.setAttribute("name", conf.itemId);
            if (options.timeType) {
                oInput.setAttribute("class", "form-control " + options.timeType + "HDInput");
            } else {
                oInput.setAttribute("class", "form-control HDInput");
            }
            oInput.setAttribute("type", "text");
            oInput.setAttribute("id", conf.itemId);
            if (!options.autoComplete) {
                oInput.setAttribute("autocomplete", "off");
            }
            oDiv.appendChild(oLabel);
            oDiv.appendChild(oInput);
            return oDiv;
        }

        function oAddressCreate(options) {
            comObj.initAddress = function () {
                var distPicker = $(comObj.dom.entire);
                if (comObj.conf.value) {
                    var _address = comObj.conf.value;
                    distPicker.distpicker({
                        province: _address.province,
                        city: _address.city,
                        district: _address.district,
                        autoSelect: true                               //是个boolean值啊，用来确定是否要联动
                    });
                } else {
                    distPicker.distpicker({
                        province: "湖南省",
                        city: "长沙市",
                        district: "芙蓉区"
                    });
                }
            };

            var selectWrapper = document.createElement("div");

            var sLabel = document.createElement("label");
            sLabel.setAttribute("class", "label-control");
            sLabel.innerText = conf.label.text;

            //填充distpick的选项
            if (options.display === "block") {                      //不同的使用情景，要加select + input 不同的类名，决定display形式
                selectWrapper.setAttribute("class", "selectWrapper form-inline");
                selectWrapper.style.marginBottom = '15px';
                sLabel.style.display = "block";
            } else {
                selectWrapper.setAttribute("class", "selectWrapper form-group");
            }

            selectWrapper.setAttribute("data-toggle", "distpicker");
            selectWrapper.setAttribute("id", conf.itemId);

            var province = document.createElement("select");
            var city = document.createElement("select");
            var district = document.createElement("select");
            province.setAttribute("class", "form-control province");
            city.setAttribute("class", "form-control city");
            district.setAttribute("class", "form-control district");

            selectWrapper.appendChild(sLabel);
            selectWrapper.appendChild(province);
            selectWrapper.appendChild(city);
            selectWrapper.appendChild(district);

            return selectWrapper;
        }

        function oPreciseAddress(options) {
            comObj.initPreciseAddress = function () {
                var detail = $(comObj.dom.self);
                detail.selectpicker({                                                                        //成为实时搜索选择框
                    liveSearch: true
                });
                initMap(detail);                                                                               //生成地图
                function initMap(element) {
                    var map = new BMap.Map(conf.itemId + "Map");                                       //新增地图
                    map.centerAndZoom(new BMap.Point(112.98626, 28.25591), 11);                          //设置地图中心为长沙,否则查不到内容
                    var options = {                                                                      //根据输入内容 百度地图搜索内容 并且放入多选框中
                        onSearchComplete: function (results) {
                            var selectOptions = [];//下拉框内容填充
                            if (local.getStatus() === BMAP_STATUS_SUCCESS) {                              //根据输入搜索地址成功 BMAP_STATUS_SUCCESS = 0
                                for (var i = 0; i < results.getCurrentNumPois(); i++) {                  //results 返回的结果集，在这里面拿省市区和经纬度
                                    var poiObj = results.getPoi(i);                                      //该fn必须有参数，并且是index
                                    selectOptions.push(poiObj);
                                }
                                console.log(selectOptions);
                            } else {
                                selectOptions.push({
                                    id: "noResult",
                                    title: "空",
                                    text: "空",
                                    address: "",
                                    city: "",
                                    province: "",
                                    lat: "",
                                    lng: ""
                                });
                            }

                            addSelectOption(element, selectOptions);                                      //填充多选框,显示的内容会被精确匹配再次过滤一次
                            element.selectpicker('refresh');
                        }
                    };
                    var local = new BMap.LocalSearch(map, options);                                     //百度地图的搜索对象
                    var searchStr;

                    element.prev().find("input").on('input', hdCommon.debounce(function (e) {        //不需要在显示的时候再绑定，liveSearch = true,input就会存在
                        local.search(e.target.value);                                                   //获取输入值，并去百度地图搜索
                        searchStr = e.target.value;
                    }, 1000));

                    function addSelectOption($e, data) {
                        var flag = false;
                        $.each(data, function (index, ele) {
                            if (ele.title.indexOf(searchStr) >= 0) {                                       //过滤百度地图返回的内容，避免之后的hidden类名,找不到return -1
                                flag = true;
                                var mapString = JSON.stringify(ele);
                                $e.append("<option data-map='" + mapString + "'>" + ele.title + "</option>");                        //暂时只加入title
                            }
                        });
                        if (!flag) {
                            $e.empty();
                            $e.append("<option data-map='noResult'>空</option>");
                        }
                    }

                }
            };

            var oDiv = document.createElement("div");
            var oSelect = document.createElement("select");
            var oLabel = document.createElement("label");
            oDiv.setAttribute("class", "form-group preciseAddressWrapper");
            oLabel.setAttribute("class", "label-control");
            oLabel.setAttribute("for", conf.itemId);
            oLabel.innerText = conf.label.text;

            oSelect.setAttribute("class", "form-control selectpicker");
            oSelect.setAttribute("id", conf.itemId);
            oSelect.setAttribute("name", conf.itemId);

            //添加一个地图点
            var mDiv = document.createElement("div");
            mDiv.setAttribute("id", conf.itemId + "Map");

            oDiv.appendChild(oLabel);
            oDiv.appendChild(oSelect);
            oDiv.appendChild(mDiv);
            return oDiv;
        }

        function oImageCreate(options) {
            var div = document.createElement('div');
            var img = document.createElement("img");
            img.setAttribute("id", conf.itemId);
            img.setAttribute("src", options.src);
            img.style.marginLeft = img.style.marginTop = img.style.marginRight = img.style.marginBottom = "5px";
            img.style.width = img.style.height = '150px';
            img.style.cursor = 'pointer';
            img.style.borderColor = '#ccc';
            img.style.borderWidth = '1px';
            img.style.borderStyle = 'solid';
            div.setAttribute('class', 'cover imgWrapper form-group');
            if (options.fullScreen) {
                div.onclick = function (e) {
                    console.log("fullScreen");
                    var this_ = $(this);
                    var images = this_.parent().find('.cover');
                    this_.parent().addClass('image-list');
                    var imagesArr = new Array();
                    $.each(images, function (i, image) {
                        imagesArr.push($(image).children('img').attr('src'));
                    });
                    $.pictureViewer({
                        images: imagesArr, //需要查看的图片，数据类型为数组
                        initImageIndex: this_.index(), //初始查看第几张图片，默认1
                        scrollSwitch: true //是否使用鼠标滚轮切换图片，默认false
                    });
                };
            }
            div.appendChild(img);
            return div;
        }

        function oImagesCreate(options) {
            var div = document.createElement('div');
            var oDiv = document.createElement("div");
            var oLabel = document.createElement("label");
            oDiv.setAttribute("class", "form-group imagesWrapper image-list");
            comObj.conf.display === "inline" && oDiv.classList.add('form-inline');
            oLabel.setAttribute("class", "label-control");
            oLabel.style.verticalAlign = 'top';
            oLabel.innerText = conf.label.text;
            var imgArr = [];

            $.each(options.content, (index, ele) => {
                var img = document.createElement("img");
                img.setAttribute("id", ele.field);
                img.setAttribute("src", ele.src);
                img.style.marginLeft = img.style.marginTop = img.style.marginRight = img.style.marginBottom = "5px";
                img.style.width = img.style.height = '150px';
                img.style.cursor = 'pointer';
                img.style.borderColor = '#ccc';
                img.style.borderWidth = '1px';
                img.style.borderStyle = 'solid';
                imgArr.push(img);
                oDiv.appendChild(img);
            });
            div.setAttribute('class', 'cover imgWrapper form-group');
            if (options.fullScreen) {
                $.each(imgArr, (index, ele) => {
                    ele.onclick = imgClick
                });
            }

            function imgClick(e) {
                console.log("fullScreen");
                var this_ = $(this);
                var imagesArr = [];
                $.each(oDiv.childNodes, function (index, img) {
                    imagesArr.push($(img).attr('src'));
                });
                $.pictureViewer({
                    images: imagesArr, //需要查看的图片，数据类型为数组
                    initImageIndex: this_.index() + 1, //初始查看第几张图片，默认1
                    scrollSwitch: true //是否使用鼠标滚轮切换图片，默认false
                });
            }

            div.appendChild(oLabel);
            div.appendChild(oDiv);
            return div;
        }

        function oItemListCreate(options) {
            comObj.conf.required = false;
            var wDiv = document.createElement('div');
            var ul = document.createElement("ul");
            var field = document.createElement("fieldset");
            var legend = document.createElement("legend");
            wDiv.setAttribute("class", "form-group itemListWrapper");
            comObj.conf.display === "inline" && wDiv.classList.add('form-inline');
            legend.innerText = conf.label.text;

            field.appendChild(legend);
            field.appendChild(ul);
            $.each(options.content, (index, ele) => {
                var liItem = `<div class="liItem">
                                    <div class="item-point"></div>
                                    <div class="axis"></div>
                                    <li class="hd-list-item">
                                        <span class="tag">【 ${ ele.type } 】</span>
                                        <span class="desc">${ ele.description }</span>
                                        <span class="time">${ ele.time }</span>
                                   </li>
                               </div>`;
                $(ul).append(liItem);
            });
            wDiv.appendChild(field);
            return wDiv;
        }

        function oInputPartCreate(options) {
            var oDiv = document.createElement("div");
            oDiv.setAttribute("class", "form-group form-inline inputPartWrapper");

            var oLabel = document.createElement("label");
            oLabel.setAttribute("class", "label-control");
            oLabel.setAttribute("for", options.part[0].id);
            oLabel.innerText = conf.label.text;
            oDiv.appendChild(oLabel);

            //与variableItems的加入相同
            if (options.part) {
                comObj.partItems = {};
                var tem;
                $.each(options.part, function (index, ele) {
                    tem = new comItem();
                    tem.oInit(ele);
                    oDiv.appendChild(tem.getDom());
                    comObj.partItems[ele.itemId] = tem;
                    // temInput = document.createElement('input');
                    // temInput.setAttribute("name", ele.itemId);
                    // temInput.setAttribute("type", "text");
                    // temInput.setAttribute("id", ele.id);
                    // temInput.setAttribute("class", "form-control");
                    // oDiv.appendChild(temInput);
                    if (index !== options.part.length - 1) {
                        var span = document.createElement('span');
                        span.innerText = " ----- ";
                        oDiv.appendChild(span);
                    }
                });
            }
            if (options.buttons) {
                var tempBtn;
                $.each(options.buttons, function (index, ele) {
                    tempBtn = new comItem();
                    tempBtn.oInit(ele);
                    oDiv.appendChild(tempBtn.getDom());
                });
            }
            return oDiv;
        }

        function oSelectPartCreate(options) {
            var oDiv = document.createElement("div");
            oDiv.setAttribute("class", "form-group form-inline selectPartWrapper");

            var oLabel = document.createElement("label");
            oLabel.setAttribute("class", "label-control");
            oLabel.setAttribute("for", options.part[0].itemId);
            oLabel.innerText = conf.label.text;
            oDiv.appendChild(oLabel);

            //与variableItems的加入相同
            if (options.part) {
                comObj.selectItems = {};
                var tem;
                $.each(options.part, function (index, ele) {
                    ele.type = "select";
                    tem = new comItem();
                    tem.oInit(ele.conf);
                    oDiv.appendChild(tem.getDom());
                    comObj.selectItems[ele.itemId] = tem;
                    // temInput = document.createElement('input');
                    // temInput.setAttribute("name", ele.itemId);
                    // temInput.setAttribute("type", "text");
                    // temInput.setAttribute("id", ele.id);
                    // temInput.setAttribute("class", "form-control");
                    // oDiv.appendChild(temInput);
                    if (index !== options.part.length - 1) {
                        var span = document.createElement('span');
                        span.innerText = " ----- ";
                        oDiv.appendChild(span);
                    }
                });
            }
            return oDiv;
        }

        function oDataItemCreate(options) {
            //声明给dataItem类添加操作方法
            comObj.deleteItem = function (id) {
                var delItem;
                for (var prop in comObj.issues) {
                    if (comObj.issues.hasOwnProperty(prop)) {
                        if (prop == id) {
                            $(comObj.issues[prop]).remove();//delete dom obj
                            delItem = comObj.issues[prop];
                            delete comObj.issues[prop];//delete obj attr
                        }
                    }
                }
                comObj.issuesArr.forEach(function (ele, index) {
                    if (ele.id == id) {
                        comObj.issuesArr.remove(ele);
                    }
                });
                comObj.confArr.forEach(function (ele, index) {
                    if (ele.field == id) {
                        comObj.confArr.remove(ele);
                    }
                });
                return delItem;
            };

            comObj.removeItemsAll = function () {
                $.each(comObj.issues, function (index, ele) {
                    $(ele).remove();//delete dom obj
                    delete comObj.issues[index];//delete obj attr
                });
                comObj.issuesArr = [];
                comObj.confArr = [];
                return comObj.issues;
            };

            comObj.addItem = function (optionConf) {
                var tDiv = document.createElement("div");
                tDiv.setAttribute("class", "hdItemContainer");
                tDiv.setAttribute("id", optionConf.field);

                var tImg = document.createElement("img");
                tImg.setAttribute("class", "hdItemImg");

                var spanBtn = document.createElement("span");
                spanBtn.innerText = optionConf.text;
                spanBtn.setAttribute("class", "hdItem item-default");

                //css part //样式均交于类名实现不在js当中直接设置 //在拥有div包裹层的情况下，不再需要margin
                //判断当前的item是否有操作需求，类型是添加 | 删除
                if (optionConf.type === "operate") {
                    var logoSource;
                    switch (optionConf.operate) {
                        case "add":
                            logoSource = "/images/add.png";
                            break;
                        case "delete":
                            logoSource = "/images/remove.png";
                            break;
                        default:
                            console.log("defaultOperate");
                    }
                    tImg.setAttribute("src", logoSource);//不同的类型根据当前 logoSource添加对应的logoSource
                    tDiv.appendChild(tImg);
                }

                //clickEventPart
                if (optionConf.event) {
                    $.each(optionConf.event, function (ele, index) {
                        if (ele === "onclick") {
                            tImg.onclick = function (e) {
                                var domIndex = $(e.target.parentElement).index() - 1;
                                optionConf.event[ele](e, comObj, domIndex);//返回container or item
                            };
                        }

                    })
                }

                tDiv.appendChild(spanBtn);
                oField.appendChild(tDiv);
                comObj.issues[optionConf.field] = tDiv;
                comObj.issuesArr.push(tDiv);
                comObj.confArr.push(optionConf);
                return comObj.issues;
            };

            comObj.refreshItems = function (arr) {//arr拿到的是items的配置
                arr.forEach((ele, index) => {
                    comObj.addItem(ele);
                });
                return comObj.issues;
            };

            var oDiv = document.createElement("div");
            var oField = document.createElement("fieldset");
            var oLegend = document.createElement("legend");
            oDiv.setAttribute("class", "form-group dataItemWrapper");
            comObj.conf.display === "inline" && oDiv.classList.add('form-inline');
            oLegend.innerText = conf.label.text;


            oField.appendChild(oLegend);
            oDiv.appendChild(oField);
            comObj.issues = {//define for save items become issues

            };
            comObj.issuesArr = [];
            comObj.confArr = [];
            options.content.forEach((ele, index) => {
                comObj.addItem(ele);
            });

            return oDiv;
        }

        function oDynamicContainer(options) {
            //声明给dataItem类添加操作方法
            comObj.addIssue = function (content) {
                var tSpan = document.createElement("span");
                tSpan.innerHTML = content;
                oContainer.appendChild(tSpan);
                comObj.issuesArr.push(tSpan);
                return comObj.issuesArr;
            };

            comObj.deleteIssue = function (dom) {
                comObj.issuesArr.forEach(function (ele, index) {
                    if (ele == dom) {
                        $(comObj.issuesArr[index]).remove();//delete dom obj
                        comObj.issuesArr.remove(ele);
                    }
                });
                return comObj.issuesArr;
            };

            comObj.removeIssuesAll = function () {
                $(comObj.dom.self).empty();//delete dom objc , use  empty not remove
                comObj.issuesArr = [];
                return comObj.issuesArr;
            };

            // comObj.refreshItems = function (arr) {//arr拿到的是items的配置
            //     arr.forEach((ele, index) => {
            //         comObj.addItem(ele);
            //     });
            //     return comObj.issues;
            // };

            var oContainer = document.createElement("div");
            var oDiv = document.createElement("div");
            var oLabel = document.createElement("label");
            oDiv.setAttribute("class", "form-group inputWrapper");
            comObj.conf.display === "inline" && oDiv.classList.add('form-inline');
            oLabel.setAttribute("class", "label-control");
            oLabel.innerText = conf.label.text;
            oContainer.setAttribute("name", conf.itemId);
            oContainer.setAttribute("class", "form-control");
            oContainer.setAttribute("disabled", "disabled");
            oContainer.setAttribute("id", conf.itemId);
            oContainer.style.height = 'auto';
            oContainer.style.minHeight = '34px';
            oDiv.appendChild(oLabel);
            oDiv.appendChild(oContainer);
            comObj.issuesArr = [];

            return oDiv;
        }
    }

    function inputEventBind(event, options) {
        if (options.type === 'radio' || options.type === 'checkbox') {
            let inputArr = $(comObj.dom.entire).find('input');//此时并没有dom元素，有的是ele
            $.each(inputArr,(index,ele) => {
                bindEvent(ele, event);//ele是dom元素
            });
        } else {
            bindEvent(comObj.dom.self, event);
        }

        function bindEvent(dom, e) {
            for (var prop in e) {
                if (e.hasOwnProperty(prop)) {
                    dom[prop] = e[prop];
                }
            }
        }
    }

    function selectEventBind(event) {
        for (var prop in event) {
            if (event.hasOwnProperty(prop)) {
                comObj.dom.self[prop] = event[prop];
            }
        }
    }

    comObj.eventBind = function (event) {
        var timer;

        var _click = function (e) {
            return function (arg) {
                //setTimeout 计时器(延时器)
                clearTimeout(timer);//清除第一次的单击事件
                timer = setTimeout(function () {
                    e(arg);
                }, 300);             //500毫秒之后运行点击事件
            }
        };

        var _dblClick = function (e) {
            return function (arg) {
                clearTimeout(timer);//清除第二次的单击事件
                e(arg);
            }
        };

        var e;
        for (var prop in event) {
            //  对于prop的使用需要加上event.hasOwnProperty()的检测
            if (event.hasOwnProperty(prop)) {
                e = prop.slice(2, prop.length);//所以需要填写的部分仍然是onclick
                var self = $(comObj.dom.self);
                if (e === "click") {
                    self.on(e, _click(event[prop])); //目前只有button会进入eventBind 通过event isExist judge
                } else if (e === "dblclick") {
                    self.on(e, _dblClick(event[prop]));
                } else {
                    self.on(e, event[prop]);
                }
                self.css("cursor", "pointer")//改变一下手势
            }
        }

        //ztree default bindEvent of core
        // var _bindEvent = function (setting) {
        //     var o = setting.treeObj,
        //         c = consts.event;
        //     o.bind(c.NODECREATED, function (event, treeId, node) {
        //         tools.apply(setting.callback.onNodeCreated, [event, treeId, node]);
        //     });
        //
        //     o.bind(c.CLICK, function (event, srcEvent, treeId, node, clickFlag) {
        //         tools.apply(setting.callback.onClick, [srcEvent, treeId, node, clickFlag]);
        //     });
        //
        //     o.bind(c.EXPAND, function (event, treeId, node) {
        //         tools.apply(setting.callback.onExpand, [event, treeId, node]);
        //     });
        //
        //     o.bind(c.COLLAPSE, function (event, treeId, node) {
        //         tools.apply(setting.callback.onCollapse, [event, treeId, node]);
        //     });
        //
        //     o.bind(c.ASYNC_SUCCESS, function (event, treeId, node, msg) {
        //         tools.apply(setting.callback.onAsyncSuccess, [event, treeId, node, msg]);
        //     });
        //
        //     o.bind(c.ASYNC_ERROR, function (event, treeId, node, XMLHttpRequest, textStatus, errorThrown) {
        //         tools.apply(setting.callback.onAsyncError, [event, treeId, node, XMLHttpRequest, textStatus, errorThrown]);
        //     });
        //
        //     o.bind(c.REMOVE, function (event, treeId, treeNode) {
        //         tools.apply(setting.callback.onRemove, [event, treeId, treeNode]);
        //     });
        //
        //     o.bind(c.SELECTED, function (event, treeId, node) {
        //         tools.apply(setting.callback.onSelected, [treeId, node]);
        //     });
        //     o.bind(c.UNSELECTED, function (event, treeId, node) {
        //         tools.apply(setting.callback.onUnSelected, [treeId, node]);
        //     });
        // };

    };

    comObj.unbindEvent = function (prop) {
        $(comObj.dom.entire).off(prop);

        // var _unbindEvent = function (setting) {
        //     var o = setting.treeObj,
        //         c = consts.event;
        //     o.unbind(c.NODECREATED)
        //         .unbind(c.CLICK)
        //         .unbind(c.EXPAND)
        //         .unbind(c.COLLAPSE)
        //         .unbind(c.ASYNC_SUCCESS)
        //         .unbind(c.ASYNC_ERROR)
        //         .unbind(c.REMOVE)
        //         .unbind(c.SELECTED)
        //         .unbind(c.UNSELECTED);
        // };
    };

    comObj.fillValue = function (val, type) {
        switch (type) {
            case "input":
                if (comObj.conf.options.type === "radio" || comObj.conf.options.type === "checkbox") {
                    //length 决定性在于 content.length
                    this.conf.options.content.forEach((ele, index) => {
                        if (comObj.conf.value === ele.value) {
                            $(comObj.dom.entire).find('input')[index].checked = true;
                        }
                    });
                } else {
                    comObj.dom.self.value = val ? val : "";
                }
                break;
            case "select":
            case "textarea":
                comObj.dom.self.value = val ? val : "";
                break;
            case "button":
                break;
            case "address":
                var PAC = $(comObj.dom.entire);
                PAC.find('select').distpicker(val);
                break;
            case "preciseAddress":
                if (val) {
                    var $el = $(comObj.dom.self);
                    var formatter = {
                        point: {
                            lng: val.lng,
                            lat: val.lat
                        },
                        title: val.address,
                        address: val.address
                    };
                    var mapString = JSON.stringify(formatter);
                    $el.append("<option data-map='" + mapString + "'>" + val.address + "</option>");
                }
                break;
            case "dynamicContainer":
                if (val) {
                    comObj.removeIssuesAll(val);
                    comObj.addIssue(val);
                    comObj.dom.self.value = val
                }
                break;
            case "inputPart":
                var inpArr = $(comObj.dom.entire).find('input');
                [].forEach.call(inpArr, (ele, index) => {
                    ele.value = val[index];
                });
                break;
            default:
                comObj.dom.self.value = val ? val : "";
        }
    };

    comObj.validFill = function (type, valid) {
        switch (type) {
            case "name":
            case "姓名":
                valid.regexp = {
                    regexp: /^[\u4e00-\u9fa5_a-zA-Z]{2,20}$/,
                    message: "姓名是2-20个字符的中英文"
                    // message: 'The username can only consist of alphabetical, number, dot and underscore'
                };
                break;
            case "name-2":
            case "名称":
                valid.regexp = {
                    regexp: /^[a-zA-Z\u4e00-\u9fa5]{2,100}$/,
                    message: '名称是2-100个字符的中英文'
                    // message: 'The username can only consist of alphabetical, number, dot and underscore'
                };
                break;
            case "password":
            case "密码":
                valid.regexp = {
                    regexp: /^[a-zA-Z][a-zA-Z0-9]{6,20}/,
                    message: '密码是以英文开头,且不可含有中文的6-20个字符'
                };
                break;
            case "email":
            case "邮箱":
                valid.emailAddress = {
                    message: '邮箱地址格式有误'
                };
                valid.stringLength = {
                    min: 5,
                    max: 50,
                    message: "邮箱地址要求5-50个字符"
                };
                break;
            case "age":
            case "年龄":
                valid.lessThan = {
                    value: 100,
                    inclusive: true,
                    message: "年龄需要小于100"
                    // message: 'The ages has to be less than 100'
                };
                valid.greaterThan = {
                    value: 10,
                    inclusive: false,
                    message: '年龄需要大于等于10'
                    // message: 'The ages has to be greater than or equals to 10'
                };
                break;
            case "address":
            case "地址":
                valid.stringLength = {
                    min: 5,
                    max: 20,
                    message: "地址要求5-20个字符"
                    // message: 'The username must be more than 6 and less than 30 characters long'
                };
                valid.regexp = {
                    regexp: /[\u4e00-\u9fa5]+/,
                    message: '输入的内容需要包含中文'
                    // message: 'The username can only consist of alphabetical, number, dot and underscore'
                };
                break;
            case "description":
            case "描述":
                valid.stringLength = {
                    min: 0,
                    max: 50,
                    message: "描述要求不超过50个字符"
                    // message: 'The username must be more than 6 and less than 30 characters long'
                };
                break;
            case "IDCard":
            case "身份证":
                valid.regexp = {
                    regexp: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                    message: '输入的内容不是身份证号'
                    // message: 'The username can only consist of alphabetical, number, dot and underscore'
                };
                break;
            case "phoneNumber":
            case "电话号码":
                valid.regexp = {
                    regexp: /^[1]([3-9])[0-9]{9}$/,
                    message: "输入的内容不是电话号码"
                    // message: 'The input is not a valid phone number',
                };
                break;
            case "Landline":
            case "座机号":
                valid.regexp = {
                    regexp: /^[0-9]{3,4}[-][0-9]{7,8}$/,
                    message: '输入的内容不是座机号'
                };
                break;
            case "phone":
            case "电话":
                valid.regexp = {
                    regexp: /^[0-9]{3,4}[-][0-9]{7,8}$|^[1]([3-9])[0-9]{9}$/,
                    message: '输入的内容不是座机号或者座机号'
                };
                break;
            case "Chinese":
            case "中文":
                valid.regexp = {
                    regexp: /^[\u4e00-\u9fa5]+$/,
                    message: '输入的内容只可以包含中文'
                    // message: 'The username can only consist of alphabetical, number, dot and underscore'
                };
                break;
            case "number":
            case "数字":
                valid.regexp = {
                    regexp: /^[0-9]*$/,
                    message: '输入的内容只可以包含数字'
                    // message: 'The username can only consist of alphabetical, number, dot and underscore'
                };
                break;
            // case "validNumber":
            //     valid.regexp = {
            //         regexp: /^[0-9]{4,6}$/,
            //         message: '输入的不是4到6位的整数'
            //     };
            //     break;
            case "resourcePath":
            case "资源路径":
                valid.regexp = {
                    regexp: /^[a-zA-Z]{6,30}$/,
                    message: '资源路径要求是6-30位的英文'
                };
                break;
            case "type":
            case "类型":
                valid.stringLength = {
                    min: 2,
                    max: 20,
                    message: "类型要求2-20位字符"
                };
                break;
            case "formNumber":
            case "表单号":
                valid.stringLength = {
                    min: 1,
                    max: 30,
                    message: "表单号是不超过30位字符"
                };
                break;
            case "openAirAmount":
            case "开口气量":
                valid.regexp = {
                    regexp: /^[1-9][0-9]{0,31}$|^[0-9]{1,32}\.[0-9]{1,2}$/,
                    message: '开口气量整数位最多32位且最多保留两位小数'
                };
                break;
            case "steelNumber":
            case "表钢号":
                valid.regexp = {
                    regexp: /^[0-9a-zA-Z]{6,255}$/,
                    message: '表钢号是6-255位的数字或字母'
                };
                break;
            case "dialNumber":
            case "表盘示数":
                valid.regexp = {
                    regexp: /^[1-9][0-9]{0,7}$|^[0-9]{1,8}\.[0-9]{1,2}$/,
                    message: '整数位最多8位且最多保留两位小数'
                };
                break;
            case "customNumber":
            case "客户号":
                valid.regexp = {
                    regexp: /^[0-9]{1,20}$/,
                    message: '客户号是不超过20位的数字'
                };
                break;
            case "accountNumber":
            case "账户号":
                valid.regexp = {
                    regexp: /^[0-9]{1,20}$/,
                    message: '账户号是不超过20位的数字'
                };
                break;
            case "detailedAddress":
            case "详细地址":
                valid.stringLength = {
                    min: 6,
                    max: 255,
                    message: "详细地址要求是5-255个字符"
                    // message: 'The username must be more than 6 and less than 30 characters long'
                };
                break;
            case "materialType":
            case "物料类型":
                valid.stringLength = {
                    min: 2,
                    max: 20,
                    message: "物料类型要求是2-20个字符"
                    // message: 'The username must be more than 6 and less than 30 characters long'
                };
                valid.regexp = {
                    regexp: /^[a-zA-Z\u4e00-\u9fa5]*$/,
                    message: "物料类型只能包含中文或英文"
                };
                break;
            case "typeCode":
            case "类型编码":
                valid.regexp = {
                    regexp: /^[0-9]{1,2}$/,
                    message: "类型编码是不超过2位的数字"
                };
                break;
            case "SpecificationsConfig":
            case "规格配置":
                valid.regexp = {
                    regexp: /^[a-zA-Z\u4e00-\u9fa5]{1,20}$/,
                    message: "规格配置是不超过20个字符的中英文"
                };
                break;
            case "SpecificationsVal":
            case "规格值":
                valid.stringLength = {
                    min: 1,
                    max: 50,
                    message: "规格值要求不超过50个字符"
                };
                break;
            case "sizeModel":
            case "规格型号":
                valid.stringLength = {
                    max: 255,
                    message: "规格型号不超过255个字符"
                };
                break;
            case "assetsSizeModel":
            case "物资规格型号":
                valid.stringLength = {
                    min: 2,
                    max: 30,
                    message: "规格值要求是2-30个字符"
                };
                valid.regexp = {
                    regexp: /^[0-9a-zA-Z\u4e00-\u9fa5]*$/,
                    message: '物资规格型号不能为纯符号'
                };
                break;
            case "materialCode":
            case "物料编码":
                valid.regexp = {
                    regexp: /^[0-9]+([\-x][0-9]+){1,3}$/,
                    message: '物料编码的标准格式为 1-3-01-000001'
                };
                break;
            case "title":
            case "标题":
                valid.regexp = {
                    regexp: /^[a-zA-Z\u4e00-\u9fa5]{2,100}$/,
                    message: '标题为2到100位的中英文'
                };
                break;
            case "context":
            case "内容":
                valid.regexp = {
                    regexp: /^[a-zA-Z\u4e00-\u9fa5]{2,255}$/,
                    message: '内容为2到255位的中英文'
                };
                break;
            // case "dataTime-4":
            //     valid.regexp = {
            //         regexp: /^\d{4}-\d{1,2}-\d{1,2} - \d{4}-\d{1,2}-\d{1,2}/,
            //         message: '时间的标准格式为yyyy-mm-dd - yyyy-mm-dd'
            //     };
            //     break;
            case "sim卡号":
                valid.regexp = {
                    regexp: /^[0-9]{15}$/,
                    message: 'SIM卡号为15位的数字'
                };
                break;
            case "IMEI":
            case "IMEI号":
                valid.regexp = {
                    regexp: /^[0-9]{15}$/,
                    message: 'IMEI号为15位的数字'
                };
                break;
            case "startingAmount":
            case "起始量":
                valid.regexp = {
                    regexp: /^[1-9][0-9]{0,7}$|^[0-9]{1,8}\.[0-9]{1,2}$|0/,
                    message: '起始量整数位最多8位且最多保留两位小数'
                };
                break;
            case "receiptStoreroom":
            case "收货库房":
                valid.regexp = {
                    regexp: /^[0-9a-zA-Z\u4e00-\u9fa5]{2,20}$/,
                    message: '收货库房不可以包含特殊字符，长度2到20位'
                };
                break;
            case "deliveryId":
            case "送货单号":
                valid.regexp = {
                    regexp: /^[0-9a-zA-Z-]{1,50}$/,
                    message: '送货单号只可以包含数字、字母、-，长度不超过50位'
                };
                break;
            case "materialCode-2":
            case "物料编码2":
                valid.regexp = {
                    regexp: /^[0-9a-zA-Z]{1,20}$/,
                    message: '物料编码是不超过20位数字或字母'
                };
                break;
            case "materialName":
            case "物资名称":
                valid.regexp = {
                    regexp: /^[0-9a-zA-Z]{1,20}$/,
                    message: '物资名称是不超过20位数字或字母'
                };
                break;
            case "inBoundNum":
            case "入库数量":
                valid.greaterThan = {
                    value: 0,
                    inclusive: true,
                    message: '入库数量是大于0的整数'
                };
                valid.regexp = {
                    regexp: /^[0-9]{1,11}$/,
                    message: '入库数量是1-11位的整数'
                };
                break;
            case "outBoundNum":
            case "出库数量":
                valid.greaterThan = {
                    value: 0,
                    inclusive: true,
                    message: '出库数量是大于0的整数'
                };
                valid.regexp = {
                    regexp: /^[0-9]{1,11}$/,
                    message: '出库数量是1-11位的整数'
                };
                break;
            case "use":
            case "用途":
                valid.stringLength = {
                    min: 1,
                    max: 50,
                    message: "用途要求不超过个字符"
                };
                break;
            case "remark":
            case "备注":
                valid.stringLength = {
                    min: 1,
                    max: 50,
                    message: "备注要求不超过50个字符"
                };
                break;
            case "ruleNameJson":
            case "规则名称":
                valid.regexp = {
                    regexp: /^[\u4e00-\u9fa5a-zA-Z\d]{3,10}$/,
                    message: "规则名称是一个3-10位字符的中英文及数字"
                };
                break;
            case "rulesJson":
            case "最大次数":
                valid.regexp = {
                    regexp: /^(?!0)\d{1,3}$/,
                    message: "最大次数是1-3位非0数字"
                };
                break;
            case "value1":
            case "值1":
                valid.regexp = {
                    regexp: /^(\+)?\d{1,6}(\.\d{0,2})?$/,
                    message: "值1是1-6位数字"
                };
                break;
            case "value2":
            case "值2":
                valid.regexp = {
                    regexp: /^(\+)?\d{1,6}(\.\d{0,2})?$/,
                    message: "值2是1-6位数字"
                };
                break;
            case "deadTime":
            case "沉默时间":
                valid.regexp = {
                    regexp: /^(?!0)\d{1,3}$/,
                    message: "沉默时间是1-3位正整数"
                };
                break;
            case "cron":
            case "表达式":
                valid.regexp = {
                    regexp: '^[0-9\\s\\\\*?\\\\/]+$',
                    message: "请输入正确的cron"
                };
                valid.stringLength = {
                    min: 11,
                    max: 25,
                    message: "范围要求是11-25个字符"
                };
                break;
            case "strategyName":
            case "策略名":
                valid.regexp = {
                    regexp: /^[\u4e00-\u9fa5a-zA-Z\d]{3,10}$/,
                    message: "策略名是一个3-10位字符的中英文及数字"
                };
                break;
            case "strategyDescription":
            case "策略说明":
                valid.regexp = {
                    regexp: /^[\u4e00-\u9fa5a-zA-Z\d]{3,50}$/,
                    message: "策略说明是一个3-50位字符的中英文及数字"
                };
                break;
            default:
                valid.notEmpty = {
                    message: '内容默认不能为空'
                }
        }
    };

    comObj.extraFill = function (conf) {
        if (conf.placeholder) {
            comObj.dom.self.setAttribute("placeholder", conf.placeholder);
        }
    };

// comObj.getDomObj = function () {
//     return $("#" + comObj.conf.itemId);
// };

// comObj.refreshDomStr= function(){
//     comObj.domStr = oInputCreate();
//     return comObj.domStr;
// };

    comObj.getDom = function () {
        return comObj.dom.entire;
    };

    comObj.setValue = function (val) {
        comObj.fillValue("", comObj.conf.type);//清空
        comObj.fillValue(val, comObj.conf.type);
        comObj.dom.self.value = val;//单靠赋值无法解决所有问题
        comObj.conf.value = val;

    };

    comObj.getValue = function () {
        switch (comObj.conf.type) {
            case "input":
                if (comObj.conf.options.type === "radio") {
                    return $(comObj.dom.entire).find("#" + comObj.conf.itemId + " input:checked").val();
                } else if (comObj.conf.options.type === "checkbox") {
                    var arr = [];
                    var option = $(comObj.dom.entire).find("#" + comObj.conf.itemId + " input:checked");
                    $.each(option, function (index, ele) {
                        arr.push(ele.value);
                    });
                    return arr;
                } else {
                    return comObj.dom.self.value;
                }
            case "address":
                var PAC = $(comObj.dom.entire);
                return {
                    province: PAC.find('.province').val(),
                    city: PAC.find('.city').val(),
                    district: PAC.find('.district').val()
                };
            case "preciseAddress":
                var map = $(comObj.dom.entire).find('select option:selected')[0];
                var obj = JSON.parse(map.dataset.map);
                return {
                    address: obj.title,
                    lng: obj.point.lng,
                    lat: obj.point.lat
                };
            case "inputPart":
                var inpArr = $(comObj.dom.entire).find('input');
                var temp = {};
                $.each(inpArr, function (index, ele) {
                    temp[ele.getAttribute('id')] = ele.value;                                                          //value是小写
                });
                return temp;
            case "dynamicContainer":
                var container = $(comObj.dom.self);
                return container.text().replace(/\s+/g, "");
            case "button":
                return "";
            default:
                return comObj.dom.self.value;
        }
    };

    comObj.getValidators = function () {
        return comObj.conf.validators;
    };

    comObj.getEle = function () {
        if (comObj.conf.variable) {
            var vItems = comObj.variableItems;
            var tem = {
                name: comObj.conf.itemId,
                value: comObj.getValue()
            };
            tem.variableItems = {};
            for (var prop in vItems) {
                if (vItems.hasOwnProperty(prop)) {
                    tem.variableItems[prop] = vItems[prop].getValue();
                }
            }
            return tem;
        } else {
            return {
                name: comObj.conf.itemId,
                value: comObj.getValue()
            };
        }

    };

// comObj.insert = function (wrapper) {
//     $(wrapper.parent).append(comObj.rawItem);
//     $('#' + comObj.conf.itemId).data(comObj.conf);
// };

    comObj.setId = function (id) {
        comObj.dom.self.setAttribute('id', id);
        comObj.dom.self.setAttribute('name', id);
        comObj.conf.itemId = id;
    };

    comObj.getId = function () {
        return comObj.conf.itemId;
    };

    comObj.destroy = function () {
        comObj.dom.entire.remove();
    };

    comObj.hide = function () {
        comObj.dom.entire.style.display = 'none';
        return comObj.dom.entire.style.display;
    };

    comObj.show = function () {
        comObj.dom.entire.style.display = 'block';
        return comObj.dom.entire.style.display;
    };

    comObj.showInline = function () {
        comObj.dom.entire.style.display = 'inline-block';
        return comObj.dom.entire.style.display;
    };

    Array.prototype.remove = function (val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };
    return comObj;
};