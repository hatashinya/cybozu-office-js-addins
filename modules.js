__modules.push({
	name: 'CommonHideAppMenuToggler',
	desc: 'アプリケーションメニューの開閉ボタンを隠す。',
	link: true,
	func: function () {
		$('#appmenuToggler').hide().parent().css('border-bottom', '1px solid #999');
	}
});

__modules.push({
	name: 'CommonStandardizeButton',
	desc: 'オレンジ色のボタンを通常表示にする。',
	link: true,
	func: function () {
		$('input.vr_hotButton').removeClass('vr_hotButton').addClass('vr_stdButton');
		$('button.vr_hotButton').removeClass('vr_hotButton').addClass('vr_stdButton');
	}
});

__modules.push({
	name: 'CommonStandardizeLink',
	desc: 'オレンジ色のリンクを通常表示にする。',
	link: true,
	func: function () {
		$('a.vr_hotButton').removeClass('vr_hotButton');
	}
});

__modules.push({
	name: 'HeaderHideSearchBox',
	desc: '検索ボックスを隠す。',
	link: true,
	func: function () {
		$('.vr_headbarSearch form').hide();
	}
});

__modules.push({
	name: 'HeaderHideAppMenu',
	desc: '「メニュー」を隠す。',
	link: true,
	func: function () {
		$('#header-menu-application').hide();
	}
});

__modules.push({
	name: 'HeaderHideLinkList',
	desc: '「リンク」を隠す。',
	link: true,
	func: function () {
		$('#header-menu-linklist').hide();
	}
});

__modules.push({
	name: 'ThreadEnlargeUserIcons',
	desc: 'ユーザーのアイコンのサイズを 32x32 で表示する。',
	link: true,
	page: ['BulletinView', 'MyFolderMessageView'],
	func: function () {
		Ginger.enlargeUserIcons = function ($parent) {
			$parent.find('img.profileImage[src*="20x20.png"]').each(function () {
				this.src = this.src.replace('20x20.png', '32x32.png').replace('Width=20', 'Width=32').replace('Height=20', 'Height=32');
				$(this).css('width', '32px').css('height', '32px').css('margin', '0 8px');
			});
			var userImg = $parent.find('img.profileImage[src*="user20.png"]');
			if (userImg.length) {
				userImg.attr('src', userImg.attr('src').replace('/user20.png', '/user32.png').replace('/suspenduser20.png', '/suspenduser48.png')).css('width', '32px').css('height', '32px').css('margin', '0 8px');
			}
		};
		Ginger.enlargeUserIcons($('.vr_contentArea'));

		if (window.ProcessResponseForFollowAdd) {
			window.ProcessResponseForFollowAddOrig = window.ProcessResponseForFollowAdd;
			window.ProcessResponseForFollowAdd = function (res) {
				window.ProcessResponseForFollowAddOrig(res);
				Ginger.enlargeUserIcons($('.vr_followInputUserName'));
			};
		}
	},
	followFunc: function () {
		Ginger.enlargeUserIcons($('.vr_followList:last'));
	}
});

