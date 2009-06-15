//
// Processor for controls
//
App.Compiler.registerAttributeProcessor('*','control',
{
	handle: function(element,attribute,value)
	{
		var options = App.UI.parseDeclarativeUIExpr(value)
		element.stopCompile=true;
		var compiler = function()
		{
			App.Compiler.compileElementChildren(element);
		};

		App.loadUIManager("control",options.type,element,options.args,false,compiler);

	},
	metadata:
	{
		description: (
			"create a control for an element"
		)
	}
	
});

//
// Processor for layouts
//
App.Compiler.registerAttributeProcessor('*','layout',
{
	handle: function(element,attribute,value)
	{
		var compiler = function()
		{
			App.Compiler.compileElementChildren(element);
		};
		
		var options = App.UI.parseDeclarativeUIExpr(value)
		element.stopCompile=true;
		App.loadUIManager("layout",options.type,element,options.args,false,compiler);

	},
	metadata:
	{
		description: (
			"create a layout for an element"
		)
	}
	
});

//
// Processor for themes
//
App.Compiler.registerAttributeProcessor('*','theme',
{
	handle: function(element,attribute,value)
	{
		var compiler = function()
		{
			App.Compiler.compileElementChildren(element);
		};
		
		var options = App.UI.parseDeclarativeUIExpr(value)
		element.stopCompile=true;
		App.loadUIManager("theme",options.type,element,options.args,false,compiler);
	},
	metadata:
	{
		description: (
			"create a theme for an element"
		)
	}
	
});

//
// Processor for behaviors
//
App.Compiler.registerAttributeProcessor('*','behavior',
{
	handle: function(element,attribute,value)
	{
		var compiler = function()
		{
			App.Compiler.compileElementChildren(element);
		};
		
		var expr = App.Wel.smartSplit(value,' and ');
		var options = null;
		if (expr.length >0)
		{
			for (var i=0;i<expr.length;i++)
			{
				options = App.UI.parseDeclarativeUIExpr(expr[i])
				element.stopCompile=true;
				App.loadUIManager("behavior",options.type,element,options.args,false,compiler);
			}
		}
		else
		{
			var options = App.UI.parseDeclarativeUIExpr(value)
			element.stopCompile=true;
			App.loadUIManager("behavior",options.type,element,options.args,false,compiler);
			
		}
	},
	metadata:
	{
		description: (
			"create a behavior for an element"
		)
	}
	
});

//
// Helper function for parsing control attributes
//
App.UI.parseDeclarativeUIExpr = function(value)
{
	var args = {};
	if (value.indexOf("[") == -1)
	{
		type = value;
	}
	else
	{
		var expr = value.replace("[",",").replace("]","");
		var pieces = expr.split(",")
		for (var i=0;i<pieces.length;i++)
		{
			if (i==0)type = pieces[i].trim();
			else
			{
				var pair = pieces[i].split("=");
				var value = pair[1].trim();
				if (value == 'true')
				{
					value = true;
				}
				else if(value == 'false')
				{
					value = false;
				}
				else if (value.startsWith('expr('))
				{
					var func =    value.substring(5,value.length-1) + '()';
			        value = func.toFunction(true);
				}
			
				args[pair[0].trim()] = value;					
			}
		}
	}
	return {type:type, args:args}
	
};
