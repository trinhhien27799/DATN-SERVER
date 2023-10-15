function showPreviewImage(event) {
    console.log('change event triggered'); 
    var input = event.target;
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var image = document.getElementById("preview-image");
            image.src = e.target.result;
            image.style.display = "block";
        };
        reader.readAsDataURL(input.files[0]);
    }
}