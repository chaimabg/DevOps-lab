data "terraform_remote_state" "aks" {
  backend = "azurerm"

  config = {
    resource_group_name  = "Devops"
    storage_account_name = "devopslab1"
    container_name       = "gl5-project"
    key                  = "second-stack.json"
  }
}



resource "kubernetes_namespace" "argocd_namespace" {
  metadata {
    labels = {
      environment = var.environment
    }
    name = "argocd"
  }
}

resource "helm_release" "argo" {
  name       = "argo-cd"
  repository = "https://argoproj.github.io/argo-helm"
  chart      = "argo-cd"
  namespace  = kubernetes_namespace.argocd_namespace.name
}
# resource "helm_release" "prometheus" {
#   name       = "prometheus"
#   repository = "https://prometheus-community.github.io/helm-charts"
#   chart      = "prometheus-community"
#   namespace  = var.namespace

# }
# resource "helm_release" "ingress" {
#   name       = "ingress-nginx"
#   repository = "https://kubernetes.github.io/ingress-nginx"
#   chart      = "ingress-nginx"
#   namespace  = var.namespace
# }