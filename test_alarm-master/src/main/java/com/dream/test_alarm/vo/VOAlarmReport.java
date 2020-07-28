package com.dream.test_alarm.vo;

import com.dream.test_alarm.common.validator.intergroup.AddGroup;
import com.dream.test_alarm.common.validator.intergroup.UpdGroup;
import lombok.Data;

import javax.validation.constraints.NotEmpty;

/**
 * 报警报表界面VO
 * @Author:SYz
 * @Date: 2020/7/13 16:14
 */
@Data
public class VOAlarmReport {
    /**
     * table属性----报警对象编号，报警对象，是否压力异常，是否饱和蒸汽异常，是否通讯异常，报表详情
     */
    private Long id;

    /**
     * 报警对象编号
     */
    @NotEmpty(message = "alarmObjId不能为空",groups = {AddGroup.class, UpdGroup.class})
    private String alarmObjId;

    /**
     *报警对象
     */
    @NotEmpty(message = "alarmObjName不能为空",groups = {AddGroup.class,UpdGroup.class})
    private String alarmObjName;

    /**
     * 报警故障描述
     */
    @NotEmpty(message = "strategyDes不能为空",groups = {AddGroup.class,UpdGroup.class})
    private String strategyDes;

    /**
     * 报表详情(项目原来代码是直接跳转显示报警信息界面)
     */


}
