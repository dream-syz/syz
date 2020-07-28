package com.dream.test_alarm.bo;

import com.alibaba.fastjson.annotation.JSONField;
import com.bocontainer.annotaion.ForeignKey;
import com.bocontainer.annotaion.IgnoreParam;
import com.dream.test_alarm.common.validator.intergroup.AddGroup;
import com.dream.test_alarm.common.validator.intergroup.UpdGroup;
import lombok.Data;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Date;

/**
 * 报警信息
 */
@Data
public class AlarmInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY, generator = "JDBC")
    @NotNull(message = "主键不能为空",groups = {UpdGroup.class})
    private Long id;

    /**
     * 报警对象
     */
    @NotEmpty(message = "报警对象不能为空",groups = {AddGroup.class})
    private String alarmObj;

    /**
     * 报警源
     */
   // @NotEmpty(message = "报警源不能为空",groups = {AddGroup.class})
    private String alarmSoruce;

    /**
     * 报警对象数量
     */
   // @NotEmpty(message = "报警对象数量不能为空",groups = {AddGroup.class})
    private String alarmObjs;

    /**
     * 是否已发送消息 1：已发 0：未发
     */
    @NotNull(message = "orSend不能为空",groups = {AddGroup.class})
    private Integer orSend;

    /**
     * 报警原因
     */
    @NotEmpty(message = "报警原因不能为空",groups = {AddGroup.class})
    private String reason;

    /**
     * 发送消息时间
     */
    //@NotNull(message = "sendTime不能为空",groups = {AddGroup.class})
    @JSONField(format = "yyyy-MM-dd HH:mm:ss")
    private Date sendTime;

    /**
     * 创建消息时间
     */
    //@NotNull(message = "sendTime不能为空",groups = {AddGroup.class})
    @JSONField(format = "yyyy-MM-dd HH:mm:ss")
    private Date createTime;

    /**
     * 策略Id
     */
    @ForeignKey
    @NotNull(message = "strategyId不能为空",groups = {AddGroup.class})
    private Long strategyId;
    /**
     * 状态，0 有效，1 无效
     */
    private Integer state;

    /**
     * 规则Id
     */
    @IgnoreParam
    private Long ruleId;

    public AlarmInfo(String alarmObj, String alarmSoruce, String alarmObjs, Integer orSend, String reason, Date sendTime, Date createTime, Long strategyId) {
        this.alarmObj = alarmObj;
        this.alarmSoruce = alarmSoruce;
        this.alarmObjs = alarmObjs;
        this.orSend = orSend;
        this.reason = reason;
        this.sendTime = sendTime;
        this.createTime = createTime;
        this.strategyId = strategyId;
    }

    public AlarmInfo() {
    }
}
