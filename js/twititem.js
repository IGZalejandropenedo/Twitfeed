iris.UI(function(self) {
	self.Create = function() {
		self.TemplateMode(self.TEMPLATE_APPEND);
		self.Template("twitfeed/template/twititem.html", self.Setting("twit"));
		
		/*self.$Get("id").val(self.Setting("twit")["id"]);
		self.$Get("name").text(self.Setting("twit")["name"]);
		self.$Get("date").text(self.Setting("twit")["date"]);
		self.$Get("text").html(self.Setting("twit")["text"]);
		self.$Get("image").attr("src", self.Setting("twit")["image"]);*/
		self.$Get("fav").text(self.Setting("fav"));
	};
});