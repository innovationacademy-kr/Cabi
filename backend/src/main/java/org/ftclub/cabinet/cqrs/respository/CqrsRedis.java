package org.ftclub.cabinet.cqrs.respository;


import static org.ftclub.cabinet.cqrs.respository.CqrsSuffix.AVAILABLE_CABINET;
import static org.ftclub.cabinet.cqrs.respository.CqrsSuffix.BUILDINGS;
import static org.ftclub.cabinet.cqrs.respository.CqrsSuffix.FLOORS;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.ftclub.cabinet.dto.BuildingFloorsDto;
import org.ftclub.cabinet.dto.CabinetPreviewDto;
import org.ftclub.cabinet.exception.ExceptionStatus;
import org.ftclub.cabinet.log.LogLevel;
import org.ftclub.cabinet.log.Logging;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.Cursor;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@Logging(level = LogLevel.DEBUG)
public class CqrsRedis {

	private final RedisTemplate<String, String> redisTemplate; // expire 같은 조금 더 많은 기능을 지원
	private final HashOperations<String, String, String> hashTemplate; // hash 사용 가능
	private final ValueOperations<String, String> valueTemplate;
	private final RedisConnection connection;

	private final ObjectMapper objectMapper;

	@Autowired
	public CqrsRedis(RedisTemplate<String, String> redisTemplate,
			RedisTemplate<String, String> hashTemplate,
			RedisTemplate<String, String> valueTemplate,
			ObjectMapper objectMapper) {
		this.redisTemplate = redisTemplate;
		this.hashTemplate = hashTemplate.opsForHash();
		this.valueTemplate = valueTemplate.opsForValue();
		RedisConnectionFactory connectionFactory = redisTemplate.getConnectionFactory();
		if (connectionFactory == null) {
			throw ExceptionStatus.INTERNAL_SERVER_ERROR.asDomainException();
		}
		this.connection = connectionFactory.getConnection();
		this.objectMapper = objectMapper;
	}

	private <T> String dtoToString(T dto) {
		if (dto == null) {
			return null;
		}
		try {
			return objectMapper.writeValueAsString(dto);
		} catch (JsonProcessingException e) {
			log.error("DTO to JSON Parse Error : {}, {}", dto, e.toString());
			throw ExceptionStatus.INTERNAL_SERVER_ERROR.asDomainException();
		}
	}

	private <T> T stringToDto(String value) {
		if (value == null) {
			return null;
		}
		try {
			//@formatter:off
			return objectMapper.readValue(value, new TypeReference<>() {});
			//@formatter:on
		} catch (JsonProcessingException e) {
			log.error("String to JSON Parse Error : {}, {}", value, e.toString());
			throw ExceptionStatus.INTERNAL_SERVER_ERROR.asDomainException();
		}
	}

	public void clear(String key) {
		redisTemplate.delete(key);
	}

	public void clearHash(String key, String subKey) {
		hashTemplate.delete(key, subKey);
	}

	private void clearBySuffix(CqrsSuffix suffix) {
		ScanOptions options =
				ScanOptions.scanOptions().match("*" + suffix.getValue()).count(200).build();
		Cursor<byte[]> keys = connection.scan(options);
		while (keys.hasNext()) {
			String key = new String(keys.next());
			redisTemplate.delete(key);
		}
	}


	public void clearBuildingFloors() {
		this.clear(BUILDINGS.getValue());
	}

	public List<BuildingFloorsDto> getBuildingFloors() {
		String value = valueTemplate.get(BUILDINGS.getValue());
		List<BuildingFloorsDto> buildingFloors = this.stringToDto(value);
		if (buildingFloors == null) {
			return new ArrayList<>();
		}
		return buildingFloors;
	}

	public void setBuildingFloors(List<BuildingFloorsDto> buildingFloorsDtos) {
		String value = this.dtoToString(buildingFloorsDtos);
		valueTemplate.set(BUILDINGS.getValue(), value);
	}

	public void clearFloors() {
		this.clearBySuffix(FLOORS);
	}

	public void setFloors(String building, List<Integer> floors) {
		String value = this.dtoToString(floors);
		valueTemplate.set(building + FLOORS.getValue(), value);
	}

	public List<Integer> getFloors(String building) {
		String value = valueTemplate.get(building + FLOORS.getValue());
		List<Integer> floors = this.stringToDto(value);
		if (floors == null) {
			return new ArrayList<>();
		}
		return floors;
	}

	public void clearAvailableCabinet() {
		this.clearBySuffix(AVAILABLE_CABINET);
	}

	public Map<Integer, List<CabinetPreviewDto>> getAvailableCabinet(String building) {
		Map<Integer, List<CabinetPreviewDto>> availableCabinets = new HashMap<>();
		hashTemplate.entries(building + AVAILABLE_CABINET.getValue())
				.forEach((key, value) -> {
					Integer floor = Integer.parseInt(key);
					List<CabinetPreviewDto> cabinets = this.stringToDto(value);
					availableCabinets.put(floor, cabinets);
				});
		return availableCabinets;
	}

	public List<CabinetPreviewDto> getAvailableCabinet(String building, Integer floor) {
		String value =
				hashTemplate.get(building + AVAILABLE_CABINET.getValue(), floor.toString());
		List<CabinetPreviewDto> availableCabinets = this.stringToDto(value);
		if (availableCabinets == null) {
			return new ArrayList<>();
		}
		return availableCabinets;
	}

	public void setAvailableCabinet(String building, Integer floor,
			List<CabinetPreviewDto> availableCabinets) {
		String value = this.dtoToString(availableCabinets);
		hashTemplate.put(building + AVAILABLE_CABINET.getValue(), floor.toString(), value);
	}

	public void clearCabinetPerSection() {
		this.clearBySuffix(CqrsSuffix.CABINET_PER_SECTION);
	}
}
