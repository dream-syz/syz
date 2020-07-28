package com.dream.test_alarm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages={"com.bocontainer","com.dream.test_alarm"})
public class TestAlarmApplication  {

    public static void main(String[] args) {
        SpringApplication.run(TestAlarmApplication.class, args);
    }
}
