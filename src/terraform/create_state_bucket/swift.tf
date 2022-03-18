resource "openstack_objectstorage_container_v1" "backend" {
  name     = "magnify-terraform"
  provider = openstack.ovh

  # all objects should be deleted from the container so that the container
  # can be destroyed without error.
  force_destroy = true

  versioning {
    location = "magnify-terraform-archive"
    type     = "versions"
  }
}

resource "openstack_objectstorage_container_v1" "backend_archive" {
  name     = "magnify-terraform-archive"
  provider = openstack.ovh

  # all objects should be deleted from the container so that the container
  # can be destroyed without error.
  force_destroy = true
}
