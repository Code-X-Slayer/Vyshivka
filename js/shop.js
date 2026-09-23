document.addEventListener('DOMContentLoaded', async () => {
    const grid = document.getElementById('shopProductGrid');
    if (!grid) return;

    try {
        const response = await fetch('data/products.json');
        const products = await response.json();

        // State for active filters & pagination
        let currentCategory = 'all';
        let currentMotif = 'all';
        let currentPage = 1;
        const itemsPerPage = 12; // Fixed items per page

        const applyFilters = () => {
            return products.filter(p => {
                const matchCat = currentCategory === 'all' || p.category === currentCategory;
                const matchMotif = currentMotif === 'all' || p.motif === currentMotif;
                return matchCat && matchMotif;
            });
        };

        const updateGrid = () => {
            const filtered = applyFilters();
            
            // Calculate pagination slices
            const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
            if (currentPage > totalPages) currentPage = 1;

            const startIdx = (currentPage - 1) * itemsPerPage;
            const paginatedItems = filtered.slice(startIdx, startIdx + itemsPerPage);

            renderProducts(paginatedItems);
            renderPaginationControls(filtered.length, totalPages);
        };

        // Setup Chip Filter Clicks
        document.querySelectorAll('.ecommerce-filter-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const type = chip.dataset.filterType;
                const val = chip.dataset.filterVal;

                document.querySelectorAll(`.ecommerce-filter-chip[data-filter-type="${type}"]`).forEach(c => {
                    c.classList.remove('active');
                });
                chip.classList.add('active');

                if (type === 'category') currentCategory = val;
                if (type === 'motif') currentMotif = val;

                currentPage = 1; // Reset to page 1 on new filter
                updateGrid();
            });
        });

        // Add styling for filter chips and pagination dynamically
        const styleTag = document.createElement('style');
        styleTag.innerHTML = `
            .ecommerce-filter-chip {
                background: transparent;
                border: 1px solid rgba(173,46,80,0.2);
                padding: 0.4rem 1rem;
                border-radius: 20px;
                font-size: 0.85rem;
                font-family: 'Montserrat', sans-serif;
                color: #6A5A5A;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            .ecommerce-filter-chip:hover {
                border-color: #ad2e50;
                color: #ad2e50;
            }
            .ecommerce-filter-chip.active {
                background: #ad2e50;
                color: #FFFAF0;
                border-color: #ad2e50;
                font-weight: 600;
            }
            .pagination-bar {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                gap: 0.5rem;
                margin-top: 3rem;
                overflow-x: auto;
                -webkit-overflow-scrolling: touch;
                padding-bottom: 1rem;
                width: 100%;
                box-sizing: border-box;
                scrollbar-width: none;
            }
            .pagination-bar::-webkit-scrollbar {
                display: none;
            }
            .page-btn {
                background: #FFFAF0;
                border: 1px solid rgba(173,46,80,0.2);
                color: #2D1E21;
                padding: 0.5rem 1rem;
                border-radius: 10px;
                font-weight: 600;
                cursor: pointer;
                flex-shrink: 0;
                transition: all 0.2s ease;
            }
            .page-btn:hover:not(:disabled) {
                background: #ad2e50;
                color: #FFFAF0;
                border-color: #ad2e50;
            }
            .page-btn.active-page {
                background: #ad2e50;
                color: #FFFAF0;
                border-color: #ad2e50;
            }
            .page-btn:disabled {
                opacity: 0.4;
                cursor: not-allowed;
            }
        `;
        document.head.appendChild(styleTag);

        updateGrid();
        setupModal(products);

        function renderPaginationControls(totalItems, totalPages) {
            // Remove existing pagination wrapper if present
            let paginationContainer = document.getElementById('paginationContainer');
            if (!paginationContainer) {
                paginationContainer = document.createElement('div');
                paginationContainer.id = 'paginationContainer';
                grid.parentNode.appendChild(paginationContainer);
            }

            if (totalItems <= itemsPerPage) {
                paginationContainer.innerHTML = '';
                return;
            }

            let buttonsHTML = `
                <button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} id="prevPageBtn">&larr; Prev</button>
            `;

            for (let i = 1; i <= totalPages; i++) {
                buttonsHTML += `
                    <button class="page-btn ${currentPage === i ? 'active-page' : ''}" data-page="${i}">${i}</button>
                `;
            }

            buttonsHTML += `
                <button class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} id="nextPageBtn">Next &rarr;</button>
            `;

            paginationContainer.className = 'pagination-bar';
            paginationContainer.innerHTML = buttonsHTML;

            // Bind pagination click events
            paginationContainer.querySelectorAll('.page-btn[data-page]').forEach(btn => {
                btn.addEventListener('click', () => {
                    currentPage = parseInt(btn.dataset.page);
                    updateGrid();
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                });
            });

            const prevBtn = document.getElementById('prevPageBtn');
            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    if (currentPage > 1) {
                        currentPage--;
                        updateGrid();
                        window.scrollTo({ top: 300, behavior: 'smooth' });
                    }
                });
            }

            const nextBtn = document.getElementById('nextPageBtn');
            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    if (currentPage < totalPages) {
                        currentPage++;
                        updateGrid();
                        window.scrollTo({ top: 300, behavior: 'smooth' });
                    }
                });
            }
        }

    } catch (error) {
        console.error('Failed to load shop catalog:', error);
    }
});

