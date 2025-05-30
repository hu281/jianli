document.addEventListener('DOMContentLoaded', function() {
  // 导航栏菜单切换
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

  // 主题切换
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
  
  // 轮播图功能
  const carousel = document.querySelector('.carousel-inner');
  const items = document.querySelectorAll('.carousel-item');
  const prevBtn = document.querySelector('.carousel-control.prev');
  const nextBtn = document.querySelector('.carousel-control.next');
  const indicatorsContainer = document.querySelector('.carousel-indicators');
  let currentIndex = 0;
  let interval;
  
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
  // 修改轮播图点击事件处理，避免阻止按钮点击
carousel.addEventListener('click', function(e) {
  // 如果点击的是轮播控制按钮或指示器，则不处理
  if (e.target.closest('.carousel-control') || e.target.closest('.carousel-indicators span')) {
    return;
  }
  
  // 计算点击位置判断左右滑动
  const rect = carousel.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const width = rect.width;
  
  if (x < width / 3) {
    prevSlide();
  } else if (x > width * 2 / 3) {
    nextSlide();
  }
}, {passive: true});
// 移除之前的touch事件处理，改用更精确的判断
carousel.addEventListener('touchstart', (e) => {
  const touch = e.touches[0];
  touchStartX = touch.clientX;
  // 检查是否点击了按钮
  const clickedBtn = touch.target.closest('.hero-btn');
  if (clickedBtn) {
    // 如果是按钮，则不处理滑动
    e.stopPropagation();
  }
}, {passive: true});

carousel.addEventListener('touchend', (e) => {
  const touch = e.changedTouches[0];
  touchEndX = touch.clientX;
  // 检查是否点击了按钮
  const clickedBtn = touch.target.closest('.hero-btn');
  if (!clickedBtn) {
    handleSwipe();
  }
}, {passive: true});
// ▲▲▲ 新添加的代码结束 ▲▲▲

// 原有的滑动处理函数
function handleSwipe() {
  const threshold = 50;
  if (touchEndX < touchStartX - threshold) {
    nextSlide();
  } else if (touchEndX > touchStartX + threshold) {
    prevSlide();
  }
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
  
  prevBtn.addEventListener('click', () => {
    prevSlide();
  });
  
  nextBtn.addEventListener('click', () => {
    nextSlide();
  });
  
  // 触摸滑动支持
  let touchStartX = 0;
  let touchEndX = 0;
  
  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoPlay();
  }, {passive: true});
  
  carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
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
  
  startAutoPlay();
  
  // 返回顶部按钮
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
  
  // 技能雷达图
  const radarCtx = document.getElementById('skills-radar-chart').getContext('2d');
  const radarChart = new Chart(radarCtx, {
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
  
  // 平滑滚动
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
  // 进度条动画
  const progressBars = document.querySelectorAll('.progress');
  progressBars.forEach(bar => {
    const width = bar.style.width;
    bar.style.width = '0';
    setTimeout(() => {
      bar.style.width = width;
    }, 100);
  });
});