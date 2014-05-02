window.onscroll = function() {
    window.scrollTo(0, 0);
};

$(document).ready(function() {
    var $adelheid = $('.adelheid');
    var $chapters = $('.chapter');

    var active_chapter_num = 0;
    var num_chapters = $chapters.length;
    var chapter_width = $(window).width();
    // Time it takes to change a chapter.
    var adelheid_ms = parseInt($adelheid.css('transition-duration'), 10) * 1000;

    /* ==== */
    /* Init */
    /* ==== */
    function $get_chapter(chapter) {
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
        if (chapter == old_chapter) {
            return;
        }

        $get_chapter(old_chapter).removeClass('active');
        setTimeout(function() {
            // Parallax logic.
            $get_chapter(chapter).addClass('active');
            // Delay the transition until we reach second-to-last chapter.
        }, adelheid_ms - (adelheid_ms / Math.abs(chapter - old_chapter)));

        // Translate adelheid.
        var translateX = -1 * chapter * chapter_width;
        $adelheid.css('-moz-transform', 'translateX(' + translateX + 'px)');
        $adelheid.css('-webkit-transform', 'translateX(' + translateX + 'px)');

        // Pause animation.
        setTimeout(function() {
            $get_chapter(old_chapter).find('.image-reel').removeClass('running');
        }, adelheid_ms);

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

    $('.bubble').on('click', function() {
        var old_chapter = active_chapter_num;
        active_chapter_num = $('.bubble').index(this);
        go_to_chapter(old_chapter, active_chapter_num);
    });

    /* ====== */
    /* Moment */
    /* ====== */
    $('.moment-link').on('click', function() {
        var $this = $(this);
        var slug = $this.data('slug');
        var $chapter = $this.closest('.chapter-body');
        $chapter.find('.moment[data-slug="' + slug + '"').show();
    });

    /* ========== */
    /* Image reel */
    /* ========== */
    $('.chapter.active .image-reel').addClass('running');

    $('.image-strip, .image-reel').on('focus', function() {
        $(this)[0].blur();
    });
});
