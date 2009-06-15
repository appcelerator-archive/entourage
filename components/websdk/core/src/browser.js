var App = (typeof App == "undefined")?{}:App;

App.Browser = {};
App.Browser.ua = navigator.userAgent.toLowerCase();
App.Browser.isOpera = (App.Browser.ua.indexOf('opera') > -1);
App.Browser.isSafari = (App.Browser.ua.indexOf('safari') > -1);
App.Browser.isSafari2 = false;
App.Browser.isSafari3 = false;
App.Browser.isIE = !!(window.ActiveXObject);
App.Browser.isIE6 = false;
App.Browser.isIE7 = false;
App.Browser.isIE8 = false;


var idx = top.window.document.location.href.lastIndexOf('/');
if (idx == top.window.document.location.href.length - 1)
{
	App.docRoot = top.window.document.location.href;
}
else
{
  App.docRoot  = top.window.document.location.href.substr(0, idx);
   if (App.docRoot.substring(App.docRoot.length - 1) != '/')
   {
       App.docRoot  = App.docRoot + '/';
   }
}
// $('script').each(function() {
//   if(this.src.indexOf('entourage') != -1) {
//     App.docRoot = this.src.substring(0, this.src.lastIndexOf('javascript'))
//   }
// });

swiss(document).onload(function()
{
	App.Browser.initialize();
});

