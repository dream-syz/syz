         var pageBootCom=(function () {

             var pageObject = new Object();

             var defaultOption = {
                 prevLabel: "上一步",
                 nextLabel: "下一步",
                 skipLabel: "跳过",
                 doneLabel: "结束",
                 tooltipPosition: 'right',
                 showProgress: true,
                 steps:[]
             };

             pageObject.init=function (option,cookie_name) {

                 $.extend(defaultOption,option);

                 var newVisitor = isNewVisitor(cookie_name);// 如果是新访客
                 if(newVisitor === true)
                 {
                     alert('您是新用户！');
                     setCookie(cookie_name,"true", 5);
                     introJs().setOptions(defaultOption)
                         .oncomplete(function () {   //点击跳过按钮后执行的事件

                         }).onexit(function () { //点击结束按钮后， 执行的事件

                         }).onchange(function (element) {

                     }).start();
                 }
             };



             function isNewVisitor(cookie_name) {
                 var flg = getCookie(cookie_name);
                 if (flg === "") {
                     return true;
                 } else {
                     return false;
                 }
             }

            // 写字段到cookie
             function setCookie(cname, cvalue, exdays) {
                 var d = new Date();
                 d.setTime(d.getTime() + (exdays*24*60*60*1000));
                 var expires = "expires="+d.toUTCString();
                 document.cookie = cname + "=" + cvalue + "; " + expires +";path=/";
             }

            // 读cookie
             function getCookie(cname) {
                 var name = cname + "=";
                 var ca = document.cookie.split(';');
                 for(var i=0; i<ca.length; i++) {
                     var c = ca[i];
                     while (c.charAt(0)==' ') c = c.substring(1);
                     if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
                 }
                 return "";
             }



            return pageObject;
         }());
