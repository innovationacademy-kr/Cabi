package org.ftclub.cabinet.presentation.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class PresentationPagenationDto<T> {

	private List<T> content;

	private int currentPage;
	private int totalPage;
	private int totalElements;
	private boolean last;
}