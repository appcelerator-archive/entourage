var App = (typeof App == "undefined")?{}:App;
App.Util = {};

App.Util.DateTime =
{
    ONE_SECOND:1000,
    ONE_MINUTE: 60000,
    ONE_HOUR: 3600000,
    ONE_DAY: 86400000,
    ONE_WEEK: 604800000,
    ONE_MONTH: 18748800000, // this is rough an assumes 31 days
    ONE_YEAR: 31536000000,

	/**
	 * Convert a duration from the format: "2y 3w 5d 27m 13s" into milliseconds
	 */
	timeFormat: function (value)
	{
		var str = '';
		var time = 0;

		for (var c=0,len=value.length;c<len;c++)
		{
			var ch = value.charAt(c);
			switch (ch)
			{
				case ',':
				case ' ':
				{
					str = '';
					break;
				}
				case 'm':
				{
					if (c + 1 < len)
					{
						var nextch = value.charAt(c+1);
						if (nextch == 's')
						{
							time+=parseInt(str);
							c++;
						}
					}
					else
					{
						time+=parseInt(str) * this.ONE_MINUTE;
					}
					str = '';
					break;
				}
				case 's':
				{
					time+=parseInt(str) * this.ONE_SECOND;
					str = '';
					break;
				}
				case 'h':
				{
					time+=parseInt(str) * this.ONE_HOUR;
					str = '';
					break;
				}
				case 'd':
				{
					time+=parseInt(str) * this.ONE_DAY;
					str = '';
					break;
				}
				case 'w':
				{
					time+=parseInt(str) * this.ONE_WEEK;
					str = '';
					break;
				}
				case 'y':
				{
					time+=parseInt(str) * this.ONE_YEAR;
					str = '';
					break;
				}
				default:
				{
					str+=ch;
					break;
				}
			}
		}

		if (str.length > 0)
		{
			time+=parseInt(str);
		}

		return time;
	}

};

App.Util.getNestedProperty = function (obj, prop, def)
{
    if (obj!=null && prop!=null)
    {
        var props = prop.split('.');
        if (props.length != -1)
        {
	        var cur = obj;
	        swiss.each(props,function(p)
	        {
	            if (cur != null && null != cur[this])
	            {
	                cur = cur[this];
	            }
	            else
	            {
	                cur = null;
	                return def;
	            }
	        });
	        return cur == null ? def : cur;
	     }
	     else
	     {
	     	  return obj[prop] == null ? def : obj[prop];
	     }
    }
    return def;
};
/**
 * return the elements value depending on the type of
 * element it is
 */
App.Util.getElementValue = function (element)
{
	switch (App.Compiler.getTagname(element))
    {
        case 'select':
        {
            if(swiss(element).attr('multiple') == 'true')
            {
                var selected = [];
                var options = element.options;
                var optionsLen = options.length;
                for(var i = 0; i < optionsLen; i++)
                {
                    if(options[i].selected)
                    {
                        selected.push(options[i].value);
                    }
                }
                return selected;
            }
			else
			{
				return element.options[element.selectedIndex].value;
			}
        }
        case 'img':
        case 'iframe':
        {
            return element.src;
        }
		case 'input':
		case 'textarea':
		{
			if (element.type == 'checkbox')
			{
				return element.checked
			}
			return element.value;
		}
		default:
		{
			return element.innerHTML;
		}
 	}
};
App.Util.Logger = {};
App.Util.Logger.debugEnabled = (window.location.href.indexOf('debug=1') > 0)?true:false;

App.Util.Logger.info = function(msg)
{
	if (App.Browser.isIE)return;
	if (window.console)
	{
	  if(console.info)
 			console.info(msg)
	  else if (console)
			console.log(msg)
	}
};
App.Util.Logger.warn = function(msg)
{
	if (App.Browser.isIE)return;
	if (window.console)
	{
	 	if (console.warn)
   			console.warn(msg)
		else if (console)
			console.log(msg)
	}
};
App.Util.Logger.debug = function(msg)
{
	if (App.Browser.isIE)return;
	if (App.Util.Logger.debugEnabled == true)
	{
		if (window.console)
		{
			if (window.console.debug)
	   			window.console.debug(msg)
			else
				console.log(msg)		
		}
	}
};
App.Util.Logger.error = function(msg)
{
	if (App.Browser.isIE)return;
	if (window.console)
	{
		if (console.error)
   			console.error(msg)
		else
			console.log(msg)
	}
};


