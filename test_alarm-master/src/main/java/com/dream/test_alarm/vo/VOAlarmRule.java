package com.dream.test_alarm.vo;

import com.dream.test_alarm.common.annotation.BoTargetValue;
import com.dream.test_alarm.common.annotation.VoTargetValue;
import com.dream.test_alarm.common.validator.annotation.EnumValue;
import com.dream.test_alarm.common.validator.intergroup.AddGroup;
import com.dream.test_alarm.common.validator.intergroup.UpdGroup;
import com.hdstcloud.dsa.bean.client.ClientDsTarget;
import lombok.Data;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.List;

/**
 *报警规则页面的VO
 * @Author:SYz
 * @Date: 2020/7/13 13:44
 */
@Data
public class VOAlarmRule {
    /**
     * 创建规则----数据集，指标，维度，规则名称，最大次数，条件，值
     * 修改规则----规则名称，最大次数，条件，值1
     * 规则详情----数据集，指标，维度，规则名称，最大次数，条件，值
     * 查询规则----规则id,规则名，最大次数
     */
    private Long id;
    /**
     * 关联的数据集id
     */
    private String dataSetId;

    /**
     *  数据集
     */
    @NotNull(message = "clientTarget不能为空", groups = {AddGroup.class})
    private ClientDsTarget clientTarget;

    /**
     * 指标（被约束指标）
     */
    private String dataItem;

    /**
     * 维度id
     */
    @NotEmpty(groups = {AddGroup.class})
    private String objDimId;

    /**
     * 规则名称
     */
    @NotEmpty(groups = {AddGroup.class})
    private String name;

    /**
     * 最大次数（超过次数报警）
     */
    @NotNull(groups = {AddGroup.class})
    private Integer times;

    /**
     * 策略id
     */
    private Long strategyId;

    /**
     * 报警记录（在报警信息中需要显示报警对象名）
     */
    public List<VOAlarmRec> alarmRec;

    //---------下面的似乎可以先不调用---------------------------------------------------------------------------------------------
    //条件和值两个属性在？？？？？（调的外部接口）

    /**
     * 在新增规则时设置规则数据获取方式为调用（vo没有这个属性应该在业务层写）
     * 数据获取方式（Push==0）、（Pull==1）
     */
    @VoTargetValue(value = {@BoTargetValue(inValues = "0", strValues = "推送"),
            @BoTargetValue(inValues = "1", strValues = "调用")})
    @NotEmpty(message = "pushOrPull不能为空", groups = {AddGroup.class})
    @EnumValue(strValues = {"调用", "推送"}, groups = {AddGroup.class, UpdGroup.class})
    private String pushOrPull;





}
