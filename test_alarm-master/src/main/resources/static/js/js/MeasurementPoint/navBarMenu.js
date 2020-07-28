var navBarMenu = (function () {

    var nodeIdArr = [];
    var menuId;
    var navBar = new Object();

    navBar.Init = function (parameter, indexUrl, authorityMenuUrl, currentUrl) {
        startTime();
        loadMenuDom(parameter, indexUrl, "authority/getAuthoritysBySysUser");
        loadMenuItems(authorityMenuUrl, currentUrl, indexUrl);
    };

    //提供给外部使用的方法
    navBar.getMenuCodeByUrl = function (parameter, url) {
        $.ajax({
            url: url,
            type: "post",
            async: false,//取消异步
            dataType: "json",
            data: "parameter=" + JSON.stringify(parameter),
            success: function (res) {
                menuId = res.nodeId;
            }
        });
        return menuId;
    };

    function loadMenuDom(parameter, indexUrl, authorityUSerUrl) {
        var menuStr = "";
        var temp = {
            menuCode: parameter,
            dataUrl: indexUrl
        };
        $.ajax({
            url: authorityUSerUrl,
            type: "POST",
            dataType: "JSON",
            data: "parameter=" + JSON.stringify(temp),
            success: function (res) {
                console.log("$.ajaxSettings.async = " + $.ajaxSettings.async);
                if (res) {
                    $.each(res, function (index, ele) {
                        if (ele.nodeUrl === "#") {
                            menuStr += addBtnDom(index, ele);
                        } else {
                            menuStr += addLiDom(index, ele);
                        }
                        nodeIdArr.push(ele.nodeId);
                    });
                    menuStr += addLogoutDom();
                    $("#topMenu").append(menuStr);
                }
            }
        });
    }

    function loadMenuItems(authorityMenuUrl, currentUrl, indexUrl) {
        for (var i = 0; i < nodeIdArr.length; i++) {
            addMenuItems($("." + nodeIdArr[i]), nodeIdArr[i], authorityMenuUrl, currentUrl, indexUrl);
        }
    }

    // 加载功能菜单下的子菜单
    function addMenuItems(element, nodeId, authorityMenuUrl, currentUrl, indexUrl) {
        var itemsStr = "";
        $.ajax({
            url: authorityMenuUrl,
            type: "post",
            dataType: "json",
            data: "id=" + nodeId,
            success: function (res) {
                if (res) {
                    $.each(res, function (index, ele) {
                        if (currentUrl === ele.nodeUrl || indexUrl === ele.nodeUrl) {
                            element.prev().html(data.nodeName + "<span class='caret'></span>");
                        } else {
                            itemsStr += "<li id='" + ele.nodeId + "'><a href='" + ele.nodeUrl + "'>" + ele.nodeName + "</a></li>";      //添加不是当前页和系统的option
                        }
                    });
                    element.empty();
                    element.append(itemsStr);
                }
            }
        });
    }

    function addLogoutDom() {
        return "<li><a class='navbar-brand' href='logout'><i class='glyphicon glyphicon-off'></i></a></li>";
    }

    function addLiDom(index, data) {
        return "<li><a href='" + data.nodeUrl + "'>" + data.nodeName + "</a></li>";
    }

    function addBtnDom(index, data) {
        return "<li class='btn-group' style='margin-top:8px;margin-right:5px'>" +
            "<button type='button' class='btn btn-default dropdown-toggle' id='dropdownMenu" + index + "' data-toggle='dropdown'>" + data.nodeName +
            "<span class='caret'></span>" +
            "</button>" +
            "<ul class='dropdown-menu " + data.nodeId + "' role='menu' aria-labelledby='dropdownMenu" + index + "'></ul>" +
            "</li>";
    }

    function startTime() {
        var today = new Date();                                 //Thu Jul 04 2019 09:35:16 GMT+0800 (中国标准时间)
        var year = today.getFullYear();
        var month = checkTime(today.getMonth());
        var day = checkTime(today.getDate());
        var hours = checkTime(today.getHours());
        var minutes = checkTime(today.getMinutes());
        var seconds = checkTime(today.getSeconds());

        var timeStr = "<i class='glyphicon glyphicon-time'></i>&nbsp;&nbsp;";

        document.getElementById("sy_time").innerHTML = timeStr + year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;

        var t = setTimeout(function () {
            startTime()
        }, 1000);
    }

    function checkTime(i) {
        return i < 10 ? "0" + i : i;
    }

    return navBar;
}());