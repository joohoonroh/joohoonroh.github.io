$(document).ready(function () {

	// input is_num tel 숫자만 입력
	if ($('input.is_num[type=tel]')) {
		$('input.is_num[type=tel]').on("keyup keydown", function() {
			$(this).val($(this).val().replace(/[^0-9]/g,""));
		});
	}

	// inputAgreeAll 통제
	if ($('.inputAgreeAll')) {
		const $inputAgreeBox = $('.inputAgreeBox');
		$inputAgreeBox.each(function(index, value){
			const $inputAgreeAll = $(value).find('.inputAgreeAll');
			const $inputAgree = $(value).find('.inputAgree');
			$(value).find('.inputAgreeAll').on("click", function() {
				var allCheck = true;
				for (let i = 0; i < $inputAgree.length; i++) {
					if (!$inputAgree.eq(i).is(":checked")) {
						allCheck = false;
					}
				}
				if (allCheck) {
					$inputAgreeAll.removeClass('is_on');
					$inputAgree.prop("checked", false);
				} else {
					$inputAgreeAll.addClass('is_on');
					$inputAgree.prop("checked", true);
				}
			});
			$inputAgree.on("click", function() {
				var allCheck = true;
				for (let i = 0; i < $inputAgree.length; i++) {
					if (!$inputAgree.eq(i).is(":checked")) {
						allCheck = false;
					}
				}
				if (allCheck) {
					$inputAgreeAll.addClass('is_on');
				} else {
					$inputAgreeAll.removeClass('is_on');
				}
			});
		})
	}

	// 필수 input
	if ($('input.is_impotent')) {
		impotentCheck();
		$('.inputAgreeAll').on('click', function (e) {
			impotentCheck();
		})
		$('input.is_impotent').on('change click keydown', function(e) {
			impotentCheck();
		})
		function impotentCheck() {
			let allChecked = true;
			$('input.is_impotent').each(function(index, value){
				if (value.type == 'checkbox') {
					if (!value.checked) {
						allChecked = false;
					}
				} else {
					if (!value.value) {
						allChecked = false;
					}
				}
			});
			if (allChecked) {
				$('.boxButton').attr("disabled", false);
			} else {
				$('.boxButton').attr("disabled", true);
			}
		}
	}

})

// 뒤로가기
function historyBack() {
	window.history.back();
}