import { apiService } from '../utils/api.js';
import { authService } from '../utils/auth.js';
import { DateUtils, UIUtils, showAlert } from '../utils/common.js';

const TravelLogDetailPage = () => {
  const state = {
    travelLogId: null,
    data: null,
  };

  const $ = {
    $title: null,
    $meta: null,
    $content: null,
    $tags: null,
    $rating: null,
    $actions: null,
    $loading: null,
    $error: null,
    $carouselContainer: null,
    $carouselInner: null,
    $carouselIndicators: null,
    $overlayPrev: null,
    $overlayNext: null,
  };

  const initElements = () => {
    $.$title = document.getElementById('travelLogTitle');
    $.$meta = document.getElementById('travelLogMeta');
    $.$content = document.getElementById('travelLogContent');
    $.$tags = document.getElementById('travelLogTags');
    $.$rating = document.getElementById('travelLogRating');
    $.$actions = document.getElementById('actions');
    $.$loading = document.getElementById('loadingContainer');
    $.$error = document.getElementById('errorContainer');
    $.$carouselContainer = document.getElementById('photoCarouselContainer');
    $.$carouselInner = document.getElementById('photoCarouselInner');
    $.$carouselIndicators = document.getElementById('photoCarouselIndicators');
    $.$overlayPrev = document.getElementById('carouselOverlayPrev');
    $.$overlayNext = document.getElementById('carouselOverlayNext');
  };

  const extractId = () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('travelLogId');
    return id ? parseInt(id) : null;
  };

  const loadDetail = async () => {
    showLoading();
    try {
      const res = await apiService.get(`/api/travel-logs/${state.travelLogId}`);
      state.data = res.data;
      render();
      showContent();
    } catch (e) {
      console.error(e);
      showError();
    }
  };

  const render = () => {
    const d = state.data;
    if (!d) return;
    if ($.$title) $.$title.textContent = d.title || '제목 없음';
    if ($.$meta)
      $.$meta.innerHTML = `
        <span class="badge bg-secondary">${DateUtils.formatSimpleDate(
        d.logDate
      )}</span>
        ${
        d.location
          ? `<span class="ms-2"><i class="bi bi-geo-alt"></i> ${d.location}</span>`
          : ''
      }
        ${
        d.mood
          ? `<span class="ms-2"><i class="bi bi-emoji-smile"></i> ${d.mood}</span>`
          : ''
      }
      `;
    if ($.$rating) {
      $.$rating.innerHTML = renderStars(d.rating);
    }
    if ($.$content) $.$content.textContent = d.content || '내용이 없습니다.';

    // 태그 로드
    loadTags();

    // 사진 로드
    loadPhotos();
  };

  const renderStars = (rating) => {
    if (!Number.isInteger(rating) || rating < 1) return '';
    const filled = Math.min(rating, 5);
    const empty = 5 - filled;
    const starsHtml = `${'<i class="bi bi-star-fill"></i>'.repeat(
      filled
    )}${'<i class="bi bi-star"></i>'.repeat(empty)}`;
    return `<span class="text-warning" aria-label="평점 ${filled}점">${starsHtml}</span>`;
  };

  const loadTags = async () => {
    try {
      const res = await apiService.get(
        `/api/travel-logs/${state.travelLogId}/tags`
      );
      const tags = res.data || [];
      if ($.$tags) {
        if (tags.length === 0) {
          $.$tags.innerHTML = '<span class="text-muted">태그 없음</span>';
        } else {
          $.$tags.innerHTML = tags
            .map(
              (t) =>
                `<span class="badge me-1" style="background-color:${t.color}">${t.name}</span>`
            )
            .join('');
        }
      }
    } catch (e) {
      // 무시
    }
  };

  const showLoading = () => {
    $.$loading?.classList.remove('d-none');
    $.$error?.classList.add('d-none');
  };
  const showContent = () => {
    $.$loading?.classList.add('d-none');
    document.getElementById('detailContainer')?.classList.remove('d-none');
  };
  const showError = () => {
    $.$loading?.classList.add('d-none');
    $.$error?.classList.remove('d-none');
  };

  const loadPhotos = async () => {
    try {
      const res = await apiService.get(`/api/photos/${state.travelLogId}`);
      const photos = res.data || [];
      if (!photos.length) {
        $.$carouselContainer?.classList.add('d-none');
        return;
      }
      // indicators
      if ($.$carouselIndicators) $.$carouselIndicators.innerHTML = '';
      if ($.$carouselInner) $.$carouselInner.innerHTML = '';

      photos.forEach((p, idx) => {
        const indicator = document.createElement('button');
        indicator.type = 'button';
        indicator.setAttribute('data-bs-target', '#photoCarousel');
        indicator.setAttribute('data-bs-slide-to', String(idx));
        indicator.setAttribute('aria-label', `Slide ${idx + 1}`);
        if (idx === 0) {
          indicator.classList.add('active');
          indicator.setAttribute('aria-current', 'true');
        }
        $.$carouselIndicators?.appendChild(indicator);

        const item = document.createElement('div');
        item.className = `carousel-item${idx === 0 ? ' active' : ''}`;
        item.innerHTML = `
          <img src="${p.url}" class="d-block w-100" style="max-height:480px;object-fit:contain" alt="photo">
        `;
        $.$carouselInner?.appendChild(item);
      });

      $.$carouselContainer?.classList.remove('d-none');

      // Overlay 버튼 표시/숨김 및 동작
      const updateOverlayButtons = (activeIndex) => {
        const lastIndex = photos.length - 1;
        if ($.$overlayPrev) {
          $.$overlayPrev.style.display = activeIndex > 0 ? 'flex' : 'none';
        }
        if ($.$overlayNext) {
          $.$overlayNext.style.display =
            activeIndex < lastIndex ? 'flex' : 'none';
        }
      };

      // 초기 상태
      updateOverlayButtons(0);

      // 클릭 동작: 직접 인덱스 이동
      const goTo = (idx) => {
        const items = Array.from(
          $.$carouselInner.querySelectorAll('.carousel-item')
        );
        const active = $.$carouselInner.querySelector('.carousel-item.active');
        const current = items.indexOf(active);
        if (idx < 0 || idx >= items.length || idx === current) return;
        active.classList.remove('active');
        items[idx].classList.add('active');
        // indicators 동기화
        const indicators = Array.from(
          $.$carouselIndicators.querySelectorAll('button')
        );
        indicators.forEach((b, i) => {
          b.classList.toggle('active', i === idx);
          if (i === idx) b.setAttribute('aria-current', 'true');
          else b.removeAttribute('aria-current');
        });
        updateOverlayButtons(idx);
      };

      $.$overlayPrev?.addEventListener('click', () => {
        const items = Array.from(
          $.$carouselInner.querySelectorAll('.carousel-item')
        );
        const current = items.indexOf(
          $.$carouselInner.querySelector('.carousel-item.active')
        );
        goTo(current - 1);
      });
      $.$overlayNext?.addEventListener('click', () => {
        const items = Array.from(
          $.$carouselInner.querySelectorAll('.carousel-item')
        );
        const current = items.indexOf(
          $.$carouselInner.querySelector('.carousel-item.active')
        );
        goTo(current + 1);
      });

      // 인디케이터 클릭 시 상태 반영
      $.$carouselIndicators?.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-bs-slide-to]');
        if (!btn) return;
        const idx = parseInt(btn.getAttribute('data-bs-slide-to'));
        goTo(idx);
      });
    } catch (e) {
      // 사진은 실패해도 본문은 보이게 함
      $.$carouselContainer?.classList.add('d-none');
    }
  };

  const init = async () => {
    if (!authService.isAuthenticated()) {
      window.location.href = '/login';
      return;
    }
    initElements();
    state.travelLogId = extractId();
    if (!state.travelLogId) {
      showAlert('잘못된 접근입니다.');
      window.location.href = '/travel-logs';
      return;
    }
    await loadDetail();
  };

  return { init };
};

export default TravelLogDetailPage;
