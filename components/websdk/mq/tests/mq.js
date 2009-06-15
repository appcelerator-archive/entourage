testSuite("Message Queue","mq/mq.html", {
	run:function() {
		testAsync("Test publish and direct subscribe",1000,function() {	
			var directMatch = false;
			var noMatch = true;
			
			//Subscribe
			$MQL("test", function(msg) {
				directMatch = true;
			});
			
			//Subscribe - should not match
			$MQL("testytesttest", function(msg) {
				noMatch = false;
			});
			
			//Publish
			$MQ("test");
			
			assertAfter(directMatch,400);
			assertAfter(noMatch,401,true);
		});
		
		testAsync("Test publish and direct subscribe with payload",1000,function() {	
			var success = false;
			
			//Subscribe
			$MQL("test", function(msg) {
				success = msg.payload.foo == "bar";
			});
			
			//Publish
			$MQ({name:"test", payload: { foo: "bar" } });
			
			assertAfter(success,400,true);
		});
		
		testAsync("Test publish and direct subscribe with scope",1000,function() {	
			var scopeWorked = false;
			var noScopeWorked = true;
			
			//Subscribe with scope
			$MQL("test", function(msg) {
				scopeWorked = true;
			},{scope:"myscope"});
			
			//Subscribe without scope
			$MQL("test", function(msg) {
				noScopeWorked = false;
			});
			
			//Publish with scope
			$MQ({name:"test", payload: {}, scope:"myscope"});
			
			assertAfter(scopeWorked,400);
			assertAfter(noScopeWorked,401,true);
		});
		
		testAsync("Test publish and RegExp subscribe",1000,function() {	
			var match1 = false;
			var match2 = false;
			var match3 = false;
			var noMatch = true;
			
			//Matching listeners
			$MQL(/^l:test\./, function(msg) {
				match1 = true;
			});
			
			$MQL(/l:*/, function(msg) {
				match2 = true;
			});
			
			$MQL(/l:test\.ONE(?:~booya!)/i, function(msg) {
				match3 = true;
			});
			
			//Non-matching listener
			$MQL(/^l:fest\./, function(msg) {
				noMatch = false;
			});
			
			//Publish
			$MQ("l:test.one~booya!");
			
			assertAfter(match1,400);
			assertAfter(match2,401);
			assertAfter(match3,402);
			assertAfter(noMatch,403,true);
		});
		
		testAsync("Test publish and direct intercept with scope and payload",1000,function() {	
			var intercepted = false;
			
			//Intercept
			$MQI("test", function(msg) {
				msg.payload.foo = "giggety giggety!";
			},{scope:"myscope"});
			
			//Subscribe 
			$MQL("test", function(msg) {
				intercepted = msg.payload.foo == "giggety giggety!";
			},{scope:"myscope"});
			
			//Publish with scope
			$MQ({name:"test", payload:{foo:"bar"}, scope:"myscope"});
			
			assertAfter(intercepted,400,true);
		});
		
		testAsync("Test subscribe through jQuery plugin method",1000,function() {	
			
			$("#jquerySubTest").subscribe("test.jquery.sub", function(msg,element) {
			  element.value = msg.payload.newvalue;
			});
			
			$MQ("test.jquery.sub", {
			  newvalue:"Booyah!"
			});
			
			assertAfter(($("#jquerySubTest").attr("value") == "Booyah!"),1000,true);
		});
		
	}
});