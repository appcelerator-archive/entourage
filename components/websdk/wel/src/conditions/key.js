App.Wel.registerCustomCondition(

	function(element,condition,action,elseAction,delay,ifCond)
	{	
		// capture key event and args (if any)
		var keyEvent = condition;
		var i = condition.indexOf('[');
		var args = null;
		if (i > 0)
		{
		    args = condition.substring(i+1,condition.indexOf(']'));
		    keyEvent = condition.substring(0,i);
		}
		else
		{
			keyEvent = condition;
		}

		// ensure we support this condition
	   if (keyEvent.indexOf('keypress')==-1 && keyEvent.indexOf('keyup')==-1 && keyEvent.indexOf('keydown')==-1)
	    {
	        return false;
	    }
	
		// create function that will get executed
		// when main keyEvent condition is met
		// this function will further narrow the condition as defined
		var keyFunction = function(e)
		{
			// if args then process
	        if (args)
	        {
	            var mods = args.split('+');
	            var code = mods[mods.length-1];
	           	var key = e.keyCode;
				// first process the key code
				switch (code)
	            {
	                case 'enter':
	                {
	                    if (key != 13) return;
	                    break;
	                }
	                case 'esc':
	                {
	                    if (key != 27) return;
	                    break;
	                }
	                case 'left':
	                {
	                    if (key != 37) return;
	                    break;
	                }
	                case 'right':
	                {
	                    if (key != 39) return;
	                    break;
	                }
	                case 'up':
	                {
	                    if (key != 38) return;
	                    break;
	                }
	                case 'down':
	                {
	                    if (key != 40) return;
	                    break;
	                }
	                case 'tab':
	                {
	                    if (key != 9) return;
	                    break;
	                }
	                case 'delete':
	                {
	                    if (key != 46) return;
	                    break;
	                }
	                case 'backspace':
	                {
	                    if (key != 8) return;
	                    break;
	                }
	                default:
	                {
	                    if (key != code) return;
	                    break;
	                }
	            }
	
				// now process any special key combos (if present)
	            if (mods.length > 1)
	            {
	                for (var i=0; i<(mods.length-1); i++)
	                {
	                    var mod = mods[i];
	                    switch (mod)
	                    {
	                        case 'ctrl':
	                        {
	                            if (!e.ctrlKey) return;
	                            break;
	                        }
	                        case 'alt':
	                        {
	                            if (!e.altKey) return;
	                            break;
	                        }
	                        case 'shift':
	                        {
	                            if (!e.shiftKey) return;
	                            break;
	                        }
	                        case 'meta':
	                        {
	                            if (!e.metaKey) return;
	                            break;
	                        }
	                    }
	                }
	            }
	
	        }

			// no else action support
			if (elseAction)
			{
				throw 'condition: '+ condition + ' does not support else';
				return false;
			}

			// create action function (generic)
			var actionFunc = App.Wel.makeConditionalAction(element.id,action,ifCond);
			App.Wel.executeAfter(actionFunc,delay,{id:element.id});		
			
		};

		swiss(element).on(keyEvent,{},keyFunction);
		App.Compiler.addTrash(element,function()
		{
			swiss(element).un(keyEvent)
		})
		
		return true;
	}
);

