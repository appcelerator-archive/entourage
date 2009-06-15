App.Wel.registerCustomAction('visible',
{
	execute: function(id,action,params)
	{
  		swiss('#'+App.Wel.findTarget(id,params)).css('visibility','visible');
	}
});
