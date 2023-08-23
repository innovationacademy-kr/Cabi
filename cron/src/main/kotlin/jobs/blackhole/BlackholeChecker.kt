package jobs.blackhole

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonSetter
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.squareup.okhttp.OkHttpClient
import com.squareup.okhttp.Request
import jobs.Configuration
import jobs.FtTokenFetcher
import utils.ConfigLoader
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

interface BlackholeChecker {
    companion object {
        @JvmStatic fun create(): BlackholeChecker {
            val config = ConfigLoader.create(BlackholeCheckerConfig::class)
            return BlackholeCheckerImpl(config)
        }
    }

    fun getBlackholeIds(): List<String>
}

class BlackholeCheckerImpl(val config: BlackholeCheckerConfig): BlackholeChecker {
    private val ftTokenFetcher: FtTokenFetcher = FtTokenFetcher.create()
    private val client = OkHttpClient()
    private val mapper = ObjectMapper()

    override fun getBlackholeIds(): List<String> {
        val now = LocalDateTime.now();
        val token = ftTokenFetcher.fetchToken()
        val request = generateRequest(token,
            now.minusDays(config.startMargin), now.minusDays(config.endMargin))
        val response = client.newCall(request).execute()
        if (response.code() != 200) {
            throw Exception("server is not connected: ${response.code()})")
        }
        return refine(response.body().string())
    }

    private fun generateRequest(token: String, startDate: LocalDateTime, endDate: LocalDateTime): Request {
        val start = startDate.format(DateTimeFormatter.ISO_DATE_TIME)
        val end = endDate.format(DateTimeFormatter.ISO_DATE_TIME)
        return Request.Builder()
            .url(config.formatUrl.format(start, end))
            .addHeader("Authorization", "Bearer $token")
            .get()
            .build()
    }

    private fun refine(response: String): List<String> {
        val values = mapper.readValue(response, Array<JsonNode>::class.java)
        return values.map { it["user"]["login"].asText() }
    }
}

data class BlackholeCheckerConfig
@JsonCreator(mode = JsonCreator.Mode.PROPERTIES)
constructor(
    @JsonSetter("formatUrl")
    val formatUrl: String,
    @JsonSetter("startMargin")
    val startMargin: Long,
    @JsonSetter("endMargin")
    val endMargin: Long
): Configuration