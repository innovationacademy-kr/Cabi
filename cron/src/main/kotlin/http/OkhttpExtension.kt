package http

import com.squareup.okhttp.Request
import com.squareup.okhttp.Response

private val AUTHORIZATION = "Authorization"
private val BEARER_PREFIX = "Bearer "
private val TOTAL_INDEX = "X-Total"
private val PAGE_INDEX = "X-Page"
private val PAGE_SIZE_INDEX = "X-Per-Page"

fun Request.Builder.addToken(token: String): Request.Builder =
    this.header(AUTHORIZATION, BEARER_PREFIX + token)

fun Response.ftGetTotalPages(): Int {
    val total = this.header(TOTAL_INDEX)?.toInt() ?: throw Exception("total page is not found")
    val perPage = this.header(PAGE_SIZE_INDEX)?.toInt() ?: throw Exception("per page is not found")
    return total / perPage + 1
}

fun Response.ftGetCurrentPage(): Int {
    return this.header(PAGE_INDEX)?.toInt() ?: throw Exception("current page is not found")
}

fun Response.isUnauthorized(): Boolean {
    return this.code() == 401
}
