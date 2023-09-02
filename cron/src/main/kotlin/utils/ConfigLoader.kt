package utils

import com.fasterxml.jackson.databind.ObjectMapper
import kotlin.reflect.KClass

object ConfigLoader {
    /**
     * Creates a configuration object from a JSON file.
     * The file must be located in the resources folder.
     * The file name must be the same as the configuration class name.
     * @param configClass The configuration class.
     * @return The configuration object.
     */
    fun<T: Configuration> create(configClass: KClass<T>): T {
        return create(configClass, "config/${configClass.simpleName}.json")
    }

    fun<T: Configuration> create(configClass: KClass<T>, filePath: String): T {
        val url = configClass::class.java.classLoader.getResource(filePath)
            ?: throw NoSuchElementException("No such file: $filePath")
        return ObjectMapper()
            .readerFor(configClass.java)
            .readValue(url, configClass.java)
            ?: throw IllegalArgumentException("Failed to read config file: $filePath")
    }
}