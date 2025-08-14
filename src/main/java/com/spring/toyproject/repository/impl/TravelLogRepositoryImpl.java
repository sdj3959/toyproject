package com.spring.toyproject.repository.impl;


import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.spring.toyproject.domain.entity.*;
import com.spring.toyproject.repository.custom.TravelLogRepositoryCustom;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * TravelLogRepository 커스텀 구현체
 * QueryDSL과 Native Query를 사용하여 JPQL 메서드들을 구현
 */
@Repository
@RequiredArgsConstructor
public class TravelLogRepositoryImpl implements TravelLogRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public Page<TravelLog> searchUserTravelLogs(Long userId, String keyword, Pageable pageable) {
        QTravelLog travelLog = QTravelLog.travelLog;
        QTrip trip = QTrip.trip;
        QTravelLogTag tlt = QTravelLogTag.travelLogTag;
        QTag tag = QTag.tag;

        BooleanBuilder where = new BooleanBuilder();
        where.and(trip.user.id.eq(userId));
        if (keyword != null && !keyword.isBlank()) {
            String k = keyword.trim();
            where.and(
                    travelLog.title.containsIgnoreCase(k)
                            .or(travelLog.content.containsIgnoreCase(k))
                            .or(travelLog.location.containsIgnoreCase(k))
            );
        }

        List<TravelLog> content = queryFactory
                .selectDistinct(travelLog)
                .from(travelLog)
                .innerJoin(travelLog.trip, trip)
                .leftJoin(tlt).on(tlt.travelLog.id.eq(travelLog.id))
                .leftJoin(tag).on(tag.id.eq(tlt.tag.id)
                        .and(keyword != null && !keyword.isBlank() ? tag.name.containsIgnoreCase(keyword.trim()) : null))
                .where(where)
                .orderBy(travelLog.logDate.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        long total = queryFactory
                .select(travelLog.countDistinct())
                .from(travelLog)
                .innerJoin(travelLog.trip, trip)
                .leftJoin(tlt).on(tlt.travelLog.id.eq(travelLog.id))
                .leftJoin(tag).on(tag.id.eq(tlt.tag.id))
                .where(where)
                .fetchOne();

        return new PageImpl<>(content, pageable, total);
    }

    @Override
    public Page<TravelLog> findTravelLogsByTrip(Trip trip, TravelLogSearchCondition condition, Pageable pageable) {
        QTravelLog travelLog = QTravelLog.travelLog;

        BooleanBuilder whereClause = new BooleanBuilder();
        whereClause.and(travelLog.trip.eq(trip));

        // 동적 조건 추가
        addSearchConditions(whereClause, travelLog, condition);

        List<TravelLog> content;
        if (pageable.isUnpaged()) {
            content = queryFactory
                    .selectFrom(travelLog)
                    .where(whereClause)
                    .orderBy(getOrderSpecifier(travelLog, condition))
                    .fetch();
        } else {
            content = queryFactory
                    .selectFrom(travelLog)
                    .where(whereClause)
                    .orderBy(getOrderSpecifier(travelLog, condition))
                    .offset(pageable.getOffset())
                    .limit(pageable.getPageSize())
                    .fetch();
        }

        Long total = queryFactory
                .select(travelLog.count())
                .from(travelLog)
                .where(whereClause)
                .fetchOne();

        return new PageImpl<>(content, pageable, total == null ? 0 : total);
    }

    @Override
    public Page<TravelLog> findTravelLogsByUserId(Long userId, TravelLogSearchCondition condition, Pageable pageable) {
        QTravelLog travelLog = QTravelLog.travelLog;
        QTrip trip = QTrip.trip;

        BooleanBuilder whereClause = new BooleanBuilder();
        whereClause.and(trip.user.id.eq(userId));

        // 동적 조건 추가 (여행 조건 대신 사용자 조건으로 시작)
        addSearchConditions(whereClause, travelLog, condition);

        List<TravelLog> content;
        if (pageable.isUnpaged()) {
            content = queryFactory
                    .selectFrom(travelLog)
                    .innerJoin(travelLog.trip, trip)
                    .where(whereClause)
                    .orderBy(getOrderSpecifier(travelLog, condition))
                    .fetch();
        } else {
            content = queryFactory
                    .selectFrom(travelLog)
                    .innerJoin(travelLog.trip, trip)
                    .where(whereClause)
                    .orderBy(getOrderSpecifier(travelLog, condition))
                    .offset(pageable.getOffset())
                    .limit(pageable.getPageSize())
                    .fetch();
        }

        Long total = queryFactory
                .select(travelLog.count())
                .from(travelLog)
                .innerJoin(travelLog.trip, trip)
                .where(whereClause)
                .fetchOne();

        return new PageImpl<>(content, pageable, total == null ? 0 : total);
    }



    @Override
    public long countByTrip(Trip trip) {
        QTravelLog travelLog = QTravelLog.travelLog;

        return queryFactory
                .select(travelLog.count())
                .from(travelLog)
                .where(travelLog.trip.eq(trip))
                .fetchOne();
    }

    @Override
    public Double getAverageRatingByTrip(Trip trip) {
        QTravelLog travelLog = QTravelLog.travelLog;

        Double result = queryFactory
                .select(travelLog.rating.avg())
                .from(travelLog)
                .where(travelLog.trip.eq(trip)
                        .and(travelLog.rating.isNotNull()))
                .fetchOne();

        return result != null ? result : 0.0;
    }

