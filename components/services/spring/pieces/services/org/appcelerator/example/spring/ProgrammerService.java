package org.appcelerator.example.spring;

import java.util.logging.Logger;
import javax.annotation.Resource;
import org.appcelerator.messaging.Message;
import org.appcelerator.annotation.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


@Component("programmerService")
public class ProgrammerService {

  @Autowired
  @Resource(name="programmer")
  private Programmer programmer;

  private static final Logger log = 
    Logger.getLogger(ProgrammerService.class.getName());
 
    @Service(request = "programmer.task.request", response = "programmer.task.response", version = "1.0")
    public void doTask(Message request, Message response) {
         System.err.println("We have at least executed ProgrammerService.doTask(...)");
         String status = programmer.doTask();
         response.getData().put("taskStatus",status);
         System.err.println("If you see this message, programmer must have been injected properly!!!");
    }
}
