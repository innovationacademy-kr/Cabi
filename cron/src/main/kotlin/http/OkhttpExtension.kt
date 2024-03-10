package http

import com.squareup.okhttp.Request
import com.squareup.okhttp.Response

// request
private val AUTHORIZATION = "Authorization"
private val BEARER_PREFIX = "Bearer "

// response
private val TOTAL_INDEX = "X-Total"
private val PAGE_INDEX = "X-Page"
private val PAGE_SIZE_INDEX = "X-Per-Page"

/**
 * OkhttpExtension
 * - token을 Authorization header에 추가한다.
 */
fun Request.Builder.addToken(token: String): Request.Builder =
    this.header(AUTHORIZATION, BEARER_PREFIX + token)

/**
 * OkhttpExtension
 * - response header에서 total page를 가져온다. (X-Total header를 이용)
 */
fun Response.ftGetTotalPages(): Int {
    val total = this.header(TOTAL_INDEX)?.toInt() ?: throw Exception("total page is not found")
    val perPage = this.header(PAGE_SIZE_INDEX)?.toInt() ?: throw Exception("per page is not found")
    return total / perPage + 1
}

/**
 * OkhttpExtension
 * - response header에서 current page를 가져온다. (X-Page header를 이용)
 */
fun Response.ftGetCurrentPage(): Int {
    return this.header(PAGE_INDEX)?.toInt() ?: throw Exception("current page is not found")
}

/**
 * OkhttpExtension
 * - response가 401(Unauthorized)인지 확인한다.
 */
fun Response.isUnauthorized(): Boolean {
    return this.code() == 401
}
