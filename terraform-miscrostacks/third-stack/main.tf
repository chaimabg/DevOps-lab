data "terraform_remote_state" "aks" {
  backend = "azurerm"

  config = {
    resource_group_name  = "Devops"
    storage_account_name = "devopslab1"
    container_name       = "gl5-project"
    key                  = "second-stack.json"
  }
}



resource "kubernetes_namespace" "devops" {
  metadata {
    labels = {
      environment = var.environment
    }

    generate_name = "project"
  }
}

resource "kubernetes_secret" "grafana" {
  metadata {
    name      = "grafana-admin-credentials"
    namespace = kubernetes_namespace.devops.id
  }
  data = {
    admin-user     = "admin"
    admin-password = "admin"
  }

}
resource "helm_release" "prometheus" {
  name       = "prometheus"
  repository = "https://prometheus-community.github.io/helm-charts"
  chart      = "kube-prometheus-stack"
  namespace  = kubernetes_namespace.devops.id

}
