package com.spring.toyproject.repository.base;

import com.spring.toyproject.domain.entity.Trip;
import com.spring.toyproject.domain.entity.User;
import com.spring.toyproject.repository.custom.TripRepositoryCustom;
import com.spring.toyproject.repository.custom.TripSearchCondition;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface TripRepository extends JpaRepository<Trip, Long>, TripRepositoryCustom {

    // 동적 쿼리로 검색 조건별 여행 목록 조회 메서드 (페이징 포함)
    @Query("SELECT t FROM Trip t WHERE t.user = :user")
    Page<Trip> findTripsByUser(User user, TripSearchCondition condition, Pageable pageable);
}