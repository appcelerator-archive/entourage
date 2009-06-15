// 
// register our input button listener for handling
// activators
// 
App.Compiler.registerAttributeProcessor(['div','input','button'],'activators',
{
	handle: function(element,attribute,value)
	{
		var fieldset = element.getAttribute('fieldset');
		if (fieldset)
		{
			// do initial check
			var fields = swiss('*[fieldset='+fieldset+']').results; 
			var initialState = false;
			for (var i=0;i<fields.length;i++)
			{
				// if validator is invalid, disabled element
				if (fields[i].validatorValid == false)
				{
					initialState = true;
				}
				
				// if element has a validator, setup a revalidate listener
				if (fields[i].validatorValid != undefined)
				{
					swiss('#'+fields[i].id).on('revalidate',function()
					{
						var disabled = false;
						for (var j=0;j<fields.length;j++)
						{
							if (fields[j].validatorValid == false)
							{
								disabled = true;
								break;
							}
						}
						element.disabled = disabled;
						var event = (disabled == true)?'disabled':'enabled';
						swiss('#'+element.id).fire(event);
					});
				}
			}
			var initialEvent = (initialState == true)?'disabled':'enabled';
			element.disabled = initialState;
			swiss('#'+element.id).fire(initialEvent);
		}
	}
});