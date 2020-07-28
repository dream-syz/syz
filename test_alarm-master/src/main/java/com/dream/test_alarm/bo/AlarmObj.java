package com.dream.test_alarm.bo;


import com.bocontainer.annotaion.ForeignKey;
import com.dream.test_alarm.common.validator.intergroup.AddGroup;
import com.dream.test_alarm.common.validator.intergroup.DelGroup;
import com.dream.test_alarm.common.validator.intergroup.UpdGroup;
import lombok.Data;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

/**
 * 报警对象
 *
 * @author admin
 * @version 1.0
 * @created 07-1-2020 17:16:33
 */
@Data
public class AlarmObj {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY, generator = "JDBC")
	private Long id;
	@NotEmpty(message = "alarmObjId不能为空",groups = {AddGroup.class, UpdGroup.class})
	private String alarmObjId;
	@NotEmpty(message = "alarmObjName不能为空",groups = {AddGroup.class,UpdGroup.class})
	private String alarmObjName;
	@ForeignKey
	@NotNull(message = "strategyId不能为空",groups = {DelGroup.class})
	private Long strategyId;


	public AlarmObj(){

	}

	public AlarmObj(String alarmObjId, String alarmObjName, Long strategyId) {
		this.alarmObjId = alarmObjId;
		this.alarmObjName = alarmObjName;
		this.strategyId = strategyId;
	}
}