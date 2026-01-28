package com.example.Academy.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

import com.example.Academy.entity.Activity;
import com.example.Academy.service.ActivityService;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    @Autowired
    private ActivityService activityService;

    @PostMapping
    public Activity create(@RequestBody Activity activity) {
        return activityService.save(activity);
    }

    @GetMapping("/cohort/{id}")
    public List<Activity> getByCohort(@PathVariable Long id) {
        return activityService.getByCohort(id);
    }
}
