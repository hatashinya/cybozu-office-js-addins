__modules.push({
	name: 'CommonWareki',
	desc: 'アプリケーションメニューに和暦変換を加える。',
	link: true,
	func: function () {
		var html = '<span class="appMenuItem"><a id="wareki-popup" href="#"><span class="appmenucss appMenuDBIndex"></span><br />'
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
				+ '<div id="wareki-content"><div class="wareki-field-title">和暦</div><div>'
				+ '<label for="wareki-taisho"><input type="radio" id="wareki-taisho" name="wareki-nengo" value="t" />大正</label>'
				+ '<label for="wareki-showa"><input type="radio" id="wareki-showa" name="wareki-nengo" value="s" />昭和</label>'
				+ '<label for="wareki-heisei"><input type="radio" id="wareki-heisei" name="wareki-nengo" value="h" checked="checked" />平成</label>'
				+ '</div><div><input type="text" id="wareki-wareki" />年</div><div>'
				+ '<input type="button" id="wareki2year" value="和暦から西暦↓" />'
				+ '<input type="button" id="year2wareki" value="↑西暦から和暦" />'
				+ '</div><div class="wareki-field-title">西暦</div><input type="text" id="wareki-year" />年</div></div>';
			$('body').append(html);
			var $dlg = $('#wareki-dlg').css({ padding: '0px', background: '#dfe', border: '1px solid #aaa', position: 'absolute', display: 'none', 'z-index': '9998' });
			$('#wareki-title').css({ padding: '5px', width: '250px', height: '24px', float: 'left', background: '#cfd', cursor: 'move' });
			$('#wareki-close').css({ padding: '5px', width: '24px', height: '24px', float: 'right', background: '#cfd', cursor: 'pointer', 'text-align': 'center' });
			$('#wareki-content').css({ padding: '5px', 'text-align': 'center' });
			$('#wareki-content input[type=text]').css({ 'margin-bottom': '5px', padding: '5px', width: '200px', 'text-align': 'right' });
			$('#wareki-content input[type=button]').css({ padding: '5px', width: '100px' });
			$('.wareki-field-title').css('font-weight', 'bold');
			$('#wareki2year').click(function () { wareki2year(); });
			$('#year2wareki').click(function () { year2wareki(); });
			$('#wareki-wareki').keydown(function (event) { if (event.which == 13) wareki2year(); });
			$('#wareki-year').keydown(function (event) { if (event.which == 13) year2wareki(); });

			var wx = $(document).scrollLeft() + ($(window).width() - $dlg.outerWidth()) / 2;
			var wy = $(document).scrollTop() + ($(window).height() - $dlg.outerHeight()) / 2;
			$dlg.css({ top: wy, left: wx });
			$('#wareki-close').click(function () { $('#wareki-dlg').hide(); });
			$('#wareki-title').mousedown(function (e) {
				var mx = e.pageX;
				var my = e.pageY;
				$(document).on('mousemove.wareki-dlg', function (e) {
					wx += e.pageX - mx;
					wy += e.pageY - my;
					$('#wareki-dlg').css({ top: wy, left: wx });
					mx = e.pageX;
					my = e.pageY;
					return false;
				}).one('mouseup', function (e) {
					$(document).off('mousemove.wareki-dlg');
				});
				return false;
			});
		}

		function wareki2year() {
			var wareki = $('#wareki-wareki').val();
			if (wareki.match(/[^0-9]+/)) {
				alert('整数を入力してください。');
			} else {
				wareki = parseInt(wareki, 10);
				switch ($('#wareki-content input[name="wareki-nengo"]:checked').val()) {
					case 'h': $('#wareki-year').val(wareki + 1988); break;
					case 's': $('#wareki-year').val(wareki + 1925); break;
					case 't': $('#wareki-year').val(wareki + 1911); break;
				}
			}
		}

		function year2wareki() {
			var year = $('#wareki-year').val();
			if (year.match(/[^0-9]+/)) {
				alert('整数を入力してください。');
			} else {
				year = parseInt(year, 10);
				if (year >= 1990) {
					$('#wareki-content input[name="wareki-nengo"]').val(['h']);
					$('#wareki-wareki').val(year - 1988);
				} else if (year == 1989) {
					$('#wareki-content input[name="wareki-nengo"]').removeAttr('checked');
					$('#wareki-wareki').val('昭和64/平成1');
				} else if (year >= 1927) {
					$('#wareki-content input[name="wareki-nengo"]').val(['s']);
					$('#wareki-wareki').val(year - 1925);
				} else if (year == 1926) {
					$('#wareki-content input[name="wareki-nengo"]').removeAttr('checked');
					$('#wareki-wareki').val('大正15/昭和1');
				} else if (year >= 1912) {
					$('#wareki-content input[name="wareki-nengo"]').val(['t']);
					$('#wareki-wareki').val(year - 1911);
				} else {
					alert('対応範囲を超えています。');
				}
			}
		}
	}	
});
