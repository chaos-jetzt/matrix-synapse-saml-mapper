# Synapse SAML MXID Mapper

A Synapse plugin module which allows users to choose their username when they
first log in and map their SSO-account to a existing one.

This is a fork of https://github.com/matrix-org/matrix-synapse-saml-mozilla.

## Installation

This plugin can be installed via pip:

```
pip install git+https://github.com/chaos-jetzt/matrix-synapse-saml-mapper
```

### Config

Add the following in your Synapse config:

```yaml
   saml2_config:
     user_mapping_provider:
       module: "matrix_synapse_saml_mapper.SamlMappingProvider"
```

Also, under the HTTP client `listener`, configure an `additional_resource` as per
the below:

```yaml
listeners:
  - port: <port>
    type: http

    resources:
      - names: [client]

    additional_resources:
      "/_matrix/saml2/pick_username":
        module: "matrix_synapse_saml_mapper.pick_username_resource"
```

### Configuration Options

Synapse allows SAML mapping providers to specify custom configuration through the
`saml2_config.user_mapping_provider.config` option.

Currently the following options are supported:

 * `use_name_id_for_remote_uid`: if set to `False`, we will use the SAML
   attribute mapped to `uid` to identify the remote user instead of the `NameID`
   from the assertion. `True` by default.

 * `bad_domain_file`: should point a file containing a list of domains (one
   per line); users who have an email address on any of these domains will be
   blocked from registration.

 * `bad_domain_list`: an alternative to `bad_domain_file` allowing the list of
   bad domains to be specified inline in the config.

   If both `bad_domain_file` and `bad_domain_list` are specified, the two lists
   are merged.

### Linting

Code is linted with the `flake8` tool. Run `tox -e lint` to check for linting
errors in the codebase.
