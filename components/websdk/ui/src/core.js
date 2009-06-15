App.UI.UIManager = {managers:{}};
App.UI.UIComponents = {};
App.UI.fetching = {};
App.UI.componentRoot = 'entourage-ui/';
App.UI.commonRoot = 'entourage-ui/common/';
App.UI.loadedFiles = {};


/////////////////////////////////////////////////////////////////////////
//
// Script/CSS Loading Functions
//
////////////////////////////////////////////////////////////////////////

/**
 * dynamically load a javascript file
 *
 * @param {string} path to resource
 * @param {function} onload function to execute once loaded
 */
App.UI.remoteLoadScript = function(path,onload,onerror)
{
    App.UI.remoteLoad('script','text/javascript',path,onload,onerror);  
};

/**
 * dynamically load a css file
 *
 * @param {string} path to resource
 * @param {function} onload function to execute once loaded
 */
App.UI.remoteLoadCSS = function(path,onload,onerror)
{
    App.UI.remoteLoad('link','text/css',path,onload,onerror);  
};

/**
 * dynamically load a remote file
 *
 * @param {string} name of the tag to insert into the DOM
 * @param {string} type as in content type
 * @param {string} full path to the resource
 * @param {function} onload to invoke upon load
 * @param {function} onerror to invoke upon error
 */
App.UI.remoteLoad = function(tag,type,path,onload,onerror)
{
	// fixup the URI
	path = App.URI.absolutizeURI(path,App.docRoot);

	if (type == 'text/css')
	{
		if (App.UI.loadedFiles[path])return;
		App.UI.loadedFiles[path] = true;
	}
	
    var array = App.UI.fetching[path];
    if (array)
    {
        if (onload)
        {
            array.push(onload);
        }
        return;
    }
	
    if (onload)
    {
        App.UI.fetching[path]=[onload];
    }
	
    var element = document.createElement(tag);
    element.setAttribute('type',type);
    switch(tag)
    {
        case 'script':
            element.setAttribute('src',path);
            break;
        case 'link':
            element.setAttribute('href',path);
            element.setAttribute('rel','stylesheet');
            break;
    }
	var timer = null;
    var loader = function()
    {
	   if (App.Util.Logger) App.Util.Logger.debug('loaded '+path);
	   if (timer) clearTimeout(timer);
       var callbacks = App.UI.fetching[path];
       if (callbacks)
       {
           for (var c=0;c<callbacks.length;c++)
           {
               try { callbacks[c](); } catch (E) { }
           }
           delete App.UI.fetching[path];
       }
    };    
    if (tag == 'script')
    {
	    if (App.Browser.isSafari2)
	    {
	        //this is a hack because we can't determine in safari 2
	        //when the script has finished loading
	        setTimeout(function(){loader()},1500);
	    }
	    else
	    {
	        (function()
	        {
	            var loaded = false;
	            element.onload = loader;
				if (onerror)
				{
					if (!loaded)
					{
						// max time to determine if we've got an error
						// obviously won't work if takes long than 3.5 secs to load script
						timer=setTimeout(onerror,3500);
					}
					element.onerror = function()
					{
						// for browsers that support onerror
						if (timer) clearTimeout(timer);
						onerror();
					};
				}
	            element.onreadystatechange = function()
	            {
	                switch(this.readyState)
	                {
	                    case 'loaded':   // state when loaded first time
	                    case 'complete': // state when loaded from cache
	                        break;
	                    default:
	                        return;
	                }
	                if (loaded) return;
	                loaded = true;
	                
	                // prevent memory leak
	                this.onreadystatechange = null;
	                loader();
	            }   
	        })();
	    }   
	}
	else
	{
	   setTimeout(function(){loader()},5);
	}
   	document.getElementsByTagName('head')[0].appendChild(element);
};


//
// called by an UI manager implementation to register itself by type
//
App.UI.registerUIManager = function(ui,impl)
{
	App.UI.UIManager.managers[ui] = impl;
};

/**
 * called by UI manager to register itself
 */
