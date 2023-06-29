package org.ftclub.testutils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

public class TestMockApplier {

	public static class ApplyBuilder {

		private MockHttpServletRequestBuilder builder;
		private ObjectMapper mapper = new ObjectMapper();

		public ApplyBuilder(MockHttpServletRequestBuilder builder) {
			this.builder = builder;
		}

		public ApplyBuilder setMapper(ObjectMapper mapper) {
			this.mapper = mapper;
			return this;
		}

		public ApplyBuilder setJsonContent(Object dto)
				throws JsonProcessingException {
			builder
					.content(mapper.writeValueAsBytes(dto))
					.contentType(MediaType.APPLICATION_JSON);
			return this;
		}

		public MockHttpServletRequestBuilder end() {
			return builder;
		}
	}

	public static ApplyBuilder apply(MockHttpServletRequestBuilder builder) {
		return new ApplyBuilder(builder);
	}

	public static ApplyBuilder apply(MockHttpServletRequestBuilder builder, ObjectMapper mapper) {
		return new ApplyBuilder(builder).setMapper(mapper);
	}
}
