App.Wel.registerCustomAction('hidden',
{
	execute: function(id,action,params)
	{
		var el = App.Wel.findTarget(id,params);
  		swiss('#'+el).css('visibility','hidden');
	}
});
