$(document).ready(function(){

	$(".lnr-user").unbind('click').bind('click', function() {
		clearForm();
		$("#messages").html('');
		$("#login-form")[0].reset();
		$("#register-form")[0].reset();
		$(".text-danger").remove();
	
		$("#login-form").unbind('submit').bind('submit', function() {
			$(".text-danger").remove();
			var form = $(this);
			var formData = new FormData($(this)[0]);
			
			registerLogin(form, formData);
			return false;
		});	

		$("#register-form").unbind('submit').bind('submit', function() {
			$(".text-danger").remove();
			var form = $(this);
			var formData = new FormData($(this)[0]);
			
			registerLogin(form, formData);
			return false;
		});	

	});

	$(".nav-link").unbind('click').bind('click', function() {
		clearForm();
		$("#messages").html('');
		$("#login-form")[0].reset();
		$("#register-form")[0].reset();
		$(".text-danger").remove();
	
		/*$("#login-form").unbind('submit').bind('submit', function() {
			$(".text-danger").remove();
			var form = $(this);
			var formData = new FormData($(this)[0]);
			
			registerLogin(form, formData);
			return false;
		});	

		$("#register-form").unbind('submit').bind('submit', function() {
			$(".text-danger").remove();
			var form = $(this);
			var formData = new FormData($(this)[0]);
			
			registerLogin(form, formData);
			return false;
		});	*/

	});

	$("#userPhotoForm").unbind('submit').bind('submit', function() {
		$(".text-danger").remove();
		var form = $(this);
		var formData = new FormData($(this)[0]);
		
		registerLogin(form, formData);
		return false;
	});	

	$("#updateUserForm").unbind('submit').bind('submit', function() {
		$(".text-danger").remove();
		var form = $(this);
		var formData = new FormData($(this)[0]);
		
		registerLogin(form, formData);
		return false;
	});	

	$("#updatePasswordForm").unbind('submit').bind('submit', function() {
		$(".text-danger").remove();
		var form = $(this);
		var formData = new FormData($(this)[0]);
		registerLogin(form, formData);
		return false;
	});

	$("#updateClientItem").unbind('submit').bind('submit', function() {
		$(".text-danger").remove();
		var form = $(this);
		var formData = new FormData($(this)[0]);
		registerLogin(form, formData);
		return false;
	});	
	$("#addItemImageForm").unbind('submit').bind('submit', function() {
		$(".text-danger").remove();
		var form = $(this);
		var formData = new FormData($(this)[0]);
		registerLogin(form, formData);
		return false;
	});	
	$("#file-catcher").unbind('submit').bind('submit', function() {
		$(".text-danger").remove();
		var form = $(this);
		var formData = new FormData($(this)[0]);
		registerLogin(form, formData);
		return false;
	});	

}); //document ready

$.fn.replaceOptions = function(options) {
    var self, $option, firstOption;
    self = this;
    self.remove();
    let myselect = $("<select></select>");
    myselect.attr("class", "listing-input hero__form-input  custom-select form-control select3");
    myselect.attr("id", "inputDistrict").attr("name", "inputDistrict");
    firstOption = $("<option></option>").attr("value", "").text('Choose...');
    myselect.append(firstOption);
    $.each(options, function(index, option) {
      $option = $("<option></option>")
        .attr("value", option.id)
        .text(option.dName);
      myselect.append($option);
    });
    myselect.insertAfter("label.labelling"); 
};

const fetch_district = (stateId) => {
    $.ajax({
      type: 'post',
      url: "/getdistrict",
      data:{stateId:stateId},
      success: function(options) {
        $(".select3").replaceOptions(options);
      }
    });  
} 

$(document).on('change', '.select2', async function() {
    var stateId = this.value;
    try {
        fetch_district(stateId);
    }   catch (error) {
        console.error(error);
    }   
});


$(document).on('click touchstart', '.delresu', function() {
  var id = $(this).attr("id");
  let msg = "This Resource will be deleted";
  let setConfirm = confirm(msg);
  if (setConfirm == true) {
  	  $.ajax({
      type: 'post',
      url: "/account/delete/resource",
      data:{id: id},
      success: function(data) {
        if(data.success == true){
          location.reload();
        }else{
          alert("Whoops... something went wrong");
        }
      }
    });
  } else {
  	return false;
  }
});

$(document).on('click touchstart', '.delImage', function() {
  var id = $(this).attr("id");
  let msg = "This image will be deleted";
  let setConfirm = confirm(msg);
  if (setConfirm == true) {
  	  $.ajax({
      type: 'post',
      url: "/account/delete/image",
      data:{id: id},
      success: function(data) {
        if(data.success == true){
          location.reload();
        }else{
          alert("Whoops... something went wrong");
        }
      }
    });
  } else {
  	return false;
  }
});

function registerLogin(form, formData) {
	var url = form.attr('action');
	var type = form.attr('method');
	$.ajax({
		url  : url,
		type : type,
		data: formData,
		dataType: 'json',
		cache: false,
		contentType: false,
		processData: false,
		async: false,
		success:function(response) {
			if(response.success === true) {
				$("html, body").animate({scrollTop: '0px'}, 100);
				$("#messages").html('<div class="alert alert-success alert-dismissible" role="alert">'+
				  '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
				  response.messages + 
				'</div>');
				$('.form-control').removeClass('is-invalid').removeClass('is-valid');
				$('.text-danger').remove();
				//clearForm();
				form[0].reset();
				$(".alert-success").delay(5000).show(10, function() {
					$(this).delay(5000).hide(10, function() {
						$(this).remove();
					});
				}); // /.alert
				setTimeout(function(){
					location.reload();
				}, 1000);
			}else {
				if(response.messages instanceof Object) {
					$("#messages").html('');	
					$(".form-control").removeClass('is-invalid');
					$.each(response.messages, function(index, value) {
						var key = $("#" + index);
						let validateSpan = $("<span></span>");
						let validateText = $("<p></p>").text(value).addClass('text-danger');
						validateSpan.append(validateText);
						key.closest('.form-control')
						.removeClass('is-invalid')
						.removeClass('is-valid')
						.addClass(value.length > 0 ? 'is-invalid' : 'is-valid')
						.find('.is-invalid').remove();	
						validateSpan.remove();
						key.after(validateSpan);
						$("html, "+"#"+index).animate({scrollTop: '0px'}, 100);
					});	
				} 
				else {	
				$("html, body").animate({scrollTop: '0px'}, 100);					
					$(".text-danger").remove();
					$(".form-group").removeClass('has-error').removeClass('has-success');
					$("#messages").html('<div class="alert alert-warning alert-dismissible" role="alert">'+
					  '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
					  response.messages + 
					'</div>');
					$(".alert-warning").delay(5000).show(10, function() {
						$(this).delay(5000).hide(10, function() {
							$(this).remove();
						});
					}); // /.alert
				} // /else
			} // /else
		} // /if
	});
	return false;
}

function clearForm(){
 $('input[type="text"]').val('');
 $('select').val('');
 $("#ptitle").val('');	
 $('input[type="file"]').val('');
}