import { apiService } from '../utils/api.js';
import { authService } from '../utils/auth.js';
import { ValidationUtils } from '../utils/common.js';

/**
 * 여행 등록/수정 페이지 모듈
 */
const TripFormPage = () => {
  // 상태 관리
  const state = {
    tripId: null,
    isEditMode: false,
    isLoading: false,
  };

  // DOM 요소 참조
  const $elements = {
    $pageTitle: null,
    $tripForm: null,
    $title: null,
    $destination: null,
    $startDate: null,
    $endDate: null,
    $status: null,
    $budget: null,
    $description: null,
    $submitBtn: null,
    $cancelBtn: null,
    $spinner: null,
  };

  // DOM 요소 초기화
  const initElements = () => {
    $elements.$pageTitle = document.getElementById('pageTitle');
    $elements.$tripForm = document.getElementById('tripForm');
    $elements.$title = document.getElementById('title');
    $elements.$destination = document.getElementById('destination');
    $elements.$startDate = document.getElementById('startDate');
    $elements.$endDate = document.getElementById('endDate');
    $elements.$status = document.getElementById('status');
    $elements.$budget = document.getElementById('budget');
    $elements.$description = document.getElementById('description');
    $elements.$submitBtn = document.getElementById('submitBtn');
    $elements.$cancelBtn = document.getElementById('cancelBtn');
    $elements.$spinner = $elements.$submitBtn?.querySelector('.spinner-border');
  };

  // URL에서 여행 ID 추출
  const extractTripIdFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const tripId = urlParams.get('id');
    return tripId ? parseInt(tripId) : null;
  };

  // 편집 모드 설정
  const setupEditMode = () => {
    state.tripId = extractTripIdFromUrl();
    state.isEditMode = !!state.tripId;

    if (state.isEditMode && $elements.$pageTitle) {
      $elements.$pageTitle.textContent = '여행 수정';
    }
  };

  // 기존 여행 데이터 로드 (편집 모드)
  const loadTripData = async () => {
    if (!state.isEditMode) return;

    try {
      setLoading(true);
      const response = await apiService.get(`/api/trips/${state.tripId}`);

      if (response.success) {
        const trip = response.data;
        populateForm(trip);
      } else {
        alert('여행 정보를 불러오는데 실패했습니다.');
        window.location.href = '/trips';
      }
    } catch (error) {
      console.error('여행 데이터 로딩 실패:', error);
      alert('여행 정보를 불러오는데 실패했습니다.');
      window.location.href = '/trips';
    } finally {
      setLoading(false);
    }
  };

  // 폼에 데이터 채우기
  const populateForm = (trip) => {
    if ($elements.$title) $elements.$title.value = trip.title || '';
    if ($elements.$destination)
      $elements.$destination.value = trip.destination || '';
    if ($elements.$startDate) $elements.$startDate.value = trip.startDate || '';
    if ($elements.$endDate) $elements.$endDate.value = trip.endDate || '';
    if ($elements.$status) $elements.$status.value = trip.status || '';
    if ($elements.$budget) $elements.$budget.value = trip.budget || '';
    if ($elements.$description)
      $elements.$description.value = trip.description || '';
  };

  // 폼 데이터 수집
  const collectFormData = () => {
    const statusValue = $elements.$status?.value;
    const titleValue = $elements.$title?.value?.trim();
    const destinationValue = $elements.$destination?.value?.trim();
    const descriptionValue = $elements.$description?.value?.trim();

    return {
      title: titleValue,
      destination: destinationValue,
      startDate: $elements.$startDate?.value,
      endDate: $elements.$endDate?.value,
      status: statusValue && statusValue !== '' ? statusValue : null,
      budget: $elements.$budget?.value
        ? parseInt($elements.$budget.value)
        : null,
      description: descriptionValue || null,
    };
  };

  // 폼 유효성 검사
  const validateForm = (formData) => {
    const errors = [];

    // 제목 검사
    if (!formData.title) {
      errors.push('여행 제목을 입력해주세요.');
      $elements.$title?.classList.add('is-invalid');
    } else {
      $elements.$title?.classList.remove('is-invalid');
    }

    // 목적지 검사
    if (!formData.destination) {
      errors.push('여행 목적지를 입력해주세요.');
      $elements.$destination?.classList.add('is-invalid');
    } else {
      $elements.$destination?.classList.remove('is-invalid');
    }

    // 시작일 검사
    if (!formData.startDate) {
      errors.push('시작일을 선택해주세요.');
      $elements.$startDate?.classList.add('is-invalid');
    } else {
      $elements.$startDate?.classList.remove('is-invalid');
    }

    // 종료일 검사
    if (!formData.endDate) {
      errors.push('종료일을 선택해주세요.');
      $elements.$endDate?.classList.add('is-invalid');
    } else {
      $elements.$endDate?.classList.remove('is-invalid');
    }

    // 여행 상태 검사
    if (!formData.status) {
      errors.push('여행 상태를 선택해주세요.');
      $elements.$status?.classList.add('is-invalid');
    } else {
      $elements.$status?.classList.remove('is-invalid');
    }

    // 날짜 유효성 검사
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);

      if (startDate > endDate) {
        errors.push('시작일은 종료일보다 이전이어야 합니다.');
        $elements.$startDate?.classList.add('is-invalid');
        $elements.$endDate?.classList.add('is-invalid');
      } else {
        $elements.$startDate?.classList.remove('is-invalid');
        $elements.$endDate?.classList.remove('is-invalid');
      }
    }

    // 예산 검사
    if (formData.budget !== null && formData.budget < 0) {
      errors.push('예산은 0 이상이어야 합니다.');
      $elements.$budget?.classList.add('is-invalid');
    } else {
      $elements.$budget?.classList.remove('is-invalid');
    }

    return errors;
  };

  // 폼 제출 처리
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (state.isLoading) return;

    const formData = collectFormData();
    const errors = validateForm(formData);

    if (errors.length > 0) {
      return;
    }

    try {
      setLoading(true);

      let response;
      if (state.isEditMode) {
        response = await apiService.put(`/api/trips/${state.tripId}`, formData);
      } else {
        response = await apiService.post('/api/trips', formData);
      }

      alert(
        state.isEditMode ? '여행이 수정되었습니다.' : '여행이 등록되었습니다.'
      );
      window.location.href = '/trips';
    } catch (error) {
      console.error('여행 저장 실패:', error);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 취소 버튼 처리
  const handleCancel = () => {
    if (confirm('작성 중인 내용이 사라집니다. 정말 취소하시겠습니까?')) {
      window.location.href = '/trips';
    }
  };

  // 로딩 상태 설정
  const setLoading = (loading) => {
    state.isLoading = loading;

    if ($elements.$submitBtn) {
      $elements.$submitBtn.disabled = loading;
    }

    if ($elements.$spinner) {
      $elements.$spinner.classList.toggle('d-none', !loading);
    }
  };

  // 이벤트 바인딩
  const bindEvents = () => {
    $elements.$tripForm?.addEventListener('submit', handleSubmit);
    $elements.$cancelBtn?.addEventListener('click', handleCancel);

    // 날짜 입력 시 자동 유효성 검사
    $elements.$startDate?.addEventListener('change', () => {
      if ($elements.$startDate?.value && $elements.$endDate?.value) {
        const startDate = new Date($elements.$startDate.value);
        const endDate = new Date($elements.$endDate.value);

        if (startDate > endDate) {
          $elements.$endDate.value = $elements.$startDate.value;
        }
      }
    });

    $elements.$endDate?.addEventListener('change', () => {
      if ($elements.$startDate?.value && $elements.$endDate?.value) {
        const startDate = new Date($elements.$startDate.value);
        const endDate = new Date($elements.$endDate.value);

        if (startDate > endDate) {
          $elements.$startDate.value = $elements.$endDate.value;
        }
      }
    });
  };

  // 초기화 함수
  const init = async () => {


    // DOM 요소 초기화
    initElements();

    // 편집 모드 설정
    setupEditMode();

    // 기존 데이터 로드 (편집 모드)
    // await loadTripData();

    // 이벤트 바인딩
    bindEvents();
  };

  // 컴포넌트 반환
  return {
    init,
  };
};

export default TripFormPage;