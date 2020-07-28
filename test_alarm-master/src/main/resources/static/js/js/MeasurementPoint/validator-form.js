var lastElement = null;

/*------------------------------------验证---------------------------------------*/
function judegFormCommon(element, btnName) {
    console.log("验证")

        if(lastElement === element){
            return ;
        }else {
            lastElement = element;
        }


     // element.data('bootstrapValidator').destroy();
    // element.data('bootstrapValidator').resetForm();
    // element.data('bootstrapValidator').clearForm();

    element.bootstrapValidator({
            live: 'disabled',    //提交再验证
            excluded: [':disabled', ':hidden', ':not(:visible)'],  //排除控件
            submitButtons: btnName,   //指定提交按钮
            feedbackIcons: { //根据验证结果显示的各种图标
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                noEmptyInput: {
                    validators: {
                        notEmpty: {//检测非空，radio也可用
                            message: '输入框不为空'
                        }

                    }
                },
                telphone: {
                    validators: {
                        notEmpty: {//检测非空，radio也可用
                            message: '电话号码不能为空'
                        },
                        regexp: {//正则验证
                            regexp: /^1[1-9][0-9]{9}$/,
                            message: '请输入正确的电话号码'
                        },

                    }
                }
            }
        }
    );

}