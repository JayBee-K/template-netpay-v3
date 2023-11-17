var windowWidth = document.documentElement.clientWidth;
window.addEventListener("resize", () => {
    windowWidth = document.documentElement.clientWidth;
});

let handleApplyCollapse = function ($parent, $firstItem = false, $callFunction = false) {
    let $childUl = $parent.find('> li > ul');
    if ($childUl.length === 0) {
        return;
    }

    if ($callFunction) {
        $parent.find('> li a').each(function () {
            $(this).attr('data-href', $(this).attr('href'))
        });
    }

    if (windowWidth <= 991) {

        let $objParentAttr = {};
        let $objChildrenAttr = {
            'data-bs-parent': '#' + $parent.attr('id')
        }

        if ($firstItem) {
            let $parentID = 'menu-' + Math.random().toString(36).substring(7);
            $parent.attr('id', $parentID);
            $objParentAttr = {
                'data-bs-parent': '#' + $parentID
            }

            $objChildrenAttr = {};
        }

        $childUl.each(function () {
            let $parentUl = $(this).closest('ul');
            let $parentListItem = $(this).closest('li');
            let $parentListItemAnchor = $parentListItem.children('a');

            let $parentUlID = 'menu-' + Math.random().toString(36).substring(7);

            $parentUl.addClass('collapse').attr({
                'id': 'collapse-' + $parentUlID, ...$objParentAttr, ...$objChildrenAttr
            });

            $parentListItemAnchor.replaceWith(function () {
                return `<button aria-label="${$parentListItemAnchor.attr('aria-label')}" data-href="${$parentListItemAnchor.attr('data-href')}" data-bs-toggle="collapse" data-bs-target="#${$parentUl.attr('id')}">${$parentListItemAnchor.html()}</button>`
            })

            handleApplyCollapse($parentUl, false);

            $parentUl.on('show.bs.collapse', function () {
                $parent.find('.collapse.show').not($parentUl).collapse('hide');
            });
        });
    } else {
        $parent.removeAttr('id');

        $childUl.each(function () {
            let $parentUl = $(this).closest('ul');
            let $parentListItem = $(this).closest('li');

            $parentUl.removeClass('collapse').removeAttr('data-bs-parent id');
            $parentListItem.children('a').attr('href', $parentListItem.children('a').attr('data-href'));

            $parentListItem.children('button').replaceWith(function () {
                return `<a aria-label="${$(this).attr('aria-label')}" href="${$(this).attr('data-href')}" data-href="${$(this).attr('data-href')}">${$(this).html()}</a>`
            })

            handleApplyCollapse($parentUl);
        });
    }
}

let handleCallMenu = function () {
    const $body = $('body');
    const handleBody = function ($toggle = false) {
        if ($body.hasClass('is-navigation')) {
            $body.removeClass('is-navigation');
            if ($body.hasClass('is-overflow')) {
                $body.removeClass('is-overflow');
            }

            $('#header-navigation ul').collapse('hide');
        } else {
            if ($toggle) {
                $body.addClass('is-navigation is-overflow')
            }
        }
    }

    if (windowWidth <= 991) {
        const $hamburger = $('#hamburger-button');
        if ($hamburger.length) {
            $hamburger.click(function () {
                handleBody(true)
            });
        }

        const $overlay = $('#header-overlay');
        if ($overlay.length) {
            $overlay.click(function () {
                handleBody();
            });
        }
    } else {
        handleBody();
    }
}

const handleStickHeader = function () {
    if ($('body').height() / $(window).height() > 1.3) {
        if ($(document).scrollTop() > $('#header').innerHeight()) {
            $('#header').addClass('is-scroll');
        } else {
            $('#header').removeClass('is-scroll');
        }
    }
}

const handleCopyValue = function () {
    const copyButtons = document.querySelectorAll('.button-copy');
    if (copyButtons) {
        copyButtons.forEach(function (copyButton) {
            copyButton.addEventListener('click', function () {
                const valueToCopy = copyButton.getAttribute('data-value');

                const tempTextArea = document.createElement('textarea');
                tempTextArea.style.cssText = 'position: absolute; left: -99999px';
                tempTextArea.setAttribute("id", "textareaCopy");
                document.body.appendChild(tempTextArea);

                let textareaElm = document.getElementById('textareaCopy');
                textareaElm.value = valueToCopy;
                textareaElm.select();
                textareaElm.setSelectionRange(0, 99999);
                document.execCommand('copy');

                document.body.removeChild(textareaElm);

                if (copyButton.getAttribute('data-bs-toggle') === 'tooltip') {
                    copyButton.setAttribute('title', 'Đã sao chép');

                    const tooltip = bootstrap.Tooltip.getInstance(copyButton);
                    tooltip.setContent({'.tooltip-inner': 'Đã sao chép'})
                }
            });
        })
    }
}

