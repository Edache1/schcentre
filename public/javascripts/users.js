$(document).on('click touchstart', '.userImage', function(){
  	var doid = $(this).attr("id");
  	fetch_userImage(doid);
});

const fetch_userImage = (doid) => {
	$.ajax({
        type: 'post',
         url: "/users/fetch_file",
        data:{doid:doid},
        success: function(response) {
          if (response) {
          	$("#doid").val(response.doid);
          }else{
          	return alert('Whoops... something broke');
          }
		$("#updateUserImgForm").unbind('submit').bind('submit', function() {
	  		var form = $(this);
			var formData = new FormData($(this)[0]);
			var url = form.attr('action');
			var type = form.attr('method');
			$.ajax({
				url : url,
				type : type,
				data: formData,
				dataType: 'json',
				cache: false,
				contentType: false,
				processData: false,
				async: false,
				success:function(response) {
					if(response.verdict == true) {						
						$("#edit-messages").html('<div class="alert alert-success alert-dismissible" role="alert">'+
						  '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
						  response.msg + 
						'</div>');	
						$('.form-group').removeClass('has-error').removeClass('has-success');
						$('.text-danger').remove();
						/*clearForm();*/
						$("#updateUserImgForm")[0].reset();
						$(".alert-success").delay(5000).show(10, function() {
							$(this).delay(5000).hide(10, function() {
								$(this).remove();
							});
						}); // /.alert
					} else {																							
						$("#edit-messages").html('<div class="alert alert-warning alert-dismissible" role="alert">'+
						  '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
						  response.msg + 
						'</div>');																					
					} // /else
				} // /success
			}); // /ajax
			return false;
	  	})
    } // success fn
  }); 
}