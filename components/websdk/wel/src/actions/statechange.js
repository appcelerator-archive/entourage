App.Wel.registerCustomAction('statechange',
{
	execute: function(id,action,params)
	{
		if (params.length == 0)
		{
			throw "syntax error: expected parameters in format 'statechange[statemachine=state]'";
		}

		var statemachine = params[0].key;
		var state = params[0].value
		
		// find statemachine
		for (var i=0;i<App.Wel.StateMachine.active.length;i++)
		{
			var curMachine = App.Wel.StateMachine.active[i];
			
			// if same, then fire state change
			if (curMachine.name == statemachine)
			{
				curMachine.fireStateChange(state);
				return;
			}
		}
	}
});