App.UI.registerUIComponent = function(type,name,impl)
{
	try
	{
		var f = App.UI.UIComponents[type+':'+name];

		if (!f)
		{
			f = {};
			App.UI.UIComponents[type+':'+name]=f;
		}

		f.impl = impl;
		f.loaded = true;

		if (impl.setPath)
		{
			impl.setPath.call(impl,f.dir);
		}

		if (f.elements)
		{
			for (var c=0;c<f.elements.length;c++)
			{
				var obj = f.elements[c];
				App.UI.activateUIComponent(f.impl,f.dir,obj.type,obj.name,obj.element,obj.options,obj.callback);
			}

			f.elements = null;
		}
	}
	catch(e)
	{
		App.Compiler.handleElementException(null,e,'registerUIComponent for '+type+':'+name);
	}
};


/////////////////////////////////////////////////////////////////////////
//
// Register Four Main UI Managers
//
////////////////////////////////////////////////////////////////////////

App.UI.registerUIManager('layout', function(type,element,options,callback)
{
   App.UI.loadUIComponent('layout',type,element,options,callback);
});


App.UI.registerUIManager('behavior', function(type,element,options,callback)
{
   App.UI.loadUIComponent('behavior',type,element,options,callback);
});

App.UI.registerUIManager('theme', function(theme,element,options,callback)
{
	// is this a default setting
	if (theme == 'defaults')
	{
		for (var key in options)
		{
			App.UI.setDefaultThemes(key,options[key])
		}
		App.Compiler.compileElementChildren(element);
	}
	else
	{
		var type = element.nodeName.toLowerCase();
		options['theme']=theme;
		App.UI.loadUIComponent('control',type,element,options,callback);		
	}
});

App.UI.widgetRegex = /^app:/
App.UI.registerUIManager('control',function(type,element,options,callback)
{
    App.UI.loadUIComponent('control',type,element,options,callback);
});

/////////////////////////////////////////////////////////////////////////
//
// UI Event Handling
//
////////////////////////////////////////////////////////////////////////


//
//  Fire UI Events
//
App.UI.fireEvent = function(type,name,event,data)
{
	var listeners = App.UI.UIListeners;
	if (listeners && listeners.length > 0)
	{
		var scope = {type:type,name:name,event:event,data:data};
		for (var c=0;c<listeners.length;c++)
		{
			listeners[c].call(scope);
		}
	}
};

/////////////////////////////////////////////////////////////////////////
//
// Load and Activate UI Managers/Components
//
////////////////////////////////////////////////////////////////////////

//
// called by a UI to load a UI manager
//
App.loadUIManager=function(ui,type,element,args,failIfNotFound,callback)
{
	var f = App.UI.UIManager.managers[ui];
	if (f)
	{
		var data = {args:args,element:element};
		App.UI.fireEvent(ui,type,'beforeBuild',data);
		var afterBuild = function(inst)
		{
			// pass instance in event
			data.instance = inst;

			App.UI.fireEvent(ui,type,'afterBuild',data);
			if (callback){ callback.apply(inst)};
		};
		f(type,element,args,afterBuild);
	} 
};

