package org.ftclub.cabinet.dto;


import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class InvalidDateResponseDto {

	private List<LocalDateTime> invalidDateList;

}
