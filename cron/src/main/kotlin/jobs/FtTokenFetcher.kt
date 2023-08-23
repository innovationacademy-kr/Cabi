package jobs

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonSetter
import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.squareup.okhttp.MultipartBuilder
import com.squareup.okhttp.OkHttpClient
import com.squareup.okhttp.Request
import com.squareup.okhttp.RequestBody
import utils.ConfigLoader

interface FtTokenFetcher {
    companion object {
        @JvmStatic fun create(): FtTokenFetcher {
            val config = ConfigLoader.create(FtTokenConfig::class)
            return FtTokenFetcherImpl(config);
        }
    }
    fun fetchToken(): String
}

class FtTokenFetcherImpl(val FtTokenConfig: FtTokenConfig): FtTokenFetcher {
    companion object {
        private val clientSecret = "client_secret"
        private val clientId = "client_id"
        private val grantType = "grant_type"
        private val scope = "scope"
        private val accessTokenKey = "access_token"
    }
    private val client = OkHttpClient()

    override fun fetchToken(): String {
        val request = generateRequest(generateBody())
        val response = client.newCall(request).execute()
        if (response.code() != 200) {
            throw Exception("server is not connected: ${response.code()})")
        }
        val valueMap: Map<String, String> = ObjectMapper()
            .readValue(response.body().string(), object: TypeReference<Map<String, String>>(){})
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
            .post(generateBody())
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
