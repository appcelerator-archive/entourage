App.Wel.registerCustomCondition(

	function(element,condition,action,elseAction,delay,ifCond)
	{	
		switch (condition)
		{
			case 'click':
			case 'focus':
			case 'blur':
			case 'load':
			case 'unload':
			case 'select':
			case 'resize':
			case 'scroll':
			case 'submit':
			case 'dblclick':
			case 'mousedown':
			case 'mouseout':
			case 'mouseover':
			case 'mousemove':
			case 'mouseup':
			case 'change':
			case 'contextmenu':
			case 'mousewheel':
			{
				if (elseAction)
				{
					throw 'condition: '+ condition + ' does not support else';
					return false;
				}
				var actionFunc = App.Wel.makeConditionalAction(element.id,action,ifCond);
				
				// handle change specially 
				// default onchange only fires after focus
				// is lost, we want to fire immediately after change
				if (condition == 'change')
				{
					// get current value
					var value = App.Util.getElementValue(element)
					setInterval(function()
					{
						var currentValue = App.Util.getElementValue(element)
						if (currentValue != value)
						{
							value = currentValue;
							App.Wel.executeAfter(actionFunc,delay,{id:element.id});									
						}					
					},500);
				}
				else
				{
					swiss(element).on(condition,{}, function(e)
					{
						App.Wel.executeAfter(actionFunc,delay,{id:element.id});		
					});
				}
				App.Compiler.addTrash(element,function()
				{
					swiss(element).un(condition)
				})
				return true;
			}
		}
		return false;
	}
);

