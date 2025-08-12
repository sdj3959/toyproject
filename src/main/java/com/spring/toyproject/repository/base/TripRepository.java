package com.spring.toyproject.repository.base;

import com.spring.toyproject.domain.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TripRepository extends JpaRepository<Trip, Long> {
}
