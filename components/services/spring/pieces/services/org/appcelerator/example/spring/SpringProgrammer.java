package org.appcelerator.example.spring;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component("programmer")
public class SpringProgrammer implements Programmer {
  @Autowired
  @Resource(name="eatFoodTask")
  private Task task;
  private String name = "Jerry";

  public String doTask() {
    return task.perform();
  }
  
  public void setName(String name) {
    this.name = name;
  }
  
  public String getName() {
    return name;
  }

}
