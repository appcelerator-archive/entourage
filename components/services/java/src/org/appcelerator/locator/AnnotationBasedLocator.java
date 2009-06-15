
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

import java.lang.annotation.Annotation;
import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import javax.servlet.ServletContext;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.appcelerator.annotation.AnnotationHelper;
import org.appcelerator.annotation.Service;
import org.appcelerator.locator.visitor.LoggedDispatchVisitor;
import org.appcelerator.service.MethodCallServiceAdapter;
import org.appcelerator.service.ServiceAdapter;
import org.appcelerator.service.ServiceRegistry;


/**
 * Utility class which will auto-register all @Service method implementations in the 
 * JVM classpath. It will also associate annotated methods with their corresponding
 * Spring beans.
 */
public class AnnotationBasedLocator implements ServiceLocator
{
    @SuppressWarnings("unused")
    private static final Log LOG = LogFactory.getLog(AnnotationBasedLocator.class);
    private static boolean hasRun;
    protected List <Class<? extends Object>> candidateServices;
    protected ServletContext servletContext = null;

    public void setServletContext(ServletContext sc) {
        this.servletContext = sc;        
    }
    
    public void findServices() {
        if(hasRun) {
            return;
        }
        this.candidateServices = Arrays.asList(AnnotationHelper.findAnnotation(Service.class));
        
        /* 
         * initialize Spring services first, so that they can be associated with their respective beans.
         */
        this.candidateServices = Springer.initializeSpringServices(candidateServices, servletContext);
        
        /*
         * Now initialize non-Spring services
         */
        initializeServices();
        setHasRun();
    }
    
    /**
     * denote that at least one instance somewhere has run before.
     *
     */
    private static synchronized void setHasRun() {
        AnnotationBasedLocator.hasRun = true;
    }
    
    /**
     * @return has an instance run before?
     */
    public static synchronized boolean hasRun() {
        return AnnotationBasedLocator.hasRun;
    }
    
    /**
     * use this to scan for services after our first run
     */
    public synchronized void rescan() {
        this.candidateServices = Arrays.asList(AnnotationHelper.findAnnotation(Service.class));
        boolean first = true; //refresh the spring context the first time
        for (Class<?> service : this.candidateServices) {
            Object instance = null;
            Service serviceAnnotation = findFirstMethodAnnotation(service,Service.class);
            Set<ServiceAdapter> adapters = serviceAnnotation == null ? null :
                ServiceRegistry.getRegisteredServices(serviceAnnotation.request());
            
            if (adapters != null) {
                for (ServiceAdapter adapter : adapters) { 
                    if (adapter instanceof MethodCallServiceAdapter) {
                        instance = ((MethodCallServiceAdapter)adapter).getInstance();
                    }
                } 
            }
             
            if (!Springer.doSpringBean(service, servletContext,first)) {
                first = false;
                for (Method method : service.getDeclaredMethods()) {                   
                    instance = RegistrarUtil.registerServiceMethod(method, service, instance);
                    instance = RegistrarUtil.registerDownloadableMethod(method, service, instance);
                }
            }
        }
    }
    

    /**
     * find the first method annotation so we can inspect the instance
     * @param <T> some type of annotation
     * @param service to check for methods
     * @param annotationClass representing the annotation we're looking for
     * @return instance of the provided annotationClass annotating one of the methods in the passed in service
     */
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

    /**
     * initial registration of non spring services
     *
     */
    private void initializeServices() {
        for (Class<?> service : this.candidateServices) {
            Object instance = null;
            for (Method method : service.getDeclaredMethods()) {
                instance = RegistrarUtil.registerServiceMethod(method, service, instance);
                instance = RegistrarUtil.registerDownloadableMethod(method, service, instance);
            }
        }
    }

 
}
