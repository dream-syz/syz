package com.dream.test_alarm.common.validator.annotation;

/**
 * @Author:SYz
 * @Date: 2020/7/6 11:58
 */

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.*;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

/**
 * TYPE:用于描述类、接口(包括注解类型) 或enum声明 Class
 * FIELD:用于描述域 Field
 * METHOD：用于描述方法 Method
 * PARAMETER：用于描述参数
 * CONSTRUCTOR：用于描述构造器
 * LOCAL_VARIABLE：用于描述局部变量
 * PACKAGE：用于描述包
 */
@Target({METHOD, FIELD, ANNOTATION_TYPE, CONSTRUCTOR, PARAMETER})  //限定范围

/**
 * 可以用来修饰注解，是注解的注解，称为元注解。
 * 1、RetentionPolicy.SOURCE：注解只保留在源文件，当Java文件编译成class文件的时候，注解被遗弃；
 * 2、RetentionPolicy.CLASS：注解被保留到class文件，但jvm加载class文件时候被遗弃，这是默认的生命周期；
 * 3、RetentionPolicy.RUNTIME：注解不仅被保存到class文件中，jvm加载class文件之后，仍然存在；
 */
@Retention(RUNTIME)
/**
 * 注解表明这个注解应该被 javadoc工具记录
 */
@Documented
/**
 * 限定自定义注解的方法  自定义处理逻辑的类
 */
@Constraint(validatedBy = {EnumValueValidator.class})
/**
 * 此注解只用于验证参是否指定  可以为null   为null通过验证
 */
public @interface EnumValue {
    String message() default "必须为指定值";

    String[] strValues() default {};

    int[] intValues() default {};

    //分组
    Class<?>[] groups() default {};

    //负载
    Class<? extends Payload>[] payload() default {};

    //指定多个时使用
    @Target({FIELD, METHOD, PARAMETER, ANNOTATION_TYPE})
    @Retention(RUNTIME)
    @Documented
    @interface List {
        EnumValue[] value();
    }
}