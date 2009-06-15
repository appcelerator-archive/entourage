App.Wel.registerCustomAction('hide',
{
	execute: function(id,action,params)
	{
		var el = App.Wel.findTarget(id,params);
  		swiss('#'+el).hide();
	}
});
