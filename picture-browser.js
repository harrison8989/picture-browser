//Picture Browser: Uses ajax to grab photos
//and display them in an appealling manner.
//Custom CS can be used to style the picture-browser.
(function initialize() {
	var folders = [];
	var folder = '';
	var photos = [];
	var pictureElem = document.getElementById("picture-browser");
	var metaFile = "files.txt";
	var photoURL = "";

	//Set up event listeners
	function addEvents() {

	}

	//Get photos from the directory
	function getPhotos(callback) {	
		var requestObj = new XMLHttpRequest();
		requestObj.addEventListener("load", function() {
			var rawPhotos = requestObj.responseText.split('\n');
			for(var i = 0; i < rawPhotos.length; i++) {
				if(rawPhotos[i].length > 0)
					photos.push(rawPhotos[i]);
			}
			callback();
		});
		requestObj.overrideMimeType('text/xml');
		requestObj.open("GET", folder + "/" + metaFile);
		requestObj.send();
	}

	function formatIMGURL(photo) {
		return "<img src=\"" + folder + "/" + photo + "\">";
	}

	//Add photos to the elements
	function addPhotos() {
		if(photos.length > 0) {
			var photoElem = document.getElementById("picture-browser-photo");
			var listElem = document.getElementById("picture-browser-list");
			photoElem.innerHTML = formatIMGURL(photos[0]);

			var ulElem = document.createElement("ul");
			photos.forEach(function(currPhoto) {
				var liElem = document.createElement("li");
				var aElem = document.createElement("a");
				aElem.innerHTML = formatIMGURL(currPhoto);
				aElem.setAttribute("href", "#");
				aElem.onclick = function() {
					photoElem.innerHTML = formatIMGURL(currPhoto);
					return false;
				}

				liElem.appendChild(aElem);
				ulElem.appendChild(liElem);
			});
			listElem.appendChild(ulElem);

			//add event listeners after photos have been added
			addEvents(photoElem, listElem);
		} else {
			pictureElem.innerHTML = "<p>No images were found!</p>";
		}
	}

	//Display the photos contained in one folder
	function displayPhotos(folderID) {
		folderID = folderID || 0;
		folder = folders[folderID];
		pictureElem.innerHTML = "";

		//create elements
		var photoElem = document.createElement("div");
		photoElem.setAttribute("id", "picture-browser-photo");
		var listElem = document.createElement("div");
		listElem.setAttribute("id", "picture-browser-list");
		pictureElem.appendChild(photoElem);
		pictureElem.appendChild(listElem);

		//add images
		var photos = getPhotos(addPhotos);
	}

	//Grab meta data from the html file to use folders
	function initMetas() {
		var metas = document.getElementsByTagName('meta');
		var folderString = '';
		for(var i = 0; i < metas.length; i++) {
			if(metas[i].getAttribute("name") === "picture-browser") {
				folderString = metas[i].getAttribute("content");
			}
		}
		if(folderString !== '') {
			rawFolders = folderString.split(',');
			for(var i = 0; i < rawFolders.length; i++) {
				folders.push(rawFolders[i].trim());
			}

			//display photos
			if(folders.length > 0)
				displayPhotos();
		}
	};

	(function init() {
		initMetas();
	})();
})();