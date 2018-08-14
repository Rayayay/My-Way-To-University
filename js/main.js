jQuery(document).ready(function($){
	var	scrolling = false;
	var contentSections = $('.cd-section'),
		verticalNavigation = $('.cd-vertical-nav'),
		navigationItems = verticalNavigation.find('a'),
		navTrigger = $('.cd-nav-trigger'),
		scrollArrow = $('.cd-scroll-down');

	$(window).on('scroll', checkScroll);

	//smooth scroll to the selected section
	verticalNavigation.on('click', 'a', function(event){
        event.preventDefault();
        smoothScroll($(this.hash));
        verticalNavigation.removeClass('open');
    });

    //smooth scroll to the second section
    scrollArrow.on('click', function(event){
    	event.preventDefault();
        smoothScroll($(this.hash));
    });

	// open navigation if user clicks the .cd-nav-trigger - small devices only
    navTrigger.on('click', function(event){
    	event.preventDefault();
    	verticalNavigation.toggleClass('open');
    });

	function checkScroll() {
		if( !scrolling ) {
			scrolling = true;
			(!window.requestAnimationFrame) ? setTimeout(updateSections, 300) : window.requestAnimationFrame(updateSections);
		}
	}

	function updateSections() {
		var halfWindowHeight = $(window).height()/2,
			scrollTop = $(window).scrollTop();
		contentSections.each(function(){
			var section = $(this),
				sectionId = section.attr('id'),
				navigationItem = navigationItems.filter('[href^="#'+ sectionId +'"]');
			( (section.offset().top - halfWindowHeight < scrollTop ) && ( section.offset().top + section.height() - halfWindowHeight > scrollTop) )
				? navigationItem.addClass('active')
				: navigationItem.removeClass('active');
		});
		scrolling = false;
	}

	function smoothScroll(target) {
        $('body,html').animate(
        	{'scrollTop':target.offset().top},
        	300
        );
	}

	//toggle 3d navigation
		$('.cd-3d-nav-trigger').on('click', function(){
			toggle3dBlock(!$('.cd-header').hasClass('nav-is-visible'));
		});

		//select a new item from the 3d navigation
		$('.cd-3d-nav').on('click', 'a', function(){
			var selected = $(this);
			selected.parent('li').addClass('cd-selected').siblings('li').removeClass('cd-selected');
			updateSelectedNav('close');
		});

		$(window).on('resize', function(){
			window.requestAnimationFrame(updateSelectedNav);
		});

		function toggle3dBlock(addOrRemove) {
			if(typeof(addOrRemove)==='undefined') addOrRemove = true;
			$('.cd-header').toggleClass('nav-is-visible', addOrRemove);
			$('.cd-3d-nav-container').toggleClass('nav-is-visible', addOrRemove);
			$('main').toggleClass('nav-is-visible', addOrRemove).one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
				//fix marker position when opening the menu (after a window resize)
				addOrRemove && updateSelectedNav();
			});
		}

		//this function update the .cd-marker position
		function updateSelectedNav(type) {
			var selectedItem = $('.cd-selected'),
				selectedItemPosition = selectedItem.index() + 1,
				leftPosition = selectedItem.offset().left,
				backgroundColor = selectedItem.data('color'),
				marker = $('.cd-marker');

			marker.removeClassPrefix('color').addClass('color-'+ selectedItemPosition).css({
				'left': leftPosition,
			});
			if( type == 'close') {
				marker.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
					toggle3dBlock(false);
				});
			}
		}

		$.fn.removeClassPrefix = function(prefix) {
		    this.each(function(i, el) {
		        var classes = el.className.split(" ").filter(function(c) {
		            return c.lastIndexOf(prefix, 0) !== 0;
		        });
		        el.className = $.trim(classes.join(" "));
		    });
		    return this;
		};


});
