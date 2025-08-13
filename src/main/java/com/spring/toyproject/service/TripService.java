package com.spring.toyproject.service;

import com.spring.toyproject.domain.dto.request.TripRequest;
import com.spring.toyproject.domain.dto.response.TripListItemDto;
import com.spring.toyproject.domain.entity.Trip;
import com.spring.toyproject.domain.entity.User;
import com.spring.toyproject.exception.BusinessException;
import com.spring.toyproject.exception.ErrorCode;
import com.spring.toyproject.repository.base.TripRepository;
import com.spring.toyproject.repository.base.UserRepository;
import com.spring.toyproject.repository.custom.TripRepositoryCustom;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
// 반드시 JPA를 사용할 경우 트랜잭션 처리를 서비스에서 해야함
@Transactional
public class TripService {

    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    /**
     * 여행 정보 생성
     *
     * @param request  - 여행 생성 요청시 클라이언트가 보내는 JSON
     * @param username - 로그인한 유저가 제시한 토큰에서 파싱한 이름
     * @return 생성된 여행의 정보
     */
    public Trip createTrip(TripRequest request, String username) {
        log.info("여행 생성 시작! - 사용자명: {}, 제목: {}"
                , username, request.getTitle());

        // 토큰에서 파싱한 유저이름을 통해 유저정보를 조회
        User foundUser = userRepository.findByUsername(username)
                .orElseThrow(
                        () -> new BusinessException(ErrorCode.USER_NOT_FOUND)
                );

        // 여행 엔터티 생성
        Trip trip = Trip.builder()
                .title(request.getTitle())
                .budget(request.getBudget())
                .description(request.getDescription())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .status(request.getStatus())
                .destination(request.getDestination())
                .user(foundUser) // 지금 로그인한 사람의 정보 (엔터티),
                // JPA는 FK를 넣을때 id만 넣는게 아니라 엔터티를 통째로넣어야함
                .build();

        // 여행 정보 생성
        Trip savedTrip = tripRepository.save(trip);
        log.info("여행 생성 완료 - 여행 ID: {}", savedTrip.getId());

        return savedTrip;
    }

    /**
     * 목록 화면 전용: 최소 필드만 포함한 DTO로 반환
     */
    public Page<TripListItemDto> getUserTripsList(String username, TripRepositoryCustom.TripSearchCondition condition, Pageable pageable) {
        log.info("사용자별 여행 목록 조회(Compact) - 사용자명: {}, 페이징: {}", username, pageable);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        Page<Trip> tripPage = tripRepository.getTripList(user, condition, pageable);
        return tripPage.map(TripListItemDto::from);
    }

}