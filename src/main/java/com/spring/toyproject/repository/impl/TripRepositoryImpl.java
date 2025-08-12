package com.spring.toyproject.repository.impl;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.spring.toyproject.domain.entity.QTrip;
import com.spring.toyproject.domain.entity.QUser;
import com.spring.toyproject.domain.entity.Trip;
import com.spring.toyproject.domain.entity.User;
import com.spring.toyproject.repository.custom.TripRepositoryCustom;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
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

        // 나머지는 검색조건 동적으로 생성
        // 1. 상태 검색
        if (condition.getStatus() != null) {
            whereClause.and(trip.status.eq(condition.getStatus()));
        }
        // 2. 목적지 검색
        if (condition.getDestination() != null && !condition.getDestination().trim().isEmpty()) {
            // contains - LIKE %?% ,  IgnoreCase LOWER()
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
                .orderBy(getOrderSpecifier(condition))
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long totalCount = factory
                .select(trip.count())
                .from(trip)
                .where(whereClause)
                .fetchOne();

        // 페이징 원본데이터 수 374개인데 이걸 한페이지당 10개씩 뿌려야된다
        // 그럼 총 페이지수는? 38페이지
        // 이전, 다음 버튼 활성화 여부
        return new PageImpl<>(tripList, pageable, totalCount == null ? 0 : totalCount);
    }

    private OrderSpecifier<?> getOrderSpecifier(TripSearchCondition condition) {

        // 정렬조건
        String sortBy = condition.getSortBy();
        // 정렬방향
        String sortDirection = condition.getSortDirection();

        OrderSpecifier<?> specifier;

        switch (sortBy.toLowerCase()) {
            case "startdate":
                specifier = sortDirection.equalsIgnoreCase("DESC")
                        ? trip.startDate.desc()
                        : trip.startDate.asc();
                break;
            case "enddate":
                specifier = sortDirection.equalsIgnoreCase("DESC")
                        ? trip.endDate.desc()
                        : trip.endDate.asc();
                break;
            case "title":
                specifier = sortDirection.equalsIgnoreCase("DESC")
                        ? trip.title.desc()
                        : trip.title.asc();
                break;
            case "destination":
                specifier = sortDirection.equalsIgnoreCase("DESC")
                        ? trip.destination.desc()
                        : trip.destination.asc();
                break;
            default:
                specifier = sortDirection.equalsIgnoreCase("DESC")
                        ? trip.createdAt.desc()
                        : trip.createdAt.asc();
                break;
        }

        return specifier;
    }
}
