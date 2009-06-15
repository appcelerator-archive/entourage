App.Wel.registerCustomAction('remove',
{
	execute: function(id,action,params)
	{
		if (params.length == 0)
		{
			throw "syntax error: expected parameter for action: "+action;
		}
		var target = App.Wel.findTarget(id,params);
		var key = null;
		var value = null;
		for (var c=0;c<params.length;c++)
		{
			if (params[c].key == 'id') continue;
			key = params[c].key;
			value = params[c].value;
			if (key)
			{
				switch (key)
				{
					case 'class':
					    swiss('#'+target).removeClass(value);
					    break;
					default:
		    			swiss('#'+target).get(0).removeAttribute(key);
				}
			}

		}
	}
});
