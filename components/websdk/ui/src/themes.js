/////////////////////////////////////////////////////////////////////////
//
// Theme Functions
//
////////////////////////////////////////////////////////////////////////

App.UI.themes = {};
App.UI.thirdPartyJS = {};

//
//  Default Themes by Control
//
App.UI.defaultThemes = 
{
	'panel':'basic',
	'shadow':'basic',
	'button':'white_gradient',
	'input':'white_gradient',
	'textarea':'white_gradient',
	'select':'thinline',
	'tabpanel':'white',
	'accordion':'basic'
};

//
// Get a default theme for a control
//
App.UI.getDefaultTheme = function(type)
{
	return App.UI.defaultThemes[type];
};

//
// Set a default theme for a control
//
App.UI.setDefaultThemes = function(type,theme)
{
	App.UI.defaultThemes[type] = theme;
};

//
// Register a theme handler
//
App.UI.registerTheme = function(type,container,theme,impl)
{
	var key = App.UI.getThemeKey(type,container,theme);
	var themeImpl = App.UI.themes[key];
	if (!themeImpl)
	{
		themeImpl = {};
		App.UI.themes[key] = themeImpl;
	}
	themeImpl.impl = impl;
	themeImpl.loaded = true;
	// trigger on registration any pending guys
	App.UI.loadTheme(type,container,theme,null,null);
};

//
// Contruct a theme key
//
App.UI.getThemeKey = function(pkg,container,theme)
{
	return pkg + ':' + container + ':' + theme;
};

//
// Dynamically load a theme file
//
App.UI.loadTheme = function(pkg,container,theme,element,options)
{
	theme = theme || App.UI.getDefaultTheme(container);
	var key = App.UI.getThemeKey(pkg,container,theme);
	var themeImpl = App.UI.themes[key];
	var fetch = false;
	var path = App.docRoot + App.UI.componentRoot + pkg + 's/' + container + '/themes/' +theme;

	if (!themeImpl)
	{
		themeImpl = { callbacks: [], impl: null, loaded: false, path: path };
		App.UI.themes[key] = themeImpl;
		fetch = true;
	}
	
	if (themeImpl.loaded)
	{
		if (themeImpl.callbacks && themeImpl.callbacks.length > 0 && themeImpl.impl && themeImpl.impl.build)
		{
			for (var c=0;c<themeImpl.callbacks.length;c++)
			{
				var callback = themeImpl.callbacks[c];
				themeImpl.impl.build(callback.element,callback.options);
			}
		}
		if (element!=null && options!=null && themeImpl.impl && themeImpl.impl.build)
		{
			if (themeImpl.impl.setPath)
			{
				themeImpl.impl.setPath.call(themeImpl.impl,path);
			}
			themeImpl.impl.build(element,options);
		}
		themeImpl.callbacks = null;
	}
	else
	{
		themeImpl.callbacks.push({element:element,options:options});
	}
	
	if (fetch)
	{
		var css_path =  path + '/' +theme+  '.css';
		App.UI.remoteLoadCSS(css_path);

		// var js_path = path + '/' +theme+  '.js';
		// App.UI.remoteLoadScript(js_path,null,function()
		// {
		// 	App.UI.handleLoadError(element,pkg,theme,container,js_path);
		// });
	}
};

