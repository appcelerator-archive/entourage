testSuite("WEL - DOM conditions","wel/dom_conditions.html",
{
	run:function()
	{
		test("click",function()
		{
			swiss('#click_test').fire('click');
			assert(swiss('#click_test').css('display')=='none')
		});
		test("focus",function()
		{
			swiss('#focus_test').fire('focus');
			assert(swiss('#focus_test').css('display')=='none')
		});
		test("blur",function()
		{
			swiss('#blur_test').fire('blur');
			assert(swiss('#blur_test').css('display')=='none')
		});
		testAsync("change input - same value",2000,function()
		{
			swiss('#input_change').get(0).value = 'text';
			assertAfter(swiss('#input_change').css('display')!='none',600,true);
		});
		testAsync("change input - different value",2000,function()
		{
			swiss('#input_change').get(0).value = 'text1';
			assertAfter(swiss('#input_change').css('display')=='none',600,true);
		});
		testAsync("change select - same value",2000,function()
		{
			swiss('#select_change').get(0).selectedIndex = 0;
			assertAfter(swiss('#select_change').css('display')!='none',600,true);
		});
		testAsync("change select - different value",2000,function()
		{
			swiss('#select_change').get(0).selectedIndex = 1;
			assertAfter(swiss('#select_change').css('display')=='none',600,true);				
		});
		testAsync("change div - same value",2000,function()
		{
			swiss('#div_change').get(0).innerHTML = 'text';
			assertAfter(swiss('#div_change').css('display')!='none',600,true)
		});
		testAsync("change div - different value",2000,function()
		{
			swiss('#div_change').get(0).innerHTML = 'text1';
			assertAfter(swiss('#div_change').css('display')=='none',600,true)	
		});
		test("dblclick",function()
		{
			swiss('#dblclick_test').fire('dblclick');
			assert(swiss('#dblclick_test').css('display')=='none')	
		});
		test("select",function()
		{
			swiss('#select_test').fire('select');
			assert(swiss('#select_test').css('display')=='none')	
		});
		test("submit",function()
		{
			swiss('#submit_test').fire('submit');
			assert(swiss('#submit_test').css('display')=='none')	
		});
		test("resize",function()
		{
			swiss('#resize_test').fire('resize');
			assert(swiss('#resize_test').css('display')=='none')	
		});

		test("mouseover",function()
		{
			swiss('#mouseover_test').fire('mouseover');
			assert(swiss('#mouseover_test').css('display')=='none')	
		});
		test("mousedown",function()
		{
			swiss('#mousedown_test').fire('mousedown');
			assert(swiss('#mousedown_test').css('display')=='none')	
		});
		test("mouseout",function()
		{
			swiss('#mouseout_test').fire('mouseout');
			assert(swiss('#mouseout_test').css('display')=='none')	
		});
		test("mousemove",function()
		{
			swiss('#mousemove_test').fire('mousemove');
			assert(swiss('#mousemove_test').css('display')=='none')	
		});
		test("mouseup",function()
		{
			swiss('#mouseup_test').fire('mouseup');
			assert(swiss('#mouseup_test').css('display')=='none')	
		});
		test("mousewheel",function()
		{
			swiss('#mousewheel_test').fire('mousewheel');
			assert(swiss('#mousewheel_test').css('display')=='none')	
		});
		test("contextmenu",function()
		{
			swiss('#contextmenu_test').fire('contextmenu');
			assert(swiss('#contextmenu_test').css('display')=='none')	
		});
		test("scroll",function()
		{
			swiss('#scroll_test').fire('scroll');
			assert(swiss('#scroll_test').css('display')=='none')	
		});
		test("load",function()
		{
			swiss('#load_test').fire('load');
			assert(swiss('#load_test').css('display')=='none')	
		});
		test("unload",function()
		{
			swiss('#unload_test').fire('unload');
			assert(swiss('#unload_test').css('display')=='none')	
		});
		test("select",function()
		{
			swiss('#select_test2').fire('click');
			assert(swiss('#select_test2').hasClass('passed')==true)	
		});

		
	}
});