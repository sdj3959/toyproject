package com.spring.toyproject.repository.impl;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.spring.toyproject.domain.entity.QTrip;
import com.spring.toyproject.domain.entity.Trip;
import com.spring.toyproject.domain.entity.User;
import com.spring.toyproject.repository.custom.TripRepositoryCustom;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.spring.toyproject.domain.entity.QTrip.*;

/**
 * TripRepositoryCustom의 구현체
 * QueryDSL이나 JDBC 네이티브쿼리 자유롭게 사용가능
 */
@Repository
@Slf4j
@RequiredArgsConstructor
public class TripRepositoryImpl implements TripRepositoryCustom {

    private final JPAQueryFactory factory;
//    private final JdbcTemplate jdbcTemplate; // JDBC 사용하고 싶을 경우

    @Override
    public Page<Trip> findTripsByUser(User user, TripSearchCondition condition, Pageable pageable) {

        /*
            SELECT *
            FROM trips
            WHERE user_id = ?
                AND title LIKE '%?%'
                AND destination LIKE ...
            ORDER BY ??? ASC??
         */

        // WHERE절 동적으로 만들기
        BooleanBuilder whereClause = new BooleanBuilder();
        whereClause.and(trip.user.eq(user));

        // 나머지 검색조건 동적으로 생성
        // 1. 상태검색
        if (condition.getStatus() != null) {
            whereClause.and(trip.status.eq(condition.getStatus()));
        }

        // 2. 목적지 검색
        if (condition.getDestination() != null && !condition.getDestination().trim().isEmpty()) {
            // contains - LIKE %?% , IngnoreCase LOWER()
            // AND destination LIKE LOWER('%검색어%')
            whereClause.and(trip.destination.containsIgnoreCase(condition.getDestination()));
        }

        // 3. 제목 검색
        if (condition.getTitle() != null && !condition.getTitle().trim().isEmpty()) {
            whereClause.and(trip.title.containsIgnoreCase(condition.getTitle()));
        }

        // 여행 목록 조회
        List<Trip> tripList = factory
                .selectFrom(trip)
                .where(whereClause)
                .fetch();

        return null;
    }
}
