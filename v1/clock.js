__modules.push({
	name: 'CommonOfficeClock',
	desc: 'アプリケーションメニューにOffice時計を加える。',
	link: false,
	func: function () {
		var html = '<span class="appMenuItem"><a id="clock-popup" href="#"><span class="appmenuimg csssp csssp_dz_db32_png"></span><br />'
			+ '<span class="vr_naviAppMenu">Office時計</span></a></span>';
		$('#appIconMenuFrame div.vr_naviAppMenu').append(html);
		$('#clock-popup').click(function () {
			if (!Ginger.clockInitialized) {
				Ginger.clockInitialized = true;
				initializeClock();
			}
			$('#clock-dlg').toggle();
			return false;
		});

		function initializeClock() {
			var html = '<div id="clock-dlg"><div id="clock-title">Office時計</div><div id="clock-close">&times;</div><br style="clear: both" />'
				+ '<div id="clock-content"><div id="clock-time"></div><div id="cloc-sec"></div><div id="clock-other"></div></div></div>';
			$('body').append(html);
			var $dlg = $('#clock-dlg').css({ padding: '0px', background: '#dfe', border: '1px solid #aaa', position: 'aboslute', display: 'none', 'z-index': '9998' });
			$('#clock-title').css({ padding: '5px', width: '252px', float: 'left', background: '#cfd', cursor: 'move' });
			$('#clock-close').css({ positon: 'aboslute', top: '0px', left: '232px', padding: '5px', width: '20px', height: '20px', background: '#cfd', float: 'right', cursor: 'pointer' });
			$('#clock-content').css({ padding: '5px', 'text-align': 'center' });
			$('#clock-time').css({ 'margin-top': '5px', 'font-size': '45px' });
			$('#clock-sec').css({ 'font-size': '20px' });
			$('#clock-other').css({ 'font-size': '16px' });

			var wx = $(document).scrollLeft() + ($(window).width() - $dlg.outerWidth()) / 2;
			var wy = $(document).scrollTop() + ($(window).height() - $dlg.outerHeight()) / 2;
			$dlg.css({ top: wy, left: wx });
			$('#clock-close').click(function () { $('#clock-dlg').hide(); });
			$('#clock-title').mousedown(function (e) {
				var mx = e.pageX;
				var my = e.pageY;
				$(document).on('mousemove.clock-dlg', function (e) {
					wx += e.pageX - mx;
					wy += e.pageY - my;
					$('#clock-dlg').css({ top: wy, left: wx });
					mx = e.pageX;
					my = e.pageY;
					return false;
				}).one('mouseup', function (e) {
					$(document).off('mousemove.clock-dlg');
				});
				return false;
			});

			Ginger.OfficeClock = {
				day: -1,
				weekName: ['日', '月', '火', '水', '木', '金', '土'],
				rokuyouTable: {
					"2013":{"4-10":2,"5-1":5,"5-10":3,"6-1":1,"6-9":4,"7-1":2,"7-8":5,"8-1":5,"8-7":0,"9-1":1,"9-5":1,"10-1":3,"10-5":2,"11-1":5,"11-3":3,"12-1":1,"12-3":4},
					"2014":{"1-1":5,"1-31":0,"2-1":1,"3-1":1,"3-31":2,"4-1":3,"4-29":3,"5-1":5,"5-29":4,"6-1":1,"6-27":5,"7-1":3,"7-27":0,"8-1":5,"8-25":1,"9-1":2,"9-24":2,"10-1":3,"11-1":4,"11-22":3,"12-1":0,"12-22":4},
					"2015":{"1-1":2,"1-20":5,"2-1":5,"2-19":0,"3-1":4,"3-20":1,"4-1":1,"4-19":2,"5-1":2,"5-18":3,"6-1":5,"6-16":4,"7-1":1,"7-16":5,"8-1":3,"8-14":0,"9-1":0,"9-13":1,"10-1":1,"10-13":2,"11-1":3,"11-12":3,"12-1":4,"12-11":4},
					"2016":{"1-1":1,"1-10":5,"2-1":3,"2-8":0,"3-1":4,"3-9":1,"4-1":0,"4-7":2,"5-1":2,"5-7":3,"6-1":4,"6-5":4,"7-1":0,"7-4":5,"8-1":3,"8-3":0,"9-1":1,"10-1":2,"10-31":3,"11-1":4,"11-29":4,"12-1":0,"12-29":5},
					"2017":{"1-1":2,"1-28":0,"2-1":4,"2-26":1,"3-1":4,"3-28":2,"4-1":0,"4-26":3,"5-1":2,"5-26":4,"6-1":4,"6-24":4,"7-1":5,"7-23":5,"8-1":2,"8-22":0,"9-1":4,"9-20":1,"10-1":0,"10-20":2,"11-1":2,"11-18":3,"12-1":4,"12-18":4},
					"2018":{"1-1":0,"1-17":5,"2-1":2,"2-16":0,"3-1":1,"3-17":1,"4-1":4,"4-16":2,"5-1":5,"5-15":3,"6-1":2,"6-14":4,"7-1":3,"7-13":5,"8-1":0,"8-11":0,"9-1":3,"9-10":1,"10-1":4,"10-9":2,"11-1":1,"11-8":3,"12-1":2,"12-7":4},
					"2019":{"1-1":5,"1-6":5,"2-1":1,"2-5":0,"3-1":0,"3-7":1,"4-1":2,"4-5":2,"5-1":4,"5-5":3,"6-1":0,"6-3":4,"7-1":2,"7-3":5,"8-1":0,"8-30":1,"9-1":3,"9-29":2,"10-1":4,"10-28":3,"11-1":1,"11-27":4,"12-1":2,"12-26":5},
					"2020":{"1-1":5,"1-25":0,"2-1":1,"2-24":1,"3-1":1,"3-24":2,"4-1":4,"4-23":3,"5-1":5,"6-1":0,"6-21":4,"7-1":2,"7-21":5,"8-1":4,"8-19":0,"9-1":1,"9-17":1,"10-1":3,"10-17":2,"11-1":5,"11-15":3,"12-1":1,"12-15":4}
				},
				rokuyouName: ["先勝","友引","先負","仏滅","大安","赤口"]
			};

			setInterval(function () {
				var now = new Date();
				var h = nn(now.getHours());
				var m = nn(now.getMinutes());
				var s = nn(now.getSeconds());
				$('#clock-time').text(h + ':' + m);
				$('#clock-sec').text(s);

				var day = now.getDate();
				if (day == Ginger.OfficeClock.day) return;
				Ginger.OfficeClock.day = day;

				var year = now.getFullYear();
				var month = now.getMonth() + 1;
				var week = Ginger.weekName[now.getDay()];

				var rday = day;
				var diff = 0;
				while(!((String(month) + '-' + String(rday)) in Ginger.OfficeClock.rokuyouTable[String(year)])) {
					if (rday <= 0) break;
					diff++;
					rday--;
				}
				var rokuyou = '';
				if (rday > 0) {
					var rokuyouNum = (Ginger.OfficeClock.rokuyouTable[String(year)][String(month) + '-' + String(rday)] + diff) % 6;
					rokuyou = Ginger.OfficeClock.rokuyouName[rokuyouNum];
				}

				$('#clock-other').text(month + ' 月 ' + day + ' 日 (' + week + ') ' + rokuyou);
			}, 1000);
		}

		function nn(num) {
			return (num < 10) ? ('0' + num) : ('' + num);
		}
	}	
});
