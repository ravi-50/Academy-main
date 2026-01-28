package com.example.Academy.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.Academy.entity.Activity;
import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByCohortId(Long cohortId);
}
