testSuite("WEL - interaction conditions","wel/interaction_conditions.html",
{
	run:function()
	{
		testAsync("basic interaction conditions",2000,function()
		{
			swiss('#test_1').fire('click')
			assert(swiss('#test_1').hasClass('passed')==true);

			swiss('#test_2').fire('mouseover')
			assert(swiss('#test_2').hasClass('passed')==true);

			swiss('#test_4').fire('click')
			assert(swiss('#test_4').hasClass('passed')==true);

			swiss('#test_5').fire('click')
			assert(swiss('#test_5').hasClass('passed')==true);

			swiss('#test_3').fire('focus')
			swiss('#test_3').get(0).value = 'fred@gmail.com'
			assertAfter(swiss('#test_3').hasClass('valid_passed')==true,500);
			setTimeout(function(){swiss('#test_3').get(0).value = 'fredil.com'},700);
			assertAfter(swiss('#test_3').hasClass('invalid_passed')==true,1000,true);


		});

	}
});