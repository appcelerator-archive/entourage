testSuite("Compiler","core/compiler.html", {
	run:function() {
		test("processor with limited tag support",function() {
			assert(swiss('.attr1').results.length == 2)
		});
		test("processor wildcard support",function() {
			assert(swiss('.attr2').results.length == 5)
		});
		
	}
});