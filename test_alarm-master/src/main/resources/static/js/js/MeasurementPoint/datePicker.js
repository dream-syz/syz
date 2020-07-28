/*----------------------------------------------初始化日期控件以及下拉框的js--------------------------------------------------*/
var ButtonInit = function () {
    var oInit = new Object();

    oInit.Init = function () {

        //初始化下拉框

        $(".selectpicker").selectpicker({
            noneSelectedText: '请选择',
        });

        //初始化状态下拉数据
        var obj = "states";
        var url = "meters/getAllMeterState";
        getAllStates(obj, url);

        //初始化滚动条
        var ScrollbarName = "col-lg-2 .panel-body";
        AddScrollbar(ScrollbarName);

        //初始化table上被点击行的颜色改变
        $('#tb_departments').on('click-row.bs.table', function (e, row, element) {
            $('.success').removeClass('success');//去除之前选中的行的，选中样式
            $(element).addClass('success');//添加当前选中的 success样式用于区别
        });

        //初始化日期控件
        $("input[name='date2']").daterangepicker(
            {
                autoApply: true,
                timePicker: true,
                timePicker24Hour: true,
                autoUpdateInput: false,
                timePickerSeconds: true,
                alwaysShowCalendars: true,
                ranges: {
                    '今天': [moment(), moment()],
                    '昨天': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    '近7天': [moment().subtract(7, 'days'), moment()],
                    '这个月': [moment().startOf('month'), moment().endOf('month')],
                    '上个月': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                },
                locale: {
                    format: "YYYY/MM/DD HH:mm:ss",
                    separator: " - ",
                    applyLabel: "确认",
                    cancelLabel: "清空",
                    fromLabel: "开始时间",
                    toLabel: "结束时间",
                    customRangeLabel: "自定义",
                    daysOfWeek: ["日", "一", "二", "三", "四", "五", "六"],
                    monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
                }
            }
        ).on('cancel.daterangepicker', function (ev, picker) {
            $("#date2").val("请选择日期范围");
            $("#startTime").val("");
            $("#endTime").val("");
        }).on('apply.daterangepicker', function (ev, picker) {
            $("#startTime").val(picker.startDate.format('YYYY-MM-DD HH:mm:ss'));
            $("#endTime").val(picker.endDate.format('YYYY-MM-DD HH:mm:ss'));
            $("#date2").val(picker.startDate.format('YYYY-MM-DD HH:mm:ss') + " 至 " + picker.endDate.format('YYYY-MM-DD HH:mm:ss'));
        });

    };
    return oInit;
};