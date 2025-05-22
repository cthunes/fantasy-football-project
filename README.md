# fantasy-football-project
Project space for a web app enabling the user to play around with NFL football statistics to predict the top fantasy players of the next year.

## Getting started
To get the project up and running locally:

1. **Clone the repository**
    ```bash
    git clone https://github.com/your-username/fantasy-football-project.git
    cd fantasy-football-project
    ```

2. **Ensure Docker Desktop is running**  
    (Install Docker Desktop if you don't have it. On Linux, use Docker Engine.)

3. **Start the application**
    ```bash
    npm start
    ```
    This will run `docker-compose up --build` under the hood.  
    During this step, MongoDB will automatically be loaded from a database dump—no manual setup required.

4. **Access the app**  
    Open your browser and go to [http://localhost:3000](http://localhost:3000) (or the port specified in your configuration).

5. **Stop and remove containers**  
    When you're done, stop the application and remove containers with:
    ```bash
    docker-compose down
    ```
