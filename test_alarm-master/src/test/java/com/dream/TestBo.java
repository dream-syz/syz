package com.dream;

import com.bocontainer.container.BOContainer;

import com.dream.test_alarm.TestAlarmApplication;
import com.dream.test_alarm.bo.*;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = TestAlarmApplication.class)
public class TestBo {

    @Autowired
    private BOContainer boContainer;

    @Test
    public void test() {
        boContainer.initBO(AlarmNoticeObject.class);
        boContainer.initBO(AlarmInfo.class);
        boContainer.initBO(AlarmJobConf.class);
        boContainer.initBO(AlarmObj.class);
        boContainer.initBO(AlarmRec.class);
        boContainer.initBO(AlarmRule.class);
        boContainer.initBO(AlarmStrategies.class);
    }
}
