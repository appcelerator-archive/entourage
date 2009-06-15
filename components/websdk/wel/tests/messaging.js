testSuite("WEL - messaging","wel/messaging.html",
{
	run:function()
	{
		testAsync("conditions with payload",2000,function()
		{	
			swiss('#msg_test_1').fire('click');		
			assertAfter(swiss('#msg_1').hasClass('passed')==true,400);
			assertAfter(swiss('#msg_2').hasClass('passed')==true,401);
			assertAfter(swiss('#msg_3').hasClass('passed')==true,402);
			assertAfter(swiss('#msg_4').hasClass('passed')==true,403,true);
			
		});
		
		testAsync("condition with complex payload",2000,function()
		{
			swiss('#msg_test_2').fire('click');		
			assertAfter(swiss('#msg_5').hasClass('passed')==true,400);
			assertAfter(swiss('#msg_6').hasClass('passed')==true,401);
			assertAfter(swiss('#msg_7').hasClass('passed')==true,402);
			assertAfter(swiss('#msg_8').hasClass('passed')==true,403);
			assertAfter(swiss('#msg_9').hasClass('passed')==true,404,true);
			
		});
		testAsync("condition with expression-based payload",2000,function()
		{
			swiss('#msg_test_3').fire('click');		
			assertAfter(swiss('#msg_10').hasClass('passed')==true,400);
			assertAfter(swiss('#msg_11').hasClass('passed')==true,401);
			assertAfter(swiss('#msg_12').hasClass('passed')==true,402,true);
			
		});
		
		testAsync("condition with wildcard message",2000,function()
		{
			swiss('#msg_test_1').fire('click');		
			swiss('#msg_test_2').fire('click');		
			swiss('#msg_test_3').fire('click');		
			assertAfter(swiss('#msg_14').hasClass('passed')==true,400);
			assertAfter(swiss('#msg_15').hasClass('passed')==true,401);
			assertAfter(swiss('#msg_16').hasClass('passed')==true,402);
			assertAfter(swiss('#msg_17').hasClass('passed')==true,403);
			assertAfter(swiss('#msg_18').hasClass('passed')==true,404,true);
			
		});
		
		testAsync("boolean in message condition",2000,function()
		{
			$MQ('l:bool_test',{val:true});		
			$MQ('l:bool_test2',{val:false});		
			assertAfter(swiss('#msg_19').hasClass('passed')==true,400);
			assertAfter(swiss('#msg_20').hasClass('passed')==true,400,true);
			
		});
		
	}
});