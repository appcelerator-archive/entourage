var App = (typeof App == "undefined")?{}:App;
App.Wel = {};

/////////////////////////////////////////////////////////////////
//
// Web Expression Core
//
/////////////////////////////////////////////////////////////////

/**
 * STEP 1: Parse On Attribute
 */
App.Wel.parseOnAttribute = function(element)
{
    try
    {
    	var on = element.getAttribute('on');
   		if (on && typeof on == "string")
    	{
		    if (App.Util.Logger) App.Util.Logger.debug('parseOnAttribute for ' + element.id + ' and  on=' + on);
    		App.Wel.compileExpression(element,on,false);
    		return true;
    	}
    }
	catch (ex)
	{
		App.Compiler.handleElementException(element, ex, 'compiling "on" attribute for element ' + element.id);
	}
	return false;
};

/**
 * STEP 2: Compile Expression
 */
App.Wel.compileExpression = function (element,value,notfunction)
{
	value = App.Wel.processMacros(value,element.id);
	if (!value)
	{
		App.Util.Logger.error('value returned null for '+element.id);
	}
	var clauses = App.Wel.parseExpression(value,element);
	App.Util.Logger.debug('on expression for ' + element.id + ' has ' + clauses.length + ' condition/action pairs');
	for(var i = 0; i < clauses.length; i++)
	{
		var clause = clauses[i];
        App.Util.Logger.debug('compiling expression for ' + element.id + ' => condition=[' +clause[1]+'], action=['+clause[2]+'], elseAction=['+clause[3]+'], delay=['+clause[4]+'], ifCond=['+clause[5]+']');
        clause[0] = element;
		var handled = false;
		if (clause[1] && clause[1].constructor === Array)
		{
			for (var c=0;c<clause[1].length;c++)
			{
				var cl = clause[1][c];
				var copy = [element,cl,clause[2],clause[3],clause[4],clause[5]];

		        handled = App.Wel.handleCondition.call(this, copy);
		        if (!handled)
		        {
		            throw "syntax error: unknown condition type: "+clause[1]+" for "+value;
		        }
			}
			continue;
		}
	    handled = App.Wel.handleCondition.call(this, clause);			
 
        if (!handled)
        {
            throw "syntax error: unknown condition type: "+clause[1]+" for "+value;
        }
	}
};

/**
 * STEP 3: Process Macros
 */
