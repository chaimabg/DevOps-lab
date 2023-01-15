data "azurerm_resource_group" "dev" {
  name = var.resource_group_name
}
data "terraform_remote_state" "firststack" {
  backend = "azurerm"

  config = {
    resource_group_name  = "Devops"
    storage_account_name = "devopslab1"
    container_name       = "gl5-project"
    key                  = "first-stack.json"
  }
}

resource "azurerm_kubernetes_cluster" "cluster_aks" {
  name                = "devops-project"
  location            = data.terraform_remote_state.firststack.outputs.resource_group_location
  resource_group_name = data.terraform_remote_state.firststack.outputs.resource_group_name
  dns_prefix          = "appaks"
  sku_tier            = "Free"
  default_node_pool {
    vnet_subnet_id = data.terraform_remote_state.firststack.outputs.aks_subnet_id
    name           = "default"
    node_count     = 1
    vm_size        = "Standard_ds2_v2"
  }

  identity {
    type = "SystemAssigned"
  }

  tags = {
    Environment = "Development"
  }
}

