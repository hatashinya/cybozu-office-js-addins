__modules.push({
	name: 'CommonCalculator',
	desc: 'アプリケーションメニューに電卓を加える。',
	func: function () {
		var html = '<span class="appMenuItem"><a id="calc-popup" href="#"><span class="appmenuimg csssp csssp_dz_db32_png"></span><br />'
			+ '<span class="vr_naviAppMenu">電卓</span></a></span>';
		$('#appIconMenuFrame div.vr_naviAppMenu').append(html);
		$('#calc-popup').click(function () {
			if (!Ginger.calcInitialized) {
				Ginger.calcInitialized = true;
				initializeCalc();
			}
			$('#calc-dlg').toggle();
			return false;
		});
		
		function initializeCalc() {
			var html = '<div id="calc-dlg"><div id="calc-title">電卓</div><div id="calc-close">&times;</div><br style="clear: both;" />'
				+ '<div id="calc-content"><div class="calc-row"><input type="text" id="calc-result" value="0" /></div>';
			var buttons = [
					{ Copy: 'コ', Paste: 'ペ', C: 'C', AC: 'AC', PM: '±' },
					{ 'N7': '7', 'N8': '8', 'N9': '9', Div: '/', Percent: '%' },
					{ 'N4': '4', 'N5': '5', 'N6': '6', Times: 'x', Inverse: '1/x' },
					{ 'N1': '1', 'N2': '2', 'N3': '3', Minus: '-', Plus: '+'},
					{ 'N0': '0', 'N00': '00', Point: '.', Equal: '=' }
				];
			for (var i = 0 ; i < buttons.length ; i++) {
				html += '<div class="calc-row">';
				var row = buttons[i];
				for (key in row) {
					var value = row[key];
					html += '<input type="button" class="calc-button" value="' + value + '" calc-method="' + key + '" />';
				}
				html += '</div>';
			}
			html += '</div></div>';
			$('body').append(html);
			var $dlg = $('#calc-dlg').css({ padding: '0px', background: '#fed', border: '1px solid #aaa',
				position: 'absolute', display: 'none', 'z-index': '9998' });
			$('#calc-title').css({ padding: '5px', width: '252px', float: 'left', background: '#fdc', cursor: 'move' });
			$('#calc-close').css({ position: 'absolute', top: '0px', left: '232px', padding: '5px', width: '20px', height: '20px',
				background: '#fdc', float: 'right', cursor: 'pointer' });
			$('#calc-content').css({ padding: '5px' });
			$('#calc-row').css({ padding: '0', margin: '0' });
			$('#calc-result').css({ margin: '5px', padding: '5px', width: '225px', 'text-align': 'right' });
			$('.calc-button').css({ padding: '0', 'vertical-align': 'bottom', margin: '5px', width: '40px', height: '40px' });
			$('#calc-Equal').css('width', '89px');
			
			var wx = $(document).scrollLeft() + ($(window).width() - $dlg.outerWidth()) / 2;
			var wy = $(document).scrollTop() + ($(window).height() - $dlg.outerHeight()) / 2;
			$dlg.css({ top: wy, left: wx });
			$('#calc-close').click(function () { $('#calc-dlg').hide(); });
			$('#calc-title').mousedown(function (e) {
				var mx = e.pageX;
				var my = e.pageY;
				$(document).on('mousemove.calc-dlg', function (e) {
					wx += e.pageX - mx;
					wy += e.pageY - my;
					$('#calc-dlg').css({ top: wy, left: wx });
					mx = e.pageX;
					my = e.pageY;
					return false;
				}).one('mouseup', function (e) {
					$(document).off('mousemove.calc-dlg');
				});
				return false;
			});
			if (!window.clipboardData) {
				$('.calc-button[calc-method="Copy"]').prop('disabled', true);
				$('.calc-button[calc-method="Paste"]').prop('disabled', true);
			}

			$('.calc-button').click(function () {
				var method = $(this).attr('calc-method');
				(Ginger.Calculator[method])();
			});

			function focusInput() {
				var form = $('form :focus').get(0);
				return form && ('tagName' in form);
			}
			$(window).keydown(function (e) {
				if ($('#calc-dlg').css('display') != 'block' || focusInput()) return;
				switch (e.keyCode) {
					case 13: Ginger.Calculator.Equal(); break;
					case 27: Ginger.Calculator.AC(); break;

					case 48: Ginger.Calculator.N0(); break;
					case 49: Ginger.Calculator.N1(); break;
					case 50: Ginger.Calculator.N2(); break;
					case 51: Ginger.Calculator.N3(); break;
					case 52: Ginger.Calculator.N4(); break;
					case 53: if (e.shiftKey == true)  { Ginger.Calculator.Percent(); } else { Ginger.Calculator.N5(); } break;
					case 54: Ginger.Calculator.N6(); break;
					case 55: Ginger.Calculator.N7(); break;
					case 56: Ginger.Calculator.N8(); break;
					case 57: Ginger.Calculator.N9(); break;

					case 186: if (e.shiftKey == true) { Ginger.Calculator.Times(); } break;
					case 187: if (e.shiftKey == true) { Ginger.Calculator.Plus(); } break;
					case 189: Ginger.Calculator.Minus(); break;
					case 190: Ginger.Calculator.Point(); break;
					case 191: Ginger.Calculator.Div(); break;

					case 96: Ginger.Calculator.N0(); break;
					case 97: Ginger.Calculator.N1(); break;
					case 98: Ginger.Calculator.N2(); break;
					case 99: Ginger.Calculator.N3(); break;
					case 100: Ginger.Calculator.N4(); break;
					case 101: Ginger.Calculator.N5(); break;
					case 102: Ginger.Calculator.N6(); break;
					case 103: Ginger.Calculator.N7(); break;
					case 104: Ginger.Calculator.N8(); break;
					case 105: Ginger.Calculator.N9(); break;
					case 106: Ginger.Calculator.Times(); break;
					case 107: Ginger.Calculator.Plus(); break;
					case 109: Ginger.Calculator.Minus(); break;
					case 110: Ginger.Calculator.Point(); break;
					case 111: Ginger.Calculator.Div(); break;
				}
				return false;
			});

			Ginger.Calculator = {
				state : "A",
				temporaryA : 0.0,
				temporaryB : 0.0,
				operator : null,
				Copy : function() {
					clipboardData.setData('text', $("#calc-result").val());
				},
				Paste : function() {
					$("#calc-result").val(parseFloat(clipboardData.getData('text') || ''));
				},
				Percent : function() {
					$("#calc-result").val($("#calc-result").val() * 0.01);
					this.Equal();
				},
				Plus : function() { this.PushOperator("+"); },
				Minus : function() { this.PushOperator("-"); },
				Div : function() { this.PushOperator("/"); },
				Times : function() { this.PushOperator("x"); },
				Inverse : function() {
					if (parseFloat($("#calc-result").val()) != "0") {
						$("#calc-result").val(1.0 / parseFloat($("#calc-result").val()));
					}
				},
				PM : function() {
					$("#calc-result").val(-1 * $("#calc-result").val());
				},
				N0 : function() { this.PushNum("0") },
				N00 : function() { this.PushNum("00") },
				N1 : function() { this.PushNum("1") },
				N2 : function() { this.PushNum("2") },
				N3 : function() { this.PushNum("3") },
				N4 : function() { this.PushNum("4") },
				N5 : function() { this.PushNum("5") },
				N6 : function() { this.PushNum("6") },
				N7 : function() { this.PushNum("7") },
				N8 : function() { this.PushNum("8") },
				N9 : function() { this.PushNum("9") },
				Point : function() { this.PushNum(".") },
				PushNum : function(num) {
					switch (this.state) {
						case "A":
						case "B":
							if (!((num == "0" || num == "00") && $("#calc-result").val() == "0")) {
								if ($("#calc-result").val() == "0" || $("#calc-result").val() == "00") {
									if (num == ".") {
										$("#calc-result").val("0.");
									} else {
										$("#calc-result").val(num);
									}
								} else {
									$("#calc-result").val(String($("#calc-result").val()) + num);
								}
							}
							break;
						case "C":
							if (num == "00") {
								$("#calc-result").val("0");
							} else if (num == ".") {
								$("#calc-result").val("0.");
							} else {
								$("#calc-result").val(num);
							}
							this.state = "B";
							break;
						case "R":
							if (num == "00") {
								$("#calc-result").val("0");
							} else if (num == ".") {
								$("#calc-result").val("0.");
							} else {
								$("#calc-result").val(num);
							}
							this.state = "A";
							break;
						}
				},
				PushOperator : function(ope) {
					switch (this.state) {
						case "A":
							this.temporaryA = parseFloat($("#calc-result").val());
							this.operator = ope;
							this.state = "C"
							break;
						case "C":
							this.operator = ope;
							break;
						case "B":
							this.temporaryB = parseFloat($("#calc-result").val());
							var result;
							switch (this.operator) {
								case "+":
									result = this.temporaryA + this.temporaryB;
									break;
								case "-":
									result = this.temporaryA - this.temporaryB;
									break;
								case "x":
									result = this.temporaryA * this.temporaryB;
									break;
								case "/":
									result = this.temporaryA / this.temporaryB;
									break;
							}
							this.temporaryA = result;
							this.operator = ope;
							$("#calc-result").val(result);
							this.state = "C";
							break;
						case "R":
							var result;
							switch (this.operator) {
								case "+":
									result = this.temporaryA + this.temporaryB;
									break;
								case "-":
									result = this.temporaryA - this.temporaryB;
									break;
								case "x":
									result = this.temporaryA * this.temporaryB;
									break;
								case "/":
									result = this.temporaryA / this.temporaryB;
									break;
							}
							this.temporaryA = result;
							this.operator = ope;
							$("#calc-result").val(result);
							this.state = "C";
							break;
					}
				},
				Equal : function() {
					switch (this.state) {
						case "A":
							this.state = "R";
							break;
						case "C":
							if (this.operator == "/") {
								$("#calc-result").val(temporaryA / temporaryB);
							} else if (this.operator == "x") {
								$("#calc-result").val(temporaryA * temporaryB);
							} else {
								$("#calc-result").val(temporaryA);
							}
							this.state = "R";
							break;
						case "B":
							var result;
							this.temporaryB = parseFloat($("#calc-result").val());
							switch (this.operator) {
								case "+":
									result = this.temporaryA + this.temporaryB;
									break;
								case "-":
									result = this.temporaryA - this.temporaryB;
									break;
								case "x":
									result = this.temporaryA * this.temporaryB;
									break;
								case "/":
									result = this.temporaryA / this.temporaryB;
									break;
							}
							$("#calc-result").val(result);
							this.state = "R";
							break;
						case "R":
							break;
					}
				},
				C : function() {
					$("#calc-result").val("0");
					switch (this.state) {
						case "A":
						case "C":
							this.temporaryA = 0.0;
							this.state = "A";
							break;
						case "B":
							this.temporaryB = 0.0;
							this.state = "B";
							break;
						case "R":
							this.temporaryA = 0.0;
							this.temporaryB = 0.0;
							this.state = "A";
							break;
					}
				},
				AC : function() {
					this.temporaryA = 0.0;
					this.temporaryB = 0.0;
					$("#calc-result").val("0");
					this.state = "A";
				}
			};
		}
	}
});
