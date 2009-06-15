App.Wel.registerCustomCondition(

	function(element,condition,action,elseAction,delay,ifCond)
	{	
		switch (condition)
		{
			case 'dragend':
			case 'dragstart':
			case 'dragover':
			case 'dropover':
			case 'dropout':
			case 'drag':
			case 'drop':
			case 'sortupdate':
			case 'sortchange':
			case 'sortstart':
			case 'sortend':
			case 'resizestart':
			case 'resizeend':
			case 'resize':
			case 'selected':
			case 'selecting':
			case 'unselected':
			case 'unselecting':
			case 'enabled':
			case 'disabled':
			case 'invalid':
			case 'valid':
			case 'hide':
			case 'show':
			{
				if (elseAction)
				{
					throw 'condition: '+ condition + ' does not support else';
					return false;
				}
				var actionFunc = App.Wel.makeConditionalAction(element.id,action,ifCond);
				swiss(element).on(condition,{}, function(e,ui)
				{
					App.Wel.executeAfter(actionFunc,delay,{id:element.id,event:e,ui:ui});		
				});
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

