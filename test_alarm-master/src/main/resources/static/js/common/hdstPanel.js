//新的对象形式
var comPanel = function () {
    var oPanel = {
        conf: {
            title: "",
            defaultStyle: {
                display: "inline-block",
                verticalAlign: "top"
            },
            css: {},
            callbacks: {
                onRemoveItem:null
            }
        },
        dom: {
            obj: null,
            body: null
        },
        items: [],
        eles: {}
    };
    oPanel.oInit = function (conf) {
        $.extend(oPanel.conf, conf);
        oPanel.dom.obj = generate(oPanel.conf);
        //add items
        conf.initContent && oPanel.itemsInit(conf.initContent);
        //add eles [table]
        conf.eles && oPanel.elesInit(conf.eles);

        function generate(conf) {

            var oWrapper = document.createElement("div");
            var oHead = document.createElement("div");
            var oBody = document.createElement("div");

            oWrapper.setAttribute("class", "panel panel-primary");
            //style part

            //先添加一部分默认的css : height
            oWrapper.style.height = "400px";

            if (conf.css) {
                for (var prop in conf.css) {
                    if (prop === "height") {
                        oWrapper.style.height = conf.css.height;
                    }
                    oWrapper.style[prop] = conf.css[prop];
                }

            }
            oWrapper.style.display = conf.defaultStyle.display;
            oWrapper.style.verticalAlign = conf.defaultStyle.verticalAlign;

            oHead.setAttribute("class", "panel-heading");
            oBody.setAttribute("class", "panel-body");
            oBody.style.overflow = 'auto';
            oBody.style.maxHeight = parseInt(oWrapper.style.height) - 40 - 2 + 'px';

            oHead.innerText = conf.title;
            oHead.style.height = "40px";

            oWrapper.appendChild(oHead);
            oWrapper.appendChild(oBody);

            oPanel.dom.body = oBody;
            return oWrapper;
        }
    };

    oPanel.itemsInit = function (arr) {
        $.each(arr, function (index, ele) {
            var temp = new comItem();
            temp.oInit(ele);
            oPanel.dom.body.appendChild(temp.getDom());
            oPanel.items.push(temp);
        });
    };

    oPanel.removeItem = function (obj) {
        for (var i = 0, j = oPanel.items.length; i < j; i++) {
            if (obj === oPanel.items[i]) {
                // obj.destroy();
                oPanel.dom.body.removeChild(oPanel.dom.body.childNodes[i]);
                // oForm.items[i].dom.entire.parentNode.removeChild(i + 1);
                //改变itemArr
                oPanel.items.splice(i, 1);
                oPanel.conf.callbacks.onRemoveItem && oPanel.conf.callbacks.onRemoveItem(obj, oPanel.items);
                i--;
                j--;
            }
        }
    };

    oPanel.removeItemById = function (id) {
        for (var i = 0, j = oPanel.items.length; i < j; i++) {
            if (id === oPanel.items[i].conf.itemId) {
                // obj.destroy();
                oPanel.dom.body.removeChild(oPanel.dom.body.childNodes[i]);
                // oForm.items[i].dom.entire.parentNode.removeChild(i + 1);
                //改变itemArr
                oPanel.items.splice(i, 1);
                oPanel.conf.callbacks.onRemoveItem && oPanel.conf.callbacks.onRemoveItem(oPanel.items[i], oPanel.items);
                i--;
                j--;
            }
        }
    };

    oPanel.appendItems = function (arr) {
        $.each(arr, function (index, ele) {
            console.log(index + " " + typeof ele);
            oPanel.dom.body.appendChild(ele.getDom());
            oPanel.items.push(ele);
        });
    };

    oPanel.elesInit = function (eles) {
        if (eles.tables) {
            oPanel.eles.tables = {};
            for (var prop in eles.tables) {
                if (eles.tables.hasOwnProperty(prop)) {
                    var tDom = document.createElement('table');
                    tDom.setAttribute('id', prop);
                    oPanel.dom.body.appendChild(tDom);
                    oPanel.eles.tables[prop] = {};
                    oPanel.eles.tables[prop].conf = eles.tables[prop];
                    //调用该fn 才代表table被加载在页面上 init 等于
                    oPanel.eles.tables.init = function (tableName) {
                        var conf = oPanel.eles.tables[tableName].conf;
                        var _tempTable = new commTable();
                        _tempTable.init(conf.defaultOptions, conf.btOptions);
                        oPanel.eles.tables[tableName].content = _tempTable;
                    }
                }
            }
        }
        if (eles.trees) {
            oPanel.eles.trees = {};
            for (var key in eles.trees) {
                if (eles.trees.hasOwnProperty(key)) {
                    var treeDom = document.createElement('div');
                    treeDom.setAttribute('id', key);
                    treeDom.setAttribute("class", "scrollTree ztree");
                    oPanel.dom.body.appendChild(treeDom);
                    oPanel.eles.trees[key] = {};
                    oPanel.eles.trees[key].conf = eles.trees[key];
                    //调用该fn 才代表tree被加载在页面上 init 等于
                    oPanel.eles.trees.init = function (treesName) {
                        var conf = oPanel.eles.trees[treesName].conf;
                        var _tempTree = new hdTree();
                        oPanel.eles.trees[treesName] = _tempTree;
                        _tempTree.init(conf);
                    }
                }
            }
        }
        if (eles.form) {

        }
    };

    oPanel.removeEle = function (obj) {

    };

    oPanel.appendEles = function (arr) {

    };

    oPanel.getDom = function () {
        return oPanel.dom.obj;
    };
    return oPanel;
}