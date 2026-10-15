FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml ./
COPY watchlist-service/pom.xml ./watchlist-service/
RUN mvn -f watchlist-service/pom.xml dependency:go-offline || true
COPY watchlist-service/src ./watchlist-service/src
RUN mvn -f watchlist-service/pom.xml clean package -DskipTests

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=builder /app/watchlist-service/target/*.jar app.jar
EXPOSE 8083
ENTRYPOINT ["java", "-jar", "app.jar"]
