// 여행 상세보기 페이지 모듈
import { apiService } from '../utils/api.js';
import { authService } from '../utils/auth.js';
import {
  TripStatusUtils,
  DateUtils,
  UIUtils,
  showAlert,
} from '../utils/common.js';

const TripDetail = () => {
  // 상태 관리
  const state = {
    tripId: null,
    tripData: null,
    travelLogs: [],
    isLoading: false,
    isDeleting: false,
  };

  // DOM 요소 참조
  const $elements = {
    // 페이지 헤더
    $editBtn: null,
    $deleteBtn: null,

    // 로딩/에러 상태
    $loadingContainer: null,
    $errorContainer: null,
    $errorMessage: null,

    // 여행 상세 정보
    $tripDetailContainer: null,
    $tripTitle: null,
    $tripDestination: null,
    $tripStartDate: null,
    $tripEndDate: null,
    $tripDuration: null,
    $tripStatus: null,
    $tripBudget: null,
    $tripCreatedAt: null,
    $tripUpdatedAt: null,
    $tripDescription: null,

    // 여행일지 관련
    $addTravelLogBtn: null,
    $createFirstTravelLogBtn: null,
    $travelLogsLoadingContainer: null,
    $travelLogsErrorContainer: null,
    $travelLogsErrorMessage: null,
    $travelLogsContainer: null,
    $travelLogsList: null,
    $travelLogsEmptyContainer: null,

    // 삭제 모달
    $deleteConfirmModal: null,
    $confirmDeleteBtn: null,
  };

  // DOM 요소 초기화
  const initElements = () => {
    $elements.$editBtn = document.getElementById('editBtn');
    $elements.$deleteBtn = document.getElementById('deleteBtn');

    $elements.$loadingContainer = document.getElementById('loadingContainer');
    $elements.$errorContainer = document.getElementById('errorContainer');
    $elements.$errorMessage = document.getElementById('errorMessage');

    $elements.$tripDetailContainer = document.getElementById(
      'tripDetailContainer'
    );
    $elements.$tripTitle = document.getElementById('tripTitle');
    $elements.$tripDestination = document.getElementById('tripDestination');
    $elements.$tripStartDate = document.getElementById('tripStartDate');
    $elements.$tripEndDate = document.getElementById('tripEndDate');
    $elements.$tripDuration = document.getElementById('tripDuration');
    $elements.$tripStatus = document.getElementById('tripStatus');
    $elements.$tripBudget = document.getElementById('tripBudget');
    $elements.$tripCreatedAt = document.getElementById('tripCreatedAt');
    $elements.$tripUpdatedAt = document.getElementById('tripUpdatedAt');
    $elements.$tripDescription = document.getElementById('tripDescription');

    $elements.$addTravelLogBtn = document.getElementById('addTravelLogBtn');
    $elements.$createFirstTravelLogBtn = document.getElementById(
      'createFirstTravelLogBtn'
    );
    $elements.$travelLogsLoadingContainer = document.getElementById(
      'travelLogsLoadingContainer'
    );
    $elements.$travelLogsErrorContainer = document.getElementById(
      'travelLogsErrorContainer'
    );
    $elements.$travelLogsErrorMessage = document.getElementById(
      'travelLogsErrorMessage'
    );
    $elements.$travelLogsContainer = document.getElementById(
      'travelLogsContainer'
    );
    $elements.$travelLogsList = document.getElementById('travelLogsList');
    $elements.$travelLogsEmptyContainer = document.getElementById(
      'travelLogsEmptyContainer'
    );

    $elements.$deleteConfirmModal =
      document.getElementById('deleteConfirmModal');
    $elements.$confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  };

  // URL에서 여행 ID 추출
  const extractTripId = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const tripId = urlParams.get('tripId');
    return tripId ? parseInt(tripId) : null;
  };

  // 여행 정보 로딩
  const loadTripDetail = async () => {
    if (!state.tripId) {
      showError('여행 ID를 찾을 수 없습니다.');
      return;
    }

    state.isLoading = true;
    showLoading();

    try {
      const response = await apiService.get(`/api/trips/${state.tripId}`);
      state.tripData = response.data;
      renderTripDetail();
      await loadTravelLogs();
    } catch (error) {
      console.error('여행 정보 로딩 실패:', error);
      showError(error.message || '여행 정보를 불러올 수 없습니다.');
    } finally {
      state.isLoading = false;
    }
  };

  // 여행일지 목록 로딩
  const loadTravelLogs = async () => {
    if (!state.tripId) return;

    try {
      const response = await apiService.get(
        `/api/travel-logs?tripId=${state.tripId}&size=10`
      );
      state.travelLogs = response.data.content || [];
      renderTravelLogs();
    } catch (error) {
      console.error('여행일지 목록 로딩 실패:', error);
      showTravelLogsError(error.message || '여행일지를 불러올 수 없습니다.');
    }
  };

  // 여행 상세 정보 렌더링
  const renderTripDetail = () => {
    if (!state.tripData) return;

    const trip = state.tripData;

    // 기본 정보
    if ($elements.$tripTitle) $elements.$tripTitle.textContent = trip.title;
    if ($elements.$tripDestination)
      $elements.$tripDestination.textContent = trip.destination || '-';
    if ($elements.$tripStartDate)
      $elements.$tripStartDate.textContent = DateUtils.formatDate(
        trip.startDate
      );
    if ($elements.$tripEndDate)
      $elements.$tripEndDate.textContent = DateUtils.formatDate(trip.endDate);

    // 여행 기간 계산
    if ($elements.$tripDuration) {
      const startDate = new Date(trip.startDate);
      const endDate = new Date(trip.endDate);
      const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
      $elements.$tripDuration.textContent = `${days}일`;
    }

    // 상태 정보
    if ($elements.$tripStatus) {
      $elements.$tripStatus.textContent = TripStatusUtils.getStatusText(
        trip.status,
        trip.statusDescription,
        trip.statusInfo
      );
      const color = TripStatusUtils.getStatusColor(
        trip.status,
        trip.statusInfo
      );
      $elements.$tripStatus.className = `badge bg-${color}`;
    }

    // 예산 정보
    if ($elements.$tripBudget) {
      $elements.$tripBudget.textContent = trip.budget
        ? `${trip.budget.toLocaleString()}원`
        : '-';
    }

    // 날짜 정보
    if ($elements.$tripCreatedAt) {
      $elements.$tripCreatedAt.textContent = DateUtils.formatDateTime(
        trip.createdAt
      );
    }
    if ($elements.$tripUpdatedAt) {
      $elements.$tripUpdatedAt.textContent = DateUtils.formatDateTime(
        trip.updatedAt
      );
    }

    // 설명 정보
    if ($elements.$tripDescription) {
      $elements.$tripDescription.textContent =
        trip.description || '설명이 없습니다.';
    }

    hideLoading();
    showTripDetail();
  };

  // 여행일지 목록 렌더링
  const renderTravelLogs = () => {
    if (!state.travelLogs || state.travelLogs.length === 0) {
      showTravelLogsEmpty();
      return;
    }

    const travelLogsHtml = state.travelLogs
      .map(
        (log) => `
      <div class="card mb-3">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start">
            <div class="flex-grow-1">
              <h6 class="card-title mb-1">${log.title || '제목 없음'}</h6>
              <p class="card-text text-muted small mb-2">
                <i class="fas fa-calendar"></i> ${DateUtils.formatDate(
          log.logDate
        )}
                ${
          log.location
            ? `<i class="fas fa-map-marker-alt ms-2"></i> ${log.location}`
            : ''
        }
              </p>
              <p class="card-text">${
          log.content
            ? log.content.substring(0, 100) +
            (log.content.length > 100 ? '...' : '')
            : '내용이 없습니다.'
        }</p>
            </div>
            <div class="ms-3">
              <button class="btn btn-outline-primary btn-sm" onclick="window.location.href='/travel-logs/detail?travelLogId=${
          log.id
        }'">
                <i class="fas fa-eye"></i> 보기
              </button>
            </div>
          </div>
        </div>
      </div>
    `
      )
      .join('');

    if ($elements.$travelLogsList) {
      $elements.$travelLogsList.innerHTML = travelLogsHtml;
    }

    showTravelLogs();
  };

  // 여행 수정 페이지로 이동
  const handleEdit = () => {
    if (!state.tripId) return;
    window.location.href = `/trips/edit?id=${state.tripId}`;
  };

  // 여행 삭제 처리
  const handleDelete = async () => {
    if (!state.tripId || state.isDeleting) return;

    state.isDeleting = true;

    try {
      await apiService.request(`/api/trips/${state.tripId}`, {
        method: 'DELETE',
      });

      showAlert('여행이 성공적으로 삭제되었습니다.', 'success');
      setTimeout(() => {
        window.location.href = '/trips';
      }, 1500);
    } catch (error) {
      console.error('여행 삭제 실패:', error);
      showAlert(error.message || '여행 삭제에 실패했습니다.', 'warning');
    } finally {
      state.isDeleting = false;
    }
  };

  // 여행일지 추가 페이지로 이동
  const handleAddTravelLog = () => {
    if (!state.tripId) return;
    window.location.href = `/travel-logs/new?tripId=${state.tripId}`;
  };

  // 로딩 상태 표시
  const showLoading = () => {
    if ($elements.$loadingContainer)
      $elements.$loadingContainer.classList.remove('d-none');
    if ($elements.$errorContainer)
      $elements.$errorContainer.classList.add('d-none');
    if ($elements.$tripDetailContainer)
      $elements.$tripDetailContainer.classList.add('d-none');
  };

  // 로딩 상태 숨김
  const hideLoading = () => {
    if ($elements.$loadingContainer)
      $elements.$loadingContainer.classList.add('d-none');
  };

  // 여행 상세 정보 표시
  const showTripDetail = () => {
    if ($elements.$tripDetailContainer)
      $elements.$tripDetailContainer.classList.remove('d-none');
  };

  // 에러 상태 표시
  const showError = (message) => {
    if ($elements.$errorMessage) $elements.$errorMessage.textContent = message;
    if ($elements.$errorContainer)
      $elements.$errorContainer.classList.remove('d-none');
    if ($elements.$loadingContainer)
      $elements.$loadingContainer.classList.add('d-none');
    if ($elements.$tripDetailContainer)
      $elements.$tripDetailContainer.classList.add('d-none');
  };

  // 여행일지 로딩 상태 표시
  const showTravelLogsLoading = () => {
    if ($elements.$travelLogsLoadingContainer)
      $elements.$travelLogsLoadingContainer.classList.remove('d-none');
    if ($elements.$travelLogsErrorContainer)
      $elements.$travelLogsErrorContainer.classList.add('d-none');
    if ($elements.$travelLogsContainer)
      $elements.$travelLogsContainer.classList.add('d-none');
    if ($elements.$travelLogsEmptyContainer)
      $elements.$travelLogsEmptyContainer.classList.add('d-none');
  };

  // 여행일지 표시
  const showTravelLogs = () => {
    if ($elements.$travelLogsLoadingContainer)
      $elements.$travelLogsLoadingContainer.classList.add('d-none');
    if ($elements.$travelLogsErrorContainer)
      $elements.$travelLogsErrorContainer.classList.add('d-none');
    if ($elements.$travelLogsContainer)
      $elements.$travelLogsContainer.classList.remove('d-none');
    if ($elements.$travelLogsEmptyContainer)
      $elements.$travelLogsEmptyContainer.classList.add('d-none');
  };

  // 여행일지 없음 표시
  const showTravelLogsEmpty = () => {
    if ($elements.$travelLogsLoadingContainer)
      $elements.$travelLogsLoadingContainer.classList.add('d-none');
    if ($elements.$travelLogsErrorContainer)
      $elements.$travelLogsErrorContainer.classList.add('d-none');
    if ($elements.$travelLogsContainer)
      $elements.$travelLogsContainer.classList.add('d-none');
    if ($elements.$travelLogsEmptyContainer)
      $elements.$travelLogsEmptyContainer.classList.remove('d-none');
  };

  // 여행일지 에러 표시
  const showTravelLogsError = (message) => {
    if ($elements.$travelLogsErrorMessage)
      $elements.$travelLogsErrorMessage.textContent = message;
    if ($elements.$travelLogsErrorContainer)
      $elements.$travelLogsErrorContainer.classList.remove('d-none');
    if ($elements.$travelLogsLoadingContainer)
      $elements.$travelLogsLoadingContainer.classList.add('d-none');
    if ($elements.$travelLogsContainer)
      $elements.$travelLogsContainer.classList.add('d-none');
    if ($elements.$travelLogsEmptyContainer)
      $elements.$travelLogsEmptyContainer.classList.add('d-none');
  };

  // 이벤트 리스너 등록
  const initEventListeners = () => {
    // 수정 버튼
    if ($elements.$editBtn) {
      $elements.$editBtn.addEventListener('click', handleEdit);
    }

    // 삭제 버튼
    if ($elements.$deleteBtn) {
      $elements.$deleteBtn.addEventListener('click', () => {
        if ($elements.$deleteConfirmModal) {
          const modal = new bootstrap.Modal($elements.$deleteConfirmModal);
          modal.show();
        }
      });
    }

    // 삭제 확인 버튼
    if ($elements.$confirmDeleteBtn) {
      $elements.$confirmDeleteBtn.addEventListener('click', handleDelete);
    }

    // 여행일지 추가 버튼
    if ($elements.$addTravelLogBtn) {
      $elements.$addTravelLogBtn.addEventListener('click', handleAddTravelLog);
    }

    // 첫 번째 여행일지 작성 버튼
    if ($elements.$createFirstTravelLogBtn) {
      $elements.$createFirstTravelLogBtn.addEventListener(
        'click',
        handleAddTravelLog
      );
    }
  };

  // 초기화
  const init = async () => {
    // 인증 확인
    if (!authService.isAuthenticated()) {
      window.location.href = '/login';
      return;
    }

    // DOM 요소 초기화
    initElements();

    // 여행 ID 추출
    state.tripId = extractTripId();

    // 이벤트 리스너 등록
    initEventListeners();

    // 여행 정보 로딩
    await loadTripDetail();
  };

  return {
    init,
  };
};

// 모듈 내보내기
export default TripDetail;
