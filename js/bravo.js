var bravo = function(){

	/**
	 *
	 */
	var formatDate = function(targetDate) {
		var year = targetDate.getFullYear();
		var month = ("00" + (targetDate.getMonth()+1)).slice(-2);
		var date = ("00" + targetDate.getDate()).slice(-2);
		var hour = targetDate.getHours();
		var minute = targetDate.getMinutes();
		var second = targetDate.getSeconds()

		return month + "/" + date + "/" + year + " " + hour + ":" + minute + ":" + second;
	}

	/**
	 * ���J�̈�B
	 */
	var publicScope = {
		/**
		 * �y�[�W�������\�����܂��B
		 *
		 */
		init : function() {
			$("div#clock").flipcountdown({
				size: "lg"
			});

			var timelimit = new Date();
			timelimit.setMinutes(timelimit.getMinutes() + 5);
			var timelimitStr = formatDate(timelimit);
			console.log(timelimitStr);
			$("div#timer").flipcountdown({
				size: "lg",
				showHour: false,
				beforeDateTime: timelimitStr
			});
		}
	};

	return publicScope;

}();

$(function(){
	bravo.init();
});