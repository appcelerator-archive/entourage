App.Wel.registerCustomAction('effect',
{
	execute: function(id,action,params)
	{
		// get effect name
		var arg1= params[0].key.split(",");
		var effectName = arg1[0];
		
		// build options
		var options = {}
		var target = id;
		if (params.length > 1)
		{
			for (var i=1;i<params.length;i++)
			{
				if (params[i].key == "id")
				{
					target = params[i].value;
				}
				else
				{

					options[params[i].key] = params[i].value;
				}
			}
		}

		if (swiss('#'+target).effect(effectName, options) == null)
		{
			throw ('effect not supported by library => effect name: ' + effectName);
		}
	}
});
