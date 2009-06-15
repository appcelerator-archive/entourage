
/*
 * Copyright 2006-2008 Appcelerator, Inc.
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
package org.appcelerator.locator;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletContext;

import org.springframework.web.context.support.XmlWebApplicationContext;

/**
 * helper class which contains almost all of our spring related code.
 *
 */
public class Springer {
    /**
     * matches a class marked with the Service annotation with its matching spring bean instance if available
     * @param candidateServices to check against spring beans
     * @param servletContext to find spring on
     * @return list of non spring services
     */
    static List<Class<? extends Object>> initializeSpringServices(final List<Class<? extends Object>> candidateServices, final ServletContext servletContext) {

        // don't register any Spring services if we are not running in Servlet
        if (servletContext == null) {
            System.err.println("no servletContext detected");
            return candidateServices;
        }

        // detect if we are running a Spring container, if not -- quit early, as this
        // following code will throw a ClassNotFound exception (bad news bears!)
        if (servletContext.getAttribute("org.springframework.web.context.WebApplicationContext.ROOT") == null) {
            return candidateServices; // no spring
        }
        
                /*
                 * Now we need to find all classes that contain methods that are annotated with @Service
                 * and correlate them with Spring managed beans. Both types of Services (Spring and non-spring)
                 * needs to be created only once, so from the list of @Service annotated classes we need to
                 *  - select Spring managed services and register them with ServiceRegistry
                 *  - create instances of non-spring managed services and register them with ServiceRegistry
                 *  Non-spring managed services will be added to a temporary list (nonSpringServices) which
                 *  will be processed later
                 */
                List<Class<? extends Object>> nonSpringServices = new ArrayList<Class<? extends Object>>();
                
                for (Class<?> candidateService : candidateServices) {

                    Boolean foundBean = doSpringBean(candidateService, servletContext, false);

                    if (!foundBean)
                        nonSpringServices.add(candidateService);
                }
                
   
        return nonSpringServices; // processed in initializeServices

    }
    
    /**
     * check an individial class to see if it is also spring bean
     * @param candidateService to check for springhood
     * @param servletContext to find the spring context
     * @param refresh the spring XmlWebApplication context or not (generally you do this once) this is here to avoid litering it about
     * @return
     */
    public static synchronized boolean doSpringBean(final Class<?> candidateService, final ServletContext servletContext, final boolean refresh) {
        if (servletContext.getAttribute("org.springframework.web.context.WebApplicationContext.ROOT") == null) {
            return false; //no spring
        }
        
        /*
         * Wrap this in an inner class to hide Spring dependencies
         */
        class SpringHelper {
            public boolean execute() {

                org.springframework.context.ApplicationContext aCtx = org.springframework.web.context.support.WebApplicationContextUtils.getWebApplicationContext(servletContext);
                if(refresh) {
                    ((XmlWebApplicationContext)aCtx).refresh();
                }
                
                if (aCtx == null) {
                    return false;
                }
                String[] beanNames = aCtx.getBeanDefinitionNames();

                    Boolean foundBean = false;
                    for (String name : beanNames) {
                        
                        /* don't register abstract beans */
                        if (aCtx instanceof org.springframework.context.ConfigurableApplicationContext
                            && ((org.springframework.context.ConfigurableApplicationContext) aCtx).getBeanFactory().getBeanDefinition(name).isAbstract()) {
                            continue;
                        }
                        
                        Object bean = aCtx.getBean(name);
                        Class<?> clazz = bean.getClass();


                        if (candidateService.equals(clazz)) {
                            foundBean = true;
                            for (Method method : bean.getClass().getDeclaredMethods()) {
                                RegistrarUtil.registerServiceMethod(method, bean.getClass(), bean);
                                RegistrarUtil.registerDownloadableMethod(method, bean.getClass(), bean);
                            }
                        } 
                    }

                
                return foundBean;
            }
        }
        
        
        SpringHelper helper = new SpringHelper();
        return helper.execute(); // processed in initializeServices
        
    }

}
