(function(){

	App.Validator = 
	{
	    toString: function ()
	    {
	        return '[App.Validator]';
	    },

	    uniqueId: 0,
		names: [],

		addValidator: function(name, validator)
		{
			App.Validator[name] = validator;
			App.Validator.names.push(name);
		},

		URI_REGEX: /^((([hH][tT][tT][pP][sS]?|[fF][tT][pP])\:\/\/)?([\w\.\-]+(\:[\w\.\&%\$\-]+)*@)?((([^\s\(\)\<\>\\\"\.\[\]\,@;:]+)(\.[^\s\(\)\<\>\\\"\.\[\]\,@;:]+)*(\.[a-zA-Z]{2,4}))|((([01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}([01]?\d{1,2}|2[0-4]\d|25[0-5])))(\b\:(6553[0-5]|655[0-2]\d|65[0-4]\d{2}|6[0-4]\d{3}|[1-5]\d{4}|[1-9]\d{0,3}|0)\b)?((\/[^\/][\w\.\,\?\'\\\/\+&%\$#\=~_\-@]*)*[^\.\,\?\"\'\(\)\[\]!;<>{}\s\x7F-\xFF])?)$/,
	    ALPHANUM_REGEX: /^[0-9a-zA-Z]+$/,
	    DECIMAL_REGEX: /^[-]?([1-9]{1}[0-9]{0,}(\.[0-9]{0,2})?|0(\.[0-9]{0,2})?|\.[0-9]{1,2})$/,
	 	EMAIL_REGEX: /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
		PHONE_REGEX: /^(?:\([2-9]\d{2}\)\ ?|[2-9]\d{2}(?:\-?|\ ?))[2-9]\d{2}[- ]?\d{4}$/,
		SSN_REGEX: /(^|\s)(00[1-9]|0[1-9]0|0[1-9][1-9]|[1-6]\d{2}|7[0-6]\d|77[0-2])(-?|[\. ])([1-9]0|0[1-9]|[1-9][1-9])\3(\d{3}[1-9]|[1-9]\d{3}|\d[1-9]\d{2}|\d{2}[1-9]\d)($|\s|[;:,!\.\?])/,

		//
		// DATE VALIDATION UTILS
		//
		dtCh:"/",
		minYear:1000,
		maxYear:3000,
		stripCharsInBag: function(s, bag)
		{
			var i;
		    var returnString = "";
		    for (i = 0; i < s.length; i++)
			{   
		        var c = s.charAt(i);
		        if (bag.indexOf(c) == -1) returnString += c;
		    }
		    return returnString;
		},
		daysInFebruary: function (year)
		{
		    return (((year % 4 == 0) && ( (!(year % 100 == 0)) || (year % 400 == 0))) ? 29 : 28 );
		},
	 	DaysArray: function(n) 
		{
			for (var i = 1; i <= n; i++) 
			{
				this[i] = 31
				if (i==4 || i==6 || i==9 || i==11) {this[i] = 30}
				if (i==2) {this[i] = 29}
		   } 
		   return this;
		}

	};

	
	var addValidator = App.Validator.addValidator;
	
    addValidator('required', function(value)
    {
       if (null == value)
        {
            return false;
        }
        if (typeof(value) == 'boolean')
        {
            return value;
        }
		value = ''+value;
        return value.trim().length > 0;
    });

	addValidator('email_optional', function(value)
	{
		if (!value || value.trim().length == 0) return true;
		return App.Validator.EMAIL_REGEX.test(value);		
	});

    addValidator('email', function(value)
    {
        return App.Validator.EMAIL_REGEX.test(value);
    });

    addValidator('zipcode_5', function(value)
    {
      if (value.length === 5) {
        //Non-numbers can be valid zipcodes - check each char to see
        //if it is a number
        if (App.Validator.number(value.charAt(0)) &&
          App.Validator.number(value.charAt(1)) &&
          App.Validator.number(value.charAt(2)) &&
          App.Validator.number(value.charAt(3)) &&
          App.Validator.number(value.charAt(4))) {
          return true;
        }
      }
      return false;
      return (value.length == 5 && App.Validator.number(value)==true)?true:false
    });

    addValidator('zipcode_5_optional', function(value)
    {
	 	if (!value || value.trim().length == 0) return true;
        return App.Validator.zipcode_5(value);
    });

    addValidator('ssn', function(value)
    {
        return App.Validator.SSN_REGEX.test(value);
    });
    addValidator('ssn_optional', function(value)
    {
	 	if (!value || value.trim().length == 0) return true;
        return App.Validator.ssn(value);
    });

    addValidator('phone_us', function(value)
    {
        return App.Validator.PHONE_REGEX.test(value);
    });

    addValidator('phone_us_optional', function(value)
    {
	 	if (!value || value.trim().length == 0) return true;
        return App.Validator.phone_us(value);
    });

    addValidator('fullname_optional', function(value)
    {
        if (!value || value.trim().length == 0) return true;
        return App.Validator.fullname(value);
    });

    addValidator('fullname', function(value)
    {
        // allow Jeffrey George Haynie or Jeff Haynie, Jeff Smith, Jr., or Kevin Whinnery the 3rd
        // otherwise, allow any strings with spaces in between excepting numbers, except when numbers
        // are used in 2nd or 3rd.  For now, allow punctuation in names.
        var valid = true;
        var tokens = value.split(" ");
        if (tokens.length > 1) {
          while (tokens.length > 0) {
            var token = tokens.shift();
            for (var i = 0; i < token.length; i=i+1) {
              if (App.Validator.number(token.charAt(i))) {
                if (!(token === "2nd" || token === "3rd")) {
                  valid = false;
                }
              }
            }
          }
        }
        else {
          valid = false;
        }
        return valid
    });

    addValidator('noSpaces_optional', function(value)
    {
       if (!value) return true;
       return App.Validator.noSpaces(value);
    });

    addValidator('noSpaces', function(value)
    {
        // also must have a value
        // check before we check for spaces
        if (!App.Validator.required(value))
        {
            return false;
        }
        return value.indexOf(' ') == -1;
    });
 
    addValidator('password_optional', function (value)
    {
	   if (!value || value.trim().length == 0) return true;
       return App.Validator.password(value);
    });

    addValidator('password', function (value)
    {
        return (value.length >= 6);
    });

    addValidator('number', function (value)
    {
		if (!value || value.trim().length == 0 || value < 0)return false;
		return App.Validator.DECIMAL_REGEX.test(value);
		
	});

    addValidator('number_optional', function (value)
    {
		if (!value || value.trim().length == 0) return true;
		return App.Validator.number(value);
	});

    addValidator('wholenumber_optional', function (value)
    {
		if (!value || value.trim().length == 0) return true;
		return App.Validator.wholenumber(value);
	});
		
    addValidator('wholenumber', function (value)
    {
		if (!value || value < 0) return false;
		
		for (var i = 0; i < value.length; i++)
		{   
			var c = value.charAt(i);
		    if (((c < "0") || (c > "9"))) return false;
		}
		return true;
    });

    addValidator('url_optional', function (value)
    {
		if (!value || value.trim().length == 0)return true;
        return App.Validator.url(value);
    });

    addValidator('url', function (value)
    {
      	return App.Validator.URI_REGEX.test(value);
    });

    addValidator('checked', function (value)
    {
        return value;
    });

    addValidator('length', function (value, element)
    {
        if (value)
        {
            try
            {
                var min = parseInt(element.getAttribute('validatorMinLength') || '1');
                var max = parseInt(element.getAttribute('validatorMaxLength') || '999999');
                var v = value.length;
                return v >= min && v <= max;
            }
            catch (e)
            {
            }
        }
        return false;
    });
    
    addValidator('alphanumeric_optional', function (value,element)
    {
    	if (!value || value.trim().length ==0)return true;
		return App.Validator.ALPHANUM_REGEX.test(value)==true;
    });
	
    addValidator('alphanumeric', function (value,element)
    {
    	return App.Validator.ALPHANUM_REGEX.test(value)==true;
    });

	addValidator('date_optional', function(value)
	{
		if (!value || value.trim().length == 0)return true;
		return App.Validator.date(value);
		
	});
	
	addValidator('date', function(value)
	{
		
		var daysInMonth = App.Validator.DaysArray(12);
		var pos1=value.indexOf(App.Validator.dtCh);
		var pos2=value.indexOf(App.Validator.dtCh,pos1+1);
		var strMonth=value.substring(0,pos1);
		var strDay=value.substring(pos1+1,pos2);
		var strYear=value.substring(pos2+1);
		strYr=strYear;
		if (strDay.charAt(0)=="0" && strDay.length>1) 
			strDay=strDay.substring(1);
		if (strMonth.charAt(0)=="0" && strMonth.length>1) 
			strMonth=strMonth.substring(1);
		for (var i = 1; i <= 3; i++) 
		{
			if (strYr.charAt(0)=="0" && strYr.length>1) strYr=strYr.substring(1);
		}
		month=parseInt(strMonth);
		day=parseInt(strDay);
		year=parseInt(strYr);
		if (pos1==-1 || pos2==-1)
		{
			return false;
		}
		if (strMonth.length<1 || month<1 || month>12)
		{
			return false;
		}
		if (strDay.length<1 || day<1 || day>31 || (month==2 && day>App.Validator.daysInFebruary(year)) || day > daysInMonth[month])
		{
			return false;
		}
		if (strYear.length != 4 || year==0 || year<App.Validator.minYear || year>App.Validator.maxYear)
		{
			return false;
		}
		var numberTest = month + "/" + day + "/" + year;
		if (value.indexOf(App.dtCh,pos2+1)!=-1 || App.Validator.number(App.Validator.stripCharsInBag(numberTest, App.Validator.dtCh))==false)
		{
			return false;
		}
		return true;
	});
})();

