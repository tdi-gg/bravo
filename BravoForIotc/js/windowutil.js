var windowutil = function(){
	var publicScope = {
		/**
		 * モーダルウィンドウを生成します。
		 *
		 * @param contentId モーダルウィンドウとなる要素のクラス名。
		 * @param content モーダルウィンドウ内のコンテンツ
		 * 
		 */	
		modalWindow : function(contentId, content) {
			$(contentId).before('<div id="modal-main"></div>');
			
			// 本文メッセージ設定
			$('#modal-main').append(content);
			
			// 閉じるボタン設定
			content.append('<input type="button" id="modal-close" class="button" value="閉じる">');
			
			// body内の最後に<div id="modal-bg"></div>を挿入
		    $("body").append('<div id="modal-bg"></div>');

		    // 画面中央を計算する関数を実行
		    modalResize();

		    // モーダルウィンドウを表示
			$("#modal-bg, #modal-main").fadeIn("slow");

			// モーダル外、もしくは「閉じる」ボタン押下でモーダルを閉じる
		    $("#modal-bg, #modal-close").click(function(){
		        $("#modal-main,#modal-bg").fadeOut("slow",function(){
		            $('#modal-bg').remove();
		    		$("#modal-main p").remove();
		    		content.remove();
		    		modalwindowFlag = 0;
		        });
		    });

		    // 画面の左上からmodal-mainの横幅・高さを引き、その値を2で割ると画面中央の位置が計算
		    $(window).resize(modalResize);
		    function modalResize(){

		        var w = $(window).width();
		        var h = $(window).height();

		        var cw = $("#modal-main").outerWidth();
		        var ch = $("#modal-main").outerHeight();

		        // 取得した値をcssに追加する
		        $("#modal-main").css({
		            "left": ((w - cw)/2) + "px",
		            "top": ((h - ch)/2) + "px"
		        });
		    }
		}
	};
	return publicScope;
}();
