App.Wel.registerCustomCondition(

	function(element,condition,action,elseAction,delay,ifCond)
	{	
		// parse condition
		var sm = null;
		var state = null;
		var i = condition.indexOf('[');

		if (i > 0)
		{
		    state = condition.substring(i+1,condition.indexOf(']'));
		    sm = condition.substring(0,i);
		}
		else
		{
			return false;
		}
		var currentSM = null;
		
		// find statemachine
		for (var i=0;i<App.Wel.StateMachine.active.length;i++)
		{			
			// if same, then fire state change
			if (App.Wel.StateMachine.active[i].name == sm)
			{
				currentSM = App.Wel.StateMachine.active[i];
				break;
			}
		}
		if (currentSM == null)
		{
			return false;
		}

		var actionFunc = App.Wel.makeConditionalAction(element.id,action,ifCond);
		var elseActionFunc = (elseAction != null)?App.Wel.makeConditionalAction(element.id,elseAction,ifCond):null;
		
		// fire action is initial state is set
		if (currentSM.activeState == state)
		{
			App.Wel.executeAfter(actionFunc,delay,{id:element.id,statemachine:this});		
		}
		else if (elseActionFunc != null)
		{
			App.Wel.executeAfter(elseActionFunc,delay,{id:element.id,statemachine:this})
		}
		
		// add state change listener
		currentSM.addListener(function()
		{
			if (state == this.activeState)
			{
				App.Wel.executeAfter(actionFunc,delay,{id:element.id,statemachine:this});		
			}
			else if (elseActionFunc != null)
			{
				App.Wel.executeAfter(elseActionFunc,delay,{id:element.id,statemachine:this})
			}
			
		});

		return true;

	}
);

