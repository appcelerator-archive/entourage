App.History = {};

App.History.changeListeners = [];
App.History.currentState = false;

App.History.onChange = function(listener)
{
	App.History.changeListeners.push(listener);	
};

App.History.go = function(historyToken)
{
	document.location.hash = historyToken;
};

App.History.fireChange = function(newState)
{
	if (newState && newState.charAt(0)=='#')
    {
        newState = newState.substring(1);
    }
    
    if (newState === '')
    {
    	newState = null;
    }
    
    if (App.History.currentState!=newState)
    {
	    App.History.currentState = newState;
	    
	    var data = 
	    {
	    	state:newState
	    };
	    
	    for (var c=0;c<App.History.changeListeners.length;c++)
	    {
	        var listener = App.History.changeListeners[c];
	        listener(newState,data);
	    }
    }
};

if (App.Browser.isIE)
{
	App.History.loadIE = function()
	{
	    var iframe = document.createElement('iframe');
	    iframe.id='app_hist_frame';
	    iframe.style.position='absolute';
	    iframe.style.left='-10px';
	    iframe.style.top='-10px';
	    iframe.style.width='1px';
	    iframe.style.height='1px';
		iframe.src='javascript:false';	
	    document.body.appendChild(iframe);
	
	    var frame = swiss('#app_hist_frame').get(0);
	    var stateField = null;
	    var state = null;
	    var initial = false;
	    
	    setInterval(function()
	    {
	        var doc = frame.contentWindow.document;
	        if (!doc)
	        {
	            return;
	        }
	
	        stateField = doc.getElementById('state');
	        var cur = document.location.hash;
	        
	        if (cur!==initial)
	        {
	            initial = cur;
	            doc.open();
	            doc.write( '<html><body><div id="state">' + cur + '</div></body></html>' );
	            doc.close();
	            App.History.fireChange(cur);
	        }
	        else
	        {
	            // check for state
	            if (stateField)
	            {
	                var newState = stateField.innerText;
	                if (state!=newState)
	                {
	                    state = newState;
	                    if (newState==null || newState==='')
	                    {
	                        if (document.location.hash)
	                        {
	                            initial = '#';
	                            document.location.hash='';
	                            App.History.fireChange('#');
	                        }
	                    }
	                    else
	                    {
	                        if (newState!=document.location.hash)
	                        {
	                            document.location.hash=newState;
	                            App.History.fireChange(document.location.hash);
	                        }
	                    }
	                }
	            }
	            else
	            {
	                if (initial)
	                {
	                    initial = false;
	                }
	            }
	        }
	    },50);	
	};
}

App.Compiler.afterDocumentCompile(function()
{
    if (App.Browser.isIE)
    {
    	App.History.loadIE();
    }
    else
    {
    	// THIS TRICK CAME FROM YUI's HISTORY COMPONENT
    	//
    	// On Safari 1.x and 2.0, the only way to catch a back/forward
        // operation is to watch history.length... We basically exploit
        // what I consider to be a bug (history.length is not supposed
        // to change when going back/forward in the history...) This is
        // why, in the following thread, we first compare the hash,
        // because the hash thing will be fixed in the next major
        // version of Safari. So even if they fix the history.length
        // bug, all this will still work!
        var counter = history.length;
        
        // On Gecko and Opera, we just need to watch the hash...
        var hash = null; // set it to null so we can start off in a null state to check for first change
        
        setInterval( function () 
        {
            var newHash;
            var newCounter;

            newHash = document.location.hash;
            newCounter = history.length;

            if ( newHash !== hash ) 
            {
                hash = newHash;
                counter = newCounter;
                App.History.fireChange(newHash);
            } 
            else if ( newCounter !== counter ) 
            {
                // If we ever get here, we should be on Safari...
                hash = newHash;
                counter = newCounter;
                App.History.fireChange(newHash);
            }
        }, 50 );
    }
});