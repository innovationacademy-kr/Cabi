import jobs.FtTokenFetcher
import kotlin.system.exitProcess

fun main(args: Array<String>) {
    try {
        FtTokenFetcher.create().fetchToken()
            .let{
                println(it)
            }
    } catch (e: Exception) {
        println(e.message)
        exitProcess(1)
    }
}