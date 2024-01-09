package org.ftclub.cabinet.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import javax.validation.constraints.NotNull;

@AllArgsConstructor
@Getter
public class AdminCabinetStatusNoteUpdateRequestDto {
	@NotNull
	private String statusNote;
}
