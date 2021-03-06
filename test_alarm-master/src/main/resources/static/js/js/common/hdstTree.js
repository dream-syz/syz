var hdTree = function () {
    var treeObj = Object();

    let defaultInfo = [{
        id: 1,
        pId: 0,
        name: "没有查询到节点",
        data: {
            nodeId: 1008611
        }
    }];

    treeObj.dom = null;
    treeObj.$tree = null;
    treeObj.zTree = null;                                  //treeview的容器

    treeObj.defaultOption = {
        tID: null,
        search: false,                                                     //是否需要查询框
        select: {
            default: true,                                                  //是否默认选中[第一个节点]
            clickTrigger: true,                                             //是否触发
        },
        show: true,
        toolbar: {                                                          //保留内容，暂时未实现
            id: "",
            content: []
        },
        nodes: {
            data: []
        },
        setting: {}
    };

    treeObj.init = function (option) {

        treeObj.setOption(option);

        // var tempDom = $('#' + option.tID);
        //
        // treeObj.rawTree = tempDom.treeview(treeObj.defaultOption);
        // treeObj.dom = treeObj.rawTree[0];


        treeObj.loadTree();

        treeObj.requirementConfigure();
    };

    treeObj.setOption = function (option) {
        this.defaultOption = $.extend(this.defaultOption, option);
    };

    treeObj.loadTree = function () {
        console.log(this.defaultOption);
        var _opt = this.defaultOption;
        var t = $("#" + _opt.tID);
        var data = _opt.nodes.data;
        let flag = (!(!data || data.length === 0));
        $.fn.zTree.init(t, _opt.setting, flag ? data : defaultInfo);
        this.dom = t[0];

        //添加父级元素并赋值
        t.wrap("<div class='treeWrapper'></div>");
        this.$tree = t.parent();

        _tool.noDataCheck(flag);
    };

    treeObj.requirementConfigure = function () {
        var _opt = this.defaultOption;
        var tree = $("#" + _opt.tID);
        treeObj.zTree = $.fn.zTree.getZTreeObj(_opt.tID); //给treeObj.ztree赋值

        if (_opt.search) {
            var inp = document.createElement("input");
            //赋予style + attr + show in the page
            inp.setAttribute("id", _opt.tID + "_tv_searchFuzzy");
            inp.setAttribute("class", "form-control");
            inp.setAttribute("placeholder", "模糊查询");
            inp.style.marginBottom = "10px";
            treeObj.dom.parentElement.insertBefore(inp, treeObj.dom);

            inp.oninput = inp.onporpertychange = debounce(function (e) {
                console.log(this.value);
                treeObj.reload(treeObj.defaultOption.nodes.data);
                var nodes = treeObj.zTree.getNodesByParamFuzzy("name", this.value, null);
                console.log(this.value);
                console.log(nodes);
                //重新初始化即可
                if (this.value !== "") {
                    $.each(nodes, function (index, ele) {
                        if (ele.children && ele.children.length > 0) {
                            ele.children = [];
                        }
                    });
                    treeObj.reload(nodes);
                }
            }, 1000);

            function debounce(handler, delay) {
                var timer = null;
                return function () {
                    var _self = this;
                    var _arg = arguments;
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        handler.apply(_self, _arg);
                    }, delay)
                }
            }
        }

        _tool.defaultSelected();

        //暂时不需要这种工具栏
        // if(_opt.toolbar && _opt.toolbar.id){
        //     _opt.toolbar.content.forEach(function(ele,index){
        //         var tem = new comItem();
        //         tem.oInit(ele);
        //         $("#" + _opt.toolbar.id).append(tem.getDom());
        //     });
        // }

        if (!_opt.show) {
            //不显示
            this.$tree.hide();
        }
    };

    treeObj.destroy = function () {
        treeObj.zTree.destroy(treeObj.defaultOption.tID);
        //if 查询框有内容，需要清空
        var inp = this.$tree.find('input');
        if (inp.val()) {
            inp.val("");
        }
    };

    treeObj.refresh = function (nodesData) {
        //刷新维护defaultOption.nodes.data
        treeObj.defaultOption.nodes.data = nodesData;
        treeObj.reload(nodesData);
    };

    treeObj.reload = function (data) {
        let dataFlag = (!(!data || data.length === 0));
        let _tree = $("#" + treeObj.defaultOption.tID);
        treeObj.zTree = $.fn.zTree.init(_tree, treeObj.defaultOption.setting, dataFlag ? data : defaultInfo);
        _tool.noDataCheck(dataFlag);
        _tool.defaultSelected();
    };

    // treeObj.setData = function (data) {
    //
    //     treeObj.extendData(data);
    //
    //     treeObj.rawTree.treeview(treeObj.defaultOption);
    //
    // };
    //
    // treeObj.extendData = function (res) {
    //     var dataFormat;
    //
    //     if(res.state && res.state.code === 200){
    //         dataFormat = treeObj.changeDataFormat(res.data);
    //     } else {
    //         dataFormat = treeObj.changeDataFormat(res);                                                     //为现有的接口返回提供的处理
    //     }
    //
    //     treeObj.defaultOption = $.extend(treeObj.defaultOption, {data: dataFormat});
    // };
    //
    // treeObj.changeDataFormat = function (data) {
    //     var tempArray = [];
    //     $.each(data, function (index, ele) {
    //
    //         var obj = treeObj.objFormat(ele);
    //
    //         if (ele.childCount > 0) {
    //             obj.nodes = treeObj.changeDataFormat(ele.nodeChildren);
    //         }
    //
    //         tempArray.push(obj);
    //
    //     });
    //     return tempArray;
    // };
    //
    // treeObj.objFormat = function (customObj) {
    //     //返回treeview接收的对象形式
    //     return {
    //         id: customObj.nodeId,
    //         text: customObj.nodeName,
    //         href: customObj.nodeUrl,
    //         tags: [customObj.childCount > 0 ? customObj.childCount : ''],
    //         childCount: customObj.childCount > 0 ? customObj.childCount : 0
    //     };
    // };
    //
    // treeObj.nodeSingleClick = function (event, node) {
    //
    //     console.log(node);
    //
    //     if (node.childCount > 0) {
    //
    //         if (node.state.expanded) {
    //
    //             treeObj.rawTree.treeview('collapseNode', node.nodeId);
    //
    //         } else {
    //
    //             if ((!node.nodes && node.childCount > 0) || (node.nodes && node.nodes.length === 0)) {
    //
    //                 treeObj.loadChildNode(treeObj.defaultOption.url, node); //添加子节点
    //
    //             }
    //
    //             treeObj.rawTree.treeview('expandNode', node.nodeId);
    //
    //             $("ul ." + node.id).next().trigger('click');
    //         }
    //     } else {
    //         if (!node.state.selected) {
    //
    //             $("ul ." + node.id).trigger('click');                                                   //刷新点击
    //
    //         }
    //     }
    // };
    //
    // treeObj.loadChildNode = function (url, node) {
    //
    //     $.ajax({
    //         type: "POST",
    //         url: url,
    //         data: 'id=' + node.id,
    //         async: false,//取消异步
    //         dataType: "json",
    //         success: function (res) {
    //             console.log(res);
    //             if (!res) {
    //                 return;
    //             }
    //
    //             $.each(res, function (index, ele) {
    //
    //                 var ndd = {
    //                     id: ele.nodeId,
    //                     text: ele.nodeName,
    //                     href: ele.nodeUrl,
    //                     tags: [ele.childCount > 0 ? ele.childCount : ''],
    //                     childCount: ele.childCount > 0 ? ele.childCount : 0
    //                 };
    //                 if (ele.childCount > 0) {
    //                     ndd.nodes = [];
    //                 }
    //
    //                 treeObj.rawTree.treeview("addNode", [node.nodeId, {node: ndd}]);
    //             });
    //         }
    //     });
    // };
    //
    // treeObj.defaultSelect = function () {
    //     treeObj.rawTree.children().children().eq(0).trigger('click');
    // };
    //
    // treeObj.on = function (type,fn) {
    //     treeObj.rawTree.on(type,fn);
    // };

    treeObj.hide = function () {
        this.$tree.hide();
    };

    treeObj.show = function () {
        this.$tree.show();
    };

    treeObj.triggerClick = (node) => {
        $("#" + node.tId + "_a").trigger('click');
        treeObj.zTree.selectNode(node);//选中要在click之后
    };

    var _tool = {
        defaultSelected() {
            let opt = treeObj.defaultOption;
            if (opt.select.default) {
                //选中第一个节点
                let curNode = treeObj.zTree.getNodes()[0];
                if (opt.select.clickTrigger && curNode) {
                    treeObj.triggerClick(curNode);
                }
            }
        },
        noDataCheck(flag) {
            if (!flag) {//设置一下没有查到的时候不要勾选
                let targetChk = treeObj.$tree.find("a[title='没有查询到节点']").parent().find("span.button.chk");
                if (targetChk.length) targetChk.css({"width": 0});
            }
        }
    };


    return treeObj;
};


