testSuite("WEL - parser tests","wel/parser.html",
{
	run:function()
	{
		testAsync("l:test[!foo]",2000,function()
		{
			swiss('#setup1').fire('click')
			assertAfter(swiss('#test1').hasClass('passed')==true,400);
			assertAfter(swiss('#test1a').hasClass('passed')==true,401);
			assertAfter(swiss('#test1b').hasClass('passed')==true,402);
			assertAfter(swiss('#test1c').hasClass('passed')==true,403);
			assertAfter(swiss('#test1d').hasClass('passed')==true,404);
			assertAfter(swiss('#test1e').hasClass('passed')==true,405,true);

		});

		testAsync("l:test[length!=0]",2000,function()
		{
			swiss('#setup2').fire('click')
			assertAfter(swiss('#test2').hasClass('passed')==true,400);
			assertAfter(swiss('#test3').hasClass('passed')==true,401,true);			
		});
		
		testAsync("Multiple items in condition payload",2000,function()
		{
			swiss('#setup3').fire('click')
			assertAfter(swiss('#test4').hasClass('passed')==true,400);
			assertAfter(swiss('#test5').hasClass('passed')==true,401);
			assertAfter(swiss('#test6').hasClass('passed')==true,402);
			assertAfter(swiss('#test7').hasClass('passed')==true,403);
			assertAfter(swiss('#test8').hasClass('passed')==true,404);
			assertAfter(swiss('#test9').hasClass('passed')==true,405);
			assertAfter(swiss('#test10').hasClass('passed')==true,406);
			assertAfter(swiss('#test11').hasClass('passed')==true,407,true);
		});
		
		testAsync("payload conditions using >,<,>=,<=",2000,function()
		{
			swiss('#setup4').fire('click')
			assertAfter(swiss('#test12').hasClass('passed')==true,400);
			assertAfter(swiss('#test13').hasClass('passed')==true,401);
			assertAfter(swiss('#test14').hasClass('passed')==true,402);
			assertAfter(swiss('#test15').hasClass('passed')==true,403);
			assertAfter(swiss('#test16').hasClass('passed')==true,404);
			assertAfter(swiss('#test17').hasClass('passed')==true,405,true);
			
		});
		testAsync("payload conditions using regex",2000,function()
		{
			swiss('#setup5').fire('click')
			assertAfter(swiss('#test18').hasClass('passed')==true,400);
			assertAfter(swiss('#test19').hasClass('passed')==true,401);
			assertAfter(swiss('#test20').hasClass('passed')==true,402);
			assertAfter(swiss('#test21').hasClass('passed')==true,403);
			assertAfter(swiss('#test22').hasClass('passed')==true,404);
			assertAfter(swiss('#test23').hasClass('passed')==true,405);
			assertAfter(swiss('#test24').hasClass('passed')==true,406);
			assertAfter(swiss('#test25').hasClass('passed')==true,407);			
			assertAfter(swiss('#test26').hasClass('passed')==true,408,true);
			
		});

		testAsync("payload conditions using expressions",2000,function()
		{
			swiss('#setup6').fire('click')
			assertAfter(swiss('#test27').hasClass('passed')==true,400);			
			assertAfter(swiss('#test28').hasClass('passed')==true,401);			
			assertAfter(swiss('#test29').hasClass('passed')==true,402);			
			assertAfter(swiss('#test30').hasClass('passed')==true,403);			
			assertAfter(swiss('#test31').hasClass('passed')==true,404);			
			assertAfter(swiss('#test32').hasClass('passed')==true,405);			
			assertAfter(swiss('#test33').hasClass('passed')==true,406);			
			assertAfter(swiss('#test34').hasClass('passed')==true,407);			
			assertAfter(swiss('#test35').hasClass('passed')==true,408);			
			assertAfter(swiss('#test36').hasClass('passed')==true,409);			
			assertAfter(swiss('#test37').hasClass('passed')==true,410);			
			assertAfter(swiss('#test38').hasClass('passed')==true,411,true);
			
		});

		testAsync("js variables",2000,function()
		{
			swiss('#setup7').fire('click')
			assertAfter(swiss('#test39').hasClass('passed')==true,400);			
			assertAfter(swiss('#test40').hasClass('passed')==true,401,true);
			
		});

		test("compound conditions",function()
		{
			assert(swiss('#test41').css('display')=='block');			
			swiss('#test41').fire('click');
			assert(swiss('#test41').css('display')=='none');			
			swiss('#test41').fire('mouseover');
			assert(swiss('#test41').css('display')=='block');			
			swiss('#test41a').fire('click');
			assert(swiss('#test41').css('display')=='none');			
			
		});

		test("expressions with line breaks",function()
		{
			assert(swiss('#test42').css('display')=='block');			
			swiss('#test42').fire('click');
			assert(swiss('#test42').css('display')=='none');			
			swiss('#test42').fire('mouseover');
			assert(swiss('#test42').css('display')=='block');			
			swiss('#test42a').fire('click');
			assert(swiss('#test42').css('display')=='none');			
			swiss('#test42').fire('mousedown');
			assert(swiss('#test42').css('display')=='block');			
			
		});

		testAsync("js variables",2000,function()
		{			
			assert(swiss('#test43').css('display')=='block');			
			swiss('#test43').fire('click')
			assertAfter(swiss('#test43').css('display')=='block',1000);
			assertAfter(swiss('#test43').css('display')=='none',2500);
			setTimeout(function(){swiss('#test43').fire('dblclick')},3000);
			assertAfter(swiss('#test43').css('display')=='none',3200);
			assertAfter(swiss('#test43').css('display')=='block',4000,true);
			
		});
		test("if",function()
		{
			assert(swiss('#test44').css('display')=='block');			
			swiss('#test44').fire('click');
			assert(swiss('#test44').css('display')=='none');			
			swiss('#test44').fire('click');
			assert(swiss('#test44').css('display')=='block');
			swiss('#test44a').removeClass('on');
			swiss('#test44').fire('click');
			assert(swiss('#test44').css('display')=='block');
			swiss('#test44a').addClass('on');
			swiss('#test44').fire('click');
			assert(swiss('#test44').css('display')=='none');
			
		});
		
	}
   
});