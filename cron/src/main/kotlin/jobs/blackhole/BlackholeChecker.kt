package jobs.blackhole

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonSetter
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.squareup.okhttp.OkHttpClient
import com.squareup.okhttp.Request
import com.squareup.okhttp.Response
import jobs.Configuration
import jobs.FtTokenFetcher
import jobs.Sprinter
import utils.ConfigLoader
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

interface BlackholeChecker: Sprinter<List<String>> {
    companion object {
        @JvmStatic fun create(): BlackholeChecker {
            val config = ConfigLoader.create(BlackholeCheckerConfig::class)
            return BlackholeCheckerImpl(config)
        }
    }
}

class BlackholeCheckerImpl(val config: BlackholeCheckerConfig): BlackholeChecker {
    companion object {
        const val AUTHORIZATION = "Authorization"
        const val BEARER_PREFIX = "Bearer "
        const val DEFAULT_PAGE = 1
    }
    private val ftTokenFetcher: FtTokenFetcher = FtTokenFetcher.create()
    private val client = OkHttpClient()
    private val mapper = ObjectMapper()

    override fun sprint(): List<String> {
        val now = LocalDateTime.now();
        val token = ftTokenFetcher.sprint()
        val formatUrl = formatUrl(now.minusDays(config.startMargin), now.minusDays(config.endMargin))
        return executeRequest(formatUrl, token)
    }

    private fun formatUrl(startDate: LocalDateTime, endDate: LocalDateTime): String {
        val start = startDate.format(DateTimeFormatter.ISO_DATE_TIME)
        val end = endDate.format(DateTimeFormatter.ISO_DATE_TIME)
        return config.formatUrl.format(start, end)
    }

    private fun executeRequest(url: String, token: String, page: Int = DEFAULT_PAGE): List<String> {
        val requestUrl = if(page == DEFAULT_PAGE) url else "${url}&&${config.formatPage.format(page)}"
        val request = Request.Builder()
            .url(requestUrl).header(AUTHORIZATION, BEARER_PREFIX + token)
            .get().build()
        val response = client.newCall(request).execute()
        if (response.code() != 200) {
            throw Exception("server is not connected: ${response.code()})")
        }
        if (isLastPage(response)) {
            return refine(response.body().string())
        }
        return refine(response.body().string()) + executeRequest(url, token, page + 1)
    }

    private fun isLastPage(response: Response): Boolean {
        val totalPage = response.header(config.totalIndex).toLong()
        val currentPage = response.header(config.pageIndex).toLong()
        return totalPage <= currentPage * config.size
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
    val endMargin: Long,
    @JsonSetter("size")
    val size: Long,
    @JsonSetter("formatPage")
    val formatPage: String,
    @JsonSetter("totalIndex")
    val totalIndex: String,
    @JsonSetter("pageIndex")
    val pageIndex: String

): Configuration