document.addEventListener("DOMContentLoaded", () => {
    const maskedText = document.querySelector('.masked-text');
    const body = document.body;

    // Mobile Menu Toggle Logic
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // 1. Mouse Parallax for the 3D Text Background
    document.addEventListener('mousemove', (e) => {
        if (!maskedText) return;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        const mouseX = (e.clientX / windowWidth - 0.5);
        const mouseY = (e.clientY / windowHeight - 0.5);
        
        const shiftX = mouseX * 30; 
        const shiftY = mouseY * 30;
        
        maskedText.style.backgroundPosition = `calc(50% + ${shiftX}px) calc(50% + ${shiftY}px)`;
    });

    // 2. Scroll-Linked Background Color Shift
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        
        if (maxScroll <= 0) return; 
        
        const scrollPercent = scrollTop / maxScroll;
        body.style.backgroundPosition = `0% ${scrollPercent * 100}%`;
    });
});


// --- Flying Flower Animation & GSAP Triggers ---
document.addEventListener("DOMContentLoaded", () => {
    if (typeof gsap === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const flyingFlower = document.getElementById("flying-flower");
    const destination = document.getElementById("flower-destination");
    const textContent = document.getElementById("feature-text");

    if (!flyingFlower || !destination) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            flyingFlower.style.animation = 'none';
        } else {
            flyingFlower.style.animation = 'snap-tilt 0.6s infinite';
        }
    });

    function initScrollAnimation() {
        ScrollTrigger.refresh();

        gsap.set(flyingFlower, { x: 0, y: 0, scale: 1, rotation: 0, clearProps: "transform" });

        const startRect = flyingFlower.getBoundingClientRect();
        const destRect = destination.getBoundingClientRect();
        
        const startCenterX = startRect.left + (startRect.width / 2);
        const startCenterY = startRect.top + (startRect.height / 2);
        
        const destCenterX = destRect.left + (destRect.width / 2);
        const destCenterY = destRect.top + (destRect.height / 2);

        const moveX = destCenterX - startCenterX;
        const moveY = destCenterY - startCenterY;
        
        const targetScale = destRect.width / startRect.width;

        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: "#story-section",
                start: "top 85%", 
                end: "center center", 
                scrub: 0.5, 
                invalidateOnRefresh: true
            }
        });

        tl.to(flyingFlower, {
            x: moveX,
            y: moveY,
            scale: targetScale,
            rotation: 15,
            ease: "none" 
        }, 0);

        if (textContent) {
            tl.fromTo(textContent,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, ease: "power2.out" },
                0.1
            );
        }
    }

    setTimeout(initScrollAnimation, 200);

    window.addEventListener("resize", () => {
        gsap.killTweensOf(flyingFlower);
        setTimeout(initScrollAnimation, 150);
    });
});