function renderProducts(products) {
    const grid = document.getElementById('shopProductGrid');

    if (products.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #6A5A5A; padding: 3rem;">No pieces found matching your filter criteria.</p>`;
        return;
    }

    grid.innerHTML = products.map(product => `
        <div class="shop-card" style="background: #FFFAF0; border-radius: 20px; overflow: hidden; border: 1px solid rgba(173,46,80,0.12); box-shadow: 0 10px 25px rgba(173,46,80,0.06); display: flex; flex-direction: column; justify-content: space-between;">
            <div style="height: 280px; overflow: hidden; position: relative;">
                <img src="${product.image}" alt="${product.title}" style="width: 100%; height: 100%; object-fit: cover;">
                <span style="position: absolute; top: 1rem; left: 1rem; background: rgba(255,250,240,0.9); padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600; color: #ad2e50; text-transform: uppercase;">${product.category}</span>
            </div>
            <div style="padding: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem; flex-grow: 1;">
                <h3 style="font-family: 'Playfair Display', serif; font-size: 1.25rem; color: #2D1E21;">${product.title}</h3>
                <p style="font-size: 0.9rem; color: #6A5A5A; line-height: 1.4;">${product.description}</p>
                <div style="margin-top: auto; padding-top: 1rem; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-family: 'Playfair Display', serif; font-size: 1.15rem; font-weight: 700; color: #ad2e50;">₹${product.price.toLocaleString()}</span>
                    <button class="open-inquiry-btn" data-id="${product.id}" style="background: #ad2e50; color: #FFFAF0; border: none; padding: 0.6rem 1.2rem; border-radius: 20px; font-weight: 600; cursor: pointer; font-size: 0.85rem;">Enquire & Order</button>
                </div>
            </div>
        </div>
    `).join('');
}

