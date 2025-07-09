terraform {
  required_version = ">= 1.0.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0" 
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.12"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.23"
    }
  }
}

provider "google" {
  credentials = file("gke-project-462023-cfd5c666fd8b.json")
  project     = var.project_id
  region      = var.region
  zone        = var.zone
}

resource "google_compute_network" "vpc" {
  name = var.vpc_name
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "private" {
  name          = "private-subnet"
  region        = var.region
  network       = google_compute_network.vpc.name
  ip_cidr_range = "10.0.0.0/16"
  private_ip_google_access = true
}

resource "google_compute_firewall" "allow_all" {
  name    = "allow-all"
  network = google_compute_network.vpc.name

  allow {
    protocol = "all"
  }

  source_ranges = ["0.0.0.0/0"]
}

resource "google_container_cluster" "k8s_cluster" {
  name     = "my-cluster"
  location = var.zone

  network    = google_compute_network.vpc.name
  subnetwork = google_compute_subnetwork.private.name

  remove_default_node_pool = true
  initial_node_count       = 1
  deletion_protection = false

  ip_allocation_policy {}
}

resource "google_container_node_pool" "primary_nodes" {
  name       = "primary-node-pool"
  location   = var.zone
  cluster    = google_container_cluster.k8s_cluster.name
  node_count = 2

  node_config {
    machine_type = "e2-medium"
    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform",
    ]
  }
}

resource "null_resource" "get_credentials" {
  provisioner "local-exec" {
    command = "gcloud container clusters get-credentials ${google_container_cluster.k8s_cluster.name} --zone ${var.zone} --project ${var.project_id}"
  }
  depends_on = [google_container_node_pool.primary_nodes]
}