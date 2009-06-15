App.Wel.toggleValues = {};
App.Wel.registerCustomAction('toggle',
{
	execute: function(id,action,params)
	{
		if (params && params.length > 0)
		{
			var toggleKey;
			var toggleValue;
			for (var i=0;i<params.length;i++)
			{
				if (params[i].key == id)
				{
					continue;
				}
				else
				{
					toggleKey = params[i].key;
					toggleValue = params[i].value
				}
			}
			var target = App.Wel.findTarget(id,params)

			// toggle class
			if (toggleKey == 'class')
			{
			    if (swiss('#'+target).hasClass(toggleValue))
			    {
			        swiss('#'+target).removeClass(toggleValue);
			    }
			    else
			    {
			        swiss('#'+target).addClass(toggleValue);
		        }
			}
			else
			{
				if (App.Wel.isCSSAttribute(toggleKey))
				{
					var key = App.Wel.convertCSSAttribute(toggleKey);
					switch (key)
					{
						case 'display':
						case 'visibility':
						{
							var opposite = '';
							switch(toggleValue)
							{
								case 'inline':
									opposite='none';break;
								case 'block':
									opposite='none'; break;
								case 'none':
									opposite='block'; break;
								case 'hidden':
									opposite='visible'; break;
								case 'visible':
									opposite='hidden'; break;
							}
							var a = swiss('#'+target).css(key);
						    var value = null;
							if (a!=opposite)
							{
							    value = opposite;
							}
							else
							{
							    value = toggleValue;
						    }
						    swiss('#'+target).css(key,value);
							break;
						}
						default:
						{
							var a = swiss('#'+target).css(key);
							
							if (a != toggleValue)
							{
								App.Wel.toggleValues[target] = a;
								swiss('#'+target).css(key,toggleValue);
							}
							else
							{
								swiss('#'+target).css(key,App.Wel.toggleValues[target]);
							}
							break;
						}
					}
				}
				else
				{
					var a = swiss('#'+target).get(0);
					if (!a)
					{
					    throw "no element with ID: "+target;
					}
					var v = a.getAttribute(toggleKey);
					if (v)
					{
					    a.removeAttribute(toggleKey);
					}
					else
					{
					    a.setAttribute(toggleKey,toggleValue);
				    }
				}
			}
		}
		else
		{
			throw "syntax error: toggle action must have parameters";
		}
	}
});
