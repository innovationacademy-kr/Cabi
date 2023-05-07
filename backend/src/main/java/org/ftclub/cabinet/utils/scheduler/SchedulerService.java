package org.ftclub.cabinet.utils.scheduler;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.auth.OauthService;
import org.ftclub.cabinet.config.FtApiProperties;
import org.ftclub.cabinet.dto.LentDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.exception.ServiceException;
import org.ftclub.cabinet.lent.service.LentService;
import org.ftclub.cabinet.utils.expired.checker.ExpiredChecker;
import org.ftclub.cabinet.utils.leave.absence.LeaveAbsenceManager;
import org.json.JSONObject;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Component
@RequiredArgsConstructor
@EnableScheduling
public class SchedulerService {
    private LeaveAbsenceManager leaveAbsenceManager;
    private ExpiredChecker expiredChecker;
    private FtApiProperties ftApiProperties;
    private LentService lentService;

    public String getFtToken() {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        map.add("grant_type", "client_credentials");

        map.add("client_id", this.ftApiProperties.getClientId());
        map.add("client_secret", this.ftApiProperties.getClientSecret());
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);
        try {
            return new JSONObject(
                    restTemplate.postForEntity(this.ftApiProperties.getTokenUri(), request,
                            String.class).getBody())
                    .get(this.ftApiProperties.getAccessTokenName())
                    .toString();
        } catch (Exception e) {
            throw new ServiceException(ExceptionStatus.OAUTH_BAD_GATEWAY);
        }
    }

    // Every Midnight
    @Scheduled(cron = "0 0 0 * * *")
    public void checkLeaveAbsence() {
        List<LentDto> lentList = lentService.getAllExpiredLents();
        String apiToken = this.getFtToken();
        for (LentDto lent : lentList) {
            this.expiredChecker.handleExpired(lent);
            this.leaveAbsenceManager.handleLeaveAbsence(lent, apiToken);
            // 2초 간격으로 API 호출
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