const handleInitFancybox = function () {
    if (windowWidth <= 991 && $('.initFancybox').length) {
        $('.initFancybox').each(function () {
            let elm = $(this);
            Fancybox.bind(`[data-fancybox=${elm.attr('data-fancybox')}]`, {
                thumbs: {
                    autoStart: true,
                },
            });
        });
    }
}

const handleViewPass = function () {
    $(document).on('click', '.buttonViewPassword', function () {
        let elm = $(this),
            elmID = elm.attr('data-id');
        if (elm.hasClass('is-show')) {
            elm.html('<i class="fal fa-eye">');
            elm.removeClass('is-show');
            $('#' + elmID).attr('type', 'password');
        } else {
            elm.html('<i class="fal fa-eye-slash">');
            elm.addClass('is-show');
            $('#' + elmID).attr('type', 'text');
        }
    });
}

const handleSlideHero = function () {
    if ($('#slider-hero').length > 0) {
        new Swiper('#slider-hero .swiper', {
            slidesPerView: 1,
            navigation: {
                nextEl: "#slider-hero .slider-button_next",
                prevEl: "#slider-hero .slider-button_prev",
            },
            autoplay: {
                delay: 4000,
                disableOnInteraction: true,
            },
            speed: 800,
            loop: true,
            pagination: {
                el: "#slider-hero .slider-pagination",
                clickable: true
            }
        });
    }
}
const handleSlideFeatured = function () {
    if ($('#slider-featured').length > 0) {
        new Swiper('#slider-featured .swiper', {
            speed: 1000,
            spaceBetween: 16,
            breakpoints: {
                320: {
                    slidesPerView: 1.25,
                    spaceBetween: 10,
                    grid: {
                        rows: 1,
                        fill: "column",
                    },
                },
                575: {
                    slidesPerView: 1.5,
                    spaceBetween: 10,
                    grid: {
                        rows: 1,
                        fill: "column",
                    },
                },
                768: {
                    slidesPerView: 1.5,
                    spaceBetween: 10,
                    grid: {
                        rows: 2,
                        fill: "row",
                    },
                },
                1200: {
                    slidesPerView: 2,
                    grid: {
                        rows: 2,
                        fill: "row",
                    },
                }
            },
        });
    }
}

const handleWrapTable = function () {
    if ($('#detail-content table').length > 0) {
        $('#detail-content table').map(function () {
            $(this).addClass('table table-bordered');
            $(this).wrap('<div class="table-responsive"></div>');
        })
    }
}

const handleSliderImagesLearning = function () {
	const handleFancyBoxProduct = function (elm, initSliderAvatar, initSliderThumb) {
		let i = 0;
		elm.click(function () {
			i = 0;
		});

		Fancybox.bind(('[data-fancybox=learning-images]'), {
			touch: true,
			beforeShow: function (instance, current) {
				let index = elm.find(`[data-fancybox='learning-images'][href='${current.src}']`).attr('data-index');
				initSliderAvatar.slideTo(index - 1);
				if (typeof initSliderThumb !== 'undefined') {
					initSliderThumb.slideTo(index - 1);
				}
			},
		});
	}

	let sliderAvatar = $('#learning-avatar');
	let sliderThumb = $('#learning-thumb');

	if (sliderAvatar.length > 0) {
		let initSliderThumb;
		if (sliderThumb.length) {
			initSliderThumb = new Swiper('#learning-thumb .swiper', {
				loop: false,
				speed: 1000,
				slidesPerView: 3.5,
				spaceBetween: 8,
				autoplay: false,
			});
		}

		let initSliderAvatar = new Swiper('#learning-avatar .swiper', {
			loop: false,
			speed: 1000,
			spaceBetween: 8,
			autoplay: {
				delay: 5000,
				disableOnInteraction: true,
			},
			slidesPerView: 1,
			thumbs: {
				swiper: initSliderThumb,
			},
		});

		handleFancyBoxProduct(sliderAvatar, initSliderAvatar, initSliderThumb);
	}
}


$(function () {
    handleApplyCollapse($('#header-navigation > ul'), true, true);
    handleCallMenu();
    $(window).resize(function () {
        handleApplyCollapse($('#header-navigation > ul'));
        handleCallMenu();
    });
    handleStickHeader();
    handleCopyValue();
    handleInitFancybox();
    handleViewPass();

    handleSlideHero();
    handleSlideFeatured();

    handleWrapTable();
	handleSliderImagesLearning();
});
