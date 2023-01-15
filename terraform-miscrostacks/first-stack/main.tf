data "azurerm_resource_group" "example" {
  name     = var.resource_group_name
}
resource "azurerm_virtual_network" "vnet" {
  name                = "${var.name_prefix}-vnet"
  location            = data.azurerm_resource_group.example.location
  resource_group_name = data.azurerm_resource_group.example.name
  address_space       = ["10.1.0.0/16"]
}

resource "azurerm_subnet" "aks_subnet" {
  name                 = "aks_subnet"
  resource_group_name  = data.azurerm_resource_group.example.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.1.0.0/24"]
}

resource "azurerm_private_dns_zone" "dnsprivatezone" {
  name                = "privatelink.azure.com"
  resource_group_name = data.azurerm_resource_group.example.name
}


resource "azurerm_private_dns_zone_virtual_network_link" "dnszonelink" {
  name                  = "${var.name_prefix}-dnszonelink"
  resource_group_name   = data.azurerm_resource_group.example.name
  private_dns_zone_name = azurerm_private_dns_zone.dnsprivatezone.name
  virtual_network_id    = azurerm_virtual_network.vnet.id
}


