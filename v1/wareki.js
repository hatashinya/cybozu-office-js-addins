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
			var html = '<div id="wareki-dlg"><div id="wareki-title">和暦変換</div><div id="wareki-close">&times;</div><br style="clear: both;" />'
				+ '<div id="wareki-content"><div class="wareki-field-title">和暦</div>'
				+ '<input type="radio" name="wareki-nengo" value="t" /><label>大正</label>'
				+ '<input type="radio" name="wareki-nengo" value="s" /><label>昭和</label>'
				+ '<input type="radio" name="wareki-nengo" value="h" checked="checked" /><label>平成</label><br />'
				+ '<input type="text" id="wareki-year" />年<br />'
				+ '<input type="button" id="wareki2year" value="和暦から西暦↓" />'
				+ '<input type="button" id="year2wareki" value="↑西暦から和暦" /><br />'
				+ '<div class="wareki-field-title">西暦</div><input type="text" id="wareki_new_year" />年</div></div>';
			$('body').append(html);
			var $dlg = $('#wareki-dlg').css({ padding: '0px', background: '#dfe', border: '1px solid #aaa', width: '220px', height: '180px', position: 'absolute', display: 'none', 'z-index': '9998' });
			$('#wareki-title').css({ width: '198px', height: '22px', float: 'left', background: '#cfd', cursor: 'move' });
			$('#wareki-close').css({ positon: 'aboslute', top: '0px', left: '198px', width: '22px', height: '22px', background: '#cfd', float: 'right', cursor: 'pointer' });
			$('#wareki-content').css({ padding: '0', width: '220px', height: '158px', 'text-align': 'center' });
			$('#wareki-content input[type=text]').css({ width: '160px', 'text-align': 'right' });
			$('#wareki-content input[type=button]').css('width', '100px');
			$('.wareki-field-title').css('font-weight', 'bold');

			var wx = $(document).scrollLeft() + ($(window).width() - $dlg.outerWidth()) / 2;
			var wy = $(document).scrollTop() + ($(window).height() - $dlg.outerHeight()) / 2;
			$dlg.css({ top: wy, left: wx });
			$('#wareki-close').click(function () { $('#wareki-dlg').hide(); });
		}
	}	
});
