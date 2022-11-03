$(document).ready(function(){
	const headers = new Headers({
	  "Content-Type": "application/x-www-form-urlencoded"
	});
	document.getElementById("sessid").addEventListener("change", getTermFunction);
	async function getTermFunction() {
		const sectionId = this.value;

		const urlencoded = new URLSearchParams({ "sectionId": sectionId });

		const opts = {
		  method: 'POST',
		  headers: headers,
		  body: urlencoded
		};
		
		const response = await fetch('/education/getterms', opts);
		const semesters = await response.json();
		$(".select3").replaceOptions(semesters);
	}


});//document ready
$.fn.replaceOptions = function(options) {
    let self, $option, firstOption;
    self = this;
    self.remove();
    let myselect = $("<select></select>");
    myselect.attr("class", "form-control select3");
    myselect.attr("id", "termid").attr("name", "termid");
    firstOption = $("<option></option>").attr("value", "").text('choose...');
    myselect.append(firstOption);
    $.each(options, function(index, option) {
      $option = $("<option></option>")
        .attr("value", option.siid)
        .text(option.term);
      myselect.append($option);
    });
    myselect.insertAfter(".labelling"); 
};
function clearForm(){
 $('input[type="text"]').val('');
 $('select').val('');
 $("#ptitle").val('');	
 $('input[type="file"]').val('');
}