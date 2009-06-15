(function()
{
	var addsetBuildFunction = function(id,action,params,scope)
	{
		if (params.length == 0)
		{
			throw "syntax error: expected parameter key:value for action: "+action;
		}
		var target = App.Wel.findTarget(id,params);
		for (var c=0;c<params.length;c++)
		{
			var obj = params[c];
			var key = obj.key;
			if (typeof(key)!= "string") continue;
			var value = obj.value;
			if (App.Wel.isCSSAttribute(key))
			{
				key = App.Wel.convertCSSAttribute(key);
				swiss('#'+target).css(key, value);
				continue;
			}
			else if (key == 'class')
			{
				if (action=='set')
				{
					swiss('#'+target).get(0).className = App.Wel.getEvaluatedValue(value,(scope)?scope.data:{});
				}
				else
				{
					swiss('#'+target).addClass(App.Wel.getEvaluatedValue(value,(scope)?scope.data:{}));
				}
			}
			else if (key.startsWith('style'))
			{
			    swiss('#'+target).get(0)[key] = App.Wel.getEvaluatedValue(value,(scope)?scope.data:{});
		    }
		    else
		    {
				var e = swiss('#'+target).get(0);
				if (!e)
				{
				    throw "syntax error: element with ID: "+target+" doesn't exist";
				}
				if (e[key]!=null)
				{
	    			switch(key)
	    			{
	    				case 'checked':
	    				case 'selected':
	    				case 'disabled':
						case 'defaultChecked':
	    				{
							var value = App.Wel.getEvaluatedValue(value,(scope)?scope.data:{});
							if (value)
							{
								e.setAttribute(key,value);
							}
							else
							{
								e.removeAttribute(key);
							}
	    					break;
						}
	    				default:
	    				{
	            			var isOperaSetIframe = App.Browser.isOpera && e.nodeName=='IFRAME' && key=='src';
	    				    if (isOperaSetIframe)
	    				    {
	    				        e.location.href = App.Wel.getEvaluatedValue(value,(scope)?scope.data:{});
	    				    }
	    				    else
	    				    {
	    				        e[key] = App.Wel.getEvaluatedValue(value,(scope)?scope.data:{});
	    				    }
						}
	    			}
			    }
			    else
			    {
			        e.setAttribute(key, App.Wel.getEvaluatedValue(value,(scope)?scope.data:{}));
			    }
			}
		}
	}

    App.Wel.registerCustomAction('add',
	{
		execute: addsetBuildFunction
	});
    App.Wel.registerCustomAction('set',
    {
        execute: addsetBuildFunction
    });
})();
