App.Wel.registerCustomAction('history',
{
	execute: function(id,action,params)
	{
		if (params && params.length > 0)
		{
			var obj = params[0];
			var key = obj.key;
			App.History.go(key);
		}
		else
		{
			throw "required parameter for history action";
		}	
	}
});
