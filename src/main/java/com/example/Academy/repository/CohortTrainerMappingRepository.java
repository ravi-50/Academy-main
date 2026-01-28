package com.example.Academy.repository;

import com.example.Academy.entity.CohortTrainerMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CohortTrainerMappingRepository extends JpaRepository<CohortTrainerMapping, Long> {

    List<CohortTrainerMapping> findByCohortId(Long cohortId);

    boolean existsByCohortIdAndTrainerId(Long cohortId, Long trainerId);

    void deleteByCohortIdAndTrainerId(Long cohortId, Long trainerId);

    void deleteByTrainerId(Long trainerId);
}