document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const navItems = document.querySelectorAll('.nav-item');
    const removeButtons = document.querySelectorAll('.remove-btn');
    const itemsList = document.querySelector('.items-list');
    const itemCountSpan = document.getElementById('item-count');
    const cameraVideo = document.getElementById('camera-feed');

    // Bottom Nav Tab Switching
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // Remove Item Functionality
    function attachRemoveListeners() {
        const btns = document.querySelectorAll('.remove-btn');
        btns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.item-card');
                card.style.transform = 'translateX(100px)';
                card.style.opacity = '0';
                setTimeout(() => {
                    card.remove();
                    updateItemCount();
                }, 300);
            });
        });
    }

    function updateItemCount() {
        const count = document.querySelectorAll('.item-card').length;
        itemCountSpan.textContent = count;
    }

    attachRemoveListeners();

    // Simulate 24/7 Scanning (Add an item every 15 seconds for demo)
    const mockProducts = [
        { name: 'Banana (Bunch)', price: '$1.99', icon: '🍌' },
        { name: 'Coca Cola 500ml', price: '$1.50', icon: '🥤' },
        { name: 'Potato Chips', price: '$2.00', icon: '🍟' }
    ];

    let productIndex = 0;

    function simulateScan() {
        if (document.querySelectorAll('.item-card').length >= 5) return; // Limit for demo

        const product = mockProducts[productIndex];
        productIndex = (productIndex + 1) % mockProducts.length;

        const itemCard = document.createElement('div');
        itemCard.classList.add('item-card');
        itemCard.innerHTML = `
            <div class="item-image">${product.icon}</div>
            <div class="item-details">
                <h4>${product.name}</h4>
                <span class="item-price">${product.price}</span>
            </div>
            <button class="remove-btn" aria-label="Remove item">&times;</button>
        `;

        // Prepend to show at the top
        itemsList.insertBefore(itemCard, itemsList.firstChild);
        
        // Re-attach listeners for the new button
        attachRemoveListeners();
        updateItemCount();

        // Visual feedback for scan
        const scannerViewport = document.querySelector('.scanner-viewport');
        scannerViewport.style.boxShadow = '0 0 20px #10b981';
        setTimeout(() => {
            scannerViewport.style.boxShadow = 'none';
        }, 500);
    }

    // Start simulation after 5 seconds, repeat every 12 seconds
    setTimeout(() => {
        setInterval(simulateScan, 12000);
    }, 5000);

    // Try to access camera for realistic look (optional, falls back to black screen with scanner lines)
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            .then(stream => {
                cameraVideo.srcObject = stream;
            })
            .catch(err => {
                console.log("Camera access denied or not available. Using simulated feed.");
                // We already have CSS animations for the simulated feed
            });
    }
});
