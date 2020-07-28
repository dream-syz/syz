package com.dream.test_alarm.bo;



import com.dream.test_alarm.common.validator.annotation.EnumValue;
import com.dream.test_alarm.common.validator.intergroup.AddGroup;
import com.dream.test_alarm.common.validator.intergroup.DelGroup;
import com.dream.test_alarm.common.validator.intergroup.UpdGroup;
import lombok.Data;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Date;
import java.util.List;

/**
 * 报警策略
 *
 * @author Administrator
 * @version 1.0
 * @created 07-1��-2020 14:43:43
 */
@Data
public class AlarmStrategies {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY, generator = "JDBC")
	@NotNull(message = "id不能为空",groups = {UpdGroup.class, DelGroup.class})
	private Long id;

	/**
	 * 报警对象集合
	 */
	@NotNull(message = "alarmObjList不能为空",groups = {AddGroup.class,UpdGroup.class})
	@Size(min = 1,message = "alarmObjeList不能为空",groups = {AddGroup.class,UpdGroup.class})
	@Valid
	private List<AlarmObj> alarmObjeList;
	/**
	 * 沉默时间
	 */
	@NotNull(message = "deadTime不能为空",groups = {AddGroup.class})
	private Integer deadTime;
	/**
	 * 描述
	 */
	@NotEmpty(message = "description不能为空",groups = {AddGroup.class})
	private String description;
	/**
	 * 数据获取方式
	 */
	private Integer executeType;
	/**
	 * 最后修改时间
	 */
	//@NotNull
	private Date lastUpTime;
	/**
	 * 最后修改人
	 */
	@NotEmpty(message = "lastUpUser不能为空",groups = {AddGroup.class,UpdGroup.class})
	private String lastUpUser;
	/**
	 * 最后修改人ID
	 */
	@NotEmpty(message = "lastUpUserId不能为空",groups = {AddGroup.class,UpdGroup.class})
	private String lastUpUserId;
	/**
	 * 策略名
	 */
	@NotEmpty(message = "name不能为空",groups = {AddGroup.class})
	private String name;
	/**
	 * 是否通道沉默
	 */
	//@NotNull(message = "orChanelSilence不能为空",groups = {AddGroup.class})
	@EnumValue(intValues = {0,1},message = "orChanelSilence必须为指定值",groups = {AddGroup.class, UpdGroup.class})
	private Integer orChanelSilence;
	/**
	 * 是否启动
	 */
	@NotNull(message = "orEnable不能为空",groups = {AddGroup.class})
	@EnumValue(intValues = {0,1},message = "orEnable必须为指定值",groups = {AddGroup.class})
	private Integer orEnable;
	/**
	 * 是否通知
	 */
	@NotNull(message = "orNotice不能为空",groups = {AddGroup.class,UpdGroup.class})
	@EnumValue(intValues = {0,1},message = "orNotice必须为指定值",groups = {AddGroup.class, UpdGroup.class})
	private Integer orNotice;

	@NotNull(message = "alarmRule不能为空",groups = {AddGroup.class})
	private AlarmRule alarmRule;


	public List<AlarmInfo> alarmInfo;

	@NotNull(message = "alarmJobConf不能为空",groups = {AddGroup.class})
	@Valid
	public AlarmJobConf alarmJobConf;

	private List<AlarmNoticeObject> alarmNoticeObjectList;
}