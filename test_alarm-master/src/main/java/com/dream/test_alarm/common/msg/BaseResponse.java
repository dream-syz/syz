package com.dream.test_alarm.common.msg;

/**
 * @Author:SYz
 * @Date: 2020/7/10 9:32
 */
public class BaseResponse<Entity> {
    private int code =200;
    private String description;
    public BaseResponse(){}
    public BaseResponse(String description){
        this.description=description;
    }

    public BaseResponse(String description,Exception e){

    }
}
