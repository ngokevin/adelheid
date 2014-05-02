window.onscroll = function() {
    window.scrollTo(0, 0);
};

$(document).ready(function() {
    var $adelheid = $('.adelheid');
    var $chapters = $('.chapter');

    var active_chapter_num = 0;
    var num_chapters = $chapters.length;
    var chapter_width = $(window).width();
    var adelheid_transition_ms = parseInt($adelheid.css('transition-duration'), 10) * 1000;

    /* ==== */
    /* Init */
    /* ==== */
    function get_chapter(chapter) {
        return $($chapters[chapter]);
    }
    function $active_chapter() {
        return $($chapters[active_chapter_num]);
    }
    $chapters.css('width', chapter_width);

    /* ========== */
    /* Title page */
    /* ========== */
    $('.adelheid-start').click(function() {
        $(this).closest('.prologue').addClass('raised');
    });

    /* ================= */
    /* Changing chapters */
    /* ================= */
    function go_to_chapter(old_chapter, chapter) {
        // Translate adelheid.
        var translateX = -1 * chapter * chapter_width;
        $adelheid.css('-moz-transform', 'translateX(' + translateX + 'px)');

        // Pause animation.
        setTimeout(function() {
            get_chapter(old_chapter).find('.image-reel').removeClass('running');
        }, adelheid_transition_ms);

        // Run new animation.
        $active_chapter().find('.image-reel').addClass('running');
    }

    $('.prev').on('click', function() {
        if (active_chapter_num > 0) {
            go_to_chapter(active_chapter_num, --active_chapter_num);
        }
    });

    $('.next').on('click', function() {
        if (active_chapter_num < num_chapters - 1) {
            go_to_chapter(active_chapter_num, ++active_chapter_num);
        }
    });

    /* ========== */
    /* Image reel */
    /* ========== */
    $('.chapter.active .image-reel').addClass('running');

    $('.image-strip, .image-reel').on('focus', function() {
        $(this)[0].blur();
    });
});
