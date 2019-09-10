package org.piratesoft.recipe.server;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import spark.Service;
import static spark.Service.ignite;

/**
 *
 * @author kucin
 */
public class RecipeServer {

    final int PUBLIC_PORT = 6789;
    final int PRIVATE_PORT = 7890;
    
    private Thread waitForInput;

    public static void main(String[] args) {
        RecipeServer server = new RecipeServer();
        server.startServer(args);
    }

    public void startServer(String... args) {
        //ServerConfig config = readConfig();
        Service publicService = ignite().port(PUBLIC_PORT);
        Service privateService = ignite().port(PRIVATE_PORT);

        System.out.println(String.format("Starting server with ports {public: %s, private: %s}", PUBLIC_PORT, PRIVATE_PORT));
        RecipeEndpoint.setupEndpoints(publicService, privateService);
        doWaitForInput(publicService, privateService);
    }

    private void doStop() {
        this.waitForInput.interrupt();
    }

    private void stopServer(Service publicService,  Service privateService) {
        System.out.println("Stopping the server...");
        publicService.stop();
        privateService.stop();
    }

    public void doWaitForInput(Service publicService,  Service privateService) {
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
            this.stopServer(publicService, privateService);
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
