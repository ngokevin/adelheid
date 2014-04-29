window.onscroll = function() {
    window.scrollTo(0, 0);
};

$(document).ready(function() {
    var $adelheid = $('.adelheid');
    var $chapters = $('.chapter');

    var active_chapter = 0;
    var num_chapters = $chapters.length;
    var chapter_width = $(window).width();
    var adelheid_transition_ms = parseInt($adelheid.css('transition-duration'), 10) * 1000;

    /* Init. */
    $chapters.css('width', chapter_width);

    function get_chapter(chapter) {
        return $($chapters[chapter]);
    }

    /* Changing chapters. */
    function go_to_chapter(old_chapter, chapter) {
        // Translate adelheid.
        var translateX = -1 * chapter * chapter_width;
        $adelheid.css('-moz-transform', 'translateX(' + translateX + 'px)');

        // Pause animation.
        setTimeout(function() {
            get_chapter(old_chapter).find('.image-reel');
        }, adelheid_transition_ms);
    }

    $('.prev').on('click', function() {
        if (active_chapter > 0) {
            go_to_chapter(active_chapter, --active_chapter);
        }
    });

    $('.next').on('click', function() {
        if (active_chapter < num_chapters - 1) {
            go_to_chapter(active_chapter, ++active_chapter);
        }
    });

    /* Image reel. */
    $('.chapter.active .image-reel').addClass('ripcord');

    $('.image-strip, .image-reel').on('focus', function() {
        $(this)[0].blur();
    });
});