__modules.push({
	name: 'ThreadCodePrettify',
	desc: '{code}...{/code}で囲まれたコードに対して、シンタックスハイライトを行う。',
	link: true,
	page: ['BulletinView', 'MyFolderMessageView'],
	lib: ['prettify'],
	func: function () {
		var html = '<input type="button" class="vr_stdButton" value="{code}" />';
		$(html).prependTo('.vr_followInputToggleButton').click(function () {
			var $data = $('textarea#Data');
			var textarea = $data.get(0);
			textarea.focus();
			var pos = textarea.selectionStart;
			var value = $data.val();
			value = value.substr(0, pos) + "{code}\n\n{/code}\n" + value.substr(pos);
			$data.val(value);
			pos = pos + 7;
			textarea.setSelectionRange(pos, pos);
			textarea.focus();
		});

		Ginger.codePrettify = function ($this) {
			var html = $this.html();
			if (html.indexOf('{code') < 0 || html.indexOf('{/code}') < 0) return false;

			var inCode = false;
			var noLF = (html.indexOf("\n") < 0);
			var lines = noLF ? html.split('<BR>') : html.split("\n<br>");
			html = '';
			for (var i = 0; i < lines.length; i++) {
				var line = lines[i];
				if (inCode) {
					if (line.indexOf('{/code}') >= 0) {
						html += line.replace('{/code}', '</pre>');
						inCode = false;
					} else {
						html += line + (noLF ? "\n" : '');
					}
				} else {
					if (line.indexOf('{code') >= 0) {
						html += line.replace(/{code\s*(brush:\s*|)([^}]*)}/, '<pre class="prettyprint lang-$2">');
						inCode = true;
					} else {
						html += line + '<br />';
					}
				}
			}
			if (inCode) html += '</pre>';
			$this.html(html);
			return true;
		};

		var prettify = false;
		$('tt').each(function () {
			if (Ginger.codePrettify($(this))) prettify = true;
		});

		if (prettify) {
			prettyPrint();
			$('pre.prettyprint').css('font-family', "Consolas, 'Bitstream Vera Sans Mono', 'Courier New', Courier, monospace")
				.css('padding', '0.5em').css('line-height', '1.1').css('background', '#fff');
		}
	},
	followFunc: function () {
		var prettify = false;
		var $lastFollowList = $('.vr_followList:last tt').each(function () {
			if (Ginger.codePrettify($(this))) prettify = true;
		});

		if (prettify) {
			prettyPrint();
			$lastFollowList.find('pre.prettyprint').css('font-family', "Consolas, 'Bitstream Vera Sans Mono', 'Courier New', Courier, monospace")
				.css('padding', '0.5em').css('line-height', '1.1').css('background', '#fff');
		}
	}
});

__modules.push({
	name: 'ThreadEmbedYouTube',
	desc: 'YouTube 動画をインライン表示する。',
	link: true,
	page: ['BulletinView', 'MyFolderMessageView'],
	embed: true,
	func: function (anchor) {
		var id;
		var href = anchor.href;
		if (href.indexOf('http://www.youtube.com/') == 0 || href.indexOf('https://www.youtube.com/') == 0) {
			if (!href.match(/v=([a-zA-Z0-9]+)/)) return;
			id = RegExp.$1;
		} else if (href.indexOf('http://youtu.be/') == 0) {
			id = href.substr(href.lastIndexOf('/') + 1);
		} else {
			return;
		}
		$(anchor).after('<div><iframe width="420" height="315" src="https://www.youtube.com/embed/' + id + '" frameborder="0" allowfullscreen></iframe></div>');
	}
});

__modules.push({
	name: 'ThreadToDoMenuOnFollow',
	desc: '「ToDoに登録する」メニューをフォローに加える。',
	link: true,
	page: ['BulletinView', 'MyFolderMessageView', 'ToDoEntry'],
	func: function () {
		if (CustomizeJS.page == 'ToDoEntry') {
			if (Ginger.urlParams.from == 'follow' && sessionStorage.GingerToDoEntryURL) {
				var url = sessionStorage.GingerToDoEntryURL;
				var text = sessionStorage.GingerToDoEntryText;

				var title = '';
				var lines = text.split("\n");
				for (var i = 0; i < lines.length; i++) {
					title = Ginger.trim(lines[i]);
					if (!title) continue;
					if (title.indexOf('>') == 0) continue;
					break;
				}

				// substitute title and URL
				var $form = $('form[name="ToDoEntry"]');
				$form.find('input:text[name="Name"]').val(title);
				$form.find('textarea[name="Memo"]').val(url + "\n\n-----\n" + text);

				sessionStorage.GingerToDoEntryURL = '';
				sessionStorage.GingerToDoEntryText = '';
			}
		} else {
			Ginger.prependToDoMenu = function () {
				$parent = $('.vr_followList:last');
				var html = '<span class="followMenuLinkWrapper vr_iconUrlTip"><a class="follow-todo" href="ag.cgi?page=ToDoEntry&from=follow" target="_blank"><span class="csssp csssp_todo16_png cssspOpt"></span>ToDoに登録する</a></span>';
				$parent.find('.followMenuSub').prepend(html);
				$parent.find('.follow-todo').click(function () {
					sessionStorage.GingerToDoEntryText = $(this).parents('.vr_follow').find('.vr_followContents tt').text().replace(/\r/g, '').replace("\n\n", "\n");

					var onClick = $(this).parent().next().find('a').attr('onclick');
					start = onClick.indexOf('https://');
					var end = onClick.indexOf('#Follow');
					if (start < 0 || end < 0) return false;
					sessionStorage.GingerToDoEntryURL = onClick.substring(start, end) + '#Follow';
				});
			};
			Ginger.prependToDoMenu();
		}
	},
	followFunc: function () {
		if (Ginger.prependToDoMenu) Ginger.prependToDoMenu();
	}
});

