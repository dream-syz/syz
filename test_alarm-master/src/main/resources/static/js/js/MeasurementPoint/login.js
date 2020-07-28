        $(function () {

            window.onload = function() {
                    ACCESS_CACHE.clear();
            };

            HdstLogin.doesItExistByKickoutAndTimeout();

            HdstLogin.pluginValidation($('#login-form'));
            HdstLogin.setUserNameByCookie("hdst-username");

            document.getElementById('passwd').focus();
        });


        var HdstLogin = (function () {

            var login = new Object();

            login.checkInput = function () {

                var password_input = $("#passwd");
                var password_md5 = $("#txt_passwd");

                password_md5.val(md5(password_input.val()));
                return true;
            };

            login.doesItExistByKickoutAndTimeout = function(){

                var href = location.href;

                if(href.indexOf("kickout")>0){

                    Common.showMessageCon("您的账号在另一台设备上登录,如非本人操作，请立即修改密码!");
                }
                if(href.indexOf("timeout")>0){

                    Common.showMessageCon("由于您长时间未操作，请重新登录!");
                }

                if (window.parent.window != window) {
                    window.top.location = "/toLogin";
                }

            };

            login.setUserNameByCookie = function(name){

                var  userName = login.getCookie(name);

                if (!Common.isEmpty(userName)){
                    $("#username").val(userName);
                }
            };

            login.getCookie = function(name){
                var arg = name + "=";
                var alen = arg.length;
                var clen = document.cookie.length;
                var i = 0;
                while (i < clen) {
                    var j = i + alen;
                    if (document.cookie.substring(i, j) == arg)
                        return GetCookieVal(j);
                    i = document.cookie.indexOf(" ", i) + 1;
                    if (i == 0) break;
                }
                return null;
            };

            login.SetCookie = function (name, value, days) {

                var finalDays = 7;

                if (typeof (days) != "undefined" && !isNaN(days)){
                    finalDays = parseInt(days);
                }
                var exp = new Date();
                exp.setTime(exp.getTime() + finalDays * 24 * 60 * 60 * 1000);

                document.cookie = name + "=" + escape(value) + ";path=/ ;expires=" + exp.toGMTString();
            };

            function GetCookieVal(offset) {

                var endstr = document.cookie.indexOf(";", offset);

                if (endstr == -1)
                    endstr = document.cookie.length;
                return unescape(document.cookie.substring(offset, endstr));
            }

            login.pluginValidation = function (element) {
                element.bootstrapValidator({
                    // live:'disabled',    //提交再验证
                    excluded:[':disabled',':hidden',':not(:visible)'],//排除控件
                    // submitButtons:'#Sign-in',   //指定提交按钮
                    fields: {
                        username: {
                            validators: {
                                notEmpty: {
                                    message: '用户名不能为空'
                                },
                                regexp: {
                                    regexp: /^[\u4e00-\u9fa5\w]{4,16}$/,
                                    message: '用户名由4到16位的中文,数字,字母和下划线'
                                }
                            }
                        },
                        passwd: {
                            validators: {
                                notEmpty: {
                                    message: '密码不能为空'
                                },
                                regexp: {
                                    regexp: /^[A-Za-z0-9]{1}([A-Za-z0-9]|[._]){5,19}$/,
                                    message: "密码由6-20位的字母、数字、下划线和点“.”组成"
                                }
                            }
                        }
                    }
                });
            };


            return login;
        }());
