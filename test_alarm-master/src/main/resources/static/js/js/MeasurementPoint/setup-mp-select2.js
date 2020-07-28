

    $(function () {
        // select2Ajax($("#area_select"),'mp/selectDevInfoLike',"请输入表钢号");

        /*var data = [{ id: 0, text: 'enhancement' }, { id: 1, text: 'bug' }, { id: 2, text: 'duplicate' }, { id: 3, text: 'invalid' }, { id: 4, text: 'wontfix' }];
        $("#area_select").select2({
            data: data,
            placeholder:'请选择',
            allowClear:true
        })*/
    });

    /**
     *用select2 插件实现后台数据实时查询
     */
    function select2Ajax(element,ajax_url,plac_text,multiple) {
        //远程筛选
        element.select2({
            placeholder: plac_text,
            minimumInputLength: 1, /* 最小查询参数    */
            multiple: multiple, /* 多选设置    */
            height: '40px',
            maximumSelectionLength : 10,
            allowClear : true,
            language: "zh-CN",
            ajax: {
                url: ajax_url, /* ajax后台函数路径 */
                dataType: "json", /* 传输的数据类型，一般使用json或jsonp，jsonp比较复杂，需要APIKEY，暂时没进行研究 */
                type: "GET", /* GET即为前台JS向后台函数取数据，POST反之 */
                quietMillis: 100, /* 延时查询毫秒数 */
                data: function (term) {
                    return {
                        property: term.term, /* term为前台输入的查询关键字，保存到devCondition对象，即后台保存关键字的对象 */
    // 　　　　　　　　　　　　　　　　　　　page: 10   /* 每次查询的结果数 */

                    };
                },

                processResults: function (data) {
                    console.log("插入数据");
                    console.log(data);
                    return {
                        results: data  // results结果集，data为后台返回的查询结果
                };
                },
                cache: true
            },
            language:'zh-CN',
            escapeMarkup: function (markup) { return markup; },//字符转义
            formatResult: function formatRepo(repo){return repo.text;}, // 函数用来渲染结果
            formatSelection: function formatRepoSelection(repo){return repo.text;} ,// 函数用于呈现当前的选择
            dropdownCssClass: "bigdrop", 　　　　// 设定SELECT2下拉框样式，bigdrop样式并不在CSS里定义，暂时没深入研究
            escapeMarkup: function (m) {
                return m;
            }
        });

    };

   /* function resultFormatResult(orgs) {       /!* 下拉选项名称      *!/
        console.log(orgs);
        return '<div>' + orgs.text + '</div>';

    }

    function resultFormatSelection(orgs) {    /!* 选取后显示的名称     *!/
        return orgs.text;
    }*/

    /*function resultFormatResult(n) {       /!* 下拉选项名称      *!/
        console.log("查询返回的值："+JSON.stringify(n));
        return "<option id='" + n.id + "' value = '" + n.name + "'>" + n.name + "&#40;" + n.id + "&#41;</option>";
    }

    function resultFormatSelection(orgs) {    /!* 选取后显示的名称     *!/
        return orgs.name;
    }

    function formatRepoProvince(repo) {
        if (repo.loading) return repo.text;
        var markup = "<div>"+repo.name+"</div>";
        return markup;
    }*/
