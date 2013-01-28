Ginger.parseUrlParams = function (query) {
	if (!query) query = location.search;
	var pos = query.indexOf('?');
	if (pos >= 0) query = query.substring(pos + 1);
	if (query.length == 0) return {};

	var paramArray = query.split("&");
	var params = {};
	for (var i = 0; i < paramArray.length; i++) {
		var nameValue = paramArray[i].split("=");
		if (nameValue.length == 2) {
			params[decodeURIComponent(nameValue[0]).toLowerCase()] = decodeURIComponent(nameValue[1]);
		}
	}
	return params;
};

Ginger.libs = {};

Ginger.loadLibrary = function (name) {
	if (Ginger.libs[name]) return;
	Ginger.libs[name] = true;
	switch (name) {
		case 'jquery-ui':
			Ginger.loadStyle('https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.24/themes/redmond/jquery-ui.css');
			Ginger.loadScript('https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.24/jquery-ui.min.js');
			break;
		case 'prettify':
			Ginger.loadStyle('https://js.cybozu.com/prettify/1-Jun-2011/prettify.css');
			Ginger.loadScript('https://js.cybozu.com/prettify/1-Jun-2011/prettify.js');
			break;
	};
};

Ginger.loadStyle = function (path) {
	var html = '<link rel="stylesheet" type="text/css" href="' + path + '" />';
	if (document.body) {
		$('head').append(html);
	} else {
		document.write(html);
	}
};

Ginger.loadScript = function (path) {
	if (document.body) {
		var script = document.createElement('script');
		script.src = path;
		document.body.appendChild(script);
	} else {
		document.write('<script type="text/javascript" src="' + path + '"></' + 'script>');
	}
};

Ginger.execModule = function (modules, follow) {
	for (var i = 0; i < modules.length; i++) {
		var module = modules[i];
		if (module.embed) continue;
		if (module.required || Ginger.settings[module.name]) {
			if (!follow) {
				module.func();
			} else if (module.followFunc) {
				module.followFunc();
			}
		}
	}
};

Ginger.execEmbed = function (modules, anchor) {
	for (var i = 0; i < modules.length; i++) {
		var module = modules[i];
		if (!module.embed) continue;
		if (module.required || Ginger.settings[module.name]) {
			module.func(anchor);
		}
	}
};

Ginger.htmlEscape = function (text) {
	return text ? text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#039;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : "";
};

Ginger.trim = function (text) {
	return text ? text.replace(/^\s*/, "").replace(/\s*$/, "") : '';
};


Ginger.settingsKey = 'GingerSettings';

Ginger.initSettingsDialog = function () {
	if (Ginger.settingsDialogInitialized) return;
	Ginger.settingsDialogInitialized = true;

	// categolize
	for (var i = 0; i < Ginger.modules.length; i++) {
		var module = Ginger.modules[i];
		var len = Ginger.categories.length;
		for (var j = 0; j < len; j++) {
			var category = Ginger.categories[j];
			if (module.name.indexOf(category.name) == 0) {
				if (!category.modules) category.modules = [];
				category.modules.push(module);
				break;
			}
		}
		if (j >= len) {
			var other = Ginger.categories[len - 1];
			if (!other.modules) other.modules = [];
			other.modules.push(module);
		}
	}

	// dialog
	var dlgHtml = '<div id="oc-settings-dialog" title="サイボウズ Office のカスタマイズ" style="font-size: 80%;">'
		+ '<p>カスタマイズする項目を選んでください。<br /><span style="color: red;">*</span> が付いたものは外すことができません。</p>'
		+ '<form><div id="oc-settings-tabs"><ul>';
	for (i = 0; i < Ginger.categories.length; i++) {
		var category = Ginger.categories[i];
		if (!category.modules) continue;
		dlgHtml += '<li><a href="#oc-settings-' + category.name + '">' + Ginger.htmlEscape(category.title) + '</a></li>';
	}
	dlgHtml += '</ul>';
	for (i = 0; i < Ginger.categories.length; i++) {
		var category = Ginger.categories[i];
		if (!category.modules) continue;
		dlgHtml += '<div id="oc-settings-' + category.name + '" class="oc-settings-panel">';
		for (var j = 0; j < category.modules.length; j++) {
			var module = category.modules[j];
			var checkboxAttr = module.required ? ' checked="checked" disabled="disabled"' : ' class="oc-settings-selectable"';
			var requiredMark = module.required ? ' <span style="color: red;">*</span>' : '';
			dlgHtml += '<div><input type="checkbox" id="' + module.name + '"' + checkboxAttr + ' /><label for="' + module.name + '">' + Ginger.htmlEscape(module.desc) + requiredMark + '</label></div>';
		}
		dlgHtml += '</div>';
	}
	dlgHtml += '</div></form></div>';
	$('body').append(dlgHtml);

	Ginger.reflectSettings();

	$('#oc-settings-tabs').tabs();
	$('#oc-settings-dialog').dialog({
		autoOpen: false,
		modal: true,
		width: 700,
		resizable: true,
		buttons: [{
			text: 'OK',
			click: function () {
				var json = '{';
				$('#oc-settings-dialog input:checked').each(function () {
					if (json != '{') json += ',';
					json += '"' + this.id + '":true';
				});
				json += '}';
				localStorage[Ginger.settingsKey] = json;
				Ginger.settings = eval('(' + json + ')');
				$(this).dialog('close');
				location.reload();
			}
		}, {
			text: 'キャンセル',
			click: function () {
				Ginger.reflectSettings();
				$(this).dialog('close');
			}
		}]
	});
};

