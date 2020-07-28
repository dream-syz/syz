package com.dream.test_alarm.common.validator.annotation;

import com.bocontainer.Util.ToolUtils;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

/**
 * @Author:SYz
 * @Date: 2020/7/6 11:59
 */
public class EnumValueValidator implements ConstraintValidator<EnumValue, Object> {
    private String[] strValues;
    private int[] intValues;

    @Override
    public void initialize(EnumValue constraintAnnotation) {
        strValues = constraintAnnotation.strValues();
        intValues = constraintAnnotation.intValues();
    }

    @Override
    public boolean isValid(Object value, ConstraintValidatorContext context) {
        if (ToolUtils.isNull(value) || ToolUtils.isEmpty(value.toString())) {
            return true;
        }
        if (value instanceof String) {
            for (String s : strValues) {
                if (s.equals(value)) {
                    return true;
                }
            }
        } else if (value instanceof Integer) {
            for (Integer s : intValues) {
                if (s.equals(value)) {
                    return true;
                }
            }
        }
        return false;
    }
}


