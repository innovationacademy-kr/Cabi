package jobs

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonSetter
import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.squareup.okhttp.MultipartBuilder
import com.squareup.okhttp.OkHttpClient
import com.squareup.okhttp.Request
import com.squareup.okhttp.RequestBody
import mu.KotlinLogging
import utils.ConfigLoader
import utils.Configuration
import utils.Sprinter

private val log = KotlinLogging.logger {}
interface FtTokenFetcher: Sprinter<String> {
    companion object {
        @JvmStatic fun create(): FtTokenFetcher {
            val config = ConfigLoader.create(FtTokenConfig::class)
            return FtTokenFetcherImpl(config);
        }
    }

    fun refresh(): String
}

private val clientSecret = "client_secret"
private val clientId = "client_id"
private val grantType = "grant_type"
private val scope = "scope"
private val accessTokenKey = "access_token"

class FtTokenFetcherImpl(val FtTokenConfig: FtTokenConfig): FtTokenFetcher {
    private val client = OkHttpClient()
    private var token: String? = null

    override fun sprint(): String {
        log.info { "token fetcher start" }
        token = token ?: fetchToken()
        return token!!
    }

    override fun refresh(): String {
        log.info { "refreshing token start" }
        token = fetchToken()
        return token!!
    }

    private fun fetchToken(): String {
        log.info("fetching token start")
        val request = generateRequest(generateBody())
        val response = client.newCall(request).execute()
        if (response.code() != 200) {
            log.info { "fetching token fail code: ${response.code()}" }
            throw Exception("server is not connected: ${response.code()})")
        }
        val valueMap: Map<String, String> = ObjectMapper()
            .readValue(response.body().string(), object: TypeReference<Map<String, String>>(){})
        log.info { "fetching token success" }
        return valueMap[accessTokenKey] ?: throw Exception("access token is not found")
    }

    private fun generateBody(): RequestBody {
        return  MultipartBuilder().type(MultipartBuilder.FORM)
            .addFormDataPart(clientSecret, FtTokenConfig.clientSecret)
            .addFormDataPart(clientId, FtTokenConfig.clientId)
            .addFormDataPart(grantType, FtTokenConfig.grantType)
            .addFormDataPart(scope, FtTokenConfig.scope)
            .build()
    }

    private fun generateRequest(body: RequestBody): Request {
        return Request.Builder()
            .url(FtTokenConfig.url)
            .post(body)
            .build()
    }
}

data class FtTokenConfig
@JsonCreator(mode = JsonCreator.Mode.PROPERTIES)
constructor(
    @JsonSetter("url")
    val url: String,
    @JsonSetter("clientSecret")
    val clientSecret: String,
    @JsonSetter("clientId")
    val clientId: String,
    @JsonSetter("grantType")
    val grantType: String,
    @JsonSetter("scope")
    val scope: String): Configuration
