package org.ftclub.cabinet.alarm.slack;

import feign.FeignException.FeignClientException;
import org.ftclub.cabinet.alarm.slack.dto.SlackResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "slack-client", url = "https://slack.com/api/")
public interface SlackFeignClient {

    @GetMapping("/users.lookupByEmail")
    SlackResponse getUserInfoByEmail(
            @RequestHeader("Content-Type") String contentType,
            @RequestHeader("Authorization") String bearerToken,
            @RequestParam("email") String email) throws FeignClientException;
}
