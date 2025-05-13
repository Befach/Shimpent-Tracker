document.addEventListener('DOMContentLoaded', function() {
    const trackForm = document.querySelector('.tracking-form');
    const trackInput = document.querySelector('.tracking-form input');
    const trackBtn = document.querySelector('.track-btn');
    
    trackBtn.addEventListener('click', function() {
        if (trackInput.value.trim() === '') {
            alert('Please enter a tracking number');
            return;
        }
        
        // Here you would typically make an API call to fetch tracking data
        // For now, we'll just show an alert
        alert(`Tracking information for ${trackInput.value} will be displayed here.`);
    });
    
    // Allow form submission with Enter key
    trackInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            trackBtn.click();
        }
    });
}); 