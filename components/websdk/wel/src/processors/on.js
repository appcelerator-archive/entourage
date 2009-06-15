App.Compiler.registerAttributeProcessor('*','on',
{
	handle: function(element,attribute,value)
	{
		if (value)
		{
			if (element.getAttribute('control') !=null ||
			    element.getAttribute('behavior') !=null ||
			    element.getAttribute('layout') !=null||
			    element.getAttribute('theme') !=null)
			{
				// set calls parse after its done, let it win
				return;
			}
			App.Wel.parseOnAttribute(element);
		}
	}
});