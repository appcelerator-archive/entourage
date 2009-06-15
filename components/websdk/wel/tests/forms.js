testSuite("WEL - forms","wel/forms.html",
{
	run:function()
	{
		testAsync("fieldset",2500,function()
		{
			swiss('#button1').fire('click');
			assertAfter(swiss('#fieldset_test1').get(0).value == "true",1000);	
			swiss('#button2').fire('click');
			assertAfter(swiss('#fieldset_test2').get(0).value == "true",1000,true);	

		});
		testAsync("activator - set 1",2500,function()
		{
			assert(swiss('#activator_button_1').get(0).disabled == true);
			assert(swiss('#activator_button_2').get(0).disabled == true);
			swiss('#activator_input_1').fire('focus');
			swiss('#activator_input_1').get(0).value = "foo";
			swiss('#activator_input_2').fire('focus');
			swiss('#activator_input_2').get(0).value = "foo";
			swiss('#activator_input_3').fire('focus');
			swiss('#activator_input_3').get(0).value = "foo";
			swiss('#activator_textarea1').fire('focus');
			swiss('#activator_textarea1').get(0).value = "foo";
			swiss('#activator_textarea2').fire('focus');
			swiss('#activator_textarea2').get(0).value = "foo";
			swiss('#activator_select1').fire('focus');
			swiss('#activator_select1').get(0).selectedIndex = 1;
			swiss('#activator_select2').fire('focus');
			swiss('#activator_select2').get(0).selectedIndex = 1;

			assertAfter(swiss('#activator_button_1').get(0).disabled==false,500);
			assertAfter(swiss('#activator_button_2').get(0).disabled==false,500,true);
			
		});
		testAsync("activator - set 2",2500,function()
		{
			assert(swiss('#activator_button_1').get(0).disabled == true);
			assert(swiss('#activator_button_2').get(0).disabled == true);
			swiss('#activator_input_1').fire('focus');
			swiss('#activator_input_1').get(0).value = "foo";
			swiss('#activator_input_2').fire('focus');
			swiss('#activator_input_2').get(0).value = "foo";
			swiss('#activator_textarea1').fire('focus');
			swiss('#activator_textarea1').get(0).value = "foo";

			assertAfter(swiss('#activator_button_1').get(0).disabled==true,500);
			assertAfter(swiss('#activator_button_2').get(0).disabled==true,500,true);
			
		});

		testAsync("activator - set 3",2500,function()
		{
			assert(swiss('#activator_button_1').get(0).disabled == true);
			assert(swiss('#activator_button_2').get(0).disabled == true);
			swiss('#activator_input_1').fire('focus');
			swiss('#activator_input_1').get(0).value = "foo";
			swiss('#activator_textarea1').fire('focus');
			swiss('#activator_textarea1').get(0).value = "foo";
			swiss('#activator_textarea2').fire('focus');
			swiss('#activator_textarea2').get(0).value = "foo";
			swiss('#activator_select1').fire('focus');
			swiss('#activator_select1').get(0).selectedIndex = 1;
			swiss('#activator_select2').fire('focus');
			swiss('#activator_select2').get(0).selectedIndex = 1;

			assertAfter(swiss('#activator_button_1').get(0).disabled==true,500);
			assertAfter(swiss('#activator_button_2').get(0).disabled==true,500,true);
			
		});

		testAsync("activator - set 4",2500,function()
		{
			assert(swiss('#activator_button_1').get(0).disabled == true);
			assert(swiss('#activator_button_2').get(0).disabled == true);
			swiss('#activator_input_3').fire('focus');
			swiss('#activator_input_3').get(0).value = "foo";
			swiss('#activator_textarea2').fire('focus');
			swiss('#activator_textarea2').get(0).value = "foo";
			swiss('#activator_select2').fire('focus');
			swiss('#activator_select2').get(0).selectedIndex = 1;

			assertAfter(swiss('#activator_button_1').get(0).disabled==true,500);
			assertAfter(swiss('#activator_button_2').get(0).disabled==false,500,true);
			
		});

		testAsync("activator - set 5",2500,function()
		{
			assert(swiss('#activator_button_1').get(0).disabled == true);
			assert(swiss('#activator_button_2').get(0).disabled == true);
			swiss('#activator_input_1').fire('focus');
			swiss('#activator_input_1').get(0).value = "foo";
			swiss('#activator_input_2').fire('focus');
			swiss('#activator_input_2').get(0).value = "foo";
			swiss('#activator_textarea1').fire('focus');
			swiss('#activator_textarea1').get(0).value = "foo";
			swiss('#activator_select1').fire('focus');
			swiss('#activator_select1').get(0).selectedIndex = 1;

			assertAfter(swiss('#activator_button_1').get(0).disabled==false,500);
			assertAfter(swiss('#activator_button_2').get(0).disabled==true,500,true);
			
		});

		testAsync("validators and decorators",2500,function()
		{	
			assert(swiss('#decorator_test1').css('visibility') == 'visible');
			swiss('#test1').fire('focus');
			swiss('#test1').get(0).value = "f";
			assertAfter(swiss('#decorator_test1').css('visibility') == 'hidden',210);

			assert(swiss('#custom_dec').css('visibility') == 'visible');
			swiss('#test2').fire('focus');
			swiss('#test2').get(0).value = "f";
			assertAfter(swiss('#custom_dec').css('visibility') == 'hidden',210);

			assert(swiss('#decorator_test3').css('visibility') == 'visible');
			swiss('#test3').fire('focus');
			swiss('#test3').get(0).selectedIndex = 1;
			assertAfter(swiss('#decorator_test3').css('visibility') == 'hidden',210);
			
			assert(swiss('#decorator_test4').css('visibility') == 'visible');
			swiss('#test4').fire('focus');
			swiss('#test4').get(0).value = "f";
			assertAfter(swiss('#decorator_test4').css('visibility') == 'hidden',210);
			
			assert(swiss('#decorator_test5').css('visibility') == 'visible');
			swiss('#test5').fire('focus');
			swiss('#test5').get(0).value = "06415";
			assertAfter(swiss('#decorator_test5').css('visibility') == 'hidden',200);
			setTimeout(function(){swiss('#test5').get(0).value = "3030";},400)		
			assertAfter(swiss('#decorator_test5').css('visibility') == 'visible',1000);
			
			assert(swiss('#decorator_test6').css('visibility') == 'visible');
			swiss('#test6').fire('focus');
			swiss('#test6').get(0).value = "4042223333";
			assertAfter(swiss('#decorator_test6').css('visibility') == 'hidden',200);
			setTimeout(function(){swiss('#test6').get(0).value = "303222";},400)		
			assertAfter(swiss('#decorator_test6').css('visibility') == 'visible',1000);
			
			assert(swiss('#decorator_test7').css('visibility') == 'visible');
			swiss('#test7').fire('focus');
			swiss('#test7').get(0).value = "304332234";
			assertAfter(swiss('#decorator_test7').css('visibility') == 'hidden',200);
			setTimeout(function(){swiss('#test7').get(0).value = "303222";},400)		
			assertAfter(swiss('#decorator_test7').css('visibility') == 'visible',1000);
			
			assert(swiss('#decorator_test8').css('visibility') == 'visible');
			swiss('#test8').fire('focus');
			swiss('#test8').get(0).value = "nfoo@nfoo.com";
			assertAfter(swiss('#decorator_test8').css('visibility') == 'hidden',200);
			setTimeout(function(){swiss('#test8').get(0).value = "nfoo";},400)		
			assertAfter(swiss('#decorator_test8').css('visibility') == 'visible',1000);
			
			assert(swiss('#decorator_test9').css('visibility') == 'visible');
			swiss('#test9').fire('focus');
			swiss('#test9').get(0).value = "11/1/2000";
			assertAfter(swiss('#decorator_test8').css('visibility') == 'hidden',200);
			setTimeout(function(){swiss('#test8').get(0).value = "11/1/1800";},400)		
			assertAfter(swiss('#decorator_test8').css('visibility') == 'visible',1000);
			
			assert(swiss('#decorator_test10').css('visibility') == 'visible');
			swiss('#test10').fire('focus');
			swiss('#test10').get(0).value = "1";
			assertAfter(swiss('#decorator_test10').css('visibility') == 'hidden',200);
			setTimeout(function(){swiss('#test10').get(0).value = "a";},400)		
			assertAfter(swiss('#decorator_test10').css('visibility') == 'visible',1000);
			
			assert(swiss('#decorator_test11').css('visibility') == 'visible');
			swiss('#test11').fire('focus');
			swiss('#test11').get(0).value = "fred joshns";
			assertAfter(swiss('#decorator_test11').css('visibility') == 'hidden',200);
			setTimeout(function(){swiss('#test11').get(0).value = "fred";},400)		
			assertAfter(swiss('#decorator_test11').css('visibility') == 'visible',1000);
			
			assert(swiss('#decorator_test12').css('visibility') == 'visible');
			swiss('#test12').fire('focus');
			swiss('#test12').get(0).value = "122sssss";
			assertAfter(swiss('#decorator_test12').css('visibility') == 'hidden',200);
			setTimeout(function(){swiss('#test12').get(0).value = "1233#";},400)		
			assertAfter(swiss('#decorator_test12').css('visibility') == 'visible',1000);
			
			assert(swiss('#decorator_test13').css('visibility') == 'visible');
			swiss('#test13').fire('focus');
			swiss('#test13').get(0).value = "dddd";
			assertAfter(swiss('#decorator_test13').css('visibility') == 'hidden',200);
			setTimeout(function(){swiss('#test13').get(0).value = "ddd d";},400)		
			assertAfter(swiss('#decorator_test13').css('visibility') == 'visible',1000);
			
			assert(swiss('#decorator_test14').css('visibility') == 'visible');
			swiss('#test14').fire('focus');
			swiss('#test14').get(0).value = "ddddss";
			assertAfter(swiss('#decorator_test14').css('visibility') == 'hidden',200);
			setTimeout(function(){swiss('#test14').get(0).value = "dddd";},400)		
			assertAfter(swiss('#decorator_test14').css('visibility') == 'visible',1000);
			
			assert(swiss('#decorator_test15').css('visibility') == 'visible');
			swiss('#test15').fire('focus');
			swiss('#test15').get(0).value = "http://www.cnn.com";
			assertAfter(swiss('#decorator_test15').css('visibility') == 'hidden',200);
			setTimeout(function(){swiss('#test15').get(0).value = "http:/";},400)		
			assertAfter(swiss('#decorator_test15').css('visibility') == 'visible',1000);
			
			assert(swiss('#decorator_test16').css('visibility') == 'visible');
			swiss('#test16').fire('focus');
			swiss('#test16').get(0).checked = true;
			assertAfter(swiss('#decorator_test16').css('visibility') == 'hidden',200);
			setTimeout(function(){swiss('#test16').get(0).checked = false},400);		
			assertAfter(swiss('#decorator_test16').css('visibility') == 'visible',1000);
			
			assert(swiss('#decorator_test17').css('visibility') == 'visible');
			swiss('#test17').fire('focus');
			swiss('#test17').get(0).value = "1";
			assertAfter(swiss('#decorator_test17').css('visibility') == 'hidden',200);
			setTimeout(function(){swiss('#test17').get(0).value = "1.5";},400)		
			assertAfter(swiss('#decorator_test17').css('visibility') == 'visible',1000);
			
			//Advanced fullname validator
			assert(swiss('#decorator_fullnameAdv').css('visibility') == 'visible');
			swiss('#fullnameAdv').fire('focus');
			swiss('#fullnameAdv').get(0).value = "Kevin Whinnery, The 3rd";
			assertAfter(swiss('#decorator_fullnameAdv').css('visibility') == 'hidden',400);
			setTimeout(function(){swiss('#fullnameAdv').get(0).value = "C 3PO";},600)		
			assertAfter(swiss('#decorator_fullnameAdv').css('visibility') == 'visible',1000);
			
			assert(swiss('#test20').get(0).validatorValid == true);
			swiss('#test20').fire('focus');
			swiss('#test20').get(0).value = "dd";
			assertAfter(swiss('#decorator_test20').css('visibility') == 'visible',200);
			setTimeout(function(){swiss('#test20').get(0).value = "30304";},400)		
			assertAfter(swiss('#decorator_test20').css('visibility') == 'hidden',1000);
			
			assert(swiss('#test21').get(0).validatorValid == true);
			swiss('#test21').fire('focus');
			swiss('#test21').get(0).value = "111";
			assertAfter(swiss('#decorator_test21').css('visibility') == 'visible',200);
			setTimeout(function(){swiss('#test21').get(0).value = "4043332222";},400)		
			assertAfter(swiss('#decorator_test21').css('visibility') == 'hidden',1000);
			
			assert(swiss('#test22').get(0).validatorValid == true);
			swiss('#test22').fire('focus');
			swiss('#test22').get(0).value = "111";
			assertAfter(swiss('#decorator_test22').css('visibility') == 'visible',200);
			setTimeout(function(){swiss('#test22').get(0).value = "403223322";},400)		
			assertAfter(swiss('#decorator_test22').css('visibility') == 'hidden',1000);
			
			assert(swiss('#test23').get(0).validatorValid == true);
			swiss('#test23').fire('focus');
			swiss('#test23').get(0).value = "nfoo@";
			assertAfter(swiss('#decorator_test23').css('visibility') == 'visible',200);
			setTimeout(function(){swiss('#test23').get(0).value = "nfoo@nfoo.com";},400)		
			assertAfter(swiss('#decorator_test23').css('visibility') == 'hidden',1000);
			
			assert(swiss('#test24').get(0).validatorValid == true);
			swiss('#test24').fire('focus');
			swiss('#test24').get(0).value = "111/1/2000";
			assertAfter(swiss('#decorator_test24').css('visibility') == 'visible',200);
			setTimeout(function(){swiss('#test24').get(0).value = "11/1/2000";},400)		
			assertAfter(swiss('#decorator_test24').css('visibility') == 'hidden',1000);
			
			assert(swiss('#test25').get(0).validatorValid == true);
			swiss('#test25').fire('focus');
			swiss('#test25').get(0).value = "a";
			assertAfter(swiss('#decorator_test25').css('visibility') == 'visible',200);
			setTimeout(function(){swiss('#test25').get(0).value = "1";},400)		
			assertAfter(swiss('#decorator_test25').css('visibility') == 'hidden',1000);
			
			assert(swiss('#test26').get(0).validatorValid == true);
			swiss('#test26').fire('focus');
			swiss('#test26').get(0).value = "fooman";
			assertAfter(swiss('#decorator_test26').css('visibility') == 'visible',200);
			setTimeout(function(){swiss('#test26').get(0).value = "foo man";},400)		
			assertAfter(swiss('#decorator_test26').css('visibility') == 'hidden',1000);
			
			assert(swiss('#test27').get(0).validatorValid == true);
			swiss('#test27').fire('focus');
			swiss('#test27').get(0).value = "s$";
			assertAfter(swiss('#decorator_test27').css('visibility') == 'visible',200);
			setTimeout(function(){swiss('#test27').get(0).value = "23dddn";},400)		
			assertAfter(swiss('#decorator_test27').css('visibility') == 'hidden',1000);
			
			assert(swiss('#test28').get(0).validatorValid == true);
			swiss('#test28').fire('focus');
			swiss('#test28').get(0).value = "dddd d";
			assertAfter(swiss('#decorator_test28').css('visibility') == 'visible',200);
			setTimeout(function(){swiss('#test28').get(0).value = "ddddd";},400)		
			assertAfter(swiss('#decorator_test28').css('visibility') == 'hidden',1000);
			
			assert(swiss('#test29').get(0).validatorValid == true);
			swiss('#test29').fire('focus');
			swiss('#test29').get(0).value = "ddd";
			assertAfter(swiss('#decorator_test29').css('visibility') == 'visible',200);
			setTimeout(function(){swiss('#test29').get(0).value = "dddddd";},400)		
			assertAfter(swiss('#decorator_test29').css('visibility') == 'hidden',1000);
			
			assert(swiss('#test30').get(0).validatorValid == true);
			swiss('#test30').fire('focus');
			swiss('#test30').get(0).value = "http://ff";
			assertAfter(swiss('#decorator_test30').css('visibility') == 'visible',200);
			setTimeout(function(){swiss('#test30').get(0).value = "http://www.cnn.com";},400)		
			assertAfter(swiss('#decorator_test30').css('visibility') == 'hidden',1000);
			
			assert(swiss('#test31').get(0).validatorValid == true);
			swiss('#test31').fire('focus');
			swiss('#test31').get(0).value = "1.4";
			assertAfter(swiss('#decorator_test31').css('visibility') == 'visible',200);
			setTimeout(function(){swiss('#test31').get(0).value = "1";},400)		
			assertAfter(swiss('#decorator_test31').css('visibility') == 'hidden',1000);

			assert(swiss('#decorator_test18').css('visibility') == 'visible');
			swiss('#test18').fire('focus');
			swiss('#test18').get(0).value = "111";
			assertAfter(swiss('#decorator_test18').css('visibility') == 'hidden',200);
			setTimeout(function(){swiss('#test18').get(0).value = "1";},400)		
			assertAfter(swiss('#decorator_test18').css('visibility') == 'visible',1000);
			setTimeout(function(){swiss('#test18').get(0).value = "122";},2000)		
			assertAfter(swiss('#decorator_test18').css('visibility') == 'hidden',3000);
			setTimeout(function(){swiss('#test18').get(0).value = "1222222";},4000)		
			assertAfter(swiss('#decorator_test18').css('visibility') == 'visible',5000,true);
			
		});
		

	}
});