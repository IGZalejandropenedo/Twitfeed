iris.Screen(
	function (self) {
		self.Create = function () {
			self.Template("twitfeed/template/main.html");
			self.InstanceUI("container", "twitfeed/js/main.js");
		}

		self.Awake = function () {
		}
		
		self.Sleep = function () {
		}
	}
);