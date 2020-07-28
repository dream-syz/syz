
        var permissions = [];

        var  Button_Permissions = (function () {

            var button = new Object();

            button.getSysRolePermissions = function(url){

                Common.commonAjax(url,false,null
                    ,function (res) {
                        permissions = res;
                    },function (res) {
                        permissions =[];
                    })
            };

            button.intersect = function (objects,objects2) {
                var tempObjects = objects.concat(objects2);
                var repeatItems = [];
                for(var i = 0;i < tempObjects.length;i++){
                    var itemCount = this.getCountByItem( tempObjects,tempObjects[i] );
                    if( itemCount > 1 ){
                        repeatItems.push( tempObjects[i] );
                        tempObjects[i] = null;
                    }
                }
                return repeatItems;
            };

            button.getCountByItem = function (objects,item) {
                var count = 0;
                for(var i = 0;i < objects.length;i++){
                    if(this.equals(objects[i] , item ) ){
                        count++;
                    }
                }
                return count;
            };

            button.equals = function (param ,param2) {
                return JSON.stringify(param) === JSON.stringify(param2);
            };

            button.checkPermissions = function (temp,btns,permissions) {
                var len = permissions.length;
                var flag = false;
                var bean = [];
                for ( var i = 0; i <btns.length; i++){
                    for (var j = 0; j <len; j++) {
                        if(this.equals(btns[i],permissions[j])){
                            flag = true;
                        }
                    }
                    if(flag){
                        bean.push(temp[i]);
                        flag = false
                    }
                }
                return bean;
            };

            return button;
        }());