    // 동적 검색 조건을 추가하는 헬퍼 메서드
    private void addSearchConditions(BooleanBuilder whereClause, QTravelLog travelLog, TravelLogSearchCondition condition) {
        // 특정 날짜
        if (condition.getLogDate() != null) {
            whereClause.and(travelLog.logDate.eq(condition.getLogDate()));
        }

        // 날짜 범위
        if (condition.getStartDate() != null && condition.getEndDate() != null) {
            whereClause.and(travelLog.logDate.between(condition.getStartDate(), condition.getEndDate()));
        }

        // 위치 검색
        if (condition.getLocation() != null && !condition.getLocation().trim().isEmpty()) {
            whereClause.and(travelLog.location.containsIgnoreCase(condition.getLocation()));
        }

        // 기분 검색
        if (condition.getMood() != null && !condition.getMood().trim().isEmpty()) {
            whereClause.and(travelLog.mood.containsIgnoreCase(condition.getMood()));
        }

        // 제목 검색
        if (condition.getTitle() != null && !condition.getTitle().trim().isEmpty()) {
            whereClause.and(travelLog.title.containsIgnoreCase(condition.getTitle()));
        }

        // 내용 검색
        if (condition.getContent() != null && !condition.getContent().trim().isEmpty()) {
            whereClause.and(travelLog.content.containsIgnoreCase(condition.getContent()));
        }

        // 최소 평점
        if (condition.getMinRating() != null) {
            whereClause.and(travelLog.rating.goe(condition.getMinRating()));
        }

        // 지출 여부
        if (condition.getHasExpenses() != null) {
            if (condition.getHasExpenses()) {
                whereClause.and(travelLog.expenses.gt(0L));
            } else {
                whereClause.and(travelLog.expenses.isNull().or(travelLog.expenses.eq(0L)));
            }
        }
    }

    // 정렬 조건을 생성하는 헬퍼 메서드
    private OrderSpecifier<?> getOrderSpecifier(QTravelLog travelLog, TravelLogSearchCondition condition) {
        String sortBy = condition.getSortBy();
        String sortDirection = condition.getSortDirection();

        OrderSpecifier<?> orderSpecifier;

        switch (sortBy.toLowerCase()) {
            case "createdat":
                orderSpecifier = "DESC".equalsIgnoreCase(sortDirection)
                        ? travelLog.createdAt.desc()
                        : travelLog.createdAt.asc();
                break;
            case "rating":
                orderSpecifier = "DESC".equalsIgnoreCase(sortDirection)
                        ? travelLog.rating.desc()
                        : travelLog.rating.asc();
                break;
            case "expenses":
                orderSpecifier = "DESC".equalsIgnoreCase(sortDirection)
                        ? travelLog.expenses.desc()
                        : travelLog.expenses.asc();
                break;
            case "logdate":
            default:
                orderSpecifier = "DESC".equalsIgnoreCase(sortDirection)
                        ? travelLog.logDate.desc()
                        : travelLog.logDate.asc();
                break;
        }

        return orderSpecifier;
    }

    @Override
    public Long getTotalExpensesByTrip(Trip trip) {
        QTravelLog travelLog = QTravelLog.travelLog;

        Long result = queryFactory
                .select(travelLog.expenses.sum())
                .from(travelLog)
                .where(travelLog.trip.eq(trip)
                        .and(travelLog.expenses.isNotNull()))
                .fetchOne();

        return result != null ? result : 0L;
    }

    @Override
    public long countByUserId(Long userId) {
        QTravelLog travelLog = QTravelLog.travelLog;
        QTrip trip = QTrip.trip;
        Long result = queryFactory
                .select(travelLog.count())
                .from(travelLog)
                .innerJoin(travelLog.trip, trip)
                .where(trip.user.id.eq(userId))
                .fetchOne();
        return result != null ? result : 0L;
    }

    @Override
    public Double getAverageRatingByUserId(Long userId) {
        QTravelLog travelLog = QTravelLog.travelLog;
        QTrip trip = QTrip.trip;
        Double result = queryFactory
                .select(travelLog.rating.avg())
                .from(travelLog)
                .innerJoin(travelLog.trip, trip)
                .where(trip.user.id.eq(userId)
                        .and(travelLog.rating.isNotNull()))
                .fetchOne();
        return result != null ? result : 0.0;
    }

    @Override
    public Long getTotalExpensesByUserId(Long userId) {
        QTravelLog travelLog = QTravelLog.travelLog;
        QTrip trip = QTrip.trip;
        Long result = queryFactory
                .select(travelLog.expenses.sum())
                .from(travelLog)
                .innerJoin(travelLog.trip, trip)
                .where(trip.user.id.eq(userId)
                        .and(travelLog.expenses.isNotNull()))
                .fetchOne();
        return result != null ? result : 0L;
    }

    @Override
    public List<TravelLog> findByUserIdOrderByLogDateDesc(Long userId) {
        QTravelLog travelLog = QTravelLog.travelLog;
        QTrip trip = QTrip.trip;

        return queryFactory
                .selectFrom(travelLog)
                .innerJoin(travelLog.trip, trip)
                .where(trip.user.id.eq(userId))
                .orderBy(travelLog.logDate.desc())
                .fetch();
    }

    @Override
    public List<TravelLog> findByUserIdAndLogDate(Long userId, LocalDate logDate) {
        QTravelLog travelLog = QTravelLog.travelLog;
        QTrip trip = QTrip.trip;

        return queryFactory
                .selectFrom(travelLog)
                .innerJoin(travelLog.trip, trip)
                .where(trip.user.id.eq(userId)
                        .and(travelLog.logDate.eq(logDate)))
                .orderBy(travelLog.createdAt.desc())
                .fetch();
    }
}