package com.dream.test_alarm.vo;

import com.alibaba.fastjson.annotation.JSONField;
import com.dream.test_alarm.common.annotation.BoTargetValue;
import com.dream.test_alarm.common.annotation.VoTargetValue;
import lombok.Data;

import java.util.List;

/**
 * 报警策略界面的VO
 * @Author:SYz
 * @Date: 2020/7/13 16:15
 */
@Data
public class VOAlarmStrategy {
    /**
     * table----策略id,策略名，策略描述，是否启动，【修改，详情】
     * 修改----策略名，规则，表达式，沉默时间，策略说明，选择报警对象【报警对象列表】，是否启动，是否开启通知，通知方式，通知对象
     * 详情----策略名，规则，表达式，报警对象，是否启动，是否开启通知，通知方式，通知对象
     */
    /**
     * 通过该对象获取规则名
     */
    private VOAlarmRule alarmRule;

    /**
     * 通过该对象获取表达式
     */
    public VOAlarmJobConf alarmJobConf;

    /**
     * 通过该对象获取通知方式
     */
    public VOAlarmNoticeObject alarmNoticeObject;


    /**
     * 通过报警对象集获取通知对象和通知人
     */
    private List<VOAlarmNoticeObject> alarmNoticeObjectList;

    /**
     * 策略id
     */
    private Long id;

    /**
     * 策略名
     */
    private String name;

    /**
     * 描述（策略说明）
     */
    private String description;

    /**
     * 是否启动 1:启动 0：不启动
     */
    @VoTargetValue(value = {@BoTargetValue(inValues = "0", strValues = "否"),
            @BoTargetValue(inValues = "1", strValues = "是")})
    private String orEnable;

    /**
     * 沉默时间
     */
    private Integer deadTime;

    /**
     * 是否通道沉默 1：是 0：否
     */
    @VoTargetValue(value = {@BoTargetValue(inValues = "0", strValues = "否"),
            @BoTargetValue(inValues = "1", strValues = "是")})
    private String orChanelSilence;

    /**
     * 是否通知  1：通知 0：不通知
     */
    @VoTargetValue(value = {@BoTargetValue(inValues = "0", strValues = "否"),
            @BoTargetValue(inValues = "1", strValues = "是")})
    private String orNotice;

//--------------------------------------------------------------------------------------------------
    /**
     * 最后修改时间
     */
//    @JSONField(format = "yyyy-MM-dd HH:mm:ss")
//    private String lastUpTime;

    /**
     * 最后修改人ID
     */
//    private String lastUpUserId;

//    public List<VOAlarmInfo> alarmInfo;

}