Ginger.reflectSettings = function () {
	$('.oc-settings-selectable').each(function () {
		this.checked = Ginger.settings[this.id] ? true : false;
	});
};

(function () {
	// page name
	if (Ginger.page) return;
	var page = Ginger.page = CustomizeJS.page || 'AGIndex';

	// URL parameters
	Ginger.urlParams = Ginger.parseUrlParams();

	// modules
	Ginger.initModules = [];
	Ginger.commonModules = [];
	Ginger.pageModules = [];
	for (var i = 0; i < Ginger.modules.length; i++) {
		var module = Ginger.modules[i];
		var p = module.page;
		if (p === false) {
			Ginger.initModules.push(module);
		} else if (!p || p === true) {
			Ginger.commonModules.push(module);
		} else if (p == page) {
			Ginger.pageModules.push(module);
			if (module.embed) Ginger.embed = true;
			if (module.followFunc) Ginger.follow = true;
		} else if ($.isArray(p) && $.inArray(page, p) >= 0) {
			Ginger.pageModules.push(module);
			if (module.embed) Ginger.embed = true;
			if (module.followFunc) Ginger.follow = true;
		}
	}

	// libraries
	for (i = 0; i < Ginger.pageModules.length; i++) {
		var module = Ginger.pageModules[i];
		if (module.lib) {
			for (var j = 0; j < module.lib.length; j++) {
				Ginger.loadLibrary(module.lib[j]);
			}
		}
	}

	// load settings
	var settings = window.localStorage ? localStorage[Ginger.settingsKey] : null;
	Ginger.settings = settings ? eval('(' + settings + ')') : {};

	// init-modules
	Ginger.execModule(Ginger.initModules);
})();

$(document).ready(function () {
	var pm = Ginger.pageModules;
	Ginger.execModule(Ginger.commonModules);
	Ginger.execModule(pm);

	if (Ginger.embed) {
		$('tt a').each(function () {
			Ginger.execEmbed(pm, this);
		});
	}

	if ((Ginger.follow || Ginger.embed) && window.RenderFollows) {
		window.RenderFollowsOrig = window.RenderFollows;
		window.RenderFollows = function (append, dummy) {
			window.RenderFollowsOrig(append, dummy);

			var pm = Ginger.pageModules;
			Ginger.execModule(pm, true);

			if (Ginger.embed) {
				$('.vr_followList:last tt a').each(function () {
					Ginger.execEmbed(pm, this);
				});
			}
		}
	}

	if (!window.localStorage) return;

	var menuHtml = '<li><a id="oc-open-settings-link" href="javascript:void(0)">カスタマイズ</a></li>';
	$('.vr_headerPersonalSettings').parent().after(menuHtml);
	try {
		$('#oc-open-settings-link').click(function (event) {
			if ($.ui) {
				Ginger.initSettingsDialog();
				$('#oc-settings-dialog').dialog('open');
			} else {
				Ginger.loadLibrary('jquery-ui');
				setTimeout(function () {
					if ($.ui) {
						Ginger.initSettingsDialog();
						$('#oc-settings-dialog').dialog('open');
					} else {
						setTimeout(arguments.callee, 100);
					}
				}, 100);
			}
		});
	} catch (e) {
	}
});
