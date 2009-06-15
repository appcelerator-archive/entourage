App.fieldSets = {};
App.addFieldSet = function(element,excludeSelf,fieldsetName)
{
	excludeSelf = (excludeSelf==null) ? false : excludeSelf;
	fieldsetName = fieldsetName || element.getAttribute('fieldset');
	if (fieldsetName)
	{
		var fieldset = App.fieldSets[fieldsetName];
		if (!fieldset)
		{
			fieldset=[];
			App.fieldSets[fieldsetName] = fieldset;
		}
		if (false == excludeSelf)
		{
			fieldset.push(element.id);
		}
		return fieldset;
	}
	return null;
};

App.removeFieldSet = function(element)
{
	var fieldsetName = element.getAttribute('fieldset');
	if (fieldsetName)
	{
		var fieldset = App.fieldSets[fieldsetName];
		if (fieldset)
		{
			fieldset.remove(element.id);
		}
	}
};
App.fetchFieldset = function(fieldset, localMode, data) 
{
	if(!data) 
	{
        data = {};
    }
    
    var fields = App.fieldSets[fieldset];
	if (fields && fields.length > 0)
	{
		for (var c=0,len=fields.length;c<len;c++)
		{
			var fieldid = fields[c];
			var field = swiss('#'+fieldid).get(0);
			var name = field.getAttribute('name') || fieldid;
            
            // don't overwrite other values in the payload
			if (data[name] == null)
			{
				// special case type field we only want to add
				// the value if it's checked
				if (field.type == 'radio' && !field.checked)
				{
					continue;
				}
				var newvalue = App.Util.getElementValue(field,true,localMode);
				var valuetype = typeof(newvalue);
				if (newvalue != null && (valuetype=='object' || newvalue.length > 0 || valuetype=='boolean'))
				{
					data[name] = newvalue;
				}
				else
				{
					data[name] = '';
				}
			}
			else
			{
			    if(field.type != 'radio')
			    {
			        App.Util.Logger.warn('fieldset value for "'+name+'" ignored because it conflicts with existing data payload value');
		        }
			}
		}
	}
	return data;
};

App.Compiler.registerAttributeProcessor('*','fieldset',
{
	handle: function(element,attribute,value)
	{
		if (value && element.getAttribute('type')!='button')
		{
			App.addFieldSet(element,false);

			// Appcelerator.Compiler.addTrash(element, function()
			// {
			//     Appcelerator.Compiler.removeFieldSet(element);
			// });
		}
	}
});