//prototype实现方式，使得js代码中可以根据原型链继续添加方法并使用,且不同的文件不会互相影响
var HDTree = function () {
    this.DEFAULTS = {
        tID: null,
        search: false,                                                     //是否需要查询框
        select: {
            default: true,                                                  //是否默认选中[第一个节点]
            clickTrigger: true,                                             //是否触发
        },
        show: true,
        toolbar: {                                                          //保留内容，暂时未实现
            id: "",
            content: []
        },
        nodes: {
            data: []
        },
        setting: {},
        onClick: function (item, $element) {
            return false;
        },
    };

    return this;
};

HDTree.prototype.init = function (options) {
    this.setOption(options);
    this.loadTree();
    this.requirementConfigure();
};

HDTree.prototype.setOption = function (options) {
    this.DEFAULTS = $.extend(this.DEFAULTS, options);
};

HDTree.prototype.loadTree = function () {
    console.log(this.DEFAULTS);
    var _opt = this.DEFAULTS;
    var t = $("#" + _opt.tID);
    $.fn.zTree.init(t, _opt.setting, _opt.nodes.data);
    this.dom = t[0];

    //添加父级元素并赋值
    t.wrap("<div class='treeWrapper'></div>");
    this.$tree = t.parent();
};

HDTree.prototype.requirementConfigure = function () {
    var _opt = this.DEFAULTS;
    var tree = $("#" + _opt.tID);
    this.zTree = $.fn.zTree.getZTreeObj(_opt.tID); //给treeObj.ztree赋值

    if (_opt.search) {
        var inp = document.createElement("input");
        //赋予style + attr + show in the page
        inp.setAttribute("id", _opt.tID + "_tv_searchFuzzy");
        inp.setAttribute("class", "form-control");
        inp.setAttribute("placeholder", "模糊查询");
        inp.style.marginBottom = "10px";
        this.dom.parentElement.insertBefore(inp, this.dom);

        inp.oninput = inp.onporpertychange = debounce((e) => {
            console.log(this.value);
            $.fn.zTree.init(tree, _opt.setting, _opt.nodes.data);
            var nodes = this.zTree.getNodesByParamFuzzy("name", this.value, null);
            console.log(this.value);
            console.log(nodes);
            //重新初始化即可
            if (this.value !== "") {
                $.each(nodes, function (index, ele) {
                    if (ele.children && ele.children.length > 0) {
                        ele.children = [];
                    }
                });
                $.fn.zTree.init(tree, _opt.setting, nodes);
            }
        }, 1000);

        function debounce(handler, delay) {
            var timer = null;
            return function () {
                var _self = this;
                var _arg = arguments;
                clearTimeout(timer);
                timer = setTimeout(function () {
                    handler.apply(_self, _arg);
                }, delay)
            }
        }
    }

    if (_opt.select.default) {
        //选中第一个节点
        var curNode = this.zTree.getNodes()[0];
        if (_opt.select.clickTrigger && curNode) {
            $("#" + curNode.tId + "_a").trigger('click');
        }
        this.zTree.selectNode(curNode);//选中要在click之后
    }

    //暂时不需要这种工具栏
    // if(_opt.toolbar && _opt.toolbar.id){
    //     _opt.toolbar.content.forEach(function(ele,index){
    //         var tem = new comItem();
    //         tem.oInit(ele);
    //         $("#" + _opt.toolbar.id).append(tem.getDom());
    //     });
    // }

    if (!_opt.show) {
        //不显示
        this.$tree.hide();
    }
};

HDTree.prototype.show = function () {
    console.log(this);
};

// HDTree.prototype.hide = function () {
//     console.log(this);
// };