//
// called to load UI component by UI manager
// 
App.UI.loadUIComponent = function(type,name,element,options,callback)
{
	var f = App.UI.UIComponents[type+':'+name];
	if (f)
	{
		if (f.loaded)
		{
			App.UI.activateUIComponent(f.impl,f.dir,type,name,element,options,callback);
		}
		else
		{
			f.elements.push({type:type,name:name,element:element,options:options,callback:callback});
		}
	}
	else
	{
		// added for API calls
		if (!element.state)element.state = {pending:0};
		
		element.state.pending+=1;
		var dir = App.docRoot + App.UI.componentRoot +type+'s/'+name;
		var path = dir+'/'+name+'.js';
		App.UI.UIComponents[type+':'+name] = {dir:dir,loaded:false,elements:[{type:type,name:name,element:element,options:options,callback:callback}]};
		App.UI.remoteLoadScript(path,function()
		{
			element.state.pending-=1;
			App.Compiler.checkLoadState(element);
		},function()
		{
			App.UI.handleLoadError(element,type,name,null,path);
			element.state.pending-=1;
			App.Compiler.checkLoadState(element);
		});
	}
};
App.UI.componentJSFiles = {};
//
// Instantiate UI component once loaded
//
App.UI.activateUIComponent = function(impl,setdir,type,name,element,options,callback)
{
	var componentRootDir = App.docRoot + App.UI.componentRoot +type+'s/'+name
	var inst = null;
	var formattedOptions = null;
	try
	{
		// get instance
		inst = new impl.create();

		// get options
		formattedOptions = App.UI.UIManager.parseAttributes(element,inst,options);
		// if the control has external JS dependencies, load them prior to calling build
		var jsFiles = null
		if (inst.getControlJS)
		{
			jsFiles = inst.getControlJS();
		}
		if (jsFiles !=null)
		{
			App.UI.componentJSFiles[element.id+'_'+type+'_'+name] = jsFiles.length;
			for (var i=0;i<jsFiles.length;i++)
			{
				App.UI.remoteLoadScript(componentRootDir + "/" + jsFiles[i],function()
				{
					App.UI.componentJSFiles[element.id+'_'+type+'_'+name]--;
					if (App.UI.componentJSFiles[element.id+'_'+type+'_'+name] == 0)
					{
						var compile = inst.build(element,formattedOptions);
						if (compile != false)
						{
							App.Compiler.compileElementChildren(element)
						}

						// keep track of elements and their UI attributes
						App.UI.addElementUI(element,type,name,inst);

						if (callback)
						{
							callback(inst);
						}
						
						// decrement counter
						App.Compiler.uiComponentProcessed();
						
					}
				},null);
			}
		}
		else
		{
			var compile = inst.build(element,formattedOptions);
			if (compile != false)
			{
				App.Compiler.compileElementChildren(element)
			}

			// keep track of elements and their UI attributes
			App.UI.addElementUI(element,type,name,inst);
			
			if (callback)
			{
				callback(inst);
			}
			// decrement counter
			App.Compiler.uiComponentProcessed();
			
		}


	}
	catch (e)
	{
		App.Compiler.handleElementException(element,e,'activateUIComponent for '+type+':'+name);
	}
	
	// get any external css files
	if (inst.getControlCSS)
	{
		cssFiles = inst.getControlCSS();
		if (cssFiles.length && cssFiles.length > 0)
		{
			for (var i=0;i<cssFiles.length;i++)
			{
				App.UI.remoteLoadCSS(componentRootDir + "/" + cssFiles[i]);
			}
		}
		
	}
	// get any custom actions
	if (inst.getActions)
	{
		var actions = inst.getActions();
		var id = element.id;
		for (var c=0;c<actions.length;c++)
		{
			(function()
			{
				var actionName = actions[c];
				var action = inst[actionName];
				if (action)
				{
					var xf = function(params,scope)
					{	
						var obj = {params:params,scope:scope}
						try
						{
							action.apply(inst,[obj]);
						}
						catch (e)
						{
							App.Compiler.handleElementException(element,e,'Error executing '+actionName+' in container type: '+type);
						}
					};
					App.UI.buildCustomElementAction(actionName, element, xf);
				}
			})();
		}
	}
	// get any custom conditions
	if (inst.getConditions)
	{
        /* App.Wel.customConditionObservers[element.id] = {};

        var customConditions = inst.getConditions();
        for (var i = 0; i < customConditions.length; i++)
        {
            var custCond = customConditions[i];
            var condFunct = App.Wel.customConditionFunctionCallback(custCond);
            App.Wel.registerCustomCondition({conditionNames: [custCond]}, 
                condFunct, element.id);
        }

		*/
	}
	
	if (App.Wel) App.Wel.parseOnAttribute(element);
	
};

