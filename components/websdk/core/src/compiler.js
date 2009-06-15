var App = (typeof App == "undefined")?{}:App;
App.Compiler = {};
App.Compiler.nextId = 0;
// TODO: ADD DYNAMIC COMPILE AND DESTORY CONVENIENCE FUNCTIONS

/////////////////////////////////////////////////////////////////
//
//  Compiler Functions
//
/////////////////////////////////////////////////////////////////

/**
 * STEP 1
 *
 * @param {function} onFinishCompiled function to call (or null) when document is finished compiling
 */
App.Compiler.compileDocument = function(onFinishCompiled)
{
    if (App.Util.Logger) App.Util.Logger.debug('compiled document called');
   	var container = swiss(document.body).get(0);
    if (!container.id)
    {
        App.Compiler.setElementId(container, 'app_body');
    }

    var state = {pending:0,scanned:false}
	container.state = state;
	
    // start scanning at the body
    App.Compiler.compileElement(container,state);

    // mark it as complete and check the loading state
    state.scanned = true;
    state.onafterfinish = function(code)
    {
    	if (typeof(onFinishCompiled)=='function') onFinishCompiled();
		App.Compiler.compileDocumentOnFinish();
    };
    App.Compiler.checkLoadState(container);
};


/**
 * STEP 2 - Compile 
 */

// We need to know how many UI components there are
// so we can eventually fire a compiled message once the 
// entire doc has been processed
App.Compiler.uiCount = 0;
App.Compiler.processedCount = 0;
App.Compiler.uiComponentProcessed = function()
{
	// if processed called before any counts - it's from an API call
	if (App.Compiler.uiCount == 0)return;
	
	App.Compiler.processedCount++;

	if (App.mq && App.Compiler.hasCompleted == false && App.Compiler.documentLoaded == true && 
		App.Compiler.uiCount==App.Compiler.processedCount)
	{
		App.Compiler.hasCompleted = true;
	    $MQ('l:app.compiled');		
	
	}
	
}

App.Compiler.compileElement = function(element,state,recursive)
{
    if (element.getAttribute('control') != null || element.getAttribute('behavior') != null)
	{
		App.Compiler.uiCount++;
		recursive = false;
	}
	else
	{
		recursive = recursive==null ? true : recursive;
	}
	App.Compiler.getAndEnsureId(element);

    if (App.Util.Logger) App.Util.Logger.debug('compiling element => '+element.id);

    if (element.compiled)
    {
       App.Compiler.destroy(element);
    }
    element.compiled = 1;

	element.state = state;
	try
	{
		App.Compiler.delegateToAttributeListeners(element);
		if (recursive && !element.stopCompile)
        {
			App.Compiler.compileElementChildren(element);
		}
	}
	catch(e)
	{
		App.Compiler.handleElementException(element, e, 'compiling ' + element.id);
	}
};

/**
 * STEP 3 - Compile element's children
 */
App.Compiler.compileElementChildren = function(element)
{
	if (element && element.nodeType == 1)
	{
		if (element.nodeName.toLowerCase() != 'textarea')
		{
		    var elementChildren = [];
			if (element && element.nodeType == 1)
			{
				for (var i = 0, length = element.childNodes.length; i < length; i++)
				{
				    if (element.childNodes[i].nodeType == 1)
				    {
			    	     elementChildren.push(element.childNodes[i]);
			    	}
				}
			}

			for (var i=0,len=elementChildren.length;i<len;i++)
			{
	            App.Compiler.compileElement(elementChildren[i],element.state);
			}
		}
		App.Compiler.checkLoadState(element);
	}
};

/**
 * After compile listners
 */
App.Compiler.oncompileListeners = [];
App.Compiler.afterDocumentCompile = function(l)
{
    App.Compiler.oncompileListeners.push(l);
};

