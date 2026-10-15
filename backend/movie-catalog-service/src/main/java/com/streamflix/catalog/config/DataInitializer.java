package com.streamflix.catalog.config;

import com.streamflix.catalog.model.Movie;
import com.streamflix.catalog.repository.MovieRepository;
import com.streamflix.catalog.util.TrailerValidator;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final MovieRepository movieRepository;

    public DataInitializer(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    @Override
    public void run(String... args) {
        if (movieRepository.count() > 0) {
            return;
        }

        List<Movie> sampleMovies = Arrays.asList(
                // --- Hollywood & Global Blockbusters ---
                new Movie(
                        "Dune: Part Two",
                        "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
                        "2024-03-01",
                        "Sci-Fi, Adventure, Action",
                        "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
                        "https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5200bm.jpg",
                        TrailerValidator.buildEmbedUrl("Way9Dexny3w"),
                        "Way9Dexny3w",
                        "Denis Villeneuve",
                        "Timothée Chalamet, Zendaya, Rebecca Ferguson, Austin Butler",
                        166,
                        "PG-13",
                        8.6,
                        true
                ),
                new Movie(
                        "Oppenheimer",
                        "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.",
                        "2023-07-21",
                        "Biography, Drama, History",
                        "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
                        "https://image.tmdb.org/t/p/original/rLb2cw69P79avJVapqlC37Wvnc2.jpg",
                        TrailerValidator.buildEmbedUrl("uYPbbksJxIg"),
                        "uYPbbksJxIg",
                        "Christopher Nolan",
                        "Cillian Murphy, Emily Blunt, Matt Damon, Robert Downey Jr.",
                        180,
                        "R",
                        8.9,
                        true
                ),
                new Movie(
                        "Inception",
                        "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into a mind.",
                        "2010-07-16",
                        "Sci-Fi, Action, Adventure",
                        "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
                        "https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
                        TrailerValidator.buildEmbedUrl("YoHD9XEInc0"),
                        "YoHD9XEInc0",
                        "Christopher Nolan",
                        "Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page, Tom Hardy",
                        148,
                        "PG-13",
                        8.8,
                        false
                ),
                new Movie(
                        "The Batman",
                        "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate hidden corruption.",
                        "2022-03-04",
                        "Action, Crime, Drama",
                        "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
                        "https://image.tmdb.org/t/p/original/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg",
                        TrailerValidator.buildEmbedUrl("mqqft2x_Aa4"),
                        "mqqft2x_Aa4",
                        "Matt Reeves",
                        "Robert Pattinson, Zoë Kravitz, Paul Dano, Colin Farrell",
                        176,
                        "PG-13",
                        7.8,
                        false
                ),
                new Movie(
                        "Interstellar",
                        "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival on a new planet.",
                        "2014-11-07",
                        "Sci-Fi, Adventure, Drama",
                        "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
                        "https://image.tmdb.org/t/p/original/rAiYTsqBkRefBXwe5nh8ivY0Y09.jpg",
                        TrailerValidator.buildEmbedUrl("zSWdZVtXT7E"),
                        "zSWdZVtXT7E",
                        "Christopher Nolan",
                        "Matthew McConaughey, Anne Hathaway, Jessica Chastain",
                        169,
                        "PG-13",
                        8.7,
                        true
                ),

                // --- Telugu Blockbusters with Verified Working Posters & Backdrops ---
                new Movie(
                        "RRR",
                        "A fearless revolutionary and an officer in the British force decide to join forces to wage an epic war against British colonial oppression.",
                        "2022-03-25",
                        "Action, Drama, Telugu",
                        "https://image.tmdb.org/t/p/w500/wE0I6efAW4cDDmZQWtwZMOW44EJ.jpg",
                        "https://img.youtube.com/vi/NgBoMJy386M/maxresdefault.jpg",
                        TrailerValidator.buildEmbedUrl("NgBoMJy386M"),
                        "NgBoMJy386M",
                        "S. S. Rajamouli",
                        "N. T. Rama Rao Jr., Ram Charan, Alia Bhatt, Ajay Devgn",
                        187,
                        "PG-13",
                        8.8,
                        true
                ),
                new Movie(
                        "Kalki 2898 AD",
                        "In the post-apocalyptic year 2898 AD, warrior Bhairava and legendary Ashwatthama protect the vessel of Kalki against supreme ruler Yaskin.",
                        "2024-06-27",
                        "Sci-Fi, Action, Mythological, Telugu",
                        "https://upload.wikimedia.org/wikipedia/en/4/4c/Kalki_2898_AD.jpg",
                        "https://img.youtube.com/vi/kQDd1AhGIHk/maxresdefault.jpg",
                        TrailerValidator.buildEmbedUrl("kQDd1AhGIHk"),
                        "kQDd1AhGIHk",
                        "Nag Ashwin",
                        "Prabhas, Amitabh Bachchan, Kamal Haasan, Deepika Padukone",
                        181,
                        "PG-13",
                        8.2,
                        true
                ),
                new Movie(
                        "Baahubali 2: The Conclusion",
                        "Shiva learns about his true heritage from Kattappa and starts his war against Bhallaladeva to reclaim the throne of Mahishmati.",
                        "2017-04-28",
                        "Action, Drama, Fantasy, Telugu",
                        "https://upload.wikimedia.org/wikipedia/en/9/93/Baahubali_2_The_Conclusion_poster.jpg",
                        "https://img.youtube.com/vi/G62HrubdD6o/maxresdefault.jpg",
                        TrailerValidator.buildEmbedUrl("G62HrubdD6o"),
                        "G62HrubdD6o",
                        "S. S. Rajamouli",
                        "Prabhas, Rana Daggubati, Anushka Shetty, Tamannaah Bhatia",
                        167,
                        "PG-13",
                        8.7,
                        false
                ),
                new Movie(
                        "Pushpa: The Rise",
                        "Pushpa Raj, a red sandalwood coolie, rises rapidly through the syndicate ranks, defying the local mafia and the merciless SP Bhanwar Singh Shekhawat.",
                        "2021-12-17",
                        "Action, Crime, Thriller, Telugu",
                        "https://upload.wikimedia.org/wikipedia/en/7/75/Pushpa_-_The_Rise_%282021_film%29.jpg",
                        "https://img.youtube.com/vi/pKctjlpbqpQ/maxresdefault.jpg",
                        TrailerValidator.buildEmbedUrl("pKctjlpbqpQ"),
                        "pKctjlpbqpQ",
                        "Sukumar",
                        "Allu Arjun, Rashmika Mandanna, Fahadh Faasil",
                        179,
                        "R",
                        8.5,
                        false
                ),
                new Movie(
                        "Salaar: Part 1 – Ceasefire",
                        "In the ruthless city-state of Khansaar, a prince turns to his formidable childhood friend to survive an impending violent coup.",
                        "2023-12-22",
                        "Action, Crime, Drama, Telugu",
                        "https://upload.wikimedia.org/wikipedia/en/a/a6/Salaar_Part_1_%E2%80%93_Ceasefire.jpg",
                        "https://img.youtube.com/vi/4GPvYMKtrtI/maxresdefault.jpg",
                        TrailerValidator.buildEmbedUrl("4GPvYMKtrtI"),
                        "4GPvYMKtrtI",
                        "Prashanth Neel",
                        "Prabhas, Prithviraj Sukumaran, Shruti Haasan",
                        175,
                        "R",
                        7.9,
                        false
                ),
                new Movie(
                        "Devara: Part 1",
                        "A courageous chieftain of a coastal clan wages a silent rebellion against illegal smuggling syndicates to protect his people.",
                        "2024-09-27",
                        "Action, Drama, Thriller, Telugu",
                        "https://upload.wikimedia.org/wikipedia/en/f/f0/Devara_Part_1.jpg",
                        "https://img.youtube.com/vi/eGg_P_jEw9w/maxresdefault.jpg",
                        TrailerValidator.buildEmbedUrl("eGg_P_jEw9w"),
                        "eGg_P_jEw9w",
                        "Koratala Siva",
                        "N. T. Rama Rao Jr., Janhvi Kapoor, Saif Ali Khan",
                        170,
                        "PG-13",
                        7.6,
                        false
                ),

                // --- Hindi / Bollywood Blockbusters with Verified Working Posters & Backdrops ---
                new Movie(
                        "Jawan",
                        "A man driven by a personal vendetta rectifies wrongs in society while keeping a promise to fight against injustice.",
                        "2023-09-07",
                        "Action, Thriller, Hindi",
                        "https://upload.wikimedia.org/wikipedia/en/3/39/Jawan_film_poster.jpg",
                        "https://img.youtube.com/vi/COv52Qyctws/maxresdefault.jpg",
                        TrailerValidator.buildEmbedUrl("COv52Qyctws"),
                        "COv52Qyctws",
                        "Atlee",
                        "Shah Rukh Khan, Nayanthara, Vijay Sethupathi, Deepika Padukone",
                        169,
                        "PG-13",
                        8.2,
                        true
                ),
                new Movie(
                        "Pathaan",
                        "An Indian RAW field agent embarks on a globe-trotting mission to hunt down a renegade terrorist group planning a bioweapon attack.",
                        "2023-01-25",
                        "Action, Thriller, Hindi",
                        "https://upload.wikimedia.org/wikipedia/en/c/c3/Pathaan_film_poster.jpg",
                        "https://img.youtube.com/vi/vqu4z34wENw/maxresdefault.jpg",
                        TrailerValidator.buildEmbedUrl("vqu4z34wENw"),
                        "vqu4z34wENw",
                        "Siddharth Anand",
                        "Shah Rukh Khan, Deepika Padukone, John Abraham",
                        146,
                        "PG-13",
                        7.9,
                        false
                ),
                new Movie(
                        "Stree 2",
                        "The town of Chanderi is haunted by a headless demon Sarkata, prompting the gang to reunite with the spirit Stree.",
                        "2024-08-15",
                        "Comedy, Horror, Hindi",
                        "https://upload.wikimedia.org/wikipedia/en/a/a1/Stree_2.jpg",
                        "https://img.youtube.com/vi/_70_q20vD5w/maxresdefault.jpg",
                        TrailerValidator.buildEmbedUrl("_70_q20vD5w"),
                        "_70_q20vD5w",
                        "Amar Kaushik",
                        "Rajkummar Rao, Shraddha Kapoor, Pankaj Tripathi",
                        147,
                        "PG-13",
                        7.8,
                        false
                ),
                new Movie(
                        "Animal",
                        "The turbulent relationship between an industrialist's son and his emotionally distant father spirals into explosive, obsessive violence after an assassination attempt.",
                        "2023-12-01",
                        "Action, Crime, Drama, Hindi",
                        "https://upload.wikimedia.org/wikipedia/en/9/90/Animal_%282023_film%29_poster.jpg",
                        "https://img.youtube.com/vi/Dydmpfo68DA/maxresdefault.jpg",
                        TrailerValidator.buildEmbedUrl("Dydmpfo68DA"),
                        "Dydmpfo68DA",
                        "Sandeep Reddy Vanga",
                        "Ranbir Kapoor, Rashmika Mandanna, Anil Kapoor, Bobby Deol",
                        201,
                        "R",
                        7.5,
                        false
                ),
                new Movie(
                        "3 Idiots",
                        "Two friends embark on a road trip to find their lost friend Rancho, reminiscing about the college years that changed their perspective on education and life.",
                        "2009-12-25",
                        "Comedy, Drama, Hindi",
                        "https://upload.wikimedia.org/wikipedia/en/d/df/3_idiots_poster.jpg",
                        "https://img.youtube.com/vi/K0eDlFX9GMc/maxresdefault.jpg",
                        TrailerValidator.buildEmbedUrl("K0eDlFX9GMc"),
                        "K0eDlFX9GMc",
                        "Rajkumar Hirani",
                        "Aamir Khan, R. Madhavan, Sharman Joshi, Kareena Kapoor",
                        170,
                        "PG-13",
                        8.9,
                        false
                ),
                new Movie(
                        "Dangal",
                        "Former wrestler Mahavir Singh Phogat trains his daughters Geeta and Babita to become international wrestling champions.",
                        "2016-12-23",
                        "Biography, Drama, Sport, Hindi",
                        "https://upload.wikimedia.org/wikipedia/en/9/99/Dangal_Poster.jpg",
                        "https://img.youtube.com/vi/x_7YlGv9u1g/maxresdefault.jpg",
                        TrailerValidator.buildEmbedUrl("x_7YlGv9u1g"),
                        "x_7YlGv9u1g",
                        "Nitesh Tiwari",
                        "Aamir Khan, Fatima Sana Shaikh, Sanya Malhotra",
                        161,
                        "PG",
                        8.7,
                        false
                ),
                new Movie(
                        "John Wick: Chapter 4",
                        "John Wick uncovers a path to defeating The High Table, facing off against a new enemy with powerful alliances across the globe.",
                        "2023-03-24",
                        "Action, Crime, Thriller",
                        "https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg",
                        "https://image.tmdb.org/t/p/original/h8gHn0OzBoaefW7AtBggExi0iip.jpg",
                        TrailerValidator.buildEmbedUrl("qEVUtrk8_B4"),
                        "qEVUtrk8_B4",
                        "Chad Stahelski",
                        "Keanu Reeves, Donnie Yen, Bill Skarsgård",
                        169,
                        "R",
                        7.7,
                        false
                )
        );

        movieRepository.saveAll(sampleMovies);
        System.out.println(">>> Seeded movie trailers into Movie Catalog with verified poster images.");
    }
}
