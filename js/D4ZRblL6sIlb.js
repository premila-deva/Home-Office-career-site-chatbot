/**
 * Search Button Behaviour
 *
 * @package Search
 */
document.addEventListener('DOMContentLoaded', function () {
    const searchButtonContainer = document.querySelector('.js-search-button');
    const searchDropdown = document.querySelector('.search-dropdown');
    const isSearchEnabled = document.body.classList.contains('ff-search-enabled');
    const isSearchResultsPage = document.body.classList.contains('search-results');

    if (isSearchEnabled && searchButtonContainer) {
        setupSearchIcon();
        setupSearchButtonActions();
        handleDropdownCloseOnClickOutside();
        handleMobileMenuSearchBar();
		initSearchClearButtons();
    }

    /**
     * Sets up the search button icon in the DOM.
     *
     * This function inserts the SVG icon for the search button into
     * the searchButtonContainer.
     */
    function setupSearchIcon() {
        const svgIcon = `
            <a href="#" class="search-button__link" aria-controls="search-dropdown" aria-expanded="false" role="button" aria-label="Search" tabindex="0">
                <svg class="search-button__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="Search Icon">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
            </a>
        `;
        searchButtonContainer.innerHTML = svgIcon;
    }

    /**
     * Sets up event listeners for search button interactions.
     *
     * This function adds click and keydown event listeners to the
     * search button to handle interactions for opening/closing the
     * dropdown and focusing on the appropriate input.
     */
    function setupSearchButtonActions() {
        const searchButton = searchButtonContainer.querySelector('.search-button__link');
        const triggerFocusOnMobileSearchInput = new Event('trigger-focus-on-mobile-search-input');

        searchButton.addEventListener('click', handleSearchButtonClick);
        searchButton.addEventListener('keydown', handleSearchButtonKeydown);

        /**
         * Handles the search button click event.
         *
         * @param {Event} event The click event object.
         */
        function handleSearchButtonClick(event) {
            event.preventDefault();

            if (isSearchResultsPage) {
                focusOnSearchInput();
            } else if (isResponsiveDevice()) {
                document.dispatchEvent(triggerFocusOnMobileSearchInput);
            } else {
                toggleSearchDropdown(searchButton);
            }
        }

        /**
         * Handles keyboard accessibility for the search button.
         *
         * @param {KeyboardEvent} event The keydown event object.
         */
        function handleSearchButtonKeydown(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                handleSearchButtonClick(event);
            }
        }

        /**
         * Checks if the device is in responsive (mobile) mode.
         *
         * @returns {boolean} True if the device is responsive, false otherwise.
         */
        function isResponsiveDevice() {
            return document.body.classList.contains('is-responsive-device');
        }

        /**
         * Dynamically selects all search inputs on the page.
         *
         * @returns {NodeList} A NodeList of all search input elements.
         */
        function getSearchInputs() {
            return document.querySelectorAll('.js-search-bar-input');
        }

        /**
         * Focuses on the appropriate search input based on device type or page context.
         *
         * Focuses on the first search input if on the search results page. Otherwise, it
         * focuses on either the mobile or desktop search input based on the device type.
         */
        function focusOnSearchInput() {
            if (isSearchResultsPage) {
                const firstSearchInput = document.querySelector('.js-search-bar-input');
                if (firstSearchInput) {
                    firstSearchInput.focus();
                    return;
                }
            }

            const mobileSearchInput = document.querySelector('.search-bar--mobile-menu-variant .js-search-bar-input');
            const desktopSearchInput = document.querySelector('.search-bar--dropdown-variant .js-search-bar-input');

            if (isResponsiveDevice()) {
                if (mobileSearchInput) {
                    mobileSearchInput.focus();
                }
            } else {
                if (desktopSearchInput) {
                    desktopSearchInput.focus();
                }
            }
        }

        /**
         * Toggles the search dropdown's expanded state.
         *
         * @param {HTMLElement} button The search button element.
         */
        function toggleSearchDropdown(button) {
            const isExpanded = button.getAttribute('aria-expanded') === 'true';
            isExpanded ? closeSearchDropdown(button) : openSearchDropdown(button);
        }

        /**
         * Opens the search dropdown and focuses on the appropriate input.
         *
         * @param {HTMLElement} button The search button element.
         */
        function openSearchDropdown(button) {
            searchDropdown.classList.add('search-dropdown--js-active');
			searchDropdown.setAttribute('aria-hidden',false);
            button.setAttribute('aria-expanded', 'true');
            focusOnSearchInput();
        }
    }

	/**
	 * Closes the search dropdown.
	 *
	 * @param {HTMLElement} button The search button element.
	 */
	function closeSearchDropdown(button) {
		searchDropdown.classList.remove('search-dropdown--js-active');
		searchDropdown.setAttribute('aria-hidden',true);
		button.setAttribute('aria-expanded', 'false');
	}

    /**
     * Synchronizes the value of all search inputs on the page.
     *
     * Attaches an event listener to each search input to update all
     * other inputs whenever one of them changes.
     */
    function synchronizeInputs() {
        const searchInputs = getSearchInputs();
        searchInputs.forEach(input => {
            input.addEventListener('input', function () {
                updateAllSearchInputs(this.value);
            });
        });
    }

    /**
     * Updates the value of all search inputs on the page.
     *
     * @param {string} value The value to set in all search inputs.
     */
    function updateAllSearchInputs(value) {
        const searchInputs = getSearchInputs();
        searchInputs.forEach(input => {
            input.value = value;
        });
    }

    /**
     * Closes the search dropdown if a click occurs outside of it.
     */
    function handleDropdownCloseOnClickOutside() {
        document.addEventListener('click', function (event) {
            const searchButton = searchButtonContainer.querySelector('.search-button__link');
            if (!searchButtonContainer.contains(event.target) && searchDropdown && !searchDropdown.contains(event.target)) {
                closeSearchDropdown(searchButton);
            }
        });
    }

    /**
     * Duplicates the search bar into the mobile menu if not on the search results page.
     *
     * This function clones the search bar and inserts it into the mobile menu.
     */
    function handleMobileMenuSearchBar() {
        if (!isSearchResultsPage) {
            const searchBar = document.querySelector('.search-dropdown .search-bar');
            const megaMenuMobileHeader = document.querySelector('.megamenu-mobile-header');

            if (searchBar && megaMenuMobileHeader) {
                const clonedSearchBar = searchBar.cloneNode(true);
                clonedSearchBar.classList.remove('search-bar--dropdown-variant');
                clonedSearchBar.classList.add('search-bar--mobile-menu-variant');
				const insertedElement = megaMenuMobileHeader.insertAdjacentElement('afterend', clonedSearchBar);

                //rename cloned element ID and label.
                const newId = 'search_bar__input--mobile-variant';
                insertedElement.getElementsByTagName('input')[0].id = newId;
                insertedElement.getElementsByTagName('label')[0].setAttribute('for',newId);

				initSearchClearButtons();
            }
        }
    }

    /**
     * Event listener to focus on the mobile search input when triggered.
     */
    document.addEventListener('trigger-focus-on-mobile-search-input', function () {
        const mobileSearchInput = document.querySelector('.search-bar--mobile-menu-variant .js-search-bar-input');
        if (mobileSearchInput) {
            mobileSearchInput.focus();
        }
    });
});

