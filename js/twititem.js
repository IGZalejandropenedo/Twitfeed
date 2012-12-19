iris.UI(function(self) {
	self.Create = function() {
		self.TemplateMode(self.TEMPLATE_APPEND);
		self.Template("twitfeed/template/twititem.html", self.Setting("twit"));
		iris.L(self.Setting("twit"));
		self.Setting("twit")["fav"] == 1 ? self.$Get("nofav").hide() : self.$Get("fav").hide() ;
	};
});