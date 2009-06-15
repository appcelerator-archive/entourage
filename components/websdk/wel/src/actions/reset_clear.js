(function()
{
	var ResetAction =
	{
		execute: function(id,action,params)
		{
			var target = App.Wel.findTarget(id,params);
			var element = swiss('#'+target).get(0);
			if (!element)return;
			var revalidate = false;
			var value = '';
			switch (App.Compiler.getTagname(element))
			{
				case 'input':
				case 'textarea':
				{
				    element.value = value;
					revalidate=true;
					break;
				}
				case 'select':
				{
				    element.selectedIndex = 0;
					revalidate=true;
					break;
				}
				case 'form':
				{
					var formEls = swiss('#'+element.id+ "> * ").results;
					for (var i=0;i<formEls.length;i++)
					{
						var tag = App.Compiler.getTagname(formEls[i])
						switch(tag)
						{
							case 'input':
							{
								if (formEls[i].type == 'text')
									formEls[i].value = '';
							  	else
									formEls[i].checked = false;
								swiss(formEls[0]).fire('revalidate');
								break;
							}
							case 'textarea':
							{
								formEls[i].value = '';
								swiss(formEls[0]).fire('revalidate');
								break;
							}
							case 'select':
							{
								formEls[i].selectedIndex=0;
								swiss(formEls[0]).fire('revalidate');
								break;
								
							}
						}
					}
	                return;
				}
				default:
				{
					swiss('#'+target).html(value);
					return;
				}
			}
			
			if (revalidate==true)
			{
			   swiss(element).fire('revalidate');
			}
		}
	};
	App.Wel.registerCustomAction('clear',ResetAction);
	App.Wel.registerCustomAction('reset',ResetAction);
	
})();
