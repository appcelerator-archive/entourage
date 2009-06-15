testSuite("WEL - key conditions","wel/key_conditions.html",
{
	run:function()
	{
		test("keyup",function()
		{		 
			swiss('#keyup_test').fire('keyup')
			assert(swiss('#keyup_test').css('display')=='none')
		});

		test("keydown",function()
		{		 
			swiss('#keydown_test').fire('keydown');
			assert(swiss('#keydown_test').css('display')=='none')
		});

		test("keypress",function()
		{		 
			swiss('#keypress_test').fire('keypress');
			assert(swiss('#keypress_test').css('display')=='none')
		});

		
	}
});