testSuite("WEL - JavaScript API","wel/api.html", {
	run:function() {
	  test("Binding expression with App.on",function() {
	    App.on('app_on_test', "click then hidden");
			swiss('#app_on_test').fire('click');
			assert(swiss('#app_on_test').css('visibility')=='hidden');
	  });
	  
	  test("Binding expression using jQuery plugin", function() {
	    var itWorks = false;
	    if (jQuery) {
	      jQuery("#jquery_on_test").on("click then hidden");
	      swiss('#jquery_on_test').fire('click');
  			itWorks = (swiss('#jquery_on_test').css('visibility') == 'hidden');
	    }
	    else {
	      itWorks = true; //no jQuery, no problem
	    }
	    assert(itWorks);
	  });
	}
});