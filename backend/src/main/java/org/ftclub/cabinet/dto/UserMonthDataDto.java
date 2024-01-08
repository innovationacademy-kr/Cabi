package org.ftclub.cabinet.dto;

import lombok.Getter;
import lombok.ToString;
import lombok.extern.log4j.Log4j2;

@Getter
@ToString
@Log4j2
public class UserMonthDataDto {

    private int id;
    private String login;
    private int monthAccumationTime;

    public int getMonthAccumationTime() {
       log.info("called getMonthAccumationTime = {}", monthAccumationTime);
        return monthAccumationTime;
    }
// Getters and setters
}

