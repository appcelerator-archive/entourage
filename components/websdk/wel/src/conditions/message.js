if (App && App.mq)
{
	//
	// this is a custom condition for handling executing actions based on a message condition
	//
	App.Wel.registerCustomCondition(function(element,condition,action,elseAction,delay,ifCond)
	{
		if (condition.startsWith('local:') ||
		       condition.startsWith('l:') || 
		       condition.startsWith('remote:') ||
		       condition.startsWith('r:') ||
			   condition.startsWith('both:') ||
			   condition.startsWith('*:') )
		{
			var id = element.id;
			var actionParams = App.Wel.parameterRE.exec(condition);
			var type = (actionParams ? actionParams[1] : condition);
			var params = actionParams ? actionParams[2] : null;
			var actionFunc = App.Wel.makeConditionalAction(id,action,ifCond);
			var elseActionFunc = (elseAction ? App.Wel.makeConditionalAction(id,elseAction,null) : null);
			return App.Wel.MessageAction.makeMBListener(element,type,actionFunc,params,delay,elseActionFunc);
		}
		return false;
	});

	App.Wel.MessageAction = {};

	App.Wel.MessageAction.makeMBListener = function(element,type,action,params,delay,elseaction)
	{
		var actionParams = params ? App.Wel.getParameters(params,false) : null;
		var i = actionParams ? type.indexOf('[') : 0;
		if (i>0)
		{
			type = type.substring(0,i);
		}
		if (type.indexOf(':~') == 1)
		{
			var parts = type.split('~',2);
			var msg = parts[0]+parts[1]
			type = new RegExp(msg);
		}
		
		$MQL(type,function(msg)
		{
			// if element is still in DOM handle
			if (swiss('#'+element.id).get(0))
				App.Wel.MessageAction.onMessage(element,msg.name,msg.payload,actionParams,action,delay,elseaction);
		
		},element.scope,element);

		return true;
	};

	App.Wel.MessageAction.onMessage = function(element,type,data,actionParamsStr,action,delay,elseaction)
	{
		var ok = App.Wel.parseConditionCondition(actionParamsStr, data);
		var obj = {id:element.id,type:type,data:data};
		if (ok)
		{
			App.Wel.executeAfter(action,delay,obj);
		}
		else if (elseaction)
		{
			App.Wel.executeAfter(elseaction,delay,obj);
		}
	};

	
}
