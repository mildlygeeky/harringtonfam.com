(function(){
    "use strict";
    if( document.cookie.indexOf('retina') === -1 && 'devicePixelRatio' in window && window.devicePixelRatio === 2 ){
        document.cookie = 'retina=' + window.devicePixelRatio + ';';
        window.location.reload();
    }
})();

var hidden = false;

function adjustSidebar(){
	if(window.innerWidth <= 992){
		jQuery('#sidebar').insertAfter(jQuery('#primary'));
        jQuery('.page-navigation, #load-more').insertAfter(jQuery('#primary'));
		hidden = true;
		jQuery('#site-navigation').insertBefore(jQuery('#masthead'));
		jQuery('#nav-toggle').insertBefore(jQuery('#masthead'));
	}else if(hidden){
		jQuery('#sidebar').insertAfter(jQuery('#masthead'));
		jQuery('#site-navigation').insertAfter(jQuery('#masthead'));
	}
}
adjustSidebar();

function supportsLocalStorage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}

function viewModeSwitch(){
	if (!supportsLocalStorage()) { return false; }

	var c = jQuery('#changeview'),
		b = jQuery('body'),
		current_mode = localStorage.getItem('raiden_view_mode'),
		logo = jQuery('#masthead img'),
		dayLogo = logo.data('day-path'),
		nightLogo = logo.data('night-path');

	if( !current_mode ){
		localStorage.setItem('raiden_view_mode', stag.viewMode);
	}

	if( current_mode === "night" ) b.addClass('night');

	if(current_mode === 'night' && nightLogo !== ''){
		logo.attr( 'src', nightLogo);
	}

	c.on('click', function(e){
		b.toggleClass('night');

		if(b.hasClass('night')){
			localStorage.setItem('raiden_view_mode', 'night');
			if( nightLogo !== '' ) logo.attr('src', nightLogo);
		}else if(!b.hasClass('night')){
			localStorage.setItem('raiden_view_mode', 'day');
			if( dayLogo !== '' ) logo.attr('src', dayLogo);
		}

	});
}
viewModeSwitch();

function makeListItemsFullyClickable() {

	jQuery("body.home .hfeed article, body.archive .hfeed article").each(function() {
		if ( jQuery(this).find('a') ) {
			jQuery(this).css('cursor', 'pointer');
		}
	});

	jQuery("body.home .hfeed article, body.archive .hfeed article").click(function() {
		if ( jQuery(this).find('a') ) {
			var url = jQuery(this).find('a')[0].href;
			window.location = url;
		}
	});
}

jQuery(document).ajaxComplete(function(){
	makeListItemsFullyClickable();
})

jQuery(document).ready(function($){

	makeListItemsFullyClickable();

	/* Sidebar Scrollfix cross browser -------------------------------------------*/
	$(".nano").nanoScroller({
		preventPageScrolling: true,
		contentClass: 'header-inside'
	});

	/* Responsive Menu Set up ----------------------------------------------------*/
	responsiveNav("#site-navigation",{
		animate: true,
		label: "<i class='icon-navicon'></i>",
		insert: "before"
	});

	/* Comments Expansion thing --------------------------------------------------*/
	$('#reply-title .icon').on('click', function(){
		$(this).toggleClass('icon-plus icon-minus');
		$('#commentform').toggleClass('expanded');

		if( $(window).innerWidth() > 1024 ){
            $("html, body").animate({ scrollTop: $(document).height() }, 300);
        }

	});

	$('.comments-title .icon').on('click', function(){
		$(this).toggleClass('icon-plus icon-minus');
		$('.comment-list').toggleClass('expanded');
	});

	/* Infinite Scroll -----------------------------------------------------------*/
	var load = $('#load-more'),
        page = 1,
        archive = load.attr('rel');

    load.click(function(e){
        e.preventDefault();
        page++;
        load.addClass('active');
        $.post(stag.ajaxurl, { action: 'stag_load_more_posts', nonce: stag.nonce, page: page, archive:archive, category: stag.category }, function( data ) {
            var content = $(data.content);
            $('#primary').append(content);
            load.removeClass('active');
            if(page >= data.pages) load.fadeOut();
            galleryInit();
            $('#primary').fitVids();
        }, 'json');
    });

    function galleryInit(){
        $('.gallery-content').magnificPopup({
            delegate: 'a',
            type: 'image',
            gallery: {
                enabled: true,
                arrowMarkup: '<i title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></i>',
            }
        });
    }
    galleryInit();


    $('#primary').fitVids();


	$(window).resize(function(){
		adjustSidebar();
	});

});


jQuery(window).load(function($){
	adjustSidebar();
});