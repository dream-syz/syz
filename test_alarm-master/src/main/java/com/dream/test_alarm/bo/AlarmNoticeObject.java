package com.dream.test_alarm.bo;


import com.bocontainer.annotaion.ForeignKey;
import lombok.Data;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

/**
 * 报警通知消息配置（BO）
 * @author Administrator
 * @version 1.0
 * @created 20-2��-2020 9:16:30
 */
@Data
public class AlarmNoticeObject {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY, generator = "JDBC")
	private Long id;
	/**
	 * 通知方式id
	 */
	private Integer noticeTypeId;
	/**
	 * 策略id
	 */
	@ForeignKey
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
	 * 通知人id
	 */
	private String userId;
	/**
	 * 操作人id
	 */
	private String operateUserId;
}