// --- Bento Section GSAP Animations ---
document.addEventListener("DOMContentLoaded", () => {
    if (typeof gsap === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    if (document.querySelector(".categories-header")) {
        gsap.to(".categories-header", {
            scrollTrigger: {
                trigger: ".categories-header",
                start: "top 85%",
                toggleActions: "play none none none"
            },
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out"
        });
    }

    if (document.querySelector(".bento-large")) {
        gsap.to(".bento-large, .bento-small", {
            scrollTrigger: {
                trigger: ".bento-large",
                start: "top 80%",
                toggleActions: "play none none none"
            },
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.15,
            ease: "back.out(1.7)"
        });
    }

    if (document.querySelector(".bento-split-row")) {
        gsap.to(".bento-tiny", {
            scrollTrigger: {
                trigger: ".bento-split-row",
                start: "top 85%",
                toggleActions: "play none none none"
            },
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.15,
            ease: "back.out(1.7)"
        });
    }
});


// --- Design Gallery Interactive Logic ---
document.addEventListener("DOMContentLoaded", () => {
    const galleryData = {
        floral: {
            tag: "Popular Pattern",
            title: "Floral Masterpiece",
            desc: "Hand-stitched with precision yarn and silk threads, bringing classic blooming roses and petals to your garment.",
            img: "assets/images/decorative-elements/img6.png",
            linkText: "Select This Design →",
            motif: "floral"
        },
        leaves: {
            tag: "Botanical Series",
            title: "Leaves & Vines",
            desc: "Organic trailing foliage and lush green weaves designed to wrap gracefully around cuffs and collars.",
            img: "assets/images/decorative-elements/img12.png",
            linkText: "Select This Design →",
            motif: "leaves"
        },
        butterflies: {
            tag: "Delicate Wings",
            title: "Whimsical Butterflies",
            desc: "Lightweight winged motifs detailed with subtle metallic thread highlights for a shimmering effect.",
            img: "assets/images/decorative-elements/img14.png",
            linkText: "Select This Design →",
            motif: "butterflies"
        },
        hearts: {
            tag: "Personalized Symbol",
            title: "Hearts & Custom Initials",
            desc: "Custom love tokens, meaningful symbols, and delicate monogramming tailored specifically to you.",
            img: "assets/images/decorative-elements/img13.png",
            linkText: "Customize Initials →",
            motif: "custom"
        },
        explore: {
            tag: "Full Catalog",
            title: "Explore All 100+ Patterns",
            desc: "Dive deep into our full digital archives covering abstract art, vintage lacework, and cultural motifs.",
            img: "assets/images/decorative-elements/img17.png",
            linkText: "Browse Full Catalog →",
            motif: "all"
        },
        custom: {
            tag: "Bespoke Creation",
            title: "Tell Us Your Own Vision",
            desc: "Got a photo, drawing, or personal idea? Upload your sketch and our master artisans will stitch it exactly as you envision.",
            img: "assets/images/decorative-elements/img10.png",
            linkText: "Upload Your Sketch +",
            motif: "all"
        }
    };

    const tabCards = document.querySelectorAll('.gallery-tab-card');
    const galleryImg = document.getElementById('galleryImg');
    const galleryTag = document.getElementById('galleryTag');
    const galleryTitle = document.getElementById('galleryTitle');
    const galleryDesc = document.getElementById('galleryDesc');
    const galleryLink = document.getElementById('galleryLink');
    const previewCanvas = document.getElementById('galleryPreviewCanvas');

    if (!tabCards.length || !galleryImg) return;

    tabCards.forEach(card => {
        card.addEventListener('click', () => {
            tabCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            const designKey = card.getAttribute('data-design');
            const data = galleryData[designKey];

            if (!data) return;

            if (previewCanvas) {
                previewCanvas.style.opacity = '0';
                previewCanvas.style.transform = 'translateY(10px)';
            }

            setTimeout(() => {
                galleryImg.src = data.img;
                if (galleryTag) galleryTag.innerText = data.tag;
                if (galleryTitle) galleryTitle.innerText = data.title;
                if (galleryDesc) galleryDesc.innerText = data.desc;
                if (galleryLink) {
                    galleryLink.innerText = data.linkText;
                    galleryLink.href = `shop.html?motif=${data.motif}`;
                }

                if (previewCanvas) {
                    previewCanvas.style.opacity = '1';
                    previewCanvas.style.transform = 'translateY(0)';
                }
            }, 200);
        });
    });
});


// --- Design Gallery GSAP Animations ---
document.addEventListener("DOMContentLoaded", () => {
    if (typeof gsap === 'undefined' || !document.querySelector(".gallery-section")) return;
    gsap.registerPlugin(ScrollTrigger);

    const galleryTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".gallery-section",
            start: "top 85%",
            toggleActions: "play none none none"
        }
    });

    galleryTl.to(".gallery-header", {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out"
    })
    .to(".gallery-preview-canvas", {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: "back.out(1.7)"
    }, "-=0.2")
    .to(".gallery-tab-card", {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.08,
        ease: "back.out(1.7)"
    }, "-=0.3");
});


// --- Metric Counter Rolling Animation ---
document.addEventListener("DOMContentLoaded", () => {
    if (typeof gsap === 'undefined') return;
    const metricNumbers = document.querySelectorAll('.metric-number');
    if (!metricNumbers.length) return;
    
    let metricsAnimated = false;

    const animateCounters = () => {
        metricNumbers.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const suffix = counter.getAttribute('data-suffix') || '';
            let current = 0;
            const increment = target / 40; 

            const updateCount = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = Math.ceil(current).toLocaleString() + suffix;
                    setTimeout(updateCount, 30);
                } else {
                    counter.innerText = target.toLocaleString() + suffix;
                }
            };
            updateCount();
        });
    };

    ScrollTrigger.create({
        trigger: ".dark-trust-zone",
        start: "top 75%",
        onEnter: () => {
            if (!metricsAnimated) {
                animateCounters();
                metricsAnimated = true;
            }
        }
    });
});


