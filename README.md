# DevOps-Lab
We created two services : an authentication service and a GitHub service, allows the user to get a GitHub user repositories and consult his profile,developed using nodejs, mongoDB and the [official GitHub API](https://docs.github.com/en/rest).

## Observability:
- **Metrics:**
    
    Used prom-client, a prometheus client for Node.js that supports histogram, summaries, gauges and counters.
    - The application/service metrics : we created a counter to track the number of http requests with two labels: the request route and the response status code.
    The prom-client capture automatically different metrics from the code, such as: Memory usage, CPU usage..
    - The business logic metrics : we created a counter to track the number of the most consulted github users by username
- **Logs:**
    Used Winston, a Node.js logging library, Each log have the attribute request_id that uniquely identifies the request, client_ip which is the ip address of the caller. We routed our logs to DataDog.
- **Traces:**
## Automation
-Automated infrastructure provisioning

    we used Terraform to create well isolated and maintainable infrastructure layers (Microstacks)
    - First Stack:
    - Second Stack:
    - Third Stack :
## Deployment