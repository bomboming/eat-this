$(document).ready(function() {
    let count = 0;
    $("#contents").click(function() {

        $("#popup").fadeIn();
        count++;
        if (count > 3) {
            window.location.reload()
        } else if (count > 2) {
            $("#exit2").show();
            setTimeout(function() {
                window.location.reload()
            }, 80000);
        } else {
            $("#exit2").hide();
        }
    });
    $("#popup").click(function() {
        $("#popup").fadeOut();
    });

});