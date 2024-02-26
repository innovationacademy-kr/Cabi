package org.ftclub.cabinet.dto;


import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
public class InvalidDateResponseDto {

	private List<LocalDateTime> invalidDateList;

}
