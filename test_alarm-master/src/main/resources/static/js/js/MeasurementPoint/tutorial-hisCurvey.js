function init() {
    var newVisitor = isNewVisitor();// 如果是新访客
    if (newVisitor === true) {
        alert('您是新用户！');
        setCookie("gznotes-visited", "true", 5);
        pageBoot();
    }
}

/*-------------------------------------------------页面引导-----------------------------------------------------------*/

function pageBoot() {
    introJs().setOptions({
        prevLabel: "上一步",
        nextLabel: "下一步",
        skipLabel: "跳过",
        doneLabel: "结束",
        tooltipPosition: 'right',
        showProgress: true,
        steps: [{
            element: '.list-group',
            intro: '<div class="tour-header"><b>系统使用指引</b>\n</div>' +
            '<div class="tour-step" >单击展开区域\n' +
            '如需关闭指引，请点击跳过按钮</div>',
            position: 'right'
        },
            {
                element: '.bootstrap-table',
                intro: '<div class="tour-header"><b>系统使用指引</b>\n</div>' +
                '<div class="tour-step" >所查询的表计信息\n</div>',
                position: 'right'
            },
            {
                element: '.form-horizontal',
                intro: '<div class="tour-header"><b>&nbsp;&nbsp;&nbsp;系统使用指引&nbsp;&nbsp;&nbsp;</b>\n</div>' +
                '<div class="tour-step" >想要更精确的查询表计,填入表钢号或IMEI号,表计状态,表计安装时间任一都可</div>',
                position: 'right'
            },
            {
                element: '.dropdown .function',
                intro: '<div class="tour-header"><b>系统使用指引</b>\n</div>' +
                '<div class="tour-step">想要更多的功能可以点开功能菜单按钮,这里集合了所有功能模块</div>',
                position: 'bottom'
            },
            {
                element: '.MpInfobody',
                intro: '<div class="tour-header"><b>系统使用指引</b>\n</div>' +
                '<div class="tour-step" >here!想要的表计基本信息都在这里</div>',
                position: 'right'
            },
            {
                element: '.DataItembody',
                intro: '<div class="tour-header"><b>系统使用指引</b>\n</div>' +
                '<div class="tour-step" >here!表计的数据项信息在这里</div>',
                position: 'right'
            },
            {
                element: '.hourdata',
                intro: '<div class="tour-header"><b>系统使用指引</b>\n</div>' +
                '<div class="tour-step" >here!表计的小时数据曲线图</div>',
                position: 'right'
            }
        ]
    }).oncomplete(function () {
        //点击跳过按钮后执行的事件
    }).onexit(function () {
        //点击结束按钮后， 执行的事件
    }).onchange(function (element) {
        console.log(element.id);
    }).start();
}

function isNewVisitor() {
    var flg = getCookie("gznotes-visited");
    if (flg === "") {
        return true;
    } else {
        return false;
    }
}

// 写字段到cookie
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires + ";path=/";
}

// 读cookie
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}


/*-------------------------------------------------页面引导结束-----------------------------------------------------------*/