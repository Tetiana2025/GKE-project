resource "helm_release" "api" {
  name       = "api"
  chart      = "../helm/api"
  namespace  = "default"
  create_namespace = true
  timeout = 600
  values     = [file("../helm/api/values.yaml")]
}

resource "helm_release" "web" {
  name       = "web"
  chart      = "../helm/web"
  namespace  = "default"
  create_namespace = true
  timeout = 600
  values     = [file("../helm/web/values.yaml")]
}

resource "helm_release" "mysql" {
  name       = "mysql"
  chart      = "../helm/mysql"
  namespace  = "default"
  create_namespace = true
  timeout = 600
  values     = [file("../helm/mysql/values.yaml")]
}