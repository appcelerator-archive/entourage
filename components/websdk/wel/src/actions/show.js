App.Wel.registerCustomAction('show',
{
	execute: function(id,action,params)
	{
		var el = App.Wel.findTarget(id,params)
		swiss('#'+el).show();
 	}
});
