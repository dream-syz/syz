
function InitAreaTree(parameter) {
    //初始化区域树控件
    var options = {
        url: "roleArea/getAreasBySysUser",
        bootstrap2: false,
        showTags: true,
        levels: 1,
        data: "id=" + parameter,
        unique: true,
        nodeIsSelected: function (event, data) {
            overAllIds.length = 0;
            checkBoxArray.length = 0;
            var lchart = echarts.init(document.getElementById('main'));
            lchart.clear();

            $("#tb_departments").bootstrapTable("refresh");
        },
    };
    // $("#treeview").empty();
    $("#treeview").initTree(options);
}

/*------------------------------------------------区域树的js------------------------------------------------------*/
/**
 *  获取选中的节点id 若没有选中，则默认返回顶层的第一个父节点
 * @returns {*}
 */
function judgmentIsSelected() {
    var select_node = $('#treeview').treeview('getSelected');//获得选中的节点
    if (select_node[0]) {
        return select_node[0].id;
    } else {
        var newdata = $('#treeview').returnData();
        return newdata[0][0].id;
    }
}

function judgementAreaTreeIsSelected() {
    var select_node = $('#treeview').treeview('getSelected');//获得选中的节点
    if (select_node[0]) {
        return select_node[0].id;
    }
    return "";
}
