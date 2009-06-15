
/*
 * Copyright 2006-2009 Appcelerator, Inc.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *    http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License. 
 */

package org.appcelerator.service;

import java.lang.annotation.Annotation;
import java.lang.reflect.Method;

import org.appcelerator.annotation.Service;
import org.appcelerator.locator.visitor.LoggedDispatchVisitor;
import org.appcelerator.messaging.Message;

/**
 * Beginning of a new unit test suite for java/spring backends.  This just tests things related to the 
 * MethodCallServiceAdapter 
 *
 */
public class TestMethodCallServiceAdapter {

    public boolean equalityTest() throws Exception {
        SimpleService service = new SimpleService();
        Class clazz = service.getClass();
        Method m = clazz.getMethod("doThing", new Class[]{Message.class, Message.class});        
        Service serviceAnnotation = m.getAnnotation(Service.class);
        
        SimpleService service2 = new SimpleService();
        Class clazz2 = service2.getClass();
        Method m2 = clazz2.getMethod("doThing", new Class[]{Message.class, Message.class});
        Service serviceAnnotation2 = m2.getAnnotation(Service.class);
        
        MethodCallServiceAdapter adapter1 = 
            new MethodCallServiceAdapter(service,m,serviceAnnotation);
        MethodCallServiceAdapter adapter2 = 
            new MethodCallServiceAdapter(service,m,serviceAnnotation);
        MethodCallServiceAdapter adapter3 = 
            new MethodCallServiceAdapter(service2,m2,serviceAnnotation2);

        
        if(!adapter1.equals(adapter1)) {
            throw new RuntimeException("self equality failed");
        }
        if(!adapter1.equals(adapter2)) {
            throw new RuntimeException("equality with another instance on same service failed");
        }
        if(!adapter1.equals(adapter3)) {
            throw new RuntimeException("equality with another instance on another equal service instance failed");
        }
        return true;
    }
    
    @SuppressWarnings("unchecked")
    private <T extends Annotation> T findFirstMethodAnnotation(Class<?> service, Class<T> annotationClass) {
        Method[] ms = service.getDeclaredMethods();
        for (Method method : ms) {
            //TODO what is a syntax that uses generics properly that this likes?  it wants one that 
            T t = (T)method.getAnnotation((Class) annotationClass);//annotationClass);
            if(t != null) {
                return t;
            }
        }
        return null;
    }
    
    
    public static void main(String args[]) {
        TestMethodCallServiceAdapter tmcsa = new TestMethodCallServiceAdapter();
        try {
            System.err.println("equality test success: " + tmcsa.equalityTest());

        } catch (Exception e) {
            e.printStackTrace();
            
        }
    }
}

class SimpleService {
    
    @Service(request="do.thing.reqest", response="do.thing.response")
    public void doThing(Message request, Message response) {
        System.err.println("doThing called");
        response.getData().put("success", Boolean.TRUE.toString());
    }
}