/** */
document.addEventListener( 'directoryRendered', function() {
	initSearchClearButtons();
});

function initSearchClearButtons() {
	const isSearchClearEnabled = document.body.classList.contains('ff-search-clear-enabled');
	if ( ! isSearchClearEnabled ) {
		return;
	}

	function showSearchClearButton( clearInput, clearButton ) {
		if ( clearInput.value ) {
			clearButton.style.display = 'flex';
			clearButton.setAttribute( 'aria-hidden', false );
		}
	}

	function hideSearchClearButton( clearInput, clearButton ) {
		if ( '' === clearInput.value ) {
			clearButton.style.display = 'none';
			clearButton.setAttribute( 'aria-hidden', true );
		}
	}

	function clearSearchInput( searchInput ) {
		// Clear value for React to pick up
		const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
			window.HTMLInputElement.prototype,
			'value'
		).set;
		nativeInputValueSetter.call(searchInput, '');
		searchInput.dispatchEvent(new Event('input', { bubbles: true }));
		// Fallback for Vanilla JS
		searchInput.value = '';
		searchInput.focus();
	}

	const wrapperSelector = '.js-clear-input-wrapper';
	const wrapperFocusSelector = 'js-clear-input-wrapper--focus';
	const inputSelector = '.js-clear-input';
	const buttonSelector = '.js-clear-button';

	const searchClearWrappers = document.querySelectorAll( wrapperSelector );

	for ( const searchClearWrapper of searchClearWrappers ) {
		const clearInput = searchClearWrapper.querySelector( inputSelector );
		const clearButton = searchClearWrapper.querySelector( buttonSelector );

		if ( ! clearInput || ! clearButton ) {
			continue;
		}

		showSearchClearButton( clearInput, clearButton );

		clearInput.addEventListener( 'input', () => showSearchClearButton( clearInput, clearButton ) );
		clearInput.addEventListener( 'keydown', () => showSearchClearButton( clearInput, clearButton ) );
		clearInput.addEventListener( 'focus', () => {
			searchClearWrapper.classList.add( wrapperFocusSelector );
			showSearchClearButton( clearInput, clearButton )
		} );

		clearInput.addEventListener( 'blur', ( event ) => {
			if ( event.relatedTarget !== clearButton) {
				searchClearWrapper.classList.remove( wrapperFocusSelector );
				hideSearchClearButton( clearInput, clearButton );
			}
		});

		clearButton.addEventListener( 'click', () => {
			clearSearchInput( clearInput );
			hideSearchClearButton( clearInput, clearButton );
		});

		clearButton.addEventListener( 'blur', ( event ) => {
			if ( event.relatedTarget !== clearInput) {
				searchClearWrapper.classList.remove( wrapperFocusSelector );
			}
		});
	}
}