App.Util.IFrame = 
{
  fetch: function(src,onload,removeOnLoad,copyContent) {
    setTimeout(function() {
      copyContent = (copyContent==null) ? false : copyContent;
      var frameid = 'frame_'+new Date().getTime()+'_'+Math.round(Math.random() * 99);
      var frame = document.createElement('iframe');
      App.Compiler.setElementId(frame, frameid);
      //This prevents Firefox 1.5 from getting stuck while trying to get the contents of the new iframe
      if(!App.Browser.isFirefox) {
        frame.setAttribute('name', frameid);
      }
      frame.setAttribute('src', src);
      frame.style.position = 'absolute';
      frame.style.width = frame.style.height = frame.borderWidth = '1px';
      // in Opera and Safari you'll need to actually show it or the frame won't load
      // so we just put it off screen
      frame.style.left = "-50px";
      frame.style.top = "-50px";
      var iframe = document.body.appendChild(frame);

      // this is a IE speciality
      if (window.frames && window.frames[frameid]) {
        iframe = window.frames[frameid];
      }
      iframe.name = frameid;
      var scope = {iframe:iframe,frameid:frameid,onload:onload,removeOnLoad:(removeOnLoad==null)?true:removeOnLoad,src:src,copyContent:copyContent};
      if (App.Browser.isFirefox == false) {
        setTimeout(function(){App.Util.IFrame.checkIFrame.apply(scope)},50);
      } else {
        iframe.onload = function(){App.Util.IFrame.doIFrameLoad.apply(scope)};
      }
   },0);
  },
  doIFrameLoad: function() {
    var doc = this.iframe.contentDocument || this.iframe.document;
    var body = doc.documentElement.getElementsByTagName('body')[0];
    
    if (App.Browser.isSafari && App.Browser.isWindows && body.childNodes.length == 0) {
      App.Util.IFrame.fetch(this.src, this.onload, this.removeOnLoad);
      return;
    }
    if (this.copyContent) {
      var div = document.createElement('div');
      App.Util.IFrame.loadStyles(doc.documentElement);
      var bodydiv = document.createElement('div');
      bodydiv.innerHTML = body.innerHTML;
      div.appendChild(bodydiv);
      this.onload(div);
    } else {
      this.onload(body);
    }
    if (this.removeOnLoad) {
			var f = swiss('#'+this.frameid).get(0);
      if (App.Browser.isFirefox) {
        // firefox won't stop spinning with Loading... message
        // if you remove right away
        setTimeout(function(){f.parentNode.removeChild(f)},50);
      } else {
        f.parentNode.removeChild(f);
      }
    }
  },
  checkIFrame:function()
  {
    var doc = this.iframe.contentDocument || this.iframe.document;
    var dr = doc.readyState;
    if (dr == 'complete' || (!document.getElementById && dr == 'interactive')) {
      App.Util.IFrame.doIFrameLoad.apply(this);
    } else {
      var scope = {iframe:this.iframe,frameid:this.frameid,onload:this.onload,removeOnLoad:(this.removeOnLoad==null)?true:this.removeOnLoad,src:this.src,copyContent:this.copyContent};
      setTimeout(function(){App.Util.IFrame.checkIFrame.apply(this)},50);
    }
  },
  loadStyles:function(element)
  {
    for (var i = 0; i < element.childNodes.length; i++) {
      var node = element.childNodes[i];
 
      if (node.nodeName == 'STYLE') {
        if (App.Browser.isIE) {
          var style = document.createStyleSheet();
          style.cssText = node.styleSheet.cssText;
        } else {
          var style = document.createElement('style');
          style.setAttribute('type', 'text/css');
          try {
            style.appendChild(document.createTextNode(node.innerHTML));
          } catch (e) {
            style.cssText = node.innerHTML;
          }        
          App.Core.HeadElement.appendChild(style);
        }
      } else if (node.nodeName == 'LINK') {
        var link = document.createElement('link');
        link.setAttribute('type', node.type);
        link.setAttribute('rel', node.rel);
        link.setAttribute('href', node.getAttribute('href'));
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      App.Util.IFrame.loadStyles(node);
    }
  }
};

/**
 * DOM utils
 */
App.Util.Dom =
{
    ELEMENT_NODE: 1,
    ATTRIBUTE_NODE: 2,
    TEXT_NODE: 3,
    CDATA_SECTION_NODE: 4,
    ENTITY_REFERENCE_NODE: 5,
    ENTITY_NODE: 6,
    PROCESSING_INSTRUCTION_NODE: 7,
    COMMENT_NODE: 8,
    DOCUMENT_NODE: 9,
    DOCUMENT_TYPE_NODE: 10,
    DOCUMENT_FRAGMENT_NODE: 11,
    NOTATION_NODE: 12,

	/**
	 * iterator for node attributes
	 * pass in an iterator function and optional specified (was explicit
	 * placed on node or only inherited via #implied)
	 */
    eachAttribute: function (node, iterator, excludes, specified)
    {
        specified = specified == null ? true : specified;
        excludes = excludes || [];

        if (node.attributes)
        {
            var map = node.attributes;
            for (var c = 0,len = map.length; c < len; c++)
            {
                var item = map[c];
                if (item && item.value != null && specified == item.specified)
                {
                    var type = typeof(item);
                    if (item.value.startsWith('function()'))
                    {
                       continue;
                    }
                    if (type == 'function' || type == 'native' || item.name.match(/_moz\-/) ) continue;
                	if (excludes.length > 0)
                	{
                	  	  var cont = false;
                	  	  for (var i=0,l=excludes.length;i<l;i++)
                	  	  {
                	  	  	  if (excludes[i]==item.name)
                	  	  	  {
                	  	  	  	  cont = true;
                	  	  	  	  break;
                	  	  	  }
                	  	  }
                	  	  if (cont) continue;
                	}
                    iterator(item.name, item.value, item.specified, c, map.length);
                }
            }
            return c > 0;
        }
        return false;
    },

    getTagAttribute: function (element, tagname, key, def)
    {
        try
        {
            var attribute = element.getElementsByTagName(tagname)[0].getAttribute(key);
            if (null != attribute)
            {
                return attribute;
            }
        }
        catch (e)
        {
            //squash...
        }

        return def;
    },

    each: function(nodelist, nodeType, func)
    {
        if (typeof(nodelist) == "array")
        {
            nodelist.each(function(n)
            {
                if (n.nodeType == nodeType)
                {
                    func(n);
                }
            });
        }
        //Safari returns "function" as the NodeList object from a DOM
        else if (typeof(nodelist) == "object" || typeof(nodelist) == "function" && navigator.userAgent.match(/WebKit/i))
        {
            for (var p = 0, len = nodelist.length; p < len; p++)
            {
                var obj = nodelist[p];
                if (typeof obj.nodeType != "undefined" && obj.nodeType == nodeType)
                {
                    try
                    {
                        func(obj);
                    }
                    catch(e)
                    {
                        if (e == $break)
                        {
                            break;
                        }
                        else if (e != $continue)
                        {
                            throw e;
                        }
                    }
                }
            }
        }
        else
        {
            throw ("unsupported dom nodelist type: " + typeof(nodelist));
        }
    },

	/**
 	 * return the text value of a node as XML
 	 */
    getText: function (n,skipHTMLStyles,visitor,addbreaks,skipcomments)
    {
		var text = [];
        var children = n.childNodes;
        var len = children ? children.length : 0;
        for (var c = 0; c < len; c++)
        {
            var child = children[c];
            if (visitor)
            {
            	child = visitor(child);
            }
            if (child.nodeType == this.COMMENT_NODE)
            {
            	if (!skipcomments)
            	{
                	text.push("<!-- " + child.nodeValue + " -->");
            	}
                continue;
            }
            if (child.nodeType == this.ELEMENT_NODE)
            {
                text.push(this.toXML(child, true, null, null, skipHTMLStyles, addbreaks,skipcomments));
            }
            else
            {
                if (child.nodeType == this.TEXT_NODE)
                {
                	var v = child.nodeValue;
                	if (v)
                	{
                    	text.push(v);
                    	if (addbreaks) text.push("\n");
                	}
                }
                else if (child.nodeValue == null)
                {
                    text.push(this.toXML(child, true, null, null, skipHTMLStyles, addbreaks,skipcomments));
                }
                else
                {
                    text.push(child.nodeValue || '');
                }
            }
        }
        return text.join('');
    },

/**
 * IE doesn't have an hasAttribute when you dynamically
 * create an element it appears
 */
    hasAttribute: function (e, n, cs)
    {
        if (!e.hasAttribute)
        {
            if (e.attributes)
            {
                for (var c = 0, len = e.attributes.length; c < len; c++)
                {
                    var item = e.attributes[c];
                    if (item && item.specified)
                    {
                        if (cs && item.name == n || !cs && item.name.toLowerCase() == n.toLowerCase())
                        {
                            return true;
                        }
                    }
                }
            }
            return false;
        }
        else
        {
            return e.hasAttribute(n);
        }
    },

    getAttribute: function (e, n, cs)
    {
        if (cs)
        {
            return e.getAttribute(n);
        }
        else
        {
            for (var c = 0, len = e.attributes.length; c < len; c++)
            {
                var item = e.attributes[c];
                if (item && item.specified)
                {
                    if (item.name.toLowerCase() == n.toLowerCase())
                    {
                        return item.value;
                    }
                }
            }
            return null;
        }
    },

	/**
	 * given an XML element node, return a string representing
	 * the XML
	 */
    toXML: function(e, embed, nodeName, id, skipHTMLStyles, addbreaks, skipcomments)
    {
    	nodeName = (nodeName || e.nodeName.toLowerCase());
        var xml = [];

		xml.push("<" + nodeName);
        
        if (id)
        {
            xml.push(" id='" + id + "' ");
        }
        if (e.attributes)
        {
	        var x = 0;
            var map = e.attributes;
            for (var c = 0, len = map.length; c < len; c++)
            {
                var item = map[c];
                if (item && item.value != null && item.specified)
                {
                    var type = typeof(item);
                    if (item.value && item.value.startsWith('function()'))
                    {
                       continue;
                    }
                    if (type == 'function' || type == 'native' || item.name.match(/_moz\-/)) continue;
                    if (id != null && item.name == 'id')
                    {
                        continue;
                    }
                    
                    // special handling for IE styles
                    if (App.Browser.isIE && !skipHTMLStyles && item.name == 'style' && e.style && e.style.cssText)
                    {
                       var str = e.style.cssText;
                       xml.push(" style=\"" + str+"\"");
                       x++;
                       continue;
                    }
                    
                    var attr = String.escapeXML(item.value);
					if (Object.isUndefined(attr) || (!attr && nodeName=='input' && item.name == 'value'))
					{
						attr = '';
					}
                    xml.push(" " + item.name + "=\"" + attr + "\"");
                    x++;
                }
            }
        }
        xml.push(">");

        if (embed && e.childNodes && e.childNodes.length > 0)
        {
        	xml.push("\n");
            xml.push(this.getText(e,skipHTMLStyles,null,addbreaks,skipcomments));
        }
		xml.push("</" + nodeName + ">" + (addbreaks?"\n":""));
		
        return xml.join('');
    },

    getAndRemoveAttribute: function (node, name)
    {
        var value = node.getAttribute(name);
        if (value)
        {
            node.removeAttribute(name);
        }
        return value;
    },

    getAttributesString: function (element, excludes)
    {
        var html = '';
        this.eachAttribute(element, function(name, value)
        {
            if (false == (excludes && excludes.indexOf(name) > -1))
            {
				html += name + '="' + String.escapeXML(value||'') + '" ';                
            }
        }, null, true);
        return html;
    },
	createElement: function (type, options)
	{
	    var elem = document.createElement(type);
	    if (options)
	    {
	        if (options['parent'])
	        {
	            options['parent'].appendChild(elem);
	        }
	        if (options['className'])
	        {
	            elem.className = options['className'];
	        }
	        if (options['html'])
	        {
	            elem.innerHTML = options['html'];
	        }
	        if (options['children'])
	        {
	            options['children'].each(function(child)
	            {
	                elem.appendChild(child);
	            });
	        }
	    }
	    return elem;
	}
};

try
{
    if (typeof(DOMNodeList) == "object") DOMNodeList.prototype.length = DOMNodeList.prototype.getLength;
    if (typeof(DOMNode) == "object")
    {
        DOMNode.prototype.childNodes = DOMNode.prototype.getChildNodes;
        DOMNode.prototype.parentNode = DOMNode.prototype.getParentNode;
        DOMNode.prototype.nodeType = DOMNode.prototype.getNodeType;
        DOMNode.prototype.nodeName = DOMNode.prototype.getNodeName;
        DOMNode.prototype.nodeValue = DOMNode.prototype.getNodeValue;
    }
}
catch(e)
{
}
