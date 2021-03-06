function addTarget(hostname) {
	var elements = document.getElementsByTagName("a");
	for (var e of elements) {
		if(e.getAttribute("href") !== "#") {
			e.setAttribute("target", "_blank");
			e.setAttribute("rel", "nofollow");
			addSpecialTweaks(e, hostname);
		}
	}
}

function filter(hostname) {
	chrome.storage.local.get(null, function(items){
		for(var item in items){
		  var re = new RegExp( '^'+item.replace('*','.*')+'$' );
			if(re.test(hostname)){
				addTarget(hostname);
			}
		}
	});
}

function addSpecialTweaks(element, hostname){
	var regex = new RegExp('youtube');
	if(regex.test(hostname)){
		element.addEventListener('click', openinNew);
		element.removeAttribute("target");
	}
}

function clone(element) {
	var children = element.children;
	var clone = element.cloneNode(true);
	for (cas of clone.childNodes) {
		clone.removeChild(cas);
	}
	for (child of element.childNodes) {
		clone.appendChild(child);
	}
	element.parentNode.replaceChild(clone, element);
}

function openinNew(e) {
	e.stopPropagation();
	e.preventDefault();
	window.open(this.href, "_blank");
	window.stop();
}

var url = new URL(window.location.href);
filter(url.hostname);

var observer = new MutationObserver(function () {
	var url = new URL(window.location.href);
	filter(url.hostname);
});
observer.observe(document.body, {subTree: true, attributes: true});
