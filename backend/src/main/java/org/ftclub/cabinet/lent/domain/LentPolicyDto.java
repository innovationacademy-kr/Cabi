package org.ftclub.cabinet.lent.domain;

import lombok.Data;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;

@Data
public class LentPolicyDto {
    private CabinetStatus cabinetStatus;
    private SetExpiredEnum setExpiredEnum;
    private LentPolicyStatus lentPolicyStatus;
    public LentPolicyDto(SetExpiredEnum setExpiredEnum, LentPolicyStatus lentPolicyStatus) {
        this.setExpiredEnum = setExpiredEnum;
        this.lentPolicyStatus = lentPolicyStatus;
    }
}
