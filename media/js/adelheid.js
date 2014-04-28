window.onscroll = function() {
    window.scrollTo(0, 0);
};

$(document).ready(function() {
    $('.chapter.active .image-reel').addClass('ripcord');

    $('.image-strip, .image-reel').on('focus', function() {
        $(this)[0].blur();
    });
});
