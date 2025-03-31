/** 
 * Search Filters Behaviour
 *
 * @package Search
 */
document.addEventListener('DOMContentLoaded', function () {
    const istabIndexEnabled = document.body.classList.contains('ff-search-filter-tab-indexes');
    const searchFiltersVisible = document.querySelector('.search-results-section__filters');
	const searchFilterDesktop = document.querySelector('.search-results-section__filters--desktop');
	const searchFilterMobile = document.querySelector('.search-results-section__filters--mobile');
	const featuredLinksDesktop = document.querySelector('.search-results-section__featured--desktop');
	const featuredLinksMobile = document.querySelector('.search-results-section__featured--mobile');

    if ( ! istabIndexEnabled || ! searchFiltersVisible ) {
		return;
	}

	let resize_timeout;

	initialise_multiple_search_filters();
	initialise_multiple_featured_links();

	window.addEventListener(
		'resize',
		function() {
			clearTimeout( resize_timeout );
			resize_timeout = setTimeout(
				function() {
					initialise_multiple_search_filters();
					initialise_multiple_featured_links();
				},
				10
			); 
		}
	);

	/**
	 * Check screen resolution.
	 */
	function filter_is_mobile_width() {
		const width = Math.max( document.documentElement.clientWidth || 0, window.innerWidth || 0 );
		return width < 992; 
	}

	/**
	 * Toggle search filters based on the device.
	 */
	function initialise_multiple_search_filters() {
		searchFilterDesktop.setAttribute( 'aria-hidden', filter_is_mobile_width() );
		searchFilterDesktop.style.display = filter_is_mobile_width() ? 'none' : 'block';

		searchFilterMobile.setAttribute( 'aria-hidden', ! filter_is_mobile_width() );
		searchFilterMobile.style.display = ! filter_is_mobile_width() ? 'none' : 'block';
	}

	/**
	 * Toggle featured links based on the device.
	 */
	function initialise_multiple_featured_links() {
		featuredLinksDesktop.setAttribute( 'aria-hidden', filter_is_mobile_width() );
		featuredLinksDesktop.style.display = filter_is_mobile_width() ? 'none' : 'flex';

		featuredLinksMobile.setAttribute( 'aria-hidden', ! filter_is_mobile_width() );
		featuredLinksMobile.style.display = ! filter_is_mobile_width() ? 'none' : 'flex';
	}
});
