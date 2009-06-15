// 
// register our input fields listener
// 
App.Compiler.registerAttributeProcessor(['textarea','input','select'],'validator',
{
	handle: function(element,attribute,value)
	{
		if (value && element.getAttribute('type')!='button')
		{
			// get the validator
			var validatorFunc = App.Validator[value];
			if (!validatorFunc)
			{
				throw "syntax error: validator specified is not registered: "+value;
			}
			var value = App.Util.getElementValue(element,true,true);
			element.validatorValid = validatorFunc(value, element) || false;
			
			// get the decorator
			var decoratorValue = element.getAttribute('decorator');
			var decorator = null, decoratorId = null;
			if (decoratorValue)
			{
				decorator = App.Decorator[decoratorValue];
				if (!decorator)
				{
					throw "syntax error: decorator specified is not registered: "+decoratorValue;
				}
				decoratorId = decorator ? element.getAttribute('decoratorId') : null;
			}
						
			var timer = null;
			var keystrokeCount = 0;
			var timerFunc = function()
			{
				swiss('#'+element.id).fire('revalidate')
			};

			// strart timer on click - but call only once
			swiss('#'+element.id).on('click', {}, function()
			{
				timerFunc();
			});
			
			// strart timer on focus
			swiss('#'+element.id).on('focus', {}, function()
			{
				timer = setInterval(timerFunc,100);
			});
			
			// cancel timers on blur
			swiss('#'+element.id).on('blur', {}, function()
			{
				if (timer)
				{
					clearInterval(timer);
					timer=null;
				}
			})
			
			// handler revalation
			swiss('#'+element.id).on('revalidate',{},function()
			{
				var value = App.Util.getElementValue(element,true,true);
				var valid = validatorFunc(value, element);
				element.validatorValid = valid;				
				var event = (valid==true)?'valid':'invalid';
				swiss('#'+element.id).fire(event);
				
				if (decorator)
				{
					decorator.apply(App.Decorator,[element,element.validatorValid,decoratorId]);
				}
				
			});
						
			swiss('#'+element.id).fire('revalidate')
		}
	}
});
