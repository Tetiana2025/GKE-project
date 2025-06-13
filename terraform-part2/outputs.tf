output "api_service" {
  value = helm_release.api.name
}

output "web_service" {
  value = helm_release.web.name
}

output "mysql_service" {
  value = helm_release.mysql.name
}