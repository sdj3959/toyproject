package com.spring.toyproject.repository.base;

import com.spring.toyproject.domain.entity.TravelLog;
import com.spring.toyproject.domain.entity.Trip;
import com.spring.toyproject.repository.custom.TravelLogRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TravelLogRepository extends JpaRepository<TravelLog, Long>, TravelLogRepositoryCustom {
    // 여행별 여행일지 존재 여부 확인
    boolean existsByTripAndTitle(Trip trip, String title);
}