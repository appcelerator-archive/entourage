(function()
{
	var scriptBuilderAction =
	{
	    parseParameters: function (id,action,params)
	    {
	        return params;
	    },
	    execute: function (id,action,params,scope)
	    {   
	        var f = function() { eval(params); }
	        f.apply(scope);
	    }
	};
	App.Wel.registerCustomAction('javascript',scriptBuilderAction);
	App.Wel.registerCustomAction('function',scriptBuilderAction);
	App.Wel.registerCustomAction('script',scriptBuilderAction);
})();
