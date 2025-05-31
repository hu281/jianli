// script.js

document.addEventListener('DOMContentLoaded', function() {
  // 1. 导航菜单功能
  initNavigation();
  
  // 2. 主题切换功能
  initThemeToggle();
  
  // 3. 轮播图功能
  initCarousel();
  
  // 4. 返回顶部按钮
  initBackToTop();
  
  // 5. 技能雷达图
  initSkillsChart();
  
  // 6. 平滑滚动
  initSmoothScrolling();
  
  // 7. 进度条动画
  animateProgressBars();
});

// ===== 功能模块 =====

// 1. 导航菜单功能
function initNavigation() {
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  menuToggle.addEventListener('click', function() {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
  });

  // 点击导航链接后关闭菜单（移动端）
  document.querySelectorAll('#nav-links a').forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 768) {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
      }
    });
  });
}

// 2. 主题切换功能
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  // 检查本地存储或系统偏好
  const currentTheme = localStorage.getItem('theme') || 
                      (prefersDarkScheme.matches ? 'dark' : 'light');
  
  if (currentTheme === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
    themeToggle.textContent = '🌞';
  }
  
  themeToggle.addEventListener('click', function() {
    let theme;
    if (document.body.getAttribute('data-theme') === 'dark') {
      document.body.removeAttribute('data-theme');
      theme = 'light';
      themeToggle.textContent = '🌓';
    } else {
      document.body.setAttribute('data-theme', 'dark');
      theme = 'dark';
      themeToggle.textContent = '🌞';
    }
    localStorage.setItem('theme', theme);
  });
}

// 3. 轮播图功能
function initCarousel() {
  const carousel = document.querySelector('.carousel-inner');
  const items = document.querySelectorAll('.carousel-item');
  const prevBtn = document.querySelector('.carousel-control.prev');
  const nextBtn = document.querySelector('.carousel-control.next');
  const indicatorsContainer = document.querySelector('.carousel-indicators');
  let currentIndex = 0;
  let interval;
  let touchStartX = 0;
  let touchEndX = 0;
  
  // 创建指示器
  items.forEach((_, index) => {
    const indicator = document.createElement('span');
    indicator.addEventListener('click', () => goToSlide(index));
    indicatorsContainer.appendChild(indicator);
  });
  
  const indicators = document.querySelectorAll('.carousel-indicators span');
  indicators[0].classList.add('active');
  
  // 自动轮播
  function startAutoPlay() {
    interval = setInterval(() => {
      nextSlide();
    }, 5000);
  }
  
  function stopAutoPlay() {
    clearInterval(interval);
  }
  
  function nextSlide() {
    currentIndex = (currentIndex + 1) % items.length;
    updateCarousel();
  }
  
  function prevSlide() {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    updateCarousel();
  }
  
  function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
  }
  
  function updateCarousel() {
    carousel.style.transform = `translateX(-${currentIndex * 33.33}%)`;
    
    // 更新指示器状态
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === currentIndex);
    });
    
    // 重置自动轮播
    stopAutoPlay();
    startAutoPlay();
  }
  
  // 事件监听
  prevBtn.addEventListener('click', prevSlide);
  nextBtn.addEventListener('click', nextSlide);
  
  // 触摸滑动支持
  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    stopAutoPlay();
  }, {passive: true});
  
  carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX;
    handleSwipe();
    startAutoPlay();
  }, {passive: true});
  
  function handleSwipe() {
    const threshold = 50;
    if (touchEndX < touchStartX - threshold) {
      nextSlide();
    } else if (touchEndX > touchStartX + threshold) {
      prevSlide();
    }
  }
  
  // 点击左右区域切换
  carousel.addEventListener('click', function(e) {
    if (e.target.closest('.carousel-control') || 
        e.target.closest('.carousel-indicators span')) {
      return;
    }
    
    const rect = carousel.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    
    if (x < width / 3) {
      prevSlide();
    } else if (x > width * 2 / 3) {
      nextSlide();
    }
  }, {passive: true});
  
  startAutoPlay();
}

// 4. 返回顶部按钮
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });
  
  backToTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// 5. 技能雷达图
function initSkillsChart() {
  const radarCtx = document.getElementById('skills-radar-chart').getContext('2d');
  new Chart(radarCtx, {
    type: 'radar',
    data: {
      labels: ['HTML/CSS', 'JavaScript', 'Vue', 'React', '数据库', '密码学'],
      datasets: [{
        label: '技能水平',
        data: [90, 80, 75, 60, 70, 65],
        backgroundColor: 'rgba(46, 204, 113, 0.2)',
        borderColor: 'rgba(46, 204, 113, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(46, 204, 113, 1)',
        pointRadius: 4
      }]
    },
    options: {
      scales: {
        r: {
          angleLines: {
            color: 'rgba(0, 0, 0, 0.1)'
          },
          suggestedMin: 0,
          suggestedMax: 100,
          ticks: {
            stepSize: 20,
            backdropColor: 'transparent'
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            color: getComputedStyle(document.body).getPropertyValue('--text-color')
          }
        }
      }
    }
  });
}

// 6. 平滑滚动
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 70,
          behavior: 'smooth'
        });
      }
    });
  });
}

// 7. 进度条动画
function animateProgressBars() {
  const progressBars = document.querySelectorAll('.progress');
  progressBars.forEach(bar => {
    const width = bar.style.width;
    bar.style.width = '0';
    setTimeout(() => {
      bar.style.width = width;
    }, 100);
  });
}
// 8. 时间轴动画
function initTimelineAnimation() {
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  function checkTimelineItems() {
    timelineItems.forEach((item, index) => {
      const itemTop = item.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (itemTop < windowHeight * 0.8) {
        // 根据奇偶决定动画方向
        if (index % 2 === 0) {
          item.classList.add('animate-left');
        } else {
          item.classList.add('animate-right');
        }
      }
    });
  }
  
  // 初始检查
  checkTimelineItems();
  
  // 滚动时检查
  window.addEventListener('scroll', checkTimelineItems);
}

// 在DOMContentLoaded事件监听器中添加
document.addEventListener('DOMContentLoaded', function() {
  
  // 8. 时间轴动画
  initTimelineAnimation();
});
// 粒子背景
function initParticles() {
  particlesJS("particles-js", {
    "particles": {
      "number": {
        "value": 80,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": "#ffffff"
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#000000"
        }
      },
      "opacity": {
        "value": 0.5,
        "random": false
      },
      "size": {
        "value": 3,
        "random": true
      },
      "line_linked": {
        "enable": true,
        "distance": 150,
        "color": "#ffffff",
        "opacity": 0.4,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 2,
        "direction": "none",
        "random": false,
        "straight": false,
        "out_mode": "out",
        "bounce": false,
        "attract": {
          "enable": false,
          "rotateX": 600,
          "rotateY": 1200
        }
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": true,
          "mode": "grab"
        },
        "onclick": {
          "enable": true,
          "mode": "push"
        },
        "resize": true
      }
    },
    "retina_detect": true
  });
}

// 在DOMContentLoaded中调用
document.addEventListener('DOMContentLoaded', function() {
  initParticles();
});