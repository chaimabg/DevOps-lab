variable "resource_group_name" {
  type        = string
  default = "Devops" 
}
variable "namespace" {
  type        = string
  default = "default" 
}
variable "environment" {
  type        = string
  description = "Environment name"

  validation {
    condition     = contains(["prod", "dev"], var.environment)
    error_message = "Valid values for environment are 'prod' or 'dev'"
  }
}
variable "datadog_api_key" {
  type        = string 
}
variable "grafana_password" {
  type        = string
  default = "admin" 
}