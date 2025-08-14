package com.spring.toyproject.repository.base;

import com.spring.toyproject.domain.entity.Trip;
import com.spring.toyproject.domain.entity.User;
import com.spring.toyproject.repository.custom.TripRepositoryCustom;
import com.spring.toyproject.repository.custom.TripSearchCondition;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface TripRepository extends JpaRepository<Trip, Long>, TripRepositoryCustom {

    // 동적 쿼리로 검색 조건별 여행 목록 조회 메서드 (페이징 포함)
    @Query("SELECT t FROM Trip t WHERE t.user = :user")
    Page<Trip> getTripList(User user, TripSearchCondition condition, Pageable pageable);

    // 사용자별 여행 존재 여부 확인
    boolean existsByUserAndTitle(User user, String title);

    // 사용자별 여행 ID로 조회 (보안을 위해 사용자 정보도 함께 확인)
    Optional<Trip> findByIdAndUser(Long id, User user);
}