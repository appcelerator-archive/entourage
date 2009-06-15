App.Wel.registerCustomCondition(
	function(element,condition,action,elseAction,delay,ifCond)
	{
	    if (!condition.startsWith('history:') && !condition.startsWith('history['))
		{
			return false;
		}

	    var token = null;

	    if (condition.startsWith('history:'))
	    {
	        token = condition.substring(8);
	    }
    
	    if (condition.startsWith('history['))
	    {
	        token = condition.substring(8,condition.indexOf(']'));
	    }

		// allow token to be empty string which is essentially wildcard
	    token = token || '';

		var id = element.id;
		var actionFunc = App.Wel.makeConditionalAction(id,action,ifCond);
		var elseActionFunc = elseAction ? App.Wel.makeConditionalAction(id,elseAction,null) : null;
		var operator = '==';

		if (token.charAt(0)=='!')
		{
			token = token.substring(1);
			operator = '!=';
		}
		else if (token == '*')
		{
		    operator = '*';
		}
	
		// support a null (no history) history
		token = token.length == 0 || token=='_none_' || token==='null' ? null : token;
	
		App.History.onChange(function(newLocation,data,scope)
		{
			switch (operator)
			{
				case '==':
				{
					if (newLocation == token)
					{
						App.Wel.executeAfter(actionFunc,delay,{data:data});
					}
					else if (elseActionFunc)
					{
						App.Wel.executeAfter(elseActionFunc,delay,{data:data});
					}
					break;
				}
				case '!=':
				{
					if (newLocation != token)
					{
						App.Wel.executeAfter(actionFunc,delay,{data:data});
					}
					else if (elseActionFunc)
					{
						App.Wel.executeAfter(elseActionFunc,delay,{data:data});
					}
					break;
				}
				case '*':
				{
				    if (newLocation)
				    {
						App.Wel.executeAfter(actionFunc,delay,{data:data});
				    }
					break;
				}
			}
		});
		return true;
	}
);



