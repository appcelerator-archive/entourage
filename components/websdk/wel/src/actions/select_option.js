App.Wel.registerCustomAction('selectOption',
{
	execute: function(id,action,params,scope)
	{
		if (params.length == 0)
		{
			throw "syntax error: expected parameter property for action: "+action;
		}
		var select = swiss('#'+id).get(0);

		if (!select.options)
		{
			throw "syntax error: selectOption must apply to a select tag";
		}

		// try to get value from action args
		var key = params[0].key;
		var selectedValue = params[0].value || key;
		if (selectedValue=='$null')
		{
			selectedValue = '';
		}
		
		// try to get value from message data
		if (scope.data && selectedValue == null)
		{
			selectedValue = App.Util.getNestedProperty(scope.data, key, def);

		}
		
		// if no selected value found return
		if (selectedValue == null) return;
		
		var targetSelect = swiss('#'+id).get(0);
		var isArray = selectedValue.constructor == Array;

        targetSelect.selectedIndex = -1;

		for (var j=0;j<targetSelect.options.length;j++)
		{
			if (isArray)
			{
				targetSelect.options[j].selected = selectedValue.include(targetSelect.options[j].value);
			}
			else
			{
			    if (targetSelect.options[j].value == selectedValue)
			    {
			        targetSelect.selectedIndex = j;
			        break;
			    }
			}
		}
		swiss(targetSelect).fire('revalidate');
	}
});
