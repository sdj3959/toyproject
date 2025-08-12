package com.spring.toyproject.repository.base;

import com.spring.toyproject.domain.entity.Trip;
import com.spring.toyproject.repository.custom.TripRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TripRepository extends JpaRepository<Trip, Long>, TripRepositoryCustom {
}
