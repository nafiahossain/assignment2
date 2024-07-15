document.addEventListener('DOMContentLoaded', function() {

    const buttons = document.querySelectorAll('.navbar-search-container button, .navbar-search-container input');
    const expandedSearch = document.getElementById('expanded-search');

    const searchDestinationsBtn = document.getElementById('search-destinations-btn');
    const regionGrid = document.getElementById('region-flex');
    const regionItems = document.querySelectorAll('.region-item');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            if (expandedSearch.style.display === 'block') {
                expandedSearch.style.display = 'none';
            } else {
                expandedSearch.style.display = 'block';
            }
        });
    });

    searchDestinationsBtn.addEventListener('click', function() {
        regionGrid.style.display = 'block';
        
    });

    document.addEventListener('click', function(event) {
        if (!regionGrid.contains(event.target) && event.target !== searchDestinationsBtn) {
            regionGrid.style.display = 'none';
        }
    });

    regionItems.forEach(item => {
        item.addEventListener('click', function() {
            const text = item.querySelector('p').textContent;
            searchDestinationsBtn.innerHTML = `<strong>Where</strong><br>${text}`;
            
        });
    });

    //checkin checkout
    const checkInBtn = document.getElementById('check-in-btn');
    const checkOutBtn = document.getElementById('check-out-btn');
    const calendar = document.getElementById('calendar');
    const calendarBody = document.getElementById('calendar-body');
    const currentMonthYear = document.getElementById('current-month-year');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const dateRangeBtns = document.querySelectorAll('.date-range-btn');

    let currentDate = new Date();
    let selectedDate = null;
    let selectedDateRange = 0;
    let isCheckIn = true;

    function generateCalendar(year, month) {
        calendarBody.innerHTML = '';
        currentMonthYear.textContent = `${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}`;
    
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();
    
        for (let i = 0; i < firstDay; i++) {
            calendarBody.appendChild(document.createElement('div'));
        }
    
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('calendar-day');
            dayElement.textContent = day;
    
            const date = new Date(year, month, day);
            if (date < today.setHours(0, 0, 0, 0)) {
                dayElement.classList.add('disabled');
            } else {
                dayElement.addEventListener('click', () => selectDate(date));
            }
    
            calendarBody.appendChild(dayElement);
        }
    }

    function selectDate(date) {
        selectedDate = date;
        const buttonToUpdate = isCheckIn ? checkInBtn : checkOutBtn;
        //buttonToUpdate.textContent = `${isCheckIn ? 'Check in' : 'Check out'}: ${date.toLocaleDateString()}`;
        buttonToUpdate.innerHTML = `${isCheckIn ? '<strong>Check in</strong>' : '<strong>Check out</strong>'}<br>${date.toLocaleDateString()}`;
        updateCalendarSelection();
        isCheckIn = !isCheckIn;
    }

    function updateCalendarSelection() {
        document.querySelectorAll('.calendar-day').forEach(day => {
            day.classList.remove('selected');
            if (selectedDate && parseInt(day.textContent) === selectedDate.getDate()) {
                day.classList.add('selected');
            }
        });
    }

    checkInBtn.addEventListener('click', () => {
        isCheckIn = true;
        calendar.style.display = 'block';
        generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
    });

    checkOutBtn.addEventListener('click', () => {
        isCheckIn = false;
        calendar.style.display = 'block';
        generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
    });

    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
    });

    dateRangeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            selectedDateRange = parseInt(btn.dataset.days);
            dateRangeBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            updateButtonText();
        });
    });

    function updateButtonText() {
        if (selectedDate) {
            const buttonToUpdate = isCheckIn ? checkInBtn : checkOutBtn;
            const rangeText = selectedDateRange > 0 ? ` ± ${selectedDateRange} days` : '';
            //buttonToUpdate.textContent = `${isCheckIn ? 'Check in' : 'Check out'}: ${selectedDate.toLocaleDateString()}${rangeText}`;
            buttonToUpdate.innerHTML = `${isCheckIn ? '<strong>Check in</strong>' : '<strong>Check out</strong>'}<br>${selectedDate.toLocaleDateString()}${rangeText}`;
        }
    }

    document.addEventListener('click', function(event) {
        if (!calendar.contains(event.target) && event.target !== checkInBtn && event.target !== checkOutBtn) {
            calendar.style.display = 'none';
        }
    });

    generateCalendar(currentDate.getFullYear(), currentDate.getMonth());


    //add guests
    // Initialize the counts and set up event listeners
    const whoButton = document.getElementById('whoButton');
    const guestSelection = document.getElementById('guestSelection');

    const guestDescription = document.getElementById('guestDescription');

    const counts = { adults: 0, children: 0, infants: 0, pets: 0 };

    // Toggle guest selection display
    whoButton.addEventListener('click', () => {
        guestSelection.style.display = guestSelection.style.display === 'none' ? 'block' : 'none';
        updateWhoButton(); // Update the button text to reflect current guest selection
        updateGuestDescription(); 
    });

    // Hide guest selection if click outside
    document.addEventListener('click', function(event) {
        if (!guestSelection.contains(event.target) && event.target !== whoButton) {
            guestSelection.style.display = 'none';
        }
    });

    // Add event listeners to all plus and minus buttons
    document.querySelectorAll('.plus, .minus').forEach(button => {
        button.addEventListener('click', () => {
            const type = button.dataset.type;
            const isPlus = button.classList.contains('plus');
            
            // Update count based on button clicked
            if (isPlus || counts[type] > 0) {
                counts[type] += isPlus ? 1 : -1;
                updateDisplay(type);
                updateWhoButton();
                updateGuestDescription(); 
            }
        });
    });

    // Update display for specific type of guest
    function updateDisplay(type) {
        const countDisplay = document.querySelector(`.count[data-type="${type}"]`);
        const minusButton = document.querySelector(`.minus[data-type="${type}"]`);
        
        // Update count display and disable minus button if count is zero
        countDisplay.textContent = counts[type];
        minusButton.disabled = counts[type] === 0;
    }

    // Update the text content of the whoButton based on detailed guest counts
    function updateWhoButton() {
        const descriptions = {
            adults: 'adult',
            children: 'child',
            infants: 'infant',
            pets: 'pet'
        };
        
        const guestDescriptions = Object.entries(counts)
            .filter(([type, count]) => count > 0)
            .map(([type, count]) => `${count} ${descriptions[type]}${count > 1 ? 's' : ''}`);
        
        // Construct the display text with HTML for 'Who' and guest descriptions
        const displayText = guestDescriptions.length > 0 
            ? `<strong>Who</strong> <br> ${guestDescriptions.join(', ')}`
            : '<strong>Who</strong> <br> Add guests';
        
        whoButton.innerHTML = displayText;
    }

    // Update the guest description paragraph based on detailed guest counts
    function updateGuestDescription() {
        const descriptions = {
            adults: 'adult',
            children: 'child',
            infants: 'infant',
            pets: 'pet'
        };
        
        const guestDescriptions = Object.entries(counts)
            .filter(([type, count]) => count > 0)
            .map(([type, count]) => `${count} ${descriptions[type]}${count > 1 ? 's' : ''}`);
        
        // Construct the display text
        const displayText = guestDescriptions.length > 0 
            ? guestDescriptions.join(', ') 
            : ' ';
        
        guestDescription.textContent = displayText;
    }


    // Initial setup to disable minus buttons if counts are zero
    function initialize() {
        Object.keys(counts).forEach(type => updateDisplay(type));
        updateWhoButton();
        updateGuestDescription();
    }

    initialize();


    //share
    const shareButton = document.getElementById('shareButton');
    const shareModal = document.getElementById('shareModal');
    const closeButton = document.getElementsByClassName('close')[0];
    const copyLinkButton = document.getElementById('copyLink');

    shareButton.onclick = function() {
        shareModal.style.display = "block";
        updateGuestInfo();
    }
    
    closeButton.onclick = function() {
        shareModal.style.display = "none";
    }
    
    window.onclick = function(event) {
        if (event.target == shareModal) {
            shareModal.style.display = "none";
        }
    }
    
    copyLinkButton.onclick = function() {
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert("Link copied to clipboard!");
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    }


    const displayTitle = document.getElementById('experienceContent');

    function openShareModal() {
        const modal = document.getElementById('shareModal');
        const leftSection = document.querySelector('.left');
        const experienceContent = document.getElementById('experienceContent');
        
    
        // Get content from the .left section
        const titleText = leftSection.querySelector('h2').textContent;
        const detailsText = leftSection.querySelector('p:nth-of-type(1)').textContent;
        //const newStatus = leftSection.querySelector('p:nth-of-type(2)').innerHTML;
    
        // Populate modal with content
        experienceContent.innerHTML = `
            <h2>${titleText}</h2>
            <p>${detailsText}</p>
        `;
        
        updateGuestDescription();
    
        // Display the modal
        modal.style.display = 'none';
    }
    // Function to close the modal
    function closeShareModal() {
        const modal = document.getElementById('shareModal');
        modal.style.display = 'none';
    }

    // Add event listener to the close button
    document.querySelector('.close').addEventListener('click', closeShareModal);

    // You can call openShareModal() when you want to open the modal, for example:
    openShareModal(); // This line is just for demonstration; you should call this function based on your specific trigger

    //image slider
    const showAllPhotosBtn = document.getElementById('showAllPhotos');
    const imageSlider = document.getElementById('imageSlider');
    const sliderContainer = imageSlider.querySelector('.slider-container');
    const images = sliderContainer.querySelectorAll('img');
    const prevBtn = imageSlider.querySelector('.prev');
    const nextBtn = imageSlider.querySelector('.next');
    const closeBtn = imageSlider.querySelector('.close-button');
    const slideCounter = imageSlider.querySelector('.slide-counter');

    let currentIndex = 0;

    showAllPhotosBtn.addEventListener('click', () => {
        imageSlider.style.display = 'block';
        showImage(currentIndex);
    });

    closeBtn.addEventListener('click', () => {
        imageSlider.style.display = 'none';
    });

    prevBtn.addEventListener('click', showPreviousImage);
    nextBtn.addEventListener('click', showNextImage);

    function showImage(index) {
        images.forEach((img, i) => {
            img.classList.toggle('active', i === index);
        });
        updateSlideCounter();
    }

    function showPreviousImage() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showImage(currentIndex);
    }

    function showNextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
    }

    function updateSlideCounter() {
        slideCounter.textContent = `${currentIndex + 1} / ${images.length}`;
    }

    // Touch swipe functionality
    let touchStartX = 0;
    let touchEndX = 0;

    sliderContainer.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    sliderContainer.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        if (touchStartX - touchEndX > 50) {
            showNextImage();
        } else if (touchEndX - touchStartX > 50) {
            showPreviousImage();
        }
    }

    // Keyboard navigation
    document.addEventListener('keydown', e => {
        if (imageSlider.style.display === 'block') {
            if (e.key === 'ArrowLeft') {
                showPreviousImage();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            } else if (e.key === 'Escape') {
                imageSlider.style.display = 'none';
            }
        }
    });

    //like
    const likeButton = document.getElementById('likeButton');
    
    // Check local storage for like state
    const isLiked = localStorage.getItem('isLiked') === 'true';
    
    // Set initial state
    if (isLiked) {
        likeButton.classList.add('liked');
    }
    
    likeButton.addEventListener('click', function() {
        // Toggle like state
        this.classList.toggle('liked');
        
        // Update local storage
        const newLikeState = this.classList.contains('liked');
        localStorage.setItem('isLiked', newLikeState);
    });
});
