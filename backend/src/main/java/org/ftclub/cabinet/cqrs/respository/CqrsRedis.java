package org.ftclub.cabinet.cqrs.respository;


import static org.ftclub.cabinet.cqrs.respository.CqrsSuffix.AVAILABLE_CABINET;
import static org.ftclub.cabinet.cqrs.respository.CqrsSuffix.BUILDINGS;
import static org.ftclub.cabinet.cqrs.respository.CqrsSuffix.FLOORS;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.ArrayList;
import java.util.List;
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

	private void setHash(String key, String hashKey, Object value) {
		if (value == null) {
			return;
		}
		try {
			String json = objectMapper.writeValueAsString(value);
			hashTemplate.put(key, hashKey, json);
		} catch (JsonProcessingException e) {
			throw ExceptionStatus.INTERNAL_SERVER_ERROR.asDomainException();
		}
	}

	private <T> T getValue(String key) {
		String value = valueTemplate.get(key);
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

	private void setValue(String key, Object value) {
		if (value == null) {
			return;
		}
		try {
			String json = objectMapper.writeValueAsString(value);
			valueTemplate.set(key, json);
		} catch (JsonProcessingException e) {
			log.error("JSON to String Parse Error : {}, {}", value, e.toString());
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
				ScanOptions.scanOptions().match("*:" + suffix).count(200).build();
		Cursor<byte[]> keys = connection.scan(options);
		while (keys.hasNext()) {
			byte[] key = keys.next();
			redisTemplate.delete(new String(key));
		}
	}


	public void clearBuildingFloors() {
		this.clear(BUILDINGS.getValue());
	}

	public List<BuildingFloorsDto> getBuildingFloors() {
		List<BuildingFloorsDto> buildingFloors = this.getValue(BUILDINGS.getValue());
		if (buildingFloors == null) {
			return new ArrayList<>();
		}
		return buildingFloors;
	}

	public void setBuildingFloors(List<BuildingFloorsDto> buildingFloorsDtos) {
		this.setValue(BUILDINGS.getValue(), buildingFloorsDtos);
	}

	public void clearFloors() {
		this.clearBySuffix(FLOORS);
	}

	public void setFloors(String building, List<Integer> floors) {
		this.setValue(building + FLOORS.getValue(), floors);
	}

	public List<Integer> getFloors(String building) {
		List<Integer> floors = this.getValue(building + FLOORS.getValue());
		if (floors == null) {
			return new ArrayList<>();
		}
		return floors;
	}

	public void clearAvailableCabinet() {
		this.clearBySuffix(AVAILABLE_CABINET);
	}

	public List<CabinetPreviewDto> getAvailableCabinet(String building, Integer floor) {
		String key = building + floor.toString() + AVAILABLE_CABINET.getValue();
		List<CabinetPreviewDto> availableCabinets = this.getValue(key);
		if (availableCabinets == null) {
			return new ArrayList<>();
		}
		return availableCabinets;
	}

	public void setAvailableCabinet(Integer floor, List<CabinetPreviewDto> pendingCabinets) {
		this.setValue(floor + AVAILABLE_CABINET.getValue(), pendingCabinets);
	}

	public void clearCabinetPerSection() {
		this.clearBySuffix(CqrsSuffix.CABINET_PER_SECTION);
	}
}
