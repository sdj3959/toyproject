import { apiService } from '../utils/api.js';
import { authService } from '../utils/auth.js';
import {
  TripStatusUtils,
  DateUtils,
  UIUtils,
  ArrayUtils,
} from '../utils/common.js';

const TravelLogListPage = () => {
  // 상태 관리
  const state = {
    travelLogs: [],
    trips: [],
    pagination: {
      currentPage: 0,
      totalPages: 0,
      totalElements: 0,
      size: 10,
    },
    filters: {
      tripId: '',
      logDate: '',
      location: '',
      page: 0,
      size: 10,
    },
  };

  // 별점 HTML 생성
  const renderStars = (rating) => {
    if (!Number.isInteger(rating) || rating < 1) return '';
    const filled = Math.min(rating, 5);
    const empty = 5 - filled;
    const starsHtml = `${'<i class="bi bi-star-fill"></i>'.repeat(
      filled
    )}${'<i class="bi bi-star"></i>'.repeat(empty)}`;
    return `<span class="text-warning" aria-label="평점 ${filled}점">${starsHtml}</span>`;
  };

  // DOM 요소 참조
  const $elements = {
    $createTravelLogBtn: null,
    $createFirstTravelLogBtn: null,
    $tripFilter: null,
    $dateFilter: null,
    $locationFilter: null,
    $applyFilterBtn: null,
    $retryBtn: null,
    $loadingContainer: null,
    $travelLogsContainer: null,
    $emptyContainer: null,
    $errorContainer: null,
    $paginationContainer: null,
    $pagination: null,
  };

  // DOM 요소 초기화
  const initElements = () => {
    $elements.$createTravelLogBtn =
      document.getElementById('createTravelLogBtn');
    $elements.$createFirstTravelLogBtn = document.getElementById(
      'createFirstTravelLogBtn'
    );
    $elements.$tripFilter = document.getElementById('tripFilter');
    $elements.$dateFilter = document.getElementById('dateFilter');
    $elements.$locationFilter = document.getElementById('locationFilter');
    $elements.$applyFilterBtn = document.getElementById('applyFilterBtn');
    $elements.$retryBtn = document.getElementById('retryBtn');
    $elements.$loadingContainer = document.getElementById('loadingContainer');
    $elements.$travelLogsContainer = document.getElementById(
      'travelLogsContainer'
    );
    $elements.$emptyContainer = document.getElementById('emptyContainer');
    $elements.$errorContainer = document.getElementById('errorContainer');
    $elements.$paginationContainer = document.getElementById(
      'paginationContainer'
    );
    $elements.$pagination = document.getElementById('pagination');
  };

  // 여행 목록 로드
  const loadTrips = async () => {
    try {
      const response = await apiService.get('/api/trips?size=100');
      if (response.success) {
        state.trips = response.data.content || [];
        populateTripFilter();
      }
    } catch (error) {
      console.error('여행 목록 로드 실패:', error);
    }
  };

  // 여행 필터 옵션 생성
  const populateTripFilter = () => {
    if (!$elements.$tripFilter) return;

    // 기존 옵션 제거 (첫 번째 "전체 여행" 옵션 제외)
    while ($elements.$tripFilter.children.length > 1) {
      $elements.$tripFilter.removeChild($elements.$tripFilter.lastChild);
    }

    // 여행 옵션 추가
    state.trips.forEach((trip) => {
      const option = document.createElement('option');
      option.value = trip.id;
      option.textContent = trip.title;
      $elements.$tripFilter.appendChild(option);
    });
  };

  // 여행일지 목록 로드
  const loadTravelLogs = async () => {
    showLoading();

    try {
      const params = new URLSearchParams({
        page: state.filters.page,
        size: state.filters.size,
      });

      if (state.filters.tripId) {
        params.append('tripId', state.filters.tripId);
      }

      if (state.filters.logDate) {
        params.append('logDate', state.filters.logDate);
      }

      if (state.filters.location) {
        params.append('location', state.filters.location);
      }

      const response = await apiService.get(`/api/travel-logs?${params}`);

      if (response.success) {
        state.travelLogs = response.data.content || [];
        state.pagination = {
          currentPage: response.data.pageable?.pageNumber || 0,
          totalPages: response.data.totalPages || 0,
          totalElements: response.data.totalElements || 0,
          size: response.data.size || 10,
        };

        if (state.travelLogs.length === 0) {
          showEmpty();
        } else {
          showTravelLogs();
          displayTravelLogs();
          displayPagination();
        }
      } else {
        showError();
      }
    } catch (error) {
      console.error('여행일지 목록 로드 실패:', error);
      // 여행이 없어서 여행일지 조회가 실패한 경우 빈 배열로 처리
      if (error.message && error.message.includes('여행을 찾을 수 없습니다')) {
        state.travelLogs = [];
        state.pagination = {
          currentPage: 0,
          totalPages: 0,
          totalElements: 0,
          size: 10,
        };
        showEmpty();
      } else {
        showError();
      }
    }
  };

  // 여행일지 목록 표시
  const displayTravelLogs = () => {
    if (!$elements.$travelLogsContainer) return;

    // 여행별로 그룹핑
    const groupedByTrip = groupTravelLogsByTrip(state.travelLogs);

    $elements.$travelLogsContainer.innerHTML = '';

    Object.entries(groupedByTrip).forEach(([tripId, travelLogs]) => {
      const trip = state.trips.find((t) => t.id == tripId);
      const tripCard = createTripGroupCard(trip, travelLogs);
      $elements.$travelLogsContainer.appendChild(tripCard);
    });
  };

  // 여행별로 여행일지 그룹핑
  const groupTravelLogsByTrip = (travelLogs) => {
    return ArrayUtils.groupBy(
      travelLogs,
      (travelLog) => travelLog.trip?.id || 'unknown'
    );
  };

  // 여행 그룹 카드 생성
  const createTripGroupCard = (trip, travelLogs) => {
    const tripCard = document.createElement('div');
    tripCard.className = 'col-12 mb-4';

    const tripTitle = trip ? trip.title : '알 수 없는 여행';
    const tripStatus = trip
      ? TripStatusUtils.getStatusText(
        trip.status,
        trip.statusDescription,
        trip.statusInfo
      )
      : '';
    const tripStatusColor = trip
      ? TripStatusUtils.getStatusColor(trip.status, trip.statusInfo)
      : 'secondary';

    tripCard.innerHTML = `
      <div class="card">
        <div class="card-header bg-light">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h5 class="mb-0">
                <i class="bi bi-airplane"></i> ${tripTitle}
              </h5>
              <small class="text-muted">
                <span class="badge bg-${tripStatusColor}">${tripStatus}</span>
                ${trip ? `• ${travelLogs.length}개의 여행일지` : ''}
              </small>
            </div>
            ${
      trip
        ? `
              <button class="btn btn-sm btn-outline-primary trip-detail-btn" data-trip-id="${trip.id}">
                <i class="bi bi-eye"></i> 여행 상세
              </button>
            `
        : ''
    }
          </div>
        </div>
        <div class="card-body">
          <div class="row">
            ${travelLogs
      .map((travelLog) => createTravelLogCard(travelLog))
      .join('')}
          </div>
        </div>
      </div>
    `;

    return tripCard;
  };

  // 여행일지 카드 생성
  const createTravelLogCard = (travelLog) => {
    const date = DateUtils.formatDate(travelLog.createdAt);
    const location = travelLog.location || '위치 정보 없음';
    const mood = travelLog.mood || '기분 정보 없음';
    const cover = travelLog.coverImageUrl || '';

    return `
      <div class="col-md-6 col-lg-4 mb-3">
        <div class="card h-100 travel-log-card" data-travel-log-id="${
      travelLog.id
    }">
          ${
      cover
        ? `<img src="${cover}" class="card-img-top" alt="cover" style="height:180px;object-fit:cover;"/>`
        : ''
    }
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <h6 class="card-title mb-0">${travelLog.title || '제목 없음'}</h6>
              <small class="text-muted">${date}</small>
            </div>
            <p class="card-text text-muted small mb-2">
              <i class="bi bi-geo-alt"></i> ${location}
            </p>
            <p class="card-text text-muted small mb-2">
              <i class="bi bi-emoji-smile"></i> ${mood}
            </p>
            ${
      renderStars(travelLog.rating)
        ? `<div class="mb-2">${renderStars(travelLog.rating)}</div>`
        : ''
    }
            <p class="card-text small">
              ${UIUtils.truncateText(travelLog.content, 100)}
            </p>
          </div>
          <div class="card-footer bg-transparent">
            <div class="d-flex justify-content-between align-items-center">
              <button class="btn btn-sm btn-outline-primary travel-log-detail-btn" data-travel-log-id="${
      travelLog.id
    }">
                <i class="bi bi-eye"></i> 상세보기
              </button>
              <div class="btn-group btn-group-sm">
                <button class="btn btn-outline-secondary edit-travel-log-btn" data-travel-log-id="${
      travelLog.id
    }">
                  <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-outline-danger delete-travel-log-btn" data-travel-log-id="${
      travelLog.id
    }">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  // 페이징 표시
  const displayPagination = () => {
    if (!$elements.$pagination || state.pagination.totalPages <= 1) {
      if ($elements.$paginationContainer) {
        $elements.$paginationContainer.style.display = 'none';
      }
      return;
    }

    $elements.$paginationContainer.style.display = 'block';
    $elements.$pagination.innerHTML = '';

    // 이전 페이지 버튼
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${
      state.pagination.currentPage === 0 ? 'disabled' : ''
    }`;
    prevLi.innerHTML = `
      <a class="page-link page-btn" href="#" data-page="${
      state.pagination.currentPage - 1
    }">
        <i class="bi bi-chevron-left"></i>
      </a>
    `;
    $elements.$pagination.appendChild(prevLi);

    // 페이지 번호 버튼들
    const startPage = Math.max(0, state.pagination.currentPage - 2);
    const endPage = Math.min(
      state.pagination.totalPages - 1,
      state.pagination.currentPage + 2
    );

    for (let i = startPage; i <= endPage; i++) {
      const pageLi = document.createElement('li');
      pageLi.className = `page-item ${
        i === state.pagination.currentPage ? 'active' : ''
      }`;
      pageLi.innerHTML = `
        <a class="page-link page-btn" href="#" data-page="${i}">${i + 1}</a>
      `;
      $elements.$pagination.appendChild(pageLi);
    }

    // 다음 페이지 버튼
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${
      state.pagination.currentPage === state.pagination.totalPages - 1
        ? 'disabled'
        : ''
    }`;
    nextLi.innerHTML = `
      <a class="page-link page-btn" href="#" data-page="${
      state.pagination.currentPage + 1
    }">
        <i class="bi bi-chevron-right"></i>
      </a>
    `;
    $elements.$pagination.appendChild(nextLi);
  };

  // 필터 적용
  const applyFilters = () => {
    state.filters.tripId = $elements.$tripFilter?.value || '';
    state.filters.logDate = $elements.$dateFilter?.value || '';
    state.filters.location = $elements.$locationFilter?.value || '';
    state.filters.page = 0;

    loadTravelLogs();
  };

  // 페이지 이동
  const goToPage = (page) => {
    state.filters.page = page;
    loadTravelLogs();
  };

  // 여행일지 상세보기
  const showTravelLogDetail = (travelLogId) => {
    window.location.href = `/travel-logs/detail?travelLogId=${travelLogId}`;
  };

  // 여행일지 수정
  const editTravelLog = (travelLogId) => {
    alert(`여행일지 수정: ${travelLogId}\n이 기능은 아직 구현되지 않았습니다.`);
  };

  // 여행일지 삭제
  const deleteTravelLog = async (travelLogId) => {
    if (!confirm('정말로 이 여행일지를 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await apiService.delete(
        `/api/travel-logs/${travelLogId}`
      );
      if (response.success) {
        alert('여행일지가 삭제되었습니다.');
        loadTravelLogs();
      } else {
        alert('여행일지 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('여행일지 삭제 실패:', error);
      alert('여행일지 삭제 중 오류가 발생했습니다.');
    }
  };

  // UI 상태 관리
  const showLoading = () => {
    $elements.$loadingContainer?.style.setProperty('display', 'block');
    $elements.$travelLogsContainer?.style.setProperty('display', 'none');
    $elements.$emptyContainer?.style.setProperty('display', 'none');
    $elements.$errorContainer?.style.setProperty('display', 'none');
    $elements.$paginationContainer?.style.setProperty('display', 'none');
  };

  const showTravelLogs = () => {
    $elements.$loadingContainer?.style.setProperty('display', 'none');
    $elements.$travelLogsContainer?.style.setProperty('display', 'block');
    $elements.$emptyContainer?.style.setProperty('display', 'none');
    $elements.$errorContainer?.style.setProperty('display', 'none');
  };

  const showEmpty = () => {
    $elements.$loadingContainer?.style.setProperty('display', 'none');
    $elements.$travelLogsContainer?.style.setProperty('display', 'none');
    $elements.$emptyContainer?.style.setProperty('display', 'block');
    $elements.$errorContainer?.style.setProperty('display', 'none');
    $elements.$paginationContainer?.style.setProperty('display', 'none');
  };

  const showError = () => {
    $elements.$loadingContainer?.style.setProperty('display', 'none');
    $elements.$travelLogsContainer?.style.setProperty('display', 'none');
    $elements.$emptyContainer?.style.setProperty('display', 'none');
    $elements.$errorContainer?.style.setProperty('display', 'block');
    $elements.$paginationContainer?.style.setProperty('display', 'none');
  };

  // 이벤트 위임 설정
  const setupEventDelegation = () => {
    // 여행일지 컨테이너에 이벤트 위임
    $elements.$travelLogsContainer?.addEventListener('click', (e) => {
      // 여행일지 상세보기 버튼 이벤트
      if (e.target.closest('.travel-log-detail-btn')) {
        const travelLogId = parseInt(
          e.target.closest('.travel-log-detail-btn').dataset.travelLogId
        );
        showTravelLogDetail(travelLogId);
      }

      // 여행일지 수정 버튼 이벤트
      if (e.target.closest('.edit-travel-log-btn')) {
        const travelLogId = parseInt(
          e.target.closest('.edit-travel-log-btn').dataset.travelLogId
        );
        editTravelLog(travelLogId);
      }

      // 여행일지 삭제 버튼 이벤트
      if (e.target.closest('.delete-travel-log-btn')) {
        const travelLogId = parseInt(
          e.target.closest('.delete-travel-log-btn').dataset.travelLogId
        );
        deleteTravelLog(travelLogId);
      }

      // 여행 상세보기 버튼 이벤트
      if (e.target.closest('.trip-detail-btn')) {
        const tripId = parseInt(
          e.target.closest('.trip-detail-btn').dataset.tripId
        );
        alert(`여행 상세보기: ${tripId}\n이 기능은 아직 구현되지 않았습니다.`);
      }
    });

    // 빈 상태 컨테이너에 이벤트 위임
    $elements.$emptyContainer?.addEventListener('click', (e) => {
      if (e.target.closest('#createFirstTravelLogBtn')) {
        // TODO: 여행일지 작성 페이지 연결 예정
        window.location.href = '/trips';
      }
    });

    // 에러 상태 컨테이너에 이벤트 위임
    $elements.$errorContainer?.addEventListener('click', (e) => {
      if (e.target.closest('#retryBtn')) {
        loadTravelLogs();
      }
    });

    // 페이징 컨테이너에 이벤트 위임
    $elements.$paginationContainer?.addEventListener('click', (e) => {
      if (e.target.closest('.page-btn')) {
        e.preventDefault();
        const page = parseInt(e.target.closest('.page-btn').dataset.page);
        goToPage(page);
      }
    });
  };

  // 이벤트 바인딩
  const bindEvents = () => {
    // 새 여행일지 작성 버튼 (정적 요소)
    $elements.$createTravelLogBtn?.addEventListener('click', () => {
      alert('여행일지 작성 페이지는 아직 구현되지 않았습니다.');
    });

    // 필터 적용 버튼 (정적 요소)
    $elements.$applyFilterBtn?.addEventListener('click', applyFilters);

    // 다시 시도 버튼 (정적 요소)
    $elements.$retryBtn?.addEventListener('click', loadTravelLogs);
  };

  // 초기화 함수
  const init = async () => {
    // DOM 요소 초기화
    initElements();

    // 이벤트 위임 설정
    setupEventDelegation();

    // 이벤트 바인딩
    bindEvents();

    // 여행 목록 먼저 로딩
    await loadTrips();

    // 여행이 있을 때만 여행일지 로딩
    if (state.trips.length > 0) {
      await loadTravelLogs();
    } else {
      // 여행이 없으면 여행일지도 빈 상태로 표시
      state.travelLogs = [];
      state.pagination = { currentPage: 0, totalPages: 0, totalElements: 0 };
      showEmpty();
    }
  };

  // 컴포넌트 반환
  return {
    init,
  };
};

export default TravelLogListPage;