// --- Interactive Atelier Dropdown & Workbench Logic ---
document.addEventListener("DOMContentLoaded", () => {
    const garmentSelect = document.getElementById('garmentSelect');
    const motifSelect = document.getElementById('motifSelect');
    const sizePills = document.querySelectorAll('#sizeOptions .size-pill');
    const patronNameInput = document.getElementById('patronNameInput');

    const billPatron = document.getElementById('billPatron');
    const billItem = document.getElementById('billItem');
    const billSize = document.getElementById('billSize');
    const billMotif = document.getElementById('billMotif');
    const billPrice = document.getElementById('billPrice');

    if (!garmentSelect || !motifSelect) return;

    let selectedSize = 'S';

    const rollPriceTo = (targetPrice) => {
        let current = 0;
        const step = Math.max(1, Math.floor(targetPrice / 20));
        
        const update = () => {
            current += step;
            if (current < targetPrice) {
                if (billPrice) billPrice.innerText = '₹' + current.toLocaleString();
                setTimeout(update, 20);
            } else {
                if (billPrice) billPrice.innerText = '₹' + targetPrice.toLocaleString();
            }
        };
        update();
    };

    const updateReceipt = () => {
        const garmentOption = garmentSelect.options[garmentSelect.selectedIndex];
        const motifOption = motifSelect.options[motifSelect.selectedIndex];
        
        const garmentName = garmentOption.text;
        const garmentPrice = parseInt(garmentOption.getAttribute('data-price'));
        
        const motifName = motifOption.text;
        const motifPrice = parseInt(motifOption.getAttribute('data-price'));
        
        const totalPrice = garmentPrice + motifPrice;
        
        if (billPatron) billPatron.innerText = patronNameInput ? (patronNameInput.value || 'Valued Patron') : 'Valued Patron';
        if (billItem) billItem.innerText = garmentName;
        if (billSize) billSize.innerText = selectedSize;
        if (billMotif) billMotif.innerText = motifName;
        
        rollPriceTo(totalPrice);
    };

    garmentSelect.addEventListener('change', updateReceipt);
    motifSelect.addEventListener('change', updateReceipt);

    sizePills.forEach(pill => {
        pill.addEventListener('click', () => {
            sizePills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            selectedSize = pill.getAttribute('data-size');
            updateReceipt();
        });
    });

    if (patronNameInput) {
        patronNameInput.addEventListener('input', updateReceipt);
    }

    updateReceipt();
});


// --- Bespoke Consultation Form Submission Handler ---
document.addEventListener("DOMContentLoaded", () => {
    const bespokeForm = document.getElementById('bespokeForm');

    if (bespokeForm) {
        bespokeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = bespokeForm.querySelector('.btn-consult-submit');
            if (!submitBtn) return;
            
            const originalText = submitBtn.innerText;
            
            submitBtn.innerText = 'Request Received ✨';
            submitBtn.style.background = '#25D366'; 
            
            setTimeout(() => {
                alert('Thank you! Your bespoke consultation request has been sent to our Jaggampeta atelier. We will reach out shortly.');
                bespokeForm.reset();
                submitBtn.innerText = originalText;
                submitBtn.style.background = '#ad2e50';
            }, 500);
        });
    }
});


// --- 3D Hover Tilt Effect for Bento Cards ---
document.addEventListener("DOMContentLoaded", () => {
    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;  
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -6; 
            const rotateY = ((x - centerX) / centerX) * 6;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });
});