__modules.push({
	name: 'BulletinHideListPerCategory',
	desc: '掲示板のトップで、カテゴリごとの掲示一覧を隠す。',
	link: true,
	func: function () {
		$('table.mutlicol').hide();
	}
});

__modules.push({
	name: 'WorkFlowConfirmBeforeApprove',
	desc: 'ワークフローの承認・決裁のとき、ボタン押下の後に確認ダイアログを表示する。',
	link: true,
	page: 'WorkFlowHandle',
	func: function () {
		$('input[name="Approve"]').click(function () {
			var caption = $(this).val();
			var action = (caption.indexOf('決裁') >= 0) ? '決裁' : '承認';
			return confirm(action + 'します。よろしいですか？');
		});
	}
});

__modules.push({
	name: 'TimeCardFutureNote',
	desc: 'タイムカードで、未来の日付の備考欄に書き込みできるようにする。',
	link: true,
	page: 'TimeCardIndex',
	func: function () {
		var yearMonth = $('div.vr_eNavi').text();
		var m = yearMonth.match(/([0-9]{4})\s+.*\s+([0-9]+)\s+/);
		if (!m) return;
		var year1st = RegExp.$1;
		var year = year1st;
		var month1st = RegExp.$2;
		var month = month1st;
		var day1st = null;
		$('table.vr_borderTable tr').each(function () {
			var tds = $(this).find('td');
			var dayTd = tds.first();
			if (!dayTd.length) return;
			var dayText = dayTd.text();
			var day = null;
			m = dayText.match(/([0-9]+)\/([0-9]+)/);
			if (m) {
				month = RegExp.$1;
				if (month != month1st && month == 1) year = parseInt(year1st, 10) + 1;
				day = RegExp.$2;
			} else {
				m = dayText.match(/[0-9]+/);
				if (m) day = m;
			}
			if (day) {
				if (!day1st) day1st = day;
				var linkTd = tds.last();
				if (linkTd.find("a").length == 0) {
					linkTd.prepend('<a class="" href="ag.cgi?page=TimeCardModify&UID=&gid=&BDate=da.' + year1st + '.' + month1st + '.' + day1st + '&Date=da.' + year + '.' + month + '.' + day + '&cp=tv"><span class="csssp csssp_write16_png cssspOpt"></span></a>&nbsp;');
				}
			}
		});
	}
});

__modules.push({
	name: 'ProjectExtendYearInput',
	desc: 'プロジェクトの入力画面で設定する期間で指定できる年を「今年＋15年」にする。',
	page: ['ProjectAdd', 'ProjectModify', 'ProjectThemeAdd', 'ProjectThemeModify', 'ProjectTaskAdd', 'ProjectTaskModify', 'ProjectMilestoneAdd', 'ProjectMilestoneModify'],
	func: function () {
		var extension = 15;
		var year = (new Date()).getFullYear();
		function extendYear($year) {
			if (!$year.length) return;			
			for (var i = 0 ; i < extension ; i++) {
				var value = year + i + 1;
				if ($year.find('option[value="' + value + '"]').length == 0) {
					$year.append('<option value="' + value + '">' + value + '年</option>');
				}
			}
		}
		extendYear($('select[name="SetDate.Year"]'));
		extendYear($('select[name="EndDate.Year"]'));
	}
});
