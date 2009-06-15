package org.appcelerator.example.spring;

import org.springframework.stereotype.Component;

@Component
public class EatFoodTask implements Task {
  public String perform() {
     return "EatFoodTask: munch munch munch";
  }
}
