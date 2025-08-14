package com.spring.toyproject.repository.base;

import com.spring.toyproject.domain.entity.TravelLogTag;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TravelLogTagRepository extends JpaRepository<TravelLogTag, Long> {
}