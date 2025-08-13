import { authService } from '../utils/auth.js';
import { apiService } from '../utils/api.js';
import {
  TripStatusUtils,
  DateUtils,
  UIUtils,
  showAlert,
} from '../utils/common.js';

const TripListPage = () => {
  // 상태 관리
  const state = {
    trips: [],
    currentPage: 0,
    pageSize: 10,
    totalPages: 0,
    totalElements: 0,
    filters: {
      status: '',
      destination: '',
      title: '',
      sortBy: 'createdAt',
      sortDirection: 'DESC',
    },
    selectedTrip: null,
  };

  // DOM 요소들
  const $elements = {
    $loadingContainer: null,
    $tripsContainer: null,
    $emptyContainer: null,
    $errorContainer: null,
    $totalCount: null,
    $paginationContainer: null,
    $tripDetailModal: null,
    $tripDetailModalBody: null,
  };

  // DOM 요소 초기화
  const initElements = () => {
    $elements.$loadingContainer = document.getElementById('loadingContainer');
    $elements.$tripsContainer = document.getElementById('tripsContainer');
    $elements.$emptyContainer = document.getElementById('emptyContainer');
    $elements.$errorContainer = document.getElementById('errorContainer');
    $elements.$totalCount = document.getElementById('totalCount');
    $elements.$paginationContainer = document.getElementById(
      'paginationContainer'
    );
    $elements.$tripDetailModal = new bootstrap.Modal(
      document.getElementById('tripDetailModal')
    );
    $elements.$tripDetailModalBody = document.getElementById(
      'tripDetailModalBody'
    );
  };

  // 여행 목록 로드
  const loadTrips = async () => {
    try {
      showLoading();

      const params = new URLSearchParams({
        page: state.currentPage,
        size: state.pageSize,
        sortBy: state.filters.sortBy,
        sortDirection: state.filters.sortDirection,
      });

      // 필터 추가
      if (state.filters.status) params.append('status', state.filters.status);
      if (state.filters.destination)
        params.append('destination', state.filters.destination);
      if (state.filters.title) params.append('title', state.filters.title);

      const response = await apiService.get(`/api/trips?${params.toString()}`);

      state.trips = response.data.content || [];
      state.totalPages = response.data.totalPages || 0;
      state.totalElements = response.data.totalElements || 0;

      displayTrips();
      displayPagination();
      updateTotalCount();
    } catch (error) {
      console.error('여행 목록 로딩 실패:', error);
      showError();
    }
  };

  // 여행 목록 표시
  const displayTrips = () => {
    const container = $elements.$tripsContainer;

    if (state.trips.length === 0) {
      showEmpty();
      return;
    }

    const tripsHtml = state.trips
      .map(
        (trip) => `
      <div class="col-md-6 col-lg-4 mb-3">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">${trip.title}</h5>
            <p class="card-text text-muted">${
          trip.description || '설명 없음'
        }</p>
            <div class="mb-2">
              <span class="badge cursor-pointer trip-status-badge bg-${TripStatusUtils.getStatusColor(
          trip.status,
          trip.statusInfo
        )}" data-trip-id="${trip.id}" data-status="${trip.status}">
                <i class="bi ${TripStatusUtils.getStatusIcon(
          trip.status,
          trip.statusInfo
        )}"></i>
                ${TripStatusUtils.getStatusText(
          trip.status,
          trip.statusDescription,
          trip.statusInfo
        )}
              </span>
            </div>
            <div class="row text-muted small">
              <div class="col-6">
                <i class="bi bi-geo-alt"></i> ${
          trip.destination || '목적지 없음'
        }
              </div>
              <div class="col-6">
                <i class="bi bi-calendar"></i> ${DateUtils.formatSimpleDate(
          trip.startDate
        )}
              </div>
            </div>
            ${
          trip.budget
            ? `
              <div class="mt-2">
                <small class="text-success">
                   ${UIUtils.formatCurrency(trip.budget)}
                </small>
              </div>
            `
            : ''
        }
            <div class="mt-2">
              <small class="text-info">
                <i class="bi bi-clock"></i> ${trip.duration}일
              </small>
              ${
          DateUtils.isFuture(trip.startDate) &&
          trip.status !== 'CANCELLED'
            ? `
                  <small class="ms-2 text-danger">
                    <i class="bi bi-hourglass-split"></i> ${DateUtils.formatDday(
              trip.startDate
            )}
                  </small>
                `
            : ''
        }
            </div>
          </div>
                      <div class="card-footer">
              <div class="d-flex justify-content-between">
                <button class="btn btn-sm btn-outline-primary trip-detail-btn" data-trip-id="${
          trip.id
        }">
                  <i class="bi bi-eye"></i> 상세보기
                </button>
                <button class="btn btn-sm btn-outline-warning edit-trip-btn" data-trip-id="${
          trip.id
        }">
                  <i class="bi bi-pencil"></i> 수정
                </button>
                <button class="btn btn-sm btn-outline-success travel-log-btn" data-trip-id="${
          trip.id
        }">
                  <i class="bi bi-journal-plus"></i> 일지작성
                </button>
              </div>
            </div>
        </div>
      </div>
    `
      )
      .join('');

    container.innerHTML = `
      <div class="row">
        ${tripsHtml}
      </div>
    `;

    showTrips();
  };

  // 페이징 표시
  const displayPagination = () => {
    const container = $elements.$paginationContainer;

    if (state.totalPages <= 1) {
      container.innerHTML = '';
      return;
    }

    let paginationHtml = '';

    // 이전 페이지 버튼
    paginationHtml += `
      <li class="page-item ${state.currentPage === 0 ? 'disabled' : ''}">
        <a class="page-link page-btn" href="#" data-page="${
      state.currentPage - 1
    }">
          <i class="bi bi-chevron-left"></i>
        </a>
      </li>
    `;

    // 페이지 번호들
    const startPage = Math.max(0, state.currentPage - 2);
    const endPage = Math.min(state.totalPages - 1, state.currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      paginationHtml += `
        <li class="page-item ${i === state.currentPage ? 'active' : ''}">
          <a class="page-link page-btn" href="#" data-page="${i}">${i + 1}</a>
        </li>
      `;
    }

    // 다음 페이지 버튼
    paginationHtml += `
      <li class="page-item ${
      state.currentPage === state.totalPages - 1 ? 'disabled' : ''
    }">
        <a class="page-link page-btn" href="#" data-page="${
      state.currentPage + 1
    }">
          <i class="bi bi-chevron-right"></i>
        </a>
      </li>
    `;

    container.innerHTML = paginationHtml;
  };

  // 여행 상세 정보 표시
  const displayTripDetail = async (tripId) => {
    try {
      const response = await apiService.get(`/api/trips/${tripId}`);
      const trip = response.data;

      state.selectedTrip = trip;

      const modalBody = $elements.$tripDetailModalBody;
      modalBody.innerHTML = `
        <div class="row">
          <div class="col-md-6">
            <h6>기본 정보</h6>
            <table class="table table-borderless">
              <tr>
                <td><strong>제목:</strong></td>
                <td>${trip.title}</td>
              </tr>
              <tr>
                <td><strong>상태:</strong></td>
                <td>
                  <span class="badge bg-${TripStatusUtils.getStatusColor(
        trip.status,
        trip.statusInfo
      )}">
                    <i class="bi ${TripStatusUtils.getStatusIcon(
        trip.status,
        trip.statusInfo
      )}"></i>
                    ${TripStatusUtils.getStatusText(
        trip.status,
        trip.statusDescription,
        trip.statusInfo
      )}
                  </span>
                </td>
              </tr>
              <tr>
                <td><strong>목적지:</strong></td>
                <td>${trip.destination || '목적지 없음'}</td>
              </tr>
              <tr>
                <td><strong>기간:</strong></td>
                <td>${DateUtils.formatSimpleDate(
        trip.startDate
      )} ~ ${DateUtils.formatSimpleDate(trip.endDate)} (${
        trip.duration
      }일)</td>
              </tr>
              <tr>
                <td><strong>예산:</strong></td>
                <td>${
        trip.budget
          ? UIUtils.formatCurrency(trip.budget)
          : '예산 없음'
      }</td>
              </tr>
            </table>
          </div>
          <div class="col-md-6">
            <h6>설명</h6>
            <p>${trip.description || '설명이 없습니다.'}</p>
            <hr>
            <h6>생성 정보</h6>
            <small class="text-muted">
              생성일: ${DateUtils.formatDateTime(trip.createdAt)}<br>
              수정일: ${DateUtils.formatDateTime(trip.updatedAt)}
            </small>
          </div>
        </div>
      `;

      $elements.$tripDetailModal?.show();
    } catch (error) {
      console.error('여행 상세 정보 로딩 실패:', error);
      alert('여행 상세 정보를 불러오는데 실패했습니다.');
    }
  };

  // 여행 삭제
  const deleteTrip = async () => {
    if (!state.selectedTrip) return;

    if (!confirm('정말로 이 여행을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await apiService.request(`/api/trips/${state.selectedTrip.id}`, {
        method: 'DELETE',
      });

      $elements.$tripDetailModal.hide();
      alert('여행이 성공적으로 삭제되었습니다.');
      loadTrips();
    } catch (error) {
      console.error('여행 삭제 실패:', error);
      alert('여행 삭제에 실패했습니다.');
    }
  };

  // UI 상태 관리
  const showLoading = () => {
    $elements.$loadingContainer?.style.setProperty('display', 'block');
    $elements.$tripsContainer?.style.setProperty('display', 'none');
    $elements.$emptyContainer?.style.setProperty('display', 'none');
    $elements.$errorContainer?.style.setProperty('display', 'none');
  };

  const showTrips = () => {
    $elements.$loadingContainer?.style.setProperty('display', 'none');
    $elements.$tripsContainer?.style.setProperty('display', 'block');
    $elements.$emptyContainer?.style.setProperty('display', 'none');
    $elements.$errorContainer?.style.setProperty('display', 'none');
  };

  const showEmpty = () => {
    $elements.$loadingContainer?.style.setProperty('display', 'none');
    $elements.$tripsContainer?.style.setProperty('display', 'none');
    $elements.$emptyContainer?.style.setProperty('display', 'block');
    $elements.$errorContainer?.style.setProperty('display', 'none');
  };

  const showError = () => {
    $elements.$loadingContainer?.style.setProperty('display', 'none');
    $elements.$tripsContainer?.style.setProperty('display', 'none');
    $elements.$emptyContainer?.style.setProperty('display', 'none');
    $elements.$errorContainer?.style.setProperty('display', 'block');
  };

  const updateTotalCount = () => {
    if ($elements.$totalCount) {
      $elements.$totalCount.textContent = `${UIUtils.formatNumber(
        state.totalElements
      )}개`;
    }
  };

  // 필터 적용
  const applyFilters = () => {
    state.filters.status = document.getElementById('statusFilter').value;
    state.filters.destination =
      document.getElementById('destinationFilter').value;
    state.filters.title = document.getElementById('titleFilter').value;
    state.filters.sortBy = document.getElementById('sortBy').value;
    state.filters.sortDirection = document.getElementById('sortDirection')
      .checked
      ? 'DESC'
      : 'ASC';

    state.currentPage = 0; // 첫 페이지로 이동
    loadTrips();
  };

  // 필터 초기화
  const clearFilters = () => {
    document.getElementById('statusFilter').value = '';
    document.getElementById('destinationFilter').value = '';
    document.getElementById('titleFilter').value = '';
    document.getElementById('sortBy').value = 'createdAt';
    document.getElementById('sortDirection').checked = true;

    state.filters = {
      status: '',
      destination: '',
      title: '',
      sortBy: 'createdAt',
      sortDirection: 'DESC',
    };

    state.currentPage = 0;
    loadTrips();
  };

  // 페이지 이동
  const goToPage = (page) => {
    if (page < 0 || page >= state.totalPages) return;
    state.currentPage = page;
    loadTrips();
  };

  // 페이지 크기 변경
  const changePageSize = (size) => {
    state.pageSize = parseInt(size);
    state.currentPage = 0;
    loadTrips();
  };

  // 이벤트 바인딩
  const bindEvents = () => {
    // 필터 버튼들 (정적 요소)
    document
      .getElementById('applyFilterBtn')
      ?.addEventListener('click', applyFilters);
    document
      .getElementById('clearFilterBtn')
      ?.addEventListener('click', clearFilters);

    // 새 여행 만들기 버튼 (정적 요소)
    document.getElementById('createTripBtn')?.addEventListener('click', () => {
      window.location.href = '/trips/new';
    });

    // 페이지 크기 변경 (정적 요소)
    document.querySelectorAll('input[name="pageSize"]').forEach((radio) => {
      radio.addEventListener('change', (e) => changePageSize(e.target.value));
    });

    // 모달 버튼들 (정적 요소)
    document.getElementById('editTripBtn')?.addEventListener('click', () => {
      if (state.selectedTrip) {
        window.location.href = `/trips/edit?id=${state.selectedTrip.id}`;
      }
    });

    document
      .getElementById('deleteTripBtn')
      ?.addEventListener('click', deleteTrip);
  };

  // 이벤트 위임 설정
  const setupEventDelegation = () => {
    // 여행 목록 컨테이너에 이벤트 위임
    $elements.$tripsContainer?.addEventListener('click', (e) => {
      // 상태 배지 클릭 이벤트 (상태 변경 메뉴 표시)
      const statusBadge = e.target.closest('.trip-status-badge');
      if (statusBadge) {
        e.preventDefault();
        e.stopPropagation();
        const tripId = parseInt(statusBadge.dataset.tripId);
        const currentStatus = statusBadge.dataset.status;
        const rect = statusBadge.getBoundingClientRect();
        openStatusMenu(tripId, currentStatus, {
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
        });
        return;
      }

      // 여행 상세보기 버튼 이벤트
      if (e.target.closest('.trip-detail-btn')) {
        const tripId = parseInt(
          e.target.closest('.trip-detail-btn').dataset.tripId
        );
        window.location.href = `/trips/detail?tripId=${tripId}`;
      }

      // 여행 수정 버튼 이벤트
      if (e.target.closest('.edit-trip-btn')) {
        const tripId = parseInt(
          e.target.closest('.edit-trip-btn').dataset.tripId
        );
        window.location.href = `/trips/edit?id=${tripId}`;
      }

      // 여행일지 작성 버튼 이벤트
      if (e.target.closest('.travel-log-btn')) {
        const tripId = parseInt(
          e.target.closest('.travel-log-btn').dataset.tripId
        );
        window.location.href = `/travel-logs/new?tripId=${tripId}`;
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

    // 빈 상태 컨테이너에 이벤트 위임
    $elements.$emptyContainer?.addEventListener('click', (e) => {
      if (e.target.closest('#createFirstTripBtn')) {
        window.location.href = '/trips/new';
      }
    });

    // 에러 상태 컨테이너에 이벤트 위임
    $elements.$errorContainer?.addEventListener('click', (e) => {
      if (e.target.closest('#retryBtn')) {
        loadTrips();
      }
    });
  };

  // 상태 변경 메뉴 닫기
  const closeStatusMenu = () => {
    const existing = document.querySelector('.trip-status-menu');
    if (existing) existing.remove();
    window.removeEventListener('scroll', closeStatusMenu, true);
    window.removeEventListener('resize', closeStatusMenu, true);
    document.removeEventListener('click', handleOutsideClick, true);
  };

  const handleOutsideClick = (event) => {
    if (!event.target.closest('.trip-status-menu')) {
      closeStatusMenu();
    }
  };

  // 상태 변경 메뉴 표시
  const openStatusMenu = (tripId, currentStatus, position) => {
    closeStatusMenu();

    const menu = document.createElement('div');
    menu.className = 'trip-status-menu card shadow-sm';
    menu.style.cssText = `
      position: absolute;
      top: ${position.top + 6}px;
      left: ${position.left}px;
      z-index: 1060;
      min-width: 180px;
    `;

    const statusOptions = ['PLANNING', 'ONGOING', 'COMPLETED', 'CANCELLED'];
    const itemsHtml = statusOptions
      .map((s) => {
        const active = s === currentStatus;
        const color = TripStatusUtils.getStatusColor(s);
        const icon = TripStatusUtils.getStatusIcon(s);
        const text = TripStatusUtils.getStatusText(s);
        return `
          <button type="button" class="list-group-item list-group-item-action d-flex align-items-center ${
          active ? 'active' : ''
        }" data-status="${s}">
            <span class="badge bg-${color} me-2"><i class="bi ${icon}"></i></span>
            <span>${text}</span>
            ${active ? '<i class="bi bi-check2 ms-auto"></i>' : ''}
          </button>
        `;
      })
      .join('');

    menu.innerHTML = `
      <div class="list-group list-group-flush">
        ${itemsHtml}
      </div>
    `;

    menu.addEventListener('click', async (ev) => {
      const btn = ev.target.closest('[data-status]');
      if (!btn) return;
      const newStatus = btn.dataset.status;
      if (newStatus === currentStatus) {
        closeStatusMenu();
        return;
      }
      try {
        await updateTripStatus(tripId, newStatus);
        showAlert('여행 상태가 변경되었습니다.', 'success');
        closeStatusMenu();
        await loadTrips();
      } catch (err) {
        console.error('상태 변경 실패:', err);
        showAlert('상태 변경에 실패했습니다.', 'warning');
      }
    });

    document.body.appendChild(menu);
    setTimeout(() => {
      document.addEventListener('click', handleOutsideClick, true);
      window.addEventListener('scroll', closeStatusMenu, true);
      window.addEventListener('resize', closeStatusMenu, true);
    }, 0);
  };

  // 상태 업데이트 API 호출
  const updateTripStatus = async (tripId, status) => {
    await apiService.request(`/api/trips/${tripId}/status?status=${status}`, {
      method: 'PATCH',
    });
  };

  // 초기화 함수
  const init = async () => {
    // DOM 요소 초기화
    initElements();

    // 이벤트 위임 설정
    setupEventDelegation();

    // 이벤트 바인딩
    bindEvents();

    // 초기 데이터 로딩
    await loadTrips();
  };

  // 컴포넌트 반환
  return {
    init,
  };
};

export default TripListPage;