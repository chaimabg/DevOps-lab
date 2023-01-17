# DevOps-Lab
We created two services : an authentication service and a GitHub service, allows the user to get a GitHub user repositories and consult his profile,developed using nodejs, mongoDB and the [official GitHub API](https://docs.github.com/en/rest).
![image](https://user-images.githubusercontent.com/62261901/212963380-b923bce2-fd95-46dc-b17a-c42d266d0b90.png)


## Observability:
- **Metrics:**
    
    Used prom-client, a prometheus client for Node.js that supports histogram, summaries, gauges and counters.
    - The application/service metrics : we created a counter to track the number of http requests with two labels: the request route and the response status code.
    The prom-client capture automatically different metrics from the code, such as: Memory usage, CPU usage..
    - The business logic metrics : we created a counter to track the number of the most consulted github users by username

### Visualize Metrics : Grafana Dashboard 
![323658141_8574487052593555_7000689383338550838_n](https://user-images.githubusercontent.com/62261901/212960440-9d1d02f2-8faf-4b40-abcd-705a8e96857e.png)


- **Logs:**
    Used Winston, a Node.js logging library, Each log has the attribute request_id that uniquely identifies the request, client_ip which is the ip address of the caller. We routed our logs to DataDog.
    
   ![image](https://user-images.githubusercontent.com/62261901/212961612-a48d885d-e541-404e-a6cd-5d934aa5f3bb.png)
![image](https://user-images.githubusercontent.com/62261901/212961683-5439c783-3504-4487-ba86-bf2f954d7ce5.png)

    
    
- **Traces:**  we used opentelemetry a tracing library , each trace has the same attributes as the logs and it is routed to DataDog 




## Automation
**Automated infrastructure provisioning:**  we used Terraform to create well isolated and maintainable infrastructure layers (Microstacks)
- First Stack: Networking :  we created a Virtual Network and a Subnet where our webapp will run .
- Second Stack: Kubernetes Cluster : we provisioned an AKS cluster whithin the subnet created earlier .
- Third Stack : Monitoring  : we created the monitoring setup for our webapp using Kubernetes provider as well as Helm provider. This Stack is responsible for creating  a Kubernetes namespace for our monitoring setup then using Helm, it will install the monitoring tools .
# Deployment
### Automated Deployment 
to automate the deployment ,we ensured that by creating a Helm Chart for it which will be used by Argo CD for deployment. Each time there's  a change in the chart in the repository, it will automatically synchronize the app .
### Deployment Strategy
We used the Canary deployment strategy since it is a blue/green type and we can test the new environment before scaling all the traffic to it . It ensures no downtime .
The quantity of ressources is not a problem as we are doing everything on the cloud .

We also used a service mesh to expose the deployment as it uses intelligent routing to control API calls and the flow of traffic .

### Traffic Visualization : 
![image](https://user-images.githubusercontent.com/62261901/212961896-6c05ffbf-2fba-4e79-bee5-94938f4566a0.png)


### Architecture :

![image](https://user-images.githubusercontent.com/62261901/212973116-b3fe44a4-d168-4f74-913d-9f181f3535bf.png)



