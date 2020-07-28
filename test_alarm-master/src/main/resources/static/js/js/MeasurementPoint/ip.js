/*
$(document).ready(function () {

    var province = '';
    var city = '';
    jQuery.getScript("http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js", function () {
        province = remote_ip_info["province"];
        city = remote_ip_info["city"];
        alert(city)
    });

})*/

Mock.mock('getAbc',{
    'name|3':'vic',
    'age|20.30':25,
})

function getAbc() {
    $.ajax({
        url:"getAbc",
        dataType:"json",
        success:function(msg){
            console.log(JSON.stringify(msg));
        }
    })
}