App.Compiler.hasCompleted = false;
App.Compiler.documentLoaded = false;
App.Compiler.compileDocumentOnFinish = function ()
{
    if (App.Compiler.oncompileListeners)
    {
        for (var c=0;c<App.Compiler.oncompileListeners.length;c++)
        {
            App.Compiler.oncompileListeners[c]();
        }
        delete App.Compiler.oncompileListeners;
    }

	App.Compiler.documentLoaded = true;

	// call only once - controls can be compiled post load
	if (App.mq && App.Compiler.hasCompleted == false && App.Compiler.uiCount==App.Compiler.processedCount)
	{
		App.Compiler.hasCompleted = true;
		if (!App.isWebkit)
		{
			setTimeout(function()
			{
			    $MQ('l:app.compiled');	
			},10)
		}
	}
};
App.Compiler.dynamicCompile = function(element,recursive)
{
	if (!element) return;

	var state = {pending:0,scanned:false}
	App.Compiler.compileElement(element,state,recursive);
     // App.Compiler.doCompile(element,recursive);
};
App.Compiler.addTrash = function(element,trash)
{
	if (!element.trashcan)
	{
		element.trashcan = [];
	}
	element.trashcan.push(trash);
};

App.Compiler.destroy = function(element, recursive)
{
	if (!element) return;
	recursive = recursive==null ? true : recursive;

	element.compiled = 0;

	App.Compiler.removeElementId(element.id);

	if (element.trashcan && element.trashcan.constructor === Array)
	{
		for (var c=0,len=element.trashcan.length;c<len;c++)
		{
			try
			{
				element.trashcan[c]();
			}
			catch(e)
			{
				$D(e);
			}
		}
		try
		{
			delete element.trashcan;
		}
		catch(e)
		{
		}
	}

	if (recursive)
	{
		if (element.nodeType == 1 && element.childNodes && element.childNodes.length > 0)
		{
			for (var c=0,len=element.childNodes.length;c<len;c++)
			{
				var node = element.childNodes[c];
				if (node && node.nodeType && node.nodeType == 1)
				{
					try
					{
						App.Compiler.destroy(node,true);
					}
					catch(e)
					{
					    if (App.Util.Logger)App.Util.Logger.error('error calling destroy ' + e);
					}
				}
			}
		}
	}
};

/////////////////////////////////////////////////////////////////
//
//  Attribute Processing Functions
//
/////////////////////////////////////////////////////////////////



/**
 * @property {hash} has of key which is name of element (or * for all elements) and array
 * of attribute processors that should be called when element is encountered
 */
App.Compiler.attributeProcessors = {'*':[]};

/**
 * Register an object that has a <b>handle</b> method which takes
 * an element, attribute name, and attribute value of the processed element.
 *
 * This method takes the name of the element (or optionally, null or * as
 * a wildcard) and an attribute (required) value to look for on the element
 * and a listener.
 *
 * @param {string} name of attribute processor. can be array of strings for multiple elements or * for wildcard.
 * @param {string} attribute to check when matching element
 * @param {function} listener to call when attribute is matched on element
 */
App.Compiler.registerAttributeProcessor = function(name,attribute,listener)
{
	if (typeof name == 'string')
	{
		name = name||'*';
		var a = App.Compiler.attributeProcessors[name];
		if (!a)
		{
			a = [];
			App.Compiler.attributeProcessors[name]=a;
		}
		// always push to the end such that custom attribute processors will be 
		// processed before internal ones so that they can overwrite builtins
		a.unshift([attribute,listener]);
	}
	else
	{
		for (var c=0,len=name.length;c<len;c++)
		{
			var n = name[c]||'*';
			var a = App.Compiler.attributeProcessors[n];
			if (!a)
			{
				a = [];
				App.Compiler.attributeProcessors[n]=a;
			}
			// always push to the end such that custom attribute processors will be 
			// processed before internal ones so that they can overwrite builtins
			a.unshift([attribute,listener]);
		}
	}
};

/**
 * called internally by compiler to dispatch details to attribute processors
 *
 * @param {element} element
 * @param {array} array of processors
 */
App.Compiler.forwardToAttributeListener = function(element,array)
{
    for (var i=0;i<array.length;i++)
	{
		var entry = array[i];
		var attributeName = entry[0];
		var listener = entry[1];
		var value = element.getAttribute(attributeName);
       if (value) // optimization to avoid adding listeners if the attribute isn't present
        {
            listener.handle(element,attributeName,value);
        }
    }
};

/**
 * internal method called to process each element and potentially one or
 * more attribute processors
 *
 * @param {element} element
 */
