terraform {
required_version = "~>1.3.4"
required_providers {
    azurerm= {
    source="hashicorp/azurerm"
    version="~>3.31.0"

    }

}
backend "azurerm" {
    resource_group_name  = "Devops"
    storage_account_name = "devopslab1"
    container_name       = "gl5-project"
    key                  = "first-stack.json"
  }
}
provider "azurerm" {
  features {}
}

