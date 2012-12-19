iris.UI(function(self) {
	
	var _$fav, _$nofav;
	self.Create = function() {
		self.TemplateMode(self.TEMPLATE_APPEND);
		self.Template("twitfeed/template/twititem.html", self.Setting("twit"));
		_$nofav = self.$Get("nofav");
		_$fav = self.$Get("fav");
		
		self.Setting("twit")["fav"] == 1 ? _$nofav.hide() : _$fav.hide();
		
		_$fav.click(_unfavItem);
		_$nofav.click(_favItem);
		
		
	};
	
	function _changeItem(id, value){
		$.ajax({
			url:"http://projects/twitfeed/twitfeed.php",
			data: {action:"favTwit", id: id, value: value},
			type: "POST",
			dataType:"json",
			success: function(data){
				if (data == 1){
					if (value == 1) {
						_$nofav.hide();
						_$fav.show();
					} else {
						_$nofav.show();
						_$fav.hide();
					}
				}
			}
		});
	}
	
	function _favItem(){
		_changeItem(_$nofav.attr("twit"), 1);
		
	}
	
	function _unfavItem() {
		_changeItem(_$fav.attr("twit"), 0);
	}
});