terraform {
  required_providers {
    openstack = {
      source = "terraform-provider-openstack/openstack"
      version = "1.46.0"
    }
  }

  backend "swift" {
    container = "magnify-terraform"
    archive_container = "magnify-terraform-archive"
  }

  required_version = ">= 1.0.0"
}
