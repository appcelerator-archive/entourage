
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

package org.appcelerator.service;

import java.lang.annotation.Annotation;
import java.lang.reflect.Method;
import java.util.Iterator;
import java.util.ArrayList;
import java.util.List;

import net.sf.json.JSONObject;

import org.appcelerator.annotation.Service;
import org.appcelerator.annotation.ServiceProperty;
import org.appcelerator.messaging.Message;
import org.appcelerator.messaging.MessageUtils;
import org.appcelerator.util.Util;

/**
 * an adapter which wraps an object and specific @Service method which is
 * responsible for invoking the service using reflection and returning the
 * results from the invocation
 */
public class MethodCallServiceAdapter extends ServiceAdapter
{ 
    private final Object instance;
    private final Method method;

    @SuppressWarnings("unchecked")
    private Class serviceClass;

  
    public MethodCallServiceAdapter(Object i, Method m, Service service) throws Exception
    {
        this.instance = i;
        this.method = m;
        this.serviceClass = i.getClass();

        this.method.setAccessible(true);

        this.request = service.request();
        this.response = service.response();
        this.version = service.version();
    }

    @SuppressWarnings("unchecked")
    public Method getMethod(Object i, String methodname, Class ... parameterTypes) throws SecurityException, NoSuchMethodException 
    {
        if (methodname==null || "".equals(methodname))
        {
            return null;
        }
        return serviceClass.getMethod(methodname, parameterTypes);
    }

    public boolean is(ServiceAdapter sa)
    {
        if (!(sa instanceof MethodCallServiceAdapter))
        {
            return false;
        }

        MethodCallServiceAdapter target = (MethodCallServiceAdapter) sa;
        if (this.method.getName().equals(target.method.getName()) && this.instance == target.instance)
        {
            return true;
        }

        return false;
    }
 
    /* (non-Javadoc)
     * @see org.appcelerator.dispatcher.ServiceAdapter#equals(java.lang.Object)
     */
    public boolean equals(Object obj)
    {
        if (obj instanceof MethodCallServiceAdapter)
        {
            if (this == obj) {
                return true;
            }
            MethodCallServiceAdapter sa=(MethodCallServiceAdapter) obj;
            String saclassname = sa.instance.getClass().getName();
            String myclassname = this.instance.getClass().getName();
            String samethodname = sa.method.getName();
            String mymethodname = this.method.getName();
            boolean retval = saclassname.equals(myclassname) && 
            samethodname.equals(mymethodname);
            retval = retval && Util.parmsEqual(sa.method.getParameterTypes(),method.getParameterTypes()) ;
            retval = retval && super.equals(obj);
            return retval;
        }
        return false;
    }

    /* (non-Javadoc)
     * @see org.appcelerator.dispatcher.ServiceAdapter#hashCode()
     */
    public int hashCode()
    {
        return this.instance.getClass().getName().hashCode() * Util.hashParms(this.method.getParameterTypes()) * this.method.getName().hashCode() ^ super.hashCode();
    }

    /**
     * Return the method object for this service adapter
     * @return
     */
    public Method getMethod() 
    {
        return this.method;
    }

    @SuppressWarnings("unchecked")
    private Object getParameterFromProperty(Message request, Class clz, Annotation annotations[])
    {
        ServiceProperty prop = null;

        if (annotations!=null)
        {
            for (int c=0;c<annotations.length;c++)
            {
                if (ServiceProperty.class.equals(annotations[c].annotationType()))
                {
                    prop = (ServiceProperty)annotations[c];
                    break;
                }
            }
        }

        if (null != prop)
        {
            JSONObject obj = MessageUtils.getJSONObjectData(request);
            JSONObject value = (JSONObject)obj.get(prop.name());
            return JSONObject.toBean( value, clz );
        }
        else
        {
            return JSONObject.toBean( MessageUtils.getJSONObjectData(request), clz );
        }
    }

    public void dispatch (Message request, Message response) { 
           this.dispatch(request, response, new ArrayList<Message>(), null);
    }

    public Object dispatch(Message request, Message response, List<Message> responses, Object retValue) {
    //TODO: move object response mapping to a generic interceptor at the front of the stack
            response.getData().put("success",true);

            Class types[]  = this.method.getParameterTypes();
            Annotation annotations[][] = this.method.getParameterAnnotations();
            Object returnValue = null;

            try {
                switch(types.length)
                {
                    case 1:
                    {
                        // first see if the parameter is a message
                        if (Message.class.equals(types[0]))
                        {
                            returnValue = this.method.invoke(this.instance, request);
                        }
                        else
                        {
                            // this must be a automapping javabean
                            returnValue = this.method.invoke(this.instance, getParameterFromProperty(request,types[0],annotations[0]));
                        }
                        break;
                    }
                    case 2:
                    {
                        // first see if the parameters are messages
                        if (Message.class.equals(types[0]) && Message.class.equals(types[1]))
                        { 
                            returnValue = this.method.invoke(this.instance, request, response);                   
                            returnValue = returnValue == null && retValue != null ? retValue : returnValue;
                            
                            break;
                        }
                    }
                    default:
                    {
                        Object args [] = new Object[types.length];
                        for (int c=0;c<types.length;c++)
                        {
                            if (Message.class.equals(types[c]))
                            {
                                args[c] = request;
                            }
                            else
                            {
                                args[c] = getParameterFromProperty(request,types[c],annotations[c]);
                            }
                        }
                        returnValue = this.method.invoke(this.instance, args);
                    }
                }
    
    
                if (returnValue != null && false == Void.class.equals(returnValue.getClass()))
                {
                    JSONObject jsonObject = JSONObject.fromObject(returnValue);
                    for (Iterator iter = jsonObject.keys(); iter.hasNext();)
                    {
                        String key = (String)iter.next();
                        response.getData().put(key,jsonObject.get(key));
                    }
                }
            } catch (Throwable e) {
                Throwable x = Util.unwrap(e);
                response.getData().put("success",Boolean.FALSE.toString());
                response.getData().put("exception", x.getLocalizedMessage() != null ? x.getLocalizedMessage() : x.toString());
                if (!(x instanceof RuntimeException)) {
                    throw (new RuntimeException(x)); // original code catches throwable
                } else {                             // which we can't rethrow
                    throw (RuntimeException)x;              // so we rethrow exceptions only
                }
            } 
            return getNext() != null ? getNext().dispatch(request, response, responses, returnValue) : returnValue;
    }

    public Object getInstance() {
        return instance;
    }
}
