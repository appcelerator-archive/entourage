testSuite("WEL - effects (jquery)","wel/effects_jquery.html",
{
	run:function()
	{
		test("toggle - hide",function()
		{		 
			swiss('#toggle_button').fire('click')
			assert(swiss('#toggle_div').get(0).style.display=='none')	
			swiss('#toggle_button').fire('click')
			assert(swiss('#toggle_div').css('display')=='block')	

		});
		testAsync("toggle - with speed option",2000,function()
		{		 
			swiss('#toggle_speed_button').fire('click')
			assertAfter(swiss('#toggle_speed_div').css('display')=='block',900,true)
		});

		testAsync("toggle - with speed option (2)",3500,function()
		{		 
			swiss('#toggle_speed_button_2').fire('click')
			assertAfter(swiss('#toggle_speed_div_2').css('display')=='none',2000,true)
		});

		test("show",function()
		{		 
			swiss('#show_button').fire('click')
			assert(swiss('#show_div').css('display')=='block')	
		});

		test("show - with speed option",function()
		{		 
			swiss('#show_speed_button').fire('click')
			assert(swiss('#show_speed_div').css('display')=='block')
		});

		test("hide",function()
		{		 
			swiss('#hide_button').fire('click')
			assert(swiss('#hide_div').css('display')=='none')
		});

		testAsync("hide - with speed option",2000,function()
		{		 
			swiss('#hide_speed_button').fire('click')
			assertAfter(swiss('#hide_speed_div').css('display')=='block',900,true)
		});

		testAsync("hide - with speed option (2)",3000,function()
		{		 
			swiss('#hide_speed_button_2').fire('click')
			assertAfter(swiss('#hide_speed_div_2').css('display')=='none',1800,true)
		});

	}
});