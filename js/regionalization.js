window.onload = function() {
		languageSelector(window.navigator.language);
};

//Language Selector(lang)
function languageSelector(lang) {
		var l = lang.substring(0,2);
		
		if (l == "pt") {
				window.location.assign("http://hiveorama.com/pt");
		}
}