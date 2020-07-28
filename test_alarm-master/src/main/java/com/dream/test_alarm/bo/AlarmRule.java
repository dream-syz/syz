package com.dream.test_alarm.bo;


import com.bocontainer.annotaion.ForeignKey;
import com.bocontainer.annotaion.IgnoreParam;
import com.dream.test_alarm.common.validator.intergroup.AddGroup;
import com.dream.test_alarm.common.validator.intergroup.DelGroup;
import com.dream.test_alarm.common.validator.intergroup.UpdGroup;
import com.hdstcloud.dsa.bean.client.ClientDsTarget;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * @author Administrator
 * @version 1.0
 * @created 19-1��-2020 15:46:53
 */
@Data
public class AlarmRule {

	//主键
	@NotNull(groups = {UpdGroup.class, DelGroup.class})
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY, generator = "JDBC")
	private Long id;

	/**
	 * 被约束指标
	 */
	@NotEmpty(groups = {AddGroup.class})
	private String dataItem;

	/**
	 * 规则名称
	 */
	@NotEmpty(groups = {AddGroup.class})
	@Column(name = "ruleName")
	private String name;

	/**
	 * 策略id
	 */
	@ForeignKey
	private Long strategyId;

	/**
	 * 维度id
	 */
	//@NotEmpty(groups = {AddGroup.class})
	private String objDimId;

	/**
	 * 超过次数报警
	 */
	@NotNull(groups = {AddGroup.class})
	private Integer times;

	/**
	 * 关联的数据集id
	 */
	@NotEmpty(groups = {AddGroup.class})
	private String dataSetId;

	/**
	 * 数据获取方式（Push==0）、（Pull==1）
	 */
	@NotNull(groups = {AddGroup.class})
	private Integer pushOrPull;

	/**
	 * 报警记录
	 */
	public List<AlarmRec> alarmRec;

	/**
	 * 新增属性  数据集
	 */
	@IgnoreParam
	@NotNull(groups = {AddGroup.class})
	private ClientDsTarget clientTarget;


}