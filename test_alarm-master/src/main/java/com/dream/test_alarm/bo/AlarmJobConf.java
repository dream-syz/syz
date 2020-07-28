package com.dream.test_alarm.bo;

import com.bocontainer.annotaion.ForeignKey;
import com.dream.test_alarm.common.validator.annotation.EnumValue;
import com.dream.test_alarm.common.validator.intergroup.AddGroup;
import com.dream.test_alarm.common.validator.intergroup.UpdGroup;
import lombok.Data;


import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

/**
 * 报警任务配置
 */
@Data
public class AlarmJobConf {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY, generator = "JDBC")
    private Long id;

    /**
     * 通道任务Id
     */
    private String deadTaskId;


    /**
     * 表达式
     */
    @NotEmpty(message = "el不能为空",groups = {AddGroup.class})
    private String el;

    /**
     * 当前处理数量
     */
    private Integer jobCounts;

    /**
     * 任务Id
     */
    @NotEmpty(message = "jobId不能为空",groups = {AddGroup.class})
    private String jobId;

    /**
     * 任务处理最大数量
     */
    private Integer jobMax;

    /**
     * 状态 1:启用、0:停用
     */
    @EnumValue(intValues = {0,1},message = "状态必须为指定值",groups = {AddGroup.class, UpdGroup.class})
    @NotNull(message = "状态不能为空")
    private Integer state;

    /**
     * 策略id
     */
    @ForeignKey
    private Long strategyId;

    public AlarmJobConf(String deadTaskId, String el, int jobCounts, String jobId, int jobMax, int state, Long strategyId) {
        this.deadTaskId = deadTaskId;
        this.el = el;
        this.jobCounts = jobCounts;
        this.jobId = jobId;
        this.jobMax = jobMax;
        this.state = state;
        this.strategyId = strategyId;
    }

    public AlarmJobConf() {

    }
}
