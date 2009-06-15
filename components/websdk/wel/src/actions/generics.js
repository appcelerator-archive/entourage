(function()
{
	var registerGenericAction = function(action)
	{
		App.Wel.registerCustomAction(action,
		{
			execute:function(id,action,params)
			{
				var target = App.Wel.findTarget(id,params);
				switch(action)
				{
					case 'focus':
					case 'blur':
					case 'click':
					case 'submit':
					case 'select':
					{
						swiss('#'+target).fire(action);
						break;
					}
					case 'disable':
					{
						swiss('#'+target).get(0).disabled = true;
						swiss('#'+target).fire('disabled');

						break;
					}
					case 'enable':
					{
						swiss('#'+target).get(0).disabled = false;
						swiss('#'+target).fire('enabled');
						break;
					}

				}
			}
		})
	}
	registerGenericAction('enable');
	registerGenericAction('disable');
	registerGenericAction('focus');
	registerGenericAction('blur');
	registerGenericAction('select');
	registerGenericAction('click');
	registerGenericAction('submit');
	
})();
