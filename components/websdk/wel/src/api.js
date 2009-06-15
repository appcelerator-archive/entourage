//
// Add support for creating on expressions via JS
//
(function() {
  App.on = function(id, expr) {
    App.Wel.compileExpression(swiss("#"+id).get(0),expr,false);
  }
  
  if (jQuery) {
  	(function($) {
  		$.fn.on = function(expr) {
  			return this.each(function() {
  				App.Wel.compileExpression(this,expr,false);
  			});
  		}
  	})(jQuery);
  }
  
})();
