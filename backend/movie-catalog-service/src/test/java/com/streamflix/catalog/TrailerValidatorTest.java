package com.streamflix.catalog;

import com.streamflix.catalog.util.TrailerValidator;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class TrailerValidatorTest {

    @Test
    void extractAndValidateVideoId_StandardWatchUrl() {
        String url = "https://www.youtube.com/watch?v=Way9Dexny3w";
        String videoId = TrailerValidator.extractAndValidateVideoId(url);
        assertEquals("Way9Dexny3w", videoId);
    }

    @Test
    void extractAndValidateVideoId_ShortUrl() {
        String url = "https://youtu.be/Way9Dexny3w";
        String videoId = TrailerValidator.extractAndValidateVideoId(url);
        assertEquals("Way9Dexny3w", videoId);
    }

    @Test
    void extractAndValidateVideoId_EmbedUrl() {
        String url = "https://www.youtube.com/embed/Way9Dexny3w";
        String videoId = TrailerValidator.extractAndValidateVideoId(url);
        assertEquals("Way9Dexny3w", videoId);
    }

    @Test
    void extractAndValidateVideoId_RawId() {
        String rawId = "Way9Dexny3w";
        String videoId = TrailerValidator.extractAndValidateVideoId(rawId);
        assertEquals("Way9Dexny3w", videoId);
    }

    @Test
    void extractAndValidateVideoId_IllegalSource_ThrowsException() {
        // Direct mp4, pirated link or illegal streaming site
        String illegal = "https://megavideo-pirate.xyz/watch?v=12345";
        assertThrows(IllegalArgumentException.class, () -> TrailerValidator.extractAndValidateVideoId(illegal));
    }

    @Test
    void buildEmbedUrl_Valid() {
        String embed = TrailerValidator.buildEmbedUrl("Way9Dexny3w");
        assertEquals("https://www.youtube-nocookie.com/embed/Way9Dexny3w", embed);
    }
}
