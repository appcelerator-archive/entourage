
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

package org.appcelerator.endpoint;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.appcelerator.locator.ServiceDirectoryScanner;
import org.appcelerator.transport.AjaxServiceTransportServlet;
import org.appcelerator.transport.DownloadTransportServlet;
import org.appcelerator.transport.ProxyTransportServlet;
import org.appcelerator.transport.UploadTransportServlet;
import org.mortbay.jetty.MimeTypes;
import org.mortbay.jetty.Server;
import org.mortbay.jetty.handler.ResourceHandler;
import org.mortbay.jetty.servlet.Context;
import org.mortbay.jetty.servlet.HashSessionManager;
import org.mortbay.jetty.servlet.ServletHolder;
import org.mortbay.jetty.servlet.SessionHandler;
import org.mortbay.resource.FileResource;
import org.mortbay.resource.Resource;
import org.springframework.web.context.ContextLoaderListener;

/**
 * HTTPEndpoint is a class which implements a partial Jetty embedded webserver
 * for running the environment without the need for an external webserver.  Perfect
 * for development mode.
 */
public class HTTPEndpoint
{
    private Server server;
    private Context root;
    @SuppressWarnings("unchecked")
    public HTTPEndpoint(int port, String webdir, String servicesdir, String tmpdir)
    {
        server = new Server(port);
        
        ResourceHandler resourceHandler=new ResourceHandler();
        resourceHandler.setResourceBase(webdir);
        
        SessionHandler sh = new SessionHandler();
        HashSessionManager sessionManager=new HashSessionManager();
        sessionManager.setUsingCookies(true);
        sessionManager.setSessionCookie("JSESSIONID");  //NOTE: we should probably read appcelerator.xml to determine this
        sh.setSessionManager(sessionManager);
        
        this.root = new Context(server,"/",Context.SESSIONS);
        Map parms = root.getInitParams();
        parms = parms == null ? new HashMap() : parms;
        parms.put("log4jConfigLocation", "WEB-INF/log4j.xml");
        root.setInitParams(parms);
        try {
            if (tmpdir != null) {
                root.setBaseResource(new FileResource((new File(tmpdir)).toURI().toURL()));
            }
            //needed for spring
            if(servicesdir != null) {
                root.getBaseResource().addPath(servicesdir);
            }
        } catch (Exception e) { // if this happens we're probably about to puke but...
            e.printStackTrace();
        }
        root.setSessionHandler(sh);
		ServletHolder servletHolder = new ServletHolder(new DispatcherServlet(resourceHandler));
        root.addServlet(servletHolder,"/*");

		// attempt to load spring if we have it on our classpath
		try // this is just to print a silly little message so 
		{   // people know where to look if they need to debug this thing
			@SuppressWarnings("unused")
            Class clz = root.loadClass("org.springframework.context.support.ClassPathXmlApplicationContext");
            clz = null;
			System.out.println("Spring Framework detected");

		}
		catch (Exception ig)
		{
           // ig.printStackTrace();
			// ignore, just means spring isn't available
		}

        AjaxServiceTransportServlet servicebroker = new AjaxServiceTransportServlet();
		servicebroker.setEmbeddedMode(true);
        root.addServlet(new ServletHolder(servicebroker),"/servicebroker/*");
        
        ProxyTransportServlet proxy = new ProxyTransportServlet();
        proxy.setEmbeddedMode(true);
        root.addServlet(new ServletHolder(proxy),"/proxy/*");
        
        DownloadTransportServlet download = new DownloadTransportServlet();
        download.setEmbeddedMode(true);
        root.addServlet(new ServletHolder(download),"/download/*");
        
        UploadTransportServlet upload = new UploadTransportServlet();
        upload.setEmbeddedMode(true);
        root.addServlet(new ServletHolder(upload),"/upload/*");
        
        server.setGracefulShutdown(2000);
        server.setStopAtShutdown(true);
    }
    
    private static class DispatcherServlet extends HttpServlet
    {
        private static final long serialVersionUID = 1L;
        private final ResourceHandler resourceHandler;
        private final MimeTypes mimeTypes = new MimeTypes();
        
        DispatcherServlet(ResourceHandler rh)
        {
            resourceHandler = rh;
        }
        
        /* (non-Javadoc)
         * @see javax.servlet.GenericServlet#init(javax.servlet.ServletConfig)
         */
        @Override
        public void init(ServletConfig config) throws ServletException
        {
            try {
                startSpring(config.getServletContext());
            } catch (NoClassDefFoundError e) {
             //   e.printStackTrace();
                System.err.println("spring could not be started");
            }
        } 
        
        private void startSpring(final ServletContext servletContext) {
            //inner class to avoid class bindings
            class SpringThing {
                public void makeSpring() {
                    ContextLoaderListener listener = new ContextLoaderListener();
                    listener.contextInitialized(new ServletContextEvent(servletContext));
                }
            }
            SpringThing thing = new SpringThing();
            thing.makeSpring();
        }

        
        protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
        {
            // make sure cookies are working for all files
            request.getSession(true);
            
            String path = request.getPathInfo();
            if (path==null || path.equals("/"))
            {
                path = "/index.html";
            }

            Resource resource=resourceHandler.getResource(path);
            if (resource.exists() && !resource.isDirectory())
            {
               
                response.setContentLength((int) resource.length());
                response.setContentType(mimeTypes.getMimeByExtension(path).toString());

                OutputStream out = response.getOutputStream();
                InputStream in = resource.getInputStream();
                byte buf[] = new byte[8096];
                int count = 0;
                while (true)
                {
                    int c = in.read(buf);
                    if (c<0)
                    {
                        break;
                    }
                    out.write(buf,0,c);
                    count+=c;
                }
                out.flush();
               
                return;
            }
            
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
        }
    }
    
    public HTTPEndpoint start () throws Exception
    {
        server.start();
        return this;
    }
    
    public HTTPEndpoint stop () throws Exception
    {
        server.stop();
        return this;
    }
    
    public HTTPEndpoint join () throws Exception
    {
        server.join();
        return this;
    }
    
    /**
     * @param args
     */
    public static void main(String[] args) throws Exception
    {
        if (args.length!=5 && args.length!=2)
        {
            System.err.println("HTTPEndpoint <port> <webdir> <services_dir> <tmpdir> <scan_period>");
            System.exit(1);
        }
        int port = Integer.parseInt(args[0]);
        String webdir = args[1];
        String servicesdir = args.length > 2 ? args[2] : null;
        String tmpdir = args.length > 3 ? args[3] : null;
        long scanperiod = args.length > 4 ? Long.parseLong(args[4]) : 5000;
        ServiceDirectoryScanner scanner = null;
        if (servicesdir!=null)
        {
            scanner = new ServiceDirectoryScanner(new File(servicesdir),scanperiod);
            scanner.scan(false); //initial compilation
        }
        HTTPEndpoint endpoint = new HTTPEndpoint(port,webdir,servicesdir,tmpdir);
        if (scanner != null) {
            scanner.start(); //now we poll the directory
        }
        
        endpoint.start().join();
    }
}
