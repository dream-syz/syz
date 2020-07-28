package com.dream.test_alarm.vo;

import com.dream.test_alarm.common.annotation.BoTargetValue;
import com.dream.test_alarm.common.annotation.VoTargetValue;
import lombok.Data;

/**
 * @Author:SYz
 * @Date: 2020/7/16 10:46
 */
@Data
public class VOAlarmNoticeObject {
    private Long id;

    /**
     * 通知方式id
     */
    @VoTargetValue(value = {@BoTargetValue(inValues = "0",strValues = "短信通知"),
            @BoTargetValue(inValues = "1",strValues = "邮件通知")})
    private String noticeTypeId;

    /**
     * 策略id
     */
    private Long strategyId;

    /**
     * 通知人姓名
     */
    private String noticeName;

    /**
     * 通知人电话
     */
    private String noticePhone;
    /**
     *
     * 通知人id
     */
    private String userId;

    /**
     * 操作人id
     */
    private String operateUserId;
}