// 
// Basic Functions for creating and executing actions on controls
//
App.UI.actionElementMap = {}
App.UI.createElementActionFunction = function(element,name,f)
{
	var id = (typeof element == 'string') ? element : element.id;
	var key = id + '_' + name;
	App.UI.actionElementMap[key]=f;
	return element;
};
App.UI.executeElementActionFunction = function(id,name,params,scope)
{
	var f = App.UI.actionElementMap[id + '_' + name];
	if (f)
	{
		f(params,scope);
	}
}
App.UI.buildCustomElementAction = function (name, element, callback)
{
	App.UI.createElementActionFunction(element,name,callback);
	
    App.Wel.registerCustomAction(name, 
	{
		execute: function(id,action,params,scope)
		{
			App.UI.executeElementActionFunction(id,action,params,scope);
		}
	}, element);
};

// 
// Keep track of an element's UI attributes (controls, behaviors, layouts, etc)
// This is used to faciliate dependency handling between controls and behaviors
// specifically if one element is using a certain control + one or more behaviors
// 
App.UI.addElementUI = function(element, ui, type,inst)
{
	// is UI attribute combo part of an existing dependency
	var map = App.UI.dependencyMap;
	for (var i=0;i<map.length;i++)
	{
		if (map[i].element.id == element.id)
		{
			// new UI + TYPE has a dependency for this element
			if ((map[i].dependencyUI == ui) && (map[i].dependencyType == type))
			{
				// see if element already has UI + TYPE 
				if (App.UI.elementMap[element.id + "_" + map[i].ui + "_" + map[i].type])
				{
					map[i].callback(element);
				}
			}
		}
	}
	App.UI.elementMap[element.id + "_" + ui + "_" + type] = {element:element,inst:inst};
	
};


/****************************************************
  HANDLE CROSS-CONTROL/BEHAVIOR/LAYOUT DEPENDENCIES
*****************************************************/
App.UI.dependencyMap = [];

//
// allow components to register their dependencies for an element
//
App.UI.addElementUIDependency = function(element,ui,type,dependencyUI, dependencyType, callback)
{

	// see if element already has UI attribute that is a dependency
	if (App.UI.elementMap[element.id + "_" + dependencyUI +"_" + dependencyType])
	{
		callback(element);
	}
	
	// otherwise store it for later
	else
	{
		App.UI.dependencyMap.push({element:element,ui:ui,type:type,dependencyUI:dependencyUI,dependencyType:dependencyType,callback:callback});	
	}
};



//
// Parse passed in attributes and make sure they match what 
// is supported by component
//
App.UI.UIManager.parseAttributes = function(element,f,options)
{
	var moduleAttributes = f.getAttributes();
	for (var i = 0; i < moduleAttributes.length; i++)
	{
		var error = false;
		var modAttr = moduleAttributes[i];
		switch (typeof options[modAttr.name]) {
  		case 'boolean':
  	    var value = options[modAttr.name];
  	    break;
  		default:
  	    var value =  options[modAttr.name] || element.style[modAttr.name] || modAttr.defaultValue;
  	    break;
  	}
		// check and make sure the value isn't a function as what will happen in certain
		// situations because of prototype's fun feature of attaching crap on to the Object prototype
		switch (typeof value) {
		  case 'function':
			  value = modAttr.defaultValue;
			  break;
  		case 'string':
        if (value.match(/^\d+$/)) {
          value = parseInt(value)
        }
  		  break;
  		case 'object':
			case 'undefined':
        if (!value && !modAttr.optional) {
    			App.Compiler.handleElementException(element, null, 'required attribute "' + modAttr.name + '" not defined for ' + element.id);
    			error = true;
        }
			  break;
		}
		options[modAttr.name] = value;
		if (error == true)
		{
			if (App.Util.Logger) App.Util.Logger.error('error parsing attributes for '+element);
			return false;
		}
	}
	return options;
};



//
// called to handle load error
//
App.UI.handleLoadError = function(element,type,name,subtype,path)
{
	App.Compiler.handleElementException(element,null,"couldn't load "+type+":"+name+" for : "+path);
};


