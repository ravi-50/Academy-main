package com.example.Academy.repository;

import com.example.Academy.entity.CohortMentorMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CohortMentorMappingRepository extends JpaRepository<CohortMentorMapping, Long> {

    List<CohortMentorMapping> findByCohortId(Long cohortId);

    boolean existsByCohortIdAndMentorId(Long cohortId, Long mentorId);

    void deleteByCohortIdAndMentorId(Long cohortId, Long mentorId);

    void deleteByMentorId(Long mentorId);
}