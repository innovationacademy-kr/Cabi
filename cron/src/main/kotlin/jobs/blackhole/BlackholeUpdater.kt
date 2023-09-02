package jobs.blackhole

import com.fasterxml.jackson.annotation.JsonSetter
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.squareup.okhttp.OkHttpClient
import com.squareup.okhttp.Request
import com.squareup.okhttp.Response
import http.addToken
import http.ftGetCurrentPage
import http.ftGetTotalPages
import http.isUnauthorized
import utils.Configuration
import jobs.FtTokenFetcher
import utils.Sprinter
import jobs.blackhole.CursusUsersDeserializer.toUsers
import mu.KotlinLogging
import utils.ConfigLoader
import java.io.BufferedWriter
import java.io.File
import java.io.FileWriter
import java.util.stream.Stream

private val log = KotlinLogging.logger {}

private val DEFAULT_INDEX = 1
private val SLEEP_TIME = 60 * 5 * 1000L
interface BlackholeUpdater: Sprinter<Unit> {
companion object {
        @JvmStatic fun create(): BlackholeUpdater {
            val config = ConfigLoader.create(BlackholeUpdaterConfig::class)
            return BlackholeUpdaterImpl(config)
        }
    }
}

private data class ResponseUsers(
    val totalPages: Int,
    val currentPage: Int,
    val users: List<JsonNode>
) {
    fun isLastPage() = totalPages + 1 == currentPage
}

class BlackholeUpdaterImpl(private val config: BlackholeUpdaterConfig): BlackholeUpdater {
    private val client = OkHttpClient()
    private val mapper = ObjectMapper()
    private val ftTokenFetcher: FtTokenFetcher = FtTokenFetcher.create()
    private val dbManager: BlackholeDbManager = BlackholeDbManager()

    override fun sprint() {
        log.info { "Blackhole update start" }
        ftTokenFetcher.sprint()
        Stream.iterate(DEFAULT_INDEX) { it + 1 }
            .map { requestUsers(it) } // request
            .takeWhile { !it.isLastPage() } // check last page
            .map { it.users } // get users
            .map { toUsers(it) } // get profile
            .map(::filterUpdateUsers) // update
            .forEach(::updateUsers)
    }

    private fun filterUpdateUsers(users: List<UserProfile>): List<UserProfile> {
        val filtered = dbManager.filterRequiredUpdate(users)
        log.info { "filterUpdateUsers filtered: ${filtered.size}, total: ${users.size}" }
        return filtered
    }

    private fun updateUsers(users: List<UserProfile>) {
        if (users.isEmpty()) return
        log.info { "updateUsers size: ${users.size}" }
        dbManager.updateBlackholedUsers(users)
    }

    private fun requestUsers(page: Int): ResponseUsers {
        log.info{ "request users page: $page" }
        val request = Request.Builder()
            .url(formatUrl(page))
            .addToken(ftTokenFetcher.sprint())
            .get().build()
        return executeRequest(request)
    }

    private fun executeRequest(request: Request, count: Int = 0): ResponseUsers {
        log.info { "execute request url: ${request.url()} fail count: $count" }
        if (count == 3) throw Exception("server is not connected: ${request.url()}")
        val response = client.newCall(request).execute()
        if (response.isSuccessful.not()) {
            log.info { "execute request fail code: ${response.code()}, msg: ${response.body()}" }
            if (response.isUnauthorized()) ftTokenFetcher.refresh()
            Thread.sleep(SLEEP_TIME)
            return executeRequest(request, count + 1)
        }
        return parseResponseUsers(response)
    }

    private fun parseResponseUsers(response: Response): ResponseUsers {
        val values = mapper.readValue(response.body().string(), Array<JsonNode>::class.java)
        val rst = ResponseUsers(
            totalPages = response.ftGetTotalPages(),
            currentPage = response.ftGetCurrentPage(),
            users = values.toList()
        )
        log.info { "parse response currentPage: ${rst.currentPage}, totalPage: ${rst.totalPages}" }
        return rst
    }

    private fun formatUrl(page: Int): String {
        return config.formatUrl.format(page)
    }
}

data class BlackholeUpdaterConfig(
    @JsonSetter("formatUrl")
    val formatUrl: String,
): Configuration