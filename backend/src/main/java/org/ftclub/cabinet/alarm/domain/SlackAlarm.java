package org.ftclub.cabinet.alarm.domain;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;

@RequiredArgsConstructor
@ToString
@Getter
public class SlackAlarm implements Alarm {

    private String receiverName;
    private String receiverEmail;
    private String receiverPhone;
}
