package com.dream.test_alarm.vo;

import com.alibaba.fastjson.annotation.JSONField;
import com.dream.test_alarm.common.annotation.BoTargetValue;
import com.dream.test_alarm.common.annotation.VoTargetValue;
import lombok.Data;

/**
 * 报警信息界面的VO
 * @Author:SYz
 * @Date: 2020/7/16 10:45
 */
@Data
public class VOAlarmInfo {
    /**
     * 报警信息（通过策略名查询）----策略名，报警对象名，报警原因，是否发送消息，消息发送时间
     */
    private Long id;

    /**
     * 策略Id
     */
    private String strategyId;

    /**
     * 策略名
     */
    private String strategyName;

    /**
     * 报警对象名
     */
    private String AlarmObjName;

    /**
     * 报警原因
     */
    private String reason;

    /**
     * 是否已发送消息 1：已发 0：未发
     */
    @VoTargetValue(value = {@BoTargetValue(inValues = "0", strValues = "未发"),
            @BoTargetValue(inValues = "1", strValues = "已发")})
    private String orSend;

    /**
     * 发送消息时间
     */
    @JSONField(format = "yyyy-MM-dd HH:mm:ss")
    private String sendTime;



}

