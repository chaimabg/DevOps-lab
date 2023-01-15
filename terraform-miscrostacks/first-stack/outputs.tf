output "aks_subnet_id" {
  value = azurerm_subnet.aks_subnet.id
}

output "resource_group_name" {
  value = data.azurerm_resource_group.example.name
}

output "resource_group_location" {
  value = data.azurerm_resource_group.example.location
}
