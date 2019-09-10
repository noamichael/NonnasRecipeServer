FROM maven:3.6-jdk-8-slim as builder

WORKDIR /tmp/build
COPY  . .
RUN mvn package

FROM openjdk:8-jre-alpine as release

WORKDIR /opt/app
COPY --from=builder /tmp/build/target/NonnasRecipeServer-1.0-SNAPSHOT-jar-with-dependencies.jar ./NonnasRecipeServer.jar
EXPOSE 6789 7890
ENTRYPOINT ["java", "-jar", "NonnasRecipeServer.jar" ]