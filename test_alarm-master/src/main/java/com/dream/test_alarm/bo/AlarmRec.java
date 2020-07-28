package com.dream.test_alarm.bo;

import com.bocontainer.annotaion.ForeignKey;
import lombok.Data;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Date;

/**
 * 报警记录
 */
@Data
public class AlarmRec {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY, generator = "JDBC")
    private Long id;

    /**
     * 报警信息Id
     */
    @NotNull(message = "alarmInfoId不能为空")
    private Long alarmInfoId;

    /**
     * 发生时间
     */
    @NotNull(message = "happenTime不能为空")
    private Date happenTime;

    /**
     * 监控对象Id
     */
    @NotEmpty(message ="moniterId不能为空" )
    private String moniterId;

    /**
     * 规则Id
     */
    @ForeignKey
    @NotNull(message = "ruleId不能为空")
    private Long ruleId;

    /**
     * 状态
     */
    @NotNull(message = "state不能为空")
    private Integer state;


    /**
     * 故障描述
     */
    @NotEmpty(message ="strategyDes不能为空" )
    private String strategyDes;

    public AlarmRec( Long alarmInfoId, Date happenTime,  String moniterId, Long ruleId,  Integer state,  String strategyDes) {
        this.alarmInfoId = alarmInfoId;
        this.happenTime = happenTime;
        this.moniterId = moniterId;
        this.ruleId = ruleId;
        this.state = state;
        this.strategyDes = strategyDes;
    }

    public AlarmRec() {
    }
}
