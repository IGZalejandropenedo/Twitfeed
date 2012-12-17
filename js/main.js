iris.UI(
	function (self) {
		self.Create = function () {
			console.log("UI Create");
			self.Template("twitfeed/template/content.html");
			self.$Get("btnSearch").mousedown(_Greet);
			self.$Get("btnFavs").mousedown(_GetFavTwits);
		}

		function _Greet () {
			console.log("Hi " + self.Setting("name") + "!");
		}
				
		function _GetFavTwits(){
			$.ajax({
					url:"http://projects/twitfeed/twitfeed.php",
					data: {action:"getFavTwits"},
					type: "POST",
					dataType:"json",
				  success: function(data){
						$.each(data, function(index, item) {
							self.InstanceUI("twit-container", "twitfeed/js/twititem.js", { "twit" : item, "fav": 1 });
						});
					}
			});
		}
	
		self.Awake = function () {
			console.log("UI Awake");
		}
		
		self.Sleep = function () {
			console.log("UI Sleep");
		}
	}
);