App.Wel.macros = {};
App.Wel.macroRE = /(#[A-Za-z0-9_-]+(\[(.*)?\])?)/;
App.Wel.processMacros = function(expression,id,scope)
{
	return expression.gsub(App.Wel.macroRE,function(match)
	{
		var expr = match[0].substring(1);
		var key = expr;
		var idx1 = key.indexOf('[');
		var idx2 = idx1 > 0 ? key.lastIndexOf(']') : -1;
		if (idx1>0 && idx2>0)
		{
			key = key.substring(0,idx1);
		}
		var template = App.Wel.macros[key];
		if (template)
		{
			scope = scope || {};

			if (idx1>0 && idx2>0)
			{
				var options = expr.substring(idx1+1,idx2);
				swiss.each(options.split(','),function()
				{
					var tok = this.split('=');
					scope[tok[0].trim()]=tok[1].trim();
				});
			}
			if (id)
			{
				var idvalue = scope['id'];
				if (typeof(idvalue) == 'undefined')
				{
					scope['id'] = id;
				}
			}
			// recursive in case you reference a macro in a macro
			return App.Wel.processMacros(template(scope),id,scope);
		}
		return match[0];
	});
};

/**
 * STEP 4: Parse Expression
 */
App.Wel.compoundCondRE = /^\((.*)?\) then$/;
App.Wel.parseExpression = function(value,element)
{
	if (!value)
	{
		return [];
	}

	if (typeof value != "string")
	{
		App.Util.Logger.error('framework error: value was '+value+' -- unexpected type: '+typeof(value));
	    throw "value: "+value+" is not a string!";
	}
	value = value.gsub('\n',' ');
	value = value.gsub('\r',' ');
	value = value.gsub('\t',' ');
	value = value.trim();

	var thens = [];
	var ors = App.Wel.smartSplit(value,' or ');
	
	for (var c=0,len=ors.length;c<len;c++)
	{
		var expression = ors[c].trim();
		var thenidx = expression.indexOf(' then ');
		if (thenidx <= 0)
		{
			// we allow widgets to have a short-hand syntax for execute
			if (App.Compiler.getTagname(element).indexOf(':'))
			{
				expression = expression + ' then execute';
				thenidx = expression.indexOf(' then ');
			}
			else
			{
				throw "syntax error: expected 'then' for expression: "+expression;
			}
		}
		var condition = expression.substring(0,thenidx);
		
		// check to see if we have compound conditions - APPSDK-597
		var testExpr = expression.substring(0,thenidx+5);
		var condMatch = App.Wel.compoundCondRE.exec(testExpr);
		if (condMatch)
		{
			var expressions = condMatch[1];
			// turn it into an array of conditions
			condition = App.Wel.smartSplit(expressions,' or ');
		}
		
		var elseAction = null;
		var nextstr = expression.substring(thenidx+6);
		var elseidx = App.Wel.smartTokenSearch(nextstr, 'else');

		var increment = 5;
		if (elseidx == -1)
		{
			elseidx = nextstr.indexOf('otherwise');
			increment = 10;
		}
		var action = null;
		if (elseidx > 0)
		{
			action = nextstr.substring(0,elseidx-1);
			elseAction = nextstr.substring(elseidx + increment);
		}
		else
		{
			action = nextstr;
		}

		var nextStr = elseAction || action;
		var ifCond = null;
		var ifIdx = nextStr.indexOf(' if expr[');

		if (ifIdx!=-1)
		{
			var ifStr = nextStr.substring(ifIdx + 9);
			var endP = ifStr.indexOf(']');
			if (endP==-1)
			{
				throw "error in if expression, missing end parenthesis at: "+action;
			}
			ifCond = ifStr.substring(0,endP);
			if (elseAction)
			{
				elseAction = nextStr.substring(0,ifIdx);
			}
			else
			{
				action = nextStr.substring(0,ifIdx);
			}
			nextStr = ifStr.substring(endP+2);
		}

		var delay = 0;
		var afterIdx =  App.Wel.smartTokenSearch(nextstr, 'after ');

		if (afterIdx!=-1)
		{
			var afterStr = nextStr.substring(afterIdx+6);
			delay = App.Util.DateTime.timeFormat(afterStr);
			if (!ifCond)
			{
				if (elseAction)
				{
					elseAction = nextStr.substring(0,afterIdx-1);
				}
				else
				{
					action = nextStr.substring(0,afterIdx-1);
				}
			}
		}

		thens.push([null,condition,action,elseAction,delay,ifCond]);
	}
	return thens;
};


/**
 * STEP 5: handle conditions
 */

App.Wel.handleCondition = function(clause)
{
    var element = clause[0];
    if (App.Util.Logger) App.Util.Logger.debug('handleCondition called for ' + element.id);

	if (clause[1] && typeof(clause[1]) == "boolean")
	{
	    var f = App.Wel.makeAction(element.id,clause[2]);
		return f.call(this,clause[3]);
	}
	
    //first loop through custom conditions defined by the widget
    for (var f=0;f<App.Wel.customElementConditions.length;f++)
    {
        var cond = App.Wel.customElementConditions[f];
        if (cond.elementid == element.id)
        {
            var condFunction = cond.condition;
            var processed = condFunction.apply(condFunction,clause);
     		if (processed)
     		{
     			return true;
     		}
        }
    }
	
	for (var f=0;f<App.Wel.customConditions.length;f++)
	{
		var condFunction = App.Wel.customConditions[f];
		var processed = condFunction.apply(condFunction,clause);
 		if (processed)
 		{
 			return true;
 		}
 	}
 	return false;
};

/**
 * Helper function for parsing
 */
App.Wel.smartSplit = function(value,splitter)
{
	value = value.trim();
	var tokens = value.split(splitter);
	if(tokens.length == 1) return tokens;
	var array = [];
	var current = null;
	for (var c=0;c<tokens.length;c++)
	{
		var line = tokens[c];
		if (!current && line.charAt(0)=='(')
		{
			current = line + ' or ';
			continue;
		}
		else if (current && current.charAt(0)=='(')
		{
			if (line.indexOf(') ')!=-1)
			{
				array.push(current+line);
				current = null;
			}
			else
			{
				current+=line + ' or ';
			}
			continue;
		}
		if (!current && line.indexOf('[')>=0 && line.indexOf(']')==-1)
		{
			if (current)
			{
				current+=splitter+line;
			}
			else
			{
				current = line;
			}
		}
		else if (current && line.indexOf(']')==-1)
		{
			current+=splitter+line;
		}
		else
		{
			if (current)
			{
				array.push(current+splitter+line)
				current=null;
			}
			else
			{
				array.push(line);
			}
		}
	}
	return array;
};
/**
 * Helper function for parsing
 */
App.Wel.smartTokenSearch = function(searchString, value)
{
	var validx = -1;
	if (searchString.indexOf('[') > -1 && searchString.indexOf(']')> -1)
	{
		var possibleValuePosition = searchString.indexOf(value);
		if (possibleValuePosition > -1)
		{
			var in_left_bracket = false;
			for (var i = possibleValuePosition; i > -1; i--)
			{
				if (searchString.charAt(i) == ']')
				{
					break;
				}
				if (searchString.charAt(i) == '[')
				{
					in_left_bracket = true;
					break;
				}
			}
			var in_right_bracket = false;
			for (var i = possibleValuePosition; i < searchString.length; i++)
			{
				if (searchString.charAt(i) == '[')
				{
					break;
				}
				if (searchString.charAt(i) == ']')
				{
					in_right_bracket = true;
					break;
				}
			}

			if (in_left_bracket && in_right_bracket)
			{
				validx = -1;
			} else
			{
				validx = searchString.indexOf(value);
			}
		} else validx = possibleValuePosition;
	}
	else
	{
		validx = searchString.indexOf(value);
	}
	return validx;
};

/*
 * Conditions trigger the execution of on expressions,
 * customConditions is a list of parsers that take the left-hand-side
 * of an on expression (before the 'then') and register event listeners
 * to be called when the condition is true.
 *
 * Parsers registered with registerCustomCondition are called in order
 * until one of them successfully parses the condition and returns true.
 */
App.Wel.customConditions = [];
App.Wel.customElementConditions = [];

App.Wel.registerCustomCondition = function(condition, elementid)
{
	if (!elementid)
	{
    	App.Wel.customConditions.push(condition);
	}
	else
	{
    	App.Wel.customElementConditions.push({elementid: elementid, condition: condition});
	}
};


App.Wel.parameterRE = /(.*?)\[(.*)?\]/i;
App.Wel.expressionRE = /^expr\((.*?)\)$/;

App.Wel.customActions = {};
App.Wel.customElementActions = {};
App.Wel.registerCustomAction = function(name,callback,element)
{
	//
	// create a wrapper that will auto-publish events for each
	// action that can be subscribed to
	//
	var action = callback;
	action.build = function(id,action,params)
	{
		return [
			'try {',
			callback.build(id,action,params),
			'; }catch(exxx){App.Compiler.handleElementException',
			'(swiss("#'+id+'"),exxx,"Executing:',action,'");}'
		].join('');

	};
	if (callback.parseParameters)
	{
		action.parseParameters = callback.parseParameters;
	}
	if (!element)
	{
    	App.Wel.customActions[name] = action;
	}
	else
	{
    	App.Wel.customElementActions[name + '_' + element.id] = action;
	}

};

App.Wel.makeConditionalAction = function(id, action, ifCond, additionalParams)
{
	var actionFunc = function(scope)
	{
	    var f = App.Wel.makeAction(id,action,additionalParams);
	    if (ifCond)
	    {
			if (typeof scope.id == "undefined")
			{
				scope.id = id;
			}
			if (App.Wel.evalWithinScope(ifCond,scope))
			{
	            f(scope);
			}
	    }
	    else
	    {
	        f(scope);
	    }
	};
	return actionFunc;
};

App.Wel.evalWithinScope = function (code, scope)
{
    if (code == '{}') return {};

	// make sure we escape any quotes given we're building a string with quotes
	var expr = code.gsub('"',"\\\"");
	
    // create the function
    var func = eval('var f = function(){return eval("(' + expr + ')")}; f;');

    // now invoke our scoped eval with scope as the this reference
    return func.call(scope);
};

/**
 * potentially delay execution of function if delay argument is specified
 *
 * @param {function} action to execute
 * @param {integer} delay value to execute in ms
 * @param {object} scope to invoke function in
 */
App.Wel.executeAfter = function(action,delay,scope)
{
	var f = (scope!=null) ? function() { action(scope); } : action;
	if (delay > 0)
	{
		setTimeout(function()
		{
			f();
		},(delay));
	}
	else
	{
		f();
	}
};

/////////////////////////////////////////////////////////////////
//
// Web Expression Macros
//
/////////////////////////////////////////////////////////////////
function $WEM(config)
{
	for (var name in config)
	{
		var value = config[name];
		if (typeof value == "string")
		{
			App.Wel.macros[name]=App.Wel.compileTemplate(value);
		}
	}
};

App.Wel.templateRE = /#\{(.*?)\}/g;
App.Wel.compileTemplate = function(html,htmlonly,varname)
{
	varname = varname==null ? 'f' : varname;

	var fn = function(m, name, format, args)
	{
		return "', jtv(values,'"+name+"','#{"+name+"}'),'";
	};
	var body = "var "+varname+" = function(values){ var jtv = App.Wel.getJsonTemplateVar; return ['" +
            html.replace(/(\r\n|\n)/g, '').replace(/\t/g,' ').replace(/'/g, "\\'").replace(App.Wel.templateRE, fn) +
            "'].join('');};" + (htmlonly?'':varname);

	var result = htmlonly ? body : eval(body);
	return result;
};

App.Wel.getJsonTemplateVar = function(namespace,var_expr,template_var)
{
    var def = {};
    var o = App.Util.getNestedProperty(namespace,var_expr,def);

    if (o == def) // wasn't found in template context
    {
        try
        {
            with(namespace) { o = eval(var_expr) };
        }
        catch (e) // couldn't be evaluated either
        {
            return template_var; // maybe a nested template replacement will catch it
        }
    }
    
    if (typeof(o) == 'object')
    {
        o = swiss.toJSON(o).replace(/"/g,'&quot;');
    }
    return o;
}

App.Wel.Template = function(template,pattern)
{
    this.template = template.toString();
    this.pattern = pattern || App.Wel.Template.Pattern;

	this.evaluate = function(object) 
	{
	  	return this.template.gsub(this.pattern, function(match) 
		{
		    if (object == null) return '';

		    var before = match[1] || '';
		    if (before == '\\') return match[2];

		    var ctx = object, expr = match[3];
		    var pattern = /^([^.[]+|\[((?:.*?[^\\])?)\])(\.|\[|$)/, match = pattern.exec(expr);
		    if (match == null) return before;

		    while (match != null) 
			{
		      var comp = match[1].startsWith('[') ? match[2].gsub('\\\\]', ']') : match[1];
		      ctx = ctx[comp];
		      if (null == ctx || '' == match[3]) break;
		      expr = expr.substring('[' == match[3] ? match[1].length : match[0].length);
		      match = pattern.exec(expr);
		    }
		    return before + (ctx==null)?'':String(ctx);
	  	});
	}
	
};
App.Wel.Template.Pattern = /(^|.|\r|\n)(#\{(.*?)\})/;
App.Wel.parameterRE = /(.*?)\[(.*)?\]/i;
App.Wel.expressionRE = /^expr\((.*?)\)$/;
App.Wel.customActions = {};
App.Wel.customElementActions = {};



/**
 * make an valid javascript function for executing the
 * action - this string must be converted to a function
 * object before executing
 *
 * @param {string} id of the element
 * @param {string} value of the action string
 * @param {object} optional parameters to pass to action
 * @return {string} action as javascript
 */
App.Wel.makeAction = function (id,value,additionalParams)
{
    var actionFuncs = [];
	var actions = App.Wel.smartSplit(value.trim(),' and ');
	for (var c=0,len=actions.length;c<len;c++)
	{
        (function()
        {
    		var actionstr = actions[c].trim();
			var wildcard = actionstr.startsWith('both:') || actionstr.startsWith('*:');
    		var remote_msg = !wildcard && actionstr.startsWith('remote:') || actionstr.startsWith('r:');
    		var local_msg = !remote_msg && (actionstr.startsWith('local:') || actionstr.startsWith('l:'));
    		var actionParams = App.Wel.parameterRE.exec(actionstr);
    		var params = actionParams!=null ? App.Wel.getParameters(actionParams[2].trim(),false) : null;
    		var action = actionParams!=null ? actionParams[1] : actionstr;
			params = params || [];
			if (additionalParams)
			{
				for (var p in additionalParams)
				{
					params.push({key:p,value:additionalParams[p]});
				}
			}
			// if a message and message broker is installed
    		if ((local_msg || remote_msg || wildcard) && App.mq)
    		{
    			var f = function(scope)
    			{
					var newparams = {};
					for (var x=0;x<params.length;x++)
					{
						var entry = params[x];
						var key = entry.key, value = entry.value;
						if (entry.keyExpression)
						{
							key = App.Wel.getEvaluatedValue(entry.key,null,scope,entry.keyExpression);
						}
						else if (entry.valueExpression)
						{
							value = App.Wel.getEvaluatedValue(entry.value,null,scope,entry.valueExpression);
						}
						else if (entry.empty)
						{
							value = App.Wel.getEvaluatedValue(entry.key,null,scope);
						}
						else
						{
							key = App.Wel.getEvaluatedValue(entry.key);
							value = App.Wel.getEvaluatedValue(entry.value,null,scope);
						}
						newparams[key]=value;
					}
    			    App.Wel.fireServiceBrokerMessage(id, action, newparams, scope);
    			}
    			actionFuncs.push({func: f, action: action});
    		}
    		else
    		{
    		    var builder = App.Wel.customElementActions[action + '_' + id];
                if (!builder)
                {
        			builder = App.Wel.customActions[action];
                }
    			if (!builder)
    			{
    				throw "syntax error: unknown action: "+action+" for "+id;
    			}
    			//
    			// see if the widget has its own parameter parsing routine
    			//
    			var f = builder.parseParameters;

    			if (f && typeof(f) == "function")
    			{
    				// this is called as a function to custom parse parameters in the action between brackets []
    				params = f(id,action,actionParams?actionParams[2]||actionstr:actionstr);
    			}
    			//
    			// delegate to our pluggable actions to make it easy
    			// to extend the action functionality
    			//
    			var f = function(scope)
    			{
					scope = scope || window;
					if (params.constructor === Array)
					{
						for (var x=0;x<params.length;x++)
						{
							var entry = params[x];
							if (entry.keyExpression)
							{
								entry.key = App.Wel.getEvaluatedValue(entry.key,scope.data,scope,entry.keyExpression);
							 	entry.keyExpression = false;
							}
							else if (entry.valueExpression)
							{
								entry.value = App.Wel.getEvaluatedValue(entry.value,scope.data,scope,entry.valueExpression);
								entry.valueExpression = false;
								if (entry.empty)
								{
									entry.key = entry.value;
								}
							}
							else if (entry.empty)
							{
								entry.value = App.Wel.getEvaluatedValue(entry.key,scope.data,scope);
							}
							else
							{
								entry.key = App.Wel.getEvaluatedValue(entry.key);
								entry.value = App.Wel.getEvaluatedValue(entry.value,scope.data,scope);
							}
						}
					}
    			    builder.execute(id, action, params, scope);
    			}
    			actionFuncs.push({func: f, action: action});
    		}
        })();
	}
    var actionFunction = function(scope)
    {
        for (var i=0; i < actionFuncs.length; i++)
        {
            actionFunc = actionFuncs[i];
            actionFunc.func(scope);
        }
    }
	return actionFunction;

};


//
// Used by Message Condition
//
App.Wel.parseConditionCondition = function(actionParams,data) 
{
	if (!App.mq)
	{
		throw 'Messaging is not installed';		
		return;
	}
    var ok = true;

    if (actionParams)
    {
    	for (var c=0,len=actionParams.length;c<len;c++)
    	{
    		var p = actionParams[c];
			if (!p.key && p.empty && p.value)
			{
				p.key = p.value;
				p.value = null;
			}

			var k = null;
			var not_cond = p.key && p.key.charAt(p.key.length-1) == '!';
			var bnot_cond = p.key && p.key.charAt(0)=='!';
			
			var negate = (not_cond || bnot_cond);
			var idref = false;
			
			if (p.key)
			{
				k = not_cond ? p.key.substring(0,p.key.length-1) : p.key;
				k = bnot_cond ? k.substring(1) : k;
				idref = k.charAt(0)=='$';
				k = (p.keyExpression || idref) ? App.Wel.getEvaluatedValue(k,data,data,p.keyExpression) : k;
			}
			
			// mathematics
			if ((p.operator == '<' || p.operator == '>') && (p.value && typeof(p.value) == 'string' && p.value.charAt(0)=='='))
			{
				p.operator += '=';
				p.value = p.value.substring(1);
			}

			var v = p.operator ? App.Wel.getEvaluatedValue(k,data,data,p.valueExpression) : p.value ? App.Wel.getEvaluatedValue(p.value,data,data,p.valueExpression) : null;
			
			// regular expression
			if (p.value && typeof p.value == 'string' && p.value.charAt(0)=='~')
			{
				p.regex = true;
				p.value = p.value.substring(1);
			}
			
			// added x to eval $args
			var x = typeof p.value !='undefined' ? App.Wel.getEvaluatedValue(p.value,data) : null;
			var matched = p.keyExpression ? k : p.valueExpression ? (v || k) : idref ? (k && String(k).charAt(0)!='$') : App.Util.getNestedProperty(data,k);
			// we need to convert to boolean because 0 is a valid value but will set matched to false if you just check matched
			matched = typeof(matched) == 'boolean' ? matched : typeof matched != 'undefined';
			if (matched != 'undefined')
			{
				switch(p.operator)
				{
					case '<':
					{
						ok = v < x;
						break;
					}
					case '>':
					{
						ok = v > x;
						break;
					}
					case '<=':
					{
						ok = v <= x;
						break;
					}
					case '>=':
					{
						ok = v >= x;
						break;
					}
					default:
					{
						if (p.regex)
						{
							var r = new RegExp(x);
							ok = r.test(v);
						}
						else
						{
							// NWW:changed during port - wasn't working properly
							if (p.valueExpression == true)
							{
								ok = v;
							}
							else
							{
								ok = p.empty ? matched:v==x
							}
							//ok = p.empty ? matched : (p.valueExpression && p.valueExpression ==true) ? v : v==x;
							//ok = (p.valueExpression && p.valueExpression ==true) ? v : v==x;
						}
						break;
					}
				}
			}
			else
			{
				ok = false;
			}
			ok = negate ? !ok : ok;
			
			if (!ok) break;
    	}
    }
    return ok;
};


//
// helper for firing service broker
//
App.Wel.fireServiceBrokerMessage = function (id, type, args, scopedata)
{
	if (!App.mq)
	{
		throw 'Messaging is not installed';		
		return;
	}
		
 	var data = args || {};
	var element = swiss('#'+id).get(0);
	var fieldset = null;

	if (element)
	{
		fieldset = element.getAttribute('fieldset');
	}
	
	for (var p in data)
	{
		var entry = data[p];
		data[p] = App.Wel.getEvaluatedValue(entry,data,scopedata);
	}

	var localMode = type.startsWith('local:') || type.startsWith('l:');

	if (fieldset && App.fetchFieldset)
	{
           App.fetchFieldset(fieldset, localMode, data);
	}

	if (localMode)
	{
		if (data['id'] == null)
		{
        	data['id'] = id;
		}

	    if (data['element'] == null)
        {
        	data['element'] = swiss('#'+data['id']).get(0);
        }
	}
	$MQ({name:type,payload:data});
};

//
// Helper to find parameter values for WEL
//
App.Wel.findParameter = function(params,key)
{
	if (params)
	{
		if (params[key])
		{
			return params[key];
		}
		else
		{
			if (params.length > 0)
			{
				for (var c=0;c<params.length;c++)
				{
					var obj = params[c];
					if (obj.key == key)
					{
						return obj.value;
					}
				}
			}
		}
	}
	return null;
}

App.Wel.CSSAttributes =
[
	'color',
	'cursor',
	'font',
	'font-family',
	'font-weight',
	'border',
	'border-right',
	'border-bottom',
	'border-left',
	'border-top',
	'border-color',
	'border-style',
	'border-width',
	'background',
	'background-color',
	'background-attachment',
	'background-position',
	'position',
	'display',
	'visibility',
	'overflow',
	'opacity',
	'filter',
	'float',
	'top',
	'left',
	'right',
	'bottom',
	'width',
	'height',
	'margin',
	'margin-left',
	'margin-right',
	'margin-bottom',
	'margin-top',
	'padding',
	'padding-left',
	'padding-right',
	'padding-bottom',
	'padding-top'
];

App.Wel.isCSSAttribute = function (name)
{
	if (name == 'style') return true;

	for (var c=0,len=App.Wel.CSSAttributes.length;c<len;c++)
	{
		if (App.Wel.CSSAttributes[c] == name)
		{
			return true;
		}

		var css = App.Wel.CSSAttributes[c];
		var index = css.indexOf('-');
		if (index > 0)
		{
			var converted = css.substring(0,index) + css.substring(index+1).capitalize();
			if (converted == name)
			{
				return true;
			}
		}
	}
	return false;
};

App.Wel.convertCSSAttribute = function (css)
{
	var index = css.indexOf('-');
	if (index > 0)
	{
		var converted = css.substring(0,index) + css.substring(index+1).charAt(0).toUpperCase() + css.substring(index+2);
		return converted;
	}
	return css;
}

App.Wel.findTarget = function(id,params)
{
	var target = id;
	if (params && params.length > 0)
	{
		for (var c=0;c<params.length;c++)
		{
			var entry = params[c];
			if (entry.key == 'id')
			{
				target = entry.value;
				break;
			}
		}
	}
	return target;
};

App.Wel.getEvaluatedValue = function(v,data,scope,isExpression)
{
	if (v && typeof(v) == 'string')
	{
		if (!isExpression && v.charAt(0)=='$')
		{
			var varName = v.substring(1);
			var elem = swiss('#'+varName).get(0);
			if (elem)
			{
				// dynamically substitute the value
				return App.Util.getElementValue(elem,true);
			}
		}
        else if(!isExpression && !isNaN(parseFloat(v)))
        {
            //Assume that if they provided a number, they want the number back
            //this is important because in IE window[1] returns the first iframe
            return v;
        }
		else
		{
			// determine if this is a dynamic javascript
			// expression that needs to be executed on-the-fly
			var match = isExpression || App.Wel.expressionRE.exec(v);
			if (match)
			{
				var expr = isExpression ? v : match[1];
				var func = expr.toFunction();
				//var s = scope ? swiss.extend(scope) : {};
				var s = scope ? scope : {};
				if (data)
				{
					for (var k in data)
					{
						if (typeof k == "string")
						{
							s[k] = data[k];
						}
					}
				}
				return func.call(s);
			}

			if (scope)
			{
				var result = App.Util.getNestedProperty(scope,v,null);
				if (result)
				{
					return result;
				}
			}

			if (data)
			{
				return App.Util.getNestedProperty(data,v,v);
			}
		}
	}
	return v;
};

App.Wel.dequote = function(value)
{
	if (value && typeof value == 'string')
	{
		if (value.charAt(0)=="'" || value.charAt(0)=='"')
		{
			value = value.substring(1);
		}
		if (value.charAt(value.length-1)=="'" || value.charAt(value.length-1)=='"')
		{
			value = value.substring(0,value.length-1);
		}
	}
	return value;
};

App.Wel.convertInt = function(value)
{
	if (value.charAt(0)=='0')
	{
		if (value.length==1)
		{
			return 0;
		}
		return App.Wel.convertInt(value.substring(1));
	}
	return parseInt(value);
};

App.Wel.convertFloat = function(value)
{
	return parseFloat(value);
}

App.Wel.numberRe = /^[-+]{0,1}[0-9]+$/;
App.Wel.floatRe = /^[0-9]*[\.][0-9]*[f]{0,1}$/;
App.Wel.booleanRe = /^(true|false)$/;
App.Wel.quotedRe =/^['"]{1}|['"]{1}$/;
App.Wel.jsonRe = /^\{(.*)?\}$/;

var STATE_LOOKING_FOR_VARIABLE_BEGIN = 0;
var STATE_LOOKING_FOR_VARIABLE_END = 1;
var STATE_LOOKING_FOR_VARIABLE_VALUE_MARKER = 2;
var STATE_LOOKING_FOR_VALUE_BEGIN = 3;
var STATE_LOOKING_FOR_VALUE_END = 4;
var STATE_LOOKING_FOR_VALUE_AS_JSON_END = 5;

App.Wel.decodeParameterValue = function(token,wasquoted)
{
	var value = null;
	if (token!=null && token.length > 0 && !wasquoted)
	{
		var match = App.Wel.jsonRe.exec(token);
		if (match)
		{
			value = String(match[0]).evalJSON();
		}
		if (!value)
		{
			var quoted = App.Wel.quotedRe.test(token);
			if (quoted)
			{
				value = App.Wel.dequote(token);
			}
			else if (App.Wel.floatRe.test(token))
			{
				value = App.Wel.convertFloat(token);
			}
			else if (App.Wel.numberRe.test(token))
			{
				value = App.Wel.convertInt(token);
			}
			else if (App.Wel.booleanRe.test(token))
			{
				value = (token == 'true');
			}
			else
			{
				value = token;
			}
		}
	}
	if (token == 'null' || value == 'null')
	{
		return null;
	}
	return value == null ? token : value;
};

App.Wel.parameterSeparatorRE = /[\$=:><!]+/;

/**
 * method will parse out a loosely typed json like structure
 * into either an array of json objects or a json object
 *
 * @param {string} string of parameters to parse
 * @param {boolean} asjson return it as json object
 * @return {object} value
 */
App.Wel.getParameters = function(str,asjson)
{
	if (str==null || str.length == 0)
	{
		return asjson ? {} : [];
	}
		
	var exprRE = /expr\((.*?)\)/;
	var containsExpr = exprRE.test(str);
	
	// this is just a simple optimization to 
	// check and make sure we have at least a key/value
	// separator character before we continue with this
	// inefficient parser
	if (!App.Wel.parameterSeparatorRE.test(str) && !containsExpr)
	{
		if (asjson)
		{
			var valueless_key = {};
			valueless_key[str] = '';
			return valueless_key;
		}
		else
		{
			return [{key:str,value:'',empty:true}];
		}
	}
	var state = 0;
	var currentstr = '';
	var key = null;
	var data = asjson ? {} : [];
	var quotedStart = false, tickStart = false;
	var operator = null;
	var expressions = containsExpr ? {} : null;
	if (containsExpr)
	{
		var expressionExtractor = function(e)
		{
			var start = e.indexOf('expr(');
			if (start < 0) return null;
			var p = start + 5;
			var end = e.length-1;
			var value = '';
			while ( true )
			{
				var idx = e.indexOf(')',p);
				if (idx < 0) break;
				value+=e.substring(p,idx);
				if (idx == e.length-1)
				{
					end = idx+1;
					break;
				}
				var b = false;
				var x = idx + 1;
				for (;x<e.length;x++)
				{
					switch(e.charAt(x))
					{
						case ',':
						{
							end = x;
							b = true;
							break;
						}
						case ' ':
						{
							break;
						}
						default:
						{
							p = idx+1;
							break;
						}
					}
				}
				if (x==e.length-1)
				{
					end = x;
					break;
				}
				if (b) break;
				value+=')';
			}
			var fullexpr = e.substring(start,end);
			return [fullexpr,value];
		};
		
		var ec = 0;
		while(true)
		{
			var m = expressionExtractor(str);
			if (!m)
			{
				break;
			}
			var k = '__E__'+(ec++);
			expressions[k] = m[1];
			str = str.replace(m[0],k);
		}
	}
	
	function transformValue(k,v,tick)
	{
		if (k && k.startsWith('__E__'))
		{
			if (!asjson)
			{
				return {key:expressions[k],value:v,keyExpression:true,valueExpression:false};
			}
			else
			{
				return expressions[k];
			}
		}
		if (v && v.startsWith('__E__'))
		{
			if (!asjson)
			{
				return {key:k,value:expressions[v],valueExpression:true,keyExpression:false};
			}
			else
			{
				return expressions[v];
			}
		}
		var s = App.Wel.decodeParameterValue(v,tick);
		if (!asjson)
		{
			return {key:k,value:s};
		}
		return s;
	}
	
	for (var c=0,len=str.length;c<len;c++)
	{
		var ch = str.charAt(c);
		var append = true;
		
		switch (ch)
		{
			case '"':
			case "'":
			{
				switch (state)
				{
					case STATE_LOOKING_FOR_VARIABLE_BEGIN:
					{
						quoted = true;
						append = false;
						state = STATE_LOOKING_FOR_VARIABLE_END;
						quotedStart = ch == '"';
						tickStart = ch=="'";
						break;
					}
					case STATE_LOOKING_FOR_VARIABLE_END:
					{
						var previous = str.charAt(c-1);
						if (quotedStart && ch=="'" || tickStart && ch=='"')
						{
							// these are OK inline
						}
						else if (previous != '\\')
						{
							state = STATE_LOOKING_FOR_VARIABLE_VALUE_MARKER;
							append = false;
							key = currentstr.trim();
							currentstr = '';
						}
						break;
					}
					case STATE_LOOKING_FOR_VALUE_BEGIN:
					{
						append = false;
						quotedStart = ch == '"';
						tickStart = ch=="'";
						state = STATE_LOOKING_FOR_VALUE_END;
						break;
					}
					case STATE_LOOKING_FOR_VALUE_END:
					{
						var previous = str.charAt(c-1);
						if (quotedStart && ch=="'" || tickStart && ch=='"')
						{
							// these are OK inline
						}
						else if (previous != '\\')
						{
							state = STATE_LOOKING_FOR_VARIABLE_BEGIN;
							append = false;
							if (asjson)
							{
								data[key]=transformValue(key,currentstr,quotedStart||tickStart);
							}
							else
							{
								data.push(transformValue(key,currentstr,quotedStart||tickStart));
							}
							key = null;
							quotedStart = false, tickStart = false;
							currentstr = '';
						}
						break;
					}
				}
				break;
			}
			case '>':
			case '<':
			case '=':
			case ':':
			{
				if (state == STATE_LOOKING_FOR_VARIABLE_END)
				{
					if (ch == '<' || ch == '>')
					{
						key = currentstr.trim();
						currentstr = '';
						state = STATE_LOOKING_FOR_VARIABLE_VALUE_MARKER;
					}
				}
				switch (state)
				{
					case STATE_LOOKING_FOR_VARIABLE_END:
					{
						append = false;
						state = STATE_LOOKING_FOR_VALUE_BEGIN;
						key = currentstr.trim();
						currentstr = '';
						operator = ch;
						break;
					}
					case STATE_LOOKING_FOR_VARIABLE_VALUE_MARKER:
					{
						append = false;
						state = STATE_LOOKING_FOR_VALUE_BEGIN;
						operator = ch;
						break;
					}
				}
				break;
			}
			case ',':
			{
				switch (state)
				{
					case STATE_LOOKING_FOR_VARIABLE_BEGIN:
					{
						append = false;
						state = STATE_LOOKING_FOR_VARIABLE_BEGIN;
						break;
					}
					case STATE_LOOKING_FOR_VARIABLE_END:
					{
						// we got to the end (single parameter with no value)
						state=STATE_LOOKING_FOR_VARIABLE_BEGIN;
						append=false;
						if (asjson)
						{
							data[currentstr]=null;
						}
						else
						{
							var entry = transformValue(key,currentstr);
							entry.operator = operator;
							entry.key = entry.value;
							entry.empty = true;
							data.push(entry);
						}
						key = null;
						quotedStart = false, tickStart = false;
						currentstr = '';
						break;
					}
					case STATE_LOOKING_FOR_VALUE_END:
					{
						if (!quotedStart && !tickStart)
						{
							state = STATE_LOOKING_FOR_VARIABLE_BEGIN;
							append = false;
							if (asjson)
							{
								data[key]=transformValue(key,currentstr,quotedStart||tickStart);
							}
							else
							{
								var entry = transformValue(key,currentstr);
								entry.operator = operator;
								data.push(entry);
							}
							key = null;
							quotedStart = false, tickStart = false;
							currentstr = '';
						}
						break;
					}
				}
				break;
			}
			case ' ':
			{
			    break;
			}
			case '\n':
			case '\t':
			case '\r':
			{
				append = false;
				break;
			}
			case '{':
			{
				switch (state)
				{
					case STATE_LOOKING_FOR_VALUE_BEGIN:
					{
						state = STATE_LOOKING_FOR_VALUE_AS_JSON_END;
					}
				}
				break;
			}
			case '}':
			{
				if (state == STATE_LOOKING_FOR_VALUE_AS_JSON_END)
				{
					state = STATE_LOOKING_FOR_VARIABLE_BEGIN;
					append = false;
					currentstr+='}';
					if (asjson)
					{
						data[key]=transformValue(key,currentstr,quotedStart||tickStart);
					}
					else
					{
						var entry = transformValue(key,currentstr);
						entry.operator = operator;
						data.push(entry);
					}
					key = null;
					quotedStart = false, tickStart = false;
					currentstr = '';
				}
				break;
			}
			default:
			{
				switch (state)
				{
					case STATE_LOOKING_FOR_VARIABLE_BEGIN:
					{
						state = STATE_LOOKING_FOR_VARIABLE_END;
						break;
					}
					case STATE_LOOKING_FOR_VALUE_BEGIN:
					{
						state = STATE_LOOKING_FOR_VALUE_END;
						break;
					}
				}
			}
		}
		if (append)
		{
			currentstr+=ch;
		}
		if (c + 1 == len && key)
		{
			//at the end
			currentstr = currentstr.strip();
			if (asjson)
			{
				data[key]=transformValue(key,currentstr,quotedStart||tickStart);
			}
			else
			{
				var entry = transformValue(key,currentstr);
				entry.operator = operator;
				data.push(entry);
			}
		}
	}

	if (currentstr && !key)
	{
		if (asjson)
		{
			data[key]=null;
		}
		else
		{
			var entry = transformValue(key,currentstr);
			entry.empty = true;
			entry.key = entry.value;
			entry.operator = operator;
			data.push(entry);
		}
	}
	return data;
};
App.Wel.getHtml = function (element,convertHtmlPrefix)
{
	convertHtmlPrefix = (convertHtmlPrefix==null) ? true : convertHtmlPrefix;

	var html = element.innerHTML || App.Util.Dom.getText(element);

	// convert funky url-encoded parameters escaped
	if (html.indexOf('#%7B')!=-1)
	{
	   html = html.gsub('#%7B','#{').gsub('%7D','}');
    }

	// IE/Opera unescape XML in innerHTML, need to escape it back
	html = html.gsub(/\\\"/,'&quot;');
	return html;

};

