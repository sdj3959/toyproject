package com.spring.toyproject.repository.base;

import com.spring.toyproject.domain.entity.TravelLogTag;
import com.spring.toyproject.repository.custom.TravelLogTagRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TravelLogTagRepository extends JpaRepository<TravelLogTag, Long>, TravelLogTagRepositoryCustom {
}