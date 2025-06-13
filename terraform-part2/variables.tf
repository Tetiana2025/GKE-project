variable "project_id" {}
variable "region" {}
variable "zone" {}
variable "kubeconfig_path" {
  type        = string
  description = "Path to the kubeconfig file"
}