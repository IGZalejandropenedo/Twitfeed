iris.UI(
	function (self) {
		// Tiempo entre requests
		var xhr = null;
		var timer = null;
		var timeInterval = 1000;
		var allItems = new Array();
		
		var _$txtSearch;
		
		self.Create = function () {
			console.log("UI Create");
			self.Template("twitfeed/template/content.html");
			self.$Get("btnSearch").mousedown(_GetTwits);
			self.$Get("btnFavs").mousedown(_GetFavTwits);
			_$txtSearch = self.$Get("txtSearch");
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
		
		function _CheckSize(element, index, array) {
  		return (element.length > 0);
		}
		
		function _GenTwitElements(elements){
			var items = elements.split("\n");
			items = items.filter(_CheckSize);
			$.each(items, function(index, value){
				if (value.length > 0) {
					if(allItems.indexOf(value) == -1){
						allItems.push(value);
						var twit = JSON.parse(value);
						self.InstanceUI("twit-container", "twitfeed/js/twititem.js", { "twit" : twit, "fav": 0 });
					}
				}
			});
		}
		
		function _GetTwits() {
			// Almacenamos la peticion para poder abotarla en cuanto
			// se de a stop
			xhr = new XMLHttpRequest();
    	xhr.open('GET', 'http://projects/twitfeed/twitfeed.php?action=getTwits&keyword='+_$txtSearch.val(), true);
    	xhr.send();
    	
    	timer = window.setInterval(function() {
    		if (xhr == null) {
    			window.clearTimeout(timer);
    		} else {
	    		switch(xhr.readyState){
	    			case(XMLHttpRequest.DONE): {
	    				window.clearTimeout(timer);
	    				break;
	    			}
	    			case(XMLHttpRequest.LOADING): {
	    				_GenTwitElements(xhr.responseText);
	    				break;
	    			}
	    		}
	      }
      }, timeInterval);	
		}
	
		self.Awake = function () {
			console.log("UI Awake");
		}
		
		self.Sleep = function () {
			console.log("UI Sleep");
		}
	}
);