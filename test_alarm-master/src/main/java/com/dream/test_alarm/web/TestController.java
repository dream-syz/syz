package com.dream.test_alarm.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * @Author:SYz
 * @Date: 2020/7/2 16:44
 */
@Controller
@RequestMapping(value = "/")
public class TestController {
    /**
     * 首页
     */
    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String home() {
        return "index";
    }

    /**
     * 下面四个为内嵌界面，若没有映射路径则报404
     */
    @RequestMapping(value = "/alarm_rule", method = RequestMethod.GET)
    public String alarmrule() {
        return "alarm_rule";
    }

    @RequestMapping(value = "/alarm_information", method = RequestMethod.GET)
    public String alarminfo() {
        return "alarm_information";
    }

    @RequestMapping(value = "/alarm_strategy", method = RequestMethod.GET)
    public String alarmstrategy() {
        return "alarm_strategy";
    }

    @RequestMapping(value = "/alarm_report", method = RequestMethod.GET)
    public String alarmreport() {
        return "alarm_report";
    }
}
