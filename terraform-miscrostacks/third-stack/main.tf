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

resource "helm_release" "graphana" {
  name       = "graphana"
  repository = "https://grafana.github.io/helm-charts"
  chart      = "grafana"
  namespace = var.namespace
}
resource "kubernetes_namespace" "ingress_namespace" {
  metadata {
    labels = {
      environment = var.environment
    }
    name = "ingress-basic"
  }
}

resource "helm_release" "argocd" {
  name       = "argo-cd"
  repository = "https://argoproj.github.io/argo-helm"
  chart      = "argo-cd"
  namespace  = kubernetes_namespace.argocd_namespace.id
}

resource "helm_release" Prometheus {
  name       = "prometheus"
  repository = "https://prometheus-community.github.io/helm-charts"
  chart      = "prometheus"
  namespace = var.namespace
  version    = "19.3.1"
  values = [
    file("${path.module}/helm-values/prometheus-values.yaml")
  ]
  
}

resource "helm_release" "datadog" {
  name       = "datadog"
  repository = "https://helm.datadoghq.com"
  chart      = "datadog"
  namespace  = var.namespace
  set_sensitive {
    name  = "datadog.apiKey"
    value = var.datadog_api_key
  }
  set {
    name  = "datadog.site"
    value = "datadoghq.com"
  }
  set {
    name  = "datadog.kubelet.enabled"
    value = true
  }
   set {
    name  = "datadog.logs.enabled"
    value = true
  }
   set {
    name  = "datadog.logs.containerCollectAll"
    value = true
  }
  set {
    name  = "datadog.otlp.receiver.protocols.grpc.enabled"
    value = true
  }
}

resource "helm_release" "ingress" {
  name       = "ingress-nginx"
  repository = "https://kubernetes.github.io/ingress-nginx"
  chart      = "ingress-nginx"
  namespace  = kubernetes_namespace.ingress_namespace.id
  set {
      name= "controller.service.annotations.service\\.beta\\.kubernetes\\.io/azure-load-balancer-health-probe-request-path"
      value= "/healthz"
    }       
}