package com.example.Academy.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

import com.example.Academy.entity.Activity;
import com.example.Academy.repository.ActivityRepository;

@Service
public class ActivityService {

    @Autowired
    private ActivityRepository activityRepository;

    public Activity save(Activity activity) {
        return activityRepository.save(activity);
    }

    public List<Activity> getByCohort(Long cohortId) {
        return activityRepository.findByCohortId(cohortId);
    }
}
