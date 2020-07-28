package com.dream.test_alarm.vo;

import com.dream.test_alarm.common.annotation.BoTargetValue;
import com.dream.test_alarm.common.annotation.VoTargetValue;
import lombok.Data;

/**
 * 报警任务配置
 * @Author:SYz
 * @Date: 2020/7/16 10:43
 */
@Data
public class VOAlarmJobConf {
    private Long id;

    /**
     * 通道任务Id
     */
    private String deadTaskId;


    /**
     * 表达式
     */
    private String el;

    /**
     * 当前处理数量
     */
    private Integer jobCounts;

    /**
     * 任务Id
     */
    private String jobId;

    /**
     * 任务处理最大数量
     */
    private Integer jobMax;

    /**
     * 状态 1:启用、0:停用
     */
    @VoTargetValue(value = {@BoTargetValue(inValues = "0", strValues = "否"),
            @BoTargetValue(inValues = "1", strValues = "是")})
    private String state;

    /**
     * 策略id
     */
    private String strategyId;
}