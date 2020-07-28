
            var baiduMaps = (function () {

                var BaiduMap = new Object();

                BaiduMap.bindClick=function(obj){
                    //初始化地图模态框
                    var map = new BMap.Map("areaMap");
                    var str=$.trim(obj.value);
                    BaiduMap.init(map,str);
                    $("#baidu_map_area").modal("show");
                };

                BaiduMap.init = function (map,str) {
                    var coordinate = str == "" ? null:BaiduMap.splitString(str,",");
                    map.enableScrollWheelZoom();
                    var geolocation = new BMap.Geolocation();
                    geolocation.getCurrentPosition(function (res) {
                        BaiduMap.isSuccessful(map,this,res,coordinate);
                    }, {enableHighAccuracy: true});
                };


                BaiduMap.isSuccessful = function (map,element,res,coordinate){
                    if(null!=coordinate){
                        var point = new BMap.Point(coordinate[0],coordinate[1]);
                        BaiduMap.isSuccessfulByStatus(map,point);
                    }else if (element.getStatus() == BMAP_STATUS_SUCCESS) {
                        var point = new BMap.Point(res.point.lng, res.point.lat);
                        BaiduMap.isSuccessfulByStatus(map,point);
                    } else {
                        alert('failed' + element.getStatus());
                        var point = new BMap.Point(112.883092,28.145744);
                        BaiduMap.isSuccessfulByStatus(map,point);
                    }
                };

                BaiduMap.isSuccessfulByStatus = function (map,point) {
                    map.centerAndZoom(point, 12);
                    window.map = map;
                    var marker = new BMap.Marker(point, {
                        enableMassClear: false,
                        raiseOnDrag: true
                    });
                    marker.enableDragging();
                    map.addOverlay(marker);

                    map.addEventListener("click", function (e) {
                        if (!(e.overlay)) {
                            map.clearOverlays();
                            marker.show();
                            marker.setPosition(e.point);
                            BaiduMap.setResult(e.point.lng, e.point.lat);
                        }
                    });
                    marker.addEventListener("dragend", function (e) {
                        BaiduMap.setResult(e.point.lng, e.point.lat);
                    });
                };

                BaiduMap.setResult = function (lng, lat) {
                    $("#coordinate").val(lng + ", " + lat);
                };

                BaiduMap.splitString = function (character,delimit) {

                    if(Common.isNull(character)){
                        return  character.split(delimit);
                    }

                    return character;
                };

                return BaiduMap;
            }());