package org.piratesoft.recipe.server;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import static spark.Spark.*;

/**
 *
 * @author kucin
 */
public class RecipeServer {

    private Thread waitForInput;

    public static void main(String[] args) {
        RecipeServer server = new RecipeServer();
        server.startServer(args);
    }

    public void startServer(String... args) {
        //ServerConfig config = readConfig();
        final int PORT = 6789;
        System.out.println("Starting server on port " + PORT);
        port(6789);
        RecipeEndpoint.setupEndpoints();
        doWaitForInput();
    }

    private void doStop() {
        this.waitForInput.interrupt();
    }

    private void stopServer() {
        System.out.println("Stopping the server...");
        stop();
    }

    public void doWaitForInput() {
        this.waitForInput = new Thread(() -> {
            BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
            String input;
            do {
                try {
                    // wait until we have data to complete a readLine()
                    while (!br.ready() /*  ADD SHUTDOWN CHECK HERE */) {
                        Thread.sleep(200);
                    }
                    input = br.readLine();
                } catch (IOException | InterruptedException e) {
                    break;
                }
            } while (!isStopCommand(input) && !Thread.interrupted());
            this.stopServer();
        });
        this.waitForInput.start();
    }

    public boolean isStopCommand(String s) {
        s = s.trim().toLowerCase();
        return s.equals("stop") || s.endsWith("quit") || s.equals("exit");
    }

//    public ServerConfig readConfig() {
//        try {
//            FileReader reader = new FileReader("./lights.conf");
//            JsonReader jsonReader = Json.createReader(reader);
//            JsonObject jsonConfig = jsonReader.readObject();
//            return new ServerConfig(jsonConfig);
//        } catch (FileNotFoundException e) {
//            System.out.println("Config file not found. " + e.getMessage());
//            return new ServerConfig();
//        }
//    }
}
