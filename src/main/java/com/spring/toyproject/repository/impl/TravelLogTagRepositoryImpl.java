package com.spring.toyproject.repository.impl;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.spring.toyproject.domain.entity.Tag;
import com.spring.toyproject.repository.custom.TravelLogTagRepositoryCustom;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.spring.toyproject.domain.entity.QTag.*;
import static com.spring.toyproject.domain.entity.QTravelLogTag.*;

@Repository
@RequiredArgsConstructor
public class TravelLogTagRepositoryImpl implements TravelLogTagRepositoryCustom {

    private final JPAQueryFactory factory;

    @Override
    public List<Tag> findTagsByTravelLogId(Long travelLogId) {
        return factory
                .select(tag)
                .from(travelLogTag)
                .innerJoin(travelLogTag.tag, tag)
                .where(travelLogTag.travelLog.id.eq(travelLogId))
                .fetch();
    }
}
