
    var ACCESS_MENUBAR = (function () {

        var menuBar = new Object();

        menuBar.loadMenuBar = function(funHref,href){

            $('#head-top-model').load("menuBar #headMenu");

            var option = {
                funHref:funHref,   // 当前功能菜单的url
                href:href,    //  当前系统页面的url
                menuId:"-1"       // 默认为-1
            };

            menuBar.InitMenuBar($("#sy_time"),$("#sysMenu"),$("#funMenu"),option);
        };

        menuBar.loadframeContent = function(option){

            $('#head-top-model').load("menuBar #headMenu");

            var option = {
                funHref: option.funHref,   // 当前功能菜单的urlhah
                href: option.href,    //  当前系统页面的url
                menuId: null == option.menuId ? "-1": option.menuId     // 默认为-1
            };

            menuBar.InitMenuBar($("#sy_time"),$("#sysMenu"),$("#funMenu"),option);

            option.href = option.funHref;
            option.menuId = ACCESS_MENUBAR.getMenuIdByUrl(option);

            MENUTREE.InitMenuTree(option, $("#sys-tree"), $("#iframe-page-content"));

            initContent.init($("#sys-tree"), $("#iframe-page-content"));
        };


        menuBar.InitMenuBar = function(timeElement,sysElement,funElement,temp){

            menuBar.InitMenuBars(temp.href,sysElement);

            menuBar.InitMenuBars(temp.funHref,funElement);

            menuBar.initMenuBarTime(timeElement);
        };

        menuBar.InitMenuBars = function(href,element) {

            var innerContent = "" ;

            var temp = ACCESS_PERMISSION.getSingleMenuByMenuHref(href);

            var result = ACCESS_PERMISSION.getSameLevelMenusByMenuHref(temp);

            if( result == null){ return }

            var menuContent = result.length == 0 ? constInnerButtonHtml(temp) :constDropdownHtml(temp);

            $.each(result, function (index, data) {

                innerContent += "<li><a href='" + data.nodeUrl + "'>"+ data.nodeName+"</a></li>";
            });

            menuContent += innerContent + "</ul></li>";

            element.empty();
            element.append(menuContent);
        };

        menuBar.initMenuBarTime = function(element) {

            var  time = new Date();

            var  timeContent  = "<i class='glyphicon glyphicon-time'></i>&nbsp;&nbsp;";

            var  date = getTime(time);

            var  hour = time.getHours();if(hour<10) hour = '0' + hour;
            var minutes = time.getMinutes();if(minutes<10) minutes = '0' + minutes;
            var seconds = time.getSeconds();if(seconds<10) seconds = '0' + seconds;

            timeContent = timeContent + date + " " + hour+":" + minutes + ":" + seconds ;

            element.html(timeContent);
        };

        menuBar.getMenuIdByUrl = function (menu) {

           return ACCESS_PERMISSION.getSingleMenuByMenuHref(menu.href).nodeId;
        };

        /*-------------------------------------  private -------------------------------------------------------------*/
        function constDropdownHtml(data) {

            return "<li class='dropdown'>"+
                "<button type='button' class='btn dropdown-toggle' id='dropdownMenu' data-toggle='dropdown'>"+data.nodeName+"<span class='caret'>" +
                "</span></button>"+
                "<ul class='dropdown-menu "+data.nodeId+"' role='menu' aria-labelledby='dropdownMenu'>" +
                "";
        }

        function constInnerButtonHtml(data){

            return  " <button type='button' class='btn dropdown-toggle'>"+data.nodeName+"</button>";
        }

        function getTime(time) {

            var year = time.getFullYear();
            if (year < 1900) year = year + 1900;

            var month = time.getMonth() + 1;
            if (month < 10) month = '0' + month;

            var day = time.getDate();
            if (day < 10) day = '0' + day;

            return year + "-" + month + "-" + day;
        }

        return menuBar;
    }());


    var MENUTREE = (function () {

        var menuTree = new Object();

        var menuTreeUrl = "hdst/menu/getAuthorityMenuTree";

        menuTree.InitMenuTree = function(menu,element,iframe){

            element.initTree({
                url: menuTreeUrl,
                bootstrap2: false,
                showTags: true,
                levels: 1,
                data: menu,
                unique: true
            });

            element.on('nodeSelected',function(event, data) {

                iframe.attr('src',data.href);
            });
        };

        return menuTree;

    }());