App.Wel.registerCustomAction('value',
{
	execute: function(id,action,params,scope)
	{
		var target = App.Wel.findTarget(id,params);
		var element = swiss('#'+target).get(0);
		var valueHtml = null;
		var append = false;
		var form = false;
		var key = null;
		var value = null;
		
		if (params)
		{
			for (var c=0,len=params.length;c<len;c++)
			{
				var param = params[c];
				switch(param.key)
				{
					case 'append':
					{
						append=true;
						break;
					}
					case 'value':
					{
						valueHtml = param.value;
						break;
					}
					default:
					{
						key = param.key;
						value = param.value;
						if (param.empty)
						{
							if (key.startsWith("'") && key.endsWith("'"))
							{
								value = App.Wel.dequote(param.key);
								value = null;
							}
						}
					}
				}
			}
		}
		
		if (!key && !valueHtml)
		{
			key = params[0].key;
			value = params[0].value;
		}
		if (valueHtml == null)
		{
			if (!value && key && key.startsWith("'") && key.endsWith("'"))
			{
				valueHtml = App.Wel.dequote(key);
			}
			else if (!value)
			{
				valueHtml = App.Util.getNestedProperty(scope.data,key);
			}
			else if (value)
			{
				if (typeof(value)=='object')
				{
					valueHtml = App.Util.getNestedProperty(value,key);
				}
				else
				{
					valueHtml = value;
				}
			}
		}

		var html = '';
		var variable = '';
		var expression = '';

		var revalidate = false;
		var elementTagname = App.Compiler.getTagname(element)
		switch (elementTagname)
		{
			case 'input':
			{
				revalidate = true;
				var type = element.getAttribute('type') || 'text';
				switch (type)
				{
					case 'password':
					case 'hidden':
					case 'text':
					{
						variable='value';
						break;
					}
/*					case 'radio': TODO- fix me */
					case 'checkbox':
					{
						variable='checked';
						append=false;
						expression = "==true || " + valueHtml + "=='true'";
						break;
					}
					case 'button':
					case 'submit':
					{
						variable='value';
						break;
					}
				}
				break;
			}
			case 'textarea':
			{
				revalidate = true;
				variable = 'value';
				break;
			}
			case 'select':
			{
				// select is a special beast
				var code = '';
				var property = App.Wel.findParameter(params,'property');
				var row = App.Wel.findParameter(params,'row');
				var value = App.Wel.findParameter(params,'value');
				var text = App.Wel.findParameter(params,'text');
				if (!property) throw "required parameter named 'property' not found in value parameter list";
				if (!value) throw "required parameter named 'value' not found in value parameter list";
				if (!text) text = value;
				if (!append)
				{
				    element.options.length = 0;
				}
				var ar = App.Wel.getEvaluatedValue(property,(scope)?scope.data:{});
				if (ar)
				{
				    for (var c=0;c<ar.length;c++)
				    {
				        if (row)
				        {
				            var rowData = App.Util.getNestedProperty(ar[c],row);
				        }
				        else
				        {
				            var rowData = ar[c];
				        }
				        if (rowData)
				        {
				            element.options[element.options.length] = new Option(App.Util.getNestedProperty(rowData, text), App.Util.getNestedProperty(rowData, value));
				        }
				    }
				}
               swiss(element).fire('revalidate')
				return;
			}
			case 'div':
			case 'span':
			case 'p':
			case 'a':
			case 'h1':
			case 'h2':
			case 'h3':
			case 'h4':
			case 'h5':
			case 'td':
			case 'code':
			case 'li':
			case 'blockquote':
			{
				variable = 'innerHTML';
				break;
			}
			case 'img':
			case 'iframe':
			{
				append=false;
				variable = 'src';
				break;
			}
			case 'form':
			{
				//Guarantee that the form will not auto-submit when someone hits enter by adding 1 display:none text field
				var new_input_id = id+'_no_submit';
				if (!swiss('#'+new_input_id).get(0)) 
				{
					var new_input = document.createElement('input');
					new_input.id = new_input_id;
					new_input.type = 'text';
					new_input.style.display = 'none';
					new_input.name = 'no_submit_guarantee';
					element.appendChild(new_input);
				}

				//Set form to true so we clear html var below -- we delegate to subsequent calls to handleCondition
				form = true;

				//e.g. value[bar]
				var elementAction = 'value['+key+']';

				//find the matching clause (in case the form has several actions in its on expression); e.g. r:foo
				var clause = this.findMatchingFormClause(element,elementAction);

				var descendants = swiss('#'+element.id + '> * ').results;
				for (var c = 0; c < descendants.length; c++)
				{
					var child = descendants[c];
					//need an id to handle the condition later and probably need one anyway so make sure it's there
					App.Compiler.getAndEnsureId(child);
					var child_parameter;
					var tag = App.Compiler.getTagname(child);
					switch(tag)
					{
						 case 'select':
						 case 'textarea':
						 case 'input':
						 {
							  child_parameter = child.getAttribute('name') || child.id || ''
							  break;
						 }
						 default:
						 {
							  /**
							   * We don't look for an id as the value to read out on normal elements since divs, spans, etc.
							   * may have ids for styling, etc. but we do not want to overwrite text for labels etc.
							   * For divs, spans, etc. we require the name attribute if they are to be populated with data
							   * without their own explicit on expression (that is when the on expression is on a form tag).
							   */
							   child_parameter = child.getAttribute('name') || '';
						 }
					}
					
					if (child_parameter)
					{
						var action = null;
						if (tag == 'select')
						{
							action = 'selectOption['+ key + '.' + child_parameter+']';
						}
						else
						{
							action = 'value['+ key + '.' + child_parameter+']';
	
						}
						App.Wel.handleCondition.call(this, [child,true,action,scope,null,null]);

					}
				}
				break;
			}
			default:
			{
				throw "syntax error: " + element.nodeName+' not supported for value action';
			}
		}

		if (!form)
		{
			if (append)
			{
			    var val = element[variable];
			    element[variable] = val + valueHtml + expression;
			}
			else
			{
				if (elementTagname == 'input' && element.type == 'checkbox')
				{
					element[variable] = valueHtml;
				}
				else
				{
				    element[variable] = valueHtml + expression;
				}

			}
			if (revalidate)
			{
			    swiss(element).fire('revalidate');
			}
		}
	},
	findMatchingFormClause: function(element, params)
	{
		//iterate over the clauses and find the appropriate clause to return
		//(the one with the appropriate action being handled by the cal for registerCustomAction('value'))
		var clauses = App.Wel.parseExpression(element.getAttribute('on'));

		for (var i = 0; i < clauses.length; i++)
		{
			var condition = clauses[i][2];
			if (condition == params)
			{
				return clauses[i];
			}
		}
		return [];
	}
});
