package org.ftclub.cabinet.rabbitmq;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class RabbitMessage {

	//cabinetID or Entity
	//UserID or Entity
	private String id;
	private String fName;
	private String lName;
}
