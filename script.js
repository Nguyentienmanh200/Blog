document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Tắt Loading Screen
    setTimeout(() => {
        const loader = document.getElementById('loader');
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 500);
    }, 1000);

    // 2. Dark/Light Mode Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;
    const icon = themeToggle.querySelector('i');

    themeToggle.addEventListener('click', () => {
        if (htmlEl.getAttribute('data-theme') === 'light') {
            htmlEl.setAttribute('data-theme', 'dark');
            icon.classList.replace('fa-moon', 'fa-sun');
        } else {
            htmlEl.setAttribute('data-theme', 'light');
            icon.classList.replace('fa-sun', 'fa-moon');
        }
    });

    // 3. Sticky Header & Hamburger Menu
    const header = document.getElementById('header');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const isMenuOpen = navMenu.classList.contains('active');
        hamburger.innerHTML = isMenuOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    });

    // 4. Scroll Reveal Animation (Hiệu ứng xuất hiện khi cuộn)
    const reveals = document.querySelectorAll('.reveal');
    const revealOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };

    const revealObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        });
    }, revealOptions);

    reveals.forEach(reveal => revealObserver.observe(reveal));

    // 5. Lazy Load Hình Ảnh
    const lazyImages = document.querySelectorAll('img.lazy');
    const lazyObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                let img = entry.target;
                img.src = img.getAttribute('data-src');
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => lazyObserver.observe(img));

    // 6. Tự động điền Khóa học khi bấm nút ở section Khóa học
    const selectBtns = document.querySelectorAll('.select-course-btn');
    const courseSelect = document.getElementById('courseSelect');

    selectBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const courseName = this.getAttribute('data-course');
            // Tìm và gán giá trị cho thẻ select
            Array.from(courseSelect.options).forEach(option => {
                if(option.value === courseName) {
                    option.selected = true;
                }
            });
        });
    });

    // 7. Slider Học viên đơn giản
    const slider = document.getElementById('slider');
    let isDown = false;
    let startX;
    let scrollLeft;

    // Auto trượt mỗi 5 giây
    let slideIndex = 0;
    const slides = document.querySelectorAll('.slide');
    if(slides.length > 0) {
        setInterval(() => {
            slideIndex++;
            if(slideIndex >= slides.length) slideIndex = 0;
            slider.style.transform = `translateX(-${slideIndex * 100}%)`;
        }, 5000);
    }

    // 8. Cấu hình Particles.js (Nền hạt chuyển động)
    if(typeof particlesJS !== 'undefined') {
        particlesJS("particles-js", {
            "particles": {
                "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": "#0d6efd" },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.5, "random": false },
                "size": { "value": 3, "random": true },
                "line_linked": { "enable": true, "distance": 150, "color": "#d0bdf4", "opacity": 0.4, "width": 1 },
                "move": { "enable": true, "speed": 2, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": true, "mode": "push" }, "resize": true },
                "modes": { "grab": { "distance": 140, "line_linked": { "opacity": 1 } }, "push": { "particles_nb": 4 } }
            },
            "retina_detect": true
        });
    }

    // 9. Xử lý Form Đăng ký (Gọi file api.js)
    const admissionForm = document.getElementById('admissionForm');
    const formMessage = document.getElementById('formMessage');
    const submitBtn = document.getElementById('submitBtn');

    if(admissionForm) {
        admissionForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Đổi trạng thái nút
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang gửi...';
            submitBtn.disabled = true;

            // Lấy dữ liệu
            const formData = {
                name: document.getElementById('fullname').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                birthday: document.getElementById('birthday').value,
                course: document.getElementById('courseSelect').value,
                note: document.getElementById('note').value,
                time: new Date().toLocaleString('vi-VN')
            };

            try {
                // Hàm sendToTelegram được định nghĩa bên api.js
                const response = await sendToTelegram(formData);
                
                if (response.ok) {
                    formMessage.innerHTML = '<span class="success-msg"><i class="fa-solid fa-circle-check"></i> Đăng ký thành công! Trung tâm sẽ sớm liên hệ với bạn.</span>';
                    admissionForm.reset();
                } else {
                    throw new Error('Lỗi từ API');
                }
            } catch (error) {
                console.error(error);
                formMessage.innerHTML = '<span class="error-msg"><i class="fa-solid fa-circle-exclamation"></i> Có lỗi xảy ra. Vui lòng thử lại sau hoặc liên hệ Hotline.</span>';
            } finally {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                
                // Ẩn thông báo sau 5 giây
                setTimeout(() => formMessage.innerHTML = '', 5000);
            }
        });
    }
});
