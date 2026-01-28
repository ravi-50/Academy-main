package com.example.Academy.service;

import com.example.Academy.entity.StakeholderEffort;
import com.example.Academy.entity.User;
import com.example.Academy.entity.WeeklySummary;
import com.example.Academy.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private UserService userService;

    @Async
    public void sendDailyEffortNotification(StakeholderEffort effort) {
        List<User> recipients = userService.getUsersByRole(User.Role.COACH);
        recipients.addAll(userService.getUsersByRole(User.Role.LOCATION_LEAD));
        recipients.addAll(userService.getUsersByRole(User.Role.ADMIN));

        String subject = "Daily Effort Submission Notification";
        String body = buildDailyEffortEmailBody(effort);

        sendEmail(recipients, subject, body);
    }

    @Async
    public void sendWeeklySummaryNotification(WeeklySummary summary) {
        List<User> recipients = userService.getUsersByRole(User.Role.COACH);
        recipients.addAll(userService.getUsersByRole(User.Role.LOCATION_LEAD));
        recipients.addAll(userService.getUsersByRole(User.Role.ADMIN));

        String subject = "Weekly Effort Summary - " + summary.getCohort().getCode();
        String body = buildWeeklySummaryEmailBody(summary);

        sendEmail(recipients, subject, body);
    }

    private void sendEmail(List<User> recipients, String subject, String body) {
        for (User recipient : recipients) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(recipient.getEmail());
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        }
    }

    private String buildDailyEffortEmailBody(StakeholderEffort effort) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MMM-yyyy");

        return String.format(
            "Dear Team,\n\n" +
            "A new effort has been submitted:\n\n" +
            "Cohort: %s\n" +
            "Trainer/Mentor: %s (%s)\n" +
            "Role: %s\n" +
            "Mode: %s\n" +
            "Area of Work: %s\n" +
            "Effort Hours: %.2f\n" +
            "Date: %s\n" +
            "Submitted By: %s\n\n" +
            "Best regards,\n" +
            "Academy System",
            effort.getCohort().getCode(),
            effort.getTrainerMentor().getName(),
            effort.getTrainerMentor().getEmpId(),
            effort.getRole(),
            effort.getMode(),
            effort.getAreaOfWork(),
            effort.getEffortHours(),
            effort.getEffortDate().format(formatter),
            effort.getUpdatedBy().getName()
        );
    }

    private String buildWeeklySummaryEmailBody(WeeklySummary summary) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MMM-yyyy");

        return String.format(
            "Dear Team,\n\n" +
            "Weekly effort summary for Cohort %s:\n\n" +
            "Week: %s to %s\n" +
            "Total Effort Hours: %.2f\n" +
            "Summary Generated: %s\n\n" +
            "Please review the efforts for this week.\n\n" +
            "Best regards,\n" +
            "Academy System",
            summary.getCohort().getCode(),
            summary.getWeekStartDate().format(formatter),
            summary.getWeekEndDate().format(formatter),
            summary.getTotalHours(),
            summary.getSummaryDate().format(DateTimeFormatter.ofPattern("dd-MMM-yyyy HH:mm"))
        );
    }
}