App.Compiler.delegateToAttributeListeners = function(element)
{
	var tagname = App.Compiler.getTagname(element);
	if (App.Util.Logger) App.Util.Logger.debug('processing tag ' + tagname + ' for element ' + element)
	var p = App.Compiler.attributeProcessors[tagname];
	if (p && p.length > 0)
	{
		App.Compiler.forwardToAttributeListener(element,p,tagname);
	}
	p = App.Compiler.attributeProcessors['*'];
	if (p && p.length > 0)
	{
		App.Compiler.forwardToAttributeListener(element,p,'*');
	}
};

App.Compiler.checkLoadState = function (element)
{
	var state = element.state;
	if (state && state.pending==0 && state.scanned)
	{
		if (typeof(state.onfinish)=='function')
		{
			state.onfinish(code);
		}
		if (typeof(state.onafterfinish)=='function')
		{
			state.onafterfinish();
		}
		// remove state
		if (element.state)
		{
			try 
			{
				delete element.state;
			}
			catch (e)
			{
				element.state = null;
			}
		}
		return true;
	}
	return false;
};

App.Compiler.getTagname = function(element)
{
	if (!element) throw "element cannot be null";
	if (element.nodeType!=1) throw "node: "+element.nodeName+" is not an element, was nodeType: "+element.nodeType+", type="+(typeof element);

	// used by the compiler to mask a tag
	if (element._tagName) return element._tagName;

	if (App.Browser && App.Browser.isIE)
	{
		if (element.scopeName && element.tagUrn)
		{
			return element.scopeName + ':' + element.nodeName.toLowerCase();
		}
	}
	return element.nodeName.toLowerCase();
};

/**
 * return a formatted message detail for an exception object
 */
App.Compiler.getExceptionDetail = function (e,format)
{
    if (!e) return 'No Exception Object';
	if (typeof(e) == 'string')
	{
		return 'message: ' + e;
	}
    if (App.Browser && App.Browser.isIE == true)
    {
        return 'message: ' + e.message + ', location: ' + e.location || e.number || 0;
    }
    else
    {
		var line = 0;
		try
		{
			line = e.lineNumber || 0;
		}
		catch(x)
		{
			// sometimes you'll get a PermissionDenied on certain errors
		}
        return 'message: ' + (e.message || e) + ', location: ' + line + ', stack: ' + (format?'<pre>':'') +(e.stack || 'not specified') + (format?'</pre>':'');
    }
};

App.Compiler.handleElementException = function(element,e,context)
{
	var tag = element ? App.Compiler.getTagname(element) : 'body';
	var el = (element)?element:swiss(document.body).get(0);
	var msg = '<strong>Appcelerator Processing Error:</strong><div>Element ['+tag+'] with ID: '+(el.id||el)+' has an error: <div>'+App.Compiler.getExceptionDetail(e,true)+'</div>' + (context ? '<div>in <pre>'+context+'</pre></div>' : '') + '</div>';
	
	var id = (element && element != null)?element.id:'N/A';
	if (tag == 'IMG')
	{
		swiss(el).insertHTMLBefore(msg);
	}
	else
	{
		swiss(el).insertHTMLBefore('<div style="border:4px solid #777;padding:30px;background-color:#fff;color:#e00;font-family:sans-serif;font-size:18px;margin-left:20px;margin-right:20px;margin-top:100px;text-align:center;">' + msg + '</div>');
	}
	swiss(el).show();
};

App.Compiler.getAndEnsureId = function(element)
{
	if (!element.id)
	{
		element.id = 'app_' + (App.Compiler.nextId++);
	}
	if (!element._added_to_cache)
	{
	    App.Compiler.setElementId(element,element.id);
    }
	return element.id;
};

App.Compiler.setElementId = function(element, id)
{
	App.Compiler.removeElementId(element.id);
    element.id = id;
    element._added_to_cache = true;
    // set a global variable to a reference to the element
    // which now allows you to do something like $myid in javascript
    // to reference the element
    window['$'+id]=element;
    return element;
};

App.Compiler.removeElementId = function(id)
{
	if (id)
	{
		var element_var = window['$'+id];
		if (element_var)
		{
			try
			{
				delete window['$'+id];
			}
			catch(e)
			{
				window['$'+id] = 0;
			}
			if (element_var._added_to_cache)
			{
				try
				{
				    delete element_var._added_to_cache;
				}
				catch (e)
				{
					element_var._added_to_cache = 0;
				}
			}
			return true;
		}
	}
	return false;
};

swiss(document).onload(function()
{
	App.Compiler.compileDocument();

});