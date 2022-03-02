terraform {
  required_providers {
    openstack = {
      source = "terraform-provider-openstack/openstack"
      version = "1.46.0"
    }
  }

  backend "swift" {
    container = "jitsi-magnify-terraform"
    archive_container = "jitsi-magnify-terraform-archive"
  }

  required_version = ">= 1.0.0"
}
