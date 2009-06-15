package org.appcelerator.example.spring;

import java.util.logging.Logger;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;

//This does not work in the present release (problems with aspectj)
@Aspect
public class ProjectManager {
//  private static final Logger REPORT = 
//    Logger.getLogger(ProjectManager.class.getName());
  
  @Pointcut("execution(* org.appcelerator.example.spring.Programmer.doTask(..))")
  public void taskPerformance() { System.err.println("am here!");}
  
  @Before("taskPerformance() && this(programmer)") 
  public void taskCommencement(Programmer programmer) {
    System.err.println("Finally  " + programmer.getName() +
    " begins his task!");  
  }
  
  @After("taskPerformance() && this(programmer)")
  public void taskCompletion(Programmer programmer) {
    System.err.println(programmer.getName() +
        " finally completed his task!");
  }
}
