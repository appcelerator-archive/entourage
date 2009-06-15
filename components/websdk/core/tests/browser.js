testSuite("Browser","core/browser.html", {
	run:function() {
		test("browser variables",function() {		 
			assert(App.Browser.isOpera != 'undefined');
			assert(App.Browser.isSafari != 'undefined');
			assert(App.Browser.isSafari2 != 'undefined');
			assert(App.Browser.isSafari3 != 'undefined');
			assert(App.Browser.isIE != 'undefined');
			assert(App.Browser.isIE6 != 'undefined');
			assert(App.Browser.isIE7 != 'undefined');
			assert(App.Browser.isIE8 != 'undefined');
			assert(App.Browser.isGecko != 'undefined');
			assert(App.Browser.ua != 'undefined');
			assert(App.Browser.isCamino != 'undefined');
			assert(App.Browser.isFirefox != 'undefined');
			assert(App.Browser.isIPhone != 'undefined');
			assert(App.Browser.isWebkit != 'undefined');
			assert(App.Browser.isSeamonkey != 'undefined');
			assert(App.Browser.isPrism != 'undefined');
			assert(App.Browser.isIceweasal != 'undefined');
			assert(App.Browser.isEpiphany != 'undefined');
			assert(App.Browser.isBrowserSupported != 'undefined');
			assert(App.Browser.flashVersion != 'undefined');
			assert(App.Browser.isFlash != 'undefined');
			assert(App.Browser.silverlightVersion != 'undefined');
			assert(App.Browser.isSilverlight != 'undefined');
			assert(App.Browser.isSunOS != 'undefined');
			assert(App.Browser.isLinux != 'undefined');
			assert(App.Browser.isMac != 'undefined');
			assert(App.Browser.isWindows != 'undefined');
			assert(App.Browser.isChromium != 'undefined');
			assert(App.Browser.isGears != 'undefined');
			assert(App.Browser.isFluid != 'undefined');
		});
		testAsync("browser classes and os classes",2000,function() {	
			assertAfter(swiss(document.body).hasClass('win32') == App.Browser.isWindows,800);
			assertAfter(swiss(document.body).hasClass('mac') == App.Browser.isMac,800);
			assertAfter(swiss(document.body).hasClass('linux') == App.Browser.isLinux,800);
			assertAfter(swiss(document.body).hasClass('sun') ==  App.Browser.isSunOS,800);
			assertAfter(swiss(document.body).hasClass('mozilla') == App.Browser.isMozilla,800);
			assertAfter(swiss(document.body).hasClass('iphone') == App.Browser.isIPhone,800);
			assertAfter(swiss(document.body).hasClass('chromium') == App.Browser.isChromium,800);
			assertAfter(swiss(document.body).hasClass('webkit') == App.Browser.isSafari,800);
			assertAfter(swiss(document.body).hasClass('safari2') == App.Browser.isSafari2,800);
			assertAfter(swiss(document.body).hasClass('safari3') == App.Browser.isSafari3,800);
			assertAfter(swiss(document.body).hasClass('gecko') == App.Browser.isGecko,800);
			var ff3=false;
			if (App.Browser.ua.indexOf('firefox\/3') != -1) {
				ff3 = true;
			}
			assertAfter(swiss(document.body).hasClass('firefox3') == ff3,800);
			var ff2=false;
			if (App.Browser.ua.indexOf('firefox\/2') != -1) {
				ff2= true;
			}
			assertAfter(swiss(document.body).hasClass('firefox2') == ff2,800);
			assertAfter(swiss(document.body).hasClass('msie') == App.Browser.isIE,800);
			assertAfter(swiss(document.body).hasClass('ie6') == App.Browser.isIE6,800);
			assertAfter(swiss(document.body).hasClass('ie7') == App.Browser.isIE7,1000,true);

		});
		testAsync("browser classes - height",2000,function() {	
		    var height = parseInt(swiss(document).height());
			assertAfter(swiss(document.body).hasClass('height_tiny') == (height < 480),800);
			assertAfter(swiss(document.body).hasClass('height_small') == (height >= 480 && height <=768) ,800);
			assertAfter(swiss(document.body).hasClass('height_medium') == (height >= 768 && height < 1100),800);
			assertAfter(swiss(document.body).hasClass('height_large') == (height >= 1100) ,1000,true);

		});
		testAsync("browser classes - width",2000,function() {	
	        var width = parseInt(swiss(document).width());
			assertAfter(swiss(document.body).hasClass('width_tiny') == (width<=640),800);
			assertAfter(swiss(document.body).hasClass('width_small') == (width>640 && width <=1024),800);
			assertAfter(swiss(document.body).hasClass('width_medium') == (width>1024 && width <=1280),800);
			assertAfter(swiss(document.body).hasClass('width_large') == (width>1280) ,1000,true);
		});
	}
})
