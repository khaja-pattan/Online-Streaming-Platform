FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml ./
COPY user-service/pom.xml ./user-service/
RUN mvn -f user-service/pom.xml dependency:go-offline || true
COPY user-service/src ./user-service/src
RUN mvn -f user-service/pom.xml clean package -DskipTests

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=builder /app/user-service/target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
