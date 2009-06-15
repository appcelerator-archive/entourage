
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

package org.appcelerator.locator;

import java.lang.reflect.Method;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.appcelerator.annotation.Downloadable;
import org.appcelerator.annotation.Service;
import org.appcelerator.service.InterceptorStack;
import org.appcelerator.service.MethodCallServiceAdapter;
import org.appcelerator.service.ServiceRegistry;
import org.appcelerator.service.StackConstructor;

/**
 * contains common methods used by service directory scanner and the AnnotationLocator 
 * Handles non-spring related registration
 *
 */
public class RegistrarUtil {
    private static final Log LOG = LogFactory.getLog(RegistrarUtil.class);

    public static synchronized Object registerServiceMethod(Method method, Class<?> service, Object instance) {
        Service annotation = method.getAnnotation(Service.class);
        if (annotation != null) {
            try {
                if (instance == null) 
                    instance = service.newInstance();


                MethodCallServiceAdapter adapter = new MethodCallServiceAdapter(instance, method, annotation);
                InterceptorStack stack = StackConstructor.construct(method, adapter);
                adapter.setStack(stack); 

                ServiceRegistry.registerService(adapter, true);

            } catch (Exception e) {
                LOG.error("Could not register service method (" + method +") because " + e);
                e.printStackTrace();
            }
        }

        return instance;
    }

    public static synchronized Object registerDownloadableMethod(Method method, Class<?> service, Object instance) {
        Downloadable dAnnotation = method.getAnnotation(Downloadable.class);
        if (dAnnotation != null) {
            try {

                if (instance == null) 
                    instance = service.newInstance();

                ServiceRegistry.registerDownloadable(service, instance, method, dAnnotation, true);

            } catch (Exception e) {
                LOG.error("Could not register service method (" + method +") because " + e);
            }
        }

        return instance;
    }
}