App.Browser.initialize = function()
{
	if (App.Browser.isIE)
	{
		var arVersion = navigator.appVersion.split("MSIE");
		var version = parseFloat(arVersion[1]);
		App.Browser.isIE6 = version >= 6.0 && version < 7;
		App.Browser.isIE7 = version >= 7.0 && version < 8;
		App.Browser.isIE8 = version >= 8.0 && version < 9;
	}

	if (App.Browser.isSafari)
	{
		var webKitFields = RegExp("( applewebkit/)([^ ]+)").exec(App.Browser.ua);
		if (webKitFields[2] > 400 && webKitFields[2] < 500)
		{
			App.Browser.isSafari2 = true;
		}
		else if (webKitFields[2] > 500 && webKitFields[2] < 600)
		{
			App.Browser.isSafari3 = true;
		}
	}

	App.Browser.isGecko = !App.Browser.isSafari && (App.Browser.ua.indexOf('gecko') > -1);
	App.Browser.isCamino = App.Browser.isGecko && App.Browser.ua.indexOf('camino') > -1;
	App.Browser.isFirefox = App.Browser.isGecko && (App.Browser.ua.indexOf('firefox') > -1 || App.Browser.isCamino || App.Browser.ua.indexOf('minefield') > -1 || App.Browser.ua.indexOf('granparadiso') > -1 || App.Browser.ua.indexOf('bonecho') > -1);
	App.Browser.isIPhone = App.Browser.isSafari && App.Browser.ua.indexOf('iphone') > -1;
	App.Browser.isMozilla = App.Browser.isGecko && App.Browser.ua.indexOf('mozilla/') > -1;
	App.Browser.isWebkit = App.Browser.isMozilla && App.Browser.ua.indexOf('applewebkit') > 0;
	App.Browser.isSeamonkey = App.Browser.isMozilla && App.Browser.ua.indexOf('seamonkey') > -1;
	App.Browser.isPrism = App.Browser.isMozilla && App.Browser.ua.indexOf('prism/') > 0;
	App.Browser.isIceweasel = App.Browser.isMozilla && App.Browser.ua.indexOf('iceweasel') > 0;
	App.Browser.isEpiphany = App.Browser.isMozilla && App.Browser.ua.indexOf('epiphany') > 0;
	App.Browser.isFluid = (window.fluid != null);
	App.Browser.isGears = (window.google && google.gears) != null;
	App.Browser.isChromium = App.Browser.isWebkit && App.Browser.ua.indexOf('chrome/') > 0;

	App.Browser.isWindows = false;
	App.Browser.isMac = false;
	App.Browser.isLinux = false;
	App.Browser.isSunOS = false;
	var platform = null;

	if(App.Browser.ua.indexOf("windows") != -1 || App.Browser.ua.indexOf("win32") != -1)
	{
	    App.Browser.isWindows = true;
		platform = 'win32';
	}
	else if(App.Browser.ua.indexOf("macintosh") != -1 || App.Browser.ua.indexOf('mac os x') != -1)
	{
		App.Browser.isMac = true;
		platform = 'mac';
	}
	else if (App.Browser.ua.indexOf('linux')!=-1)
	{
		App.Browser.isLinux = true;
		platform = 'linux';
	}
	else if (App.Browser.ua.indexOf('sunos')!=-1)
	{
		App.Browser.isSunOS = true;
		platform = 'sun';
	}

	// silverlight detection
	// thanks to http://www.nikhilk.net/Silverlight-Analytics.aspx
	App.Browser.isSilverlight = false;
	App.Browser.silverlightVersion = 0;
	swiss(window).on('load',{},function()
	{
	    var container = null;
	    try {
	        var control = null;
	        if (window.ActiveXObject) {
	            control = new ActiveXObject('AgControl.AgControl');
	        }
	        else {
	            if (navigator.plugins['Silverlight Plug-In']) {
	                /*container = document.createElement('div');
	                document.body.appendChild(container);
	                container.innerHTML= '<embed type="application/x-silverlight" src="data:," />';
	                control = container.childNodes[0];*/
	            }
	        }
	        if (control) {
	            if (control.isVersionSupported('2.0')) 
				{ 
					App.Browser.silverlightVersion = 2.0; 
				}
	            else if (control.isVersionSupported('1.0')) 
				{ 
					App.Browser.silverlightVersion = 1.0; 
				}
				App.Browser.isSilverlight = App.Browser.silverlightVersion > 0;
	        }
	    }
	    catch (e) { }
	    if (container) {
	        document.body.removeChild(container);
	    }
	});

	// flash detection
	App.Browser.isFlash = false;
	App.Browser.flashVersion = 0;
	if (App.Browser.isIE)
	{
			try
			{
				var flash = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
				var ver = flash.GetVariable("$version");
				var idx = ver.indexOf(' ');
				var tokens = ver.substring(idx+1).split(',');
				var version = tokens[0];
				App.Browser.flashVersion = parseInt(version);
				App.Browser.isFlash = true;
			}
			catch(e)
			{
				// we currently don't support lower than 7 anyway
			}
	}
	else
	{
		var plugin = navigator.plugins && navigator.plugins.length;
		if (plugin)
		{
			 plugin = navigator.plugins["Shockwave Flash"] || navigator.plugins["Shockwave Flash 2.0"];
			 if (plugin)
			 {
				if (plugin.description)
				{
					var ver = plugin.description;
					App.Browser.flashVersion = parseInt(ver.charAt(ver.indexOf('.')-1));
					App.Browser.isFlash = true;
				}			 	
				else
				{
					// not sure what version... ?
					App.Browser.flashVersion = 7;
					App.Browser.isFlash = true;
				}
			 }
		}
		else
		{
			plugin = (navigator.mimeTypes && 
		                    navigator.mimeTypes["application/x-shockwave-flash"] &&
		                    navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin) ?
		                    navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin : 0;
			if (plugin && plugin.description) 
			{
				App.Browser.isFlash = true;
		    	App.Browser.flashVersion = parseInt(plugin.description.substring(plugin.description.indexOf(".")-1));
			}
		}
	}
	App.Browser.isBrowserSupported = false;
	swiss.each(['Firefox','IE6','IE7','IE8','Safari','Camino','Opera','Webkit','Seamonkey','Prism','Iceweasel','Epiphany'],function()
	{
	    if (App.Browser['is'+this]===true)
	    {
	        App.Browser.isBrowserSupported=true;
			swiss(window).on('load',{},function()
			{
				if (platform) swiss(document.body).addClass(platform);
				swiss(document.body).addClass(name.toLowerCase());
				if (App.Browser.isMozilla)
				{
					swiss(document.body).addClass('mozilla');
				}
				if (App.Browser.isIPhone)
				{
					swiss(document.body).addClass('iphone');
					swiss(document.body).addClass('webkit');
					swiss(document.body).addClass('safari');
				}
				if (App.Browser.isChromium)
				{
					swiss(document.body).addClass('chromium');
				}
				if (App.Browser.isSafari)
				{
					swiss(document.body).addClass('webkit');
					if (App.Browser.isSafari2)
					{
						swiss(document.body).addClass('safari2');
					}
					else if (App.Browser.isSafari3)
					{
						swiss(document.body).addClass('safari3');
					}
				}
				else if (App.Browser.isGecko)
				{
					swiss(document.body).addClass('gecko');
				}
				if (App.Browser.isFirefox)
				{
					if (App.Browser.ua.indexOf('firefox/3')>0)
					{
						swiss(document.body).addClass('firefox3');
					}
					else if (App.Browser.ua.indexOf('firefox/2')>0)
					{
						swiss(document.body).addClass('firefox2');
					}
				}
				else if (App.Browser.isIE)
				{
					swiss(document.body).addClass('msie');
					if (App.Browser.isIE6)
					{
						swiss(document.body).addClass('ie6');	
					}
					else if (App.Browser.isIE7)
					{
						swiss(document.body).addClass('ie7');
					}
				}
				if (App.Browser.isIPhone)
				{
					swiss(document.body).addClass('width_narrow');
					swiss(document.body).addClass('height_short');
				}
				else
				{
					var currentHeightClass = null;
					var currentWidthClass = null;
					function calcDim()
					{
						if (currentHeightClass != null) swiss(document.body).removeClass(currentHeightClass);
						if (currentWidthClass != null) swiss(document.body).removeClass(currentWidthClass);
	                    var height = parseInt(swiss(document).height());
	                    var width = parseInt(swiss(document).width());

						if (height < 480)
						{
							swiss(document.body).addClass('height_tiny');
							currentHeightClass = 'height_tiny';
						}
						else if (height >= 480 && height <= 768)
						{
							swiss(document.body).addClass('height_small');
							currentHeightClass = 'height_small';
						}
						else if (height > 768  && height < 1100)
						{
							swiss(document.body).addClass('height_medium');
							currentHeightClass = 'height_medium';
						}
						else if (height >= 1100)
						{
							swiss(document.body).addClass('height_large');
							currentHeightClass = 'height_large';
						}
						if (width <= 640)
						{
							swiss(document.body).addClass('width_tiny');
							currentWidthClass = 'width_tiny';					
						}
						else if (width > 640 && width <= 1024)
						{
							swiss(document.body).addClass('width_small');
							currentWidthClass = 'width_small';					
						}
						else if (width > 1024 && width <=1280 )
						{
							swiss(document.body).addClass('width_medium');
							currentWidthClass = 'width_medium';					
						}
						else if (width > 1280)
						{
							swiss(document.body).addClass('width_large');
							currentWidthClass = 'width_large';					
						}
					}
					swiss(window).on('resize',{},calcDim);
					calcDim();
				}
			});
	    }
	});
	
};

