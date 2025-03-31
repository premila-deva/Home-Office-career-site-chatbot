/** 
 * Move Qualtrics element for better browser tabbing.
 *
 * @package Qualtrics
 */
document.addEventListener('DOMContentLoaded', function () {
	function moveQualtrics( className ) {
		if ( ! className ) {
			return;
		}
	
		const qualtrics = document.querySelector( className );
	
		if ( qualtrics ) {
			const footer = document.querySelector( '.w-footer' );
	
			if ( footer && footer.parentNode ) {
				footer.parentNode.insertBefore( qualtrics, footer );
			}
		}
	}
	
	setTimeout(function() {  
		moveQualtrics( '.QSIFeedbackButton' );            
	}, 1000);
});
