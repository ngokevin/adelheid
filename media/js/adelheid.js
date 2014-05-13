window.onscroll = function() {
    window.scrollTo(0, 0);
};

$(document).ready(function() {
    var $body = $(document.body);
    var $adelheid = $('.adelheid');
    var $chapters = $('.chapter');
    var $bubble_links = $('.bubble-link');

    var active_chapter_num = 0;
    var num_chapters = $chapters.length;
    var chapter_width = $(window).width();
    // Time it takes to change a chapter.
    var adelheid_ms = parseInt($adelheid.css('transition-duration'), 10) * 1000;
    var transitioning = false;

    var songs = [];
    var songs_paused = false;

    var reel_interval;

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

    $body.hammer({'swipe_velocity': 0.3}).on('swipe', function(e) {
        if (transitioning || ['left', 'right'].indexOf(e.gesture.direction) === -1) {
            return;
        }
        if (e.gesture.direction == 'left') {
            $('.next').trigger('click');
        } else {
            $('.prev').trigger('click');
        }
    });

    $('.button').on('click', function() {
        this.classList.add('tapped');

        var that = this;
        setTimeout(function() {
            that.classList.remove('tapped');
        }, 750);
    });

    /* ========== */
    /* Title page */
    /* ========== */
    $('.adelheid-start').click(function() {
        var $prologue = $(this).closest('.prologue').addClass('raised');
        setTimeout(function() {
            $prologue.addClass('raise-finished');
        }, 5000);
        $body.trigger('start');
    });

    /* ================= */
    /* Changing chapters */
    /* ================= */
    function go_to_chapter(old_chapter, chapter) {
        if (chapter == old_chapter) {
            return;
        }
        transitioning = true;

        // Change songs.
        if (!songs_paused) {
            pause(songs[old_chapter]);
            setTimeout(function() {
                play(songs[chapter]);
            }, adelheid_ms / 2);
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
            transitioning = false;
        }, adelheid_ms);

        // Run new animation.
        $active_chapter().find('.image-reel').addClass('running');
        setTimeout(function() {
            setReelResetInterval();
        }, adelheid_ms);

        $bubble_links.removeClass('current');
        $bubble_links.eq(chapter).addClass('active flipped current');
        $bubble_links.eq(chapter + 1).addClass('active flippable');
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

    $body.on('click', 'nav .bubble-link.active', function() {
        if (transitioning) {
            return;
        }
        var old_chapter = active_chapter_num;
        active_chapter_num = $('.bubble-link').index(this);
        go_to_chapter(old_chapter, active_chapter_num);
    });

    /* ======= */
    /* Moments */
    /* ======= */
    $('.moment-link, .moment-link .bubble, .moment-link .back').on('click', function() {
        var $this = $(this);
        var $chapter = $this.closest('.chapter');
        var slug = $this.data('slug');

        // Toggle the correct moment.
        $chapter.find('.moment[data-slug="' + slug + '"]').addClass('active');
        // Flip container.
        $chapter.find('.chapter-body-container').addClass('flipped');
    });

    $('.moment-back').on('click', function() {
        var $chapter = $(this).closest('.chapter');
        $chapter.find('.chapter-body-container').removeClass('flipped');
        setTimeout(function() {
            $chapter.find('.moment').removeClass('active');
        }, 500);
    });

    /* ========== */
    /* Image reel */
    /* ========== */
    // Restart animation once image reel is done.
    var ANIMATION_DURATION = 120;
    var ANIMATION_LENGTH = 7 * $body.width();
    var ANIMATION_SPEED = ANIMATION_LENGTH / ANIMATION_DURATION;  // pixels per second;

    $('.image-strip, .image-reel').on('focus', function() {
        $(this)[0].blur();
    });

    function getWidthReel($image_reel) {
        var width = 0;
        $image_reel.find('img').each(function(i, img) {
            width += $(img).width();
        });
        console.log('[image-reel] ' + width + 'px');
        return width;
    }

    function setReelResetInterval() {
        /* Mock the animation duration by calculating at what time all images
           are seen and then resetting the animation. */
        if (reel_interval) {
            window.clearInterval(reel_interval);
        }

        // pixels / pixels / seconds = seconds.
        var $image_reel = $('.chapter.active .image-reel');
        var current_image_reel_width = getWidthReel($image_reel);
        var animation_reset_time = current_image_reel_width / ANIMATION_SPEED;
        console.log('[image-reel] Will re-reel in ' + animation_reset_time + 's.');

        if (current_image_reel_width) {
            reel_interval = setInterval(function() {
                console.log('[image-reel] Reloading the reel');
                $image_reel.addClass('reset');
                setTimeout(function() {
                    $image_reel.removeClass('reset');
                }, 500);
            }, parseInt(animation_reset_time, 10) * 1000);
        }
    }

    $body.on('start re-reel', function() {
        var $image_reel = $('.chapter.active .image-reel').addClass('running');
        setReelResetInterval();
    });

    /* ===== */
    /* Audio */
    /* ===== */
    $('.chapter').each(function(i, chapter) {
        var $chapter = $(chapter);
        songs.push(new Howl({
            urls: [$chapter.data('song')],
            loop: true,
        }));
    }) ;

    $('.pause').click(function() {
        songs_paused = true;
        pause(songs[active_chapter_num]);
        $(this).hide();
        $('.play').show();
    });

    $('.play').click(function() {
        songs_paused = false;
        play(songs[active_chapter_num]);
        $(this).hide();
        $('.pause').show();
    });

    $body.on('start', function() {
        play(songs[active_chapter_num]);
    });

    function play(howl_song) {
        howl_song.fadeIn(1, adelheid_ms / 2);
    }

    function pause(howl_song, cb) {
        howl_song.fadeOut(0, adelheid_ms / 2);
    }
});