function setupModal(products) {
    const modal = document.getElementById('inquiryModal');
    const closeModal = document.getElementById('closeModal');
    const titleElem = document.getElementById('modalItemTitle');
    const priceElem = document.getElementById('modalItemPrice');
    
    const sizeSelect = document.getElementById('modalSize');
    const customBox = document.getElementById('customMeasurementsBox');
    const sizeChartBtn = document.getElementById('toggleSizeChart');
    const sizeChartBox = document.getElementById('sizeChartModalBox');
    const closeChartBtn = document.getElementById('closeSizeChart');
    
    const designChoiceSelect = document.getElementById('modalDesignChoice');
    const predefinedMotifBox = document.getElementById('predefinedMotifBox');
    const catalogMotifSelect = document.getElementById('modalCatalogMotifSelect');
    const customUploadBox = document.getElementById('customDesignUploadBox');
    const customFileInput = document.getElementById('customDesignFile');
    
    const nameInput = document.getElementById('modalUserName');
    const phoneInput = document.getElementById('modalUserPhone');
    const emailInput = document.getElementById('modalUserEmail');
    
    const waBtn = document.getElementById('whatsappInquiryBtn');
    const emailBtn = document.getElementById('emailInquiryBtn');
    const errorNotice = document.getElementById('formErrorNotice');

    let activeProduct = null;

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('open-inquiry-btn')) {
            const productId = parseInt(e.target.dataset.id);
            activeProduct = products.find(p => p.id === productId);
            if (activeProduct) {
                titleElem.textContent = activeProduct.title;
                priceElem.textContent = `Starts from ₹${activeProduct.price.toLocaleString()}`;
                modal.style.display = 'flex';
                checkFormValidity();
            }
        }
    });

    designChoiceSelect.addEventListener('change', () => {
        if (designChoiceSelect.value === 'Own Custom Design') {
            customUploadBox.style.display = 'flex';
            predefinedMotifBox.style.display = 'none';
        } else if (designChoiceSelect.value === 'Predefined Catalog Motif') {
            customUploadBox.style.display = 'none';
            predefinedMotifBox.style.display = 'flex';
        } else {
            customUploadBox.style.display = 'none';
            predefinedMotifBox.style.display = 'none';
        }
        checkFormValidity();
    });

    if (sizeSelect) {
        sizeSelect.addEventListener('change', () => {
            customBox.style.display = sizeSelect.value === 'Custom' ? 'flex' : 'none';
            checkFormValidity();
        });
    }

    if (sizeChartBtn) {
        sizeChartBtn.addEventListener('click', () => {
            sizeChartBox.style.display = sizeChartBox.style.display === 'none' ? 'block' : 'none';
        });
    }

    if (closeChartBtn) {
        closeChartBtn.addEventListener('click', () => {
            sizeChartBox.style.display = 'none';
        });
    }

    const isValidEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const isValidPhone = (phone) => {
        const cleanPhone = phone.replace(/\D/g, '');
        return cleanPhone.length >= 10;
    };

    const checkFormValidity = () => {
        if (!activeProduct) return false;

        const name = nameInput.value.trim();
        const phone = phoneInput.value.trim();
        const email = emailInput.value.trim();
        const size = sizeSelect.value;
        const designChoice = designChoiceSelect.value;

        if (!name || !isValidPhone(phone) || !isValidEmail(email) || !size || !designChoice) {
            errorNotice.style.display = 'block';
            disableButton(waBtn);
            disableButton(emailBtn);
            return false;
        }

        if (size === 'Custom') {
            const chest = document.getElementById('custChest').value.trim();
            const waist = document.getElementById('custWaist').value.trim();
            if (!chest || !waist) {
                errorNotice.style.display = 'block';
                disableButton(waBtn);
                disableButton(emailBtn);
                return false;
            }
        }

        if (designChoice === 'Own Custom Design') {
            if (customFileInput.files.length === 0) {
                errorNotice.style.display = 'block';
                disableButton(waBtn);
                disableButton(emailBtn);
                return false;
            }
        }

        errorNotice.style.display = 'none';
        enableButton(waBtn, '#25D366');
        enableButton(emailBtn, '#ad2e50');
        setupActionLinks(name, phone, email, size, designChoice);
        return true;
    };

    const enableButton = (btn, color) => {
        btn.disabled = false;
        btn.style.background = color;
        btn.style.cursor = 'pointer';
    };

    const disableButton = (btn) => {
        btn.disabled = true;
        btn.style.background = '#ccc';
        btn.style.cursor = 'not-allowed';
    };

    const setupActionLinks = (name, phone, email, size, designChoice) => {
        let sizeDetails = `Size: ${size}`;
        if (size === 'Custom') {
            const chest = document.getElementById('custChest').value;
            const waist = document.getElementById('custWaist').value;
            const length = document.getElementById('custLength').value || '-';
            const sleeve = document.getElementById('custSleeve').value || '-';
            sizeDetails = `Custom Measurements -> Chest: ${chest}, Waist: ${waist}, Length: ${length}, Sleeve: ${sleeve}`;
        }

        let designDetails = `Design Type: ${designChoice}`;
        let fileInstruction = "";
        
        if (designChoice === 'Predefined Catalog Motif') {
            designDetails += ` -> Chosen Style: ${catalogMotifSelect.value}`;
        } else if (designChoice === 'Own Custom Design' && customFileInput.files[0]) {
            designDetails += ` -> [Custom Design Reference File: ${customFileInput.files[0].name}]`;
            fileInstruction = "\n\n(Note for Email: Please remember to attach your saved reference image file to this email reply before sending!)";
        }

        const message = `Hello Vyshivka Studio! I would like to order/enquire:\n\n*Item:* ${activeProduct.title} (₹${activeProduct.price})\n*${sizeDetails}*\n*${designDetails}*\n\n*Customer Details:*\nName: ${name}\nPhone: ${phone}\nEmail: ${email}${fileInstruction}`;

        waBtn.onclick = () => {
            window.open(`https://wa.me/919948675873?text=${encodeURIComponent(message)}`, '_blank');
        };

        emailBtn.onclick = () => {
            window.location.href = `mailto:vyshivka.store@gmail.com?subject=Order Inquiry: ${activeProduct.title}&body=${encodeURIComponent(message)}`;
        };
    };

    const inputsToWatch = [
        nameInput, phoneInput, emailInput, sizeSelect, designChoiceSelect, catalogMotifSelect, customFileInput, 
        document.getElementById('custChest'), document.getElementById('custWaist'), 
        document.getElementById('custLength'), document.getElementById('custSleeve')
    ];

    inputsToWatch.forEach(input => {
        if (input) {
            input.addEventListener('input', checkFormValidity);
            input.addEventListener('change', checkFormValidity);
        }
    });

    closeModal.addEventListener('click', () => { modal.style.display = 'none'; });
    window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });
}


// Check URL parameters for initial category or motif filter (e.g. shop.html?motif=floral)
const urlParams = new URLSearchParams(window.location.search);
let currentCategory = urlParams.get('category') || 'all';
let currentMotif = urlParams.get('motif') || 'all';
let currentPage = 1;
const itemsPerPage = 12;

// Auto-highlight active chips if loaded via URL parameter
if (currentCategory !== 'all') {
    document.querySelectorAll('.ecommerce-filter-chip').forEach(c => {
        if (c.dataset.filterType === 'category') {
            c.classList.toggle('active', c.dataset.filterVal === currentCategory);
        }
    });
}
if (currentMotif !== 'all') {
    document.querySelectorAll('.ecommerce-filter-chip').forEach(c => {
        if (c.dataset.filterType === 'motif') {
            c.classList.toggle('active', c.dataset.filterVal === currentMotif);
        }
    });
}