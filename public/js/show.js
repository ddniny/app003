$(document).ready(function() {
	if (window.innerWidth) {
		winWidth = window.innerWidth;
	}	else if ((document.body) && (document.body.clientWidth)) {
		winWidth = document.body.clientWidth;
	}
	$('#formData').css('left',(winWidth - $('#formData').width()) / 2);
	$('#formData').css('top','100px');
  $('#formData').hide();
	$('#btnClose').click(function() {
		$('#formData').hide();
	})
	$('#addUserButton').click(function() {
    $('#formData').show();
  });
});
