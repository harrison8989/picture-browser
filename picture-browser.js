//Picture Browser: Uses ajax to grab photos
//and display them in an appealling manner.
//Custom CS can be used to style the picture-browser.
(function initialize() {
	var folders = [];
	var folder = '';
	var photos = [];
	var pictureElem = document.getElementById("picture-browser");
	var selectWrapperElem;
	var photoElem;
	var listElem;
	var metaFile = "files.txt";
	var photoURL = "";

	//Get photos from the directory
	function getPhotos(callback) {	
		var requestObj = new XMLHttpRequest();
		requestObj.addEventListener("load", function() {
			var rawPhotos = requestObj.responseText.split('\n');

			//convert raw to new photos
			photos = []
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

	//Add photos to the elements. Used as a callback function
	function generateBrowserStructure() {
		if(photos.length > 0) {
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
		} else {
			pictureElem.innerHTML = "<p>No images were found!</p>";
		}
	}

	//Display the photos contained in one folder
	function displayPhotos(targetFolder) {
		folder = targetFolder || folders[0];

		//reset divs
		photoElem.innerHTML = "";
		listElem.innerHTML = "";

		//add images
		var photos = getPhotos(generateBrowserStructure);
	}

	//Create elements of document
	function initElements() {
		//select
		selectWrapperElem = document.createElement("div");
		selectWrapperElem.setAttribute("id", "picture-browser-select");
		var selectElem = document.createElement("select");
		for(var i = 0; i < folders.length; i++) {
			var optionElem = document.createElement("option");
			optionElem.setAttribute("value", folders[i]);
			optionElem.innerHTML = folders[i];
			selectElem.appendChild(optionElem);
		}
		selectWrapperElem.appendChild(selectElem);

		//add event handler for select
		selectElem.onchange = function(event) {
			displayPhotos(selectElem.value);
			return true;
		}

		//photo and list
		photoElem = document.createElement("div");
		photoElem.setAttribute("id", "picture-browser-photo");
		listElem = document.createElement("div");
		listElem.setAttribute("id", "picture-browser-list");

		//Actually add elements
		pictureElem.appendChild(selectWrapperElem);
		pictureElem.appendChild(photoElem);
		pictureElem.appendChild(listElem);
	}

	//Grab meta data from the html file to use folders
	function initMetas() {
		var metas = document.getElementsByTagName("meta");
		var folderString = '';
		for(var i = 0; i < metas.length; i++) {
			if(metas[i].getAttribute("name") === "picture-browser") {
				folderString = metas[i].getAttribute("content");
				break;
			}
		}
		if(folderString !== '') {
			rawFolders = folderString.split(',');
			for(var i = 0; i < rawFolders.length; i++) {
				folders.push(rawFolders[i].trim());
			}

			//display photos
			if(folders.length > 0) {
				initElements();
				displayPhotos();
			}
		}
	};

	(function init() {
		initMetas();
	})();
})();