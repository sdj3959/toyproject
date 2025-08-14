import { apiService } from '../utils/api.js';
import { authService } from '../utils/auth.js';
import { showAlert } from '../utils/common.js';

const TravelLogFormPage = () => {
  const $ = {
    $form: null,
    $tripId: null,
    $title: null,
    $daySelect: null,
    $logDate: null,
    $location: null,
    $mood: null,
    $moodOptions: null,
    $expenses: null,
    $rating: null,
    $ratingStars: null,
    $content: null,
    $back: null,
    $tagCategorySelect: null,
    $tagInput: null,
    $tagSuggestions: null,
    $selectedTagsChips: null,
    $selectedTagsText: null,
    $imageInput: null,
    $thumbList: null,
  };

  const state = { selectedTags: [], images: [] };

  const initElements = () => {
    $.$form = document.getElementById('travelLogForm');
    $.$tripId = document.getElementById('tripId');
    $.$title = document.getElementById('title');
    $.$daySelect = document.getElementById('daySelect');
    $.$logDate = document.getElementById('logDate');
    $.$location = document.getElementById('location');
    $.$mood = document.getElementById('mood');
    $.$moodOptions = document.querySelectorAll('#moodGroup .mood-option');
    $.$expenses = document.getElementById('expenses');
    $.$rating = document.getElementById('rating');
    $.$ratingStars = document.getElementById('ratingStars');
    $.$content = document.getElementById('content');
    $.$back = document.getElementById('backToDetail');
    $.$tagCategorySelect = document.getElementById('tagCategorySelect');
    $.$tagInput = document.getElementById('tagInput');
    $.$tagSuggestions = document.getElementById('tagSuggestions');
    $.$selectedTagsChips = document.getElementById('selectedTagsChips');
    $.$selectedTagsText = document.getElementById('selectedTagsText');
    $.$imageInput = document.getElementById('images');
    $.$thumbList = document.getElementById('thumbList');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const tripId = parseInt($.$tripId.value);
    if (!tripId) {
      showAlert('유효하지 않은 접근입니다.');
      return;
    }
    await ensureNewTagsCreated();

    const payload = {
      title: $.$title.value.trim(),
      content: $.$content.value || null,
      logDate: $.$logDate.value,
      location: $.$location.value || null,
      mood: $.$mood.value || null,
      expenses: $.$expenses.value ? parseInt($.$expenses.value) : null,
      rating: $.$rating.value ? parseInt($.$rating.value) : null,
      tagIds: Array.from(
        new Set(state.selectedTags.filter((t) => !!t.id).map((t) => t.id))
      ),
    };
    try {
      let res;
      if (state.images.length > 0) {
        // 멀티파트 전송 (즉시 업로드가 아니라 최종 저장 시 함께 업로드)
        const formData = new FormData();
        formData.append(
          'data',
          new Blob([JSON.stringify(payload)], { type: 'application/json' })
        );
        // 최대 5개까지만 전송, 현재 썸네일 순서대로 전송
        state.images.slice(0, 5).forEach((img) => {
          formData.append('files', img.file);
        });
        res = await apiService.postMultipart(
          `/api/travel-logs?tripId=${tripId}`,
          formData
        );
      } else {
        // 기존 JSON 전송
        res = await apiService.request(`/api/travel-logs?tripId=${tripId}`, {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      const travelLog = res.data;
      showAlert('저장되었습니다.');
      setTimeout(() => {
        const targetTripId =
          travelLog && travelLog.trip && travelLog.trip.id
            ? travelLog.trip.id
            : tripId;
        window.location.href = `/trips/detail?tripId=${targetTripId}`;
      }, 800);
    } catch (e) {
      showAlert(e.message || '저장 실패');
    }
  };

  // 이미지 썸네일 관련
  const refreshThumbs = () => {
    if (!$.$thumbList) return;
    $.$thumbList.innerHTML = '';
    state.images.forEach((img, idx) => {
      const li = document.createElement('div');
      li.className = 'thumb-item position-relative me-2';
      li.draggable = true;
      li.dataset.index = String(idx);
      li.innerHTML = `
        <img src="${img.url}" class="rounded border" style="width:100px;height:100px;object-fit:cover"/>
        <button type="button" class="btn btn-sm btn-danger position-absolute top-0 end-0 remove-btn" aria-label="remove">
          <i class="bi bi-x"></i>
        </button>
      `;

      // 삭제
      li.querySelector('.remove-btn').addEventListener('click', () => {
        state.images.splice(idx, 1);
        refreshThumbs();
      });

      // DnD
      li.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', String(idx));
      });
      li.addEventListener('dragover', (e) => {
        e.preventDefault();
      });
      li.addEventListener('drop', (e) => {
        e.preventDefault();
        const from = parseInt(e.dataTransfer.getData('text/plain'));
        const to = idx;
        if (from === to) return;
        const item = state.images.splice(from, 1)[0];
        state.images.splice(to, 0, item);
        refreshThumbs();
      });

      $.$thumbList.appendChild(li);
    });
  };

  const onImageInputChange = (e) => {
    const files = Array.from(e.target.files || []);
    const remain = 5 - state.images.length;
    const toAdd = files.slice(0, Math.max(0, remain));
    toAdd.forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const url = URL.createObjectURL(file);
      state.images.push({ file, url });
    });
    refreshThumbs();
    // 입력값 초기화하여 같은 파일을 다시 선택할 수 있도록
    e.target.value = '';
  };

  const init = async () => {
    if (!authService.isAuthenticated()) {
      window.location.href = '/login';
      return;
    }
    initElements();

    // 여행 기간 정보 로드 및 일차 셀렉트 구성
    const tripId =
      parseInt(new URLSearchParams(window.location.search).get('tripId')) ||
      parseInt($.$tripId.value);
    if (tripId) {
      try {
        const res = await apiService.get(`/api/trips/${tripId}`);
        const trip = res.data;
        const start = new Date(trip.startDate);
        const end = new Date(trip.endDate);
        const days = Math.max(
          1,
          Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1
        );
        if ($.$daySelect) {
          $.$daySelect.innerHTML = '';
          for (let i = 1; i <= days; i++) {
            const d = new Date(start);
            d.setDate(start.getDate() + (i - 1));
            const opt = document.createElement('option');
            opt.value = d.toISOString().slice(0, 10);
            opt.textContent = `${i}일차 (${d.toISOString().slice(0, 10)})`;
            $.$daySelect.appendChild(opt);
          }
          // 기본 1일차 선택 → 날짜 자동 설정
          if ($.$daySelect.options.length > 0) {
            $.$daySelect.selectedIndex = 0;
            $.$logDate.value = $.$daySelect.value;
          }
          // 변경 시 날짜 반영
          $.$daySelect.addEventListener('change', () => {
            $.$logDate.value = $.$daySelect.value || '';
          });
        } else if ($.$logDate) {
          // 폴백: daySelect가 없으면 시작일을 기본값으로 설정
          $.$logDate.value = trip.startDate;
        }
      } catch (e) {
        // 무시하고 수동 입력 허용
      }
    }
    $.$form?.addEventListener('submit', onSubmit);
    $.$imageInput?.addEventListener('change', onImageInputChange);
    if ($.$back) {
      const tripId = new URLSearchParams(window.location.search).get('tripId');
      $.$back.href = `/trips/detail?tripId=${tripId ?? ''}`;
    }

    // 태그 입력/추천/추가
    const refreshSelectedText = () => {
      $.$selectedTagsText.textContent = state.selectedTags
        .map((t) => `#${t.name}`)
        .join(', ');
    };

    const hasTagSelected = (tag) => {
      if (tag.id) return state.selectedTags.some((t) => t.id === tag.id);
      return state.selectedTags.some(
        (t) => !t.id && t.name.toLowerCase() === tag.name.toLowerCase()
      );
    };

    const addTagChip = (tag) => {
      if (hasTagSelected(tag)) return;
      state.selectedTags.push({
        id: tag.id || null,
        name: tag.name,
        category: tag.category,
        color: tag.color,
      });
      const chip = document.createElement('span');
      chip.className = 'badge rounded-pill text-bg-secondary';
      if (tag.color) chip.style.backgroundColor = tag.color;
      chip.dataset.tagId = tag.id || '';
      chip.dataset.tagName = tag.name;
      chip.innerHTML = `#${tag.name} <i class="bi bi-x ms-1"></i>`;
      chip.querySelector('i').addEventListener('click', () => {
        state.selectedTags = state.selectedTags.filter((t) =>
          tag.id
            ? t.id !== tag.id
            : t.name.toLowerCase() !== tag.name.toLowerCase()
        );
        chip.remove();
        refreshSelectedText();
      });
      $.$selectedTagsChips.appendChild(chip);
      refreshSelectedText();
    };

    const fetchTagsByCategory = async (category) => {
      if (!category) {
        $.$tagSuggestions.style.display = 'none';
        $.$tagSuggestions.innerHTML = '';
        return [];
      }
      const res = await apiService.get(
        `/api/tags?category=${encodeURIComponent(category)}`
      );
      return res.data || [];
    };

    const searchTags = async (keyword) => {
      if (!keyword) return [];
      const res = await apiService.get(
        `/api/tags/search?keyword=${encodeURIComponent(keyword)}`
      );
      const list = res.data || [];
      const selectedCategory = $.$tagCategorySelect?.value || '';
      return selectedCategory
        ? list.filter((t) => t.category === selectedCategory)
        : list;
    };

    const showSuggestions = (tags) => {
      $.$tagSuggestions.innerHTML = '';
      if (!tags.length) {
        $.$tagSuggestions.style.display = 'none';
        return;
      }
      tags.forEach((t) => {
        const item = document.createElement('button');
        item.type = 'button';
        item.className =
          'list-group-item list-group-item-action d-flex align-items-center';
        item.dataset.tagId = t.id;
        item.innerHTML = `<span class="badge me-2" style="background:${
          t.color || '#6c757d'
        }">#</span>${t.name}`;
        item.addEventListener('click', () => {
          addTagChip(t);
          $.$tagInput.value = '';
          $.$tagSuggestions.style.display = 'none';
        });
        $.$tagSuggestions.appendChild(item);
      });
      $.$tagSuggestions.style.display = 'block';
    };

    let cachedCategoryTags = [];

    $.$tagCategorySelect?.addEventListener('change', async () => {
      cachedCategoryTags = await fetchTagsByCategory(
        $.$tagCategorySelect.value
      );
      showSuggestions(cachedCategoryTags);
    });

    $.$tagInput?.addEventListener('input', async (e) => {
      const value = (e.target.value || '').trim();
      if (!value.startsWith('#')) {
        $.$tagSuggestions.style.display = 'none';
        return;
      }
      const keyword = value.slice(1);
      if (!keyword) {
        showSuggestions(cachedCategoryTags);
        return;
      }
      const result = await searchTags(keyword);
      showSuggestions(result);
    });

    $.$tagInput?.addEventListener('keydown', async (e) => {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      const inputVal = ($.$tagInput.value || '').trim();
      if (!inputVal.startsWith('#')) return;
      const name = inputVal.slice(1).trim();
      if (!name) return;
      const category = $.$tagCategorySelect.value;
      if (!category) {
        showAlert('먼저 카테고리를 선택해주세요.');
        return;
      }
      // 기존 태그 검색 후 있으면 해당 태그로, 없으면 로컬(신규 예정)로 칩만 추가
      const suggestions = await searchTags(name);
      const existing = suggestions.find(
        (t) => t.name.toLowerCase() === name.toLowerCase()
      );
      if (existing) {
        addTagChip(existing);
      } else {
        addTagChip({ id: null, name, category, color: '#6c757d' });
      }
      $.$tagInput.value = '';
      $.$tagSuggestions.style.display = 'none';
    });

    document.addEventListener('click', (evt) => {
      if (
        !evt.target.closest('#tagSuggestions') &&
        evt.target !== $.$tagInput
      ) {
        $.$tagSuggestions.style.display = 'none';
      }
    });

    // 기분 선택 버튼
    $.$moodOptions?.forEach((btn) => {
      btn.addEventListener('click', () => {
        $.$mood.value = btn.dataset.value;
        $.$moodOptions.forEach((b) => b.classList.remove('btn-secondary'));
        $.$moodOptions.forEach((b) => b.classList.add('btn-outline-secondary'));
        btn.classList.remove('btn-outline-secondary');
        btn.classList.add('btn-secondary');
      });
    });

    // 별점 선택
    const paintStars = (value) => {
      if (!$.$ratingStars) return;
      [...$.$ratingStars.querySelectorAll('i')].forEach((별) => {
        const v = parseInt(star.dataset.value);
        if (v <= value) {
          star.classList.remove('bi-star');
          star.classList.add('bi-star-fill', 'text-warning');
        } else {
          star.classList.remove('bi-star-fill', 'text-warning');
          star.classList.add('bi-star');
        }
      });
    };

    $.$ratingStars?.addEventListener('mousemove', (e) => {
      const star = e.target.closest('i[data-value]');
      if (!star) return;
      paintStars(parseInt(star.dataset.value));
    });

    $.$ratingStars?.addEventListener('mouseleave', () => {
      const current = parseInt($.$rating.value || '0');
      paintStars(current || 0);
    });

    $.$ratingStars?.addEventListener('click', (e) => {
      const star = e.target.closest('i[data-value]');
      if (!star) return;
      const value = parseInt(star.dataset.value);
      $.$rating.value = String(value);
      paintStars(value);
    });
  };

  const ensureNewTagsCreated = async () => {
    const pending = state.selectedTags.filter((t) => !t.id);
    if (pending.length === 0) return;
    const created = await Promise.all(
      pending.map((t) =>
        apiService
          .post('/api/tags', {
            name: t.name,
            category: t.category,
            color: t.color || '#6c757d',
          })
          .then((res) => res.data)
          .catch(() => null)
      )
    );
    created.filter(Boolean).forEach((ct) => {
      const idx = state.selectedTags.findIndex(
        (t) => !t.id && t.name.toLowerCase() === ct.name.toLowerCase()
      );
      if (idx >= 0) {
        state.selectedTags[idx] = {
          id: ct.id,
          name: ct.name,
          category: ct.category,
          color: ct.color,
        };
      }
    });
  };

  return { init };
};

export default TravelLogFormPage;
