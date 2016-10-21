ansible-freeitaliawifi-login-page
=================================

[![Galaxy](http://img.shields.io/badge/galaxy-openwisp.freeitaliawifi--login--page-blue.svg?style=flat-square)](https://galaxy.ansible.com/openwisp/freeitaliawifi-login-page/)

This ansible role makes it easy to deploy and upgrade of the standard login page for Free ItaliaWifi federated networks.

By following the instructions in this repository you will be able to define
the parts that make your login page unique (logo, RSS feeds, colors, signup links, ecc.) while retaining
the main structure of the page intact in order to upgrade easily over time.

Tested on **debian** and **ubuntu**.

Usage (tutorial)
================

If you don't know how to use ansible, don't panic, this procedure will
guide you step by step.

If you already know how to use ansible, you can skip this section and jump straight to the
"Install this role" section.

First of all you need to understand two key concepts:

* for **"production server"** we mean a server (**not a laptop or a desktop computer!**) with public ipv4 / ipv6 which is used to host the login page
* for **"local machine"** we mean the host from which you launch ansible, eg: your own laptop

Ansible is a configuration management tool that works by entering production servers via SSH,
**so you need to install it and configure it on the machine where you launch the deployment** and
this machine must be able to SSH into the production server.

Install ansible
---------------

Install ansible **on your local machine** (not the production server!) if you haven't done already, there are various ways in
which you can do this, but we prefer to use the official python package manager, eg:

    sudo pip install ansible

If you don't have pip installed see [Installing pip](https://pip.pypa.io/en/stable/installing/)
on the pip documentation website.

[Installing ansible in other ways](http://docs.ansible.com/ansible/intro_installation.html#latest-release-via-yum)
is fine too, just make sure to install a version of the `2.0.x` series (which is the version with
which we have tested this playbook).

Install this role
-----------------

For the sake of simplicity, the easiest thing is to install this role **on your local machine**
via `ansible-galaxy` (which was installed when installing ansible), therefore run:

    sudo ansible-galaxy install openwisp.freeitaliawifi-login-page

Choose a working directory
--------------------------

Choose a working directory **on your local machine** where to put the configuration of *freeitaliawifi-login-page*.

This will be useful when you will need to upgrade the login page.

Eg:

    mkdir ~/wifi-login-playbook
    cd ~/wifi-login-playbook

Putting this working directory under version control is also a very good idea.

Create inventory file
---------------------

The inventory file is where group of servers are defined. In our simple case we can
get away with defining a group in which we will put just one server.

Create a new file `hosts` **on your local machine** with the following contents:

    [myserver]
    login.mywifiservice.com

Substitute `login.mywifiservice.com` with your hostname (ip addresses are allowed as well).

Create playbook file
--------------------

Create a new playbook file `playbook.yml` **on your local machine** with the following contents:

```yaml
- hosts: myserver
  roles:
    - openwisp.freeitaliawifi-login-page
  vars:
    fiw_path: /var/www/freeitaliawifi-login-page
```

This setting will deploy a very basic version of the login page with the minimum feature set activated.

The default path of the deployment is ``/var/www/freeitaliawifi-login-page``

Later we will explain how to enable all the supported features.

At this stage your directory layout should look like the following:

```
.
├── hosts
└── site.yml
```

Run the playbook
----------------

Now is time to **deploy the login page to the production server**.

Run the playbook **on your local machine** with:

    ansible-playbook -i hosts playbook.yml -u <user> -k --ask-sudo-pass

Substitute `<user>` with your user.

The `--ask-sudo-pass` argument will need the `sshpass` program.

You can remove `-k` and `--ask-sudo-pass` if your public SSH key is installed on the server.

When the playbook is done running the login page will be built and deployed at the location specified
in ``fiw_path``, which by default is ``/var/www/freeitaliawifi-login-page``.

Upgrading
=========

Upgrading is as simple as running the playbook again **on your local machine**.

It's even possible to set up the playbook to run periodically.

Role variables
==============

This role has many variables values that can be changed to best suit
your needs.

Below are listed all the variables you can customize.

```yaml
- hosts: yourhost
  roles:
  # you can add other roles here
    - openwisp.freeitaliawifi-login-page
  vars:
    # location of the deployment
    fiw_path: /var/www/freeitaliawifi-login-page
    # theme (more on how to create your theme in the next section)
    fiw_theme: default
    # <title> value
    fiw_title: WiFi Login
    # links in main menu, set as empty list to disable (eg: "fiw_menu: []")
    fiw_menu:
      - text_it: Free ItaliaWifi
        text_en: Free ItaliaWifi
        href: http://www.freeitaliawifi.it
      - text_it: OpenWISP
        text_en: OpenWISP
        href: http://openwisp.org
    # form action, if you don't set this variable your login form will probably not work
    fiw_form_action: null
    # if set to true, a second logo (images/logo2.png) will be displayed just before the login form
    fiw_logo2: false
    # signup link
    fiw_signup: null
    # reset password link
    fiw_reset_password: null
    # manage account link
    fiw_manage_account: null
    # pfsense zone used in "fiw_hidden_fields"
    fiw_pfsense_zone: null
    # redirurl parameter used in "fiw_hidden_fields"
    fiw_redirurl: http://openwisp.org
    # hidden input fields, you can change this list to suit your captive portal software
    fiw_hidden_fields:
      - name: zone
        value: "{{ fiw_pfsense_zone}}"
      - name: accept
        value: accept
      - name: redirurl
        value: "{{ fiw_redirurl}}"
    # set this to false to hide the side box with email, phone number and social network links
    fiw_contact_box: true
    # contact links shown on the side
    fiw_contact_links:
      - label: E-mail
        text: wifi@wifiservice.example
        href: mailto:wifi@wifi@wifiservice.example
      - label: Helpdesk
        text: 06 00.00.0000
        href: tel:+3906000000
    # URL of facebook page, set to null to hide
    fiw_facebook: https://www.facebook.com/OpenWISP/
    # URL of twitter profile, set to null to hide
    fiw_twitter: https://twitter.com/openwisp
    # RSS feeds are fetched from this URL
    fiw_feedr_host: feedr.publicwifi.it
    # RSS feed loaded on the side, disabled by default
    fiw_news_rss: null
    # RSS feed loaded on the bottom, disabled by default
    fiw_service_rss: null
    # links to related pages, displaying logos
    fiw_related_links:
      - href: http://www.freeitaliawifi.it/
        src: images/fiw.png
        alt: FreeItaliaWifi
      - href: http://www.openwisp.org/
        src: images/openwisp.jpg
        alt: OpenWISP
      - href: http://www.cineca.it/
        src: images/cineca.jpg
        alt: Cineca
    # link to privacy URL
    fiw_privacy: "#"
    # link to EULA/terms of service
    fiw_eula: "#"
    # list of Free ItaliaWifi networks
    fiw_realm_json: https://opendata.publicwifi.it/freeitaliawifi/realms.json
    # default realm, must match one of the realms present in "fiw_realm_json"
    fiw_default_realm:
        label: WiFi esempio
        value: wifiesempio.it
```

Creating your own theme
-----------------------

In order to create your theme, you must add the custom files to your inventory.

For example, the following paragraphs illustrate to create a theme named ``mycustomtheme``.

**Step 1**: set ``fiw_theme`` to ``mycustomtheme``.

**Step 2**: create a directory layout like the one shown below.

```
.
├── hosts
├── site.yml
└── themes
    └── mycustomtheme
        ├── css
        │   └── theme.css
        └── images
            ├── logo1.png
            └── logo2.png
```

``theme.css`` contains your CSS customizations, ``logo1.png`` contains your main logo while ``logo2.png``
is an optional logo that is displayed before the login form only if the variable ``fiw_logo2``
is set to ``true``.

Any additional image used in elsewhere (eg: ``fiw_related_links``) can be stored in the themes dir.

Walled garden gotchas
---------------------

Some domains must be added in the walled garden of your captive portal software, otherwise users
won't be able to follow the links on your page.

Pay special attention to the domains used in the following variables:

* ``fiw_menu``
* ``fiw_signup``
* ``fiw_reset_password``
* ``fiw_manage_account``
* ``fiw_related_links``
* ``fiw_privacy``
* ``fiw_eula``
* ``fiw_realm_json``
