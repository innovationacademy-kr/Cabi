package org.ftclub.cabinet.dto;

import java.util.List;
import javax.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class ReturnCabinetsRequestDto {

    @NotNull
    private List<Long> cabinetIds;
}
