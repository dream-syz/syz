package com.dream.test_alarm.vo;

import com.alibaba.fastjson.annotation.JSONField;
import com.dream.test_alarm.common.annotation.BoTargetValue;
import com.dream.test_alarm.common.annotation.VoTargetValue;
import lombok.Data;

/**
 * 报警信息对象
 *
 * @Author:SYz
 * @Date: 2020/7/13 14:44
 */
@Data
public class VOAlarmRec {
    private Long id;

    /**
     * 报警信息Id
     */
    private Long alarmInfoId;

    /**
     * 发生时间
     */
    @JSONField(format = "yyyy-MM-dd HH:mm:ss")
    private String happenTime;

    /**
     * 监控对象Id
     */
    private String moniterId;

    /**
     * 规则Id
     */
    private Long ruleId;

    /**
     * 状态  已恢复  未恢复  已关闭
     */
    @VoTargetValue(value = {@BoTargetValue(inValues = "0", strValues = "已恢复"),
            @BoTargetValue(inValues = "1", strValues = "未恢复"), @BoTargetValue(inValues = "2", strValues = "已关闭")})
    private String state;


    /**
     * 故障描述
     */
    private String strategyDes;
}