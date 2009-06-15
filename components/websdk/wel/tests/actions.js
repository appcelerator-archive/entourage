testSuite("WEL - actions","wel/actions.html",
{
	run:function()
	{
		test("hidden",function()
		{		 
			swiss('#hidden_test').fire('click');
			assert(swiss('#hidden_test').css('visibility')=='hidden')
		});
		test("hidden - named target",function()
		{		 
			swiss('#hidden_target').fire('click');
			assert(swiss('#hidden_target_test').css('visibility')=='hidden')
		});
		test("visible",function()
		{		 
			swiss('#visible_test').fire('click');
			assert(swiss('#visible_test').css('visibility')=='visible')
		});
		test("visible - named target",function()
		{		 
			swiss('#visible_target').fire('click');
			assert(swiss('#visible_target_test').css('visibility')=='visible')
		});
		test("hide",function()
		{		 
			swiss('#hide_test').fire('click');
			assert(swiss('#hide_test').css('display')=='none')
		});
		test("hide - named target",function()
		{		 
			swiss('#hide_target').fire('click');
			assert(swiss('#hide_target_test').css('display')=='none')
		});
		test("show",function()
		{		 
			swiss('#show_test').fire('click');
			assert(swiss('#show_test').css('display')!='none')
		});
		test("show - named target",function()
		{		 
			swiss('#show_target').fire('click');
			assert(swiss('#show_target_test').css('display')!='none')
		});

		test("script - function call",function()
		{		 
			swiss('#script_test').fire('click');
			assert(swiss('#script_test').css('display')=='none')
		});
		test("script - inline",function()
		{		 
			swiss('#script_inline_test').fire('click');
			assert(swiss('#script_inline_test').css('display')=='none')
		});
		test("enable",function()
		{		 
			swiss('#test_1').fire('click');
			assert(swiss('#test_1').get(0).disabled == false);
		});
		test("disable",function()
		{		 
			swiss('#test_2').fire('click');
			assert(swiss('#test_2').get(0).disabled == true);
		});
		testAsync("reset/clear",function()
		{		 
			assert(swiss('#test_3').get(0).innerHTML == 'hello');
			swiss('#test_3').fire('click');
			assert(swiss('#test_3').get(0).innerHTML == '');
			
			assert(swiss('#test4_div').get(0).innerHTML == 'hello');
			swiss('#test_4').fire('click');
			assert(swiss('#test4_div').get(0).innerHTML == '');
			
			assert(swiss('#test_5').get(0).value == 'hello');
			swiss('#test_5').fire('click');
			assert(swiss('#test_5').get(0).value == '');
			
			assert(swiss('#test_6').get(0).selectedIndex ==1);
			swiss('#test_6').fire('click');
			assert(swiss('#test_6').get(0).selectedIndex ==0);
			
			assert(swiss('#test_7a').get(0).validatorValid == true);
			assert(swiss('#test_7b').get(0).validatorValid == true);
			assert(swiss('#test_7c').get(0).validatorValid == true);
			assert(swiss('#test_7d').get(0).validatorValid == true);

			
			swiss('#test_7').fire('click');

			swiss('#test_7b').fire('focus')
			assert(swiss('#test_7a').get(0).value == '');
			assertAfter(swiss('#test_7a').get(0).validatorValid == false,200);

			swiss('#test_7b').fire('focus')
			assert(swiss('#test_7b').get(0).value == '');
			assertAfter(swiss('#test_7b').get(0).validatorValid == false,200);
	
			swiss('#test_7c').fire('focus')
			assert(swiss('#test_7c').get(0).selectedIndex == 0);
			assertAfter(swiss('#test_7c').get(0).validatorValid == false,200);
	
			swiss('#test_7d').fire('focus')
			assert(swiss('#test_7d').get(0).value == '');
			assertAfter(swiss('#test_7d').get(0).validatorValid == false,200,true);
			
		});
		testAsync("selectOption",function()
		{		 
			assert(swiss('#test_8').get(0).selectedIndex == 0);
			$MQ('l:optionTest',{value:2});
			assertAfter(swiss('#test_8').get(0).selectedIndex == 1,500,true);

		});
		testAsync("selectOption - 2",function()
		{		 
			$MQ('l:optionTest',{value:3});
			assertAfter(swiss('#test_8').get(0).selectedIndex == 2,500,true);

		});
		testAsync("selectOption - 3",function()
		{		 
			$MQ('l:optionTest2');
			assertAfter(swiss('#test_9').get(0).selectedIndex == 1,500,true);

		});
		test("add/set",function()
		{		 
			swiss('#test_10').fire('click');
			assert(swiss('#test_10').css('opacity')=='0.7')
			assert(swiss('#test_10').hasClass('foo')==true);

			swiss('#test_11').fire('click');
			assert(swiss('#test_11').attr('foo')=='bar');
			assert(swiss('#test_11').attr('joe')=='smith');
			
			swiss('#test_12').fire('click');
			assert(swiss('#test_12').attr('foo')=='bar');
			assert(swiss('#test_12').hasClass('foo')==true);

			swiss('#test_13').fire('click');
			assert(swiss('#test_13a').attr('foo')=='bar');
			assert(swiss('#test_13a').hasClass('foo')==true);
			
		});

		test("remove",function()
		{		 
			assert(swiss('#test_14').hasClass('foo')==true)
			swiss('#test_14').fire('click');
			assert(swiss('#test_14').hasClass('foo')==false)

			assert(swiss('#test_15').hasClass('foo')==true)
			assert(swiss('#test_15').attr('foo')=='bar')
			swiss('#test_15').fire('click');
			assert(swiss('#test_15').hasClass('foo')==false)
			assert(swiss('#test_15').attr('foo')==undefined)
			
			assert(swiss('#test_16a').hasClass('foo')==true)
			assert(swiss('#test_16a').attr('foo')=='bar')
			swiss('#test_16').fire('click');
			assert(swiss('#test_16a').hasClass('foo')==false)
			assert(swiss('#test_16a').attr('foo')==undefined)
	
			assert(swiss('#test_17').hasClass('foo')==true)
			assert(swiss('#test_17').hasClass('bar')==true)		
			assert(swiss('#test_17').attr('foo')=='bar')
			assert(swiss('#test_17').attr('bar')=='foo')
			swiss('#test_17').fire('click');
			assert(swiss('#test_17').hasClass('foo')==false)
			assert(swiss('#test_17').hasClass('bar')==false)
			assert(swiss('#test_17').attr('foo')==undefined)
			assert(swiss('#test_17').attr('bar')==undefined)
			
		});

		test("toggle",function()
		{		 
			assert(swiss('#test_18').hasClass('foo')==false)
			swiss('#test_18').fire('click');
			assert(swiss('#test_18').hasClass('foo')==true)
			swiss('#test_18').fire('click');
			assert(swiss('#test_18').hasClass('foo')==false)

			swiss('#test_19').fire('click');
			assert(swiss('#test_19').css('display')=='inline')
			swiss('#test_19').fire('click');
			assert(swiss('#test_19').css('display')=='none')

			swiss('#test_20').fire('click');
			assert(swiss('#test_20').css('visibility')=='hidden')
			swiss('#test_20').fire('click');
			assert(swiss('#test_20').css('visibility')=='visible')

			swiss('#test_21').fire('click');
			assert(swiss('#test_21').css('opacity')=='0.7')
			swiss('#test_21').fire('click');
			assert(swiss('#test_21').css('opacity')=='1')
			swiss('#test_21').fire('click');
			assert(swiss('#test_21').css('opacity')=='0.7')

			assert(swiss('#test_22').attr('foo')==undefined)
			swiss('#test_22').fire('click');
			assert(swiss('#test_22').attr('foo')=='bar')
			swiss('#test_22').fire('click');
			assert(swiss('#test_22').attr('foo')==undefined)

			assert(swiss('#test_23').css('float')=='right')
			swiss('#test_23').fire('click');
			assert(swiss('#test_23').css('float')=='left')
			swiss('#test_23').fire('click');
			assert(swiss('#test_23').css('float')=='right')

		});
		testAsync("value",function()
		{		 
			assert(swiss('#test_24').get(0).innerHTML == 'foo')
			swiss('#test_24').fire('click');
			assert(swiss('#test_24').get(0).innerHTML == 'bar');

			assert(swiss('#test_25').get(0).value == 'foo')
			swiss('#test_25').fire('click');
			assert(swiss('#test_25').get(0).value == 'bar');

			assert(swiss('#test_26').get(0).value == 'foo')
			swiss('#test_26').fire('click');
			assert(swiss('#test_26').get(0).value == 'bar');
		
			assert(swiss('#test_35').get(0).validatorValid == true);
			swiss('#test_35').fire('click');
			assert(swiss('#test_35').get(0).validatorValid == false);

			$MQ('l:select_value',{'rows':[{val:'1',desc:'one'},{val:'2',desc:'two'},{val:'3',desc:'three'}]});
			assertAfter(swiss('#test_27').get(0).selectedIndex==0,500);
			assertAfter(swiss('#test_27').get(0).options[0].value=='1',500);
			assertAfter(swiss('#test_27').get(0).options[0].text=='one',500);
			assertAfter(swiss('#test_27').get(0).options[1].value=='2',500);
			assertAfter(swiss('#test_27').get(0).options[1].text=='two',500);
			assertAfter(swiss('#test_27').get(0).options[2].value=='3',500);
			assertAfter(swiss('#test_27').get(0).options[2].text=='three',500);
			
			assert(swiss('#test_28').get(0).innerHTML == 'foo');
			$MQ('l:div_value',{div:'bar'});
			assertAfter(swiss('#test_28').get(0).innerHTML == 'bar',500);

			assert(swiss('#test_29').get(0).value == 'foo');
			$MQ('l:input_value',{input:'bar'});
			assertAfter(swiss('#test_29').get(0).value == 'bar',500);

			assert(swiss('#test_30').get(0).value == 'foo');
			$MQ('l:textarea_value',{textarea:'bar'});
			assertAfter(swiss('#test_30').get(0).value == 'bar',500);

			assertAfter(swiss('#test_31').get(0).innerHTML == 'foobar',500);
			assertAfter(swiss('#test_32').get(0).value == 'foobar',500);
			assertAfter(swiss('#test_33').get(0).value == 'foobar',500);

			$MQ('l:select_value2',{'rows':[{val:'4',desc:'four'},{val:'5',desc:'five'},{val:'6',desc:'six'}]});
			assertAfter(swiss('#test_34').get(0).selectedIndex==0,500);
			assertAfter(swiss('#test_34').get(0).options[0].value=='1',500);
			assertAfter(swiss('#test_34').get(0).options[0].text=='one',500);
			assertAfter(swiss('#test_34').get(0).options[1].value=='2',500);
			assertAfter(swiss('#test_34').get(0).options[1].text=='two',500);
			assertAfter(swiss('#test_34').get(0).options[2].value=='3',500);
			assertAfter(swiss('#test_34').get(0).options[2].text=='three',500);
			assertAfter(swiss('#test_34').get(0).options[3].value=='4',500);
			assertAfter(swiss('#test_34').get(0).options[3].text=='four',500);
			assertAfter(swiss('#test_34').get(0).options[4].value=='5',500);
			assertAfter(swiss('#test_34').get(0).options[4].text=='five',500);
			assertAfter(swiss('#test_34').get(0).options[5].value=='6',500);
			assertAfter(swiss('#test_34').get(0).options[5].text=='six',500);

			$MQ('l:form_value',{'user':{name:'fred',phone:'404 222-3333',gender:'f',comments:'foo',agreed:true,nope:false}});

			assertAfter(swiss('#name').get(0).value == 'fred',500);
			assertAfter(swiss('#phone').get(0).value == '404 222-3333',500);
			assertAfter(swiss('#gender').get(0).selectedIndex == 1,500);
			assertAfter(swiss('#gender').get(0).value == 'f',500);
			assertAfter(swiss('#agreed').get(0).checked == true,500);
			assertAfter(swiss('#nope').get(0).checked == false,500);
			assertAfter(swiss('#comments').get(0).value == 'foo',700,true);
			
			
			
		});
		test("statechange ",function()
		{		 
			assert(swiss('#test_38a').hasClass('inactive')==true);
			assert(swiss('#test_39a').hasClass('inactive')==true);
			assert(swiss('#test_40a').hasClass('active')==true);

			swiss('#test_38').fire('click');
			assert(swiss('#test_38a').hasClass('active')==true);
			assert(swiss('#test_39a').hasClass('inactive')==true);
			assert(swiss('#test_40a').hasClass('inactive')==true);
			
			swiss('#test_39').fire('click');
			assert(swiss('#test_38a').hasClass('inactive')==true);
			assert(swiss('#test_39a').hasClass('active')==true);
			assert(swiss('#test_40a').hasClass('inactive')==true);
			
			swiss('#test_40').fire('click');
			assert(swiss('#test_38a').hasClass('inactive')==true);
			assert(swiss('#test_39a').hasClass('inactive')==true);
			assert(swiss('#test_40a').hasClass('active')==true);
			
		});
	
		test("DOM ",function()
		{		 
			swiss('#test_41').fire('click');
			assert(swiss('#test_41a').hasClass('passed')==true);

			swiss('#test_42').fire('click');
			assert(swiss('#test_42a').hasClass('passed')==true);
			
			swiss('#test_43').fire('click');
			assert(swiss('#test_43').hasClass('focus_passed')==true);
			swiss('#test_43').fire('dblclick');
			assert(swiss('#test_43').hasClass('blur_passed')==true);

			swiss('#test_44').fire('click');
			assert(swiss('#test_44').hasClass('passed')==true);
			
			swiss('#test_45').fire('click');
			assert(swiss('#test_45').hasClass('passed')==true);

		});
		
		
	}
});
