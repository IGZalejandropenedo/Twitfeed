iris.UI(
	function (self) {
		// Tiempo entre requests
		var xhr = null;
		var timer = null;
		var timeInterval = 1000;
		var allItems = new Array();
		
		var _$txtSearch, _$btnStart, _$btnStop, _$btnFavs;
		
		self.Create = function () {
			self.Template("twitfeed/template/content.html");
			(_$btnStart = self.$Get("btnStart")).mousedown(_GetTwits);
			(_$btnStop  = self.$Get("btnStop") ).mousedown(_AbortRequest);
			(_$btnFavs  = self.$Get("btnFavs") ).mousedown(_GetFavTwits);
			_$txtSearch = self.$Get("txtSearch");
		}
			
		function _GetFavTwits(){
			$.ajax({
					url:"http://projects/twitfeed/twitfeed.php",
					data: {action:"getFavTwits"},
					type: "POST",
					dataType:"json",
					beforeSend: function(){
						self.DestroyAllUIs("twit-container");
					},
				  success: function(data){
						$.each(data, function(index, item) {
							self.InstanceUI("twit-container", "twitfeed/js/twititem.js", { "twit" : $.extend(item, {"fav" : 1})})
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
						self.InstanceUI("twit-container", "twitfeed/js/twititem.js", { "twit" : $.extend(twit, {"fav" : 0})});
					}
				}
			});
		}
		
		function _AbortRequest(){
			// UI Management
			_$btnStop.hide();
			_$btnStart.show();
			_$btnFavs.removeAttr("disabled");
			_$txtSearch.removeAttr("disabled");
			
			
			// Abort Handling
			if(xhr != null) {
				xhr.abort();
				xhr = null;
			}
			allItems = new Array();
			clearInterval(timer);
		}
		
		function _GetTwits() {
			// UI Management
			_$btnStop.show();
			_$btnStart.hide();
			_$btnFavs.attr("disabled", "disabled");
			_$txtSearch.attr("disabled", "disabled");
			//self.$Get("twit-container").html("");
			self.DestroyAllUIs("twit-container");
			
			// Request
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
		}
		
		self.Sleep = function () {
		}
	}
);