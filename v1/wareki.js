__modules.push({
	name: 'CommonWareki',
	desc: 'アプリケーションメニューに和暦変換を加える。',
	link: false,
	func: function () {
		var html = '<span class="appMenuItem"><a id="wareki-popup" href="#"><span class="appmenuimg csssp csssp_dz_db32_png"></span><br />'
			+ '<span class="vr_naviAppMenu">和暦変換</span></a></span>';
		$('#appIconMenuFrame div.vr_naviAppMenu').append(html);
		$('#wareki-popup').click(function () {
			if (!Ginger.warekiInitialized) {
				Ginger.warekiInitialized = true;
				initializeWareki();
			}
			$('#wareki-dlg').toggle();
			return false;
		});

		function initializeWareki() {
		}
	}	
});
