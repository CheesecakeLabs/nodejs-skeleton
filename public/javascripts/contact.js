jQuery(document).ready(function(){

	$('#contact-form').submit(function(){
		var action = $(this).attr('action');

		$('#contact-form-submit-btn').attr('disabled','disabled');
		$('#message').empty().append($('.preloader>i').clone());

		$.post(action, {
				name: $('#contact-form-name').val(),
				email: $('#contact-form-email').val(),
				comments: $('#contact-form-message').val(),
			},
			function(data){
				$('#message').html(data);
				$('#contact-form-submit-btn').removeAttr('disabled');
				if(data.match('Thank you') !== null) $('#contact-form').slideUp('fast');
			}
		);

		return false;
	});

});