// --- Dynamic Testimonial Loader from /data/comments.json ---
document.addEventListener('DOMContentLoaded', async () => {
    const track = document.getElementById('testimonialTrack');
    if (!track) return;

    try {
        const response = await fetch('data/comments.json');
        const comments = await response.json();

        track.innerHTML = comments.map((comment, index) => `
            <div class="insta-card ${index === 0 ? 'active' : ''}">
                <div class="insta-header">
                    <div class="insta-user">
                        <div class="insta-avatar">${comment.initials}</div>
                        <div>
                            <span class="insta-name">${comment.handle}</span>
                            <span class="insta-loc">${comment.location}</span>
                        </div>
                    </div>
                    <span class="insta-dots">• • •</span>
                </div>
                <div class="insta-body">
                    <p class="insta-caption">${comment.caption}</p>
                </div>
                <div class="insta-actions">
                    <div class="insta-action-icons">
                        <span>❤️</span> <span>💬</span> <span>✈️</span>
                    </div>
                    <span class="insta-likes">${comment.likes}</span>
                </div>
            </div>
        `).join('');

        initTestimonialCarousel();

    } catch (error) {
        console.error('Failed to load patron comments:', error);
    }
});

function initTestimonialCarousel() {
    const cards = document.querySelectorAll('.insta-card');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    if (!cards.length) return;

    let currentIndex = 0;

    const updateCarousel = () => {
        cards.forEach((card, idx) => {
            card.classList.remove('active', 'prev-card', 'next-card');
            
            if (idx === currentIndex) {
                card.classList.add('active');
            } else if (idx === (currentIndex - 1 + cards.length) % cards.length) {
                card.classList.add('prev-card');
            } else if (idx === (currentIndex + 1) % cards.length) {
                card.classList.add('next-card');
            }
        });
    };

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % cards.length;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + cards.length) % cards.length;
            updateCarousel();
        });
    }

    updateCarousel();
}


// --- Reliable Cross-Page Anchor Scrolling & Brand Scroll-to-Top ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Rewrite local hash links if on secondary pages
    const isNotIndex = !window.location.pathname.endsWith('index.html') && 
                       !window.location.pathname.endsWith('/') && 
                       window.location.pathname !== '';

    if (isNotIndex) {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            const hash = link.getAttribute('href');
            link.setAttribute('href', 'index.html' + hash);
        });
    }

    // 2. Scroll to hash on landing
    if (window.location.hash) {
        const targetId = window.location.hash;
        setTimeout(() => {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        }, 300);
    }

    // 3. Smooth Scroll to Top on Brand Click
    const brandLink = document.querySelector('.brand-top-link');
    if (brandLink) {
        brandLink.addEventListener('click', (e) => {
            const isIndex = window.location.pathname.endsWith('index.html') || 
                            window.location.pathname.endsWith('/') || 
                            window.location.pathname === '';
            
            if (isIndex) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                brandLink.href = 'index.html';
            }
        });
    }
});



// --- Custom Vision / Sketch Card Click Handler ---
document.addEventListener('DOMContentLoaded', () => {
    const customCard = document.getElementById('customVisionCard');
    if (customCard) {
        customCard.addEventListener('click', () => {
            const userChoice = confirm("Would you like to send your custom sketch or design idea directly to our WhatsApp atelier? (You can attach your reference image right inside the chat!)");
            
            if (userChoice) {
                const customMsg = encodeURIComponent("Hello Vyshivka Studio! I have a custom embroidery design/sketch idea I would like to discuss with your artisans. Here is my reference image:");
                window.open(`https://wa.me/919948675873?text=${customMsg}`, '_blank');
            } else {
                // Alternatively redirect to the shop custom filter
                window.location.href = 'shop.html';
            }
        });
    }
});



document.querySelectorAll('.faq-question').forEach(button => {
button.addEventListener('click', () => {
    const currentItem = button.parentElement;
    const answer = button.nextElementSibling;
    const symbol = button.querySelector('span:last-child');
    const isOpen = answer.style.maxHeight && answer.style.maxHeight !== '0px';

    // Close all other FAQ items first
    document.querySelectorAll('.faq-item').forEach(item => {
        item.style.borderColor = 'rgba(173,46,80,0.15)';
        item.style.background = '#F9F6F0';
        const ans = item.querySelector('.faq-answer');
        const sym = item.querySelector('.faq-question span:last-child');
        if (ans) ans.style.maxHeight = '0px';
        if (sym) sym.textContent = '+';
    });

    // If the clicked item wasn't open, open it and apply theme border highlight
    if (!isOpen) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
        symbol.textContent = '-';
        currentItem.style.borderColor = '#ad2e50';
        currentItem.style.background = 'rgba(173,46,80,0.02)';
    }
});
});