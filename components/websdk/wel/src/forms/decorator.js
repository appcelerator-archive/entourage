
(function(){
	
	App.Decorator = 
	{
	    toString: function ()
	    {
	        return '[App.Decorator]';
	    },

	    decoratorId: 0,
	    names: [],

		addDecorator: function(name, decorator)
		{
			App.Decorator[name] = decorator;
			App.Decorator.names.push(name);
		},

	    checkInvalid: function (element, valid, decId, msg, showValid)
	    {
	    	var cssValue = (valid)?'hidden':'visible';
	
			// show specified decorator ID
	    	if (decId != null)
	        {	
	 			swiss('#'+decId).css('visibility',cssValue);
	        }
			// build our own
	        else
	        {
	            var id = 'decorator_' + element.id;
	            var errorMsg = swiss('#'+id).get(0);
	            if (errorMsg == null)
	            {
					errorMsg = '<span id="'+id+'" style="color:#ff0000;margin-left:5px;margin-right:5px"></span>';
					swiss('#'+element.id).insertHTMLAfter(errorMsg)
					errorMsg = swiss('#'+id).get(0)
	            }
	            if (valid == false)
	            {
	                 errorMsg.innerHTML = '<span>' + msg + '</span>';
	            }
				swiss('#'+id).css('visibility',cssValue);

	        }
	    }	
	};

	var addDecorator = App.Decorator.addDecorator;
	
	addDecorator('defaultDecorator', function(element, valid)
	{
		// do nothing
	});
	
	addDecorator('custom', function(element, valid, decId)
	{
		if (!decId)
		{
			throw "invalid custom decorator, decoratorId attribute must be specified";
		}
		var dec = swiss('#'+decId).get(0);
		if (!dec)
		{
			throw "invalid custom decorator, decorator with ID: "+decId+" not found";
		}
		if (!valid)
		{
			if (dec.style.display=='none')
			{
				dec.style.display='block';
			}
			if (dec.style.visibility=='hidden' || dec.style.visibility == '')
			{
				dec.style.visibility='visible';
			}
		}
		else
		{
			if (dec.style.display!='none')
			{
				dec.style.display='none';
			}
			if (dec.style.visibility!='hidden')
			{
				dec.style.visibility='hidden';
			}
		}
	});
	
  
    addDecorator('required', function(element, valid, decId)
    {
        this.checkInvalid(element, valid, decId, 'required');
    });

    addDecorator('zipcode_5', function(element, valid, decId)
    {
        this.checkInvalid(element, valid, decId, '5 digit zipcode required');
    });
    addDecorator('phone_us', function(element, valid, decId)
    {
        this.checkInvalid(element, valid, decId, '10 digit phone number required (###-###-####)');
    });
    addDecorator('ssn', function(element, valid, decId)
    {
        this.checkInvalid(element, valid, decId, '9 digit ssn required (###-##-####)');
    });

    addDecorator('email', function(element, valid, decId)
    {
        this.checkInvalid(element, valid, decId, 'enter a valid email address');
    });
	addDecorator('date', function(element, valid, decId)
	{
       this.checkInvalid(element, valid, decId, 'invalid date');	
	});
	addDecorator('number', function(element, valid, decId)
	{
       this.checkInvalid(element, valid, decId, 'invalid number');			
	});
    addDecorator('fullname', function(element, valid, decId)
    {
        this.checkInvalid(element, valid, decId, 'enter first and last name');
    });

	addDecorator('alphanumeric', function(element,valid,decId)
	{
        this.checkInvalid(element, valid, decId, 'enter an alphanumeric value');
	});

    addDecorator('noSpaces', function(element, valid, decId)
    {
        this.checkInvalid(element, valid, decId, 'value must contain no spaces');
    });

    addDecorator('password', function(element, valid, decId)
    {
        this.checkInvalid(element, valid, decId, 'password must be at least 6 characters');
    });

    addDecorator('url', function (element, valid, decId)
    {
        this.checkInvalid(element, valid, decId, 'enter a valid URL');
    });

   	addDecorator('checked', function (element, valid, decId)
    {
        this.checkInvalid(element, valid, decId, 'item must be checked');
    });

  	addDecorator('wholenumber', function (element, valid, decId)
    {
        this.checkInvalid(element, valid, decId, 'enter a whole number');
    });

    addDecorator('length', function (element, valid, decId)
    {
        if (!valid)
        {
            var min = element.getAttribute('validatorMinLength') || '0';
            var max = element.getAttribute('validatorMaxLength') || '999999';
            this.checkInvalid(element, valid, decId, 'value must be between ' + min + '-' + max + ' characters');
        }
        else
        {
            this.checkInvalid(element, valid, decId, element.value.length + ' characters', true);
        }
    });
})();
