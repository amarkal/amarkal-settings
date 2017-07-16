# amarkal-settings [![Build Status](https://scrutinizer-ci.com/g/askupasoftware/amarkal-settings/badges/build.png?b=master)](https://scrutinizer-ci.com/g/askupasoftware/amarkal-settings/build-status/master) [![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/askupasoftware/amarkal-settings/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/askupasoftware/amarkal-settings/?branch=master) [![Built with Grunt](https://cdn.gruntjs.com/builtwith.svg)](https://gruntjs.com/) [![Amarkal Powered](https://askupasoftware.com/amarkal-powered.svg)](https://products.askupasoftware.com/amarkal) [![License](https://img.shields.io/badge/license-GPL--3.0%2B-red.svg)](https://raw.githubusercontent.com/askupasoftware/amarkal-settings/master/LICENSE)
Add setting pages with [amarkal-ui](https://github.com/askupasoftware/amarkal-ui) components to your WordPress theme or plugin.

**Tested up to:** WordPress 4.7  
**Dependencies**: *[amarkal-core](https://github.com/askupasoftware/amarkal-core)*, *[amarkal-ui](https://github.com/askupasoftware/amarkal-ui)*

![amarkal-settings](https://askupasoftware.com/wp-content/uploads/2015/04/amarkal-settings.png)

## overview

**amarkal-settings** lets you create setting pages for your theme or plugin, based on [amarkal-ui](https://github.com/askupasoftware/amarkal-ui) components. Setting pages store data as options in the database, and use AJAX to store the data asynchronously to improve user experience.

## Installation

### Via Composer

If you are using the command line:  
```
$ composer require askupa-software/amarkal-settings:dev-master
```

Or simply add the following to your `composer.json` file:
```javascript
"require": {
     "askupa-software/amarkal-settings": "dev-master"
 }
```
And run the command 
```
$ composer install
```

This will install the package in the directory `vendors/askupa-software/amarkal-settings`.  
Now all you need to do is include the composer autoloader.

```php
require_once 'path/to/vendor/autoload.php';
```

### Manually

Download [amarkal-core](https://github.com/askupasoftware/amarkal-core/archive/master.zip), [amarkal-ui](https://github.com/askupasoftware/amarkal-ui/archive/master.zip) and [amarkal-settings](https://github.com/askupasoftware/amarkal-settings/archive/master.zip) from github and include them in your project.

```php
require_once 'path/to/amarkal-core/bootstrap.php';
require_once 'path/to/amarkal-ui/bootstrap.php';
require_once 'path/to/amarkal-settings/bootstrap.php';
```

## Adding Setting Pages

A Setting page is a graphical user interface (based on amarkal-ui) that provides a convenient way for your users to store and retrieve options for your theme/plugin. A setting page can be presented in the admin menu as a top level page, or as a child page.

### Adding a top-level settings page

To add a top level settings page, you must first add a top level page, and then add a child page with the same slug.

```php
amarkal_add_settings_page(array(
    'slug'         => 'my-settings-page',
    'menu_title'   => 'My Settings'
));

amarkal_add_settings_child_page(array(
    'parent_slug'  => 'my-settings-page', // Must be the same as the parent page's slug
    'slug'         => 'my-settings-page', // Must be the same as the parent page's slug
    'title'        => 'My Settings',
    'fields'       => array(
        array(
            'type'       => 'text',
            'default'    => 'Default text...',
            'title'      => 'My Text',
            'name'       => 'my-text'
        )
    )
));
```

### Adding a child settings page

You can add a child page to an existing admin page, or create your own top-level admin page (as seen above) and a child page to it. The following example shows how to add a settings page under the tools admin menu:

```php
amarkal_add_settings_child_page(array(
    'parent_slug'  => 'tools.php',
    'slug'         => 'toolsphp-child-page',
    'title'        => 'Tools.php Child Page',
    'menu_title'   => 'Tools.php Child Page',
    'fields'       => array(
        array(
            'type'       => 'text',
            'default'    => 'Default text...',
            'title'      => 'My Text',
            'name'       => 'my-text'
        )
    )
));
```

## Reference

### amarkal_add_settings_page
*Add a top-level admin page.*
```php
amarkal_add_settings_page( $args )
```
This function is used to create a top-level admin page. It calls `add_menu_page()` internally, with one exception - there is no callback function. The callback function is automatically overridden when `amarkal_add_settings_child_page` is called with the `parent_slug` argument set to the slug of the page created with this function.

**Parameters**  
* `$args` (*Array*)  The list of page arguments. Acceptable arguments are:
  * `slug` (*String*) The slug name to refer to this menu by (should be unique for this menu).
  * `title` (*String*) The text to be displayed in the title tags of the page when it is displayed.
  * `menu_title` (*String*) The text to be used for the menu.
  * `icon` (*String*) The URL to the icon to be used for this menu. 
    * Pass a base64-encoded SVG using a data URI, which will be colored to match the color scheme. This should begin with `data:image/svg+xml;base64,`. 
    * Pass the name of a Dashicons helper class to use a font icon, e.g. `dashicons-chart-pie`. 
    * Pass 'none' to leave div.wp-menu-image empty so an icon can be added via CSS.
  * `position` (*Integer*) The position in the menu order this one should appear.
  * `capability` (*String*) The capability required for this menu to be displayed to the user. Used to determine whether or not a page is included in the menu.


**Example Usage**
```php
amarkal_add_settings_page(array(
    'slug'         => 'my-settings-page',
    'title'        => 'My Settings',
    'menu_title'   => 'My Settings',
    'icon'         => 'dashicons-admin-tools',
    'position'     => 10,
    'capability'   => 'manage_options'
));
```

### amarkal_add_settings_child_page
*Add a child admin page.*
```php
amarkal_add_settings_child_page( $args )
```
This function is used to create a child settings page under an existing top-level admin page (either one of the core admin pages, or a page created with `amarkal_add_settings_page`). Child setting pages take a list of UI components, render them, and handles all the interaction with the WP database.

**Parameters**  
* `$args` (*Array*)  The list of page arguments. Acceptable arguments are:
  * `slug` (*String*) The slug name to refer to this menu by (should be unique for this menu).
  * `parent_slug` (*String*) The slug name for the parent menu (or the file name of a standard WordPress admin page).
  * `title` (*String*) The text to be displayed in the title area of the page.
  * `subtitle` (*String*) The text to be displayed under the title at the top part of the page.
  * `description` (*String*) The text/HTML to be displayed in a separate section to the right of the components.
  * `menu_title` (*String*) The text to be used for the menu.
  * `capability` (*String*) The capability required for this menu to be displayed to the user. Used to determine whether or not a page is included in the menu.
  * `footer_html` (*String*) Specifies the HTML to be printed at the footer of the  settings page.
  * `subfooter_html` (*String*) Specifies the HTML to be printed below footer of the  settings page.
  * `fields` (*Array*) Array of arrays. Specifies a list of [amarkal-ui](https://github.com/askupasoftware/amarkal-ui) component array arguments. Each array should have the original UI component arguments as specified in [amarkal-ui](https://github.com/askupasoftware/amarkal-ui), as well as the following arguments:
    * `type` (*String*) Specifies the type of the UI component. One of the core `amarkal-ui` components or a registered custom component.
    * `title` (*String*) Specifies the field's title.
    * `description` (*String*) Specifies a short description that will be printed below the field's title.
    * `help` (*String*) Specifies a longer description that will be shown when the user hovers over the question icon.

 > NOTE: Field names must be globally unique, as they are individually stored using `update_option()`.
 > Composite child components names are not required to be globally unique, but must be unique within the context of the parent element.

**Example Usage**
```php
amarkal_add_settings_child_page(array(
    'parent_slug'  => 'tools.php',
    'slug'         => 'toolsphp-child-page',
    'title'        => 'Tools.php Child Page',
    'menu_title'   => 'Child Settings Page',
    'fields'       => array(
        array(
            'type'       => 'text',
            'default'    => 'Default text...',
            'title'      => 'My Text',
            'name'       => 'my-text'
        )
    )
));
```

### amarkal_get_settings_value
*Get the value of the given field.*
```php
amarkal_get_settings_value( $field_name )
```
This function is used to retrieve the value of a given field. If no value exists in the database, the default value will be returned. This function makes a call to `get_option()` internally, providing the default value of the field as the second argument.

**Parameters**  
* `$field_name` (*String*)  The name of the field.

**Example Usage**
```php
$value = amarkal_get_settings_value('my-text');
```